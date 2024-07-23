const express = require("express");
const path = require("path");
const cookieParser = require('cookie-parser')
const {connectToMongoDB}= require("./connect");
const {restrictToLoggedinUserOnly,checkAuth} = require('./middlewares/auth');
const URL = require('./models/url');
const PORT = 8001;



//Connection 
connectToMongoDB("mongodb://localhost:27017").then(()=>console.log('MongoDB connected!!'));


//Routes
const urlRoute = require("./routes/url");
const staticRoute = require("./routes/staticRouter");
const userRoute = require("./routes/user");



const { connect } = require("mongoose");
const app = express();  


//Middlewares
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());



app.set("view engine","ejs");
app.set('views',path.resolve('./views'));


app.get("/test",async(req,res)=>{
    const allUrls = await URL.find({});
    return res.render('home',{
        urls:allUrls,
    });
});


app.use("/url",restrictToLoggedinUserOnly,urlRoute);
app.use('/user',userRoute );
app.use('/',checkAuth,staticRoute);


app.get('/url/:shortId',async(req,res)=>{
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate({
        shortId
    }, { $push: {
        visitHistory:{
            timestamp: Date.now(),
        },
    },
}
);
res.redirect(entry.redirectURL)
});


//Port
app.listen(PORT,()=> console.log(`Server Started at PORT: ${PORT}`));
