
import "./Home.css";
import { Link } from "react-router-dom";

function Home() {
    return (
        <div className="app">
            <nav className="navbar">
                <a href="/" className="logo">
                    FIT<span>STUDIO</span>
                </a>

                <div className="nav-links">
                    <a href="#home">Home</a>
                    <a href="#about">About</a>
                    <a href="#location">Location</a>
                </div>

                <Link to="/login" className="login-btn">
                    Login →
                </Link>
            </nav>

            <main>
                <section className="hero" id="home">
                    <div className="hero-content">
                        <p className="eyebrow">
                            YOUR FITNESS. YOUR JOURNEY.
                        </p>

                        <h1>
                            BUILD YOUR
                            <br />
                            <span>STRONGER</span>
                            <br />
                            SELF.
                        </h1>

                        <p className="description">
                            Train with purpose. Push your limits.
                            Start your fitness journey with Fit Studio.
                        </p>

                        <div className="hero-buttons">
                            <a href="#about" className="primary-btn">
                                Discover More ↗
                            </a>

                            <a href="tel:+910000000000" className="secondary-btn">
                                Call Us
                            </a>
                        </div>
                    </div>

                    <div className="hero-tag">
                        <span className="status-dot"></span>
                        YOUR NEXT CHAPTER STARTS HERE
                    </div>
                </section>

                <section className="about" id="about">
                    <p className="eyebrow">WELCOME TO FIT STUDIO</p>
                    <h2>Make every workout count.</h2>
                    <p>
                        A space to train, grow and work towards your
                        fitness goals.
                    </p>
                </section>

                <section className="location" id="location">
                    <div>
                        <p className="eyebrow">FIND YOUR GYM</p>
                        <h2>Come train with us.</h2>
                        <p>Gym address will be added here.</p>
                    </div>

                    <a
                        href="https://maps.google.com/"
                        target="_blank"
                        rel="noreferrer"
                        className="primary-btn"
                    >
                        View Location ↗
                    </a>
                </section>
            </main>

            <footer>
                © {new Date().getFullYear()} Fit Studio. All rights reserved.
            </footer>
        </div>
    )
}

export default Home
