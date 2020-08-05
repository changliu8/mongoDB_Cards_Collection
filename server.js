//Create express app
const express = require('express');
let app = express();
//Database variables
let mongo = require('mongodb');
let MongoClient = mongo.MongoClient;
let db;
let cls;

//View engine
app.set("view engine", "pug");

//Set up the routes
app.use(express.static("public"));
app.get("/", sendIndex);
//app.get("/", sendInd);
app.get("/cards/:cardID", sendCard);

function sendIndex(req, res, next){

	db.collection("cards").distinct("cardClass", function(err, result){
		cls = result;
	});
	db.collection("cards").distinct("rarity", function(err, result){
		res.render("index",{cls:cls, rar:result});
	});	
	
}
function sendCard(req, res, next){
	let oid;
	try{
		oid = new mongo.ObjectID(req.params.cardID);
	}catch{
		res.status(404).send("Unknown ID");
		return;
	}
	
	db.collection("cards").findOne({"_id":oid}, function(err, result){
		if(err){
			res.status(500).send("Error reading database.");
			return;
		}
		if(!result){
			res.status(404).send("Unknown ID");
			return;
		}
		res.status(200).render("card", result);
	});
}

// Initialize database connection
MongoClient.connect("mongodb://localhost:27017/", function(err, client) {
  if(err) throw err;

  //Get the t8 database
  db = client.db('t8');
  
  // Start server once Mongo is initialized
  app.listen(3000);
  console.log("Listening on port 3000");
});