var router = require('express').Router();
var path = require('path');
var pg = require('pg');
var connectionString = require('../db/connection').connectionString;
var fs = require('fs');



router.get('/', function(request, response) {
  response.sendFile(path.join(__dirname, '../public/views/index.html'));
});


router.get('/data', function(req, res) {
  console.log('got request');
  pg.connect(connectionString, function(err, client) {
    var result = [];

    var classIndex = [];
    var orderIndex = [];
    var familyIndex = [];

    var query = client.query('SELECT "class" FROM csv GROUP BY "class";');

    query.on('row', function(row) {
      result.push({label: row.class, groups: []});
      classIndex.push(row.class);
    });

    query.on('end', function() {
      var query = client.query('SELECT "order","class" FROM csv GROUP BY "order","class";');

      query.on('row', function(row) {
        var index = classIndex.indexOf(row.class);
        result[index].groups.push({label: row.order, groups: []});
        orderIndex.push(row.order);
      });

      query.on('end', function() {
        var query = client.query('SELECT "family", "order", "class" FROM csv GROUP BY "family", "order", "class";');

        query.on('row', function(row) {
          var ci = classIndex.indexOf(row.class);
          var oi = result[ci].groups.findIndex(s => s.label === row.order);
          console.log(oi);
          result[ci].groups[oi].groups.push({label: row.family, groups: []});
          familyIndex.push(row.family);
        });

        query.on('end', function() {
          var query = client.query('SELECT species, "family", "order", "class", survind, fertind, disko FROM csv');

          query.on('row', function(row) {
            var ci = classIndex.indexOf(row.class);
            var oi = result[ci].groups.findIndex(s => s.label === row.order);
            var fi = result[ci].groups[oi].groups.findIndex(s => s.label === row.family);
            result[ci].groups[oi].groups[fi].groups.push({label: row.species, weight: row.survind + row.fertind, disko: row.disko});
          });

          query.on('end', function() {
            console.log('ended', result[1].groups[0].groups[0]);
            var output = JSON.stringify(result);
            console.log('stringified');
            res.send(result);
            console.log('sent');
            fs.writeFileSync(process.cwd() + '/output.json', output);
            client.end();
          });
        });
      });

    });




  });
});



module.exports = router;
