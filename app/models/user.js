// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var base64 = require('base-64');
var utf8 = require('utf8');
// define the schema for our user model
var userSchema = mongoose.Schema({

    local            : {
        name         : String,
        avatar  	   : String,
        description  : String, 
        email        : String,
        password     : String,
        role         : String
    },
    facebook         : {
        id           : String,
        token        : String,
        name         : String,
        email        : String
    },
    twitter          : {
        id           : String,
        token        : String,
        displayName  : String,
        username     : String
    },
    google           : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    }

});

// generating a hash
/*
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};
*/

/*
console.log(new Buffer("Hello World").toString('base64'));
SGVsbG8gV29ybGQ=
> console.log(new Buffer("SGVsbG8gV29ybGQ=", 'base64').toString('ascii'))
Hello World
*/
// generating a hash
userSchema.methods.generateHash = function(password) {
    var bytes = utf8.encode(password);
	var encoded = base64.encode(bytes);
	console.log(encoded);
	return encoded;
	//return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
		var bytes = utf8.encode(password);
		var password_encoded = base64.encode(bytes);
		console.log(password_encoded);
		if(password_encoded == this.local.password)
			return true;
		else
			return false;
		//return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
