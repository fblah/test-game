
//Audio class
function Audio(app){
  this.type     = 'Audio';
  this.sounds   = {};
  this.channels = {};
  this.app      = app;
  this.verbose  = true;
  this.debug    = true;
  
  //master volume and pan
  var volume    = 1;
  var pan       = 0;
  Object.defineProperty(this, "volume", { 
        get: function () { return volume; },
        set: function (x) { volume = x; } 
    });  

  Object.defineProperty(this, "pan", { 
        get: function () { return pan; },
        set: function (x) {
            //limit pan between -1 and 1 
            x = Math.min(Math.max(x,-1.0),1.0);
            pan = x; 
        } 
    });

}

Audio.prototype.addChannel = function(name){
    if(this.channels.hasOwnProperty(name)){
        if(this.verbose){
            console.log('Duplicate Audio Channel already exists');
        }
        return 1;//error
    } else {
        if(this.verbose){
            console.log('Creating new Audio Channel ' + name);
        }
        this.channels[name] = new Channel(name, this);
        return 0;
    }
}

Audio.prototype.addSound = function(key, options, channel){
    if(this.sounds.hasOwnProperty(key)){
        if(this.verbose){
            console.log('Duplicate key found of '+ key);
        }
        return 1;//error
    }
    if(channel){
        if(this.channels.hasOwnProperty(channel)){
            channel = this.channels[channel];
        } else {
            if(this.verbose){
                console.log('Cannot find the audio channel ' + channel);
            }
            return 1;//error
        }
    } else {
        if(this.verbose){
            console.log('Adding sound directly to master');
        }
    }     
    if(this.verbose){
        console.log('Creating new sound with key ' + key);
    }    
    var sound = new Sound(key, options, channel, this);
    if(typeof sound == 'object'){
        this.sounds[key] = sound;
        if(channel){
            channel.sounds[key] = sound;
        }
    }else{
        if(this.verbose){
            console.log('Failed to load audio');
        } 
    }
}