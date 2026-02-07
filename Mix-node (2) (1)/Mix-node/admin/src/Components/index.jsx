import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Ensure axios is installed

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalBlogs: 0,
        totalTestimonials: 0,
        totalServices: 0,
        totalFaq: 0,
        totalProducts: 0,
        vegProducts: 0,
        fruitProducts: 0
    });
    const [queries, setQueries] = useState([]);
    const [loading, setLoading] = useState(true);

    // 1. Function to Fetch Data
    const getDashboardData = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/dashboard');
            if (response.data) {
                setStats(response.data.stats);
                setQueries(response.data.queries);
            }
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        } finally {
            setLoading(false);
        }
    };

    // 2. Function to Delete an Inquiry (Matches your backend 'del' logic)
    const deleteInquiry = async (id) => {
        if (window.confirm("Are you sure you want to delete this inquiry?")) {
            try {
                const response = await axios.post('/api/contact', { del: id });
                if (response.data.type) {
                    // Refresh data after deletion
                    getDashboardData();
                }
            } catch (error) {
                console.error("Error deleting inquiry:", error);
            }
        }
    };

    useEffect(() => {
        getDashboardData();
    }, []);

    if (loading) return <div className="p-5 text-center">Loading Dashboard...</div>;
return(
<div>
    {/* MAIN-CONTENT */}

            <div className="main-content app-content">

                
                <div className="container-fluid">

                    {/* Start::row-1 - Statistics */}
            <div className="row ">
                <div className="col-xxl-12 col-xl-12 mt-4">
                    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 row-cols-xxl-4 g-3">
                        
                        {/* Blogs Card */}
                        <div className="col">
                            <div className="card custom-card">
                                <div className="card-body">
                                    <div className="d-flex align-items-top">
                                        <div className="me-3">
                                            <span className="avatar avatar-md p-2 bg-primary">
                                                <i className="ri-edit-box-line fs-18"></i>
                                            </span>
                                        </div>
                                        <div className="flex-fill">
                                            <h5 className="fw-semibold mb-0 lh-1">{stats.totalBlogs}</h5>
                                            <p className="mb-0 fs-10 op-7 text-muted fw-semibold mt-2">TOTAL BLOGS</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Testimonials Card */}
                        <div className="col">
                            <div className="card custom-card">
                                <div className="card-body">
                                    <div className="d-flex align-items-top">
                                        <div className="me-3">
                                            <span className="avatar avatar-md p-2 bg-secondary">
                                                <i className="ri-chat-quote-line fs-18"></i>
                                            </span>
                                        </div>
                                        <div className="flex-fill">
                                            <h5 className="fw-semibold mb-0 lh-1">{stats.totalTestimonials}</h5>
                                            <p className="mb-0 fs-10 op-7 text-muted fw-semibold mt-2">TOTAL TESTIMONIALS</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Products Card (Combined Veg/Fruit) */}
                        <div className="col">
                            <div className="card custom-card">
                                <div className="card-body">
                                    <div className="d-flex align-items-top">
                                        <div className="me-3">
                                            <span className="avatar avatar-md p-2 bg-success">
                                                <i className="ri-shopping-basket-line fs-18"></i>
                                            </span>
                                        </div>
                                        <div className="flex-fill">
                                            <div className="d-flex justify-content-between">
                                                <h5 className="fw-semibold mb-0 lh-1">{stats.totalProducts}</h5>
                                            </div>
                                            <p className="mb-0 fs-10 op-7 text-muted fw-semibold mt-2">TOTAL PRODUCTS</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                         <div className="col">
                            <div className="card custom-card">
                                <div className="card-body">
                                    <div className="d-flex align-items-top">
                                        <div className="me-3">
                                            <span className="avatar avatar-md p-2 bg-success">
                                                <i className="ri-shopping-basket-line fs-18"></i>
                                            </span>
                                        </div>
                                        <div className="flex-fill">
                                            <div className="d-flex justify-content-between">
                                                <h5 className="fw-semibold mb-0 lh-1">{stats.fruitProducts}</h5>
                                            </div>
                                            <p className="mb-0 fs-10 op-7 text-muted fw-semibold mt-2">FOOD PRODUCTS</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                         <div className="col">
                            <div className="card custom-card">
                                <div className="card-body">
                                    <div className="d-flex align-items-top">
                                        <div className="me-3">
                                            <span className="avatar avatar-md p-2 bg-success">
                                                <i className="ri-shopping-basket-line fs-18"></i>
                                            </span>
                                        </div>
                                         <div className="flex-fill">
                                            <div className="d-flex justify-content-between">
                                                <h5 className="fw-semibold mb-0 lh-1">{stats.vegProducts}</h5>
                                            </div>
                                            <p className="mb-0 fs-10 op-7 text-muted fw-semibold mt-2">VEGETABLES PRODUCTS</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* FAQ/Services Card */}
                        <div className="col">
                            <div className="card custom-card">
                                <div className="card-body">
                                    <div className="d-flex align-items-top">
                                        <div className="me-3">
                                            <span className="avatar avatar-md p-2 bg-warning">
                                                <i className="ri-customer-service-2-line fs-18"></i>
                                            </span>
                                        </div>
                                        <div className="flex-fill">
                                            <h5 className="fw-semibold mb-0 lh-1">{stats.totalServices}</h5>
                                            <p className="mb-0 fs-10 op-7 text-muted fw-semibold mt-2">SERVICES</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col">
                            <div className="card custom-card">
                                <div className="card-body">
                                    <div className="d-flex align-items-top">
                                        <div className="me-3">
                                            <span className="avatar avatar-md p-2 bg-warning">
                                                <i className="ri-customer-service-2-line fs-18"></i>
                                            </span>
                                        </div>
                                        <div className="flex-fill">
                                            <h5 className="fw-semibold mb-0 lh-1">{stats.totalFaq}</h5>
                                            <p className="mb-0 fs-10 op-7 text-muted fw-semibold mt-2">FAQ</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            {/* End::row-1 */}

            {/* Start::row-2 - Contact Queries Table */}
            <div className="row mt-4">
                <div className="col-xl-12">
                    <div className="card custom-card overflow-hidden">
                        <div className="card-header justify-content-between">
                            <div className="card-title">Recent Contact Queries</div>
                            <div className="btn btn-sm btn-light">View All</div>
                        </div>
                        <div className="card-body p-0">
                            <div className="table-responsive">
                                <table className="table text-nowrap table-hover">
                                    <thead>
                                        <tr>
                                            <th scope="col">User Details</th>
                                            <th scope="col">Subject</th>
                                            <th scope="col">Comments</th>
                                            <th scope="col">Date</th>
                                            <th scope="col">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {queries.length > 0 ? queries.map((query, index) => (
                                            <tr key={index}>
                                                <td>
                                                    <div className="d-flex align-items-center">
                                                        <div className="me-2">
                                                            <span className="avatar avatar-sm avatar-rounded bg-light text-dark">
                                                                {query.name.charAt(0)}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <div className="fw-semibold">{query.name}</div>
                                                            <div className="fs-11 text-muted">{query.email} | {query.mobile}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td><span className="text-primary">{query.subject}</span></td>
                                                <td>
                                                    <span className="d-block text-truncate" style={{maxWidth: '250px'}}>
                                                        {query.comments}
                                                    </span>
                                                </td>
                                                <td>12, Oct 2023</td>
                                                <td>
                                                    <button className="btn btn-icon btn-sm btn-info-light me-2"><i className="ri-eye-line"></i></button>
                                                    <button className="btn btn-icon btn-sm btn-danger-light"><i className="ri-delete-bin-line"></i></button>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan="5" className="text-center p-4">No recent queries found.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* End::row-2 */}
                

                </div>


            </div> 
            {/* END MAIN-CONTENT */}
</div>
);
}

export default Dashboard;