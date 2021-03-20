var express = require('express');
var nodemailer = require('nodemailer')
var fs = require('fs');
var jsonfile = require('jsonfile')
var bodyParser = require('body-parser')
var app = express();
var nodemailer = require('nodemailer')
const { v4: uuidv4 } = require('uuid');
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
    var users = JSON.parse(fs.readFileSync('./data.json', 'UTF-8'));
    var user = users.find(u => u.name === req.body.user);
    if (username == user.name && password == user.pass) {
        console.log("Succesfully Login")
        res.cookie('LoggedIn', user.name)

        res.send({ redirect: true, url: "/user" })

app.get('/user', function (req, res) {
    if (req.cookies.LoggedIn == undefined) {
        res.redirect('/')
    }
    else {
        var users = JSON.parse(fs.readFileSync('./data.json', 'UTF-8'));
        var user = users.find(u => u.name === req.cookies.LoggedIn);
        var images = JSON.parse(fs.readFileSync('./image.json','UTF-8'))
        var image = images.find(u => u.name === req.cookies.LoggedIn);
        res.render(__dirname + '/public/user.ejs', { name: user.name, mail: user.mail, description: user.desc, image:image.image })
    }
})


        app.get('/user/settings', function (req, res) {
            if (req.cookies.LoggedIn == undefined) {
                res.redirect('/')
            }
            else {
                var users = JSON.parse(fs.readFileSync('./data.json', 'UTF-8'));
                var user = users.find(u => u.name === username);
                res.render(__dirname + '/public/settings.ejs', { name: username, mail: user.mail })
            }
        })

        app.get('/user/settings/delete', function (req, res) {
            if (req.cookies.LoggedIn == undefined) {
                res.redirect('/')
            }
            else {
                res.sendFile(__dirname + '/public/delete.html')

            }
        })
        app.post('/user/settings/delete', function (req, res) {
            console.log(req.body.user)
            if (req.body.user = "AGREE") {
                var array = JSON.parse(fs.readFileSync('./data.json', 'UTF-8'));
                console.log(array)
                const filterArray = array.filter((item) => item.name !== username);
                console.log('Deleted')
                console.log(filterArray)
                json = JSON.stringify(filterArray); //convert it back to json
                fs.writeFileSync('./data.json', json, { encoding: 'utf8', flag: 'w' });

                res.send({ redirect: true, url: "/" });
            }




            else {
                res.redirect('/user/settings')
            }

        })

        app.get('/user/settings/change_password', function (req, res) {
            if (req.cookies.LoggedIn == undefined) {
                res.redirect('/user/settings')

            } else {
                res.sendFile(__dirname + '/public/changepass.html')
            }

        })

        app.post('/user/settings/change_password', function (req, res) {
            var JSONObject = fs.readFileSync(__dirname + '/data.json')
            console.log(req.body.password)

            if (JSONObject.includes(req.body.password)) {
                res.redirect('/user/settings')
            }
            else {
                var myArray = JSON.parse(fs.readFileSync('./data.json', 'UTF-8'));
                objIndex = myArray.findIndex((obj => obj.name == req.cookies.LoggedIn));

                console.log(myArray)

                myArray[objIndex].pass = req.body.password

                console.log(myArray)
                change = JSON.stringify(myArray);
                
                fs.writeFileSync('./data.json', change, { encoding: 'utf8', flag: 'w' });
                res.send({ redirect: true, url: "/" });
            }


        })
        app.get('/user/settings/change_name', function (req, res) {
            if (req.cookies.LoggedIn == undefined) {
                res.redirect('/')
            }
            else {
                res.sendFile(__dirname + '/public/changename.html');
            }
        })

        app.post('/user/settings/change_name', function (req, res) {
            var JSONObject = fs.readFileSync(__dirname + '/data.json')
            console.log(req.body.newname)
            if (JSONObject.includes(req.body.newname)) {
                res.redirect('/user/settings')
            }
            else {
                var myArray = JSON.parse(fs.readFileSync('./data.json', 'UTF-8'));
                objIndex = myArray.findIndex((obj => obj.name == req.cookies.LoggedIn));

                console.log(myArray)

                myArray[objIndex].name = req.body.newname

                console.log(myArray)
                
                change = JSON.stringify(myArray);

                fs.writeFileSync('./data.json', change, { encoding: 'utf8', flag: 'w' });
                var myArray = JSON.parse(fs.readFileSync('./image.json', 'UTF-8'));
                objIndex = myArray.findIndex((obj => obj.name == req.cookies.LoggedIn));

                console.log(myArray)

                myArray[objIndex].name = req.body.newname

                console.log(myArray)
                
                change = JSON.stringify(myArray);

                fs.writeFileSync('./image.json', change, { encoding: 'utf8', flag: 'w' });
                res.send({ redirect: true, url: "/" });
            }

        })

        app.get('/user/settings/change_description', function (req, res) {
            if (req.cookies.LoggedIn == undefined) {
                res.redirect('/')
            }

            else {
                res.sendFile(__dirname + '/public/changedesc.html')
            }
        })

        app.post('/user/settings/change_description', function (req, res) {
            console.log(req.body.description)
            var myArra = JSON.parse(fs.readFileSync('./data.json', 'UTF-8'));
            objIndex = myArra.findIndex((obj => obj.name == req.cookies.LoggedIn));

            console.log(myArra)

            myArra[objIndex].desc = req.body.description

            console.log(myArra)
            
            changedesc = JSON.stringify(myArra);

            fs.writeFileSync('./data.json', changedesc, { encoding: 'utf8', flag: 'w' });
            res.send({ redirect: true, url: "/user" });
        })

        app.get('/user/settings/change_picture',function (req, res) {
            if (req.cookies.LoggedIn == undefined){
                res.redirect('/')
            }

            else {
                res.sendFile(__dirname+'/public/changepicture.html')
            }
        })

        app.post('/user/settings/change_picture',function (req, res) {
            var myArra = JSON.parse(fs.readFileSync('./image.json', 'UTF-8'));
            objIndex = myArra.findIndex((obj => obj.name == req.cookies.LoggedIn));

        

            myArra[objIndex].image = req.body.picture

           
            
            changedesc = JSON.stringify(myArra);

            fs.writeFileSync('./image.json', changedesc, { encoding: 'utf8', flag: 'w' });
            res.send({ redirect: true, url: "/" });
        })

        app.get('/user/settings/status',function(req, res){
            if (req.cookies.LoggedIn == undefined){
                res.render('/')
            }
            else {
                res.sendFile(__dirname+'/public/status.html')
            }
        })

        app.post('/user/settings/status',function(req, res){
            console.log(req.body.status)
            if (req.body.status == "private"){
                var myArra = JSON.parse(fs.readFileSync('./data.json', 'UTF-8'));
                objIndex = myArra.findIndex((obj => obj.name == req.cookies.LoggedIn));
    
                console.log(myArra)
    
                myArra[objIndex].status = req.body.status
    
                console.log(myArra)
                
                changestatus = JSON.stringify(myArra);
    
                fs.writeFileSync('./data.json', changestatus, { encoding: 'utf8', flag: 'w' });

                res.redirect("/user");
            }
            else if (req.body.status == "public"){
                var myArra = JSON.parse(fs.readFileSync('./data.json', 'UTF-8'));
                objIndex = myArra.findIndex((obj => obj.name == req.cookies.LoggedIn));
    
                console.log(myArra)
    
                myArra[objIndex].status = req.body.status
    
                console.log(myArra)
                
                changestatus = JSON.stringify(myArra);
    
                fs.writeFileSync('./data.json', changestatus, { encoding: 'utf8', flag: 'w' });

                res.redirect("/user");
            }
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
            "desc": "",
            "status":"public"

        })

        var jsonArray = JSON.stringify(array);
        fs.writeFileSync('./data.json', jsonArray, { encoding: 'utf8', flag: 'w' });
        console.log('Created');
        var imagearray= JSON.parse(fs.readFileSync('./image.json', 'utf8'));
        imagearray.push({
            "name": req.body.username,
            "image": "/Images/ko.png"

        })

        var jsonImage = JSON.stringify(imagearray);
        fs.writeFileSync('./image.json', jsonImage, { encoding: 'utf8', flag: 'w' });

        res.send({ redirect: true, url: "/" });
        res.end();
    }
})


app.get('/logout', function (req, res) {
    res.clearCookie("LoggedIn")
    res.clearCookie('mail')
    res.redirect('/')
})

app.get('/alerdy_exist', function (req, res) {
    res.sendFile(__dirname + '/public/alerdy.html')
})



app.get('/search/:name', function (req, res) {
    var name = req.params.name
    var JSONObject = fs.readFileSync(__dirname + '/data.json')


    if (JSONObject.includes(req.params.name)) {
        var users = JSON.parse(fs.readFileSync('./data.json', 'UTF-8'));
        var images = JSON.parse(fs.readFileSync('./image.json','UTF-8'))
        var image = images.find(u => u.name === name);
        var user = users.find(u => u.name === name);
        if (user.status == "public"){
        res.render(__dirname + '/public/search.ejs', { name: user.name, mail: user.mail, description: user.desc,image: image.image })
        }
        else if (user.status == "private"){
            res.render(__dirname + '/public/searchprivate.ejs', { name: user.name, mail: user.mail, description: user.desc,image: image.image })
        }

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


app.get('/forgot_password',function (req, res) {
    res.sendFile(__dirname + '/public/forgotpassword.html')
    
})

app.post('/forgot_password',function (req, res) {
    console.log(req.body.user)
    var token = uuidv4();
    let transport = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        auth: {
           user: 'vgta320@gmail.com',
           pass: 'ddlvmcknsaiuwnxg'
        }
    }); 


    const message = {
        from: 'vgta320@gmail.com', // Sender address
        to: req.body.user,         // List of recipients
        subject: 'Recovery Token', // Subject line
        text: 'Your Token is '+ token  // Plain text body
    };
    transport.sendMail(message, function(err, info) {
        if (err) {
          console.log(err)
        } else {
          console.log(info);
        }

    
    
    });
    
    res.cookie('token',token)
    res.cookie('mail', req.body.user)
    res.redirect('/forgot_password/token')
    console.log('Sent')
})


app.get('/forgot_password/token',function (req, res){
    console.log('Token')

    res.sendFile(__dirname+'/public/token.html')
    
})

app.post('/forgot_password/token',function (req, res){
    console.log(req.body.tion)
    if (req.cookies.token == req.body.tion){
        res.redirect('/forgot_password/token/change_password')
        
    } else {
        res.redirect('/forgot_password')
    }
})

app.get('/forgot_password/token/change_password',function (req, res){
    if (req.cookies.mail == undefined) {
        res.redirect('/')
    }
    else {
    res.sendFile(__dirname+'/public/changeforogt.html')
    }
})

app.get('/forgot_password/token/change_password',function (req, res){
    var myArray = JSON.parse(fs.readFileSync('./data.json', 'UTF-8'));
    objIndex = myArray.findIndex((obj => obj.mail == req.cookies.mail));

    console.log(myArray)

    myArray[objIndex].pass = req.body.newpass

    console.log(myArray)
    res.redirect('/')
    change = JSON.stringify(myArray);

    fs.writeFileSync('./data.json', change, { encoding: 'utf8', flag: 'w' });
})



app.listen(3000)