/*

    @author Ajit Christopher D'Monte A.K.A fBlah
    Copyright Ajit Christopher D'Monte
    Presented by http://fblah.com in association with http://dudenstein.com

*/

var window = this;
var onmessage;

var mobius_client = function(){
  var client = {};
  client.enumerations =
  {
    userStatus : {
      Connected:0,
      Available:1,
      InGame:2,
      Disconnected:3,
      Registration:4,
      Host:5
    }
  }
  client.dataTypes =
  {
    peer : function() {
      return {}
    }
  }
  client.functions =
  {
    escapeHtml : function(string) {
      var entityMap = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        //'"': '&quot;',
        //"'": '&#39;',
        "/": '&#x2F;'
      };
      //return String(string).replace(/[&<>"'\/]/g, function (s) {
      return String(string).replace(/[&<>\/]/g, function (s) {
        return entityMap[s];
      });
    }
  }
  //private
  var id              = null;

  //public
  client.verbose      = true;
  client.worker       = false;
  client.inGame       = false;
  client.type         = 'mobius_client';
  client.debug        = false;
  client.name         = 'SiMPlE';
  client.masterServer = 'http://localhost:8080';
  client.details      = {};
  client.peer         = null;
  client.peerPort     = null;
  client.peerHost     = null;
  client.peerPath     = null;
  client.userSpace    = '/users';
  client.status       = client.enumerations.userStatus.Disconnected;
  client.peers        = {};
  client.peerConnections = [];
  client.maxPeers     = 5;
  client.version      = '0.0.0.4'; // Multi Player version
  client.details.name = 'Player';
  client.isServer     = false;
  client.sdata        = null;
  client.rdata        = {};
  client.sqdata       = [];
  client.rqdata       = [];
  client.game         = {};
  client.updateRate   = 15;//Hz
  client.state        = {};
  client.serverList   = [];
  client.block        = false; // block new connections

  client.on = function(event, foo){
    return this.event.addEventListener(event,foo);
  }

  client.off = function(eventListener){
    return this.event.removeEventListener(eventListener);
  }

  client.event        = {
    _events : [ 'status', 'message', 'server-list', 'peer', 'update' ],
    _eventListeners : [],
    _maxEventListeners : 20,
    _id:0,
    addEventListener : function(event,foo){
      var eventListener = {};
      switch(event){
        case 'status':
        break;
        case 'message':
        break;
        case 'server-list':
        break;
        case 'peer':
        break;
        case 'update':
        break;
        default:
        return 1;
      }
      eventListener.eventListener = foo;
      eventListener.event = event;
      if(!eventListener.eventListener){
        return 1;
      }
      eventListener.id = this._id++;
      if(this._eventListeners.length <= this._maxEventListeners){
        this._eventListeners.push(eventListener)
        return eventListener;
      }else{
        return 1;
      }
    },
    removeEventListener : function(eventListener){
      var index = 0;
      for (var i = 0; i < this._eventListeners.length; i++) {
        if(this._eventListeners[i].id == eventListener.id){
          break;
        }else{
          index++
        }
      }
      if (index < this._eventListeners.length) {
        this._eventListeners.splice(index, 1);
        return 0;
      } else {
        return 1;
      }
    },
    emit:function(event){
      switch(event.type){
        case 'status':
        break;
        case 'message':
        break;
        case 'server-list':
        break;
        case 'peer':
        break;
        case 'update':
        break;
        default:
        return 1;
      }
      if(this.worker){
        postMessage(event);
      }else{
        for (var i = 0; i < this._eventListeners.length; i++) {
          if(this._eventListeners[i].event == event.type){
            this._eventListeners[i].eventListener(event);
          }
        }
      }
      return 0;
    }
  };

  var css = "color: #fff; font-size: 4em; font-weight: bold;font-family: Helvetica; text-shadow: 0 1px 0 #ccc, 0 2px 0 #c9c9c9, 0 3px 0 #bbb, 0 4px 0 #b9b9b9, 0 5px 0 #aaa, 0 6px 1px rgba(0,0,0,.1), 0 0 5px rgba(0,0,0,.1), 0 1px 3px rgba(0,0,0,.3), 0 3px 5px rgba(0,0,0,.2), 0 5px 10px rgba(0,0,0,.25), 0 10px 10px rgba(0,0,0,.2), 0 20px 20px rgba(0,0,0,.15);"
  var morecss = "font-size: 1em; color: #333; font-family: Helvetica;"
  console.log("%cMobius %cv"+ client.version,css, morecss);
  function setID(value){
    id = value;
  }
  function getID() {
    return id;
  }
  client.messageHandler = function(params) {
    var client = client;
    if(!this.worker){
      client = this;
    } else {
      params = params.data;
    }
    var foo = params.shift();
    var value = null;
    switch(foo){
      case 'get':
        value = client.get(params[0]);
        break;
      case 'set':
        client.set(params[0],params[1]);
        break;
      case 'connect':
        client.connect()
        break;
      case 'connectToPeer':
        client.connectToPeer(params[0]);
        break;
      case 'disconnectPeer':
        client.disconnectPeer(params[0]);
        break;
      case 'disconnectAllPeers':
        client.disconnectAllPeers();
        break;
      case 'init':
        client.init();
        break;
      case 'request':
        client.request(param[0],param[1]);
        break;
      case 'goOnline':
        value = client.goOnline();
        break;
      case 'goOffline':
        client.goOffline();
        break;
      case 'isOnline':
        value = client.isOnline();
        break;
      case 'addMessage':
        client.addMessage(param[0]);
        break;
      case 'isConnected':
        value = client.isConnected();
        break;
      case 'ping':
        value = client.ping();
        break;
      case 'updateStatus':
        value = client.updateStatus(param[0]);
        break;
      case 'update':
        value = client.update(param[0],param[1]);
        break;
      case 'init':
        value = client.init();
        break;
      default:
        value = 'Invalid Function';
    }
    return [foo,params,value];
  }

  client.postMessage = function(e){
    var result = tryCatch(function(){return this.messageHandler(e);}.bind(this));
    if(result === tryCatch.errorObj) {
        //The function threw
        var e = result.e;
        if(this.debug){
          console.log(e);
        }
    }
    else {
      return result;
    }
  }

  client.connectToPeer = function(id) {
    if(id){

    } else {
      return 1;
    }
    var conn = null;
    try{
      conn = this.peer.connect(id);
    }catch(e){
      console.log(e);
    }finally{
      if(conn){
        conn.on('open', connectionPeer.bind([this,conn]));
      }
    }
  }

  client.disconnectPeer = function(id) {
    try{
      for (var i = 0; i < this.peerConnections.length; i++) {
        if(this.peerConnections[i].peer == id){
          this.peerConnections[i].close();
        }
      }
    }catch(e){
      console.log(e);
    }finally{

    }
  }

  function dataPeer(data){
    var that = this[0];
    var conn = this[1];
    var str  = data;

    if(typeof str == 'string'){
      if(str[0] == "{"){
        data = JSON.parse(str);
      }
    }
    data.id   = conn.peer;
    if (that.verbose) {
      console.log('Received', data);
    }
    if(data.r){
      //Received result of ping
      that.pingr(conn,data);
    }
    if(data.p){
      //Received ping must pong
      that.pong(conn,data);
    }
    if(data.d){
      //Received data
      that.rdata = data.data;
    }
    if(data.q){
      //Received q data
      if(that.isServer){
        data.name = that.peers[conn.peer].details.name;
        data.data.name = data.name;
      }else{
        data.name = data.data.name;
      }
      if(data.data.u){
        //this is and update message and should not be retransmitteed
        if(that.isServer){
          switch (data.data.type) {
            case 'info':
              that.peers[conn.peer].details = data.data.details;
              break;
            default:
          }
        }else{
          switch (data.data.type) {
            case 'info':
              that.peers[conn.peer].details = data.data.details;
              break;
            case 'update':
              if(data.data.id == getID()){
                that.details[data.data.key] = data.data.value;
              }
              break;
            case 'update-all':
              that.details[data.data.key] = data.data.value;
              break;
            case 'update-state':
              that.state[data.data.key] = data.data.value;
              break;
            default:
          }
          that.update('details');
        }
        that.event.emit({type:'update'});
      }else{
        /*
        if(that.isServer){
          that.addMessage(data.data);
        }
        */
        that.rqdata.push(data);
        that.event.emit({type:'message'});
      }
    }
    if(data.v){
      if (data.vd == that.version) {
        if (that.verbose) {
          console.log('Version is ok for '+conn.peer);
        }
      }else{
        if (that.verbose) {
          console.log('Version is not ok for '+conn.peer);
        }
        conn.close()
      }
    }
  }

  function connectionError(err) {
    if(this.verbose){
      console.log('Connection Error: '+err);
    }
  }

  function connectionPeer() {
    var that = this[0];
    var conn = this[1];
    if(that.block){
      conn.close();
      return;
    }
    addConnectionPeer(conn,that);
    // Receive messages
    conn.on('data', dataPeer.bind([that,conn]));
    conn.on('close', removeConnectionPeer.bind([that,conn]));
    conn.on('error', connectionError.bind(that));
    // Send messages
    conn.send({message:'Hello!'});
    conn.send({v:true,vd:that.version});
    that.update('details');
    if(that.isServer){
      if(that.status != that.enumerations.userStatus.Host){
        conn.send({message:'Bye I am not hosting! :)'});
        setTimeout(conn.close.bind(conn),5000);
      }
    }else{
      that.updateStatus(that.enumerations.userStatus.InGame);
    }

    if(that.peerConnections.length > that.maxPeers){
      conn.send({message:'Bye I cannot handle so many connections! :)'});
      setTimeout(conn.close.bind(conn),5000);
    }
  }

  function onconnectToPeer(conn) {
    conn.on('open', connectionPeer.bind([this,conn]));
  }

  function onOpenPeer(id) {
    if(this.verbose){
      console.log('Peer online with id:' + id);
    }
    this.updateStatus(this.enumerations.userStatus.Available);
  }

  function onCallPeer(mc) {
    if(this.verbose){
      console.log('Getting a call from '+ mc.peer);
      console.log('Cutting call since not yet implemented.');
    }
    mc.close();
  }

  function onClosePeer() {
    if(this.verbose){
      console.log('Peer closed');
    }
  }

  function onDisconnectPeer() {
    if(this.verbose){
      console.log('Peer disconnected from server.');
    }
  }

  function onErrorPeer(err) {
    if(this.verbose){
      console.log('Peer Error'+err);
    }
  }

  function addConnectionPeer(conn,that){
    that.peerConnections.push(conn);
    that.peers[conn.peer] = {};
    that.peers[conn.peer].details = {};
    that.event.emit({type:'peer'});
    if (that.verbose) {
      console.log(conn.peer + ' has connected');
    }
  }

  function removeConnectionPeer(){
    var that = this[0];
    var conn = this[1];
    if(that.peerConnections.indexOf(conn) !== -1) {
        that.peerConnections.splice(that.peerConnections.indexOf(conn),1);
        if (that.verbose) {
          console.log(conn.peer + ' has disconnected');
        }
    }
    delete that.peers[conn.peer];
    delete conn;
    that.event.emit({type:'peer'});
    if(!that.isServer){
      if(that.peerConnections.length){

      } else {
        that.updateStatus(that.enumerations.userStatus.Available)
      }
    }
  }

  client.disconnectAllPeers = function() {
    for (var i = 0; i < this.peerConnections.length; i++) {
      this.peerConnections[i].close();
    }
  }

  client.init = function(){
    this.request('id');
    this.request('peerServer');
    this.update('details');
    this.update('name');
    setTimeout(this.send.bind(this),1000/this.updateRate);
  }

  client.connect = function(){
      this.socket = io.connect(client.masterServer + client.userSpace, {'forceNew':true });//io(client.userSpace);
      this.socket.on('connect', this.onconnect.bind(this));
      this.socket.on('message', this.onMessage.bind(this));
      this.socket.on('disconnect', this.ondisconnect.bind(this));
  }

  client.disconnect = function() {
    this.goOffline();
    this.socket.disconnect();
  }

  client.request = function(type, value) {
    if(this.verbose){
      console.log("[Request] "+ type);
    }
    if(!this.socket.connected){
      if(this.verbose){
        console.log("Client disconnected!");
      }
      return 1;
    }else{
      switch(type){
        case 'id':
          this.socket.emit('request',{type:'id'});
          break;
        case 'status':

          break;
        case 'server-list':
          this.socket.emit('request',{type:'server-list'});
          break;
        case 'checkid':
          this.socket.emit('request',{type:'checkid', value:value});
        break;
        case 'peerServer':
          this.socket.emit('request',{type:'peerServer'});
          break;
        default:

      }
    }
    return 0;
  }

  client.get = function(type) {
    var value;
    if(this.verbose){
    //  console.log("[Get] "+ type);              COMMENTED BY LOHITH
    }
    switch(type){
      case 'id':
        value = getID();
        break;
      case 'status':
        value = this.status;
        break;
      case 'server-list':
        value = this.serverList;
        break;
      case 'name':
        value = this.details.name;
        break;
      default:
        value = null;
    }
    return value;
  }

  client.set = function(type, value) {
    if(this.verbose){
      console.log("Setting "+ value +" for "+ type);
    }
    if(this.isConnected()){
      this.socket.emit('update',{type:type, value: value});
    }else{
      if(this.verbose){
        console.log("Client is disconnected");
      }
      this.updateStatus(this.enumerations.userStatus.Disconnected);
    }
  }

  client.goOnline = function() {
      if(this.verbose){
        console.log("Trying to go online");
      }
      if(this.peerPath & this.peerPort & this.peerHost){
        if(this.verbose){
          console.log("Require communication server details to go online.");
        }
      }else{
        if(this.isConnected()){

        }else{
          this.connect();
        }
      }
      if(this.isConnected()){
        if(!this.isOnline()){
          try{
            if(this.peer){
              delete this.peer;
            }
            this.verify();
            this.peer = new Peer(getID(),{path:this.peerPath, port:this.peerPort, host:this.peerHost})
          }catch(e){
            console.log(e);
          }finally{
            if(this.peer){
              this.peer.on('open', onOpenPeer.bind(this));
              this.peer.on('call', onCallPeer.bind(this));
              this.peer.on('connection', onconnectToPeer.bind(this));
              this.peer.on('close', onClosePeer.bind(this));
              this.peer.on('disconnected', onDisconnectPeer.bind(this));
              this.peer.on('error', onErrorPeer.bind(this));
              return 0;
            }else{
              if(this.verbose){
                console.log("Failed to contact to communication server.");
              }
              return 1;
            }
          }
        }
      }
      else{
        if(this.verbose){
          console.log("Client is disconnected");
        }
      }
  }
  client.goOffline = function() {
    if(this.peer){
      if(!this.peer.disconnected){
        this.peer.disconnect();
      }
    }
    if(this.isConnected){
      this.updateStatus(this.enumerations.userStatus.Connected);
    }
  }
  client.isOnline = function(){
    var result = false;
    if(this.isConnected()){
      if(this.peer){
        if(this.peer.open){
          result = true;
          if(this.verbose){
            console.log("Client Online!");
          }
        }else{
          if(this.verbose){
            console.log("Client Offline!");
          }
        }
      }
    }
    return result;
  }
  client.addMessage = function(message) {
    if(this.debug){
      console.log(message);
    }
    this.sqdata.push(message);
  }
  client.send = function() {
    if(this.peer){
      if(!this.peer.destroyed){
        // sequential data, bulk data, package of data(sequential)
        var s = null, d = null;
        if(this.sqdata.length){
          s = {};
          s.data = this.sqdata.shift();
          if(!s.data.name){
            s.data.name = this.details.name;
          }
          s.q = true;
          s = JSON.stringify(s);
          if (this.debug) {
            console.log('Send ', s);
          }
        }
        if(this.sdata){
          d = {};
          d.d = true;
          d.data = this.sdata;
          this.sdata = null;
          d = JSON.stringify(d);
          if (this.debug) {
            console.log('Send ', d);
          }
        }
        if(this.isServer){
          for (var i = 0; i < this.peerConnections.length; i++) {
            if (s) {
              this.peerConnections[i].send(s);
            }
            if (d) {
              this.peerConnections[i].send(d);
            }
          }
        } else {
          if (this.peerConnections[0]) {
            if(this.peerConnections[0].open){
              if (s) {
                this.peerConnections[0].send(s);
              }
              if (d) {
                this.peerConnections[0].send(d);
              }
            }
          }
        }
        if(this.peerConnections.length){
          this.inGame = true;
        }else{
          this.inGame = false;
        }
      }
    }else{
      this.inGame = false;
    }
    if(this.sqdata.length){
      setTimeout(this.send.bind(this),1);
    }else{
      setTimeout(this.send.bind(this),1000/this.updateRate);
    }
  }

  client.isConnected = function(){
    if(this.socket.connected){
      if(this.verbose){
        console.log("Client connected!");
      }
    }else{
      if(this.verbose){
        console.log("Client disconnected!");
      }
    }
    return this.socket.connected;
  }

  client.onconnect = function() {
   // socket connected
   if(this.verbose){
      console.log("Connected to Master Server");
   }
   this.updateStatus(this.enumerations.userStatus.Connected);
   this.init();
  }

  client.data = function(data)  {
    this.sdata = data;
  }

  client.onMessage = function(data) {
   // socket connected
   if(this.verbose){
     console.log("Received a message " + data.message);
   }
   if(data.type == 'id'){
      setID(data.id);
   }
   if(data.type == 'error'){
     if(this.verbose){
       console.log('Error: '+data.error);
     }
   }
   if(data.type == 'verify'){
     if(this.verbose){
       console.log('Verifying my version with master server');
     }
     this.verify();
   }
   if(data.type == 'reset'){
     if(this.verbose){
       console.log('Master server has requested me to refresh to get latest verion');
     }
     this.reset();
   }
   if(data.type == 'peerServer'){
     if(this.verbose){
       console.log('Peer Server details received');
     }
     this.peerHost     = data.host;
     this.peerPort     = data.port;
     this.peerPath     = data.path;
   }
   if(data.type == 'server-list'){
     if(this.verbose){
       console.log('The ids of the servers are');
       for (var i = 0; i < data.value.length; i++) {
         console.log(data.value[i]);
       }
     }
     this.serverList = data.value;
     this.event.emit({type:'server-list'});
   }
  }
  client.verify = function() {
      this.set('verify',this.version);
  }
  client.reset = function(){
    if(this.verbose)
      console.log("Refreshing page in 5 seconds");
    setTimeout(function(){window.location.reload()},5000);
  }
  client.pong = function(conn,data){
    data.p = !(data.r = true);
    conn.send(data);
  }
  client.ping = function(){
    for (var i = 0; i < this.peerConnections.length; i++) {
      var data = {}
      data.p = true;
      data.pd = {};
      data.pd.date = Date.now();
      this.peerConnections[i].send(data);
    }
  }

  client.pingr = function(conn,data){
    var d = Date.now() - data.pd.date;
    if (this.verbose) {
      console.log('[Latency] ' + conn.peer + ' '+ d);
    }
  }
  client.pingID = function(id,callback){
    var conn = null;
    try{
      conn = this.peer.connect(id);
    }catch(e){
      console.log(e);
    }finally{
      if(conn){
        conn.on('open', function(){
          var data = {}
          data.p = true;
          data.pd = {};
          data.pd.date = Date.now();
          this.send(data)
        }.bind(conn));
        conn.on('data',function(data){
          if(data.r){
            var d = Date.now() - data.pd.date;
            conn = this[0];cb = this[1];
            //console.log('[Latency] ' + conn.peer + ' '+ d);
            cb({id:conn.peer,latency:d});
          }
        }.bind([conn,callback]));
        conn.on('close',function(){});
        conn.on('error',function(err){console.log('Ping error: '+err)});
      }
    }
  }
  client.ondisconnect = function(){
    if(this.verbose)
      console.log("Disconnected from Master Server")
    this.updateStatus(this.enumerations.userStatus.Disconnected);
  }

  client.updateStatus = function(status) {
    this.status = status;
    this.event.emit({type:'status',value:status});
    if(this.status == this.enumerations.userStatus.Disconnected){

    }else{
      this.set('status',this.status);
    }
    if(this.status == this.enumerations.userStatus.Host){
      this.isServer = true;
      if(getID() == this.peer.id){
      } else {
        this.goOffline();
      }
    }else{
      if(this.peerConnections.length){

      } else {
        this.isServer = false;
      }
    }
  }

  client.update = function(type,value) {
    switch(type){
      case 'name':
        this.set('name',this.name);
        break;
      case 'details':
        this.set('details',this.details);
        this.addMessage({u:true, type:'info', details:this.details});
        break;
    }
  }
  client.updatePeer = function(id, key, value){
    if(this.isServer){
      if(id == getID()){
        this.details[key] = value;
      }
      var message = {u:true, type:'update', key:key, value:value, id:id}
      this.addMessage(message);
    }
  }
  client.updatePeers = function(key, value){
    if(this.isServer){
      this.details[key] = value;
      var message = {u:true, type:'update-all', key:key, value:value}
      this.addMessage(message);
    }
  }
  client.updateState = function(key,value){
    if(this.isServer){
      this.state[key] = value;
      var message = {u:true, type:'update-state', key:key, value:value}
      this.addMessage(message);
    }
  }

  return client;
}

function testEnv() {
  if (window.document === undefined) {
    importScripts('/socket.io/socket.io.js','/javascripts/peer.min.js');
    client = new mobius_client();
    client.worker = true;
    messageHandler = function(params) {
      params = params.data;
      var foo = params.shift();
      var value = null;
      switch(foo){
        case 'get':
          value = client.get(params[0]);
          break;
        case 'set':
          client.set(params[0],params[1]);
          break;
        case 'connect':
          client.connect()
          break;
        case 'connectToPeer':
          client.connectToPeer(params[0]);
          break;
        case 'disconnectPeer':
          client.disconnectPeer(params[0]);
          break;
        case 'disconnectAllPeers':
          client.disconnectAllPeers();
          break;
        case 'init':
          client.init();
          break;
        case 'request':
          client.request(param[0],param[1]);
          break;
        case 'goOnline':
          value = client.goOnline();
          break;
        case 'goOffline':
          client.goOffline();
          break;
        case 'isOnline':
          value = client.isOnline();
          break;
        case 'addMessage':
          client.addMessage(param[0]);
          break;
        case 'isConnected':
          value = client.isConnected();
          break;
        case 'ping':
          value = client.ping();
          break;
        case 'updateStatus':
          value = client.updateStatus(param[0]);
          break;
        case 'update':
          value = client.update(param[0],param[1]);
          break;
        case 'init':
          value = client.init();
          break;
        default:
          value = 'Invalid Function';
      }
      return [foo,params,value];
    }
    onmessage = function(e) {
      var result = tryCatch(function(){return messageHandler(e);});
      if(result === tryCatch.errorObj) {
          //The function threw
          var e = result.e;
          if(client.debug){
            console.log(e);
          }
      }
      else {
          postMessage(result);//result is the returned value
      }
    }
    postMessage("Mobius is running as a worker");
  } else {
  }
}




function tryCatch(foo) {
    try {
        return foo();
    }
    catch(e) {
        tryCatch.errorObj.e = e;
        return tryCatch.errorObj;
    }
}
tryCatch.errorObj = {e: null};
testEnv();
