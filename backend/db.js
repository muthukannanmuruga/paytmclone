const mongoose = require("mongoose");

const dbName = 'paytm_userdata';

// Connection URL to your MongoDB database
const dbUrl = `mongodb+srv://muthuknnn27:lingam33@mkmongocluster.fx01qpp.mongodb.net/${dbName}`;

// Connect to the database
mongoose.connect(dbUrl);

// Get the default connection
const db = mongoose.connection;

// Bind connection to error event (to get notifications of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Bind connection to open event (to know when we are connected)
db.once('open', () => {
  console.log('Connected to the database!');
  
  // Now you can start interacting with your MongoDB database using Mongoose
  // Define your schemas, models, and perform operations as needed
});

const paytmAccountSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Refers to the User model
    required: true
  },
  balance: {
    type: Number,
    default: 0
  }
});



const paytmUserSchema = new mongoose.Schema({
    // Define the fields and their types
    
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    
    password: {
      type: String,
      required: true,
      trim: true

    },
    firstname: {
      type: String,
      required: true,
      trim: true,
    },
    lastname: {
      type: String,
      required: true,
      trim: true,
    },
    // You can add more fields as needed for your application
    // For example: address, transaction history, etc.
  });
  
  // Create a model using the schema
  const PaytmUser = mongoose.model('PaytmUser', paytmUserSchema);

  // Create the BankAccount model
  const PaytmAccount = mongoose.model('PaytmAccount', paytmAccountSchema);
  
  // Export the model to be used in other parts of your application
  module.exports = {PaytmUser, PaytmAccount};