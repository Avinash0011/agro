const express=require("express");
const cors=require('cors');
const bodyParser= require('body-parser');
const app=express();
const crypto=require('crypto');
const path=require('path');
// const router=require("./router/auth_router");
const jwt = require('jsonwebtoken');
const fs=require('fs');
// const multer=require('multer');
const fileupload=require('express-fileupload');

const {MongoClient, ObjectId} = require('mongodb');
const client=new MongoClient('mongodb://localhost:27017'); // mongodb url connections


const superKey = "superKey";

app.use(cors());
app.use(fileupload({
  useTempFiles: true, 
  tempFileDir: '/tmp/', 
}));
app.use(bodyParser.json());


// function for current date and time
function DateTime(){
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split('T')[0];
    const  formattedTime = currentDate.toTimeString().split(' ')[0];

   return { formattedDate: formattedDate, formattedTime: formattedTime};
};

// database connection
async function connection(){
    const conn=await client.connect();
    const database=conn.db('done');
    return database;
}

// Function to generate JWT token
function generateAccessToken(phone) {
    const payload = {
      user: phone // Replace with your user data
     };
   return jwt.sign(payload, superKey);
   
}

app.post('/register', async (req,res)=>{
    const { firstName, phone, password} = req.body;
    const passwords = crypto.createHash('md5').update(req.body.password).digest('hex');
    const { formattedDate, formattedTime} = DateTime();
    const data = {
        "FirstName": firstName,
        "Mobile": phone,
        "password": passwords,
        "passkey":password,
        "currentDate": formattedDate,
        "currentTime": formattedTime
      };

      const database= await connection();
      const template=await database.collection('register').countDocuments({Mobile:phone});
    
      if(template>0){
          return res.send({message:'This mobile already registered',type:false});
      }else{
          database.collection("register").insertOne(data,(err,collection)=>{});
          return res.send({message:'Registered Successfully',type:true});
      }
 
});

app.post('/login_form', async (req,res)=>{
      const phone = req.body.phone;
      const password = crypto.createHash('md5').update(req.body.password).digest('hex');
      const { formattedDate, formattedTime} = DateTime();  
    
      const database= await connection();
      const user = await database.collection('register').findOne({ 'Mobile': phone, 'password': password });
      if(user){
          
          const tokenn = generateAccessToken(phone); // Generate JWT token
          const ip=req.ip;
        
          const token_data={
              "token":tokenn, 
              "ip":ip, 
              "username":phone,
               "status":"Active",
                "currentDate":formattedDate,
                "currentTime":formattedTime 
          }
          // updating the status of old session in token table of correct username or mobile number
          await database.collection('token').updateMany({$and:[{'username':phone},{'status':'Active'}]},{$set:{'status':'Inactive'}});
          // insert new row in the token for the security session or cookie
          await database.collection('token').insertOne(token_data);

          return res.send({message:'Login Successfully',type:true,token:tokenn});

      }else{
          return res.send({message:'Mobile & password do not match',type:false});
      }
});

// check session is valid or invalid
app.post('/api/check-session', async (req, res) => {
    const authHeader = req.headers.authorization;
    const database= await connection();
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(301).send({ message:'UnAuthorized' });
    }

    const token = authHeader.split(' ')[1];
    
    const decoded = jwt.verify(token, superKey); // Verify JWT token
    
    try{
      if(decoded && decoded.user){
        const ses = await database.collection('token').findOne({ username: decoded.user, status:'Active',token:token });
        
        if(ses){
          const banda=ses.username;
          const naam=await database.collection('register').findOne({Mobile:banda});
        
          
            res.send({ type: true ,banda:banda,banda_naam:naam.FirstName}); // Valid token
        }else{
            res.send({type:false});
            console.log("Session are invalid in database");
        }
    }else{
        res.send({ type: false ,message:'Session invalid'}); // Invalid  token
        console.log("Session is expired");
    }
    }catch(error){
        console.log("Catch error",error);
        
    }
    
    
      
   
});

// logout api
app.post('/api/logout', async (req, res) => {
      try {
        // Access and validate the JWT token from the request headers
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          return res.status(401).send({message: 'Unauthorized' });
        }
    
        const token = authHeader.split(' ')[1];
        console.log(token);
        jwt.verify(token, superKey); // Verify the token
      
        const database = await connection();
        await database.collection('token').updateMany({'token':token},{$set:{'status':'Inactive'}});
    
        res.send({ message: 'Logged out successfully' }); // Response to frontend
      } catch (error) {
        console.error('Error logging out:', error);
        res.status(400).send({ message: 'Invalid token or logout failed' });
      }
});

// insert , updating, deleting the data
app.post('/category',async (req,res)=>{
    const category=req.body.category;
    const del=req.body.del;
    const update=req.body.hidden;
    const { formattedDate, formattedTime} = DateTime();
    const data = {
        "Category": category,
        "currentDate": formattedDate,
        "currentTime": formattedTime
      };
      const database=await connection();
      var mess='';

      if(del){
           await database.collection('category').deleteOne({'_id':new ObjectId(del)},(err,collection)=>{});
            mess="Successfully Deleted";
      }else{

         if(update){
          await database.collection('category').updateOne({'_id':new ObjectId(update)},{$set:data});
          mess="Successfully updated";
         }
         else{
           await database.collection('category').insertOne(data,(err,collection)=>{});
            mess="Successfully Created";
         }
      }
 
      return res.send({message:mess,type:true});

});

app.get('/api/categories/:edit?',async (req,res)=>{
  const edit=req.params.edit;
  const database=await connection();
  var categories='';
  const typ=edit ? "true":"false";
  if(edit){
     categories=await database.collection('category').find({'_id':new ObjectId(edit)}).toArray();
    
  }
  else{
     categories=await database.collection('category').find().toArray();
  }
  
  return res.send({cat:categories,type:typ});
});



// product inserting, deleting, updating
app.post('/product', async (req,res)=>{
  const del=req.body.del;
  
    const database=await connection();
    var mess='';
    

    if(del){
         await database.collection('product').deleteOne({'_id':new ObjectId(del)},(err,collection)=>{});
          mess="Successfully Deleted";
    }else{
      
       const update=req.body.hidden;
       const filePath = req.files?.photo; 
      
      let uniqueid=Date.now().toString()+ Math.random().toString(36).substring(7)+'.jpg';
    
      //moving the photo
      if(filePath){
        fs.renameSync(filePath['tempFilePath'],"../admin/public/uploads/"+uniqueid);
       }else{
          if(update){
            const pro=await database.collection('product').find({'_id':new ObjectId(update)}).toArray();
             uniqueid=pro[0]['Photo'];    
          }
      }


      const { formattedDate, formattedTime} = DateTime();

      // get the all data in the data const
      const data = {
        "Category": req.body.category_n,
        "Sub_category":req.body.sub_cat,
        "Product_id":req.body.product_id,
        "Product_name":req.body.product_n,
        "Size":req.body.size,
        "Qty":req.body.qty,
        "Actual_price":req.body.actual,
        "MRPs":req.body.mrp,
        "Photo":uniqueid,
        "currentDate": formattedDate,
        "currentTime": formattedTime
         };

      // updating or inserting the data
       if(update){
        await database.collection('product').updateOne({'_id':new ObjectId(update)},{$set:data});
        mess="Successfully updated";
       }
       else{
         await database.collection('product').insertOne(data,(err,collection)=>{});
          mess="Successfully Created";
       }
    }

    return res.send({message:mess,type:true});

});

// Settings logic: Handing global website data (Contact, About, Stats, Banner)
app.post('/api/settings', async (req, res) => {
    const database = await connection();
    const update = req.body.id; // From the hidden input field
    var mess = '';

    // 1. HANDLE MULTIPLE FILES (Logo and Banner)
    let logo_id = "";
    let banner_id = "";

    // Existing data check (if updating)
    let existingData = {};
    if (update) {
        const result = await database.collection('settings').find({ '_id': new ObjectId(update) }).toArray();
        existingData = result[0] || {};
    }

    // Process Website Logo
    if (req.files && req.files.logo) {
        logo_id = Date.now().toString() + "_logo.jpg";
        fs.renameSync(req.files.logo.tempFilePath, "../admin/public/uploads/" + logo_id);
    } else {
        logo_id = update ? existingData.logo : "default_logo.jpg";
    }

    // Process Banner Image
    if (req.files && req.files.banner_photo) {
        banner_id = Date.now().toString() + "_banner.jpg";
        fs.renameSync(req.files.banner_photo.tempFilePath, "../admin/public/uploads/" + banner_id);
    } else {
        banner_id = update ? existingData.banner_photo : "default_banner.jpg";
    }

    const { formattedDate, formattedTime } = DateTime();

    // 2. CONSTRUCT DATA OBJECT (Matching your small-letter frontend keys)
    const data = {
        // Contact
        "website_name": req.body.website_name,
        "mobile": req.body.mobile,
        "email": req.body.email,
        "address": req.body.address,
        "timing": req.body.timing,
        "logo": logo_id,
        // About Us
        "about_heading": req.body.about_heading,
        "about_subheading": req.body.about_subheading,
        "about_desc": req.body.about_desc,
        "mission": req.body.mission,
        "vision": req.body.vision,
        "desc_one": req.body.desc_one,
        "desc_two": req.body.desc_two,
        "desc_three": req.body.desc_three,
        // Stats
        "stat_h1": req.body.stat_h1, "stat_c1": req.body.stat_c1,
        "stat_h2": req.body.stat_h2, "stat_c2": req.body.stat_c2,
        "stat_h3": req.body.stat_h3, "stat_c3": req.body.stat_c3,
        "stat_h4": req.body.stat_h4, "stat_c4": req.body.stat_c4,
        // Banner
        "banner_small": req.body.banner_small,
        "banner_big": req.body.banner_big,
        "banner_desc": req.body.banner_desc,
        "banner_photo": banner_id,
        // Audit
        "currentdate": formattedDate,
        "currenttime": formattedTime
    };

    // 3. UPSERT LOGIC (Update or Insert)
    if (update) {
        await database.collection('settings').updateOne({ '_id': new ObjectId(update) }, { $set: data });
        mess = "Website settings updated successfully!";
    } else {
        // Check if a record already exists to prevent duplicates
        const count = await database.collection('settings').countDocuments();
        if (count > 0) {
            await database.collection('settings').updateOne({}, { $set: data });
            mess = "Website settings updated!";
        } else {
            await database.collection('settings').insertOne(data);
            mess = "Initial settings created!";
        }
    }

    return res.send({ message: mess, type: true });
});

// GET route to fetch the settings for pre-filling the form
app.get('/api/settings', async (req, res) => {
    const database = await connection();
    const data = await database.collection('settings').findOne({});
    return res.send({ data: data, type: true });
});


// fetching the data from product and category
app.get('/api/product/:edit?',async (req,res)=>{
  const edit=req.params.edit;
  const database=await connection();
  var pro='';
  var pro_sub='';
  var plus='';
  var cate='';
  const typ=edit ? "true":"false";
  if(edit){
     pro=await database.collection('product').find({'_id':new ObjectId(edit)}).toArray();
     const Category=pro[0]['Category'];
      
     pro_sub= await database.collection('subcategory').find({'Category':Category}).toArray();
    
  }
  else{
     pro=await database.collection('product').find().toArray();
     cate=await database.collection('category').find().toArray();
     const count_id=await database.collection('product').countDocuments({'Product_id':{$gt:'0'}});
     if(count_id>0){
      const sid = await database.collection("product").find().sort({"Product_id":-1}).limit(1).toArray();
      plus = parseInt(sid[0]['Product_id']) + 1;
    }
     
   
     
  }
  
  return res.send({pro:pro,type:typ,cate:cate,pid:plus,pro_sub:pro_sub});
});


// Helper for file uploads
const moveFile = (file, folder) => {
    let uniqueid = Date.now().toString() + Math.random().toString(36).substring(7) + '.jpg';
    fs.renameSync(file['tempFilePath'], `../admin/public/uploads/${uniqueid}`);
    return uniqueid;
};

// --- DASHBOARD STATS API ---
app.get('/api/dashboard', async (req, res) => {
    const database = await connection();

    // Fetching counts from various collections
    const totalBlogs = await database.collection('blog').countDocuments();
    const totalTestimonials = await database.collection('testimonial').countDocuments();
    const totalServices = await database.collection('services').countDocuments();
    const totalFaq = await database.collection('faq').countDocuments();
    
    // Product breakdown
    const totalProducts = await database.collection('product').countDocuments();
    const vegProducts = await database.collection('product').countDocuments({ Category: 'vegetables' });
    const fruitProducts = await database.collection('product').countDocuments({ Category: 'fruites' });

    // Get the 5 most recent contact inquiries
    const recentQueries = await database.collection('contact')
        .find()
        .sort({ _id: -1 })
        .limit(5)
        .toArray();

    res.send({
        stats: {
            totalBlogs,
            totalTestimonials,
            totalServices,
            totalFaq,
            totalProducts,
            vegProducts,
            fruitProducts
        },
        queries: recentQueries
    });
});

// --- BLOG API ---
app.post('/api/blog', async (req, res) => {
    const { heading, description, author, date, hidden, del } = req.body;
    const database = await connection();
    if (del) {
        await database.collection('blog').deleteOne({ '_id': new ObjectId(del) });
        return res.send({ message: "Blog Deleted", type: true });
    }
    
    let photoName = req.files?.photo ? moveFile(req.files.photo) : req.body.old_photo;
    const data = { heading, description, author, date, photo: photoName, ...DateTime() };

    if (hidden) await database.collection('blog').updateOne({ '_id': new ObjectId(hidden) }, { $set: data });
    else await database.collection('blog').insertOne(data);
    
    res.send({ message: "Blog Saved", type: true });
});

// --- TESTIMONIAL API ---
app.post('/api/testimonial', async (req, res) => {
    const { name, post, feedback, hidden, del } = req.body;
    const database = await connection();
    if (del) {
        await database.collection('testimonial').deleteOne({ '_id': new ObjectId(del) });
        return res.send({ message: "Deleted", type: true });
    }

    let photoName = req.files?.photo ? moveFile(req.files.photo, 'testimonials') : req.body.old_photo;
    const data = { name, post, feedback, photo: photoName, ...DateTime() };

    if (hidden) await database.collection('testimonial').updateOne({ '_id': new ObjectId(hidden) }, { $set: data });
    else await database.collection('testimonial').insertOne(data);

    res.send({ message: "Testimonial Saved", type: true });
});

// --- SERVICES API ---
app.post('/api/services', async (req, res) => {
    const { service_name, description, hidden, del } = req.body;
    const database = await connection();
    if (del) {
        await database.collection('services').deleteOne({ '_id': new ObjectId(del) });
        return res.send({ message: "Service Deleted", type: true });
    }

    let photoName = req.files?.photo ? moveFile(req.files.photo, 'services') : req.body.old_photo;
    const data = { service_name, description, photo: photoName, ...DateTime() };

    if (hidden) await database.collection('services').updateOne({ '_id': new ObjectId(hidden) }, { $set: data });
    else await database.collection('services').insertOne(data);

    res.send({ message: "Service Saved", type: true });
});

app.get('/api/testimonials/:edit?', async (req, res) => {
    const edit = req.params.edit;
    const database = await connection();
    let data = edit ? await database.collection('testimonial').find({ '_id': new ObjectId(edit) }).toArray() 
                    : await database.collection('testimonial').find().toArray();
    return res.send({ data, type: edit ? "true" : "false" });
});

app.get('/api/get-services', async (req, res) => {
    const database = await connection();
    const services = await database.collection('services').find().toArray();
    res.send({ services });
});


app.get('/api/blog/:edit?', async (req, res) => {
    const edit = req.params.edit;
    const database = await connection();
    let blogs = edit ? await database.collection('blog').find({ '_id': new ObjectId(edit) }).toArray() 
                    : await database.collection('blog').find().toArray();
    return res.send({ blogs, type: edit ? "true" : "false" });
});


// FAQ Section (Question and Answer)
app.post('/api/faq', async (req, res) => {
    const { question, answer, hidden, del } = req.body;
    const { formattedDate, formattedTime } = DateTime();
    const database = await connection();
    let mess = '';

    if (del) {
        await database.collection('faq').deleteOne({ '_id': new ObjectId(del) });
        mess = "FAQ Deleted";
    } else {
        const data = { 
            "Question": question, 
            "Answer": answer, 
            "currentDate": formattedDate, 
            "currentTime": formattedTime 
        };
        if (hidden) {
            await database.collection('faq').updateOne({ '_id': new ObjectId(hidden) }, { $set: data });
            mess = "FAQ Updated";
        } else {
            await database.collection('faq').insertOne(data);
            mess = "FAQ Created";
        }
    }
    return res.send({ message: mess, type: true });
});

app.get('/api/faq/:edit?', async (req, res) => {
    const edit = req.params.edit;
    const database = await connection();
    let faqs = edit ? await database.collection('faq').find({ '_id': new ObjectId(edit) }).toArray() 
                    : await database.collection('faq').find().toArray();
    return res.send({ faqs, type: edit ? "true" : "false" });
});

// --- CONTACT INQUIRY API ---
app.post('/api/query', async (req, res) => {
    // Destructuring fields from the frontend request
    const { name, email, mobile, subject, comments, del } = req.body;
    const database = await connection();

    // 1. DELETE LOGIC (For Admin Dashboard)
    if (del) {
        await database.collection('contact').deleteOne({ '_id': new ObjectId(del) });
        return res.send({ message: "Inquiry Deleted Successfully", type: true });
    }

    // 2. INSERT LOGIC (For Public Website Form)
    // We spread ...DateTime() to add your standard date/time fields automatically
    const data = { 
        name, 
        email, 
        mobile, 
        subject, 
        comments, 
        ...DateTime() 
    };

    try {
        await database.collection('contact').insertOne(data);
        res.send({ message: "Message Sent! We will contact you soon.", type: true });
    } catch (error) {
        res.status(500).send({ message: "Failed to send message", type: false });
    }
});

const PORT= 5000;
app.listen(PORT,()=>{
   
});