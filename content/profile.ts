// Single source of truth for the page. Everything here comes from Soham's resume.
// The phone number is deliberately left out because this site is public.

export const profile = {
  name: "Soham Banerjee",
  tagline: "MS Computer Science at USC. Data Science Intern at H2O.ai.",
  summary:
    "I build machine learning and retrieval systems, and the data pipelines and APIs they run on.",
  contact: {
    email: "sohambanerjee835@gmail.com",
    linkedin: "https://www.linkedin.com/in/soham-banerjee-019596203/",
    github: "https://github.com/Soham286",
  },
  heroTags: [
    "Python",
    "PyTorch",
    "TensorFlow",
    "RAG",
    "FAISS",
    "Spark",
    "Databricks",
    "Airflow",
    "FastAPI",
    "SQL",
    "AWS",
    "Azure",
  ],
  about: [
    "I'm a Computer Science master's student at USC and a Data Science Intern at H2O.ai, working on anomaly detection, document intelligence and RAG-based test triage.",
    "Before USC, I spent over two and a half years as a Software Engineer at Accenture, building Java APIs and validation services for healthcare data across 25+ providers.",
    "My research at USC looks at classifier calibration, uncertainty, and what CNN embeddings reveal about class separation.",
  ],
  facts: [
    { key: "LOCATION", value: "Los Angeles, CA" },
    { key: "NOW", value: "Data Science Intern, H2O.ai" },
    { key: "RESEARCH", value: "Research Assistant, USC" },
    { key: "EDUCATION", value: "MS Computer Science, USC" },
    { key: "GRAD", value: "May 2027 (Expected)" },
    { key: "ML STACK", value: "Python • PyTorch • TensorFlow • scikit-learn" },
    { key: "DATA STACK", value: "Spark • Databricks • Airflow • FAISS" },
  ],
  stats: [
    { value: "80%", label: "less manual test review at H2O.ai" },
    { value: "90%", label: "fewer LLM calls at H2O.ai" },
    { value: "10M+", label: "daily records in my data pipeline" },
    { value: "25+", label: "healthcare providers served at Accenture" },
  ],
  journey: [
    {
      when: "2018 – 2022",
      title: "B.Tech in Electronics and Communication Engineering",
      detail: "Institute of Engineering and Management, Kolkata. GPA 9.01/10.",
      note: "Data Structures, Algorithms, Machine Learning, Statistics, Applied Linear Algebra, Internet of Things",
    },
    {
      when: "Dec 2022",
      title: "Software Engineer at Accenture",
      detail: "Built Java REST APIs and validation services for healthcare data in Kolkata, through August 2025.",
    },
    {
      when: "Aug 2025",
      title: "MS in Computer Science at USC",
      detail: "University of Southern California, Los Angeles. GPA 3.675/4.00.",
      note: "Machine Learning, Statistics, Information Retrieval, Database Systems, Analysis of Algorithms",
    },
    {
      when: "Jan 2026",
      title: "Research Assistant at USC",
      detail: "Began research on classifier training, statistical error analysis and model calibration.",
    },
    {
      when: "Jun 2026",
      title: "Data Science Intern at H2O.ai",
      detail: "Joined H2O.ai in Mountain View, working on predictive modeling, document intelligence and RAG.",
    },
    {
      when: "May 2027",
      title: "Expected graduation",
      detail: "Completing the MS in Computer Science at USC.",
    },
  ],
  experience: [
    {
      role: "Data Science Intern",
      org: "H2O.ai",
      place: "Mountain View, CA",
      dates: "June 2026 – Present",
      stack: ["Python", "TabH2O", "h2oGPTe", "Predictive Modeling", "APIs"],
      metrics: [
        { value: "80%", label: "less manual test review" },
        { value: "90%", label: "fewer LLM calls" },
        { value: "573+", label: "tests triaged with RAG" },
      ],
      points: [
        "Productionized anomaly-detection capabilities by benchmarking TabH2O across diverse datasets, extending agent skill files, and implementing customer-facing APIs.",
        "Strengthened secure document ingestion by maintaining multilingual PII-redaction and OCR pipelines supporting h2oGPTe modeling workflows.",
        "Engineered RAG-based triage for 573+ tests by analyzing failure patterns with engineering teams, reducing manual review by 80% and LLM calls by 90%.",
        "Operationalized reproducible image-recognition and detection workflows using Hydrogen Torch and Enterprise LLM Studio for customer modeling projects.",
      ],
    },
    {
      role: "Research Assistant",
      org: "University of Southern California",
      place: "Los Angeles, CA",
      dates: "January 2026 – Present",
      stack: ["Python", "TensorFlow", "scikit-learn", "Statistical Modeling"],
      metrics: [
        { value: "80.9%", label: "test accuracy" },
        { value: "85.7%", label: "GMM accuracy" },
        { value: "0.097", label: "expected calibration error" },
      ],
      points: [
        "Trained and evaluated a MobileNetV2 classifier using augmentation, class weighting, and staged fine-tuning, achieving 80.9% test and 80.7% balanced accuracy.",
        "Tested class-separability hypotheses on 1,280-D CNN embeddings using PCA, Wasserstein distance, GMMs, and covariance analysis, achieving 85.7% GMM accuracy.",
        "Applied Monte Carlo Dropout, ECE of 0.097, occlusion sensitivity, and 7×7 spatial analysis to identify localized separation up to 6× the global distance.",
      ],
    },
    {
      role: "Software Engineer",
      org: "Accenture",
      place: "Kolkata, India",
      dates: "December 2022 – August 2025",
      stack: ["Java", "SQL", "REST APIs", "Microsoft Azure", "FHIR"],
      metrics: [
        { value: "40%", label: "less data-processing time" },
        { value: "30%", label: "more throughput" },
        { value: "25+", label: "healthcare providers" },
      ],
      points: [
        "Collaborated with engineering and healthcare teams to implement Java and SQL validation services across 25+ provider integrations, improving data reliability.",
        "Designed and delivered 15+ Java REST APIs for 25+ healthcare providers, reducing data-processing time by 40%.",
        "Optimized Java message flows using Mirth Connect and FHIR standards, increasing production data-processing throughput by 30%.",
      ],
    },
  ],
  projects: [
    {
      name: "E-Commerce Data Pipeline with Medallion Architecture",
      short: "the e-commerce data pipeline project",
      stack: ["Databricks", "PySpark", "Delta Lake", "Airflow"],
      url: "https://github.com/Soham286/ecommerce-medallion-pipeline",
      points: [
        "Built a Databricks Medallion pipeline processing 10M+ daily records across Bronze, Silver, and Gold layers.",
        "Automated PySpark workflows using Airflow and Azure Data Lake, increasing throughput by 45%, reducing latency by 35%, and improving reporting efficiency by 50%.",
      ],
    },
    {
      name: "Explainable NLP-Powered Academic Document Analyzer",
      short: "the academic document analyzer project",
      stack: ["Python", "RAG", "Sentence-BERT", "FAISS"],
      url: "https://github.com/Soham286/academic-document-analyzer",
      points: [
        "Built a Sentence-BERT and FAISS pipeline over 5,000+ document chunks, generating context-grounded answers with source citations.",
        "Compared semantic filtering, section-aware retrieval, and MMR using RAGAS metrics to improve retrieval quality.",
      ],
    },
  ],
  skills: [
    {
      group: "Programming Languages",
      items: ["Python", "Java", "SQL", "C++", "JavaScript"],
    },
    {
      group: "Statistical Modeling and Machine Learning",
      items: [
        "Predictive Modeling",
        "Classification",
        "Deep Learning",
        "Data Mining",
        "Statistical Analysis",
        "Experimental Design",
        "Hypothesis Testing",
        "Model Calibration",
        "PCA",
        "Gaussian Mixture Models",
      ],
    },
    {
      group: "Machine Learning Tools",
      items: ["scikit-learn", "TensorFlow", "PyTorch", "pandas", "NumPy", "OpenCV"],
    },
    {
      group: "Large-Scale Data and Production Systems",
      items: [
        "Apache Spark",
        "PySpark",
        "Hadoop",
        "Databricks",
        "Delta Lake",
        "Airflow",
        "FastAPI",
        "Flask",
        "Spring Boot",
        "REST APIs",
      ],
    },
    {
      group: "Databases, Cloud and Tools",
      items: [
        "PostgreSQL",
        "MySQL",
        "SQLite",
        "AWS",
        "Azure",
        "Azure Data Lake",
        "Linux",
        "Git",
        "JUnit",
        "Allure",
        "Jira",
      ],
    },
    {
      group: "AI and Information Retrieval",
      items: ["LLMs", "RAG", "Embeddings", "Vector Search", "Sentence-BERT", "FAISS", "OCR"],
    },
  ],
  education: [
    {
      school: "University of Southern California",
      place: "Los Angeles, CA",
      degree: "Master of Science in Computer Science",
      gpa: "3.675/4.00",
      dates: "August 2025 – May 2027 (Expected)",
      coursework:
        "Machine Learning, Statistics, Information Retrieval, Database Systems, Analysis of Algorithms",
    },
    {
      school: "Institute of Engineering and Management",
      place: "Kolkata, India",
      degree: "Bachelor of Technology in Electronics and Communication Engineering",
      gpa: "9.01/10",
      dates: "August 2018 – June 2022",
      coursework:
        "Data Structures, Algorithms, Machine Learning, Statistics, Applied Linear Algebra, Internet of Things",
    },
  ],
};
