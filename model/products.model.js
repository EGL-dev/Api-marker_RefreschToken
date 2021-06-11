const Mongose = require('mongoose');

const ProductSchema = new Mongose.Schema({
    title:{type:String,required:true},
    price:{type:String,required:true}


});

module.exports = Mongose.model('Product', ProductSchema);
