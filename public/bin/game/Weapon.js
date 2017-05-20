function Weapon(character, game, gameTimer, bullet, weapons){
  this.type = 'Weapon';
  this.stats = {};
  this.character = character;
  this.game      = game;
  this.gameTimer = gameTimer
  this.ammoInBagCapacity = 180;
  this.ammoInBag = 180;
  this.magazine  = 10;
  this.magazineCapacity = 30;
  this.lastBulletShotAt = null;
  this.recoil    = 0;
  this.bullet    = bullet;
  this.lastEquipTime = null;
  this.equiped   = false;
  this.otherWeapons = weapons;
  this.id = Weapon.prototype.id++;
}
Weapon.prototype.equip = function() {
  if(this.equiped){
    return;
  }else{
    for (var i = 0; i < this.otherWeapons.length; i++) {
      if(this.otherWeapons[i].id != this.id){
          this.otherWeapons[i].equiped = false;
      } else {
        this.equiped = true;
        this.character.weaponInUse = this;
        this.lastEquipTime = this.gameTimer.lastGameTime;
      }
    }
  }
}
Weapon.prototype.id = 0;
Weapon.prototype.defaultStats = function() {
  this.stats.ap = 10;
  this.stats.cost = 10;
  this.stats.accuracy = 10;
  this.stats.angleVariance = 1/this.stats.accuracy;
  this.stats.capacity = 180;
  this.stats.magazine = 30;
  this.stats.fireRate = 2;
  this.stats.shotDelay = 1/this.stats.fireRate;
  this.stats.description = ''
  this.stats.name = 'AK-47'
  this.stats.recoil = .5;
  this.stats.equipTime = this.game.rnd.realInRange(0,4);//seconds use it for both equip and reload
}
Weapon.prototype.fire = function() {
  if(this.equiped){
    if(this.gameTimer.lastGameTime - this.lastEquipTime < this.stats.equipTime){
      return 0;
    } else {
      if (this.lastBulletShotAt === undefined) {
        this.lastBulletShotAt = 0;
      }
      if (this.gameTimer.lastGameTime - this.lastBulletShotAt < this.stats.shotDelay){
        return 0;
      }
      if(this.magazine == 0){
        return 0;
      }
      this.lastBulletShotAt = this.gameTimer.lastGameTime;
      --this.magazine;
      return 1;
    }
  }else {
    return 0;
  }
}
