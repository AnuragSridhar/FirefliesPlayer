
const express = require('express');
const app = express();
const fs = require('fs');
const fileUpload = require('express-fileupload');
const formidable = require('formidable');
const path = require('path');


app.get('/getnames', function(req, res) {

  var filepath = 'test_files/audio'
  var filenames = new Array();

  fs.readdirSync(filepath).forEach(file => {
    filenames.push(file);
    console.log(file);
  })

  res.writeHead(200, {
      'Access-Control-Allow-Origin': '*'
  });

  res.end(JSON.stringify(filenames));
});

app.use(fileUpload());
// default options

app.post('/upload', function(req, res) {
  if (!req.files)
    return res.status(400).send('No files were uploaded.');

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  let sampleFile = req.files.sampleFile;
console.log('got file '+ sampleFile.name);
  // Use the mv() method to place the file somewhere on your server
  sampleFile.mv('test_files/audio/'+sampleFile.name, function(err) {
    if (err)
      return res.status(500).send(err);

    res.redirect('/');
  });
});


/*
app.post('/upload', function(req, res) {
  console.log('uploadbegin' + req.body);
  if (!req.files)
    console.log('!req.files');
    return res.status(400).send('No files were uploaded.');


  let sampleFile = req.files.sampleFile;
console.log('got file name' + req.files.sampleFile.name);

  sampleFile.mv('test_files/audio/' + req.files.sampleFile.name, function(err) {
    console.log('uploadprogress');
    if (err)
      return res.status(500).send(err);

    //res.send('File uploaded!');
    res.redirect('/uploadhtml');
  });

});
*/


app.get('/audiostream/:filename', function(req, res) {

    filePath = 'test_files/audio/' + req.params.filename,
        stat = fs.statSync(filePath);

    res.writeHead(200, {

        'Content-Type': 'audio/mpeg',
        'Content-Length': stat.size,
        'Access-Control-Allow-Origin': '*',
    });


    fs.createReadStream(filePath).pipe(res);
});


app.get('/uploadhtml', function(req, res) {
    res.sendFile(path.join(__dirname + '/upload.html'));
});

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/transcript/:filename/:keyword', function(req, res) {
    console.log('transcript request');

    var name = req.params.filename;
    var word = req.params.keyword;
    var filepath = 'test_files/text/' + name + "Captions.txt";
    var wordTrim = word.trim();
    var str = ' ' + wordTrim + ' ';
    var times = findWord(filepath, str);
    var JSONdata = JSON.stringify(times);
    console.log('Times : ' + times);
    console.log('JSON Data : ' + JSONdata);

    res.writeHead(200, {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
    });

    res.end(JSONdata);

});

app.listen(8080);

console.log('Server listening on port 8080...');


function findWord(path, word) {
  console.log('finding wor');
    var times = new Array();
    var lines = new Array();

    var file = fs.readFileSync(path, 'utf8');
    lines = file.split('\n');

    for (var i = 0; i < lines.length - 1; i++) {
      var line = lines[i].toLowerCase();
      var trimmed = line.trim();
      var str = ' ' + trimmed + ' ';
      if(str.indexOf(word.toLowerCase()) != -1) {
        times.push(lines[i-1].substring(0, lines[i-1].indexOf('>')-2));
      }
    }

    return(times);

}
