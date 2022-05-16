const express = require("express");
const app = express();
const cors = require("cors");
const BusinessDb = require("../schemas/business_schema");
const UserDb = require("../schemas/user_schema");
const VideoDb = require("../schemas/video_schema");

app.use(cors());
app.use(express.json());

const mongoose = require("mongoose");
const mongoDB =
  "mongodb+srv://jonathan:Aa123654!@cluster0.2lj7x.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

mongoose
  .connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(8080))
  .then(console.log("connected to mongo and server listening on port 8080"));

const path = require('path');
const multer = require('multer');
const { request } = require("http");
const { response } = require("express");
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null,path.join(__dirname, '/videos')),
  filename: (req, file, cb) => cb(null, file.originalname)
})
const upload = multer({storage: storage});


app.get("/logIn=:email&:passWord&:type", (request, response) => {
  const email = request.params.email;
  const password = request.params.passWord;
  const type = request.params.type;

  if (type === "user") {
    UserDb.findOne({ email: email }).then((usr) => {
      if (usr == null) {
        response.send({
          status: false,
          message: "user does not exist",
        });
      } else {
        if (usr.passWord === password) {
          usr.connected = true;
          usr.save();
          response.send({
            status: true,
            message: "log in successful",
          });
        } else {
          response.send({
            status: false,
            message: "wrong password",
          });
        }
      }
    });
  } else if (type === "business") {
    BusinessDb.findOne({ email: email }).then((bsns) => {
      if (bsns == null) {
        response.send({
          status: false,
          message: "business does not exist",
        });
      } else {
        if (bsns.passWord === password) {
          bsns.connected = true;
          bsns.save();
          response.send({
            status: true,
            message: "log in successful",
          });
        } else {
          response.send({
            status: false,
            message: "wrong password",
          });
        }
      }
    });
  } else {
    response.send({
      status: false,
      message: "incorrect type provided",
    });
  }
});

app.get("/logOut=:email&:type", (request, response) => {
  const email = request.params.email;
  const type = request.params.type;

  if (type === "user") {
    UserDb.findOne({ email: email }).then((usr) => {
      if (usr != null) {
        usr.connected = false;
        usr.save();
        response.send({
          status: true,
          message: "logged out successfully",
        });
      } else {
        response.send({
          status: false,
          message: "user name is invalid",
        });
      }
    });
  } else if (type === "business") {
    BusinessDb.findOne({ email: email }).then((bsns) => {
      if (bsns != null) {
        bsns.connected = false;
        bsns.save();
        response.send({
          status: true,
          message: "logged out successfully",
        });
      } else {
        response.send({
          status: false,
          message: "user name is invalid",
        });
      }
    });
  } else {
    response.send({
      status: false,
      message: "incorrect username provided",
    });
  }
});

app.post("/createAccount=:email&:type", (request, response) => {
  const email = request.params.email;
  const password = request.body.passWord;
  const type = request.params.type;

  if (type === "user") {
    UserDb.findOne({ email: email }).then((usr) => {
      if (usr != null) {
        response.send({
          status: false,
          message: "User already exists",
        });
      } else {
        UserDb.create({
          email: email,
          passWord: password,
          name: request.body.name,
          phoneNumber: request.body.phoneNumber,
          connected: false,
        });

        response.send({
          status: true,
          message: "User account successfully created",
        });
      }
    });
  } else if (type === "business") {
    BusinessDb.findOne({ email: email }).then((bsns) => {
      if (bsns != null) {
        response.send({
          status: false,
          message: "Business already exists",
        });
      } else {
        BusinessDb.create({
          email: email,
          passWord: password,
          name: request.body.name,
          phoneNumber: request.body.phoneNumber,
          description: request.body.description,
          location: null,
          services: [],
          category: request.body.category,
          connected: false,
        });

        response.send({
          status: true,
          message: "Business account successfully created",
        });
      }
    });
  } else {
    response.send({
      status: false,
      message: "invalid type provided",
    });
  }
});

app.get("/getAccount=:email&:type", (request,response) =>{

  const email = request.params.email;
  const type = request.params.type
  
  const db = type === 'user' ? UserDb: BusinessDb;

  db.findOne({email: email}).select('-__v -_id').then(acc =>{
    if (acc == null) {
      response.send({
        status: false,
        message: "Account does not exist",
        account: null
      });
    }else{
      response.send({
        status: true,
        message: "Account exists",
        account: acc
      });
    }
  });
});

app.post("/updateAccount=:email&:type", (request, response) =>{
  const email = request.params.email;
  const type = request.params.type;
  const updatedAccount = request.body;

  if(updatedAccount.email !== email){
    response.send({
      status: false,
      message: "sorry, not allowed to change email"
    })
  }else{

    const db = type === 'user' ? UserDb: BusinessDb;

    db.updateOne({ email: email }, updatedAccount , (err) =>{
      if (err) {
        response.send({
          status: false,
          message: "failed to update account",
        });
      } else {
        response.send({
          status: true,
          message: "account updated successfully",
        });
      }
    });
  }
});
 
app.get("/getAccountsByCategory=:category", (request, response) =>{

  const category = request.params.category;

  BusinessDb.find({category: category}).select('-__v -_id').then(accnts =>{
    if (accnts == null) {
      response.send({
        status: false,
        message: "No accounts are in this category",
        accounts: []
      });
    }else{
      response.send({
        status: true,
        message: "Found accounts ",
        accounts: accnts
      });
    }
  });
});

app.post("/uploadVideo=:email", upload.single('video'), (request, response) => {

  const email = request.params.email;
  const fileName = request.body.fileName;

  VideoDb.create({
    email : email,   
    filePath : './videos/'+fileName
    })
    .then(() =>{
      response.send({
      status: true,
      message: "video uploaded successfully",
    });
  });
});
