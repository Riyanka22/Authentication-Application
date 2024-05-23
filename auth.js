const mysql=require('mysql');
// const jwt=require('jsonwebtoken');
const bcrypt=require('bcryptjs');
const async = require('hbs/lib/async');

//establishing database connection
const db=mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database : process.env.DB
});

exports.register=(req,res)=>{
    //req.body holds all the datas of register page
    console.log(req.body);

    const { name , email , password , passwordConfirm } = req.body;

    const formData = {
        name: name || '', // Get previously submitted data 
        email: email || '',
        password: password|| '',
        passwordConfirm: passwordConfirm|| ''
    };

    db.query('SELECT email FROM users WHERE email = ?', [email],  async(err,result)=>{
        if(err){
            console.log(err);
        }
        
        if(result.length > 0)
        {
            formData.email="";
            //if duplicate email found, render register page with message 
            return res.render('register',{
                formData,
                message_reg : 'Email already registered'
            });
        }
        else if( password != passwordConfirm)
        {
            // formData.password="";
            formData.passwordConfirm="";
            //if password does not match, render register page with message 
            return res.render('register',{
                formData,
                message_reg : 'Password does not match'
            });
        }
        
        const hashedPassword = await bcrypt.hash(password,8);//8 times the password will be encrypted

        // console.log('password :',hashedPassword);

         db.query('INSERT INTO users SET ?', { name: name, email: email, password: hashedPassword  }, (err,result)=>{
            if(err)
            {
                console.log(err);
            }
            else{
                req.session.user=req.body;
                console.log('registered');
                return res.render('dashboard',{
                    username : name
                });
            }
        }); 
    });
}

//to authenticate login form
exports.login=(req,res)=>{
    //req.body holds all the datas of register page
    console.log(req.body);

    //new
    if( req.session.user)
    {
        return res.render('dashboard',{
            username :req.session.user.name,
            alert_message: 'Logout first'
        });
    }

    const { email , password} = req.body;

    const formData = {
        // Get previously submitted data 
        email: email ,
        password: password,
    };

    db.query('SELECT * FROM users WHERE email = ?', [email],  async(err,result)=>{
        console.log(result[0]);//return array of objects so we need to write result[0]
        // const hashedPassword = await bcrypt.hash(password,8);
        // console.log(hashedPassword);
        
        if(result.length == 0)
        {
            //email not registered 
            return res.render('login',{
                // Get previously submitted data 
                formData,
                message_login : 'Email not registered'
            });
        }
        let match = await bcrypt.compare(password,result[0].password); //hashed password is typically 60 char long
        console.log(match);
        if(match==false)
        {
            //if password does not match 
            return res.render('login',{
               // Get previously submitted data 
                formData ,
                message_login : 'Wrong password'
            });
        }
        
        console.log('logged in');
        req.session.user=result[0];
        return res.render('dashboard',{
            username : result[0].name
        });
    });
}