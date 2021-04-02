const express = require("express");

const router = express.Router();

const User = require("../models/user");

const Item = require("../models/item")

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const vigile = require("../middleware/vigile");

router.post("/signup", (req, res, next)=>{

    bcrypt.hash(req.body.password,10)
    .then(hash=>{
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password:hash,
            confirmPassword:hash
        });
        user.save()
        .then(result=>{
            res.status(201).json({
                message:"User created!",
                result:result
            })
        })
        .catch(err=>{
            res.status(501).json({
                error:err,
                type:"unknown"
            })
        })
    })
})

router.post("/login", (req, res, next)=>{
    let fetchedUser;
    User.findOne({email: req.body.email})
    .then(user=>{
        if(!user){
            return res.status(401).json({
                message:"Auth process failed"
            })
        }
        fetchedUser = user;
        return bcrypt.compare(req.body.password, user.password)
    })
    .then(result=>{
        if(!result){
            return res.status(401).json({
                message:"Auth process failed"
            })
        }
        const token = jwt.sign({email:fetchedUser.email, id:fetchedUser._id},"crackable_secret",{expiresIn:"1h"});
        res.status(200).json({
            token:token,
            expiresIn: 3600*1000,
            userID:fetchedUser.id,
            username:fetchedUser.name
        })
    })
    .catch(err=>{
        return res.status(401).json({
            message:"Auth process failed"
        })
    })
})

router.post("/addCart", (req, res, next)=>{
    let fetchedUser;
    let fetchedProduct;
    User.findById(req.body.userID)
    .then(user=>{
        fetchedUser = user;
    })
    .then(()=>{
        Item.findById(req.body.productID)
        .then(product=>{
            fetchedProduct = product;
            fetchedUser.addToCart(product);
        })
    })
    .catch(err=>{
        console.log(err)
    })
})

router.post("/cart", (req, res, next)=>{
    User.findById(req.body.userID)
    .populate("cart.items.productID")
    .exec()
    .then(user=>{
        res.status(200).json(user.cart.items)
    })
    .catch(err=>{
        console.log(err)
    })
})


router.post("/deleteItem", (req, res, next)=>{
    User.findById(req.body.userID)
    .then(user=>{
        user.removeFromCart(req.body.productID);
        res.json({message:"Item is deleted"})
    })
    .catch(err=>{
        console.log(err);
    })
})



router.get("/profile", vigile, (res, req, next)=>{
    return res.json({message:"You are in Profile "})
})


module.exports = router;