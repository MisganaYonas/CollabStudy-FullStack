import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/index.css";
import Logo from "../images/Logo.png";
import HeroImage from "../images/groupOfPeople.jpg";
import StudyingPeople from "../images/studyingPeople.jpg";


const Index = () => {

  useEffect(() => {
    const togglebtn = document.getElementById("menuToggle");
    const navMenu = document.getElementById("navMenu");
    

    if (!togglebtn || !navMenu) return;
    const handleToggle = () => {
    navMenu.classList.toggle("open");
  };

  togglebtn.addEventListener("click", handleToggle);

  const whyCards = document.querySelectorAll(".why-subsection"); 
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0 }
  );

  whyCards.forEach(card => observer.observe(card));

  return () => {
    togglebtn.removeEventListener("click", handleToggle);
    observer.disconnect();
  };
}, []);


  return (
    <>
      <header className="header">
        <div className="header-container">
          <div className="logo-container">
            <img src={Logo} className="logo" alt="Logo" />
          </div>

          <button id="menuToggle" className="hamburger">☰</button>

          <nav className="nav" id="navMenu">
            <a href="#what">About</a>
            <a href="#why">Why CollabStudy</a>
            <a href="#how">How It Works</a>
            <a href="#contact">Contact</a>
          </nav>

          <Link to="/Login">
            <button className="nav-login-btn">Login</button>
          </Link>
        </div>
      </header>

      <section className="hero-section" id="hero">
        <div className="hero-container">
          <div className="hero-left">
            <h1 className="hero-title">Study Smarter, Together</h1>
            <h2 className="hero-subtitle">
              Build Groups, Find Partners, Ace Your Classes
            </h2>
            <p className="hero-content">
              Connect with fellow Addis Ababa University students, form study groups,
              and collaborate to achieve academic excellence together.
            </p>

            <div className="hero-actions">
              <Link to="/Signup">
                <button className="getstared-btn">Get Started</button>
              </Link>
              <a href="#what" className="learnMore-btn">Learn More</a>
            </div>
          </div>

          <div className="hero-right">
            <img
              src={HeroImage}
              alt="Students studying"
              className="hero-image"
            />
          </div>
        </div>
      </section>

      <section className="what-section" id="what">
        <div className="what-container">
          <div className="what-main">
            <h2 className="what-subtitle">What is CollabStudy?</h2>
            <p className="what-content">
              CollabStudy is a secure platform designed exclusively for Addis Ababa University students to connect, collaborate, and excel academically through organized study groups. We make it easy to find study partners, share resources, and get help when you need it.
            </p>
          </div>

          <div className="what-wrapper">
            <img
              src={StudyingPeople}
              alt="Students studying together"
              className="what-image"
            />
            <div>
              <div className="what-subsection">
                <h3 className="what-subsection-title">Why We Proposed This</h3>
                <p className="what-subsection-content">
                  We understand that finding the right study partners can be challenging. CollabStudy bridges that gap by providing a dedicated space where AAU students can easily discover and join study groups that match their academic needs and schedules.
                </p>
              </div>

              <div className="what-subsection">
                <h3 className="what-subsection-title">Safe & Verified</h3>
                <p className="what-subsection-content">
                  Your safety is our priority. Only students with verified AAU email addresses can register, ensuring a trusted community of real students who are serious about academic success.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

     
      <section className="why-section" id="why">
        <div className="why-container">
            <div className="why-main">
                <h2 className="why-subtitle">Why Choose CollabStudy?</h2>
                <p className="why-content">
                    Everything you need to succeed in your academic journey
                </p>
            </div>
            <div className="why-grid">
                <div className="why-subsection">
                    <div className="why-wrapper">
                        <div className="why-svg">
                            <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="svg"
                            >
                                <path d="M21 21l-4.34-4.34" />
                                <circle cx="11" cy="11" r="8" />
                            </svg>
                        </div>
                        <h3 className="why-subsection-title">Smart Group Search</h3>
                    </div>
                    <div className="why-subsection-content1">
                        <p className="why-subsection-content">
                            Find study groups by major, year, course and preferred meeting times (morning, afternoon, evening)
                        </p>
                    </div>
                </div>
                <div className="why-subsection">
                    <div className="why-wrapper">
                        <div className="why-svg">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg">
                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                            <path d="M16 3.128a4 4 0 0 1 0 7.744" />
                            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                            <circle cx="9" cy="7" r="4" />
                            </svg>
                        </div>
                        <h3 className="why-subsection-title">Create Custom Groups</h3>
                    </div>
                    <div className="why-subsection-content2">
                        <p className="why-subsection-content">
                            Can't find the right group? Create your own with 2-7 members and invite fellow students
                        </p>
                    </div>
                </div>
                <div className="why-subsection">
                    <div className="why-wrapper">
                        <div className="why-svg">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg">
                            <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
                            </svg>
                        </div>
                        <h3 className="why-subsection-title">Verified Students Only</h3>
                    </div>
                    <div className="why-subsection-content3">
                        <p className="why-subsection-content">
                            Safe and secure—only students with verified AAU email addresses can join
                        </p>
                    </div>
                </div>
                <div className="why-subsection">
                    <div className="why-wrapper">
                        <div className="why-svg">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg">
                            <path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719" />
                            </svg>
                        </div>
                        <h3 className="why-subsection-title">Group Chat & AI Help</h3>
                    </div>
                    <div className="why-subsection-content4">
                        <p className="why-subsection-content">
                            Chat with group members and get instant AI assistance for your study questions
                        </p>
                    </div>
                </div>
                
                <div className="why-subsection">
                    <div className="why-wrapper">
                        <div className="why-svg">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg">
                            <path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z" />
                            <path d="M14 2v5a1 1 0 0 0 1 1h5" />
                            <path d="M10 9H8" />
                            <path d="M16 13H8" />
                            <path d="M16 17H8" />
                            </svg>
                        </div>
                        <h3 className="why-subsection-title">Share Resources</h3>
                    </div>
                    <div className="why-subsection-content5">
                        <p className="why-subsection-content">
                            Exchange notes, materials, and study guides directly in your group chat
                        </p>
                    </div>
                </div>
                <div className="why-subsection">
                    <div className="why-wrapper">
                        <div className="why-svg">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="svg"
                            >
                              <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
                            </svg>
                        </div>
                        <h3 className="why-subsection-title">Rate Your Groups</h3>
                    </div>
                    <div className="why-subsection-content6">
                        <p className="why-subsection-content">
                            Provide feedback and help others find the best study groups on campus.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section className="how-section" id="how">
        <div className="how-container">
            <div className="how-main">
                <h2 className="how-subtitle">How It Works</h2>
                <p className="how-content">
                    From registration to collaboration in simple steps
                </p>
            </div>
            <div className="how-grid">
                <div className="how-subsection">
                    <div className="how-number">01</div>
                    <div className="how-svg">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg">
                            <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
                        </svg>
                    </div>
                    <div className="how-text-content">
                        <h3 className="how-subsection-title">Register with Your AAU Email</h3>
                        <p className="how-subsection-content">
                            Create your profile by providing your username, email, password, major, and year. You can also upload a profile picture to personalize your account. Only verified university email addresses are accepted to ensure a safe community.
                        </p>
                    </div>
                </div>
                <div className="how-subsection">
                    <div className="how-number">02</div>
                    <div className="how-svg">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg">
                        <path d="M21 21l-4.34-4.34" />
                        <circle cx="11" cy="11" r="8" />
                        </svg>
                    </div>
                    <div className="how-text-content">
                        <h3 className="how-subsection-title">Search for Study Groups</h3>
                        <p className="how-subsection-content">
                            Use our smart search filters to find groups by major, year, course, and preferred meeting times (morning, afternoon, evening, or specific days). Browse through available groups and find the perfect match for your study needs.
                        </p>
                    </div>
                </div>
                <div className="how-subsection">
                    <div className="how-number">03</div>
                    <div className="how-svg">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                        <path d="M16 3.128a4 4 0 0 1 0 7.744" />
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                        <circle cx="9" cy="7" r="4" />
                        </svg>
                    </div>
                    <div className="how-text-content">
                        <h3 className="how-subsection-title">Join or Create a Group</h3>
                        <p className="how-subsection-content">
                            Found the right group? Join instantly! Can't find one? Create your own group by specifying the course, meeting time, and preferences. You can invite other students too. Groups require a minimum of 2 members and can have up to 7 students. Meeting times can be adjusted based on member availability.
                        </p>
                    </div>
                </div>
                <div className="how-subsection">
                    <div className="how-number">04</div>
                    <div className="how-svg">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg">
                        <path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719" />
                        </svg>
                    </div>
                    <div className="how-text-content">
                        <h3 className="how-subsection-title">Collaborate & Learn</h3>
                        <p className="how-subsection-content">
                            Once in a group, chat with your study partners, share resources like notes and study materials, and get instant help from our AI assistant. After your study sessions, you can rate your group to help other students make informed decisions.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section className="contact-section" id="contact">
        <div className="contact-container">
            <div className="contact-main">
                <h2 className="contact-subtitle">Get in Touch</h2>
                <p className="contact-content">
                    Have questions or need support? We're here to help you succeed.
                </p>
            </div>

            <div className="container">
                <div className="contact-subsection">
                    <div className="contact-svg">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 7l-8.991 5.727a2 2 0 0 1-2.009 0L2 7" />
                        <rect x="2" y="4" width="20" height="16" rx="2" />
                        </svg>
                    </div>
                    <h3 className="contact-subsection-title">Email Us</h3>
                    <a href="mailto:support@collabstudy.aau.edu.et" className="contact-subsection-link">
                        support@collabstudy.aau.edu.et
                    </a>
                </div>

            <div className="contact-subsection">
                <div className="contact-svg">
                    <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="svg"
                    >
                    <path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384" />
                    </svg>
                    </div>
                <h3 className="contact-subsection-title">Call Us</h3>
                <a href="tel:+251111234567" className="contact-subsection-link">
                    +251 11 123 4567
                </a>
            </div>

            <div className="contact-subsection">
                <div className="contact-svg">
                    <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="svg"
                    >
                    <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
                    <circle cx="12" cy="10" r="3" />
                    </svg>
                </div>
                <h3 className="contact-subsection-title">Visit Us</h3>
                <p className="contact-subsection-content">
                Addis Ababa University, College of Technology and Built Environment, 5 kilo
                </p>
            </div>
        </div>

        <p className="contact-subsection-content contact-office-hours">
            Office Hours: Monday - Friday, 8:00 AM - 5:00 PM (EAT)
        </p>
    </div>
    </section>

    <section className="comments-section" id="comments">
        <div className="comments-container">
            <h2 className="comments-subtitle">What Students Say</h2>
            <div className="comments-subsection">
                <p className="comments-quotation">"</p>
                <p className="comments-subsection-content">
                    CollabStudy helped me find the perfect study group. My grades improved significantly!
                </p>
                <p className="comments-subsection-name">Marta Alemayehu</p>
                <p className="comments-subsection-major">Computer Science</p>
            </div>  
            <div className="comments-subsection">
                <p className="comments-quotation">"</p>
                <p className="comments-subsection-content">
                    The best way to connect with classmates and stay on top of coursework. Highly recommended!
                </p>
                <p className="comments-subsection-name">Dawit Tesfaye</p>
                <p className="comments-subsection-major">Mechanical Engineering</p>
            </div>
            <div className="comments-subsection">
                <p className="comments-quotation">"</p>
                <p className="comments-subsection-content">
                    I love how easy it is to organize study sessions and share resources with my group.
                </p>
                <p className="comments-subsection-name">Sara Mohammed</p>
                <p className="comments-subsection-major">Business Management</p>
            </div>
        </div>
    </section>

    <section className="data-section" id="data">
        <div className="data-container">
            <p className="data-number">500+</p>
            <p className="data-category">Active Study Group</p>
            <p className="data-number">2000+</p>
            <p className="data-category">Verified AAU Students</p>
        </div>
    </section>

    <section className="getstared-section" id="getstared">
        <div className="getstared-container">
            <h2 className="getstared-subtitle">Ready to Transform Your Study Experience?</h2>
            <p className="getstared-content">
                Join thousands of AAU students who are already studying smarter, together.
            </p>
            <Link to="/Signup">
                <button type="button" className="getstared-btn">
                    Get Started Free
                </button>
            </Link>
        </div>
    </section>
    
    <footer className="footer" id="footer">
        <div className="footer-container">
            <div className="footer-subsection">
                <img src={Logo} className="logo" alt="CollabStudy Logo" />
                <p className="footer-subsection-content">
                    Empowering AAU students to learn together
                </p>
            </div>

            <div className="footer-subsection">
                <h4 className="footer-subsection-title">Product</h4>
                <ul className="footer-list">
                    <li>
                        <a href="#why">Features</a>
                    </li>
                    <li>
                        <a href="#contact">Support</a>
                    </li>
                </ul>
            </div>

            <div className="footer-subsection">
                <h4 className="footer-subsection-title">Company</h4>
                <ul className="footer-list">
                    <li>
                        <a href="#what">About</a>
                    </li>
                    <li>
                        <a href="#contact">Contact</a>
                    </li>
                </ul>
            </div>
            <p className="footer-subsection-content">
                &copy; 2025 CollabStudy. All rights reserved. Built for Addis Ababa University students.
            </p>
        </div>
    </footer>

    </>
  );
};

export default Index;

