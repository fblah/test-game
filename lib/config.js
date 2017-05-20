//Mobius configuration file
var config = {};
var env         = process.env;

config.port     = process.env.OPENSHIFT_NODEJS_PORT || '8080'; //http server listens on port 8080
config.ip		= process.env.OPENSHIFT_NODEJS_IP || "localhost";
config.verbose  = true;
config.name     = 'SiMPlE';
config.maxClients = 100;
config.timeout    = 10000; //ms
config.debug      = true;
config.peerPort   = 8000;
config.peerPath   = '/p';
config.userSpace  = '/users';
config.peerHost   = 'peer-fblah.rhcloud.com';
exports = module.exports = config;
