const express=require("express");
const router=express.Router();


router.route("/register").post(async (req,res)=>{
    const { firstName, phone} = req.body;
    const password = crypto.createHash('md5').update(req.body.password).digest('hex');
    const { formattedDate, formattedTime} = DateTime();
    const data = {
        "FirstName": firstName,
        "Mobile": phone,
        "password": password,
        "currentDate": formattedDate,
        "currentTime": formattedTime
      };

      const database= await connection();
      const template=await database.collection('register').countDocuments({Mobile:phone});
    
      if(template>0){
          return res.send({message:'This mobile already registered',type:false});
      }else{
          database.collection("register").insertOne(data,(err,collection)=>{});
          return res.send({message:'form submitted successfully',type:true});
      }
    
   
});


router.route("/login_form").post(async (req,res)=>{
    const phone = req.body.phone;
    const password = crypto.createHash('md5').update(req.body.password).digest('hex');
    const { formattedDate, formattedTime} = DateTime();  
   
    const database= await connection();
    const user = await database.collection('register').findOne({ Mobile: phone, password: password });
    if(user){
        
        const token=Date.now().toString() + Math.random().toString(36).substring(4) + phone;
        const ip=req.ip;
       
        const token_data={
            "token":token, "ip":ip, "username":phone, "status":"Active", "currentDate":formattedDate,"currentTime":formattedTime 
        }
        // updating the status of old session in token table of correct username or mobile number
        database.collection('token').updateMany({$and:[{'username':phone},{'status':'Active'}]},{$set:{'status':'Inactive'}});
        // insert new row in the token for the security session or cookie
        database.collection('token').insertOne(token_data);
       
        const tokenn = generateAccessToken(phone); // Generate JWT token
        // console.log("Generated token by login form",tokenn);
        res.cookie('jwtToken',tokenn,{httpOnly:true});
    
        return res.send({message:'Login Successfully',type:true,token:tokenn});

    }else{
        return res.send({message:'Mobile & password do not match',type:false});
    }
});

router.route("/api/check-session").post(async (req,res)=>{
    const authHeader = req.headers.authorization;
   
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(301).send({ message:'UnAuthorized' });
    }
    const token = authHeader.split(' ')[1];

    
    
     try {
      const decoded = jwt.verify(token, secretKey); // Verify JWT token
      res.send({ type: true }); // Valid token
    } catch (error) {
      console.error('Error verifying token:', error);
     }
});


router.route("/api/logout").post(async (req,res)=>{
    try {
        // Access and validate the JWT token from the request headers
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          return res.status(401).send({message: 'Unauthorized' });
        }
    
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, secretKey); // Verify the token
      
        const { user } = decoded; // Extract user data from decoded token
        const database = await connection();
        await database.collection('blacklisted_tokens').insertOne({ token });
    
        res.send({ message: 'Logged out successfully' }); // Response to frontend
      } catch (error) {
        console.error('Error logging out:', error);
        res.status(400).send({ message: 'Invalid token or logout failed' });
      }
});


module.exports=router;