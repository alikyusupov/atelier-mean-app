const express = require("express");

const router = express.Router();

const Item = require("../models/item")

router.post("/createItem", (req, res, next)=>{
    const item = new Item({
      title:req.body.title,
      url:req.body.url,
      price:req.body.price,
      newPrice:req.body.price||0,
      description:req.body.description,
      sizes:req.body.sizes,
      tags:req.body.tags
    });
    item.save()
    .then(()=>{
      res.status(201).json({message:"Product is created!"})
    })
    .catch(err=>{
      res.json({message:"something went wrong"})
    })
  })

  router.get("/getItems", (req, res, next)=>{
      Item.find()
      .then(items=>{
          res.json(items)
      })
      .catch(err=>{
          console.log(err)
      })
  })

  router.get("/getItem/:productID", (req, res , next)=>{
    Item.find({_id:req.params.productID})
    .then(item=>{
      res.status(200).json(item)
    })
    .catch(err=>{
      console.log(err)
    })
  })

module.exports = router;