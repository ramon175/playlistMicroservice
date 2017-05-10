/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require('express');

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

// create a new express server
var app = express();

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();


var cloudant = require('cloudant')('https://c7d291df-44cf-4623-bc64-4b893b52185f-bluemix:4ee5bda32290b25d4edd399c4ece13c3d174187b066ab295ecad0463cba5fcf6@c7d291df-44cf-4623-bc64-4b893b52185f-bluemix.cloudant.com');

playlist = cloudant.db.use('playlists');


app.get('/createPlaylist', function(req,res){
    var token = req.query.token || null,
        name = req.query.name || "Playlist";
    if(token === null) {
        console.log("Invalid Token");
        res.status(403).json({error: "Invalid Token"});
    }else{
    playlist.insert({   token:token, playlistName:name, uris:[]  }, function(err,body){
        if(!err){ 
            console.log('Document ' + token + ' inserted successfully');
            console.log(body);
            res.send({status:true});
            return;
        }
        res.send({status:false, error:err});
    });
    }
});

app.get('/idrev', function(req,res){
    var token = req.query.token || null;
    
    if(token === null) {
        console.log("Invalid Token");
        res.status(403).json({error: "Invalid Token"});
    }else{
    playlist.find({
      "selector": {
        "token":token
      },
      "fields":[
          "_id",
          "_rev"
      ]
    },
        function(err, data) {
          if(!err){
            console.log(" \n" + JSON.stringify(data.docs[0]));
            res.send(data.docs[0]);
            return;
          }
          console.log(err);
        });
    }
});

app.get('/insertMusic', function(req,res){
    var token = req.query.token || null,
        id,
        rev,
        artist = req.query.artist,
        track = req.query.track,
        uri = req.query.uri;
    
    if(token === null) {
        console.log("Invalid Token");
        res.status(403).json({error: "Invalid Token"});
    }else{
    playlist.find({
      "selector": {
        "token":token
      },
      "fields":[
          "_id",
          "_rev"
      ]
    },
        function(err, data) {
          if(!err){
            console.log("\n" + JSON.stringify(data.docs[0]));
            id = data.docs[0]._id;
            rev = data.docs[0]._rev;
            var docInfo = {};  
              
            playlist.find({
       "selector":{
           "_id":id
       },
        "fields":[
           "token","uris"
       ] 
    },
    function(err,data) {
        if(!err){
            docInfo = data.docs[0];
            docInfo.uris.push(uri);            
            console.log(docInfo);
            
                playlist.insert({
                    
                    _id:id,
                    _rev:rev,
                    token: docInfo.token,
                    uris: docInfo.uris,
                    artist:artist,
                    track:track
                    
                }, function(err,body){
                    if(!err){         
                        console.log("Inserted uri successfully");
                        res.send({ message:'Inserted uri successfully', status: true });
                        return;
                    }
                    res.send({status:false,err:"Could not insert uri."});                    
                });
            }
        }          
    );
          }else{
          console.log(err);
          }
        });    
    }
});



// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function() {
  // print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});
