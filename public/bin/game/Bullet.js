function Bullet(){
  this.type  = 'Bullet';
  this.stats = {};
}
Bullet.prototype.defaultStats = function() {
  this.stats.ap = 1;
  this.stats.accuracy = 1;
  this.stats.cost = 1;
  this.stats.maxDistance = 135000;
}
