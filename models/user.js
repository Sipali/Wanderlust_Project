const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email:{
        type: String,
        require: true,
    },
});

 userSchema.plugin(passportLocalMongoose);
// attaches extra methods and properties to our Mongoose schema.
 module.exports = mongoose.model("User", userSchema);

//  Passport.js is a popular authentication middleware for Node.js and Express applications.
// It helps implement login systems easily using different authentication strategies —
// like Local (username/password), Google OAuth, Facebook, JWT, etc.

