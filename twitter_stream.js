var express = require('express')
var app = express()
var couchbase = require('couchbase')

var config = {
    hosts: ['127.0.0.1:8091', '127.0.0.1:9000'],
    user: 'Administrator',
    password: 'helloworld',
    bucket: 'default'
}

var crypto = require('crypto')

var Twit = require('twit')

var auth_keys = require('./lib/keys_dev')

var twitter = new Twit({
    consumer_key:         consumerKey
  , consumer_secret:      consumerSecret
  , access_token:         accessToken
  , access_token_secret:  accessTokenSecret
})

var stream

listen = function(req, res) {
  console.log('Listening to twitter ...')
  stream = twitter.stream('statuses/filter', { track: '#Sandy' })
  stream.emit('start')
  stream.on('tweet', function (tweet) {
    if(tweet.geo && tweet.possibly_sensitive != true) {
      var md5sum = crypto.createHash('md5')
      var docId = md5sum.update(tweet.id_str).digest('hex')
      process.stdout.write('.')
      var doc = {}
      doc.type = 'tweet'
      doc.text = tweet.text
      doc.user = tweet.user.name
      doc.created_at = new Date()
      doc.location = tweet.geo
      if(tweet.place)
        doc.place = tweet.place
      couchbase.connect(config, function(error, cb) {
        cb.set(docId, JSON.stringify(doc), function(error, meta) {
          if(error)
            console.log(error, meta)
          else
            process.stdout.write(';')
        })
      })
    }
  })
}
app.listen(3001)
listen()
