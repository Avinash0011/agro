import '../Components/css/swiper-bundle.min.css';
import Swal from 'sweetalert2'

import CreatePassword from '../Components/css/show-password';
import React , {useState} from 'react';
import axios from 'axios';
import { useNavigate,NavLink } from 'react-router-dom';

function Login(){
    const passwordVisibility = CreatePassword('password'); // Use for password field
  
        const [errorMessage, setErrorMessage] = useState(null);
    //    const [successMessage, setSuccessMessage] = useState(null);
        const navigate = useNavigate();
        
// form submit in register
      const FormSubmit = async (e) =>{
          e.preventDefault();
          const phone = e.target.phone.value;
          const password = e.target.password.value;
          
          
          if(phone=='' || password==''){
            alert("Please fill all details");
            return false;
          }
        // try and catch method
            try {
              const response = await axios.post('http://localhost:5000/login_form', {
                phone: e.target.phone.value, // Get value from phone input
                password: e.target.password.value, // Get value from password input
              });
             
                //setSuccessMessage(response.data.message); // Set success message
             
                if (response.data.type==true) {
                    localStorage.setItem('jwtToken', response.data.token);
                    //console.log(response.data.token);
                    Swal.fire({
                        position: "top-center",
                        icon: "success",
                        title: "Successfully Login",
                        showConfirmButton: false,
                        timer: 1500
                    });
                  setTimeout(()=>{
                    navigate('/admin/'); // Redirect to admin page
                  },2000);
                    
                }
            } catch (error) {
              setErrorMessage(error.response?.data?.message); // Handle errors with informative messages
            }
      };

return(
<div > 
<div className="row authentication mx-0">

<div className="col-xxl-7 col-xl-7 col-lg-12">
   <div className="row justify-content-center align-items-center h-100">
        <div className="col-xxl-8 col-xl-8 col-lg-7 col-md-7 col-sm-8 col-12">
            <div className="p-5" style={{padding:'3rem'}}>
                <div className="mb-3">
                    <a href="/">
                        <img src="/logo.png" className="authentication-brand desktop-logo"/>
                        <img src="/logo.png" className="authentication-brand desktop-dark"/>
                    </a>
                </div>
               <p className="h5 fw-semibold mb-2">Sign In</p>
                
            <form method="post"  onSubmit={FormSubmit} id='login_form'>
                <div className="row gy-3">
                    <div className="col-xl-12">
                        <label htmlFor="signup-lastname" className="form-label text-default">Mobile Number</label>
                        <input type="tel" className="form-control form-control-lg" id="phone" placeholder="Enter the mobile Number" name="phone"/>
                    </div>
                    <div className="col-xl-12">
                        <label htmlFor="password" className="form-label text-default">Password</label>
                        <div className="input-group">
                            <input type={passwordVisibility.isVisible?'text':'password'} className="form-control form-control-lg" id="password" placeholder="Password" name="password"/>
                            <button className="btn btn-light" onClick={passwordVisibility.toggleVisibility}
                            type="button" id="button-addon2"><i className={passwordVisibility.isVisible?'ri-eye-line align-middle':'ri-eye-off-line align-middle'}></i></button>
                        </div>
                    </div>
                   <div className="col-xl-12 d-grid mt-2">
                    
                    <button type="submit" className="btn btn-primary">Log in</button>
                    </div>
                </div>
            </form>
                <div className="text-center">
                    <p className="fs-12 text-muted mt-4">Sign for an account? <NavLink to="/register" className="text-primary">Sign Up</NavLink></p>
                </div>
            </div>
        </div>
    </div>
</div>
<div className="col-xxl-5 col-xl-5 col-lg-5 d-xl-block d-none px-0">
    <div className="authentication-cover">
        <div className="aunthentication-cover-content rounded">
            <div className="swiper keyboard-control">
                <div className="swiper-wrapper">
                    <div className="swiper-slide">
                        <div className="text-fixed-white text-center p-5 d-flex align-items-center justify-content-center">
                            <div>
                                <div className="mb-5">
                                    <img src="build/assets/images/authentication/2.png" className="authentication-image" alt=""/>
                                </div>
                                <h6 className="fw-semibold text-fixed-white">Sign Up</h6>
                                <p className="fw-normal fs-14 op-7"> Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ipsa eligendi expedita aliquam quaerat nulla voluptas facilis. Porro rem voluptates possimus, ad, autem quae culpa architecto, quam labore blanditiis at ratione.</p>
                            </div>
                        </div>
                    </div>
                    <div className="swiper-slide">
                        <div className="text-fixed-white text-center p-5 d-flex align-items-center justify-content-center">
                            <div>
                                <div className="mb-5">
                                    <img src="build/assets/images/authentication/3.png" className="authentication-image" alt=""/>
                                </div>
                                <h6 className="fw-semibold text-fixed-white">Sign Up</h6>
                                <p className="fw-normal fs-14 op-7"> Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ipsa eligendi expedita aliquam quaerat nulla voluptas facilis. Porro rem voluptates possimus, ad, autem quae culpa architecto, quam labore blanditiis at ratione.</p>
                            </div>
                        </div>
                    </div>
                    <div className="swiper-slide">
                        <div className="text-fixed-white text-center p-5 d-flex align-items-center justify-content-center">
                            <div>
                                <div className="mb-5">
                                    <img src="build/assets/images/authentication/2.png" className="authentication-image" alt=""/>
                                </div>
                                <h6 className="fw-semibold text-fixed-white">Sign Up</h6>
                                <p className="fw-normal fs-14 op-7"> Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ipsa eligendi expedita aliquam quaerat nulla voluptas facilis. Porro rem voluptates possimus, ad, autem quae culpa architecto, quam labore blanditiis at ratione.</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="swiper-button-next"></div>
                <div className="swiper-button-prev"></div>
                <div className="swiper-pagination"></div>
            </div>
        </div>
    </div>
</div>

</div>

</div>

);
};
export default Login;