const express = require("express");
const fs = require('fs');
const users = require('./MOCK_DATA (1).json')
const app = express();
const PORT = 8000;


//Middleware - Plugin
app.use(express.urlencoded({extended: false}));

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


app.post('/api/users',(req,res)=>{
    const body = req.body;
    if(!body || !body.first_name || !body.last_name || !body.email || !body.job_title ){
        return res.status(400).json({msg:"All fields are required"});
    }
    users.push({...body, id: users.length+1});
    fs.writeFile('./MOCK_DATA (1).json', JSON.stringify(users),(err, data)=>{
        return res.status(201).json({status:"success",id:users.length});
    });
});


app.listen(PORT,()=>console.log(`Server Started at PORT ${PORT}`));