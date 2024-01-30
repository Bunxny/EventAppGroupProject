// set up Express
var express = require('express');
var app = express();

// set up BodyParser
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

// set up EJS
app.set('view engine', 'ejs');

// import the Person class from Person.js
var Person = require('./Person.js');


// endpoint for listing all persons
app.use('/all', (req, res) => {
	Person.find({})
		.then((persons) => {
			res.render('allpersons', {'persons' : persons})
		})
		.catch((err) => {
			res.type('html').status(200);
		    console.log('uh oh: ' + err);
		    res.send(err);
		})
})

// endpoint for creating a new person
// this is the action of the "create new person" form
app.use('/create', (req, res) => {
	// construct the Person from the form data which is in the request BODY
	var newPerson = new Person ({
		name: req.body.name,
		age: req.body.age,
	    });

	// write it to the database
	newPerson.save()
		.then((p) => { 
			console.log('successfully added ' + p.name + ' to the database'); 
			// use EJS to render the page that will be displayed
			res.render('newperson', {'person': p})
		} )
		.catch((err) => { 
			res.type('html').status(200);
		    console.log('uh oh: ' + err);
		    res.send(err);
		})
	});


/* the two endpoints below here are for editing a person */

// this one shows the HTML form for editing the person
app.use('/showEditForm', (req, res) => {
	var filter = { 'name' : req.query.name };
	// do a query to get the info for this person
	Person.findOne(filter)
	.then((p) => {
		// then show the form from the EJS template
		res.render('eventform', {'person' : p})
	})
	.catch((err) => {
		res.type('html').status(200);
		console.log('uh oh: ' + err);
		res.send(err);
	})
})

// this endpoint is called when the user SUBMITS the form to edit a person
app.use('/edit', (req, res) => {
	// get the name and age from the BODY of the request
	var filter = { 'name' : req.body.name };
	var update = { 'age' : req.body.age } ;

	// now update the person in the database
	Person.findOneAndUpdate(filter, update)
	.then((orig) => { // 'orig' refers to the original object before we updated it
		res.render('editedperson', {'name' : req.body.name, 'age' : req.body.age})
	})
	.catch((err) => {
		res.type('html').status(200);
		console.log('uh oh: ' + err);
		res.send(err);
	})

})

/* These are endpoints for your group to implement in Part 4 of the activity */

app.use('/view', (req, res) => {
    var name = req.query.name
    var filter = { 'name' : name };
 Person.findOne(filter)
  .then((person) => {
   res.render('viewperson', {'person' : person, 'requestedName' : name})
  })
  .catch((err) => {
   res.type('html').status(200);
      console.log('uh oh: ' + err);
      res.send(err);
  })
})
	
app.use('/delete', (req, res) => {
    var name = req.query.name
 var filter = { 'name' : name };
 Person.deleteOne(filter)
  .then(() => {
   console.log('successfully deleted ' + name + ' from the database');
   res.render('deletedperson', {'name' : name})
  })
  .catch((err) => {
   res.type('html').status(200);
      console.log('uh oh: ' + err);
      res.send(err);
  })
})

	
/*************************************************
Do not change anything below here!
*************************************************/

app.use('/public', express.static('public'));

// this redirects any other request to the "all" endpoint
app.use('/', (req, res) => { res.redirect('/all'); } );

// this port number has been assigned to your group
var port = 3006

app.listen(port,  () => {
	console.log('Listening on port ' + port);
    });
