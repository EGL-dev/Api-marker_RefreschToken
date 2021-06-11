const Mongose = require('mongoose');
const User = require('../model/users.model');

const OrderSchema = new Mongose.Schema({
    iduser:{type:String,required:true},
    products:[{idproduct:String,title:String , price:Number, qtw:Number}],
    total:{type:Number,default:0},
    date:{type:Date,default:Date.now},
    price:{type:String,required:true}

})

OrderSchema.pre('save', async function(next){
    if(this.isModified('products') || this.isNew){
        const document = this;
        const idUser=document.iduser;
        const products= document.products;

        document.total = 0;


        let user;
        let promises =[];

        try {
            user = User.findById(idUser);

        } catch (error) {
            next(new Eror(`The user ID ${idUser} does not exist`));

        }

        try {
            if(products.length==0){
                next(new Error(`No products in the order. Add some products to continue`));

            }else{
                for(const product of products){
                    promises.push(Product.findById(product.idproduct));

                }

                const resultPromises = await Promise.all(promises);

                resultPromises.forEach((product, index)=>{
                    document.total+=product.price;
                    document.products[index].title = product.title;
                    document.products[index].price = product.price;
                })
            }
        } catch (error) {
            next(new Error(`Information incompleted or incorrect`));
        }

    }else{
        next();
    }
})

module.exports = Mongose.model('Order', OrderSchema);
