const express = require('express');

const app = express();

const server = require('http').createServer(app);

const mongoose = require("mongoose");

const socketIO = require('socket.io');

const io = socketIO(server);

const Message = require("./models/message");

const User = require("./models/user");

const Item = require("./models/item");

const port = process.env.PORT || 3000;

const bodyParser = require('body-parser');

const userRoutes = require("./routes/user");

const adminRoutes = require("./routes/admin");

const path = require("path")

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'dist','bangapp')));



app.use((req, res, next) => {
    res.setHeader(
      'Access-Control-Allow-Origin', '*'
    );
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.setHeader(
      'Access-Control-Allow-Methods',
      'GET, POST, PATCH, PUT, DELETE, OPTIONS'
    );
    next();
  });

  
app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes); 



io.on('connection', (socket) => {
  socket.on('disconnect', () => {    
      console.log('user quitted a chat');
  });

  socket.on('new-message', (message) => {
    User.findById(message.userID)
    .then(()=>{
      const tweet = new Message({
        content: message.content,
        sender: message.userID,
        sendername:message.username
      })
      tweet.save();
      io.to(socket.id).emit("new-message", tweet);
    })
    .catch(err=>{
      console.log(err)
    })
  })
});


  app.get(["/shop","/small-production","/atelier","/main"], (req, res, next)=>{
    res.sendFile(path.join(__dirname, 'dist','bangapp','index.html'))
  })

  app.get("/api/messages", (req, res, next)=>{
    let array_of_messages = [];
    Message.find()
      .then(tweets=>{
              tweets.forEach(tweet=>{
                array_of_messages.push(tweet)
              })
              res.status(200).json(array_of_messages)
      })
      .catch(err=>{
          return res.status(500).json({message:"Server fails to fetch messages"})
      })
    })

    /*app.get("/api/users", (req, res, next)=>{
      let array_of_users = [];
      User.find()
        .then(users=>{
                users.forEach(user=>{
                  array_of_users.push(user)
                })
                res.status(200).json(array_of_users)
        })
        .catch(err=>{
            return res.status(500).json({message:"Server fails to fetch messages"})
        })
      })*/

      app.post("/api/react", (req, res, next)=>{
        User.findById(req.body.userID)
        .then(user=>{
          user.answers.push(req.body.content);
          user.save()
        })
        .catch(err=>{
          console.log(err)
        })
        Message.deleteOne({_id:req.body.messageID})
        .then(res=>{
          console.log(res)
        })
        .catch(err=>{
          console.log(err)
        })
      })

      app.post("/api/answers", (req, res, next)=>{
        User.findById(req.body.userID)
        .then(user=>{
          res.json(user.answers)
        })
        .catch(err=>{
          console.log(err)
        })
      })

      app.post("/api/mymessages", (req, res, next)=>{
        Message.find()
        .then(messages=>{
          let myMessages = [];
          myMessages = messages.filter((m)=>m.sender===req.body.userID);
          res.json(myMessages)
        })
        .catch(err=>{
          console.log(err)
        })
      })



mongoose.connect("mongodb+srv://Alisher:asd123asd@dressify-zvh54.mongodb.net/bangapp?retryWrites=true&w=majority", { 
  useNewUrlParser: true, 
  useUnifiedTopology:true
})
.then(result=>{
	server.listen(port,()=>{
		console.log(`Listening on ${port}`);
	});
})
.catch(err=>{
	console.log(err)
})

module.exports = app;