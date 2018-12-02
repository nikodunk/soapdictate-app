const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
var pg = require('pg');
var app = express();
var bodyParser = require('body-parser')


app.use(bodyParser.json())
app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});




// 5 RECEIVE DATA: TOGGLE SPECIFIC DATE ON AND OFF @ POST https://healthnotes.herokuapp.com/1/addnote/:email/:patientID/:note
app.post( '/email', function (req, res) {
	console.log(req.body.email)
	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
		client.query(`INSERT INTO users VALUES ('`+req.body.email+`');`)
		done();
		res.send( 'added' )
	})	
})



app.listen(PORT, () => console.log(`Listening on ${ PORT }`))