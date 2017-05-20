
function Squad(name,size,game){
  this.id         = Squad.prototype.id++;
  this.type       = 'Squad';
  this.faction    = null;
  this.characters = [];
  this.size       = size;
  this.signal     = false;
  this.signalSecond = null;
  this.weaponsFree= true;
  if(name.length){
    this.name = name;
  }
  else {
    this.name = 'Squad'+this.id;
  }
  this.game       = game;
  this.color      = '';
  this.charactersGroup = this.game.add.group();
}

Squad.prototype.id = 0;
