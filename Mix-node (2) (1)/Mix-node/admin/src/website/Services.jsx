import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import Breadcrumb from './BreadCrumb';
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import axios from 'axios';

// Swiper styles
import "swiper/css";
import "swiper/css/pagination";

export default function Services() {
    const [services, setServices] = useState([]);
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);

    // 1. Fetch Data from API
    useEffect(() => {
        const fetchData = async () => {
            try {
                const serviceRes = await axios.get('http://localhost:5000/api/get-services');
                setServices(Array.isArray(serviceRes.data) ? serviceRes.data : serviceRes.data.services || []);

                const testiRes = await axios.get('http://localhost:5000/api/testimonials');
                
                setTestimonials(testiRes.data.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const ServiceBox = ({ iconsrc, title, text, link = "/details" }) => (
        <div className="services-box2 mb-30">
            <div className="services-icon">
                {/* Fallback to default icon if API doesn't provide one */}
                <img src={`/uploads/${iconsrc}`} alt={title} />
            </div>
            <div className="services-content2">
                <h5><NavLink to={"/service"}>{title}</NavLink></h5>
                <p>{text}</p>
            </div>
        </div>
    );

    const TestimonialItem = ({ testimonial }) => (
        <div className="single-testimonial">
            <div className="row">
                <div className="col-lg-5 col-md-5">
                    <div className="test-img">
                        <img src={testimonial.avatar || "website_assets/img/testimonial/testi_avatar.png"} alt={testimonial.author} />
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

    return (
        <>
            <Breadcrumb head="Services" sub="Our Services" />
            
            <section id="services2" className="services-area2 pt-120 pb-90 fix p-relative" style={{ background: "#f4f7fe" }}>
                <div className="container">
                  <div className='row'>
                    <div className="col-lg-12 col-md-6">
                            <div className="section-title pb-25">
                                <h5>Features</h5>
                                <h2>We Provide Best Services</h2>
                            </div>
                        </div>
                  </div>
                    <div className="row">
                        

                        {/* DYNAMIC SERVICE BOXES */}
                        {services.map((ser, index) => (
                            <div className="col-lg-4 col-md-6" key={index}>
                                <ServiceBox
                                    iconsrc={ser.photo || "website_assets/img/icon/se-icon1.png"}
                                    title={ser.service_name}
                                    text={ser.description}
                                    link={`/service-details/${ser._id}`}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Happiness Guarantee Section */}
            <section id="graph" className="features-area pt-70 pb-50" style={{ background: 'url(website_assets/img/bg/shop-bg.png)' }}>
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-5 col-md-12">
                            <img src="website_assets/img/bg/features-lg-img.png" alt="features-lg-img" />
                        </div>
                        <div className="col-lg-7 col-md-12">
                            <div className="section-title cta-title mb-20">
                                <h2>Your Happiness Guaranteed</h2>
                            </div>
                            <p>We ensure that our organic and fresh food products meet the highest standards to keep you healthy and happy.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* TESTIMONIAL SECTION */}
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
                                {testimonials.length > 0 ? (
                                    testimonials.map((testimonial) => (
                                        <SwiperSlide key={testimonial._id || testimonial.id}>
                                            <TestimonialItem testimonial={testimonial} />
                                        </SwiperSlide>
                                    ))
                                ) : (
                                    <p className="text-center">Loading testimonials...</p>
                                )}
                            </Swiper>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}