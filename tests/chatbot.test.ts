import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { entryById, fallback, knowledge, starters } from "../content/knowledge.ts";
import { instantReply, searchReply } from "../lib/respond.ts";
import { buildIndex, search, type StoredVector } from "../lib/retrieval.ts";
import { findSkills, skillAnswer, whereUsed } from "../lib/skills.ts";

const index = buildIndex(knowledge);

describe("knowledge base", () => {
  it("only links to entries that exist", () => {
    for (const entry of [...knowledge, fallback]) {
      for (const id of entry.related ?? []) expect(entryById(id), `${entry.id} -> ${id}`).toBeDefined();
    }
    for (const id of starters) expect(entryById(id)).toBeDefined();
  });

  it("has unique ids", () => {
    const ids = knowledge.map((entry) => entry.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("has a search index in sync with the questions (run `npm run embed` if this fails)", () => {
    const { vectors } = JSON.parse(readFileSync("public/embeddings.json", "utf8")) as {
      vectors: StoredVector[];
    };
    const stored = vectors.map((vector) => `${vector.id}|${vector.text}`);
    const current = knowledge.flatMap((entry) =>
      entry.questions.map((question) => `${entry.id}|${question}`),
    );
    expect(stored).toEqual(current);
  });
});

describe("keyword search (used when the model can't load)", () => {
  it.each([
    ["What did Soham do at H2O.ai?", "h2o"],
    ["what was soham's role at accenture", "accenture"],
    ["What's Soham's phone number", "contact"],
    ["Has Soham used FAISS?", "doc-analyzer"],
  ])("answers %s", (question, id) => {
    const result = search(question, index);
    expect(result.mode).toBe("keyword");
    expect(result.match?.entry.id).toBe(id);
  });

  it.each(["what is the capital of australia", "write me a poem about the ocean", "???", ""])(
    "declines %j",
    (question) => {
      expect(search(question, index).match).toBeNull();
    },
  );
});

describe("skill lookup", () => {
  it("confirms a resume skill and says where it was used", () => {
    const answer = skillAnswer("Does Soham know Python?");
    expect(answer).toContain("shows Python");
    expect(answer).toContain("H2O.ai");
    expect(answer).not.toContain("Accenture");
  });

  it("doesn't claim skills that aren't on the resume", () => {
    const answer = skillAnswer("Does Soham have Docker experience?");
    expect(answer).toContain("Docker isn't listed");
    expect(answer).not.toContain("Yes");
  });

  it("handles a mix of listed and unlisted skills", () => {
    const answer = skillAnswer("Has Soham used Spark and Kafka?");
    expect(answer).toContain("shows Spark");
    expect(answer).toContain("the e-commerce data pipeline project");
    expect(answer).toContain("Kafka isn't listed");
  });

  it("doesn't confuse similar names", () => {
    expect(findSkills("does soham know javascript").known).toEqual(["JavaScript"]);
    expect(findSkills("does soham know java").known).toEqual(["Java"]);
    expect(findSkills("experience with mysql").known).toEqual(["MySQL"]);
    expect(findSkills("azure data lake experience").known).toEqual(["Azure Data Lake"]);
  });

  it("only uses resume skill names that really are in the profile", () => {
    const python = whereUsed("Python");
    expect(python).toEqual(expect.arrayContaining(["at H2O.ai", "in research at USC"]));
    expect(whereUsed("Hadoop")).toEqual([]);
  });

  it("leaves questions that aren't about using a tool to search", () => {
    expect(skillAnswer("Tell me about the Databricks project")).toBeNull();
    expect(skillAnswer("What did Soham do at Accenture?")).toBeNull();
  });
});

describe("conversation", () => {
  const afterH2o = { lastEntryId: "h2o", seen: ["h2o"] };

  it("follows up on the last topic", () => {
    expect(instantReply("tell me more", afterH2o)?.id).toBe("rag");
    expect(instantReply("what else?", { lastEntryId: "h2o", seen: ["h2o", "rag"] })?.id).toBe(
      "ml-experience",
    );
  });

  it("says when a topic is finished", () => {
    const seen = ["h2o", "rag", "ml-experience", "usc-research"];
    expect(instantReply("more", { lastEntryId: "h2o", seen })?.id).toBe("end-of-topic");
  });

  it("handles a follow-up with nothing before it", () => {
    expect(instantReply("tell me more", { lastEntryId: null, seen: [] })?.id).toBe("end-of-topic");
  });

  it("doesn't treat a full question as a follow-up", () => {
    expect(instantReply("tell me more about Accenture", afterH2o)).toBeNull();
  });

  it("suggests the nearest topics when it can't answer", () => {
    const reply = searchReply("what about research papers", index, { lastEntryId: null, seen: [] });
    expect(reply.suggestions.length).toBeGreaterThan(0);
  });

  it("links answers to their section of the page", () => {
    const reply = searchReply("what was soham's role at accenture", index, {
      lastEntryId: null,
      seen: [],
    });
    expect(reply.links.map((link) => link.href)).toContain("#experience");
  });
});

describe("semantic search", () => {
  const vectors: StoredVector[] = [
    { id: "h2o", text: "A", vector: [1, 0] },
    { id: "rag", text: "B", vector: [0, 1] },
  ];

  it("picks the closest stored question", () => {
    const result = search("zzz", index, [0, 1], vectors);
    expect(result.mode).toBe("semantic");
    expect(result.match?.entry.id).toBe("rag");
    expect(result.match?.matched).toBe("B");
  });

  it("declines when nothing is close", () => {
    expect(search("zzz", index, [0.1, 0.1], vectors).match).toBeNull();
  });

  it("falls back to keywords with no query vector", () => {
    expect(search("accenture", index, null, vectors).mode).toBe("keyword");
  });
});
