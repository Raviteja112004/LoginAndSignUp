const express = require('express');
const app = express();
const path = require('path');
const port = 3000;
const hbs = require('hbs');  //template engine like ejs
const collectn = require('./mongodb'); //collection  name importing
const { success } = require('toastr');

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
// app.set('views', path.join(__dirname, 'Login'));
// app.set('views', path.join(__dirname, 'frontend'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }))
app.use(express.json());

// app.get('/home', (req, res) => {    //default is login page localhost:3000/
//     res.render('home',{content:'Log in',form:'/login'});
// });
app.get('/', (req, res) => {    //default is login page localhost:3000/
    res.render('home',{content:'Log in',form:'/login'});
});

app.get('/login',(req,res)=>{
    res.render('login',{content:''});
})
app.get('/signup', (req, res) => {
    res.render('signup',{content:''});
});
app.post('/signup', async (req, res) => {   //when /signup is posted into url this code works
    const check = await collectn.findOne({ name: req.body.name })
    
    if (check != null) {                //here since u are using if condition no need to use try catch block
        if (check.name === req.body.name) {
            res.render('signup',{content:'Username already taken',wrongPassword:"Username taken"})
            
        }
    }
    else {

        const data = {
            name: req.body.name,    
            password: req.body.password
        }
        await collectn.insertMany([data]);  //storing sign up details into db used await because storing data may take some time
        res.render('home',{content:'Log Out',user:req.body.name,form:'/',successSign:"SignUP successfull"});         //then rendering home page
    }

})
app.post('/login', async (req, res) => {
    try {
        const check = await collectn.findOne({ name: req.body.name })
        if (check.password === req.body.password) {    //works if username found, else an error is thrown and caught by catch block
            res.render('home',{content:'Log Out',user:`Hello ${req.body.name}`,form:'/',   successMessage: 'Login successful!'});
        }
        else {          //username found but password didnt match
        //    res.send('Wrong Password')
        res.render('login',{wrongPassword: 'Wrong Password'})
        
        }
    } catch {
        res.render('login',{content:'Wrong Details',wrongPassword:"Wrong Username"})
    }
});




app.listen(port, () => {
    console.log(`Listening on port ${port}`);
    console.log('\nhttp://localhost:3000');

});

