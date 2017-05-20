
//Character class
function Character(game){
  this.type    = 'Character';
  //details affects current stats
  this.details = {};
  //stats affects current gameplay
  this.stats   = {};
  //legs of character so that it can rotate separately
  this.legs    = {};
  // body of character
  this.body    = {};
  //need light using illuminated js for high graphics and sprite for low graphics
  //lamp
  //fov object
  this.fov     = {};
  //hit box using a circle
  this.hitbox  = {};
  //physics body for arcade
  this.physics  = {};
  // the phaser game
  this.game    = game;
  //
  this.isReloading = false;
  this.isCamping = false;
  this.isSignalling = false;
  this.reloadSecond = null;
  this.campSecond = null;
  this.signalSecond = null;
  this.lastSeen     = {};
  this.lastAware = 0;
  // all the viewable sprites of character are in this group for ease of accesss
  this.allViewable = this.game.add.group();
  this.moves   = []
  this.id      = Character.prototype.id++;
  this.mySquadID= null;
  this.name    = 'Character' + Character.prototype.id;
  this.squad    = null;
  this.weapons = [];
  this.faction = null;//group of squads
  this.status  = Gameplay.enum.character.status.DEAD;
  this.spawned = false;
  this.gui     = {};
  this.alive   = true;
  this.sync    = []; // only for multiplayer
  this.messages= [];
  this.visible = false;
  this.direction = {
    NORTH:false,
    SOUTH:false,
    EAST:false,
    WEST:false
  }
}

Character.prototype.id = 0;
// Set default characteristics on a character
Character.prototype.defaultDetails = function() {
  //unique id
  this.details.id = 0;
  // first name
  this.details.fname = 'Soldier';
  //second name
  this.details.lname = 'Man';
  this.details.gender= Gameplay.enum.character.gender.MALE;

  // maximum hp allowable for a character
  this.details.maxhp = 1000;
  //max points for a character
  this.details.maxp  = 2000;

  this.details.hp            = 2500; //hit points affected by strength
  this.details.ap            = 50;  //extra attack points affected by accuracy intelligence luck

  this.details.accuracy      = 250; //max 1000
  this.details.strength      = 500; //max 1000
  this.details.stamina       = 700; //max 1000

  this.details.intelligence  = 50; //and also affects stealth max 100
  this.details.luck          = 50; //max 100
  this.details.speed         = 50; //max 100 speed
  this.details.teamwork      = 50; //max 100 affects wait signal
  this.details.aggressiveness= 50; //max 100 affects wait signal AI

  //the above points are balanced to be maxp
  this.details.points        = this.details.hp + this.details.ap + this.details.luck + this.details.strength
                              + this.details.intelligence + this.details.accuracy + this.details.speed
                              + this.details.teamwork + this.details.aggressiveness + this.details.stamina;

  //max distance the character can see forwards
  this.details.maxViewableDistance = 1000;

  this.details.viewingAngle         = 80; //angle to forward vector of character
  // if you give the character their favorite weapon bonus points
  this.details.favouriteWeapon = 0;
  // if you give the character their favorite weapon bonus chats
  this.details.favouriteSkin   = 0;
  // calculate fov polygon and store here should contain 5 vertices
  this.details.fovPolygon      = {};
  // color of the characters lamp used in fog of war
  this.details.color           = 'rgba(255,255,105,0.8)'
  // basepower affects the power bar of the character
  this.details.basepower       = this.details.stamina + this.details.strength*.5 + this.details.intelligence + this.details.teamwork;
  this.details.alertness       = 50; // 0 - 100
}

Character.prototype.calculateStats = function() {
  // Given a set of details about a player we calculate their stats at the start of each game with some amount of randomness
  // this is to take into account the character's day to day feels and bad day effect based on luck
  // In the end only the characteristics defined under stats should be used to calculate game-character dynamics
  this.stats.hp = Math.round(this.details.hp + this.details.strength*.5 + this.game.rnd.integerInRange(-50,this.details.luck));
  this.stats.ap = Math.round(this.details.ap + this.details.accuracy*.5 + this.game.rnd.integerInRange(-20,this.details.luck*.5));
  this.stats.accuracy = this.details.accuracy + this.game.rnd.integerInRange(-200+(this.details.luck),200+(this.details.luck));
  this.stats.teamwork = this.details.teamwork;
  this.stats.intelligence = this.details.intelligence;
  this.stats.aggressiveness = this.details.aggressiveness;
  this.stats.speed = this.details.speed + this.game.rnd.integerInRange(-25+(this.details.luck*.1),25);
  for(i = 0 ;i < this.weapons.length; i++){
    if(this.details.favouriteWeapon = this.weapons[i].stats.name){
      this.stats.accuracy           += 200;
    }
  }
  this.stats.power  = this.details.basepower + this.game.rnd.integerInRange(-200+(this.details.luck),200+(this.details.luck));
  this.stats.alertness = this.details.alertness;
}

Character.prototype.damage = function(amount, from_id) {
  this.stats.hp -= amount;
  if(this.stats.hp <= 0){
    this.alive = false;
    this.physics.body.enable = false;
    console.log(this.name+' is dead');
    this.sync.push('alive');
  }
}
