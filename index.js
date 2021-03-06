var express = require('express');
var nodemailer = require('nodemailer')
var fs = require('fs');
var jsonfile = require('jsonfile')
var bodyParser = require('body-parser')
var app = express();
var cookieParser = require('cookie-parser')


app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
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
    var user = users.find(u => u.name === req.body.user);
    if (username == user.name && password == user.pass) {
        console.log("Succesfully Login")
        res.cookie('LoggedIn', "true")

        res.send({ redirect: true, url: "/user" })

        app.get('/user', function (req, res) {
            if (req.cookies.LoggedIn == undefined) {
                res.redirect('/')
            }
            else {
                res.render(__dirname + '/public/user.ejs', { name: username, mail: user.mail, description:user.desc })
            }
        })


        app.get('/user/settings', function (req, res) {
            if (req.cookies.LoggedIn == undefined) {
                res.redirect('/')
            }
            else {
                
                res.render(__dirname + '/public/settings.ejs', { name: username, mail: user.mail })
            }
        })

        app.get('/user/settings/delete',function (req, res) {
            if (req.cookies.LoggedIn == undefined) {
                res.redirect('/')
            }
            else {
                res.sendFile(__dirname + '/public/delete.html')

            }
        })
        app.post('/user/settings/delete',function (req, res){
            console.log(req.body.user)
            if (req.body.user = "AGREE") {
                var array = JSON.parse(fs.readFileSync('./data.json', 'UTF-8'));
                console.log(array)
                const filterArray = array.filter((item) => item.name !== username);
                 console.log('Deleted')
                 console.log(filterArray)
                 json = JSON.stringify(filterArray); //convert it back to json
                 fs.writeFileSync('./data.json', json, { encoding: 'utf8', flag: 'w' });

                 res.redirect('/')
                }
         
        
                 

            else {
                res.redirect('/user/settings')
            }

        })

        app.get('/user/settings/change_password',function (req, res){
            if (req.cookies.LoggedIn == undefined) {
                res.redirect('/user/settings')
            
            } else {
                res.sendFile(__dirname + '/public/changepass.html')
            }
            
        })

        app.post('/user/settings/change_password',function (req, res){
            var JSONObject = fs.readFileSync(__dirname + '/data.json')
            console.log(req.body.password)

            if (JSONObject.includes(req.body.password)){
                res.redirect('/user/settings')
            }
            else {
            var myArray = JSON.parse(fs.readFileSync('./data.json', 'UTF-8'));
            objIndex = myArray.findIndex((obj => obj.name == username));

            console.log(myArray)

            myArray[objIndex].pass = req.body.password

            console.log(myArray)
            change = JSON.stringify(myArray);
            res.redirect('/')
            fs.writeFileSync('./data.json',change , { encoding: 'utf8', flag: 'w' });
            }


        })
        app.get('/user/settings/change_name',function (req, res){
            if (req.cookies.LoggedIn == undefined){
                res.redirect('/')
            }
            else {
                res.sendFile(__dirname+'/public/changename.html');
            }
        })

        app.post('/user/settings/change_name',function (req, res){
            var JSONObject = fs.readFileSync(__dirname + '/data.json')
            console.log(req.body.newname)
            if (JSONObject.includes(req.body.newname)){
                res.redirect('/user/settings')
            }
            else {
                var myArray = JSON.parse(fs.readFileSync('./data.json', 'UTF-8'));
                objIndex = myArray.findIndex((obj => obj.name == username));
    
                console.log(myArray)
    
                myArray[objIndex].name = req.body.newname
    
                console.log(myArray)
                res.redirect('/')
                change = JSON.stringify(myArray);
                
                fs.writeFileSync('./data.json',change , { encoding: 'utf8', flag: 'w' });
            }

        })

        app.get('/user/settings/change_description',function(req, res){
            if(req.cookies.LoggedIn == undefined){
                res.redirect('/')
            }

            else {
                res.sendFile(__dirname+'/public/changedesc.html')
            }
        })

        app.post('/user/settings/change_description',function(req, res){
            console.log(req.body.description)
            var myArra = JSON.parse(fs.readFileSync('./data.json', 'UTF-8'));
            objIndex = myArra.findIndex((obj => obj.name == username));

            console.log(myArra)

            myArra[objIndex].desc = req.body.description

            console.log(myArra)
            changedesc = JSON.stringify(myArra);
            res.redirect('/')
            fs.writeFileSync('./data.json',changedesc , { encoding: 'utf8', flag: 'w' });
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
            "pass": req.body.comment,
            "mail": req.body.mail,
            "desc":""

        })

        var jsonArray = JSON.stringify(array);
        fs.writeFileSync('./data.json', jsonArray, { encoding: 'utf8', flag: 'w' });
        console.log('Created');
        res.send({ redirect: true, url: "/" });
        res.end();
    }
})


app.get('/logout', function (req, res) {
    res.clearCookie("LoggedIn")
    res.redirect('/')
})

app.get('/alerdy_exist', function (req, res) {
    res.sendFile(__dirname + '/public/alerdy.html')
})



app.get('/search/:name', function (req, res) {
    var name = req.params.name
    var JSONObject = fs.readFileSync(__dirname + '/data.json')


    if (JSONObject.includes(req.params.name)) {
        var user = users.find(u => u.name === name);
        res.render(__dirname + '/public/search.ejs', { name: user.name, mail: user.mail, description:user.description})
    }
    else {
        res.send("This user doesn't exist")
    }

})
app.get('/user/home', function (req, res) {
    if (req.cookies.LoggedIn == undefined) {
        res.redirect('/')


    } else {
        res.sendFile(__dirname + '/public/home.html')
    }
})


app.listen(3000)