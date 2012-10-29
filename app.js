
/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , baseview = require('baseview')('http://127.0.0.1:8092')
  , sparta = require('sparta')
  , path = require('path');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

app.get('/tweets', function(req, res) {

  bbox = sparta.boundingBox(40.726446,-74.00528, 1000).toString()

  baseview.spatial('sandy', 'index', {bbox: bbox}, function(error, points) {
    data = {
      "type": "FeatureCollection",
      "features": []        
    }
    points.rows.forEach(function(p) {
      point = {
        "type": "Feature"
      }
      if(!point.properties) {
        point.properties = {
          'marker-color': '#000',
          'marker-symbol': 'star-stroked'
        }
      }
      point.id = p.id
      point.properties.user = p.value[0]
      point.properties.text = p.value[1]
      p.geometry.coordinates = [p.geometry.coordinates[1], p.geometry.coordinates[0]]
      point.geometry = p.geometry
      data.features.push(point)
    })
    res.json(data)
  })
})

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
