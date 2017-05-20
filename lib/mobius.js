/*

    @author Ajit Christopher D'Monte A.K.A fBlah
    Copyright Ajit Christopher D'Monte
    Presented by http://fblah.com in association with http://dudenstein.com

*/
var UUID    = require('node-uuid'),
    http    = require('http'),
    fs      = require('fs'),
    cluster = require('cluster'),
    os      = require('os'),
    config  = require('./config'),
    cae     = require('./cae'),
    crypto  = require('crypto'),
    User    = require('./user');


/**
 * Create a mobius server.
 *
 *
 * @return {mobius}
 *
 */

var mobius = function(){
  this.version  = '0.0.1';
  this.requiredClientVersion = '0.0.0.4';
  this.app      = arguments[0];
  this.details  = {};
  this.details.system     = {};
  this.configruationFile  = null;
  this.verbose            = config.verbose;
  this.enumerations       = cae.enumerations;
  this.constants          = cae.constants;
  this.userSpace          = config.userSpace;
  this.ip				  = config.ip;
 /**
 * Get port from environment and store in Express.
 */

  this.port = normalizePort(process.env.PORT || config.port);
  this.app.set('port', this.port);
  this.app.set('ip', this.ip);

  /**
   * Create HTTP server.
   */

  this.server = http.createServer(this.app);

  /**
   * Listen on provided port, on all network interfaces.
   */

  this.server.listen(this.app.get('port'), this.app.get('ip'));
  this.server.on('error', onError.bind(this));
  this.server.on('listening', onListening.bind(this));

  /**
   * Normalize a port into a number, string, or false.
   */
  function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
      // named pipe
      return val;
    }

    if (port >= 0) {
      // port number
      return port;
    }

    return false;
  }

  /**
   * Event listener for HTTP server "error" event.
   */
  function onError(error) {
    if (error.syscall !== 'listen') {
      throw error;
    }

    var bind = typeof port === 'string'
      ? 'Pipe ' + this.port
      : 'Port ' + this.port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES':
        console.error(bind + ' requires elevated privileges');
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(bind + ' is already in use');
        process.exit(1);
        break;
      default:
        throw error;
    }
  }

  /**
   * Event listener for HTTP server "listening" event.
   */
  function onListening() {
    var addr = this.server.address();
    var bind = typeof addr === 'string'
      ? 'pipe ' + addr
      : 'port ' + addr.port;
    if(this.verbose)
      console.log('Listening on ' + bind);
  }

  this.io   = require('socket.io')(this.server);
  this.ioc  = require('socket.io-client');
  this.id   = UUID();
  this.name = config.name;
  this.type = 'mobius';
  this.users    = [];
  this.maxClients = config.maxClients;
  this.timeout    = config.timeout;
  this.debug      = config.debug;
  //this.peerServer = require('peer').PeerServer({port:config.peerPort, path:config.peerPath});

  //setInterval(function(){console.log(this)}.bind(this.users),2000)

}

mobius.prototype.loadConfigurationFile = function(){

  if(arguments[0] == undefined){
    if(this.verbose){
      console.log('Trying to load configuration file which was set');
    }
    if(this.configruationFile){
      try{
        var a = fs.readFileSync(this.configruationFile);
      }
      catch(err){
        console.log(err);
      }
    }else{
      if(this.verbose){
        console.log('No configruation file set');
      }
    }
  }else{
    this.configruationFile = arguments[0];
    this.loadConfigurationFile();
  }
}

mobius.prototype.getSystemDetails = function(){
  if(this.verbose){
    console.log("Getting system details");
  }
  this.details.system.CPU           = os.cpus();
  this.details.system.numCPUs       = os.cpus().length;
  this.details.system.architecture  = os.arch();
  this.details.system.endianness    = os.endianness();
  this.details.system.freemem       = os.freemem();
  this.details.system.hostname      = os.hostname();
  this.details.system.networkInterfaces= os.networkInterfaces();
  this.details.system.platform      = os.platform();
  this.details.system.release       = os.release();
  this.details.system.tmpdir        = os.tmpdir();
  this.details.system.totalmem      = os.totalmem();
  this.details.system.ostype        = os.type();
  this.details.system.uptime        = os.uptime();
  if(this.verbose){
    console.log(this.details);
  }
}

mobius.prototype.onclientconnect = function(socket){
  //socket.id;
  //socket.request.connection.remoteAddress;
  var user    = new User(socket.id, UUID());
  user.shasum  = crypto.createHash('sha1');
  user.shasum.update(socket.id+user.id);
  user.token  = user.shasum.digest('hex');
  function serverError(err, message, callback){
      console.log(err);
      socket.emit('message', {error:err,message: message, type:'error'});
      if(callback)
        callback();
  };
  if(this.verbose){
    console.log('[Connection] from ' + socket.request.connection.remoteAddress + ' : '+socket.id);
  }

  if(this.users.length < this.maxClients){
    this.addUser(user);
    this.updateUserById(user.id,{status:this.enumerations.userStatus.Connected})
    if(this.verbose){
        console.log('There are '+ this.users.length+' users');
    }
  }else{
    if(this.verbose){
        console.log('There are too many users');
    }
    serverError('9001','Max clients reached',function(){
      socket.disconnect();
      this.updateUserById(user.id,{status:this.enumerations.userStatus.Disconnected})

    }.bind(this));

  }

  socket.on('request', function(data){
    if(this.verbose){
        console.log('Client '+ user.id +' has made a request for '+data.type);
        if(data.message){
          console.log('Additional messages :'+ data.message);
        }
    }
    if(data.type == 'id'){
      socket.emit('message',{message:'Your new ID is '+ user.id, id: user.id, type:'id'});
    }
    if(data.type == 'peerServer'){
      socket.emit('message',{message:'Peer Server Details ', host: config.peerHost, path: config.peerPath, port: config.peerPort, type:'peerServer'});
    }
    if(data.type == 'server-list'){
      var servers = [];
      for (var i = 0; i < this.users.length; i++) {
        if(user.name == this.users[i].name){
          if(this.users[i].status == this.enumerations.userStatus.Host){
            if(this.users[i].details.private){

            }else{
              servers.push(this.users[i].id);
            }
          }
        }
      }
      socket.emit('message',{message:'Server list',type:'server-list',value: servers});
    }
    if(data.type == 'checkid'){
      if(this.verbose){
          console.log('Client '+ user.id +' wants to connect to '+data.id);
          if(data.message){
            console.log('Additional messages :'+ data.message);
          }
          var c = this.updateUserById(data.id,{});

          if(c){
            if(c.status == this.enumerations.userStatus.Host){
              socket.emit('message',{message:data.id+' is hosting a server',type:'checkid',value: true})
            }else{
              socket.emit('message',{message:data.id+' is not hosting a server',type:'checkid',value: false})
            }
          }else{
              socket.emit('message',{message:data.id+' does not exist',type:'checkid',value: false})
          }
      }
    }
  }.bind(this));

  socket.on('update', function(data){
    if(this.verbose){
        console.log('Client '+ user.id +' wants to update '+data.type+ ' with '+ data.value);
        if(data.message){
          console.log('Additional messages :'+ data.message);
        }
    }
    if(data.type == 'status'){
      if((data.value < 6)&&(data.value >= 0)){
        if(data.value == this.enumerations.userStatus.Host){
          if(!user.verified){
            socket.emit('message',{message:'Please verify your version with me to be listed on master server', type:'verify'});
          }else{
            this.updateUserById(user.id,{status:data.value});
          }
        }else{
          this.updateUserById(user.id,{status:data.value});
        }
      }
    }
    if(data.type == 'verify'){
      if(data.value == this.requiredClientVersion){
        user.verified = true;
        socket.emit('message',{message:'Version is upto date.'});
      }else{
        socket.emit('message',{message:'Please restart client to update to latest version', type:'reset'});
      }
    }
    if(data.type == 'details'){
      user.details = data.value;
      socket.emit('message',{message:'Updated client details.'});
    }
    if(data.type == 'name'){
      user.name = data.value;
      socket.emit('message',{message:'Updated client name.'});
    }
  }.bind(this));

  socket.on('disconnect', function(message){
    this.removeUser(user);
    this.updateUserById(user.id,{status:this.enumerations.userStatus.Disconnected})
    if(this.verbose){
        console.log('Client has disconnected because '+message);
        console.log('[Disconnection] from '+socket.request.connection.remoteAddress+ ' : '+socket.id);
        console.log('There are '+ this.users.length+' users');
    }
  }.bind(this));

}

mobius.prototype.init = function() {
  this.getSystemDetails();
  this.io.of(this.userSpace).on('connection', this.onclientconnect.bind(this));
  //this.peerServer.on('connection', this.peerReady.bind(this));
  //this.peerServer.on('disconnect', this.peerLost.bind(this));
}

mobius.prototype.peerReady = function(id) {
  this.updateUserById(id,{status:this.enumerations.userStatus.Available, peer:true})
}

mobius.prototype.peerLost = function(id) {
  this.updateUserById(id,{status:this.enumerations.userStatus.Connected, peer:false})
}

mobius.prototype.updateUserById = function(id, data) {
  var user = null;
  for(var i = 0 ; i < this.users.length; i++){
    if(this.users[i].id === id){
      user = this.users[i];
      if(!(data.status == undefined)){
        this.users[i].status = data.status;
        if(data.status == this.enumerations.userStatus.Available || data.status == this.enumerations.userStatus.InGame ||data.status == this.enumerations.userStatus.Host ){
          this.users[i].peer = true;
        } else {
          this.users[i].peer = false;
        }
      }
      if(!(data.name == undefined)){
        this.users[i].name = data.name;
      }
      if(!(data.peer == undefined)){
        this.users[i].peer = data.peer;
      }
    }
  }
  return user;
}
mobius.prototype.addUser = function(user){
  this.users.push(user);
}
mobius.prototype.removeUser = function(user){
  if(this.users.indexOf(user) !== -1) {
      this.users.splice(this.users.indexOf(user),1);
  }
}

exports = module.exports = mobius;
