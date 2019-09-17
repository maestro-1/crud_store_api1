const basicAuth= require("express-basic-auth");
const express= require("express");
const bodyParser=require('body-parser');
const fs = require("fs");
const morgan= require('morgan');
const Product= require('./routes/product');
const Category= require('./routes/Category');
const Staff= require('./routes/staff');
const {username}=require('./routes/help/helpers')



const app= express();
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

const unauthorized=(res)=>{
    res.set('WWW-Authenticate','Basic realm=Authorization Required');
    res.status(401).json({
        message: "you do not have authorization to view this page"
    });
}

const auth=(req,res,next)=>{
    username()
    .then(username=>{
       try {    
        if(username){
            for(i=0;i<username.length;i++){
                if(username[i]===req.body.email){
                   return next();
                }else{
                   continue
                };
             }
             return unauthorized(res);
        }else{
            return unauthorized(res);
            } 
        }
        catch (error) {
            console.log(error)
           } 
    })
    .catch(err=>{
        console.log(err)
    })
};


app.use('/product',auth, Product);
app.use('/category',auth, Category);
app.use('/staff',auth, Staff);



app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Header','Content-Type,Origin,Accept,Authorization,X-Requested-With')
    if(req.method=='OPTION'){
        res.header('Access-Control-Allow-Method', 'POST,GET,PATCH,DELETE,PUT')
    }
})

app.use((req,res,next)=>{
    const error = new Error("not found")
    error.status(404)
    next()
});

app.use((error, req,res, next)=>{
    res.status(error.status|| 500).json({
        error:{
            message: "an errored occured while loading this page"
        }
    })
})

module.exports=app;