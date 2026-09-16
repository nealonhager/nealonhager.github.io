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
                                Staff Software Engineer, <span className="accent">Revalia Bio</span>
                            </div>
                            <div className="role-detail">
                                Jun 2026 – Present
                            </div>
                        </div>
                    </div>
                </section>

                <section className="section">
                    <div className="section-label">PREV</div>
                    <div className="section-content">
                        <div className="role">
                            <div className="role-title">
                                Software Engineer II, Ambry Genetics
                            </div>
                            <div className="role-detail">
                                Oct 2023 – Jun 2026 · Tech lead on report generation · Full stack · Python lab automation
                            </div>
                        </div>
                        <div className="role">
                            <div className="role-title">
                                Software Engineer I, Ambry Genetics
                            </div>
                            <div className="role-detail">
                                Feb 2022 – Sep 2023 · Python lab automation · React + Flask
                            </div>
                        </div>
                        <div className="role">
                            <div className="role-title">
                                Software Engineer, Global Strategies International
                            </div>
                            <div className="role-detail">
                                Dec 2020 – Feb 2022 · Manager of Analytics · Full stack serverless Python
                            </div>
                        </div>
                        <div className="role">
                            <div className="role-title">
                                Freelance Senior Associate - Analytics, Global Strategies International
                            </div>
                            <div className="role-detail">
                                Jun 2020 – Dec 2020
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}
