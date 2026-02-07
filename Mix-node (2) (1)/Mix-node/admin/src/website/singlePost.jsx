import React from 'react';
import { NavLink } from "react-router-dom";
export default function SinglePost({ post }) {
    return (
        <div className={`single-post2 mb-30 wow ${post.animation} animated`}>
            <div className="blog-thumb2">
                    <img src={post.image} alt="img" />
             
            </div>
            <div className="blog-content2">
                <div className="row">
                    <div className="col-lg-12">
                        <h4><NavLink to="/">{post.title}</NavLink></h4>
                    </div>
                </div>
                <div className="b-meta">
                    <div className="row">
                        <div className="col-lg-12 col-md-12">
                            <div className="meta-info">
                                <ul>
                                    {/* Using standard React icons, or the fal/fontawesome icons if imported */}
                                    <li><i className="fal fa-user"></i> {post.author}</li>
                                    <li><i className="fal fa-calendar-alt"></i> {post.date}</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}