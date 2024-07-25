const User = require('../models/user');
const {setUser} = require('../services/auth');
const {v4:uuidv4} = require('uuid');
async function handleUserSignup(req,res){
    const {name,email,password} = req.body;

    await User.create({
        name,
        email,
        password,
    });
    return res.render('home');
}
async function handleUserLogin(req,res){
    const {email,password} = req.body;

    const user = await User.findOne({
        email,
        password,
    });
    if(!user) return res.render('login',{
        error:"Invalid username or password",
    });

    const token = setUser(user);
    
    return res.json({ token });
}

module.exports = {
    handleUserSignup,
    handleUserLogin,
};