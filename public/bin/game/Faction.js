function Faction(name,size,game){
  this.id    = Faction.prototype.id++;
  this.type  = 'Faction';
  this.squads = [];
  this.characters = [];
  this.size  = size;
  if(name.length){
    this.name = name;
  }
  else {
    this.name = 'Faction'+this.id;
  }
  this.color      = '';
  this.game       = game;
  this.squadsGroup = this.game.add.group();
  this.canSee     = {}
}

Faction.prototype.id = 0;
