import React from 'react';

export default function FaqItem({ id, title, isExpanded, initialShow, content }) {
    return (
        <div className="card">
            <div className="card-header" id={`heading${id}`}>
                <h2 className="mb-0">
                    <button
                        className={`faq-btn ${!isExpanded ? 'collapsed' : ''}`}
                        type="button"
                        data-toggle="collapse"
                        data-target={`#collapse${id}`}
                        aria-expanded={isExpanded}
                        aria-controls={`collapse${id}`}
                    >
                        {title}
                    </button>
                </h2>
            </div>

            <div
                id={`collapse${id}`}
                className={`collapse ${initialShow ? 'show' : ''}`}
                aria-labelledby={`heading${id}`}
                data-parent="#accordionExample"
            >
                <div className="card-body">
                    {content || 
                        "We follow strict quality standards, sustainable farming methods, and hygienic processing practices to ensure fresh, safe, and reliable food products for our customers."
                    }
                </div>
            </div>
        </div>
    );
}
