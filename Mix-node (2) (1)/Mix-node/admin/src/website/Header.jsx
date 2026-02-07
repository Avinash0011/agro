
import { NavLink } from 'react-router-dom';
import { useState,useEffect } from 'react';
import axios from 'axios';
function Headers(){
      const [settings, setSettings] = useState([]);

    useEffect(() => {
        const fetchHomeData = async () => {
            try {
                const ress = await axios.get('http://localhost:5000/api/settings');
                setSettings(ress.data.data);

            
            } catch (error) {
                console.error("Error loading Home data", error);
            }
        };
        fetchHomeData();
    }, []);
const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };
 return(
<>    
        <header className="header-area header-three" >  
            <div className="header-top second-header d-none d-lg-block" style={{zIndex:'2'}}>
                <div className="container">
                    <div className="row align-items-center">  
                        <div className="col-lg-3 col-md-3 d-none d-lg-block">
                              <NavLink to="index-2.html"><img src="website_assets/img/logo/logo.png" alt="logo"/></NavLink>
                        </div>
                        <div className="col-lg-9 col-md-9 d-none  d-md-block text-right">
                            <div className="header-cta">
                                <ul> 
                                
                                     <li>
                                         <div className="text">
                                             <i className="far fa-phone-alt"></i> <div className="box">  <NavLink to={`tel:+91`+settings.mobile}>{settings.mobile}</NavLink></div>
                                        </div>                                      
                                    </li>
                                     <li>
                                          <div className="text">
                                           <i className="icon fal fa-envelope"></i>
                                              <div className="box">  
                                                  <NavLink to={`tel:+91`+settings.email}>{settings.email}</NavLink>
                                              </div>
                                        </div>   
                                        
                                    </li>
                                </ul>
                            </div>
                        </div>
                         
                        
                    </div>
                </div>
            </div>
			<div id="header-sticky" className="menu-area" style={{zIndex:'2'}}>
                <div className="container">
                    <div className="second-menu">
                        <div className="row align-items-center">
                              <div className="col-lg-6 col-sm-4 d-block d-lg-none">
                              <NavLink to="/" className="logo"><img src="website_assets/img/logo/logo.png" alt="logo"/></NavLink>
                        </div>
                        
                            <div className="col-xl-8 col-lg-8">
                              
                                <div className="main-menu">
                                    <nav id="mobile-menu">
                                        <ul>
                                            <li>
												<NavLink to="/">Home</NavLink>
											</li>
                                            <li><NavLink to="/about">About Us</NavLink></li>
                                            <li> 
                                              <NavLink to="/service">Services</NavLink>
                                            </li>
                                           
											<li> 
                                                <NavLink to="/blog">Blog</NavLink>
                                            </li>
                                                                        
										
                                            <li><NavLink to="/contact">Contact</NavLink></li>                                               
                                        </ul>
                                    </nav>
                                </div>
                            </div> 
                          
                            {/* Mobile Menu Trigger (The 3 Lines / X) */}
                                <div className="col-12 d-block d-lg-none">
                                    <div className="mobile-menu mean-container">
                                        <div className="mean-bar">
                                            <a 
                                                onClick={toggleMenu} 
                                                className="meanmenu-reveal" 
                                                style={{ right: "0px", left: "auto", textAlign: "center", background: "none",color: "white", fontSize: "18px", cursor: "pointer" }}
                                            >
                                                {isMenuOpen ? "X" : <i className="fas fa-bars"></i>}
                                            </a>
                                            
                                            {/* Mobile Nav Links - Only shows when isMenuOpen is true */}
                                            <nav className="mean-nav" style={{ display: isMenuOpen ? 'block' : 'none' }}>
                                                <ul>
                                                    <li><NavLink to="/" onClick={() => setIsMenuOpen(false)}>Home</NavLink></li>
                                                    <li><NavLink to="/about" onClick={() => setIsMenuOpen(false)}>About Us</NavLink></li>
                                                    <li><NavLink to="/service" onClick={() => setIsMenuOpen(false)}>Services</NavLink></li>
                                                    <li><NavLink to="/blog" onClick={() => setIsMenuOpen(false)}>Blog</NavLink></li>
                                                    <li><NavLink to="/contact" onClick={() => setIsMenuOpen(false)}>Contact</NavLink></li>
                                                </ul>
                                            </nav>
                                        </div>
                                    </div>
                                </div>
                                {/* End Mobile Menu */}
                        </div>
                    </div>
                </div>
            </div>
        </header>
     
   
</>
);
}
export default Headers;