const express=require('express');
const fs =require('fs')
const Joi = require('@hapi/joi');
const multer= require('multer');
const {delet,getById, add}=require('./help/helpers')

const router= express.Router();
const storage= multer.diskStorage({
    destination: (req,res,cb)=>{
        cb(null,".uploads/");
    },
    filename: (req,file,cb)=>{
        cb(null,`${Date.now()} ${file.originalname}`);
    }
});
const fileFilter=(req,file,cb)=>{
    //reject certain types of file
    if (file.mimetype==='png'||file.mimetype==='jpg'){
        cb(null,true)
    }else{
        cb(null,true)
    }
}
const upload= multer({storage:storage}, 
    {
    limits:{
        fileSize:1024*1024*5
        }
    },
    {fileFilter:fileFilter}
);


const schema= Joi.object({
    id: Joi.number(),
    name: Joi.string()
        .required(),
    category: Joi.string()
            .required(), 
    price: Joi.number()
            .required(),
    quantity: Joi.number()
            .required(),  
    description: Joi.string()            
})


router.post('/',upload.single('productImage'), (req,res,next)=>{
   const {error}= Joi.validate(req.body,schema)
   if(error){
       console.log(error)
   }else{ 
    if('./models/product.json'){
        fs.readFile('./models/product.json','utf-8',(err,jsonString)=>{
            const list = JSON.parse(jsonString);
            let result = list.map(({id}) => id)
            id=result.slice(-1)
            const newProduct={
                id: Number([...id])+1,
                name : req.body.name,
                category :  req.body.category,
                price :  req.body.price,
                quantity:  req.body.quantity,
                description :  req.body.description, 
             }
            add(jsonString,newProduct)
            .then((product)=>{
                fs.writeFileSync('./models/product.json',product)
                res.status(201).json({
                    message: "added product succesfully",
                    product:product
                })
            })
            .catch((err)=>{
                res.status(404).json({
                    message: "error occured " + err
                })
            })
        })
     }else{
        fs.writeFileSync('./models/product.json',newProduct)
        return res.status(201).json({
            message: "added product successfully",
            product: newProduct
        });
     }
   }
});   


router.get('/', (req,res,next)=>{
    fs.readFile('./models/product.json','utf-8',(err,jsonString) => {
        if (err) {
            console.log("File read failed:", err)
            return null
        }
        try {
            const list = JSON.parse(jsonString);
            res.status(200).json({
                count:list.length,
                products:Object.values(list)});
        } catch(err) {
            console.log('Error parsing JSON string:', err)
        }
    });
})



router.get("/:productId",(req,res,next)=>{
    const productId=req.params.productId;
    if(productId){
        fs.readFile('./models/product.json','utf-8',(err,jsonString)=>{
            if (err){
                console.log(`Failed to read file ${err}`)
                return null
            }
            try {
               getById(jsonString,productId)
               .then((product)=> {
                   console.log(product)
                   res.status(200).json({
                       message:product
                   })
                })
                .catch((err)=> {
                    console.log(err)
                    res.status(404).json({
                     message:err
                     })
                 })
            }        
            catch (err) {
                console.log(`Error parsing Json to string ${err}` )
                res.status(200).json({
                    message:category
                })
            }
        });
    }
});


router.delete("/:productId",(req,res,next)=>{
    const productId = req.params.productId
        if(productId){
            let path="./models/product.json"
            fs.readFile(path,"utf-8" ,(err,jsonString)=>{
                if(err){
                    console.log("an error occured during the process" + err)
                    return null
                }try{
                   delet(jsonString,productId)
                    .then((data)=>{
                            console.log(data),
                            fs.writeFileSync(path,data)
                             res.status(201).json({
                                message: "deleted merchandise sucessfully",
                                products: `remaining products ${data}`
                              })
                        })
                    .catch((err)=>{
                        console.log(err),
                        res.status(201).json({
                             message: "something went wrong",
                            error:err
                         });
                    });
            }
            catch(err){
                return console.log("an error occured somewhere" + err)
            }
        });
    }
})

module.exports= router