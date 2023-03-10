//jshint esversion:6
require('dotenv').config();
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoose =  require('mongoose');
var encrypt = require('mongoose-encryption');

const app = express();
mongoose.set('strictQuery',true);
app.use(express.static('public'));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
console.log(process.env.SECRETKEY) // remove this after you've confirmed it is working

mongoose.connect("mongodb://127.0.0.1:27017/usersDB", {
  useNewUrlParser: true//to prevent mongodb to throw errors
});
var secretKey = 'Thisisa32bytebasestring';
const userSchema  = new mongoose.Schema({
                    email:String,
                    password : String
                });

userSchema.plugin(encrypt, { secret: process.env.SECRETKEY, encryptedFields: ['password'] });


const user = new mongoose.model('User',userSchema);
app.get('/',function(req,res){
    res.render('home');
}); 

app.get('/login',function(req,res){
    res.render('login');
});

app.get('/register',function(req,res){
    res.render('register');
});

app.post('/register',function(req,res){
    const newUser = new user({email:req.body.username,
                              password: req.body.password});
    newUser.save(function(err,userCreated){
        if(err){
            console.log(err);
        }
        else{
            res.render('secrets');
        }
    });
});

app.post('/login',function(req,res){
    const userName = req.body.username;
    const password = req.body.password;

    user.findOne({email:userName},function(err,registeredUser){
        if(err){
            console.log(err);
        }
        else{
            if(registeredUser){
                if(registeredUser.password === password){
                    console.log('pw==',registeredUser.password);
                    res.render('secrets');
                }
            }
        }
    });
});

app.listen('3000',function(){
    console.log('connected to port 3000');
});