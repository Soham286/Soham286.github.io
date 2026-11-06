"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { entryById, knowledge, starters, type Link } from "../content/knowledge.ts";
import { embedQuery, loadSemantic } from "../lib/embedder.ts";
import {
  instantReply,
  replyFromEntry,
  searchReply,
  type ChatContext,
  type Reply,
} from "../lib/respond.ts";
import { buildIndex, search, type StoredVector } from "../lib/retrieval.ts";

type Message =
  | { role: "user"; text: string }
  | { role: "bot"; text: string; links?: Link[]; note?: string };

type SearchStatus = "idle" | "loading" | "semantic" | "keyword";

const GREETING: Message = {
  role: "bot",
  text: "Hi! I answer questions about Soham using Soham's resume and projects. Ask about experience, projects, or a specific tool like Python or Docker.",
};

const NEW_CHAT: ChatContext = { lastEntryId: null, seen: [] };

const MAX_LENGTH = 300;
/** How long a typed question waits for the model before using keyword search. */
const MODEL_WAIT_MS = 8000;
const EXTRA_WAIT_MS = 20000;

const index = buildIndex(knowledge);

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T | null> {
  return Promise.race([
    promise,
    new Promise<null>((resolve) => setTimeout(() => resolve(null), ms)),
  ]);
}

export function Chat() {
  const [messages, setMessages] = useState<Message[]>([GREETING]);
  const [suggestions, setSuggestions] = useState<string[]>(starters);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<SearchStatus>("idle");
  const [percent, setPercent] = useState<number | null>(null);
  const chatRef = useRef<HTMLElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const contextRef = useRef<ChatContext>(NEW_CHAT);
  const startedRef = useRef(false);

  function prepareSemantic() {
    if (startedRef.current) return;
    startedRef.current = true;
    setStatus("loading");
    loadSemantic(setPercent).then((vectors) => setStatus(vectors ? "semantic" : "keyword"));
  }

  // With a mouse (usually a computer), load once the chat is on screen so the first
  // typed question gets the best answer. On phones, wait until the visitor taps the box.
  useEffect(() => {
    const chat = chatRef.current;
    if (!chat || !window.matchMedia("(pointer: fine)").matches) return;
    const observer = new IntersectionObserver((seen) => {
      if (seen.some((item) => item.isIntersecting)) {
        observer.disconnect();
        prepareSemantic();
      }
    });
    observer.observe(chat);
    return () => observer.disconnect();
  }, []);

  // Show the latest question at the top, so long answers read from their first line.
  useEffect(() => {
    const log = logRef.current;
    const questions = log?.querySelectorAll(".msg-user");
    const latest = questions?.[questions.length - 1];
    if (log && latest) {
      log.scrollTop += latest.getBoundingClientRect().top - log.getBoundingClientRect().top - 12;
    }
  }, [messages, busy]);

  function show(reply: Reply) {
    setMessages((current) => [
      ...current,
      { role: "bot", text: reply.text, links: reply.links, note: reply.note },
    ]);
    setSuggestions(reply.suggestions);
    if (entryById(reply.id)) {
      contextRef.current = {
        lastEntryId: reply.id,
        seen: [...contextRef.current.seen, reply.id],
      };
    }
  }

  function askSuggested(id: string) {
    const entry = entryById(id);
    if (!entry || busy) return;
    setMessages((current) => [...current, { role: "user", text: entry.questions[0] }]);
    show(replyFromEntry(entry, contextRef.current));
  }

  function clearChat() {
    setMessages([GREETING]);
    setSuggestions(starters);
    contextRef.current = NEW_CHAT;
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    const question = input.trim().slice(0, MAX_LENGTH);
    if (!question || busy) return;

    setInput("");
    setMessages((current) => [...current, { role: "user", text: question }]);

    const instant = instantReply(question, contextRef.current);
    if (instant) {
      show(instant);
      return;
    }

    prepareSemantic();
    setBusy(true);
    let vectors: StoredVector[] | null = null;
    let queryVector: number[] | null = null;
    try {
      vectors = await withTimeout(loadSemantic(), MODEL_WAIT_MS);
      // On a slow first download, keep waiting if keywords alone can't answer yet.
      if (!vectors && !search(question, index).match) {
        vectors = await withTimeout(loadSemantic(), EXTRA_WAIT_MS);
      }
      if (vectors) queryVector = await withTimeout(embedQuery(question), MODEL_WAIT_MS);
    } catch {
      // Keyword search below still answers.
    }
    show(searchReply(question, index, contextRef.current, queryVector, vectors));
    setBusy(false);
  }

  const statusLabel = {
    idle: "Search model loads when needed",
    loading: percent === null ? "Loading search model…" : `Loading search model ${percent}%`,
    semantic: "Semantic search ready",
    keyword: "Using keyword search",
  }[status];

  return (
    <section className="chat" aria-label="Ask about Soham" ref={chatRef}>
      <header className="chat-head">
        <span className="chat-title">Ask about Soham</span>
        <span className="chat-status" data-status={status}>
          {statusLabel}
        </span>
        {messages.length > 1 && (
          <button type="button" className="chat-clear" onClick={clearChat}>
            Clear
          </button>
        )}
      </header>

      <div className="chat-log" ref={logRef} role="log" aria-live="polite" tabIndex={0}>
        {messages.map((message, i) =>
          message.role === "user" ? (
            <p key={i} className="msg msg-user">
              {message.text}
            </p>
          ) : (
            <div key={i} className="msg msg-bot">
              <p>{message.text}</p>
              {message.links && message.links.length > 0 && (
                <p className="msg-links">
                  {message.links.map((link) => (
                    <a key={link.href} href={link.href}>
                      {link.label}
                    </a>
                  ))}
                </p>
              )}
              {message.note && <p className="msg-note">{message.note}</p>}
            </div>
          ),
        )}
        {busy && (
          <p className="msg msg-bot msg-thinking">
            Searching
            <i aria-hidden="true" />
            <i aria-hidden="true" />
            <i aria-hidden="true" />
          </p>
        )}
      </div>

      {suggestions.length > 0 && (
        <div className="chips">
          {suggestions.map((id) => (
            <button key={id} type="button" className="chip" onClick={() => askSuggested(id)}>
              {entryById(id)?.questions[0]}
            </button>
          ))}
        </div>
      )}

      <form className="chat-form" onSubmit={submit}>
        <label className="sr-only" htmlFor="chat-input">
          Your question
        </label>
        <input
          id="chat-input"
          value={input}
          maxLength={MAX_LENGTH}
          autoComplete="off"
          placeholder="e.g. Has Soham worked with Spark?"
          onChange={(event) => setInput(event.target.value)}
          onFocus={prepareSemantic}
        />
        <button type="submit" disabled={busy || !input.trim()}>
          Ask
        </button>
      </form>

      <p className="chat-disclosure">
        Answers come from Soham&apos;s resume and projects, and aren&apos;t generated by AI. A small model in your
        browser finds the closest one, so your questions stay on your device.
      </p>
    </section>
  );
}
