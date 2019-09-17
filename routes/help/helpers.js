const fs =require('fs');


const add=(jsonString,newItem)=>{
        if (!jsonString) {
            return new Promise((resolve,reject)=>{
                console.log("File read failed:", err)
                reject(err)
            });
        }
        if(jsonString){
            return new Promise((resolve,reject)=>{
                try {
                    const list = JSON.parse(jsonString);
                    list.push(newItem);
                    newList=JSON.stringify(list)
                    resolve(newList)
                } catch(err) {
                    console.log('Error parsing JSON string:', err)
                    reject(err)
            }
        });
    }
}


const getById=(jsonString,productId)=>{
    const Product=JSON.parse(jsonString);
    for(i=0; i<Product.length; i++){
        id=Object.keys(Product)[Number(productId)-1] 
        if(productId){
           return new Promise((resolve,reject)=>{
                if(Number(productId)<=Product.length && Number(productId)>0){
                    const product= Product[id]
                    resolve(product)
                }else{ 
                    const err=  {
                        error:{
                             message: "page does not exist"
                        }
                    }
                    reject(err);
                    }
            });
        }
    }
}


const delet= (jsonString,productId)=>{
    const products= JSON.parse(jsonString)
    for(i=0; i<=products.length; i++){
        var id=Object.keys(products)[Number(productId)]
        return new Promise((resolve,reject)=>{
            if(productId<=products.length && productId>0){
                if(Number(productId)===Number(id)){
                    if(Number(productId)>1 && Number(productId)<products.length){
                        products.splice([id-1], 1)
                        const data=JSON.stringify(products)
                        resolve(data) 
                    }else if(Number(productId)===1){
                        products.shift()
                        const data=JSON.stringify(products)
                        resolve(data) 
                    }else{
                        const errorObject = {
                            msg: 'An error occured',error
                         }
                         reject(errorObject);
                    }       
            }else if(Number(productId)===products.length){
                products.pop()
               const data=JSON.stringify(products);
               resolve(data)
            } else {
                const errorObject = {
                         msg: 'An error occured',error
                    }
                 reject(errorObject);
              }
            }
         });
      }
   }


const username=()=>{
    users=JSON.parse( fs.readFileSync("./models/staff.json"));
    let [...username]=users.map(({email}) => email)
    return new Promise((resolve,reject)=>{
        if(!null){
            resolve([...username])
        }else{
            const err={
                message:"username does not have authorization"
            }
            reject(err)
        }
    })
};

module.exports={
    delet,
    getById,
    add,
    username
}