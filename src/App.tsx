function ExternalLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <a href={href} target="_blank" rel="noreferrer">
            {children}
            <span className="arrow" aria-hidden="true"> ↗</span>
        </a>
    );
}

export function App() {
    return (
        <main className="page">
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
