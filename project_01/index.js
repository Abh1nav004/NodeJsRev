const express = require("express");
const fs = require('fs');
const mongoose = require('mongoose');
const users = require('./MOCK_DATA (1).json')


const app = express();
const PORT = 8000;

//Connection
mongoose.connect('mongodb://localhost:27017/mydatabase')
.then(()=>console.log('MongoDB connected!')) 
.catch((err)=>console.log("Mongo Error",err)); 

//Schema
const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required: true,
    },
    lastName: {
        type: String,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    jobTitle:{
        type:String,  
    },
    gender:{
        type:String,
    },
})

const User = mongoose.model('user',userSchema);

//Middleware - Plugin
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use((req,res,next)=>{
    fs.appendFile('log.txt',`${Date.now()}:${req.ip}: ${req.method}:${req.path}\n`,(err,data)=>{
        next();
    });
});



// for html rendering 
app.get('/users',(req,res)=>{
    const html = `
    <ul>
    ${users.map((user)=>`<li>${user.first_name}</li>`).join("")};
    </ul>
    `;

    res.send(html);
});

// for rest api calls for developers
app.get("/api/users",(req,res)=>{
    res.setHeader('X-MyName',"Abhinav");
 //Always add X to custom Header for good practice
    return res.json(users);
});

app
.route("/api/users/:id")
.get((req,res)=>{
    const id = Number(req.params.id);
    const user = users.find((user)=>user.id===id);
    if(!user) return res.status(404).json({msg:"User not found"});
    return res.json(user);
})
.patch((req,res)=>{
        return res.json({ status: "pending"});
})
.delete((req,res)=>{
        return res.json({ status: "pending"});
});


app.post('/api/users',async(req,res)=>{
    const body = req.body;
    if(
       !body || 
       !body.first_name || 
       !body.last_name || 
       !body.email || 
       !body.gender || 
       !body.job_title 
    ){
        return res.status(400).json({msg:"All fields are required...."});
    }
   const result = await User.create({
        firstName: body.first_name,
        lastName: body.last_name,
        email: body.email,
        gender: body.gender,
        jobTitle: body.job_title,
    });

    console.log('result',result);

    return res.status(201).json({msg:"User created"});
});


app.listen(PORT,()=>console.log(`Server Started at PORT ${PORT}`));