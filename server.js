var express = require("express");
var bodyParser = require("body-parser");
var cors = require("cors");
var mongojs = require("mongojs");

var app = express();

var corsOptions = {
    origin: 'http://localhost:8000'
};

app.use(bodyParser.json(), cors(corsOptions));

var db = mongojs('birds', ['sightings']);
db.on('error', function(err) {
	console.log('DB not connected :', err)
})
db.on('ready', function() {
	console.log('Connected to db at')
})

app.get("/api/sighting", function(req, res){
	var query = {};
	if(req.query.name){
		query.name = req.query.name;
	}
	if (req.query.location){
		query.location = req.query.location;
	}
    if(req.query._id){
  	  query._id = mongojs.ObjectId(req.query._id);
	}

	db.sightings.find(query, function(err, response){
	    if(err){
	      res.status(500).json(err);
	    } else {
	      	res.json(response);
	    }
  	})
});

app.post("/api/sighting", function(req, res){
	db.sightings.save(req.body, function(err, response){
		if(err){
			res.status(500).json(err);
		}
		else{
			res.json(response);
		}
	})
});

app.put("/api/sighting", function(req, res){
	console.log(req.query)
	if(!req.query._id){
		res.send("No id sent");
	}
	else{
		db.sightings.findAndModify({
			query: {
				_id: mongojs.ObjectId(req.query._id)
			},
			update: {
				$set: req.body
			}
		}, function(err, response){
			if(err){
				res.status(500).json(err);
			}
			else{
				res.json(response);
			}
		})
	}
});

app.delete("/api/sighting", function(req, res){
	if(!req.query._id){
		res.send("No id sent");
	}
	else{
		db.sightings.remove({
			_id: mongojs.ObjectId(req.query._id)
		}, function(err, response){
			if(err){
				res.status(500).json(err);
			}
			else{
				res.json(response);
			}
		})
	}
});

app.listen(8000, function(){
	console.log("listening on port 8000");
});