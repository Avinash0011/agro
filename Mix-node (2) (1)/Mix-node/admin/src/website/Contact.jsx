import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Breadcrumb from './BreadCrumb';

export default function Contact() {
    // 1. State for Form Fields
    const [formData, setFormData] = useState({
        firstn: '',
        lastn: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });

    // 2. State for Company Settings (Office Details)
    const [settings, setSettings] = useState({
        email: 'info@webexample.com',
        phone: '090-098-765-09',
        address: '12/A, Miranda Halim Tower, New York, USA',
        timing: 'Monday - Friday 9am - 6pm'
    });

    // Fetch Settings on Load
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/settings');
                
                if (res.data) setSettings(res.data.data);
            } catch (err) {
                console.log("Using default contact details.");
            }
        };
        fetchSettings();
    }, []);

    // 3. Handle Input Changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // 4. Handle Form Submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Mapping fields to match your backend 'ContactQuery' schema
            const submitData = {
                name: `${formData.firstn} ${formData.lastn}`,
                email: formData.email,
                mobile: formData.phone,
                subject: formData.subject,
                comments: formData.message
            };

            const response = await axios.post('http://localhost:5000/api/query', submitData);
            
            if (response.data.type) {
                alert(response.data.message);
                setFormData({ firstn: '', lastn: '', email: '', phone: '', subject: '', message: '' });
            }
        } catch (error) {
            alert("Error sending message. Please try again.");
        }
    };

    return (
        <>
            <Breadcrumb head="Contact us" sub="Contact Us" />

            <section id="services" className="services-area pt-120 pb-90 fix">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6">
                            <div className="row">
                                {/* Email Box */}
                                <div className="col-lg-6 col-md-6">
                                    <div className="services-box text-center mb-30">
                                        <div className="services-icon"><i className="fal fa-envelope"></i></div>
                                        <div className="services-content2">
                                            <h5>Email Address</h5>
                                            <p>{settings.email}</p>
                                        </div>
                                    </div>
                                </div>
                                {/* Phone Box */}
                                <div className="col-lg-6 col-md-6">
                                    <div className="services-box text-center mb-30">
                                        <div className="services-icon"><i className="fal fa-phone-alt"></i></div>
                                        <div className="services-content2">
                                            <h5>Phone Number</h5>
                                            <p>{settings.mobile}</p>
                                        </div>
                                    </div>
                                </div>
                                {/* Address Box */}
                                <div className="col-lg-6 col-md-6">
                                    <div className="services-box text-center mb-30">
                                        <div className="services-icon"><i className="fal fa-map-marked"></i></div>
                                        <div className="services-content2">
                                            <h5>Office Address</h5>
                                            <p>{settings.address}</p>
                                        </div>
                                    </div>
                                </div>
                                {/* Timing Box */}
                                <div className="col-lg-6 col-md-6">
                                    <div className="services-box text-center mb-30">
                                        <div className="services-icon"><i className="fal fa-alarm-clock"></i></div>
                                        <div className="services-content2">
                                            <h5>Timing</h5>
                                            <p>{settings.timing}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-6">
                            <div className="contact-bg02 ">
                                <div className="section-title mb-50">
                                    <h5>Contact</h5>
                                    <h2>Get A Quote</h2>
                                </div>

                                <form onSubmit={handleSubmit} className="contact-form mt-30">
                                    <div className="row">
                                        <div className="col-lg-6">
                                            <div className="contact-field p-relative c-name mb-30">
                                                <input type="text" name="firstn" value={formData.firstn} onChange={handleChange} placeholder="First Name" required />
                                            </div>
                                        </div>
                                        <div className="col-lg-6">
                                            <div className="contact-field p-relative c-email mb-30">
                                                <input type="text" name="lastn" value={formData.lastn} onChange={handleChange} placeholder="Last Name" required />
                                            </div>
                                        </div>
                                        <div className="col-lg-6">
                                            <div className="contact-field p-relative c-subject mb-30">
                                                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
                                            </div>
                                        </div>
                                        <div className="col-lg-6">
                                            <div className="contact-field p-relative c-subject mb-30">
                                                <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone No." required />
                                            </div>
                                        </div>
                                        <div className="col-lg-12">
                                            <div className="contact-field p-relative c-option mb-30">
                                                <input type="text" name="subject" value={formData.subject} onChange={handleChange} placeholder="Subject" required />
                                            </div>
                                        </div>
                                        <div className="col-lg-12">
                                            <div className="contact-field p-relative c-message mb-30">
                                                <textarea name="message" value={formData.message} onChange={handleChange} cols="30" rows="10" placeholder="Write comments"></textarea>
                                            </div>
                                            <div className="slider-btn">
                                                <button type="submit" className="btn ss-btn active">Submit Now</button>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}