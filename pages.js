//organized all the pages
const express=require("express");
const router=express.Router();

router.get('/',(req,res)=>{
  if(req.session.user)
  {
    res.render('dashboard', { username: req.session.user.name , alert_message:'Logout first'});
    //alert('Logout first');
  }
  else{
    res.render('login');
  }
});

router.get('/login',(req,res)=>{
  if(req.session.user)
  {
    res.render('dashboard', { username: req.session.user.name , alert_message:'Logout first'});
    //alert('Logout first');
  }
  else{
    res.render('login');
  }
});

router.get('/register',(req,res)=>{
  if(req.session.user)
  {
    res.render('dashboard', { username: req.session.user.name , alert_message:'Logout first'});
    //res.render('login', { message_login:'Already logged in'});
    //alert('Logout first');
  }
  else{
    res.render('register');
  }
});

router.get('/dashboard',(req,res)=>{
    if (req.session.user) {
        // User is authenticated, render the dashboard
        res.render('dashboard', { username: req.session.user.name });
      } else {
        // User is not authenticated, redirect to the login page
        res.redirect('/');
      }
});

router.get('/logout',(req,res)=>{
  console.log('logged out');
  req.session.destroy();
    res.redirect('/');
});

//organized all the pages
const authController=require('../controllers/auth');

router.post('/register',authController.register);

router.post('/login',authController.login);


module.exports=router;
