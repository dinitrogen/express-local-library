// import the mongoose module
var mongoose = require('mongoose');

// Set up default mongoose connection
var monogoDB = 'mongodb://127.0.0.1/my_database';
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});

// Get default connection
var db = mongoose.connection;

// bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MonogoDB connection error:'));

// Define a schema
var Schema = mongoose.Schema;

var SomeModelSchema = new Schema({
    name: String,
    a_string: String,
    a_date: Date
});

// Common Schema field types:
var generic_schema = new Schema({
    name: String,
    binary: Buffer,
    living: Boolean,
    updated: { type: Date, default: Date.now() },
    age: { type: Number, min: 18, max: 65, required: true },
    mixed: Schema.Types.Mixed,
    _someId: Schema.Types.ObjectId,
    array: [],
    ofString: [String], // You can also have an array of each of the other types too
    nested: { stuff: {type: String, lowercase: true, trim: true } }
});

// An example schema:
var breakfastSchema = new Schema({
    eggs: {
        type: Number,
        min: [6, 'Too few eggs'],
        max: 12,
        required: [true, 'Why no eggs?']
    },
    drink: {
        type: String,
        enum: ['Coffee', 'Tea', 'Water',]
    }
});

// Compile model from schema
var SomeModel = mongoose.model('SomeModel', SomeModelSchema);

// Create an instance of model
var awesome_instance = new SomeModel({ name: 'awesome' });

// Save the new model instance, passing a callback
awesome_instance.save(function(err) {
    if (err) return handleError(err);
    // saved!
});

// Use create() to define a model instance at the same time you save it
SomeModel.create({ name: 'also_awesome' }, function(err, awesome_instance) {
    if (err) return handleError(err);
    // saved!
});

// Access model field values using dot notation
console.log(awesome_instance.name); // should log 'also_awesome'

// Change record by modifying the fields, then calling save()
awesome_instance.name="New cool name";
awesome_instance.save(function (err) {
    if (err) return handleError(err);
    // saved!
});

// Searching for records
var Athlete = mongoose.model('Athlete', yourSchema);

// find all athletes who play tennis, selection the 'name' and 'age' fields
Athelete.find({ 'sport': 'Tennis' }, 'name age', function (err, athletes) {
    if (err) return handleError(err);
    // 'athletes' contains the list of athletes that match the criteria
});

// Perform a query without a callback, then execute query later
// find all athletes that play tennis
var query = Athlete.find({ 'sport': 'Tennis' });
// selecting the 'name' and 'age' fields
query.select('name age');
// limit our results to 5 items
query.limit(5);
// sort by age
query.sort({age: -1});
//execute the query at a later time
query.exec(function(err, athletes) {
    if (err) return handleError(err);
    // athletes contains an ordered list of 5 athletes who play Tennis
});

// Same as above but stringing together using where() and dot operators
Athlete.
    find().
    where('sport').equals('Tennis').
    where('age').gt(17).lt(50). // Additional where query
    limit(5).
    sort({ age: -1 }).
    select('name age').
    exec(callback); // where callback is the name of our callback function


// Working with related documents - population

var authorSchema = Schema({
    name: String,
    stories: [{ type: Schema.Types.ObjectId, ref: 'Story' }]
});

var storySchema = Schema({
    author: { type: Schema.Types.ObjectId, ref: 'Author' },
    title: String
});

var Story = mongoose.model('Story', storySchema);
var Author = mongoose.model('Author', authorSchema);

var bob = new Author({ name: 'Bob Smith' });

bob.save(function(err) {
    if (err) return handleError(err);

    // Bob now exists, so lets create a story
    var story = new Story({
        title: "Bob goes sledding",
        author: bob._id // assign the _id from our author Bob. This ID is created by default!
    });

    story.save(function(err) {
        if (err) return handleError(err);
        // Bob now has his story and story doc references Bob's ID
    });
});

// To get author information in the story results use populate():
Story
    .findOne({ title: 'Bob goes sledding' })
    .populate('author') // This populates the author id with actual author information!
    .exec(function(err, story) {
        if (err) return handleError(err);
        console.log('The author is %s', story.author.name);
        // prints "The author is Bob Smith"
    });

// To get all stories by a particular author, get the _id of the author, then use find() to search the author field across all stories:
Story
    .find({ author: bob._id })
    .exec(function(err, stories) {
        if (err) return handleError(err);
        // returns all stories that have Bob's id as their author
    });

// File structure - one schema/model per file
// It is recommended that each model schema gets its own file, then export the method to create the model:
// File: ./models/somemodel.js

// Require Mongoose
var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var SomeModelSchema = new Schema({
    a_string: String,
    a_date: Date,
});

// Export function to create "SomeModel" model class
module.exports = mongoose.model('SomeModel', SomeModelSchema);

// Then require and use the model in other files:
// Create a SomeModel model just by requiring the module
var SomeModel = require('../models/somemodel')

// Use the SomeModel object (model) to find all SomeModel records
SomeModel.find(callback_function);

// My connection url
// mongodb+srv://dinitrogen:knobs2023@cluster0.2tmnk.mongodb.net/local_library?retryWrites=true&w=majority
