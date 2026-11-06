// Decides how the assistant replies: exact skill lookup and follow-ups first,
// because they need no model, then search over the pre-written answers.

import { entryById, fallback, type Entry, type Link } from "../content/knowledge.ts";
import { profile } from "../content/profile.ts";
import { search, type Index, type StoredVector } from "./retrieval.ts";
import { skillAnswer } from "./skills.ts";

export type Reply = {
  /** Entry answered, or "skill" / "fallback" / "end-of-topic". */
  id: string;
  text: string;
  links: Link[];
  note?: string;
  suggestions: string[];
};

/** What the assistant remembers from earlier in this chat. */
export type ChatContext = { lastEntryId: string | null; seen: string[] };

const FOLLOW_UP =
  /^(tell me more|more|more (details?|info|information)|go on|continue|keep going|and\??|elaborate|can you elaborate|expand on that|what else|anything else|ok(ay)?,? (and|what) else)\W*$/i;

const META_ENTRIES = new Set(["greeting", "thanks", "personal", "about-bot"]);

const EMAIL_LINK: Link = {
  label: profile.contact.email,
  href: `mailto:${profile.contact.email}`,
};

function nextSuggestions(ids: string[], seen: string[]): string[] {
  const unseen = ids.filter((id) => !seen.includes(id));
  return (unseen.length > 0 ? unseen : ids).slice(0, 3);
}

export function replyFromEntry(entry: Entry, context: ChatContext, note?: string): Reply {
  return {
    id: entry.id,
    text: entry.answer,
    links: [...(entry.links ?? []), ...(entry.section ? [entry.section] : [])],
    note,
    suggestions: nextSuggestions(entry.related ?? [], [...context.seen, entry.id]),
  };
}

/** Replies that don't need the search model. Returns null if search is needed. */
export function instantReply(question: string, context: ChatContext): Reply | null {
  if (FOLLOW_UP.test(question.trim())) {
    const last = context.lastEntryId ? entryById(context.lastEntryId) : undefined;
    const nextId = last?.related?.find((id) => !context.seen.includes(id));
    const next = nextId ? entryById(nextId) : undefined;
    if (next) return replyFromEntry(next, context);
    return {
      id: "end-of-topic",
      text: last
        ? "That's everything I have on this topic. Here are some other things you can ask about."
        : "Happy to go into detail. What would you like to know about Soham?",
      links: [],
      suggestions: nextSuggestions(["intro", "projects", "skills", "education"], context.seen),
    };
  }

  const answer = skillAnswer(question);
  if (answer) {
    return {
      id: "skill",
      text: answer,
      links: [{ label: "See Skills", href: "#skills" }, ...(/isn't|aren't/.test(answer) ? [EMAIL_LINK] : [])],
      note: "Checked directly against Soham's resume",
      suggestions: nextSuggestions(["skills", "ml-experience", "projects"], context.seen),
    };
  }
  return null;
}

export function searchReply(
  question: string,
  index: Index,
  context: ChatContext,
  queryVector?: number[] | null,
  vectors?: StoredVector[] | null,
): Reply {
  const result = search(question, index, queryVector, vectors);
  if (result.match) {
    return replyFromEntry(
      result.match.entry,
      context,
      `Closest question: “${result.match.matched}” · ${result.mode} match ${result.match.score.toFixed(2)}`,
    );
  }

  // Offer the nearest topics, so an unusual wording still gets somewhere useful.
  const closest = result.ranked
    .filter((match) => match.score > 0.2 && !META_ENTRIES.has(match.entry.id))
    .slice(0, 3)
    .map((match) => match.entry.id);
  return {
    id: "fallback",
    text: fallback.answer,
    links: fallback.links ?? [],
    suggestions: closest.length > 0 ? closest : (fallback.related ?? []),
  };
}
