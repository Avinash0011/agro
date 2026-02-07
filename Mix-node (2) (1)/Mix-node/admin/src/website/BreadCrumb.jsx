import { NavLink } from "react-router-dom";
export default function Breadcrumb({head,sub}){
  
    
   return(
    <>
     <section className="breadcrumb-area d-flex align-items-center" style={{backgroundImage:'url(website_assets/img/testimonial/test-bg.png)'}}>
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-xl-12 col-lg-12">
                            <div className="breadcrumb-wrap text-left">
                                <div className="breadcrumb-title">
                                    <h2>{head}</h2>    
                                    <div className="breadcrumb-wrap">
                              
                                <nav aria-label="breadcrumb">
                                    <ol className="breadcrumb">
                                        <li className="breadcrumb-item"><NavLink to="/">Home</NavLink></li>
                                        <li className="breadcrumb-item active" aria-current="page">{sub}</li>
                                    </ol>
                                </nav>
                            </div>
                                </div>
                            </div>
                        </div>
                        
                    </div>
                </div>
            </section>
    </>
   ); 
};