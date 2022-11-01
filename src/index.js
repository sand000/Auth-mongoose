const express = require("express")
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const {connection} = require("../src/config/db");
const {UserModel} = require("./Models/User.model");

const app = express();
app.use(express.json());


// home
app.get("/", async (req, res) => {
    res.send("Home");
});


// all users
app.get("/users", async(req, res)=>{
    const user = await UserModel.find();
    res.send(user);
});


// signup
app.post("/signup", async(req, res)=>{
    const {email, password} = req.body;
    bcrypt.hash(password, 8, async function(err,hash){
        if(err){
            res.send("something went wrong please signup later");
        }
        const new_user = new UserModel({
            email:email,
            password: hash
        })
        await new_user.save();
        res.send("signup successful");
    });

    // const result = await UserModel.findOne({email})

    // if(result){
    //     res.send("User with this email already exist");
    // }
    // else{
      
    // } 
});


// login
app.post("/login", async (req, res) => {
    const {email, password} = req.body;
    const user = await UserModel.findOne({email});
    const hash_password = user.password;

    bcrypt.compare(password, hash_password, function(err,result){

        if(result){
            const token = jwt.sign({name: "masai"}, "abcd12345")
            res.send({"msg":"login success", "token": token});
        }else{
            res.send("login failed");
        }
    })  
})


// dashboard
app.get("/dashboard", async(req, res) =>{
    const token = req.headers.authorization.split(" ")[1];
    console.log(token);
    try{
        var decoded = jwt.verify(token, "abcd12345");
        res.send("dashboard data...");
    }catch(e){
        console.log(e);
        res.send("Please login again")
    }
    
});

// listen
app.listen(8000, async()=>{
    try{
        await connection
        console.log("successfully connnected to db");
    }catch(e){
        console.log("error in connection");
    }
    console.log("listening on http://localhost:8000");
})