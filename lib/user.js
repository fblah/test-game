var cae = require('./cae');

var User = function(){

  this.socket = arguments[0];
  this.id     = arguments[1];
  this.name   = null;
  this.peer   = false;
  this.status = cae.enumerations.userStatus.Registration;
  this.verified = false;
  this.token  = null;
  this.shasum = null;
  this.details= {};
}

exports = module.exports = User;
