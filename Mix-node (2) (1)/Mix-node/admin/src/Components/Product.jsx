import React, {useEffect,useState,useRef} from 'react';
import $ from 'jquery';
import axios from 'axios';
import styles from './css/user.module.css';
function Product(){

   const [errorMessage, setErrorMessage] = useState(null);
   //fetch data from database
   const [categories, setCategories] = useState([]); 
   const [subCategory,setSubCategory]=useState([]);
   const [Products, setProduct] = useState([]);
   const [productId, setProductId] = useState(''); 
  
// get updated data from the database
   const fetchData = async () => {
    const response = await axios.get('http://localhost:5000/api/product'); // Replace with your API endpoint
     setProduct(response.data.pro);
     setCategories(response.data.cate);
     setProductId(response.data.pid);
     
   };
   useEffect(() => {
    if($('#hidden').val()==""){
      $("#photo").attr("required",true);
     }else{
      $("#photo").attr("required",false);
     }
           // Add category modal show
              $('.btn-product').click(function() {
                fetchData();
                $('#category_n').val(''); 
                setSubCategory([]);
                $('#modal').fadeIn();
             });
         
             // Add category modal Hide
             $('#close').click(function() {
               $('#modal').css('display', 'none');
               $('#hidden').val('');
               $('#form_submit')[0].reset();
             });
   
           fetchData();
   }, []);
   
   
   
   // form submit in category
 const FormSubmit = async (e) =>{
  
             e.preventDefault();
             const formData = new FormData(e.target);
             // try and catch method
               try {
                 const response = await axios.post('http://localhost:5000/product',formData, {
                  headers: {
                    'Content-Type': 'multipart/form-data',
                  },
                 });
                
                if (response.data.type ==true) {
                   alert(response.data.message);
                   document.getElementById('form_submit').reset();
                    $("#hidden").val('');
                    $('#modal').hide();
                   fetchData();
                 }
               } catch (error) {
                 setErrorMessage(error.response?.data?.message); // Handle errors with informative messages
               }
   };
 
// sub category
   const GetSub = async (event) => {
    const sub = event.target.value;
    try {
      const response = await axios.get(`http://localhost:5000/api/product/getSub/${sub}`); // Ensure this matches your API endpoint
  
      if (response.data.type == true) {
        setSubCategory(response.data.sub); // Ensure 'sub' matches the backend response
      }else{
         setSubCategory([]);
      }
    } catch (error) {
      console.error('Error fetching subcategories:', error);
    }
  };

// delete the data from the category
const DeleteData = async (a) =>{
  a.preventDefault();
  const del= a.currentTarget.getAttribute('data-id');
  
  if(del){
  try{
    const response = await axios.post(`http://localhost:5000/product`,{
        del
    });
    if (response.data.type ==true) {
      alert(response.data.message);
      fetchData();
    }
  }
  catch(error){
    console.error('Error deleting category:', error);
  }

}
  
};

//edit the form
const EditData = async (a) =>{
  a.preventDefault();
  const edit= a.currentTarget.getAttribute('data-edit');
  if(edit){
  try{
    const response = await axios.get(`http://localhost:5000/api/product/${edit}`);

    if(response.data.type=='true'){
      $('#modal').fadeIn();
      $("#product_id").val(response.data.pro[0].Product_id);
      $("#product_n").val(response.data.pro[0].Product_name);
      $("#size").val(response.data.pro[0].Size);
      $("#qty").val(response.data.pro[0].Qty);
      $("#actual").val(response.data.pro[0].Actual_price);
      $("#mrp").val(response.data.pro[0].MRPs);
      var subb = response.data.pro[0].Category;
      var catt=response.data.pro[0].Sub_category;
      $("#category_n option").each(function() {
        if ($(this).val() == subb) {
            $(this).prop("selected", true);
        }
      });
	    
     setSubCategory(response.data.pro_sub.map(item => item.Sub_category));
     setTimeout(() => {
      $("#sub_cat option").each(function() {
        if ($(this).val() == catt) {
            $(this).prop("selected", true);
        }
      });
      }, 0); // Delay execution until the next event loop cycle

      $("#hidden").val(response.data.pro[0]._id);

      if($('#hidden').val()==""){
        $("#photo").attr("required",true);
      }else{
        $("#photo").attr("required",false);
       }

    }else{
      // modal can't show
    }
    
  }
  catch(error){
    console.error('Error deleting category:', error);
  }

}
  
};

  
return(
<div>
{/* modal */}
<div className={styles.add_modal} id="modal">
   <div id={styles.add_category}>  
                <div className={styles.heading_name}>
                          <span className={styles.close} id='close'>&#215;</span>
                          <b>Add Products</b>
                </div>
        <div className={styles.form_div}>
          <form id="form_submit" method="post" encType="multipart/form-data" onSubmit={FormSubmit}>
          	{/* First Row of products */}
            <div className="row">
                
               <div className="col-lg-4">
                <label>Product ID</label>
                   	<input type="text" name="product_id" id="product_id" value={(productId=='') ? '61000':productId} readOnly />
               </div>
                   	<div className="col-lg-4" >
                     {/* Category Input */}
                     <label htmlFor="category_n"> Category</label>
                      <select  id="category_n" name="category_n" required onChange={GetSub}>
                      <option value="" hidden={true}>Select Your Category</option>
                      <option value="Vegetables">Vegetables</option>
                      <option value="Fruit">Fruit</option>
                  </select>
                    </div>
          
                   <div className="col-lg-4">
                      <label htmlFor="product_n">Product Name</label>
                   	  <input type="text" name="product_n" id="product_n" placeholder="Product Name" required/>
                   </div>

                   <div className="col-lg-4">
                      <label htmlFor="qty">Product Qty</label>
                   	  <input type="number" name="qty" id="qty" placeholder="Quantity of the Product" required/>
                   </div>
           
                   <div className="col-lg-4">
                      <label htmlFor="actual">Actual Price</label>
                   	  <input type="text" name="actual" id="actual" placeholder="Actual Price of Product" required/>
                   </div>

                   <div className="col-lg-4">
                      <label htmlFor="MRP">MRP of Product</label>
                      <input type="text" name="mrp" id="mrp" placeholder="MRP of the Product" required/>
                   </div>

                   <div className="col-lg-4">
                      <label htmlFor="photo">Upload Product Image</label>
                      <input type="file" name="photo" id="photo"  className='form-control'/>
                   </div>
              </div>
                          
                       {/* input type hidden or submit button start */}
                           <input type="hidden" name="hidden" id="hidden" />
                           <input type="submit" name="submit" id="submit"/>
             </form>
          </div> 
   </div>
</div> 

{/* modal ends */}

{/* page starts */}
<div className="main-content app-content">
                 
                
                 <div className="container-fluid">
 
                     {/* Page Header */}
                     <div className="d-md-flex d-block align-items-center justify-content-between my-4 page-header-breadcrumb">
                         <h1 className="page-title fw-semibold fs-18 mb-0">Product</h1>
                         
                     </div>


 <div className="row" >
    <div className="col-xxl-12 col-xl-12">
      <div className="row row-cols-12">
         <div className="col">
              <div className="card custom-card" style={{paddingBottom:'40px'}}>
                 <div className="card-body">
                  <button className="btn btn-primary btn-product">Add Products</button> 
                   <div className="product_table">
                        <table className='table'>
                            <thead>
                                <tr>
                                    <th>Sr.No.</th>
                                    <th>Photo</th>
                                    <th>Category</th>
                                    <th>Product Name</th>
                                    <th>Product Qty</th>
                                    <th>Actual Price</th>
                                    <th>MRP</th>
                                    {/* <th>Product Image</th> */}
                                    <th ><center>Action</center></th>
                                </tr>
                        </thead>
                        <tbody>
                        {Products.map((pro,index)=>(
                                <tr key={pro._id}>
                                    <td>{index+1}</td>
                                    <td><img src={`/uploads/${pro.Photo}`} width="40px" height="40px"/></td>
                                    <td>{pro.Category}</td>
                                    <td>{pro.Product_name}</td>
                                    <td>{pro.Qty}</td>
                                    <td>{pro.Actual_price}</td>
                                    <td>{pro.MRPs}</td>
                                   
                                    <td className="btns">
                                    <div className="hstack gap-2 fs-15 justify-content-center">
                                          <a aria-label="anchor" href="javascript:void(0);" className="btn btn-icon btn-wave waves-effect waves-light btn-sm btn-danger-light delete-btn" data-id={pro._id} onClick={DeleteData}>
                                            <i className="ri-delete-bin-line"></i>
                                          </a>
                                          <a aria-label="anchor" href="javascript:void(0);" className="btn btn-icon btn-wave waves-effect waves-light btn-sm btn-primary-light edit-btn"  data-edit={pro._id} onClick={EditData}>
                                            <i className="ri-edit-line"></i>
                                          </a>
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



       
 </div>
 </div>

{/* page ends  */}



</div>
);
}
export default Product;