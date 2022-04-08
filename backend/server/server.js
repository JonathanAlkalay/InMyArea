const express = require('express');
const app = express();
const cors = require('cors');
const Businessdb = require('../schemas/business_schema');
const Userdb = require('../schemas/user_schema');
app.use(cors());

const mongoose = require('mongoose');
const e = require('cors');
const mongoDB = "mongodb+srv://jonathan:Aa123654!@cluster0.2lj7x.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => app.listen(8080))
    .then(console.log("connected to mongo and server listening on port 8080"));




app.get('/logIn=:userName&:passWord&:type', (request, response) => {

    const username = request.params.userName;
    const password = request.params.passWord;
    const type = request.params.type


    if(type === 'user'){
        Userdb.findOne({ userName: username })
            .then((usr) => {

                if(usr == null){
                    response.send({
                        "status": false,
                        "message": "user does not exist"
                    });
                }else{

                if(usr.passWord === password){    
                    usr.connected = true;
                    usr.save();
                    response.send({
                        "status": true,
                        "message": "log in successful"
                    });
                }else{
                    response.send({
                        "status": false,
                        "message": "wrong password"
                    });
                }
            }
            });
        }
        else if (type === 'business'){
            Businessdb.findOne({ userName: username })
            .then((bsns) => {

                if(bsns == null){
                    response.send({
                        "status": false,
                        "message": "business does not exist"
                    });
                }else{

                if(bsns.passWord === password){    
                    bsns.connected = true;
                    bsns.save();
                    response.send({
                        "status": true,
                        "message": "log in successful"
                    });
                }else{
                    response.send({
                        "status": false,
                        "message": "wrong password"
                    });
                }
            }
            });
        }
        else{
            response.send({
                "status": false, 
                "message": "incorrect type provided"
            }); 
        }
       
});


app.get('/logOut=:userName&:type', (request, response) => {

    const userName = request.params.userName;
    const type = request.params.type;

    if(type === 'user'){
    Userdb.findOne({ userName: userName })
        .then((usr) => {

            if(usr != null){
                usr.connected = false;
                usr.save();
                response.send({
                    "status": true,
                    "message": "logged out successfully"
                });
            }else{
                response.send({
                    "status": false,
                    "message": "user name is invalid"
                })
            }
        });
    }else if(type === "business"){
        Businessdb.findOne({ userName: userName })
        .then((bsns) => {

            if(bsns != null){
                bsns.connected = false;
                bsns.save();
                response.send({
                    "status": true,
                    "message": "logged out successfully"
                });
            }else{
                response.send({
                    "status": false,
                    "message": "user name is invalid"
                })
            }
        });

    }else{
        response.send({
            "status": false,
            "message": "incorrect username provided"
        });
    }
});


app.get('/createAccount=:userName&:passWord&:type', (request, response) => {

    const username = request.params.userName;
    const password = request.params.passWord;
    const type = request.params.type;

    if (type === 'user'){
    Userdb.findOne({userName: username})
        .then((usr) => {

            if(usr != null){
                response.send({
                    "status": false,
                    "message": "User already exists"
                })
            }else
                Userdb.create({ userName: username, passWord: password, connected: false});    
        });
    }else if(type === 'business'){

        Businessdb.findOne({userName: username})
        .then((bsns) => {

            if(bsns != null){
                response.send({
                    "status": false,
                    "message": "Business already exists"
                })
            }else
                Businessdb.create({ userName: username, passWord: password, connected: false});    
        });
    }else{
        response.send({
            "status": false, 
            "message": "invalid type provided"
        });
    }
});