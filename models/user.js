const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const uniqueValidator = require("mongoose-unique-validator");

const userSchema = Schema({
    name:{type:String, required:true},
    email:{type:String, required:true, unique: true},
    password:{type:String, required:true},
    confirmPassword:{type:String, required:true},
    answers:{type:[String], required:false},
    cart:{
		items:[{
			productID:{
				type: Schema.Types.ObjectId,
				ref:"Product",
				required: true
			},
			quantity:{
				type: Number,
				required: true
			},
            size:{
                type:[String],
                required:false
            }
            }]
	}
})

userSchema.methods.addToCart = function(product){
	const cartProductIndex = this.cart.items.findIndex(cp => {
      return cp.productID.toString() === product._id.toString();
    });
    let newQuantity = 1;

    const updatedCartItems = [...this.cart.items];


    if (cartProductIndex >= 0) 
    {
      newQuantity = this.cart.items[cartProductIndex].quantity + 1;
      updatedCartItems[cartProductIndex].quantity = newQuantity;

    }
    else 
    {
      updatedCartItems.push({
        productID: product._id,
        quantity: newQuantity
      });
    }
    
    const updatedCart = {
      items: updatedCartItems
    };
   	this.cart = updatedCart;
   	this.save()
}

userSchema.methods.removeFromCart = function(productID){
	const updatedCartItems = this.cart.items.filter(items => {
      return items.productID.toString() !== productID.toString();
    });
    this.cart.items = updatedCartItems;
    return this.save(); 
}

userSchema.plugin(uniqueValidator)

module.exports = mongoose.model("User", userSchema);
