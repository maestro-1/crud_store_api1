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
    description: Joi.string()
                .required()            
})


router.post('/',upload.single('categoryImage'), (req,res,next)=>{
   const {error}= Joi.validate(req.body,schema)
   if(error){
       console.log(error)
   }else{ 
    if('./models/category.json'){
        fs.readFile('./models/category.json','utf-8',(err,jsonString)=>{
            const list = JSON.parse(jsonString);
            let result = list.map(({id}) => id)
            id=result.slice(-1)
            const newCategory={
                id: Number([...id])+1,
                name : req.body.name,
                description :  req.body.description
             }
            add(jsonString,newCategory)
            .then((category)=>{
                fs.writeFileSync('./models/category.json',category)
                res.status(201).json({
                    message: "added category succesfully",
                    category:newCategory
                })
            })
            .catch((err)=>{
                res.status(404).json({
                    message: "error occured " + err
                })
            })
        })
     }else{
        fs.writeFileSync('./models/category.json',newCategory)
        return res.status(201).json({
            message: "added category successfully",
            category: newCategory
        });
     }
   }
});   


router.get('/', (req,res,next)=>{
    fs.readFile('./models/category.json','utf-8',(err,jsonString) => {
        if (err) {
            console.log("File read failed:", err)
            return null
        }
        try {
            const list = JSON.parse(jsonString);
            res.status(200).json({
                count:list.length,
                Categorys:Object.values(list)});
        } catch(err) {
            console.log('Error parsing JSON string:', err)
        }
    });
})



router.get("/:CategoryId",(req,res,next)=>{
    const CategoryId=req.params.CategoryId;
    if(CategoryId){
        fs.readFile('./models/category.json','utf-8',(err,jsonString)=>{
            if (err){
                console.log(`Failed to read file ${err}`)
                return null
            }
            try {
               getById(jsonString,CategoryId)
               .then((category)=> {
                   console.log(category)
                   res.status(200).json({
                       message:category
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
            }
        });
    }
});


router.delete("/:CategoryId",(req,res,next)=>{
    const CategoryId = req.params.CategoryId
        if(CategoryId){
            let path="./models/category.json"
            fs.readFile(path,"utf-8" ,(err,jsonString)=>{
                if(err){
                    console.log("an error occured during the process" + err)
                    return null
                }try{
                   delet(jsonString,CategoryId)
                    .then((data)=>{
                            console.log(data),
                            fs.writeFileSync(path,data)
                             res.status(201).json({
                                message: "deleted merchandise sucessfully",
                                Categorys: `remaining Categorys ${data}`
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