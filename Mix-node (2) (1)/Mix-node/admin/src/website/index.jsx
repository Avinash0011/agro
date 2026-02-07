import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FaqItem from './faqItem';
import { NavLink } from 'react-router-dom';
import SinglePost from './singlePost';
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

// Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import Settings from '../Components/Settings';

export default function HOME() {
    const [blogs, setBlogs] = useState([]);
    const [services, setServices] = useState([]);
    const [testimonials, setTestimonials] = useState([]);
    const [faqs, setFaqs] = useState([]);
    const [counts, setCounts] = useState({ members: 3897, farms: 7849, clients: 5687, coffee: 9874 });
    const [settings, setSettings] = useState([]);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchHomeData = async () => {
            try {
                // Fetch Blogs (Limit to 6 for slider)
                const res = await axios.get('http://localhost:5000/api/blog');
                setBlogs(Array.isArray(res.data) ? res.data : res.data.blogs || []);

                // Fetch Services
                const serviceRes = await axios.get('http://localhost:5000/api/get-services');
                setServices(Array.isArray(serviceRes.data) ? serviceRes.data : serviceRes.data.services || []);

                // Fetch Testimonials
                const testiRes = await axios.get('http://localhost:5000/api/testimonials');
                setTestimonials(testiRes.data.data);
                
                const faqRes = await axios.get('http://localhost:5000/api/faq');
                setFaqs(faqRes.data.faqs);

                const ress = await axios.get('http://localhost:5000/api/settings');
                setSettings(ress.data.data);

                const resss = await axios.get('http://localhost:5000/api/product');
                setProducts(resss.data.pro);

            } catch (error) {
                console.error("Error loading Home data", error);
            }
        };
        fetchHomeData();
    }, []);

    const sliderStyle = {
        background: 'url(website_assets/img/slider/slider_img_bg.png) no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
    };
    const getWhatsAppLink = (productName) => {
        const number = settings.mobile.replace(/\s+/g, ''); // Remove spaces
        const message = `Hey, AgroFrams, I want to ask some more details \n about: ${productName}`;
        return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
    };

    const ProductCard = ({ product }) => (
        <div className="product mb-40">
            <div className="product__img">
                <a href={`/product-details/${product._id}`}>
                    <img 
                        src={`/uploads/${product.Photo}`} 
                        alt={product.name} 
                        style={{ width: '100%', height: '300px', objectFit: 'cover' }}
                    />
                </a>
                <div className="product-action text-center">
                    <a href={getWhatsAppLink(product.Product_name)}>Add To Cart</a>
                </div>
            </div>
            <div className="product__content text-center pt-30">
                <h4 className="pro-title">
                    <a href={`/product-details/${product._id}`}>{product.Product_name}</a>
                </h4>
                <div className="price">
                    <span>${product.MRPs}</span>
                    {product.Actual_price && <span className="old-price">${product.Actual_price}</span>}
                </div>
            </div>
        </div>
    );

    // Reusable Components
    const CounterBox = ({ iconsrc, title, count }) => (
        <div className="single-counter mt-40 mb-30">
            <div className="counter p-relative">
                <div className="icon"><img src={iconsrc} alt="icon" /></div>
                <div className="text">
                    <strong>{title}</strong>
                    <span className="count">{count}</span>
                </div>
            </div>
        </div>
    );

    const ServiceBox = ({ iconsrc, title, text, id }) => (
        <div className="services-box2 mb-30">
            <div className="services-icon">
                <img src={iconsrc.includes('http') ? iconsrc : `/uploads/${iconsrc}`} alt="icon" />
            </div>
            <div className="services-content2">
                <h5><a href={`/`}>{title}</a></h5>
                <p>{text.substring(0, 100)}...</p>
            </div>
        </div>
    );
     const faqBackgroundStyle = {
        background: 'url(website_assets/img/bg/faq-bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
    };

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
            {/* HERO SLIDER */}
            <section id="home" className="slider-area slider-four fix p-relative">
                <div className="single-slider slider-bg d-flex align-items-center" style={sliderStyle}>
                    <div className="container">
                        <div className="row justify-content-center pt-50">
                            <div className="col-lg-10">
                                <div className="slider-content s-slider-content">
                                    <h5>{settings.banner_small}</h5>
                                    <h2>{settings.banner_big}</h2>
                                    <p>{settings.banner_desc}</p>
                                    <div className="slider-btn mt-30">
                                        <NavLink to="/services" className="btn ss-btn mr-15">Read More</NavLink>
                                        <NavLink to="/contact" className="btn ss-btn active">Contact Us</NavLink>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

           <section id="about2" className="about-area about-p pt-120 pb-90 p-relative">
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-lg-6 col-md-12 col-sm-12 pr-30">
                        <div className="s-about-img p-relative">
                            <img 
                                src={"website_assets/img/features/about_img.png"} 
                                alt="About Us" 
                            />
                        </div>
                    </div>
                    <div className="col-lg-6 col-md-12 col-sm-12">
                        <div className="about-content s-about-content">
                            <div className="about-title second-title pb-25">
                                <h5>{settings.about_heading}</h5>
                                <h2>{settings.about_subheading}</h2>
                            </div>
                            <p>{settings.about_desc}</p>
                            
                            <div className="about-content3 mt-30">
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="box">
                                            <img src="website_assets/img/features/organic-food.png" alt="Mission" />
                                            <h5>Our Mission</h5>
                                            <p>{settings.mission}</p>
                                            <a href="/about"><i className="fal fa-angle-double-right"></i> Read More</a>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="box">
                                            <img src="website_assets/img/features/awward-icon.png" alt="Vision" />
                                            <h5>Our Vision</h5>
                                            <p>{settings.vision}</p>
                                            <a href="/about"><i className="fal fa-angle-double-right"></i> Read More</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Counter Row Dynamic */}
                <div className="row">
                    <div className="col-lg-3 col-sm-6">
                        <CounterBox 
                            iconsrc="website_assets/img/icon/tm-icon01.png" 
                            title={settings.stat_h1}
                            count={settings.stat_c1 || "3897"} 
                        />
                    </div>
                    <div className="col-lg-3 col-sm-6">
                        <CounterBox 
                            iconsrc="website_assets/img/icon/tm-icon02.png" 
                            title={settings.stat_h2} 
                            count={settings.stat_c2 || "7849"} 
                        />
                    </div>
                    <div className="col-lg-3 col-sm-6">
                        <CounterBox 
                            iconsrc="website_assets/img/icon/tm-icon03.png" 
                            title={settings.stat_h3}
                            count={settings.stat_c3 || "5687"} 
                        />
                    </div>
                    <div className="col-lg-3 col-sm-6">
                        <CounterBox 
                            iconsrc="website_assets/img/icon/tm-icon04.png" 
                            title={settings.stat_h4}
                            count={settings.stat_c4 || "9874"} 
                        />
                    </div>
                </div>
            </div>
        </section>

            {/* DYNAMIC SERVICES */}
            <section id="services2" className="services-area2 pt-120 pb-90" style={{ background: "#f4f7fe" }}>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-4">
                            <div className="section-title pb-25">
                                <h5>Features</h5>
                                <h2>We Provide Best Services</h2>
                            </div>
                        </div>
                        {services.slice(0, 5).map((ser) => (
                            <div className="col-lg-4" key={ser._id}>
                                <ServiceBox 
                                    iconsrc={ser.photo || "website_assets/img/icon/se-icon1.png"} 
                                    title={ser.service_name} 
                                    text={ser.description} 
                                    id={ser._id} 
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section id="about" className="about-area about-p pt-120 pb-90 p-relative">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-6 col-md-12 col-sm-12 pr-30">
            <div className="s-about-img p-relative">
              <img
                src={settings.watch_image ? `http://localhost:5000/uploads/settings/${settings.watch_image}` : "website_assets/img/features/about-img2.png"}
                alt="Organic Farming"
              />
              <a
                href={settings.youtube_url || "https://www.youtube.com/watch?v=7e90gBu4pas"}
                className="popup-video"
              >
                <img
                  src="website_assets/img/features/vplay.png"
                  alt="Play Video"
                />
              </a>
            </div>
          </div>

          <div className="col-lg-6 col-md-12 col-sm-12">
            <div className="about-content s-about-content">
              <div className="about-title second-atitle">
                <h5>{settings.watch_sub_title || "Watch Us"}</h5>
                <h2>{settings.watch_title || "How We Care & Grow Our Organic Vegetables"}</h2>
              </div>

              <ul className="ab-ul">
                {/* Line 1 */}
                {settings.desc_one && (
                  <li>
                    <div className="icon">
                      <i className="fal fa-check"></i>
                    </div>
                    <div className="text pt-10">{settings.desc_one}</div>
                  </li>
                )}

                {/* Line 2 */}
                {settings.desc_two && (
                  <li>
                    <div className="icon">
                      <i className="fal fa-check"></i>
                    </div>
                    <div className="text pt-10">{settings.desc_two}</div>
                  </li>
                )}

                {/* Line 3 */}
                {settings.desc_three && (
                  <li>
                    <div className="icon">
                      <i className="fal fa-check"></i>
                    </div>
                    <div className="text pt-10">{settings.desc_three}</div>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="editor-choice" className="product-slider pt-120 pb-90 fix" style={{ backgroundImage: "url('website_assets/img/bg/shop-bg.png')" }}>
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="section-title center-align mb-50 text-center">
                            <h5>Shop Now</h5>
                            <h2>Visit Our Store Of Food</h2>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-lg-12">
                        <Swiper
                            modules={[Autoplay, Pagination]}
                            spaceBetween={30}
                            slidesPerView={1} // Mobile default
                            autoplay={{ delay: 3500, disableOnInteraction: false }}
                            pagination={{ clickable: true }}
                            breakpoints={{
                                // Tablet
                                768: {
                                    slidesPerView: 2,
                                },
                                // Laptop/Desktop
                                1200: {
                                    slidesPerView: 3,
                                }
                            }}
                            className="pb-50"
                        >
                            {products.map((product) => (
                                <SwiperSlide key={product._id}>
                                    <ProductCard product={product} />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </div>
            </div>
        </section>

            <FAQSection />
            <TestimonialSection />

            {/* DYNAMIC BLOG SECTION */}
            <section id="blog" className="blog-area pt-120 pb-70">
                <div className="container">
                    <div className="section-title text-center mb-50">
                        <h5>News</h5>
                        <h2>Latest News & Blog</h2>
                    </div>
                    <Swiper
                        modules={[Autoplay, Pagination]}
                        spaceBetween={30}
                        slidesPerView={1}
                        breakpoints={{ 768: { slidesPerView: 2 }, 992: { slidesPerView: 3 } }}
                        autoplay={{ delay: 5000 }}
                    >
                        {blogs.map((post) => (
                            <SwiperSlide key={post._id}>
                                <SinglePost post={{
                                    id: post._id,
                                    title: post.heading,
                                    date: post.date,
                                    image: `/uploads/${post.photo}`,
                                    excerpt: post.description.substring(0, 80) + "..."
                                }} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </section>
        </>
    );
}