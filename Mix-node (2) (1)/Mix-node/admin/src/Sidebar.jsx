import { NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import React from 'react';
function Sidebar(){
      const navigate = useNavigate();
    const logout = async (e) => {
        e.preventDefault();
        try {
          const token = localStorage.getItem('jwtToken'); // Get token from storage
          await axios.post('http://localhost:5000/api/logout', null, { // Send null payload
            headers: {
              Authorization: `Bearer ${token}` // Include token in Authorization header
            }
          });
      
          localStorage.removeItem('jwtToken');
          navigate('/login');
        } catch (error) {
          console.error('Error logging out:', error);
          // Handle logout errors gracefully
        }
      };
      
return(
    <aside className="app-sidebar sticky" id="sidebar">

    {/*Start::main-sidebar-header */}
    <div className="main-sidebar-header">
        <NavLink to="/" className="header-logo">
            <img src="/build/assets/images/brand-logos/desktop-logo.png" alt="logo" className="desktop-logo"/>
            <img src="/build/assets/images/brand-logos/toggle-logo.png" alt="logo" className="toggle-logo"/>
            <img src="/logo.png" alt="logo" className="desktop-dark"/>
            <img src="/build/assets/images/brand-logos/toggle-dark.png" alt="logo" className="toggle-dark"/>
            <img src="/build/assets/images/brand-logos/desktop-white.png" alt="logo" className="desktop-white"/>
            <img src="/build/assets/images/brand-logos/toggle-white.png" alt="logo" className="toggle-white"/>
        </NavLink>
    </div>
    {/*End::main-sidebar-header */}

    {/*Start::main-sidebar */}
    <div className="main-sidebar" id="sidebar-scroll">

                   {/* Start::nav */}
                    <nav className="main-menu-container nav nav-pills flex-column sub-open">
                        <div className="slide-left" id="slide-left">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="#7b8191" width="24" height="24" viewBox="0 0 24 24"> <path d="M13.293 6.293 7.586 12l5.707 5.707 1.414-1.414L10.414 12l4.293-4.293z"></path> </svg>
                        </div>
                        <ul className="main-menu">
                           {/* Start::slide__category */}
                            <li className="slide__category"><span className="category-name">Main</span></li>
                           {/* End::slide__category */}

                           {/* Start::slide */}
                            <li className="slide has-sub">
                                <NavLink to="/admin/" className="side-menu__item">
                                    <i className="bx bx-home side-menu__icon"></i>
                                    <span className="side-menu__label">Dashboards</span>
                                   
                                </NavLink>
                                <ul className="slide-menu child1">
                                    <li className="slide side-menu__label1">
                                        <NavLink to="/admin/">Dashboards</NavLink>
                                    </li>  
                                </ul>
                            </li>
                           {/* End::slide */}
                           <li className="slide">
                               <NavLink to="setting" className="side-menu__item">
                               <i class="bx bx-medal side-menu__icon"></i>
                               <span class="side-menu__label">Basic Settings</span>
                               </NavLink>
                            </li>
                            <li className="slide">
                               <NavLink to="blog" className="side-menu__item">
                               <i class="bx bx-medal side-menu__icon"></i>
                               <span class="side-menu__label">Blogs</span>
                               </NavLink>
                            </li>
                             <li className="slide">
                               <NavLink to="faq" className="side-menu__item">
                               <i class="bx bx-medal side-menu__icon"></i>
                               <span class="side-menu__label">FAQ</span>
                               </NavLink>
                            </li>
                            <li className="slide">
                               <NavLink to="service" className="side-menu__item">
                                <i class="bx bx-medal side-menu__icon"></i>
                               <span class="side-menu__label">Services</span>
                               </NavLink>
                            </li>
                            <li className="slide">
                               <NavLink to="product" className="side-menu__item">
                               <i class="bx bx-gift side-menu__icon"></i>
                               <span class="side-menu__label">Products</span>
                               </NavLink>
                            </li>
                            <li className="slide">
                               <NavLink to="testimonial" className="side-menu__item">
                               <i class="bi bi-bag side-menu__icon"></i>
                               <span class="side-menu__label">Testimonial</span>
                               </NavLink>
                            </li>
                            <li className="slide">
                               <NavLink onClick={logout} className="side-menu__item">
                               <i class="bi bi-logout side-menu__icon"></i>
                               <span class="side-menu__label">Logout</span>
                               </NavLink>
                            </li>
                           
                        </ul>
                        <div className="slide-right" id="slide-right"><svg xmlns="http://www.w3.org/2000/svg" fill="#7b8191" width="24" height="24" viewBox="0 0 24 24"> <path d="M10.707 17.707 16.414 12l-5.707-5.707-1.414 1.414L13.586 12l-4.293 4.293z"></path> </svg></div>
                    </nav>
                   {/* End::nav */}

                </div>
    {/*End::main-sidebar */}

</aside>
);
}

export default Sidebar;