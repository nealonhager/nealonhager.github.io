export function App() {
    return (
        <main className="page">
            <div className="content">
                <h1>Nealon Hager</h1>
                <nav className="links" aria-label="External links">
                    <a href="https://github.com/nealonhager" target="_blank" rel="noreferrer">
                        GitHub
                    </a>
                    <a href="https://www.linkedin.com/in/nealonhager" target="_blank" rel="noreferrer">
                        LinkedIn
                    </a>
                </nav>
                <figure className="photo">
                    <picture>
                        <source media="(max-width: 480px)" srcSet="/images/me-400w.jpeg" />
                        <source media="(max-width: 768px)" srcSet="/images/me-576w.jpeg" />
                        <source media="(max-width: 1024px)" srcSet="/images/me-800w.jpeg" />
                        <img
                            src="/images/me-1152w.jpeg"
                            width={1152}
                            height={864}
                            alt="Me rock climbing at Smith Rock"
                        />
                    </picture>
                    <figcaption>Smith Rock, Oregon</figcaption>
                </figure>
                <p>
                    I'm a software engineer based in Bend, Oregon, currently building software at Ambry Genetics. I studied computer science at Boise State University.
                </p>
                <p>
                    Outside of my day-to-day work, I enjoy experimenting with Python, React, machine learning, automation, and AI tools. Currently, I'm building voice-driven assistants and experimenting with LLM interaction modalities.
                </p>
                <p>
                    For fun, I like to rock climb, bike, run, and constantly rewatch my favorite movies and TV shows.
                </p>
            </div>
        </main>
    );
}
