const express = require('express');
const app = express();
const http = require('http');
const openssl = require('openssl-nodejs')
const fs = require('fs');
const multer = require('multer');
const upload = multer({dest: 'openssl/'})

// app.get('/', (req, res) => {
//     openssl('openssl enc -aes-128-ctr -in in.txt -out out.txt -K 0123456789abcdef0123456789abcdef -iv 00000000000000000000000000000000', function(err, buffer) {
//         console.log(err.toString(), buffer.toString());
//         fs.readFile('./openssl/out.txt', (err, data) => {
//             res.send(data.toString());
//         })
//     })
// })

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('index.html');
})

app.post('/encrypt', upload.single('file'), (req, res) => {
    // const f = req.file;
    // console.log(f);
    // res.send('hi');
    console.log(req.file);
    openssl(`openssl enc -aes-128-ctr -in ${req.file.filename} -out out.txt -K ${req.body.key} -iv ${req.body.iv}`, function(err, buffer) {
        const file = `${__dirname}/openssl/out.txt`;        
        // console.log(err.toString(), buffer.toString());
        // fs.unlink(`./openssl/${req.file.filename}`);
        res.download(file, 'out.txt');
    })
});

app.get('/downloadEncrypted', (req, res) => {
    res.download('./openssl/out.txt');
})

app.get('/downloadDecrypted', (req, res) => {
    res.download('./openssl/out1.txt');
})

app.post('/decrypt', upload.single('file'), (req, res) => {
    // const f = req.file;
    // console.log(f);
    // res.send('hi');
    openssl(`openssl enc -d -aes-128-ctr -in ${req.file.filename} -out out1.txt -K ${req.body.key} -iv ${req.body.iv}`, function(err, buffer) {
        // fs.unlink(`./openssl/${req.file.filename}`)
        const file = `${__dirname}/openssl/out1.txt`;
        res.download(file, 'out1.txt');
    })
});


http.createServer(app).listen(3000, console.log('listening on port 3000'));
