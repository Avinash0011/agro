import FaqItem from './faqItem';
import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import Breadcrumb from './BreadCrumb';
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import axios from 'axios';

// Swiper styles
import "swiper/css";
import "swiper/css/pagination";

export default function About() {
    const [faqs, setFaqs] = useState([]);
    const [testimonials, setTestimonials] = useState([]);
    const [aboutContent, setAboutContent] = useState({
        line1: "We follow sustainable farming practices that protect soil health, conserve water, and promote natural crop growth without harmful chemicals.",
        line2: "Every vegetable is carefully monitored from seed selection to harvest, ensuring freshness, nutrition, and consistent quality throughout the process.",
        line3: "Our modern processing and hygiene standards help deliver safe, clean, and farm-fresh produce that you can trust every day."
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch FAQs
                const faqRes = await axios.get('http://localhost:5000/api/faq');
                setFaqs(faqRes.data.faqs);

                // Fetch Testimonials
                const testiRes = await axios.get('http://localhost:5000/api/testimonials');
                setTestimonials(testiRes.data.data);

                // Optional: Fetch About Us Lines from Settings
                const settingsRes = await axios.get('http://localhost:5000/api/settings');
                   setAboutContent({
                      line1:settingsRes.data.data.desc_one,
                      line2:settingsRes.data.data.desc_two,
                      line3:settingsRes.data.data.desc_three,
                    });
                
            } catch (error) {
                console.error("Error fetching about page data", error);
            }
        };
        fetchData();
    }, []);

    const faqBackgroundStyle = {
        background: 'url(website_assets/img/bg/faq-bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
    };

    const AboutSection = () => (
        <section id="about" className="about-area about-p pt-120 pb-90 p-relative">
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-lg-6 col-md-12 col-sm-12 pr-30">
                        <div className="s-about-img p-relative">
                            <img src="website_assets/img/features/about-img2.png" alt="Organic Farming" />
                            <a href="https://www.youtube.com/watch?v=7e90gBu4pas" className="popup-video">
                                <img src="website_assets/img/features/vplay.png" alt="Play Video" />
                            </a>
                        </div>
                    </div>

                    <div className="col-lg-6 col-md-12 col-sm-12">
                        <div className="about-content s-about-content">
                            <div className="about-title second-atitle">
                                <h5>Watch Us</h5>
                                <h2>How We Care & Grow Our Organic Vegetables</h2>
                            </div>

                            <ul className="ab-ul">
                                <li>
                                    <div className="icon"><i className="fal fa-check"></i></div>
                                    <div className="text pt-10">{aboutContent.line1}</div>
                                </li>
                                <li>
                                    <div className="icon"><i className="fal fa-check"></i></div>
                                    <div className="text pt-10">{aboutContent.line2}</div>
                                </li>
                                <li>
                                    <div className="icon"><i className="fal fa-check"></i></div>
                                    <div className="text pt-10">{aboutContent.line3}</div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );

    const FAQSection = () => (
        <section id="faq" className="faq-area pt-120 pb-100" style={faqBackgroundStyle}>
            <div className="container">
                <div className="row">
                    <div className="col-lg-6 col-md-8">
                        <div className="about-title second-atitle mb-30">
                            <h5>FAQ</h5>
                            <h2>Frequently Asked Questions</h2>
                        </div>
                        <div className="faq-wrap">
                            <div className="accordion">
                                {faqs.length > 0 ? faqs.map((faq, index) => (
                                    <FaqItem
                                        key={faq._id || index}
                                        id={index === 0 ? "One" : index === 1 ? "Two" : index === 2 ? "Three" : "Four"}
                                        title={faq.Question}
                                        isExpanded={index === 0}
                                        initialShow={index === 0}
                                        content={faq.Answer}
                                    />
                                )) : (
                                    <p>Loading FAQs...</p>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6 col-md-4"></div>
                </div>
            </div>
        </section>
    );

    const TestimonialItem = ({ testimonial }) => (
        <div className="single-testimonial">
            <div className="row">
                <div className="col-lg-5 col-md-5">
                    <div className="test-img">
                        <img 
                            src={`/uploads/${testimonial.photo}`} 
                            alt={testimonial.name} 
                        />
                    </div>
                </div>
                <div className="col-lg-7 col-md-7">
                    <p>{testimonial.description}</p>
                    <div className="testi-author">
                        <div className="ta-info">
                            <h6>{testimonial.name}</h6>
                            <span>{testimonial.post}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="qt-img">
                <img src="website_assets/img/testimonial/qt-icon.png" alt="Quote Icon" />
            </div>
        </div>
    );

    const TestimonialSection = () => (
        <section className="testimonial-area pt-120 pb-120">
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="section-title center-align mb-50 text-center">
                            <h5>Testimonial</h5>
                            <h2>What Our Clients Say About Us</h2>
                        </div>
                    </div>
                    <div className="col-lg-12">
                        <Swiper
                            modules={[Autoplay, Pagination]}
                            spaceBetween={30}
                            slidesPerView={1}
                            autoplay={{ delay: 4000, disableOnInteraction: false }}
                            pagination={{ clickable: true }}
                            breakpoints={{
                                768: { slidesPerView: 1 },
                                992: { slidesPerView: 2 }
                            }}
                            className="testimonial-active"
                        >
                            {testimonials.map((testimonial, index) => (
                                <SwiperSlide key={testimonial._id || index}>
                                    <TestimonialItem testimonial={testimonial} />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </div>
            </div>
        </section>
    );

    return (
        <>
            <Breadcrumb head="About" sub="About us" />
            <AboutSection />
            <FAQSection />
            <TestimonialSection />
        </>
    );
};