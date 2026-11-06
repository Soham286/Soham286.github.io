// What the chatbot can say. Each answer is written by hand from the resume, and the
// bot only ever returns these answers, so it cannot invent anything about Soham.
//
// After changing any `questions` list, run `npm run embed` to refresh the search index.

import { profile } from "./profile.ts";

export type Link = { label: string; href: string };

export type Entry = {
  id: string;
  /** Different ways a recruiter might ask this. These are what the search matches. */
  questions: string[];
  answer: string;
  links?: Link[];
  /** Follow-up suggestions, by entry id. */
  related?: string[];
  /** Extra words for keyword matching, such as synonyms. No need to re-embed after editing. */
  keywords?: string[];
  /** Where this answer appears on the page. */
  section?: Link;
};

const { email, linkedin, github } = profile.contact;

const emailLink: Link = { label: email, href: `mailto:${email}` };
const linkedinLink: Link = { label: "LinkedIn", href: linkedin };
const githubLink: Link = { label: "GitHub", href: github };

const KEYWORDS: Record<string, string[]> = {
  "why-hire": ["hire", "candidate", "strong", "strength", "fit", "team"],
  impact: ["numbers", "metrics", "highlights", "career", "results"],
  h2o: ["employed", "currently", "now", "intern", "doing"],
  rag: ["genai", "gen", "generative", "retrieval", "llm", "llms", "shipped", "product"],
  "ml-experience": ["vision", "deep", "learning", "computer", "image", "recognition"],
  statistics: ["stats", "statistic", "statistical"],
  "usc-research": ["publish", "academic", "research", "paper", "calibration"],
  accenture: ["healthcare", "backend", "industry", "api", "apis"],
  "experience-years": ["senior", "seniority", "years"],
  projects: ["built", "outside", "side", "portfolio"],
  "pl-transfer": ["football", "soccer", "transfer", "valuation", "player", "sports", "regression"],
  "dsa-agent": ["leetcode", "dsa", "striver", "automation", "agent", "dashboard"],
  cloud: ["database", "databases", "cloud"],
  education: ["graduation", "graduate", "university", "school", "college", "study", "degree", "gpa"],
  contact: ["reach", "mobile", "phone", "email", "call", "touch", "number"],
  availability: ["relocate", "relocating", "start", "remote", "hiring", "roles"],
  "salary-visa": ["compensation", "pay", "salary", "sponsorship", "h1b", "visa", "authorization"],
  personal: ["fun", "hobby", "hobbies", "age", "old", "pets"],
  "about-bot": ["bot", "human", "real", "person", "machine", "chatbot"],
  greeting: ["hey", "hi", "hello"],
  thanks: ["thanks", "thank", "cheers", "bye"],
};

const SECTIONS: Record<string, Link> = {
  impact: { label: "See the numbers", href: "#about" },
  h2o: { label: "See Experience", href: "#experience" },
  "usc-research": { label: "See Experience", href: "#experience" },
  accenture: { label: "See Experience", href: "#experience" },
  "experience-years": { label: "See the timeline", href: "#journey" },
  projects: { label: "See Work", href: "#work" },
  pipeline: { label: "See Work", href: "#work" },
  "pl-transfer": { label: "See Work", href: "#work" },
  "dsa-agent": { label: "See Work", href: "#work" },
  "doc-analyzer": { label: "See Work", href: "#work" },
  skills: { label: "See Skills", href: "#skills" },
  languages: { label: "See Skills", href: "#skills" },
  cloud: { label: "See Skills", href: "#skills" },
  education: { label: "See the timeline", href: "#journey" },
};

const entries: Entry[] = [
  {
    id: "intro",
    questions: [
      "Who is Soham?",
      "Tell me about Soham",
      "Give me a short summary of Soham's background",
      "What is Soham's elevator pitch?",
      "What does Soham do?",
      "Introduce this candidate",
      "What is this person's background?",
    ],
    answer:
      "Soham Banerjee is an MS Computer Science student at USC (expected May 2027) and a Data Science Intern at H2O.ai. Soham is also a Research Assistant at USC, and before that spent over two and a half years as a Software Engineer at Accenture building healthcare data APIs.",
    related: ["why-hire", "h2o", "rag"],
  },
  {
    id: "why-hire",
    questions: [
      "Why should we hire Soham?",
      "What makes Soham a good candidate?",
      "What are Soham's biggest strengths?",
      "What sets Soham apart from other applicants?",
      "What makes Soham stand out?",
      "Why is Soham a good fit for a machine learning role?",
    ],
    answer:
      "Soham combines applied ML with production engineering. On the ML side: RAG-based test triage at H2O.ai that cut manual review by 80% and LLM calls by 90%, plus research on model calibration and uncertainty at USC. On the engineering side: 15+ Java REST APIs for 25+ healthcare providers at Accenture, which cut data-processing time by 40%.",
    related: ["h2o", "accenture", "impact"],
  },
  {
    id: "impact",
    questions: [
      "What are Soham's biggest achievements?",
      "What measurable impact has Soham had?",
      "What results has Soham delivered?",
      "What is Soham most proud of?",
      "What metrics or numbers show Soham's past results?",
    ],
    answer:
      "Some measured results from Soham's resume: 80% less manual review and 90% fewer LLM calls at H2O.ai, 40% less data-processing time and 30% more throughput at Accenture, and a pipeline project handling 10M+ daily records with 45% higher throughput and 35% lower latency.",
    related: ["h2o", "accenture", "pipeline"],
  },
  {
    id: "h2o",
    questions: [
      "What did Soham do at H2O.ai?",
      "Tell me about Soham's internship",
      "What is Soham's current job?",
      "Where does Soham work now?",
      "What is Soham working on as a data science intern?",
    ],
    answer:
      "Since June 2026, Soham has been a Data Science Intern at H2O.ai in Mountain View. The work covers productionizing anomaly detection (benchmarking TabH2O, building customer-facing APIs), maintaining multilingual PII-redaction and OCR pipelines for h2oGPTe, building RAG-based triage for 573+ tests, and running image-recognition and detection workflows with Hydrogen Torch and Enterprise LLM Studio.",
    related: ["rag", "ml-experience", "usc-research"],
  },
  {
    id: "rag",
    questions: [
      "What's Soham's RAG experience?",
      "Has Soham worked with LLMs?",
      "Does Soham have generative AI experience?",
      "What has Soham built with embeddings and vector search?",
      "Does Soham know retrieval augmented generation?",
      "Has Soham shipped GenAI or AI applications?",
    ],
    answer:
      "Soham has used RAG both at work and in projects. At H2O.ai, Soham engineered RAG-based triage for 573+ tests, reducing manual review by 80% and LLM calls by 90%. Soham also built an academic document analyzer using Sentence-BERT and FAISS over 5,000+ chunks, with cited answers, and compared retrieval strategies using RAGAS metrics.",
    links: [
      {
        label: "Document analyzer on GitHub",
        href: "https://github.com/Soham286/academic-document-analyzer",
      },
    ],
    related: ["doc-analyzer", "h2o", "ml-experience"],
  },
  {
    id: "ml-experience",
    questions: [
      "What machine learning experience does Soham have?",
      "Has Soham trained deep learning models?",
      "What data science work has Soham done?",
      "Does Soham have experience with predictive modeling?",
      "Which ML frameworks does Soham use?",
      "Does Soham know PyTorch, TensorFlow or scikit-learn?",
      "Does Soham have computer vision experience?",
    ],
    answer:
      "Soham has done applied ML at H2O.ai (anomaly detection, image recognition and detection) and research at USC (a MobileNetV2 classifier, statistical analysis of CNN embeddings, model calibration). Tools include scikit-learn, TensorFlow, PyTorch, pandas, NumPy and OpenCV.",
    related: ["usc-research", "h2o", "statistics"],
  },
  {
    id: "statistics",
    questions: [
      "How strong is Soham in statistics?",
      "Does Soham have experience with hypothesis testing and experimental design?",
      "Does Soham know A/B testing or statistical analysis?",
      "What statistical methods does Soham know?",
    ],
    answer:
      "Soham's skills include statistical analysis, hypothesis testing, experimental design, model calibration, PCA and Gaussian mixture models. In USC research, Soham tested class-separability hypotheses on CNN embeddings using PCA, Wasserstein distance, GMMs and covariance analysis. A/B testing isn't mentioned specifically on the resume, so it's best to ask Soham directly about that.",
    links: [emailLink],
    related: ["usc-research", "ml-experience"],
  },
  {
    id: "usc-research",
    questions: [
      "What research has Soham done?",
      "Tell me about Soham's research assistant work at USC",
      "Does Soham have research experience?",
      "Has Soham worked on model calibration and uncertainty?",
      "What was the MobileNetV2 project?",
    ],
    answer:
      "Since January 2026, Soham has been a Research Assistant at USC. Soham trained a MobileNetV2 classifier (80.9% test and 80.7% balanced accuracy), tested class separability on 1,280-D CNN embeddings (85.7% GMM accuracy), and studied calibration and uncertainty with Monte Carlo Dropout, an ECE of 0.097, and occlusion sensitivity. The spatial analysis found localized separation up to 6× the global distance.",
    related: ["ml-experience", "statistics", "education"],
  },
  {
    id: "accenture",
    questions: [
      "What did Soham do at Accenture?",
      "Tell me about Soham's software engineering experience",
      "Has Soham worked in healthcare?",
      "Does Soham have backend or Java experience?",
      "Has Soham built REST APIs?",
      "What was Soham's previous job?",
    ],
    answer:
      "Soham was a Software Engineer at Accenture in Kolkata from December 2022 to August 2025, working on healthcare data. Soham delivered 15+ Java REST APIs for 25+ healthcare providers (40% less data-processing time), built Java and SQL validation services across those integrations, and optimized message flows with Mirth Connect and FHIR (30% more throughput).",
    related: ["experience-years", "cloud", "impact"],
  },
  {
    id: "experience-years",
    questions: [
      "How many years of experience does Soham have?",
      "How long has Soham been working?",
      "How much full-time industry experience does Soham have?",
      "Can you walk me through Soham's work history?",
    ],
    answer:
      "Soham has about two years and eight months of full-time experience as a Software Engineer at Accenture (December 2022 to August 2025). Since then, Soham has added research at USC (from January 2026) and a data science internship at H2O.ai (from June 2026).",
    related: ["accenture", "h2o", "usc-research"],
  },
  {
    id: "projects",
    questions: [
      "What projects has Soham built?",
      "Show me Soham's portfolio projects",
      "What side projects does Soham have?",
      "Can I see some of Soham's work?",
    ],
    answer:
      "Soham's main projects are a football player valuation model (XGBoost with SHAP explanations), an e-commerce data pipeline on Databricks handling 10M+ daily records, an explainable RAG-based academic document analyzer, and an automated DSA practice agent. All four are on GitHub.",
    links: [
      {
        label: "Player valuation",
        href: "https://github.com/Soham286/pl-transfer-value",
      },
      {
        label: "Data pipeline",
        href: "https://github.com/Soham286/ecommerce-medallion-pipeline",
      },
      {
        label: "Document analyzer",
        href: "https://github.com/Soham286/academic-document-analyzer",
      },
      {
        label: "DSA agent",
        href: "https://github.com/Soham286/leetcode-daily-agent",
      },
      githubLink,
    ],
    related: ["pl-transfer", "pipeline", "doc-analyzer", "dsa-agent"],
  },
  {
    id: "pl-transfer",
    questions: [
      "Tell me about the football player valuation project",
      "What is PL Transfer Value?",
      "What is Soham's best machine learning project?",
      "Has Soham built a regression model with explainability?",
      "Has Soham deployed an ML model in an app?",
    ],
    answer:
      "PL Transfer Value estimates football players' market values. Soham trained a tuned XGBoost model on 64,622 player-season records using leakage-aware, time-based evaluation, reaching R² 0.80 and a €2.76M mean absolute error on a held-out 2025 season. A Streamlit app offers a catalog of 4,977 real players, custom-player valuations and SHAP explanations.",
    links: [
      {
        label: "View on GitHub",
        href: "https://github.com/Soham286/pl-transfer-value",
      },
    ],
    related: ["ml-experience", "projects", "dsa-agent"],
  },
  {
    id: "dsa-agent",
    questions: [
      "Tell me about the LeetCode agent",
      "What is the DSA Mastery Agent?",
      "Has Soham built an automation or agent project?",
      "Has Soham automated workflows on a schedule?",
      "Does Soham practice coding interview problems?",
    ],
    answer:
      "Soham's DSA Mastery Agent runs on GitHub Actions. It emails daily coding problems, detects accepted LeetCode submissions, tracks revision progress, sends warnings and weekly reports, and feeds a live Streamlit dashboard for topic performance and deadline pace.",
    links: [
      {
        label: "View on GitHub",
        href: "https://github.com/Soham286/leetcode-daily-agent",
      },
      {
        label: "Live dashboard",
        href: "https://soham-dsa-mastery.streamlit.app/",
      },
    ],
    related: ["projects", "pl-transfer"],
  },
  {
    id: "pipeline",
    questions: [
      "Tell me about the e-commerce data pipeline",
      "What is Soham's medallion architecture project?",
      "Does Soham have data engineering experience?",
      "Has Soham worked with big data, Spark or Databricks?",
      "Has Soham built ETL pipelines with Airflow?",
    ],
    answer:
      "Soham built a Databricks Medallion pipeline processing 10M+ daily records across Bronze, Silver and Gold layers. Automating the PySpark workflows with Airflow and Azure Data Lake increased throughput by 45%, reduced latency by 35% and improved reporting efficiency by 50%.",
    links: [
      {
        label: "View on GitHub",
        href: "https://github.com/Soham286/ecommerce-medallion-pipeline",
      },
    ],
    related: ["cloud", "projects", "skills"],
  },
  {
    id: "doc-analyzer",
    questions: [
      "Tell me about the academic document analyzer",
      "What is Soham's NLP project?",
      "Does Soham have natural language processing experience?",
      "Has Soham used FAISS or Sentence-BERT?",
      "How did Soham evaluate retrieval quality?",
    ],
    answer:
      "Soham's Explainable NLP-Powered Academic Document Analyzer uses Sentence-BERT and FAISS over 5,000+ document chunks to generate context-grounded answers with source citations. Soham compared semantic filtering, section-aware retrieval and MMR using RAGAS metrics to improve retrieval quality.",
    links: [
      {
        label: "View on GitHub",
        href: "https://github.com/Soham286/academic-document-analyzer",
      },
    ],
    related: ["rag", "projects"],
  },
  {
    id: "skills",
    questions: [
      "What are Soham's technical skills?",
      "What technologies does Soham know?",
      "What is Soham's tech stack?",
      "Give me a list of Soham's tools",
    ],
    answer:
      "Soham's skills cover Python, Java, SQL, C++ and JavaScript; ML with scikit-learn, TensorFlow and PyTorch; data systems like Spark, Databricks, Delta Lake and Airflow; APIs with FastAPI, Flask and Spring Boot; cloud on AWS and Azure; and AI retrieval with LLMs, RAG, FAISS and OCR. The full list is in the Skills section of this page.",
    related: ["languages", "cloud", "ml-experience"],
  },
  {
    id: "languages",
    questions: [
      "What programming languages does Soham know?",
      "Does Soham know Python?",
      "Can Soham code in Java or C++?",
      "Does Soham know SQL and JavaScript?",
    ],
    answer:
      "Soham's programming languages are Python, Java, SQL, C++ and JavaScript. Python is used across the ML work at H2O.ai and USC, and Java and SQL were the core of the Accenture role.",
    related: ["skills", "accenture"],
  },
  {
    id: "cloud",
    questions: [
      "What cloud platforms has Soham used?",
      "Does Soham have experience with AWS or Azure?",
      "What databases does Soham know?",
      "Does Soham have production or deployment experience?",
    ],
    answer:
      "Soham's resume lists AWS, Azure and Azure Data Lake for cloud; PostgreSQL, MySQL and SQLite for databases; and Linux, Git, JUnit, Allure and Jira as tools. Azure was part of the Accenture work, and Azure Data Lake was used in the e-commerce pipeline project.",
    related: ["accenture", "pipeline"],
  },
  {
    id: "education",
    questions: [
      "What is Soham's education?",
      "Where did Soham go to school?",
      "What degree does Soham have?",
      "What is Soham's GPA?",
      "When does Soham graduate?",
      "What courses has Soham taken?",
      "Which university did Soham attend?",
      "What did Soham study in college?",
      "What is Soham studying at USC?",
    ],
    answer:
      "Soham is pursuing an MS in Computer Science at USC (GPA 3.675/4.00, expected May 2027), with coursework in Machine Learning, Statistics, Information Retrieval, Database Systems and Analysis of Algorithms. Soham also holds a B.Tech in Electronics and Communication Engineering from the Institute of Engineering and Management, Kolkata (GPA 9.01/10, 2022).",
    related: ["usc-research", "availability"],
  },
  {
    id: "contact",
    questions: [
      "How can I contact Soham?",
      "What is Soham's email?",
      "What is Soham's phone number?",
      "How do I get in touch to schedule an interview?",
      "Where can I find Soham's LinkedIn and GitHub?",
      "Can I get Soham's resume?",
    ],
    answer:
      "The best way to reach Soham is by email. Soham is also on LinkedIn and GitHub. A phone number or the full resume can be requested by email.",
    links: [emailLink, linkedinLink, githubLink],
    related: ["availability", "why-hire"],
  },
  {
    id: "availability",
    questions: [
      "When is Soham available to start?",
      "Is Soham looking for a job?",
      "Is Soham open to full-time roles or internships?",
      "What kind of roles is Soham looking for?",
      "Is Soham willing to relocate or work remotely?",
    ],
    answer:
      "I don't have details on Soham's availability, target roles or location preferences, so it's best to ask directly. What I can tell you is that Soham's MS at USC is expected to finish in May 2027.",
    links: [emailLink],
    related: ["contact", "education"],
  },
  {
    id: "salary-visa",
    questions: [
      "What are Soham's salary expectations?",
      "How much does Soham want to be paid?",
      "Does Soham need visa sponsorship?",
      "Is Soham authorized to work in the US?",
      "What is Soham's work authorization status?",
    ],
    answer:
      "I don't have information on salary expectations or work authorization, and I'd rather not guess. Please ask Soham directly.",
    links: [emailLink],
    related: ["contact", "availability"],
  },
  {
    id: "personal",
    questions: [
      "How old is Soham?",
      "What are Soham's hobbies and interests outside work?",
      "What does Soham enjoy doing for fun?",
      "What is Soham's favorite food or movie?",
      "Does Soham have a family, kids or pets?",
      "What is Soham's home address?",
      "What is Soham like as a person?",
    ],
    answer:
      "That's not something I have information on, since I only know Soham's resume and projects. Soham would be happy to hear from you directly.",
    links: [emailLink],
    related: ["intro", "projects"],
  },
  {
    id: "about-bot",
    questions: [
      "How does this chatbot work?",
      "Are you an AI?",
      "Are you Soham?",
      "What model powers this assistant?",
      "Who built this chatbot?",
      "Am I talking to a bot or a human?",
    ],
    answer:
      "I'm a small assistant on Soham's portfolio, not Soham. I don't generate text. A sentence-embedding model (all-MiniLM-L6-v2) runs in your browser, compares your question to questions I have answers for, and returns the closest match. All my answers were written from Soham's resume and projects, and your questions are never sent to a server.",
    related: ["rag", "intro"],
  },
  {
    id: "greeting",
    questions: ["Hi", "Hello there", "Hey, how are you?", "Good morning"],
    answer:
      "Hi! I can answer questions about Soham's experience, projects, skills and education. What would you like to know?",
    related: ["intro", "why-hire", "projects"],
  },
  {
    id: "thanks",
    questions: ["Thanks", "Thank you, that was helpful", "Great, thanks for your help", "Goodbye"],
    answer: "You're welcome! If you'd like to talk to Soham directly, email is the best way.",
    links: [emailLink],
  },
];

export const knowledge: Entry[] = entries.map((entry) => ({
  ...entry,
  keywords: KEYWORDS[entry.id],
  section: SECTIONS[entry.id],
}));

/** Shown when no answer is a confident match. */
export const fallback: Entry = {
  id: "fallback",
  questions: [],
  answer:
    "I'm not sure about that, since I only answer from Soham's resume and projects. One of the questions below may help, or you can ask Soham directly.",
  links: [emailLink],
  related: ["intro", "projects", "skills"],
};

export const starters = ["h2o", "rag", "why-hire", "projects"];

export function entryById(id: string): Entry | undefined {
  return knowledge.find((entry) => entry.id === id);
}
