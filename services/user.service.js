var User = require('../models/user');//here is the schema of db...User is exported schema from model/user 
/**
 * data inserting
 * @param {object} data 
 */
module.exports.createUser = function(data) {
    var newUser = new User(data).save();
    return newUser;
};

/**
 * view data 
 * @param {*} query */
 
module.exports.getUsers = function(query = {}, project = {}) {
    return User.find(query, project).lean().exec();
}; 

 /**
  * view one data
  * @param {*} query */ 
 
module.exports.getUser = function(query = {}) {
    return User.findOne(query).lean().exec();//lean....load document as a plain javascript

}; 

module.exports.deleteUser = function(query = {}) {
    return User.deleteOne( query ).exec();//lean....load document as a plain javascript
    //db.inventory.remove( { type : "food" } )
 }; 

/**
 * update
 * @param {*} query y
 * @param {*} data */
 
module.exports.updateUser = function(query = {}, data = {}) {
    return User.update(query, data).exec();
}; 

 
/* paginate user*/
module.exports.paginateUser = function(query = {}, options= {}) {
    return User.paginate(query, options);
};

module.exports.Search = function(query = {}, project = {}){
    return User.find(query, project).lean().exec();
}
