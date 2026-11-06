// Answers "does Soham know X?" exactly, from the resume, instead of by similarity.
// Similarity search could otherwise answer a Docker question with a loosely related
// answer that implies experience Soham's resume doesn't claim.

import { profile } from "../content/profile.ts";

/** Named tools on the resume, with other ways people write them. */
const KNOWN: Record<string, string[]> = {
  Python: ["python"],
  Java: ["java"],
  SQL: ["sql"],
  "C++": ["c++", "cpp"],
  JavaScript: ["javascript"],
  "scikit-learn": ["scikit-learn", "scikit learn", "sklearn"],
  TensorFlow: ["tensorflow"],
  PyTorch: ["pytorch", "torch"],
  pandas: ["pandas"],
  NumPy: ["numpy"],
  OpenCV: ["opencv"],
  Spark: ["apache spark", "pyspark", "spark"],
  Hadoop: ["hadoop"],
  Databricks: ["databricks"],
  "Delta Lake": ["delta lake"],
  Airflow: ["airflow"],
  FastAPI: ["fastapi"],
  Flask: ["flask"],
  "Spring Boot": ["spring boot", "spring"],
  PostgreSQL: ["postgresql", "postgres"],
  MySQL: ["mysql"],
  SQLite: ["sqlite"],
  AWS: ["aws", "amazon web services"],
  Azure: ["microsoft azure", "azure"],
  "Azure Data Lake": ["azure data lake"],
  Linux: ["linux"],
  Git: ["git"],
  JUnit: ["junit"],
  Jira: ["jira"],
  FAISS: ["faiss"],
  "Sentence-BERT": ["sentence-bert", "sentence bert", "sbert"],
  OCR: ["ocr"],
  FHIR: ["fhir"],
};

/** Common tools recruiters ask about that are not on the resume. */
const NOT_LISTED: Record<string, string[]> = {
  Docker: ["docker"],
  Kubernetes: ["kubernetes", "k8s"],
  React: ["react", "reactjs"],
  Angular: ["angular"],
  Vue: ["vue"],
  "Node.js": ["node.js", "nodejs", "node"],
  TypeScript: ["typescript"],
  Go: ["golang"],
  Rust: ["rust"],
  Scala: ["scala"],
  Kotlin: ["kotlin"],
  Swift: ["swift"],
  PHP: ["php"],
  Ruby: ["ruby"],
  MATLAB: ["matlab"],
  Terraform: ["terraform"],
  Kafka: ["kafka"],
  Snowflake: ["snowflake"],
  Redshift: ["redshift"],
  BigQuery: ["bigquery"],
  dbt: ["dbt"],
  Tableau: ["tableau"],
  "Power BI": ["power bi", "powerbi"],
  Looker: ["looker"],
  Excel: ["excel"],
  "Google Cloud": ["google cloud", "gcp"],
  MongoDB: ["mongodb", "mongo"],
  Redis: ["redis"],
  Cassandra: ["cassandra"],
  Elasticsearch: ["elasticsearch"],
  MLflow: ["mlflow"],
  SageMaker: ["sagemaker"],
  LangChain: ["langchain"],
  LlamaIndex: ["llamaindex"],
  "Hugging Face": ["hugging face", "huggingface"],
  XGBoost: ["xgboost"],
  Keras: ["keras"],
  JAX: ["jax"],
  Jenkins: ["jenkins"],
  GraphQL: ["graphql"],
};

const ASKS_ABOUT_SKILL =
  /\b(know|knows|use|uses|used|using|experience|experienced|familiar|proficient|skilled|expert|good (at|with)|work(ed)? with|comfortable|code in|coded in)\b/i;

function pattern(alias: string): RegExp {
  const escaped = alias.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/ /g, "\\s+");
  return new RegExp(`(?<![a-z0-9+#.-])${escaped}(?![a-z0-9+#-])`, "i");
}

type Alias = { skill: string; alias: string; known: boolean };

// Longest first, so "azure data lake" isn't also counted as "azure".
const ALIASES: Alias[] = [
  ...Object.entries(KNOWN).flatMap(([skill, aliases]) =>
    aliases.map((alias) => ({ skill, alias, known: true })),
  ),
  ...Object.entries(NOT_LISTED).flatMap(([skill, aliases]) =>
    aliases.map((alias) => ({ skill, alias, known: false })),
  ),
].sort((a, b) => b.alias.length - a.alias.length);

export function findSkills(question: string): { known: string[]; notListed: string[] } {
  let remaining = question;
  const known = new Set<string>();
  const notListed = new Set<string>();
  for (const { skill, alias, known: isKnown } of ALIASES) {
    const regex = pattern(alias);
    if (regex.test(remaining)) {
      (isKnown ? known : notListed).add(skill);
      remaining = remaining.replace(regex, " ");
    }
  }
  return { known: [...known], notListed: [...notListed] };
}

/** Where on the resume a skill was actually used. */
export function whereUsed(skill: string): string[] {
  const regexes = (KNOWN[skill] ?? [skill]).map(pattern);
  const appears = (texts: string[]) =>
    texts.some((text) => regexes.some((regex) => regex.test(text)));

  const jobs = profile.experience
    .filter((job) => appears([...job.stack, ...job.points]))
    .map((job) => (job.org.includes("Southern California") ? "in research at USC" : `at ${job.org}`));
  const projects = profile.projects
    .filter((project) => appears([...project.stack, ...project.points]))
    .map((project) => `in ${project.short}`);
  return [...jobs, ...projects];
}

function joinList(items: string[]): string {
  if (items.length < 2) return items.join("");
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

/** Returns an exact answer if this is a question about specific tools, otherwise null. */
export function skillAnswer(question: string): string | null {
  const { known, notListed } = findSkills(question);
  if (known.length === 0 && notListed.length === 0) return null;

  const isShort = question.trim().split(/\s+/).length <= 2;
  if (!isShort && !ASKS_ABOUT_SKILL.test(question)) return null;

  const sentences = known.map((skill) => {
    const places = whereUsed(skill);
    return places.length > 0
      ? `Yes, Soham's resume shows ${skill} ${joinList(places)}.`
      : `Yes, ${skill} is listed in Soham's technical skills.`;
  });

  if (notListed.length > 0) {
    const names = joinList(notListed);
    const verb = notListed.length > 1 ? "aren't" : "isn't";
    sentences.push(
      `${names} ${verb} listed on Soham's resume, so I can't confirm that experience. It's best to ask Soham directly.`,
    );
  }
  return sentences.join(" ");
}
