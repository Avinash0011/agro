import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './css/user.module.css';

function Settings() {
    const [formData, setFormData] = useState({
        // CONTACT DETAILS
        mobile: '', email: '', website_name: '', address: '', timing: '',
        // ABOUT US
        about_heading: '', about_subheading: '', about_desc: '',
        mission: '', vision: '',
        desc_one: '', desc_two: '', desc_three: '',
        // STATS
        stat_h1: '', stat_c1: '', stat_h2: '', stat_c2: '',
        stat_h3: '', stat_c3: '', stat_h4: '', stat_c4: '',
        // BANNER
        banner_small: '', banner_big: '', banner_desc: ''
    });

    // Fetch existing data on load to pre-fill form
    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/settings');
                if (res.data.data) {
                    setFormData(res.data.data);
                }
            } catch (err) { console.error("Error fetching settings", err); }
        };
        fetchConfig();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData(e.target);
        // Append current hidden ID if exists for update logic
        if (formData._id) data.append('id', formData._id);

        try {
            const res = await axios.post('http://localhost:5000/api/settings', data);
            alert(res.data.message || "Settings Updated Successfully!");
        } catch (err) { console.error(err); }
    };

    return (
        <div className="main-content app-content">
            <div className="container-fluid">
                <div className="card custom-card my-4">
                    <div className="card-header justify-content-between">
                        <div className="card-title">Website Configuration Manager</div>
                    </div>
                    <form className="card-body" onSubmit={handleSubmit} encType="multipart/form-data">
                        
                        {/* --- CONTACT SECTION --- */}
                        <h5 className="text-primary mb-3">Contact Details</h5>
                        <div className="row mb-4">
                            
                            <div className="col-md-4 mb-3">
                                <label className="form-label">Mobile Number</label>
                                <input type="text" name="mobile" className="form-control" value={formData.mobile} onChange={handleChange} />
                            </div>
                            <div className="col-md-4 mb-3">
                                <label className="form-label">Email Address</label>
                                <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} />
                            </div>
                            <div className="col-md-4 mb-3">
                                <label className="form-label">Operational Timing</label>
                                <input type="text" name="timing" className="form-control" value={formData.timing} onChange={handleChange} placeholder="e.g. Mon-Sat 9am - 6pm" />
                            </div>
                            <div className="col-md-12">
                                <label className="form-label">Full Address</label>
                                <textarea name="address" className="form-control" value={formData.address} onChange={handleChange} rows="2"></textarea>
                            </div>
                        </div>

                        <hr className="my-4" />

                        {/* --- ABOUT US SECTION --- */}
                        <h5 className="text-primary mb-3">About Us Section</h5>
                        <div className="row mb-4">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Heading</label>
                                <input type="text" name="about_heading" className="form-control" value={formData.about_heading} onChange={handleChange} />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Subheading</label>
                                <input type="text" name="about_subheading" className="form-control" value={formData.about_subheading} onChange={handleChange} />
                            </div>
                            <div className="col-md-12 mb-3">
                                <label className="form-label">Main Description</label>
                                <textarea name="about_desc" className="form-control" value={formData.about_desc} onChange={handleChange} rows="3"></textarea>
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Our Mission</label>
                                <textarea name="mission" className="form-control" value={formData.mission} onChange={handleChange} rows="2"></textarea>
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Our Vision</label>
                                <textarea name="vision" className="form-control" value={formData.vision} onChange={handleChange} rows="2"></textarea>
                            </div>
                            <div className="col-md-4 mb-3"><label className="form-label">Extra Desc 1</label><textarea name="desc_one" className="form-control" value={formData.desc_one} onChange={handleChange}></textarea></div>
                            <div className="col-md-4 mb-3"><label className="form-label">Extra Desc 2</label><textarea name="desc_two" className="form-control" value={formData.desc_two} onChange={handleChange}></textarea></div>
                            <div className="col-md-4 mb-3"><label className="form-label">Extra Desc 3</label><textarea name="desc_three" className="form-control" value={formData.desc_three} onChange={handleChange}></textarea></div>
                        </div>

                        <hr className="my-4" />

                        {/* --- STATS SECTION --- */}
                        <h5 className="text-primary mb-3">Statistics (Counts)</h5>
                        <div className="row mb-4">
                            {[1, 2, 3, 4].map(num => (
                                <React.Fragment key={num}>
                                    <div className="col-md-3 mb-3">
                                        <label className="form-label">Stat {num} Heading</label>
                                        <input type="text" name={`stat_h${num}`} className="form-control" value={formData[`stat_h${num}`]} onChange={handleChange} placeholder="e.g. Clients" />
                                    </div>
                                    <div className="col-md-3 mb-3">
                                        <label className="form-label">Stat {num} Count</label>
                                        <input type="number" name={`stat_c${num}`} className="form-control" value={formData[`stat_c${num}`]} onChange={handleChange} placeholder="e.g. 500" />
                                    </div>
                                </React.Fragment>
                            ))}
                        </div>

                        <hr className="my-4" />

                        {/* --- BANNER SECTION --- */}
                        <h5 className="text-primary mb-3">Home Banner Section</h5>
                        <div className="row mb-4">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Small Heading</label>
                                <input type="text" name="banner_small" className="form-control" value={formData.banner_small} onChange={handleChange} />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Main Big Heading</label>
                                <input type="text" name="banner_big" className="form-control" value={formData.banner_big} onChange={handleChange} />
                            </div>
                            <div className="col-md-12">
                                <label className="form-label">Banner Description</label>
                                <textarea name="banner_desc" className="form-control" value={formData.banner_desc} onChange={handleChange} rows="2"></textarea>
                            </div>
                        </div>

                        <div className="card-footer text-end">
                            <button type="submit" className="btn btn-lg btn-success shadow">Update Website Content</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Settings;