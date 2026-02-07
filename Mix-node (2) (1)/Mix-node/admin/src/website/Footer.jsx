import { NavLink } from "react-router-dom";
import { useEffect,useState } from "react";
import axios from "axios";
function Footers(){
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
return(
<>
        <footer className="footer-bg footer-p" style={{background: 'url(website_assets/img/bg/footer-bg.png) no-repeat',backgroundSize: 'cover'}}>
            <div className="footer-top pt-60 pb-40">
                <div className="container">
                    <div className="row justify-content-between">
                        
                          <div className="col-xl-3 col-lg-3 col-sm-6">
                            <div className="footer-widget mb-30">
                                <div className="f-widget-title mb-30">
                                   <img src="website_assets/img/logo/f_logo.png" alt="img"/>
                                </div>
                                <p>
                                    Empowering local agriculture through sustainable farming and modern processing. At AgroFrams, we believe in a healthier future grown with care, transparency, and a deep respect for nature
                                </p>
                            </div>
                        </div>
						<div className="col-xl-2 col-lg-2 col-sm-6">
                            <div className="footer-widget mb-30">
                                <div className="f-widget-title">
                                    <h2>Our Links</h2>
                                </div>
                                <div className="footer-link">
                                    <ul>                                        
                                        <li><NavLink to="/">Home</NavLink></li>
                                        <li><NavLink to="/about"> About Us</NavLink></li>
                                        <li><NavLink to="/service"> Services </NavLink></li>
                                        <li><NavLink to="/contact"> Contact Us</NavLink></li>
                                        <li><NavLink to="/blog">Blog </NavLink></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-3 col-lg-3 col-sm-6">
                            <div className="footer-widget mb-30">
                                <div className="f-widget-title">
                                    <h2>Our Services</h2>
                                </div>
                                <div className="f-contact">
                                    <ul>
                                    <li>
                                        <i className="icon fal fa-phone"></i>
                                        <span>{settings.mobile}</span>
                                    </li>
                                   <li><i className="icon fal fa-envelope"></i>
                                        <span>
                                            <NavLink to={`mailto:`+settings.email}>{settings.email}</NavLink>
                                       </span>
                                    </li>
                                    <li>
                                        <i className="icon fal fa-map-marker-check"></i>
                                        <span>{settings.address}</span>
                                    </li>
                                    
                                </ul>
                                    
                                    </div>
                            </div>
                        </div>  
                       
                        
                    </div>
                </div>
            </div>
            <div className="copyright-wrap">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-6">                         
                               Copyright  © 2025 Agrofarm. All rights reserved.                       
                        </div>
                        <div className="col-lg-6 text-right text-xl-right">                       
                                     
                        </div>
                        
                    </div>
                </div>
            </div>
        </footer>
       <script src="website_assets/js/vendor/modernizr-3.5.0.min.js"></script>
        <script src="website_assets/js/vendor/jquery-1.12.4.min.js"></script>
        <script src="website_assets/js/popper.min.js"></script>
        <script src="website_assets/js/bootstrap.min.js"></script>
        <script src="website_assets/js/one-page-nav-min.js"></script>
        <script src="website_assets/js/slick.min.js"></script>
        <script src="website_assets/js/ajax-form.js"></script>
        <script src="website_assets/js/paroller.js"></script>
        <script src="website_assets/js/wow.min.js"></script>
        <script src="website_assets/js/js_isotope.pkgd.min.js"></script>
        <script src="website_assets/js/imagesloaded.min.js"></script>
        <script src="website_assets/js/parallax.min.js"></script>
        <script src="website_assets/js/jquery.waypoints.min.js"></script>
        <script src="website_assets/js/jquery.counterup.min.js"></script>
        <script src="website_assets/js/jquery.scrollUp.min.js"></script>
        <script src="website_assets/js/jquery.meanmenu.min.js"></script>
        <script src="website_assets/js/parallax-scroll.js"></script>
        <script src="website_assets/js/jquery.magnific-popup.min.js"></script>
        <script src="website_assets/js/element-in-view.js"></script>
        <script src="website_assets/js/main.js"></script>
</>
);
}

export default Footers;