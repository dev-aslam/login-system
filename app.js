const express = require('express');
const app = express();
const path = require('path');
const port = 5000;


const users = [{user_name:"Aslam"}]

app.set('view engine','ejs');
app.use(express.static(__dirname + '/public'));

app.get('/',(req,res)=>{
    res.render(path.join(__dirname, 'views', 'signIn.ejs'));
});

app.get('/home',(req,res)=>{
    res.render(path.join(__dirname, 'views', 'home.ejs'), { user_name: users[0].user_name });
});

app.listen(port,()=>{
    console.log(`server listening on port ${[port]}`)
})