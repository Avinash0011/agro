import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './css/user.module.css';

function Faq() {
    const [faqList, setFaqList] = useState([]); // Renamed for clarity
    const [showModal, setShowModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    
    const [formData, setFormData] = useState({
        question: '',
        answer: '',
        hidden_id: ''
    });

    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/faq');
            setFaqList(response.data.faqs || []);
        } catch (error) {
            console.error("Error fetching FAQs:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleOpenModal = () => {
        setFormData({ question: '', answer: '', hidden_id: '' });
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setFormData({ question: '', answer: '', hidden_id: '' });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const onFormSubmit = async (e) => {
        e.preventDefault();
        
        // Use JSON for FAQ (no images needed)
        const payload = {
            question: formData.question,
            answer: formData.answer,
            hidden: formData.hidden_id
        };

        try {
            const response = await axios.post('http://localhost:5000/api/faq', payload);

            if (response.data.type === true) {
                alert(response.data.message);
                handleCloseModal();
                fetchData();
            }
        } catch (error) {
            setErrorMessage(error.response?.data?.message || "Error saving FAQ");
        }
    };

    const deleteFaq = async (id) => {
        if (window.confirm("Delete this FAQ?")) {
            try {
                const response = await axios.post(`http://localhost:5000/api/faq`, { del: id });
                if (response.data.type === true) {
                    alert(response.data.message);
                    fetchData();
                }
            } catch (error) {
                console.error('Error deleting:', error);
            }
        }
    };

    // FIXED EDIT FUNCTION
    const editFaq = async (id) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/faq/${id}`);
            if (response.data.type === 'true') {
                // Accessing the first element of the array [0]
                const item = response.data.faqs[0]; 
                
                setFormData({
                    question: item.Question,
                    answer: item.Answer,
                    hidden_id: item._id
                });
                setShowModal(true);
            }
        } catch (error) {
            console.error('Error fetching FAQ:', error);
        }
    };

    return (
        <div>
            {showModal && (
                <div className={styles.add_modal} style={{ display: 'block' }}>
                    <div id={styles.add_category}>
                        <div className={styles.heading_name}>
                            <span className={styles.close} onClick={handleCloseModal}>&times;</span>
                            <b>{formData.hidden_id ? 'Edit' : 'Add'} FAQ</b>
                        </div>
                        <div className={styles.form_div}>
                            <form onSubmit={onFormSubmit}>
                                <label>Question</label>
                                <input 
                                    type="text" 
                                    name="question" 
                                    className="form-control mb-2"
                                    placeholder="Enter Question"
                                    value={formData.question}
                                    onChange={handleInputChange}
                                    required
                                />
                                
                                <label>Answer</label>
                                <textarea 
                                    name="answer" 
                                    className="form-control mb-2"
                                    placeholder="Enter Answer"
                                    value={formData.answer}
                                    onChange={handleInputChange}
                                    rows="3"
                                    required
                                />

                                <input type="hidden" name="hidden" value={formData.hidden_id} />
                                <button type="submit" className="btn btn-primary w-100">
                                    {formData.hidden_id ? 'Update FAQ' : 'Save FAQ'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            <div className="main-content app-content">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12" style={{ marginTop: '20px' }}>
                            <div className="card custom-card">
                                <div className="card-body">
                                    <button className="btn btn-primary mb-3" style={{ float: 'right' }} onClick={handleOpenModal}>
                                        <i className="ri-add-line"></i> Add FAQ
                                    </button>
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>Sr.No.</th>
                                                <th>Question</th>
                                                <th>Answer</th>
                                                <th className="text-center">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {faqList.map((item, index) => (
                                                <tr key={item._id}>
                                                    <td>{index + 1}</td>
                                                    <td>{item.Question}</td>
                                                    <td>{item.Answer}</td>
                                                    <td>
                                                        <div className="hstack gap-2 justify-content-center">
                                                            <button className="btn btn-sm btn-danger-light" onClick={() => deleteFaq(item._id)}>
                                                                <i className="ri-delete-bin-line"></i>
                                                            </button>
                                                            <button className="btn btn-sm btn-primary-light" onClick={() => editFaq(item._id)}>
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

export default Faq;