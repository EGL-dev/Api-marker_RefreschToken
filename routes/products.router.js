var express = require("express");
var router = express.Router();
const Product = require("../model/products.model");
const {jsonResponse} = require("../lib/jsonResponse");
const createError = require("http-errors");


router.get('/', async(req,res,next)=>{
    let results = {};
    try {
        results = await Product.find({},('title price'));
    } catch (ex) {
        next(createError(500,{
            mesage:'Error fetching to results'
        }))
    }
    res.json(jsonResponse(200, {
        results
      }));
})

router.post('/', async(req,res,next)=>{
    const{title,price}= req.body;

    if(!title || !price){
        next(createError(400,{
            message:"title or precio missing"
        }));
    }else if(title && price){
        try {
            const product = new Product({title,price});
            await product.save();
        } catch (ex) {
            next(createError(500,{
                message:'Error  traying to register'
            }))
        }

        res.json(jsonResponse(200,{
            mesagge:"Product created"
        }))

    }

   

})

router.get('/:idproduct', async (res,req,next)=>{
    let results; 
    const{idproduct} = req.params;

    if(!idproduct)next(createError(400,'No id provider'));

    try {
        results = await Product.findById({title,price});
    } catch(ex){
        next(createError(500,'Error trying to fetch the product or product ID incorrect'))

    }

    res.json(jsonResponse(200,{
        idproduct
    }))
})
|

router.patch('/:idproduct',async (req,res,next)=>{
    let update = {};
    const{idproduct}= req.params;
    const{title,price}=req.body;

    if(!idproduct){
        next(createError)(400,'No ID product provided')
    };

    if(!title && !price){
        next(createError(400,"No product information available to update"))
    };

    if(title)update['title']= title;
    if(price)update['price']=price;


    try {
        await Product.findByIdAndUpdate(idproduct, update)
    } catch (ex) {
        next(createError(500,'Error trying to fetch the product or product ID incorrect'))
    }

    res.json(jsonResponse(200,{
        message:`The product ${idproduct} has been update`
    }));
});

router.delete('/:idproduct', async(req,res,next)=>{
    const{idproduct}=req.params;
    try {
        await Product.findByIdAndDelete(idproduct);
    } catch (ex) {
        next(createError(400,"No product information available to delete"))
    }

    res.json(jsonResponse(200,{
        message:`The product ${idproduct} has been delete`
    }));

});

module.exports = router;
