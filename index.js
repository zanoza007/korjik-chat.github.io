//П-одключаем м0одули 
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser'); 


// Створюем Схему БД
const Schema = mongoose.Schema;
const userSchema = new Schema({name: String, email: String}, {versionKey:false});
const User = mongoose.model('User', userSchema); //передаем схему  базу данных  в модель

//Подключение к базе данных
mongoose.connect("mongodb://localhost:27017/users", {useNewUrlParser:true}, (err)=>{
    if(err) return console.log(err);
});
//используем експресс(get/post)
const app = express();

const urlEncodedParser = bodyParser.urlencoded({extended:false});
//Движок ejs
app.set('view engine', 'ejs');
//При открытие локаохост загрузка форма
app.get('/', (req, res)=>{
    res.render('forma');
});


app.post('/', urlEncodedParser, (req, res)=>{
    if(req.body)
        User.create({name: req.body.name, email: req.body.email}, (err, doc)=>{  //создается новое поле
            if(err) return console.log(err);
            console.log(doc);
        });
    res.redirect('/users');
});

//Переход 

var server = require('http').createServer(app); // Протокол для подключение к серверу 
var io = require('socket.io').listen(server);//отслеживание 


app.use( bodyParser.json() );       // для поддержки JSON
app.use(bodyParser.urlencoded({     // для поддержки URL кодировки
  extended: true
}));

users = [];
connections = [];

io.sockets.on('connection', function(socket) {
    console.log("Успешное соединение");
    connections.push(socket);

    socket.on('disconnect', function(data){
        connections.splice(connections.indexOf(socket),1);
        console.log("Успешное отключение")
    });
   
    socket.on('send mess', function(data){
        io.sockets.emit('add mess', {mess: data.mess, name:data.name});
    });
});

// создаем парсер для данных application/x-www-form-urlencoded
const urlencodedParser = bodyParser.urlencoded({extended: false});



app.get('/',urlencodedParser, function (request,response) {
    response.sendFile(__dirname + '/index.html');
});



app.post('/', urlencodedParser, (req, res)=>{
        console.log(request);
        console.log(req.body);    
       
});




app.listen(500); //localhost