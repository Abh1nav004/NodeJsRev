const express = require("express");

const {connectMongoDb} = require("./connection");
const userRouter = require("./routes/user")
const {logReqRes} = require("./middlewares");



const app = express();
const PORT = 8000;

//Connection
connectMongoDb('mongodb://localhost:27017/mydatabase').then(()=>
    console.log("MongoDB connected!")
);


//Middleware - Plugin
app.use(express.urlencoded({extended: false}));
app.use(logReqRes('log.txt'));



//Routes
app.use('/api/users',userRouter); 



app.listen(PORT,()=>console.log(`Server Started at PORT ${PORT}`));