const express = require("express");
const app = express();
const cors = require("cors");
const BusinessDb = require("../schemas/business_schema");
const UserDb = require("../schemas/user_schema");
const VideoDb = require("../schemas/video_schema");
const AppointmentDb = require("../schemas/appointment_schema");

app.use(cors());
app.use(express.json());

const mongoose = require("mongoose");
const mongoDB =
"mongodb+srv://luay:wdLXjKCx8moCVHWW@cluster0.gsiom.mongodb.net/?retryWrites=true&w=majority";

mongoose
  .connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(8080))
  .then(console.log("connected to mongo and server listening on port 8080"));

const path = require('path');
const multer = require('multer');
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
          location: request.body.location,
          services: [],
          category: request.body.category,
          connected: false,
          longitude: request.body.longitude,
          latitude: request.body.latitude,
          businessHours: {}
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

app.post("/updateBusinessHours=:email", (request, response) =>{

  BusinessDb.updateOne({email: request.params.email}, {businessHours: request.body}).then(err =>{
    if(err){

    response.send({
      status: false,
      message: "failed to update"
    })
    }else{
      response.send({
        status: true,
        message: "updated path successfully"
      })
    }
  })
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

app.get("/getAccountsByLocation=:long&:lat", (request, response) =>{

  const calcDistance = require("../utils");

  const {long, lat} = request.params;

  BusinessDb.find({}).then(accnts =>{

    const nearByBusinesses = accnts.filter(acc => calcDistance(lat, long, acc.latitude, acc.longitude) <= 5);
  
    response.send({
      status: true,
      message: `found ${nearByBusinesses.length} accounts near`,
      accounts: nearByBusinesses
    })
  });
})

app.post("/addAppointment", (request, response) =>{

  const appointment = request.body;
  const {businessId, date, time} = appointment;


  AppointmentDb.findOne({businessId: businessId, date: date, time: time}).then(app =>{
    if(app == null){

      AppointmentDb.create({...appointment}).then(() =>{
        response.send({
          status: true,
          message: "appointment made",
        });
      })
    }else{
      response.send({
        status: false,
        message: "time not available",
      });
    }
  })
})

app.post("/editAppointment=:userEmail&:businessEmail&:date&:time", (request, response) =>{

 const {userEmail, businessEmail, date, time} = request.params;
 const appointment = request.body;

 if (Object.keys(appointment).length == 0){
   AppointmentDb.deleteOne({userId: userEmail, businessId: businessEmail, date: date, time: time}).then((obj) =>{

    if(obj.matchedCount > 0){

      response.send({
        status: true,
        message: "appointment removed",
      })
    }else{
      response.send({
        status: false,
        message: "no appointments found",
      })
    }
  })
}else{
  AppointmentDb.findOne({businessId: businessEmail, date: appointment.date, time: appointment.time}).then(app =>{
    if(app == null){

      AppointmentDb.updateOne({userId: userEmail, businessId: businessEmail, date: date, time: time}, appointment).then((obj) =>{
        if(obj.matchedCount > 0){
    
          response.send({
            status: true,
            message: "appointment updated",
          })
        }else{
          response.send({
            status: false,
            message: "no appointments found",
          })
        }
    })
    }else{
      response.send({
        status: false,
        message: "time not available",
      });
    }
  })
}
})

app.get("/getAppointmentByUser=:email", (request, response) =>{

  const {email} = request.params;

  AppointmentDb.find({userId: email}).select('-__v -_id').then(appointments =>{
    if (appointments == null) {
      response.send({
        status: false,
        message: "No appointments found",
        appointments: []
      });
    }else{
      response.send({
        status: true,
        message: `found ${appointments.length} appointments`,
        appointments: appointments
      });
    }
  });
})

app.get("/getAppointmentsByDate=:email&:date", (request, response) =>{

  const {email, date}  = request.params;

  AppointmentDb.find({ businessId: email }).then((appointments) => {
    if (appointments != null) {

      const appointmentHits = appointments.filter(a => a.date === date)

      response.send({
        status: true,
        appointments: appointmentHits,
        message: `found ${appointmentHits.length} appointments`,
      });
    } else {
      response.send({
        status: false,
        appointments: [],
        message: "no appointments found",
      });
    }
  });
})

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

app.post("/saveVideoPath=:email&:path", (request, response) =>{

  const {email, path} = request.params;

  VideoDb.create({
    email : email,   
    filePath : path
  }).then(() =>{
    response.send({
      status: true,
      message: "video saved",
    })
  })
});

app.get("/getVideoPath=:email", (request, response) =>{
  VideoDb.find({email: request.params.email}).select('-__v -_id').then(obj =>{

    const vidPath = obj[0].filePath;
    if(obj == null){
      response.send({
        status: false,
        message: "video does not exist for this email",
        path: null
      })
    }else{
      response.send({
        status: true,
        message: "found path",
        path: vidPath
      })
    }
  })
})

app.post("/updateVideoPath=:email&:path", (request, response) =>{

  const {email, path} = request.params
  VideoDb.updateOne({email: email}, {...request.params}, err =>{
    if(err){
      response.send({
        status: false,
        message: "failed to update path"
      })
    }else{
      response.send({
        status: true,
        message: "saved new path"
      })
    }
  })
})


module.exports = app;
