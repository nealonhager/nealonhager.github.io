import { useEffect, useState } from "react";

type Theme = "light" | "dark";

function getInitialTheme(): Theme {
    if (typeof window === "undefined") return "light";
    const stored = localStorage.getItem("theme") as Theme | null;
    if (stored === "light" || stored === "dark") return stored;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function ExternalLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <a href={href} target="_blank" rel="noreferrer">
            {children}
            <span className="arrow" aria-hidden="true"> ↗</span>
        </a>
    );
}

function ThemeToggle({ theme, onToggle }: { theme: Theme; onToggle: () => void }) {
    return (
        <button
            className="theme-toggle"
            onClick={onToggle}
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
            {theme === "light" ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
            ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="5" />
                    <line x1="12" y1="1" x2="12" y2="3" />
                    <line x1="12" y1="21" x2="12" y2="23" />
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                    <line x1="1" y1="12" x2="3" y2="12" />
                    <line x1="21" y1="12" x2="23" y2="12" />
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
            )}
        </button>
    );
}

export function App() {
    const [theme, setTheme] = useState<Theme>(getInitialTheme);

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = () => setTheme((t) => (t === "light" ? "dark" : "light"));

    return (
        <main className="page">
            <ThemeToggle theme={theme} onToggle={toggleTheme} />
            <div className="content">
                <header className="header">
                    <img
                        className="avatar"
                        src="/images/avatar.jpeg"
                        alt="Nealon Hager"
                        width={88}
                        height={88}
                    />
                    <div className="header-text">
                        <h1>Nealon Hager</h1>
                        <nav className="social-links" aria-label="Social links">
                            <ExternalLink href="https://github.com/nealonhager">GitHub</ExternalLink>
                            <ExternalLink href="https://www.linkedin.com/in/nealonhager">LinkedIn</ExternalLink>
                        </nav>
                    </div>
                </header>

                <hr className="divider" />

                <section className="section">
                    <div className="section-label">NOW</div>
                    <div className="section-content">
                        <div className="role">
                            <div className="role-title">
                                Software Engineer, <ExternalLink href="https://www.ambrygen.com"><span className="accent">Ambry Genetics</span></ExternalLink>
                            </div>
                            <div className="role-detail">
                                Building software • Bend, Oregon
                            </div>
                        </div>
                        <div className="role">
                            <div className="role-title">Side Projects</div>
                            <div className="role-detail">
                                Voice-driven assistants • LLM interaction modalities
                            </div>
                        </div>
                    </div>
                </section>

                <section className="section">
                    <div className="section-label">PREV</div>
                    <div className="section-content">
                        <div className="role">
                            <div className="role-title">
                                <ExternalLink href="https://www.boisestate.edu">Boise State University</ExternalLink>
                            </div>
                            <div className="role-detail">
                                B.S. Computer Science
                            </div>
                        </div>
                    </div>
                </section>

                <section className="section">
                    <div className="section-label">INTERESTS</div>
                    <div className="section-content">
                        <div className="role">
                            <div className="role-title">Tech</div>
                            <div className="role-detail">
                                Python • React • Machine Learning • Automation • AI Tools
                            </div>
                        </div>
                        <div className="role">
                            <div className="role-title">Outside</div>
                            <div className="role-detail">
                                Rock climbing • Biking • Running • Movies &amp; TV
                            </div>
                        </div>
                    </div>
                </section>

                <figure className="photo">
                    <picture>
                        <source media="(max-width: 480px)" srcSet="/images/me-400w.jpeg" />
                        <source media="(max-width: 768px)" srcSet="/images/me-576w.jpeg" />
                        <source media="(max-width: 1024px)" srcSet="/images/me-800w.jpeg" />
                        <img
                            src="/images/me-1152w.jpeg"
                            width={1152}
                            height={864}
                            alt="Rock climbing at Smith Rock"
                        />
                    </picture>
                    <figcaption>Smith Rock, Oregon</figcaption>
                </figure>
            </div>
        </main>
    );
}
