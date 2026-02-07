import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './css/user.module.css';

function Blog() {
    const [blogs, setBlogs] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // Controlled Form State
    const [formData, setFormData] = useState({
        heading: '',
        author: '',
        date: '',
        description: '',
        hidden_id: ''
    });

    const fetchData = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/blog');
            setBlogs(res.data.blogs || []);
        } catch (err) { console.error(err); }
    };

    useEffect(() => { fetchData(); }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleOpenModal = () => {
        setFormData({ heading: '', author: '', date: '', description: '', hidden_id: '' });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('heading', formData.heading);
        data.append('author', formData.author);
        data.append('date', formData.date);
        data.append('description', formData.description);
        data.append('hidden', formData.hidden_id);
        
        // Handle file upload
        if (e.target.photo.files[0]) {
            data.append('photo', e.target.photo.files[0]);
        }

        try {
            const res = await axios.post('http://localhost:5000/api/blog', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            if (res.data.type) {
                alert(res.data.message);
                setIsModalOpen(false);
                fetchData();
            }
        } catch (err) { console.error(err); }
    };

    const deleteBlog = async (id) => {
        if (window.confirm("Delete this blog?")) {
            try {
                const response = await axios.post(`http://localhost:5000/api/blog`, { del: id });
                if (response.data.type === true) {
                    alert(response.data.message);
                    fetchData();
                }
            } catch (error) { console.error('Error deleting:', error); }
        }
    };

    const editBlog = async (id) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/blog/${id}`);
            if (response.data.type === 'true') {
                const data = response.data.blogs[0]; // Access first item in array
                setFormData({
                    heading: data.heading,
                    author: data.author,
                    date: data.date,
                    description: data.description,
                    hidden_id: data._id
                });
                setIsModalOpen(true);
            }
        } catch (error) { console.error('Error fetching blog:', error); }
    };

    return (
        <div>
            {isModalOpen && (
                <div className={styles.add_modal} style={{display: 'block'}}>
                    <div id={styles.add_category}>
                        <div className={styles.heading_name}>
                            <span className={styles.close} onClick={() => setIsModalOpen(false)}>&times;</span>
                            <b>{formData.hidden_id ? 'Edit Blog' : 'Add Blog'}</b>
                        </div>
                        <form className="p-3" onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="col-lg-6 mb-2">
                                    <label>Heading</label>
                                    <input type="text" name="heading" value={formData.heading} onChange={handleInputChange} className="form-control" required />
                                </div>
                                <div className="col-lg-6 mb-2">
                                    <label>Author Name</label>
                                    <input type="text" name="author" value={formData.author} onChange={handleInputChange} className="form-control" required />
                                </div>
                                <div className="col-lg-6 mb-2">
                                    <label>Date</label>
                                    <input type="date" name="date" value={formData.date} onChange={handleInputChange} className="form-control" required />
                                </div>
                                <div className="col-lg-6 mb-2">
                                    <label>Image (Leave blank to keep current)</label>
                                    <input type="file" name="photo" className="form-control" />
                                </div>
                                <div className="col-lg-12 mb-2">
                                    <label>Description</label>
                                    <textarea name="description" value={formData.description} onChange={handleInputChange} className="form-control" rows="3"></textarea>
                                </div>
                            </div>
                            <button type="submit" className="btn btn-primary mt-2">
                                {formData.hidden_id ? 'Update Blog' : 'Submit Blog'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <div className="main-content app-content">
                <button className="btn btn-primary my-3" onClick={handleOpenModal}>Add Blog</button>
                <table className="table border">
                    <thead>
                        <tr>
                            <th>Photo</th>
                            <th>Heading</th>
                            <th>Author</th>
                            <th>Date</th>
                            <th className="text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {blogs.map((item) => (
                            <tr key={item._id}>
                                <td><img src={`/uploads/${item.photo}`} width="50" height="50" style={{objectFit:'cover'}} alt="blog" /></td>
                                <td>{item.heading}</td>
                                <td>{item.author}</td>
                                <td>{item.date}</td>
                                <td>
                                    <div className="hstack gap-2 justify-content-center">
                                        <button className="btn btn-sm btn-danger-light" onClick={() => deleteBlog(item._id)}>
                                            <i className="ri-delete-bin-line"></i>
                                        </button>
                                        <button className="btn btn-sm btn-primary-light" onClick={() => editBlog(item._id)}>
                                            <i className="ri-edit-line"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
export default Blog;