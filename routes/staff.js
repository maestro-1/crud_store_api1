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
    email: Joi.string()
        .required(),
    role: Joi.string()
            .required(), 
    fullName: Joi.string()
            .required(),
    mobile_number: Joi.number()
            .required(),  
    sales: Joi.number()                
})


router.post('/',upload.single('staffImage'), (req,res,next)=>{
   const {error}= Joi.validate(req.body,schema)
   if(error){
       console.log(error)
   }else{ 
    if('./models/staff.json'){
        fs.readFile('./models/staff.json','utf-8',(err,jsonString)=>{
            const list = JSON.parse(jsonString);
            let result = list.map(({id}) => id)
            id=result.slice(-1)
            const newStaff={
                id: Number([...id])+1,
                email: req.body.email,
                role :  req.body.role,
                fullName :  req.body.fullName,
                mobile_number:  req.body.mobile_number,
                sales :  req.body.sales, 
             }
            add(jsonString,newStaff)
            .then((staff)=>{
                fs.writeFileSync('./models/staff.json',staff)
                res.status(201).json({
                    message: "added staff succesfully",
                    staff:staff
                })
            })
            .catch((err)=>{
                res.status(404).json({
                    message: "error occured " + err
                })
            })
        })
     }else{
        fs.writeFileSync('./models/staff.json',newStaff)
        return res.status(201).json({
            message: "added staff successfully",
            staff: newStaff
        });
     }
   }
});   


router.get('/', (req,res,next)=>{
    fs.readFile('./models/staff.json','utf-8',(err,jsonString) => {
        if (err) {
            console.log("File read failed:", err)
            return null
        }
        try {
            const list = JSON.parse(jsonString);
            res.status(200).json({
                count:list.length,
                staffs:Object.values(list)});
        } catch(err) {
            console.log('Error parsing JSON string:', err)
        }
    });
})



router.get("/:staffId",(req,res,next)=>{
    const staffId=req.params.staffId;
    if(staffId){
        fs.readFile('./models/staff.json','utf-8',(err,jsonString)=>{
            if (err){
                console.log(`Failed to read file ${err}`)
                return null
            }
            try {
               getById(jsonString,staffId)
               .then((staff)=> {
                   console.log(staff)
                   res.status(200).json({
                       message:staff
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


router.delete("/:staffId",(req,res,next)=>{
    const staffId = req.params.staffId
        if(staffId){
            let path="./models/staff.json"
            fs.readFile(path,"utf-8" ,(err,jsonString)=>{
                if(err){
                    console.log("an error occured during the process" + err)
                    return null
                }try{
                   delet(jsonString,staffId)
                    .then((data)=>{
                            console.log(data),
                            fs.writeFileSync(path,data)
                             res.status(201).json({
                                message: "deleted merchandise sucessfully",
                                staffs: `remaining staffs ${data}`
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