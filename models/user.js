var mongoose = require('mongoose');//here is db
var mongoosePaginate = require('mongoose-paginate');
// status => 0 = inactive, 1 = active
// role => 1 = user, 2 = admin
var userSchema = mongoose.Schema({
    name : { type: String, default: "" },
    email : { type: String, default: "" },
    password : { type: String, default: "" },
    status : { type: Number, default: 1 },
    role : { type: Number, default: 1 },
    image : { type: String, default: "" },
    imagefile : { type: String, default: "" }   
});

userSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('User', userSchema);//userSchema---->User  ie..go to user.service folder