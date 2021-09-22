const express = require('express');
const bodyparser = require('body-parser');
const path = require('path');
const ejs = require('ejs');
const fileupload = require('express-fileupload');

const app = express();
const port = 3000;

const conn = require('./config/db.config')

app.set('view engine', 'ejs');
// console.log(path.join(__dirname,'views'));
app.set('views',path.join(__dirname,'views'));
// console.log(path.join(__dirname,'image'));
app.use(express.static(path.join(__dirname, 'image')));

app.use(bodyparser.urlencoded({extended:true}));
app.use(bodyparser.json());
app.use(fileupload());

app.get('/add',(req,res) => {
    res.render('form');
});

app.post('/save',(req,res) => {
    if(req.method == "POST")
    {
        var name = req.body.name;
        var email = req.body.email;
        var password = req.body.password;
        var file = req.files.image;
        var img_name = file.name;

        if(file.mimetype == "image/jpeg" || file.mimetype == "image/png" || file.mimetype == "image/gif")
        {
            file.mv('image/'+file.name, (err) => {
                if(err)
                    return res.status(500).send(err);

                var sql = "INSERT INTO userdata (name,email,password,image) VALUES ('"+ name +"','"+ email +"','"+ password +"','"+ img_name +"')";

                // console.log(sql);
                
                var query = conn.query(sql, (err,result) => {
                    if(err) throw err;

                    res.redirect('/');
                })
            })

        }
    }
    else
    {
        res.send('not post method');
    }
})

app.get('/', (req,res) => {
    var sql = "SELECT * FROM userdata";
    var query = conn.query(sql, (err, results) => {
        if(err) throw err;
        res.render('view',{
            results:results
        })
    })
})

app.get('/image', (req,res) => {
    res.render('image');
})

app.get('/edit/:id', (req,res) => {
    var id = req.params.id;

    var sql = "SELECT * FROM userdata WHERE id = '"+ id +"'";

    conn.query(sql, (err,result) => {
        if(err) throw err;
        console.log(sql);
        console.log(result[0].image)
        res.render('user_edit', {
            user:result[0]
        })
    })

})

app.post('/update',(req,res) => {
   
        var id = req.body.id;
        var name = req.body.name;
        var email = req.body.email;
        var password = req.body.password;
       
        // console.log(id);
        // console.log(name);

        if((req.files && req.files.image))

        {
            var file = req.files.image;
            var img_name = file.name;
            if(file.mimetype == "image/jpeg" || file.mimetype == "image/png" || file.mimetype == "image/gif")
            {
                file.mv('image/'+file.name, (err) => {
                    if(err)
                        return res.status(500).send(err);
                    
                })
            }
            var sql = "UPDATE userdata SET name = '"+ name +"',email = '"+ email +"', password = '"+ password +"', image = '"+ img_name +"' WHERE id = '"+ id +"'";
        }
        else
        {
            var sql = "UPDATE userdata SET name = '"+ name +"',email = '"+ email +"', password = '"+ password +"' WHERE id = '"+ id +"'";
        }

        var query = conn.query(sql, (err,result) => {
            if(err) throw err;
            console.log(result)
            res.redirect('/');
        })
})

app.get('/delete/:id', (req,res) => {
    var id = req.params.id;
    // console.log(id);

    var sql = "DELETE FROM userdata WHERE id = '"+ id + "'";
    conn.query(sql, (err,result) => {
        if(err) throw err;
        res.redirect('/');
    })
})



app.listen(port,() => {
    console.log(`server is running on the port ${port}`);
})


