import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './css/user.module.css';

function Services() {
    const [servicesList, setServicesList] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    
    // Form State
    const [formData, setFormData] = useState({
        service_name: '',
        description: '',
        hidden_id: ''
    });
    const [selectedFile, setSelectedFile] = useState(null);

    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/get-services');
            setServicesList(response.data.services || []);
        } catch (error) {
            console.error("Error fetching services:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleOpenModal = () => {
        setFormData({ service_name: '', description: '', hidden_id: '' });
        setSelectedFile(null);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setFormData({ service_name: '', description: '', hidden_id: '' });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const onFormSubmit = async (e) => {
        e.preventDefault();
        
        // Use FormData for file uploads
        const data = new FormData();
        data.append('service_name', formData.service_name);
        data.append('description', formData.description);
        data.append('hidden', formData.hidden_id);
        if (selectedFile) {
            data.append('photo', selectedFile);
        }

        try {
            const response = await axios.post('http://localhost:5000/api/services', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (response.data.type === true) {
                alert(response.data.message);
                handleCloseModal();
                fetchData();
            }
        } catch (error) {
            setErrorMessage(error.response?.data?.message || "Error saving service");
        }
    };

    const deleteService = async (id) => {
        if (window.confirm("Delete this service?")) {
            try {
                const response = await axios.post(`http://localhost:5000/api/services`, { del: id });
                if (response.data.type === true) {
                    alert(response.data.message);
                    fetchData();
                }
            } catch (error) {
                console.error('Error deleting:', error);
            }
        }
    };

    const editService = async (id) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/services/${id}`);
            if (response.data.type === 'true') {
                const data = response.data.service;
                setFormData({
                    service_name: data.Service_name,
                    description: data.Description,
                    hidden_id: data._id
                });
                setShowModal(true);
            }
        } catch (error) {
            console.error('Error fetching service:', error);
        }
    };

    return (
        <div>
            {showModal && (
                <div className={styles.add_modal} style={{ display: 'block' }}>
                    <div id={styles.add_category}>
                        <div className={styles.heading_name}>
                            <span className={styles.close} onClick={handleCloseModal}>&times;</span>
                            <b>{formData.hidden_id ? 'Edit' : 'Add'} Service</b>
                        </div>
                        <div className={styles.form_div}>
                            <form onSubmit={onFormSubmit}>
                                <label>Service Name</label>
                                <input 
                                    type="text" 
                                    name="service_name" 
                                    className="form-control mb-2"
                                    placeholder="e.g. Web Development"
                                    value={formData.service_name}
                                    onChange={handleInputChange}
                                    required
                                />
                                
                                <label>Description</label>
                                <textarea 
                                    name="description" 
                                    className="form-control mb-2"
                                    placeholder="Service details..."
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows="3"
                                />

                                <label>Service Image</label>
                                <input 
                                    type="file" 
                                    className="form-control mb-3"
                                    onChange={(e) => setSelectedFile(e.target.files[0])}
                                />

                                <input type="hidden" name="hidden" value={formData.hidden_id} />
                                <button type="submit" className="btn btn-primary w-100">
                                    {formData.hidden_id ? 'Update Service' : 'Save Service'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            <div className="main-content app-content">
                <div className="container-fluid">
                   
                    <div className="row">
                        <div className="col-12" style={{marginTop:'40px'}}>
                            <div className="card custom-card">
                                <div className="card-body">
                                     <button className="btn btn-primary" onClick={handleOpenModal}>
                                <i className="ri-add-line"></i> Add New Service
                            </button>
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>Sr.No.</th>
                                                <th>Service Name</th>
                                                <th>Description</th>
                                                <th className="text-center">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {servicesList.map((service, index) => (
                                                <tr key={service._id}>
                                                    <td>{index + 1}</td>
                                                    <td>{service.service_name}</td>
                                                    <td>{service.description?.substring(0, 50)}...</td>
                                                    <td>
                                                        <div className="hstack gap-2 justify-content-center">
                                                            <button className="btn btn-sm btn-danger-light" onClick={() => deleteService(service._id)}>
                                                                <i className="ri-delete-bin-line"></i>
                                                            </button>
                                                            <button className="btn btn-sm btn-primary-light" onClick={() => editService(service._id)}>
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
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Services;