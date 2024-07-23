const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
//connecting db to nodejs  default:mongodb://localhost:27017/"database name"
mongoose.connect('mongodb://localhost:27017/LoginSignup')
    .then(() => {
        console.log('Connected to MongoDB');        //works like a promise
    })
    .catch((e) => {
        console.log('Failed to connect to MongoDB');
    });

const LoginSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});


// Pre-save middleware to hash the password
LoginSchema.pre('save', async function(next) {
    // if (!this.isModified('password')) {
    //     return next();
    // }

    try {
        // console.log('Hashing password...');
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(this.password, salt);
        // console.log('Hashed password:', hashPassword);
        this.password = hashPassword;
        next(); // Call next to proceed
    } catch (error) {
        console.log('Error while hashing password:', error);
        next(error); // Pass the error to the next middleware or error handler
    }
});

//defining the collection using .model() method
const collectn = new mongoose.model('collectn', LoginSchema);
//exporting the collection


module.exports = collectn;
