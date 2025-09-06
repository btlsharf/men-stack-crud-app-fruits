const dotenv = require("dotenv"); // require package
const express = require("express");
const { default: mongoose } = require("mongoose");
const PORT = 3000; // should be in env
const morgan = require('morgan');
const app = express();
const mogoose = require('mongoose');
const methodeOverride = require('method-override');
 const methodOverride = require("method-override");
 // new code below this line
 const path = require("path");


 app.use(express.urlencoded({ extended: false }));
 app.use(methodOverride("_method"));
 // app.use(morgan('dev'));

 // new code below this line
 app.use(express.static(path.join(__dirname, "public")));

 // new code above this line
 app.get("/", async (req, res) => {
   res.render("index.ejs");
 });


//DB connection
dotenv.config(); // Loads the environment variables from .env file
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

//Models
const Fruit = require("./models/fruit");
//middleware
app.use(methodeOverride('_method'));
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));

//Routes
app.get('/', (req, res) => {
    res.render('index.ejs');
})

//Index
app.get('/fruits', async (req, res) => {
    const msg = req.query.msg;
    const fruits = await Fruit.find();
    res.render('fruits/index.ejs', {fruits: fruits});
});

//New
app.get('/fruits/new', (req, res) => {
    res.render('fruits/new.ejs');
});

//Show
app.get('/fruits/:fruitId', async (req, res) => {
    const fruitId = req.params.fruitId;

    const fruit = await Fruit.findById(fruitId);
    res.render('fruits/show.ejs', {fruit});
});

//Show fro edit?
app.get('/fruits/:fruitId/Edit', async (req, res) => {
    const fruitId = req.params.fruitId;
    
    const fruit = await Fruit.findById(fruitId);
    res.render('fruits/edit.ejs', {fruit});
});

//Create
app.post("/fruits", async (req, res) => {
    // console.log(req.body);

    if (req.body.isReadyToEat === 'on'){
        req.body.isReadyToEat = true;
    } else {
        req.body.isReadyToEat = false;
    }
    await Fruit.create(req.body);
    res.redirect('/fruits/new')
});

//Delete
app.delete("/fruits/:fruitId", async(req, res) => {
    const fruitId = req.params.fruitId;
    const fruit = await Fruit.findByIdAndDelete(fruitId);
    res.redirect(`/fruits?msg="Record Deleted"`);
});

//Put
app.put("/fruits/:fruitId", async (req, res) => {
  // Handle the 'isReadyToEat' checkbox data
  if (req.body.isReadyToEat === "on") {
    req.body.isReadyToEat = true;
  } else {
    req.body.isReadyToEat = false;
  }
  
  // Update the fruit in the database
  await Fruit.findByIdAndUpdate(req.params.fruitId, req.body);

  // Redirect to the fruit's show page to see the updates
  res.redirect(`/fruits/${req.params.fruitId}`);
});

//Edit


app.listen(PORT, () => {
  console.log('Listening on port 3000');
});

