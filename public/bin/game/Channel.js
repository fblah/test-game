
//Audio class
function Channel(name,audio){
  this.type     = 'Channel';
  this.sounds   = {};  
  this.name     = name;
  this.audio    = audio;
  
  //channel volume and pan
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

Channel.prototype.addSound = function(key,options){
    if(this.audio.sounds.hasOwnProperty(key)){
        if(this.audio.verbose){
            console.log('Duplicate key found of '+ key);
        }
        return 1;//error
    }
    if(this.audio.verbose){
        console.log('Creating new sound with key ' + key);
    }    
    var sound = new Sound(key, options, this, this.audio);
    if(typeof sound == 'object'){
        this.sounds[key] = sound;
        this.audio.sounds[key] = sound;
    }else{
        if(this.audio.verbose){
            console.log('Failed to load audio');
        } 
    }
}