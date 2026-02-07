import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './css/user.module.css';

function Testimonial() {
    const [list, setList] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const [formData, setFormData] = useState({
        name: '',
        post: '',
        description: '',
        hidden_id: ''
    });

    const fetchData = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/testimonials');
            setList(res.data.data || []);
        } catch (err) { console.error("Fetch error:", err); }
    };

    useEffect(() => { fetchData(); }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleOpenModal = () => {
        setFormData({ name: '', post: '', description: '', hidden_id: '' });
        setIsModalOpen(true);
    };

    const onFormSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('name', formData.name);
        data.append('post', formData.post);
        data.append('feedback', formData.description); // Ensure key matches backend
        data.append('hidden', formData.hidden_id);
        
        if (e.target.photo.files[0]) {
            data.append('photo', e.target.photo.files[0]);
        }

        try {
            const res = await axios.post('http://localhost:5000/api/testimonial', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            if (res.data.type === true) {
                alert(res.data.message);
                setIsModalOpen(false);
                fetchData();
            }
        } catch (err) { console.error("Submit error:", err); }
    };

    // --- DELETE FUNCTION ---
    const deleteTestimonial = async (id) => {
        if (window.confirm("Are you sure you want to delete this testimonial?")) {
            try {
                const res = await axios.post(`http://localhost:5000/api/testimonial`, { del: id });
                if (res.data.type === true) {
                    alert(res.data.message);
                    fetchData();
                }
            } catch (err) { console.error("Delete error:", err); }
        }
    };

    // --- EDIT FUNCTION ---
    const editTestimonial = async (id) => {
        try {
            const res = await axios.get(`http://localhost:5000/api/testimonials/${id}`);
            if (res.data.type === 'true' || res.data.type === true) {
                const item = res.data.data[0]; 
                setFormData({
                    name: item.name,
                    post: item.post,
                    description: item.feedback,
                    hidden_id: item._id
                });
                setIsModalOpen(true);
            }
        } catch (err) { console.error("Edit fetch error:", err); }
    };

    return (
        <>
        {isModalOpen && (
                <div className={styles.add_modal} style={{display: 'block'}}>
                    <div id={styles.add_category}>
                        <div className={styles.heading_name}>
                             <span className={styles.close} onClick={() => setIsModalOpen(false)}>&times;</span>
                             <b>{formData.hidden_id ? 'Edit' : 'Add'} Testimonial</b>
                        </div>
                        <form className="p-3" onSubmit={onFormSubmit}>
                            <label>Client Name</label>
                            <input type="text" name="name" className="form-control mb-2" value={formData.name} onChange={handleInputChange} required />
                            
                            <label>Client Post</label>
                            <input type="text" name="post" className="form-control mb-2" value={formData.post} onChange={handleInputChange} required />
                            
                            <label>Feedback</label>
                            <textarea name="description" className="form-control mb-2" value={formData.description} onChange={handleInputChange} rows="3" required></textarea>
                            
                            <label>Client Image {formData.hidden_id && "(Leave blank to keep current)"}</label>
                            <input type="file" name="photo" className="form-control mb-2" />
                            
                            <button type="submit" className="btn btn-success w-100 mt-2">
                                {formData.hidden_id ? 'Update' : 'Save'} Testimonial
                            </button>
                        </form>
                    </div>
                </div>
            )}

        <div className="main-content app-content">
            <div className="container-fluid">
                <button className="btn btn-primary my-4" onClick={handleOpenModal}>Add Testimonial</button>
                <div className="card custom-card">
                    <div className="card-body">
                        <table className="table table-bordered align-middle">
                            <thead>
                                <tr>
                                    <th>Photo</th>
                                    <th>Name</th>
                                    <th>Post</th>
                                    <th>Feedback</th>
                                    <th className="text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {list.map((item) => (
                                    <tr key={item._id}>
                                        <td>
                                            <img src={`/uploads/${item.photo}`} alt="client" width="50" height="50" style={{borderRadius: '50%', objectFit: 'cover'}} />
                                        </td>
                                        <td>{item.name}</td>
                                        <td>{item.post}</td>
                                        <td style={{maxWidth: '300px'}}>{item.feedback}</td>
                                        <td>
                                            <div className="hstack gap-2 justify-content-center">
                                                <button className="btn btn-sm btn-info-light" onClick={() => editTestimonial(item._id)}>
                                                    <i className="ri-edit-line"></i>
                                                </button>
                                                <button className="btn btn-sm btn-danger-light" onClick={() => deleteTestimonial(item._id)}>
                                                    <i className="ri-delete-bin-line"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}

export default Testimonial;