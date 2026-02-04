import { useState } from 'react';
import './LandingPage.css';
import './HeroShowcase.css';

export const LandingPage = ({ onEnterStudio }) => {
    const [activeTestimonial, setActiveTestimonial] = useState(0);

    const testimonials = [
        {
            name: "Sarah Johnson",
            text: "The 3D customizer made ordering my daughter's birthday cake so easy! We could see exactly what we were getting.",
            rating: 5,
            image: "👩"
        },
        {
            name: "Michael Chen",
            text: "Best cake shop ever! The customization options are incredible and the cake tasted amazing!",
            rating: 5,
            image: "👨"
        },
        {
            name: "Emily Rodriguez",
            text: "I loved being able to design my wedding cake in 3D. It turned out exactly as I imagined!",
            rating: 5,
            image: "👰"
        }
    ];

    const features = [
        {
            icon: "🎨",
            title: "Custom Designs",
            description: "Design your perfect cake in stunning 3D with unlimited customization options"
        },
        {
            icon: "👨‍🍳",
            title: "Expert Bakers",
            description: "Our master bakers bring your digital design to life with precision and care"
        },
        {
            icon: "🚚",
            title: "Fast Delivery",
            description: "Same-day delivery available for orders placed before noon"
        },
        {
            icon: "💯",
            title: "Quality Guaranteed",
            description: "100% satisfaction guarantee or your money back"
        }
    ];

    const cakeGallery = [
        { name: "Birthday Bliss", category: "Birthday", color: "#fd79a8", image: "/cake/kaouther-djouada-hcEDfkiVmMI-unsplash.jpg" },
        { name: "Wedding Wonder", category: "Wedding", color: "#a29bfe", image: "/cake/david-holifield-7ePjhwxtxCU-unsplash.jpg" },
        { name: "Chocolate Dream", category: "Chocolate", color: "#6c5ce7", image: "/cake/american-heritage-chocolate-vdx5hPQhXFk-unsplash.jpg" },
        { name: "Fruit Delight", category: "Fruit", color: "#00b894", image: "/cake/alexandra-gornago-_B7shfNUXEA-unsplash.jpg" },
        { name: "Custom Creation", category: "Custom", color: "#fdcb6e", image: "/cake/serghei-savchiuc-H2t7or5XgPs-unsplash.jpg" },
        { name: "Anniversary Special", category: "Anniversary", color: "#e17055", image: "/cake/syed-maaz-QLSh4y2v93c-unsplash.jpg" }
    ];

    return (
        <div className="landing-page">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-overlay"></div>
                <div className="hero-content">
                    <div className="hero-text">
                        <h1 className="hero-title">
                            <span className="title-line">Design Your</span>
                            <span className="title-line highlight">Dream Cake</span>
                            <span className="title-line">in 3D</span>
                        </h1>
                        <p className="hero-subtitle">
                            Experience the future of cake customization with our revolutionary 3D designer.
                            See your creation come to life before you order!
                        </p>
                        <div className="hero-buttons">
                            <button className="btn-primary" onClick={onEnterStudio}>
                                <span>Launch 3D Studio</span>
                                <span className="btn-icon">🎂</span>
                            </button>
                            <button className="btn-secondary" onClick={() => document.getElementById('gallery').scrollIntoView({ behavior: 'smooth' })}>
                                View Gallery
                            </button>
                        </div>
                        <div className="hero-stats">
                            <div className="stat">
                                <div className="stat-number">10,000+</div>
                                <div className="stat-label">Happy Customers</div>
                            </div>
                            <div className="stat">
                                <div className="stat-number">50,000+</div>
                                <div className="stat-label">Cakes Created</div>
                            </div>
                            <div className="stat">
                                <div className="stat-number">4.9★</div>
                                <div className="stat-label">Average Rating</div>
                            </div>
                        </div>
                    </div>
                    <div className="hero-visual">
                        <div className="showcase-container">
                            <div className="showcase-image-wrapper">
                                <img
                                    src="/cake/american-heritage-chocolate-vdx5hPQhXFk-unsplash.jpg"
                                    alt="Signature Chocolate Cake"
                                    className="showcase-image"
                                />
                                <div className="showcase-glow"></div>
                            </div>

                            <div className="floating-badge badge-top">
                                <span className="badge-icon">✨</span>
                                <div className="badge-text">
                                    <span className="badge-label">Trending Design</span>
                                    <span className="badge-sub">Chocolate Dream</span>
                                </div>
                            </div>

                            <div className="floating-badge badge-bottom">
                                <div className="badge-price-container">
                                    <span className="badge-label-small">Starting from</span>
                                    <span className="badge-price">₹850.00</span>
                                </div>
                                <button className="badge-btn" onClick={onEnterStudio}>
                                    Customize
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
                <div className="scroll-indicator">
                    <div className="mouse">
                        <div className="wheel"></div>
                    </div>
                    <p>Scroll to explore</p>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section">
                <div className="container">
                    <h2 className="section-title">Why Choose Cake Studio 3D?</h2>
                    <p className="section-subtitle">Experience the perfect blend of technology and taste</p>

                    <div className="features-grid">
                        {features.map((feature, index) => (
                            <div key={index} className="feature-card">
                                <div className="feature-icon">{feature.icon}</div>
                                <h3 className="feature-title">{feature.title}</h3>
                                <p className="feature-description">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Gallery Section */}
            <section id="gallery" className="gallery-section">
                <div className="container">
                    <h2 className="section-title">Our Creations</h2>
                    <p className="section-subtitle">Get inspired by our stunning cake designs</p>

                    <div className="gallery-grid">
                        {cakeGallery.map((cake, index) => (
                            <div key={index} className="gallery-item" style={{ '--accent-color': cake.color }}>
                                <div className="gallery-image" style={{
                                    backgroundImage: `url(${cake.image})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: cake.position || 'center',
                                    backgroundColor: cake.color
                                }}>
                                    <div className="gallery-overlay">
                                        <button className="btn-customize" onClick={onEnterStudio}>
                                            Customize This Style
                                        </button>
                                    </div>
                                </div>
                                <div className="gallery-info">
                                    <h3>{cake.name}</h3>
                                    <span className="gallery-category">{cake.category}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="how-it-works-section">
                <div className="container">
                    <h2 className="section-title">How It Works</h2>
                    <p className="section-subtitle">Three simple steps to your perfect cake</p>

                    <div className="steps-container">
                        <div className="step">
                            <div className="step-number">1</div>
                            <div className="step-icon">🎨</div>
                            <h3 className="step-title">Design in 3D</h3>
                            <p className="step-description">
                                Use our intuitive 3D designer to customize every detail - shape, size, flavor, and toppings
                            </p>
                        </div>

                        <div className="step-connector"></div>

                        <div className="step">
                            <div className="step-number">2</div>
                            <div className="step-icon">📝</div>
                            <h3 className="step-title">Place Order</h3>
                            <p className="step-description">
                                Review your design, see the price, and place your order with just a few clicks
                            </p>
                        </div>

                        <div className="step-connector"></div>

                        <div className="step">
                            <div className="step-number">3</div>
                            <div className="step-icon">🎂</div>
                            <h3 className="step-title">Enjoy!</h3>
                            <p className="step-description">
                                We bake and deliver your custom cake exactly as you designed it
                            </p>
                        </div>
                    </div>

                    <div className="cta-container">
                        <button className="btn-large" onClick={onEnterStudio}>
                            Start Designing Now
                            <span className="btn-arrow">→</span>
                        </button>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="testimonials-section">
                <div className="container">
                    <h2 className="section-title">What Our Customers Say</h2>
                    <p className="section-subtitle">Don't just take our word for it</p>

                    <div className="testimonial-carousel">
                        <button
                            className="carousel-btn prev"
                            onClick={() => setActiveTestimonial((activeTestimonial - 1 + testimonials.length) % testimonials.length)}
                        >
                            ‹
                        </button>

                        <div className="testimonial-card">
                            <div className="testimonial-avatar">{testimonials[activeTestimonial].image}</div>
                            <div className="testimonial-stars">
                                {'★'.repeat(testimonials[activeTestimonial].rating)}
                            </div>
                            <p className="testimonial-text">"{testimonials[activeTestimonial].text}"</p>
                            <p className="testimonial-author">{testimonials[activeTestimonial].name}</p>
                        </div>

                        <button
                            className="carousel-btn next"
                            onClick={() => setActiveTestimonial((activeTestimonial + 1) % testimonials.length)}
                        >
                            ›
                        </button>
                    </div>

                    <div className="testimonial-dots">
                        {testimonials.map((_, index) => (
                            <button
                                key={index}
                                className={`dot ${index === activeTestimonial ? 'active' : ''}`}
                                onClick={() => setActiveTestimonial(index)}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="final-cta-section">
                <div className="cta-content">
                    <h2 className="cta-title">Ready to Create Your Perfect Cake?</h2>
                    <p className="cta-text">Join thousands of happy customers who designed their dream cakes with us</p>
                    <button className="btn-cta" onClick={onEnterStudio}>
                        Launch 3D Cake Studio
                        <span className="sparkle">✨</span>
                    </button>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <div className="container">
                    <div className="footer-content">
                        <div className="footer-section">
                            <h3 className="footer-title">Cake Studio 3D</h3>
                            <p className="footer-text">
                                Bringing your cake dreams to life with cutting-edge 3D technology and traditional baking excellence.
                            </p>
                        </div>

                        <div className="footer-section">
                            <h4 className="footer-heading">Quick Links</h4>
                            <ul className="footer-links">
                                <li><a href="#gallery">Gallery</a></li>
                                <li><a href="#" onClick={onEnterStudio}>3D Studio</a></li>
                                <li><a href="#testimonials">Reviews</a></li>
                                <li><a href="#contact">Contact</a></li>
                            </ul>
                        </div>

                        <div className="footer-section">
                            <h4 className="footer-heading">Contact Us</h4>
                            <ul className="footer-contact">
                                <li>📞 (555) 123-4567</li>
                                <li>📧 hello@cakestudio3d.com</li>
                                <li>📍 123 Baker Street, Sweet City</li>
                            </ul>
                        </div>

                        <div className="footer-section">
                            <h4 className="footer-heading">Follow Us</h4>
                            <div className="social-links">
                                <a href="#" className="social-link">📘</a>
                                <a href="#" className="social-link">📷</a>
                                <a href="#" className="social-link">🐦</a>
                                <a href="#" className="social-link">📌</a>
                            </div>
                        </div>
                    </div>

                    <div className="footer-bottom">
                        <p>&copy; 2026 Cake Studio 3D. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};
