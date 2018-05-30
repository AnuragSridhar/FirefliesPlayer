
const express = require('express');
const app = express();
const fs = require('fs');

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

    for(var i = 0; i < lines.length - 1; i++) {
      var line = lines[i].toLowerCase();
      var trimmed = line.trim();
      var str = ' ' + trimmed + ' ';
      if(str.indexOf(word.toLowerCase()) != -1) {
        times.push(lines[i-1].substring(0, lines[i-1].indexOf('>')-2));
      }
    }

    return(times);

}
