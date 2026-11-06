import { Chat } from "../components/Chat";
import { profile } from "../content/profile.ts";

const { contact } = profile;

function SectionHead({
  label,
  first,
  second,
}: {
  label: string;
  first: string;
  second: string;
}) {
  return (
    <header className="section-head">
      <p className="label">{label}</p>
      <h2>
        {first} <span>{second}</span>
        <em>.</em>
      </h2>
    </header>
  );
}

export default function Home() {
  return (
    <>
      <nav className="nav" aria-label="Sections">
        <a className="nav-name" href="#top">
          SB
        </a>
        <div className="nav-links">
          <a href="#about">About</a>
          <a href="#experience">Experience</a>
          <a href="#work">Work</a>
          <a href="#skills">Skills</a>
          <a href="#journey">Journey</a>
          <a href="#contact">Contact</a>
        </div>
        <a className="nav-cta" href="#ask">
          Ask the bot
        </a>
      </nav>

      <main id="top">
        <section className="hero">
          <p className="pill">
            <i aria-hidden="true" /> MS CS at USC · Data Science Intern at H2O.ai
          </p>
          <h1>
            <span>Soham</span> <span className="hero-last">Banerjee</span>
          </h1>
          <div className="hero-row">
            <p className="hero-sub">{profile.summary}</p>
            <div className="hero-actions">
              <a className="button button-primary" href="#ask">
                Ask about me
              </a>
              <a className="button" href="#work">
                See my work
              </a>
            </div>
          </div>
        </section>

        <div className="marquee" aria-label={`Tools: ${profile.heroTags.join(", ")}`} role="img">
          <div className="marquee-track" aria-hidden="true">
            {[0, 1].map((copy) => (
              <div key={copy} className="marquee-copy">
                {profile.heroTags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            ))}
          </div>
        </div>

        <section id="ask" className="section ask">
          <div className="ask-intro">
            <SectionHead label="001 — Recruiter assistant" first="Ask" second="about me" />
            <p>
              Short on time? Ask about my experience, projects or skills, and get an answer straight
              from my resume.
            </p>
          </div>
          <Chat />
        </section>

        <section id="about" className="section reveal">
          <p className="label">002 — About</p>
          <p className="statement">
            Models, pipelines, and the <span>production systems</span> around them.
          </p>
          <div className="about-grid">
            <div className="about-text">
              {profile.about.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <div className="terminal">
              <p className="terminal-bar" aria-hidden="true">
                <i />
                <i />
                <i />
              </p>
              <p className="terminal-prompt">
                soham@portfolio <b>~ $</b> whoami
              </p>
              <dl>
                {profile.facts.map((fact) => (
                  <div key={fact.key}>
                    <dt>{fact.key}</dt>
                    <dd>{fact.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
          <dl className="stats">
            {profile.stats.map((stat) => (
              <div key={stat.label}>
                <dt>{stat.label}</dt>
                <dd>{stat.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section id="experience" className="section">
          <SectionHead label="003 — Experience" first="Where I've" second="worked" />
          <div className="stack-list">
            {profile.experience.map((job) => (
              <article key={job.org} className="card job reveal">
                <header>
                  <div>
                    <h3>{job.role}</h3>
                    <p className="job-org">{job.org}</p>
                  </div>
                  <p className="job-meta">
                    {job.dates}
                    <br />
                    {job.place}
                  </p>
                </header>
                <div className="job-body">
                  <dl className="metrics">
                    {job.metrics.map((metric) => (
                      <div key={metric.label}>
                        <dt>{metric.label}</dt>
                        <dd>{metric.value}</dd>
                      </div>
                    ))}
                  </dl>
                  <div>
                    <ul className="points">
                      {job.points.map((point) => (
                        <li key={point}>{point}</li>
                      ))}
                    </ul>
                    <ul className="tags">
                      {job.stack.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="work" className="section">
          <SectionHead label="004 — Selected work" first="What I've" second="built" />
          <div className="work-grid">
            {profile.projects.map((project, i) => (
              <article key={project.name} className="card project reveal">
                <span className="ghost" aria-hidden="true">
                  0{i + 1}
                </span>
                <h3>{project.name}</h3>
                <ul className="points">
                  {project.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
                <ul className="tags">
                  {project.stack.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <a className="project-link" href={project.url}>
                  View on GitHub →
                </a>
              </article>
            ))}
          </div>
        </section>

        <section id="skills" className="section">
          <SectionHead label="005 — Skills" first="Technical" second="toolkit" />
          <div className="skills-grid">
            {profile.skills.map((skill) => (
              <div key={skill.group} className="card reveal">
                <h3>{skill.group}</h3>
                <ul className="tags">
                  {skill.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section id="journey" className="section">
          <SectionHead label="006 — Journey" first="How I got" second="here" />
          <ol className="timeline">
            {profile.journey.map((step) => (
              <li key={step.title} className="reveal">
                <p className="timeline-when">{step.when}</p>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.detail}</p>
                  {step.note && <p className="timeline-note">Coursework: {step.note}</p>}
                </div>
              </li>
            ))}
          </ol>
        </section>
      </main>

      <footer id="contact" className="footer">
        <p className="label">007 — Contact</p>
        <h2>
          Let&apos;s <span>talk</span>
          <em>.</em>
        </h2>
        <a className="footer-email" href={`mailto:${contact.email}`}>
          {contact.email}
        </a>
        <p className="footer-links">
          <a href={contact.linkedin}>LinkedIn</a>
          <a href={contact.github}>GitHub</a>
        </p>
      </footer>
    </>
  );
}
