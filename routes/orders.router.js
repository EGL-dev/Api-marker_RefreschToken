var express = require("express");
var router = express.Router();
const Order = require("../model/orders.model");
const {jsonResponse} = require("../lib/jsonResponse");
const createError = require("http-errors");
const Product = require('../model/products.model');




router.get('/',async(req,res,next)=>{
    let results={};
    try {
        results = await Order.findById({})
    } catch (ex) {
        next(createError(400,{
            mesagge:'No hay order no hay'
        }))
    }

    res.json(jsonResponse(200,results));
});

router.post('/', async(req,res,next)=>{
    const {iduser,products}= req.body;
    if(!iduser || !products){
        next(createError(400,`No information provided to create order`))

    }else if(iduser && products && products.length > 0){
        const order = new Order({iduser,products});

        try {
            const result = await order.save();
        } catch (error) {
            next(createError(500,'Error trying to create order'))
        }

        res.json(jsonResponse(200,{
            message:`Order created successfully`
        }));



    }
})


module.exports = router;