geolocation-demo
================

This geolocation-demo was written for a #CouchbaseBarcelona talk on Geolocation and spatial views displaying twitter messages about the hurricane 'Sandy' on a map.

Barcelona, 30.10.2012.


Couchbase View 'sandy'/'index':

    function (doc, meta) {
      if(doc.type == "tweet") {
        if(doc.location) {
          emit(doc.location, [doc.user, doc.text]);
        }
      }
    }

doc.location format:

    "location": {
        "type": "Point",
        "coordinates": [
          40.73069253,
          -73.99539275
        ]
      }

twitter_stream.js
-----------------

twitter_stream.js listens to a specific hash tag and inserts the data to Couchbase.


app.js
------

Runs a simple express-based app serving an index.html with mapbox.js code to display the tweets on the map.