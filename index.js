var express = require('express');
var fs = require('fs'); 
var bodyParser = require('body-parser')
var app = express();


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
var users = JSON.parse(fs.readFileSync('./data.json', 'UTF-8'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
})

app.post('/', function (req, res) {
    var username = req.body.user
    var password = req.body.pass
    console.log(username)
    console.log(password)
    var user = users.find(u => u.name === username);
    if (username == user.name && password == user.pass) {
        console.log("Succesfully Login")
        res.send({ redirect: true, url: "/user/" + username })
        


        app.get('/user/' + username, function (req, res) {
            res.render(__dirname + '/public/user.ejs', { name: username })
        })



    } else {
        res.send({ redirect: true, url: "/" });
    }

})
app.get('/register', function (req, res) {
    res.sendFile(__dirname + '/public/register.html')
})


app.post('/register', function (req, res) {
    console.log(req.body.username)
    console.log(req.body.comment)
    var JSONObject = fs.readFileSync(__dirname + '/data.json')

    if (JSONObject.includes(req.body.username)) {
        return true;
    }
    else if (JSONObject.includes(req.body.comment)) {
        return true;
    }

    else {
        var array = JSON.parse(fs.readFileSync('./data.json', 'utf8'));
        array.push({
            "name": req.body.username,
            "pass": req.body.comment
        })

        var jsonArray = JSON.stringify(array);
        fs.writeFileSync('./data.json', jsonArray, { encoding: 'utf8', flag: 'w' });
        console.log('Created');
        res.send({ redirect: true, url: "/" });
        res.end();
    }
})




app.get('/alerdy_exist', function (req, res) {
    res.sendFile(__dirname + '/public/alerdy.html')
})

app.listen(3000)