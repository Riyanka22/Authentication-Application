const express=require('express');
const mysql=require('mysql');
const path=require('path');
const dotenv=require('dotenv');
const session = require('express-session');
dotenv.config({path: './config.env'});

// server 
const app=express();

//establishing database connection
const db=mysql.createConnection({
    // host: 'localhost',//as we are hosting locally(if we have a server we will put the ip add. of that server)
    // //these two are the by default user & password for xampp
    // user: 'root',
    // password: '',
    // database : 'login_reg_db'//my database name

    host: process.env.DB_HOST,//as we are hosting locally(if we have a server we will put the ip add. of that server)
    //these two are the by default user & password for xampp
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database : process.env.DB//my database name
});

const crypto = require('crypto');
const secretKey = crypto.randomBytes(32).toString('hex');
// Configure session
app.use(session({
    secret: secretKey,
    resave: false,
    saveUninitialized: true
  }));

//in public folder we have neccessary html,css file
const publicDir=path.join(__dirname,'./public');//present directory+public folder
app.use(express.static(publicDir));//server will use the files of public directory

//these two are for to grabbing the datas of register form
app.use(express.urlencoded({extended: false}));//parse url-encoded bodies (sent by html forms) ->covert form data to server understandable data
app.use(express.json()); //values that we are grabing from forms are in jason format

//template engine
app.set('view engine','hbs');

//connecting db
db.connect( (err) => {
    if(err) {
        console.log(err);
    }
    else {
        console.log('sql connected');
    }
})

//define routes
app.use('/',require('./routes/pages'));
// app.use('/auth',require('./routes/auth'))

app.listen(5000,()=>{
    console.log('listening...');
})