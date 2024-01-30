const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const bcrypt= require('bcryptjs');
var jwt= require('jsonwebtoken');
var fetchuser = require('../middleware/fetchuser')


const JWT_SECRET=("deepakisgoodboy");

// Rout1: Create a user using :post "/api/auth/createuser".
router.post(
  "/createuser",
  [
    body("name", "Enter Valid Name").isLength({ min: 3 }),
    body("email", "Entre Valid email id").isEmail(),
    body("password", "Password must be atleast 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    let success= false;

    // if there are errors, return bad request and the error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
    }
    
    // check if the user with this email exists already

    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({ success, error: "Sorry a user with this email already exists" });
      }

      const salt = await bcrypt.genSalt(10); 

      secPass= await bcrypt.hash(req.body.password,salt) 
      
      // create a new user 
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      });

      const data ={
        user:{
          id:user.id
        }
      }
      const authtoken= jwt.sign(data, JWT_SECRET)
     
      
      // sending an error if some error occures in the validation of the user name and email id 
      success =true;
      res.json({success, authtoken}); 
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Some error occured");

      
    }
  }
);




// Rout2: Authenticate a user using :post "/api/auth/login". No login required
router.post(
  "/login",
  [
    body("email", "Entre Valid email id").isEmail(),
    body("password", "Password must be atleast 5 characters").exists(),
  ],
  async (req, res) =>{
    // if there are errors, return bad request and the error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let success= false;

    const {email, password}=req.body;
    try{
      let user= await User.findOne({email});

      if(!user ){
        success = false
        return res.status(400).json({error:"Please try to login with correct credential"});
      }
      
      const passwordCompare= await bcrypt.compare(password,user.password);
      if(!passwordCompare){
        success=false;
        return res.status(400).json({success, error:"Please try to login with correct credential"});
      }

      const data ={
        user:{
          id: user.id
        }
      }
      const authtoken= jwt.sign(data, JWT_SECRET)
      success = true;
      res.json({success,authtoken})


    } catch(error){
      console.error(error.message);
      res.status(500).send("Internal server error!!");
    }

  })

  

// Rout3: Get logged in user details using :Post "/api/auth/getuser". No login required
  router.post("/getuser",  fetchuser,  async (req, res) =>{
  try{
    userID=req.user.id
    const user= await User.findById(userID).select("-password")
    res.send(user)

  } catch(error){
     console.error(error.message);
     res.status(500).send("Internal server error!!");

  }
})
 



module.exports = router;
