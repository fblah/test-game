//Sound class
function Sound(name, options, channel, audio){
    this.type       = 'Sound';
    this.name       = name;
    this.audio      = audio;
    this.channel    = channel;
    //details about entities playing the sound if required by the entities
    this.entities   = {};

    if(!audio){
        console.log('Cannot access audio instance');
        return 1;
    }   

    if(!file){
        delete this;
        if(this.audio.verbose){
            console.log('No file given');
        }
        return 1;
    }
    this.howl       = new Howl(options);
    var volume    = 1;
    
    Object.defineProperty(this, "volume", { 
            get: function () { return volume; },
            set: function () { volume = 1 * this.channel.volume * this.audio.volume; } 
        }); 
}