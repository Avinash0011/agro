import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import Breadcrumb from './BreadCrumb';
import axios from 'axios';

export default function Blog() {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/blog');
                setBlogs(Array.isArray(res.data) ? res.data : res.data.blogs || []);
            } catch (error) {
                console.error("Error fetching blogs:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBlogs();
    }, []);

    return (
        <>
            <Breadcrumb head="Blog" sub="Our Blogs" />

            <section className="inner-blog pt-120 pb-120">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8">
                            {loading ? (
                                <div className="text-center">Loading Blogs...</div>
                            ) : blogs.length > 0 ? (
                                blogs.map((item, index) => (
                                    <div className="bsingle__post mb-50" key={index}>
                                        <div className="bsingle__post-thumb">
                                            {/* Logic to show uploaded photo or default placeholder */}
                                            <img 
                                                src={item.photo ? `/uploads/${item.photo}` : "/website_assets/img/blog/inner_b1.jpg"} 
                                                alt={item.heading} 
                                                style={{ width: '100%', height: 'auto' }}
                                            />
                                        </div>
                                        <div className="bsingle__content">
                                            <div className="admin">
                                                <a href="#"><i className="far fa-user"></i> by {item.post || 'Admin'}</a>
                                            </div>

                                            <h2>
                                                <NavLink to={`/blog`}>
                                                    {item.heading}
                                                </NavLink>
                                            </h2>
                                            
                                            <p>{item.description}</p>
                                            
                                            <div className="meta-info">
                                                <ul>
                                                    <li><i className="fal fa-calendar-alt"></i> {item.date || 'Recent'}</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center">No blogs found.</div>
                            )}
                        </div>

                    </div>
                </div>
            </section>
        </>
    );
}