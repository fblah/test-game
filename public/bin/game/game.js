//"use strict";//Do i need to do this??
//Data sent from the previous state with level description
var data = {
  factions : [
    {
      myFaction : true,
      name : 'Faction1',
      squads : [
        {
          name : 'Squad1',
          mySquad : true,
          characters : [
            {
              name : 'Character1'
            },
            {
              name : 'Character2'
            },
            {
              name : 'Character3'
            },
            {
              name : 'Character4'
            },
            {
              name : 'Character5'
            },
            {
              name : 'Character6'
            }
          ]
        },
        {
          name : 'Squad2',
          characters : [
            {
              name : 'Character1'
            }
          ]
        }
      ]
    },
    {
      name : 'Faction2',
      squads : [
        {
          name : 'Squad3',
          characters : [
            {
              name : 'Character1'
            }
          ]
        },
        {
          name : 'Squad4',
          characters : [
            {
              name : 'Character4'
            }
          ]
        }
      ]
    }
  ]
}
//End of data
//global
//Math functions
Math.radians = function(degrees) {
  return degrees * Math.PI / 180;
};

// Converts from radians to degrees.
Math.degrees = function(radians) {
  return radians * 180 / Math.PI;
};
//End of math functions

//Screen size
var worldwidth=1366;
var worldheight=768;

// Use to remember player selected (change this)
var id=0;

//used to control bullets (change this)
var fireRate = 300;
var nextFire = 0;

// details about level send along with data later
var tilemap = {
  src:'assets/tilemaps/BETA.json',
  name: 'tilemap'
};
var tileSheet = [
  {
    name:'sprite',
    src:'assets/tilemaps/sprite.png'
  },
  {
    name:'sprite2',
    src:'assets/tilemaps/sprite2.png'
  },
  {
    name:'colors',
    src:'assets/tilemaps/colors.png'
  }
]
var objects = [
  {
    name: 'dodge',
    src: 'assets/tilemaps/dodge.png'
  },
  {
    name: 'jeep',
    src: 'assets/tilemaps/jeep.png'
  },
  {
    name: 'pickup',
    src: 'assets/tilemaps/pickup.png'
  },
  {
    name: 'truck',
    src: 'assets/tilemaps/truck.png'
  }
]

var dynamic = [
  {
    type: 'dragon',
    key: 'soldier',
    atlas: 'assets/character/soldier-atlas.json',
    image: 'assets/character/soldier.png',
    skeleton: 'assets/character/soldier-skeleton.json'
  }
]
//

//Phaser game object
//var game= new Phaser.Game(worldwidth,worldheight,Phaser.WEBGL);

//Phaser game state or 'level'
var Game={
  preload:function(){


      //used to get fps and affect time and do slow motion shit not recommended for slow mo...
      this.game.time.advancedTiming = true;
      this.game.time.desiredFps     = 60;

      this.game.scale.pageAlignHorizontally = true;
      this.game.scale.pageAlignVertically = true;
      this.stage.disableVisibilityChange = true;

      this.game.plugins.add(Phaser.Plugin.SpriteBones);

      this.game.scale.updateLayout(true)

      this.load.tilemap(tilemap.name, tilemap.src, null, Phaser.Tilemap.TILED_JSON);
      for(i=0;i<objects.length;i++){
          this.load.image(objects[i].name, objects[i].src);
      }
      for(i=0;i<tileSheet.length;i++){
          this.load.image(tileSheet[i].name, tileSheet[i].src);
      }

      this.game.load.image('bullet', 'assets/img/bullet.png');
      this.game.load.image('soldier_p', 'assets/character/soldier_p.png');
      this.game.load.image('grenade','assets/img/Grenade.png');
      if(this.settings.LIGHTING){
        this.game.load.script('illuminated','lib/illuminated.js');
        this.game.load.script('phaser-illuminated','lib/phaser-illuminated.js');
      }

      this.game.load.spritesheet('button', 'assets/buttons/button_sprite_sheet.png', 193, 71);
      //this.game.load.script('sprite-bones','js/sprite_bones.min.js');

      //this.game.spritebones.loadAssets('soldier', 'assets/character/soldier-atlas.json', 'assets/character/soldier.png', 'assets/character/soldier-skeleton.json')

      // used to affect global clock of dragonbones animations use use!
      dragonBones.animation.WorldClock.clock.timeScale= 1;
      this.game.physics.startSystem(Phaser.Physics.ARCADE);
  },
  create:function(){
    this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.game.input.addPointer();
    this.game.input.addPointer();
    this.setUpPlugins();
    this.setUpGroups();
    this.setUpTimer();
    this.setUpGameplay();
    this.setUpVariables();
    this.setUpMap();
    this.setUpFog();
    this.setUpGUI();
    //this.setUpCharacters();
    this.setUpInput();

    this.game.input.mouse.capture = true;
    bullets = this.game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;
    bullets.createMultiple(50, 'bullet');
    bullets.setAll('checkWorldBounds', true);
    bullets.setAll('outOfBoundsKill', true);
    //backgroundobjects.add(bullets)
    this.grenades = this.game.add.group();
    this.grenades.enableBody = true;
    this.grenades.physicsBodyType = Phaser.Physics.ARCADE;
    this.grenades.createMultiple(5, 'grenade');
    //this.grenades.scale.setTo(0.2);
    this.grenades.setAll('checkWorldBounds', true);
    this.grenades.setAll('outOfBoundsKill', true);
    //backgroundobjects.add(this.grenades)
    //this.fireButton1 = this.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
    //this.fireButton2 = this.input.keyboard.addKey(Phaser.KeyCode.Z);
    //this.game.input.activePointer.rightButton.isDown
    //this.Layer1.events.onInputDown.add(this.poscal,this,1);
    //this.game.input.onTap.add(this.onTap,this);

    this.marker = this.game.add.graphics();
    this.marker.lineStyle(2, 0x000000, 1);
    this.marker.drawRect(0, 0, this.mx, this.my);
    this.foreground.add(this.marker);    

    this.bullets  = [];
    this.bulletsGfx = []

    //backgroundobjects.add(this.graphics)
    this.rearrangeGroups();
    this.game.input.setInteractiveCandidateHandler(this.interactiveCandidateHandler, this);
    this.staticLoaded();
    this.game.load.onLoadStart.add(this.loadStart, this);
    this.game.load.onFileComplete.add(this.fileComplete, this);
    this.game.load.onLoadComplete.add(this.loadComplete, this);

    //quick fix
    this.z = 0;
  },
  loadStart: function () {

  },
  fileComplete: function (progress, cacheKey, success, totalLoaded, totalFiles) {

  },
  loadComplete: function () {
    this.game.load.onLoadStart.removeAll(this);
    this.game.load.onFileComplete.removeAll(this);
    this.game.load.onLoadComplete.removeAll(this);
    this.dynamicLoaded();
  },
  interactiveCandidateHandler: function(pointer, candidates, favorite){
    //havent used this yet search google for phaser interactive Candidate Handler for details
    //console.log(pointer);
    //console.log(candidates);
    //console.log(favorite);
    
    if (false)
    {
        for(var i = 0; i < candidates.length; i++)
        {
            if (candidates[i].sprite.key === 'disk')
            {
                return candidates[i];
            }
        }
        return favorite;
    }
    else
    {
        return favorite;
    }
    
  },
  waypointDrawer: function(){
    var prevMove = null;
    this.graphics.ctx.setLineDash([1, 0]);
    this.graphics.ctx.strokeStyle = 'orange';
    this.graphics.ctx.beginPath();
    this.graphics.ctx.arc(this.selectedObject.hitbox.x - this.camera.x, this.selectedObject.hitbox.y - this.camera.y, 35, 0, 2 * Math.PI, false);
    this.graphics.ctx.fillStyle = 'rgba(0,0,255,0.5)';
    this.graphics.ctx.fill();
        
    /*
    for (var i = 0; i < this.z.length; i++) {
      var l = this.z[i]
      this.graphics.ctx.moveTo(l.x1 - this.camera.x, l.y1 - this.camera.y);
      this.graphics.ctx.lineTo(l.x2 - this.camera.x, l.y2 - this.camera.y);
    }*/
    this.graphics.ctx.closePath();
    this.graphics.ctx.stroke();
    this.graphics.ctx.lineDashOffset -= this.dte * 20;
    for (var i = 0; i < this.selectedObject.moves.length; i++) {
      var move = this.selectedObject.moves[i];
      switch (move.type) {
        case Gameplay.enum.character.status.IDLE:
        break;
        case Gameplay.enum.character.status.MOVE:

        break;
        case Gameplay.enum.character.status.ACTION:

        break;
        case Gameplay.enum.character.status.CAMP:

        break;
        case Gameplay.enum.character.status.SIGNAL:

        break;
        case Gameplay.enum.character.status.INTERACT:

        break;
        case Gameplay.enum.character.status.RELOAD:

        break;
        default:
      }
      if(prevMove){
        if(move.type == Gameplay.enum.character.status.MOVE){
          this.graphics.ctx.strokeStyle = 'orange';
          this.graphics.ctx.beginPath();
          this.graphics.ctx.moveTo(prevMove.x - this.camera.x, prevMove.y - this.camera.y);
          this.graphics.ctx.setLineDash([2, 4]);
          this.graphics.ctx.lineTo(move.lookx - this.camera.x, move.looky - this.camera.y);
          this.graphics.ctx.stroke();
          this.graphics.ctx.closePath();
          this.graphics.ctx.beginPath();
          this.graphics.ctx.moveTo(prevMove.x - this.camera.x, prevMove.y - this.camera.y);
          prevMove = move;
        }
      }
      else{
        if(move.type == Gameplay.enum.character.status.MOVE){
          this.graphics.ctx.beginPath();
          this.graphics.ctx.strokeStyle = 'blue';
          this.graphics.ctx.setLineDash([2, 4]);
          this.graphics.ctx.moveTo(this.selectedObject.physics.x - this.camera.x, this.selectedObject.physics.y - this.camera.y);
          this.graphics.ctx.lineTo(move.lookx - this.camera.x, move.looky - this.camera.y);
          this.graphics.ctx.stroke();
          this.graphics.ctx.closePath();
          prevMove = move;
        } else {
          prevMove = {}
          prevMove.x = this.selectedObject.x;
          prevMove.y = this.selectedObject.y;
        }
        this.graphics.ctx.beginPath();
        this.graphics.ctx.moveTo(this.selectedObject.physics.x - this.camera.x, this.selectedObject.physics.y - this.camera.y);
      }
      if(move.type == Gameplay.enum.character.status.MOVE){
        this.graphics.ctx.strokeStyle = 'green';
        this.graphics.ctx.setLineDash([1, 0]);
        this.graphics.ctx.lineTo(move.x - this.camera.x, move.y - this.camera.y);
        this.graphics.ctx.stroke();
        this.graphics.ctx.closePath();
      }
      if(move.type == Gameplay.enum.character.status.ACTION){
        this.graphics.ctx.strokeStyle = 'black';
        this.graphics.ctx.setLineDash([5, 1]);
        this.graphics.ctx.lineTo(move.lookx - this.camera.x, move.looky - this.camera.y);
        this.graphics.ctx.stroke();
        this.graphics.ctx.closePath();
      }
      if(move.type == Gameplay.enum.character.status.CAMP){
        this.graphics.ctx.arc(prevMove.x - this.camera.x, prevMove.y - this.camera.y, 35, 0, 2 * Math.PI, false);
        this.graphics.ctx.fillStyle = 'rgba(255,255,0,0.5)';
        this.graphics.ctx.fill();
        this.graphics.ctx.closePath();
      }
      if(move.type == Gameplay.enum.character.status.SIGNAL){
        this.graphics.ctx.arc(prevMove.x - this.camera.x, prevMove.y - this.camera.y, 35, 0, 2 * Math.PI, false);
        this.graphics.ctx.fillStyle = 'rgba(255,0,0,0.5)';
        this.graphics.ctx.fill();
        this.graphics.ctx.closePath();
      }

    }

    this.graphics.dirty = true;
  },
  select:function(sprite,event){
    if(event.leftButton.isDown){
      if(sprite.parent){
        if(sprite.parent.mySquadID >=0){
          this.selectedObject = this.mySquad.characters[sprite.parent.mySquadID];
          console.log(this.selectedObject);
        }
      }else{
        this.selectedObject = null;
        this.editorMode     = null;
      }
      console.log(sprite)
    }
  },
  update:function(){
    //everything should depend on dte...
    
    this.handlerPointer();
    this.handlerInputOnDown();
    this.updateCamera();
    var data = null;
    if(this.online){
      if(this.isServer){

      } else {
        data = this.client.rdata;        
        if(data){
          this.client.rdata = null;
        } else {
          data = [];
        }
      }
    }
    this.dte = this.dt();
    this.z += this.dte;
    if(this.info.started){
      this.updateCharacters(data);
      this.updateBullets();
      if(this.z >= .084){
        this.z = 0;        
        this.updateGUI();
        if(this.online){
          this.updateMP();
        }
      }      
    }
    
    this.game.physics.arcade.collide(this.physicsGroup,this.physicsGroup, this.collisionHandler,null,this)
    this.game.physics.arcade.collide(this.physicsGroup,this.layers[0]);
    this.game.physics.arcade.collide(this.physicsGroup,this.layers[1]);

  },
  updateMP: function(){
    //only for MP server
    if(this.isServer && this.info.started){
      var data = [];
      for (var i = 0; i < this.characters.length; i++) {
        if(this.characters[i].alive){

          data[i] = {};
          data[i].id      = this.characters[i].id;
          data[i].x       = this.characters[i].physics.x;
          data[i].y       = this.characters[i].physics.y;
          data[i].vx      = this.characters[i].physics.body.velocity.x;
          data[i].vy      = this.characters[i].physics.body.velocity.y;
          data[i].angle   = this.characters[i].body.angle;
          data[i].langle  = this.characters[i].body.lookAngle;
        }
        if(this.characters[i].sync.length){
          var sync = this.characters[i].sync.pop();
          var message = {
            type:'g',
            subtype: 'uc',
            v: {cid: this.characters[i].id}
          }
          switch (sync) {
            case 'alive':
              message.k   = 'alive';
              message.kv = this.characters[i].alive;
              this.client.addMessage(message);
              break;
            case 'fm':
              var m = this.characters[i].moves[0];
              if(m){
                message.subtype='fm';
                message.value = m;
                this.client.addMessage(message);
              }
              break;
            default:
          }
        }
      }
      this.client.sdata = data;
    }
  },
  collisionHandler:function(obj1, obj2){
    if(obj1.p && obj2.p){
      if((obj1.p.type == 'Character')&&(obj2.p.type == 'Character')){
        if(obj1.p.direction.NORTH && obj2.p.direction.SOUTH){

        }else if(obj1.p.direction.SOUTH && obj2.p.direction.NORTH){

        }
      }
    }
  },
  updateBullets:function(){
    if(this.testExecute){
      var bGfx = []
      for (var i = 0; i < this.bullets.length; i++) {
        var line = {}; //trajectory of bullet
        var s = this.bullets[i];
        var damage = s.bullet.stats.ap + s.character.stats.ap + s.weapon.stats.ap;
        this.ray.x1 = line.x1 = s.x;
        this.ray.y1 = line.y1 = s.y;
        this.ray.x2 = line.x2 = s.x + s.bullet.stats.maxDistance * Math.cos(Math.radians(s.angle));
        this.ray.y2 = line.y2 = s.y + s.bullet.stats.maxDistance * Math.sin(Math.radians(s.angle));
        line.time = this.lastGameTime;

        this.bulletsGfx.push(line);
        bGfx.push(line);

        var obstacles0 = this.layers[0].getRayCastTiles(this.ray,30,true,false);
        var obstacles1 = this.layers[1].getRayCastTiles(this.ray,30,true,false);
        if (obstacles0.length > 0){

        }else if (obstacles1.length > 0){

        }else{
          for (var j = 0; j < this.factions.length; j++) {
            if (this.factions[j].id == s.character.faction.id) {
              continue;
            }
            s.character.lastSeen[this.factions[j].id] = this.gameTimer.lastGameTime;
            this.factions[j].canSee[s.character.id] = s.character;

            //hit test
            for (var k = 0; k < this.factions[j].characters.length; k++) {
              if(!this.factions[j].characters[k].alive){
                continue;
              }
              var p = this.factions[j].characters[k].hitbox;
              var a = new Vec2(line.x1, line.y1);
              var b = new Vec2(line.x2, line.y2);
              var n = b.subtract(a);
              var pa= a.subtract(p);
              var c = n.multiply(Dot( n, pa ) / Dot( n, n ));
              var d = pa.subtract(c);
              var d2= Dot( d, d );
              if(d2 <= (p.radius*p.radius)){
                this.factions[j].characters[k].damage(damage, s.character.id);
                s.hits++;
              }
            }
          }
        }
      }
      this.bullets = [];
    }
  },
  updateCharacters:function(data){
    var calc = false;
    if(this.z >= .084){
      this.dte = this.z;
    } else {
      calc = true;
    }
    for (var i = 0; i < this.factions.length; i++) {
      for (var j = 0; j < this.factions[i].squads.length; j++) {

        if(this.factions[i].squads[j].signal){
          if((this.lastGameTime - this.factions[i].squads[j].signalSecond)>2){
            this.factions[i].squads[j].signal = false;
          }
        }

        for (var k = 0; k < this.factions[i].squads[j].characters.length; k++) {
          var c = this.factions[i].squads[j].characters[k];
          if(!c.alive){
            c.allViewable.setAll('alpha',0.0);
            continue;
          }
          for (var l = 0; l < this.factions.length; l++) {
            //Is an enemy?
            if(this.factions[l].id!=c.faction.id){
              for (var m = 0; m < this.factions[l].characters.length; m++) {
                var e = this.factions[l].characters[m];
                if(!e.alive){
                  continue;
                }
                var distance = this.game.physics.arcade.distanceBetween(c.physics.body,e.physics.body)
                if(distance < c.details.maxViewableDistance){
                    var d = Math.degrees(this.game.physics.arcade.angleToXY(c.physics.body,e.physics.body.x,e.physics.body.y))
                    var diff = (c.body.angle - d +360)%360
                    if(diff > (360 - c.details.viewingAngle) || diff < c.details.viewingAngle){
                    this.ray.x1 = c.physics.x;
                    this.ray.y1 = c.physics.y;
                    this.ray.x2 = e.physics.x;
                    this.ray.y2 = e.physics.y;
                    var obstacles0 = this.layers[0].getRayCastTiles(this.ray,30,true,false);
                    var obstacles1 = this.layers[1].getRayCastTiles(this.ray,30,true,false);
                    if (obstacles0.length > 0){

                    }else if (obstacles1.length > 10){

                    }else{
                      //console.log(c.name+' can see '+ e.name);
                      e.allViewable.setAll('alpha',1)
                      e.visible = true;
                      e.lastSeen[c.faction.id] = this.gameTimer.lastGameTime;
                      c.faction.canSee[e.id] = e;
                    }
                  }
                }
              }
            }
          }
          if(this.online){
            if(this.isServer){
              c.physics.body.velocity.x = c.physics.body.velocity.y = 0;
            } else {
              if(data[c.id]){
                c.physics.x = data[c.id].x;
                c.physics.y = data[c.id].y;
                c.physics.body.velocity.x = data[c.id].vx;
                c.physics.body.velocity.y = data[c.id].vy;
                c.body.angle = data[c.id].angle;
                c.body.lookAngle = data[c.id].langle;
              }
            }
          }
          c.direction.EAST = c.direction.WEST = c.direction.NORTH = c.direction.SOUTH = false;
          if(this.testExecute){

            var ds = this.dte*c.stats.speed;            

            if(!c.body._armature.animation._isPlaying){
              c.body._armature.animation._isPlaying=true
            }
            if(calc){
              var enemiesInSight = Object.getOwnPropertyNames(c.faction.canSee);
              var enemyToShoot = null;
              var distanceToEnemy = c.details.maxViewableDistance;
              for (var n = 0; n < enemiesInSight.length; n++) {
                var e = c.faction.canSee[enemiesInSight[n]];
                if(this.lastGameTime - e.lastSeen[c.faction.id] > 3){
                  if(e.faction.myFaction){

                  }else{
                    if(this.settings.FOG_OF_WAR){
                      e.allViewable.setAll('alpha',0);
                    }
                    e.visible = false;
                  }
                  delete c.faction.canSee[e.id];
                  continue;
                }
                if(!e.alive){
                  delete c.faction.canSee[e.id];
                  continue;
                }
                var distance = this.game.physics.arcade.distanceBetween(c.physics.body,e.physics.body);
                if(distance < distanceToEnemy){
                  this.ray.x1 = c.physics.x
                  this.ray.y1 = c.physics.y
                  this.ray.x2 = e.physics.x
                  this.ray.y2 = e.physics.y
                  var obstacles0 = this.layers[0].getRayCastTiles(this.ray,30,true,false);
                  var obstacles1 = this.layers[1].getRayCastTiles(this.ray,30,true,false);
                  if (obstacles0.length > 0){

                  }else if (obstacles1.length > 0){

                  }else{
                    distanceToEnemy = distance;
                    enemyToShoot = e;
                  }
                }
              }
              if(c.squad.mySquad || c.faction.myFaction){
                  c.allViewable.setAll('alpha',1)
              }

              if(enemyToShoot){
                var m = new Move()
                m.type  = Gameplay.enum.character.status.ACTION;
                m.cT    = this.lastGameTime;
                m.lUT   = this.lastGameTime;
                m.x     = c.physics.x;
                m.y     = c.physics.y;
                m.lookx = enemyToShoot.physics.x;
                m.looky = enemyToShoot.physics.y;
                m.ready = true;
                m.ai    = true;
                m.cid   = c.id;
                m.eid   = enemyToShoot.id
                if(c.moves.length){
                  if(c.moves[0].type == Gameplay.enum.character.status.ACTION){
                    if(m.eid != c.moves[0].eid){
                      if(this.isServer){
                        c.moves.unshift(m);
                        var message = {
                          type : 'g',
                          subtype: 'um',
                          value: m
                        }
                        this.client.addMessage(message);
                      }
                    }
                  }else{
                    if(this.isServer){
                      c.moves.unshift(m);
                      var message = {
                        type : 'g',
                        subtype: 'um',
                        value: m
                      }
                      this.client.addMessage(message);
                    }
                  }
                }else{
                  if(this.isServer){
                    c.moves.unshift(m);
                    var message = {
                      type : 'g',
                      subtype: 'um',
                      value: m
                    }
                    this.client.addMessage(message);
                  }
                }
              }
              if(c.moves.length){
                if(this.isServer){
                  c.lastAware = this.lastGameTime;
                  if(c.isCamping){
                    c.body.stop();
                    c.status = Gameplay.enum.character.status.CAMP;
                    if((this.lastGameTime - c.campSecond > 5)||c.squad.signal){
                      c.isCamping = false;
                    }else{
                      continue;
                    }
                  }
                  if(c.isSignalling){
                    c.body.stop();
                    c.status = Gameplay.enum.character.status.SIGNAL;
                    if((this.lastGameTime - c.signalSecond > 3)){
                      c.isSignalling = false;
                      c.squad.signal  = true;
                      c.squad.signalSecond = this.gameTimer.seconds;
                    }else{
                      continue;
                    }
                  }
                  var m = c.moves[0];
                  if(m.type == Gameplay.enum.character.status.ACTION){
                    if(c.status != Gameplay.enum.character.status.ACTION){
                      c.status = Gameplay.enum.character.status.ACTION
                      c.body.gotoAndPlay('idle',0,75/c.stats.speed)
                    }
                    if(m.ai){
                      if(enemyToShoot){

                      } else {
                        if(this.online){
                            c.moves.shift();
                            var message = {
                              type:'g',
                              subtype:'sm',
                              value: {cid:c.id}
                            };
                            this.client.addMessage(message);
                        } else {
                          c.moves.shift();
                        }
                      }
                    } else {
                      if(this.online){
                          c.moves.shift();
                          var message = {
                            type:'g',
                            subtype:'sm',
                            value: {cid:c.id}
                          };
                          this.client.addMessage(message);
                      } else {
                        c.moves.shift();
                      }
                    }

                    c.body.lookAngle = Math.degrees(this.game.physics.arcade.angleToXY(c.body,m.lookx,m.looky))
                    if(c.squad.weaponsFree){
                      //check accuracy
                      if(Math.abs(c.body.angle - c.body.lookAngle) < (0.01 * c.stats.accuracy)){
                        if(c.weaponInUse.fire()){
                          this.bullets.push(new Shot(this.game, c, c.weaponInUse, c.weaponInUse.bullet, c.physics.x, c.physics.y, c.body.angle));
                        }
                      }
                    }
                  }
                  if(m.type == Gameplay.enum.character.status.MOVE){
                    if(c.status != Gameplay.enum.character.status.MOVE){
                      c.status = Gameplay.enum.character.status.MOVE
                      c.body.gotoAndPlay('walk',0,75/c.stats.speed)
                    }
                    var d = c.physics.x - m.x
                    var e = c.physics.y - m.y
                    Math.abs(d)<10? d=0 : c.physics.body.velocity.x = ds*Math.abs(d)/(-d)*75
                    Math.abs(e)<10? e=0 : c.physics.body.velocity.y = ds*Math.abs(e)/(-e)*75
                    if(d > 0){
                      c.direction.EAST = true;
                    }else if (d < 0){
                      c.direction.WEST = true;
                    }
                    if(e > 0){
                      c.direction.NORTH = true;
                    }else if(e < 0){
                      c.direction.SOUTH = true;
                    }
                    if(!(d||e)){
                      c.moves.shift()
                      if(this.online){
                        if(this.isServer){
                          var message = {
                            type:'g',
                            subtype:'sm',
                            value: {cid:c.id}
                          };
                          this.client.addMessage(message);
                        }
                      }
                    }
                    if(this.lastGameTime - m.lUT > .5){
                      m.lUT   = this.lastGameTime;
                      m.lookx = this.game.rnd.integerInRange(m.lookx - c.stats.alertness, m.lookx + c.stats.alertness);
                      m.looky = this.game.rnd.integerInRange(m.looky - c.stats.alertness, m.looky + c.stats.alertness);
                      if(this.online) {
                        c.sync.push('fm');//firstmove
                      }
                    }
                    c.body.lookAngle = Math.degrees(this.game.physics.arcade.angleToXY(c.body,m.lookx,m.looky))
                  }
                  else if(m.type == Gameplay.enum.character.status.RELOAD){
                    c.isReloading = true;
                    this.reloadSecond = this.gameTimer.seconds;
                    c.moves.shift()
                    if(this.online){
                      if(this.isServer){
                        var message = {
                          type:'g',
                          subtype:'sm',
                          value: {cid:c.id}
                        };
                        this.client.addMessage(message);
                      }
                    }
                  }
                  else if(m.type == Gameplay.enum.character.status.CAMP){
                    c.isCamping = true;
                    c.campSecond = this.gameTimer.seconds;
                    c.moves.shift()
                    if(this.online){
                      if(this.isServer){
                        var message = {
                          type:'g',
                          subtype:'sm',
                          value: {cid:c.id}
                        };
                        this.client.addMessage(message);
                      }
                    }
                  }
                  else if(m.type == Gameplay.enum.character.status.SIGNAL){
                    c.isSignalling = true;
                    c.signalSecond = this.gameTimer.seconds;
                    c.moves.shift()
                    if(this.online){
                      if(this.isServer){
                        var message = {
                          type:'g',
                          subtype:'sm',
                          value: {cid:c.id}
                        };
                        this.client.addMessage(message);
                      }
                    }
                  }
                }
              }
              else{
                c.body.stop();
                c.status = Gameplay.enum.character.status.IDLE;
                if(this.isServer){
                  if((this.lastGameTime - c.lastAware) > (c.stats.alertness/10)){
                    var m   = new Move()
                    m.type  = Gameplay.enum.character.status.MOVE;
                    m.cT    = this.lastGameTime;
                    m.lUT   = this.lastGameTime;
                    m.cid   = c.id;
                    m.x     = c.physics.x;
                    m.y     = c.physics.y;
                    //m.x     = this.game.rnd.integerInRange(c.physics.x - c.stats.alertness*50, c.physics.x + c.stats.alertness*50);
                    //m.y     = this.game.rnd.integerInRange(c.physics.y - c.stats.alertness*50, c.physics.x + c.stats.alertness*50);
                    m.lookx = this.game.rnd.integerInRange(m.x - c.stats.alertness, m.x + c.stats.alertness);
                    m.looky = this.game.rnd.integerInRange(m.y - c.stats.alertness, m.y + c.stats.alertness);
                    m.ai    = true;
                    m.ready = true;
                    c.moves.push(m);
                    if(this.online){
                      if(this.isServer){
                        var message = {
                          type : 'g',
                          subtype: 'm',
                          value: m
                        }
                        this.client.addMessage(message);
                      }
                    }
                  }
                }
              }
            }
            

            c.body.x = c.hitbox.x = c.physics.x
            c.body.y = c.hitbox.y = c.physics.y

            if(c.body.lookAngle < -90 && c.body.angle > 90){
              c.body.angle += (360+c.body.lookAngle - c.body.angle)*ds*0.1
            }else{
              c.body.angle += (c.body.lookAngle - c.body.angle)*ds*0.1
            }

            if(this.settings.LIGHTING){
              c.fov.lamp.angle = Math.radians(-c.body.angle);
              c.fov.position.x = c.body.x;
              c.fov.position.y = c.body.y;
              c.fov.refresh();
            }

          }else{
            if(c.body._armature.animation._isPlaying){
              c.body._armature.animation._isPlaying=false
            }
          }
        }
      }
    }
  },
  updateCamera:function(){
    if(this.settings.INTERACTIVE_MINIMAP&&this.miniMapSprite.hovered&&this.miniMapSprite.clicked){
      this.camera.x = (this.game.input.activePointer.x-(this.game.width - this.miniMapSprite.width))/this.miniMapSprite.width*this.mapSizeX - this.game.width/2;
      this.camera.y = this.game.input.activePointer.y/this.miniMapSprite.height*this.mapSizeY - this.game.height/2;
    }
  },
  handlerPointer:function(){
    if(this.game.input.activePointer.leftButton.isDown)
    {
        this.mousePosx = this.game.input.activePointer.x;
        this.mousePosy = this.game.input.activePointer.y;
        //path = this.findPathTo(this.layers[1].getTileX(marker.x), this.layers[1].getTileY(marker.y),this.graphics);
    }
    if(this.game.input.activePointer.rightButton.isDown)
    {
        this.mousePosx = this.game.input.activePointer.x;
        this.mousePosy = this.game.input.activePointer.y;
        this.marker.x = this.layers[0].getTileX(this.game.input.activePointer.worldX) * this.mx;
        this.marker.y = this.layers[0].getTileY(this.game.input.activePointer.worldY) * this.my;


        //path = this.findPathTo(this.layers[1].getTileX(marker.x), this.layers[1].getTileY(marker.y),this.graphics);
    }
    if(this.game.input.activePointer.middleButton.isDown)
    {
      if (this.game.origDragPoint)
      {
        //TEMPORARY FIX THIS
        this.graphics.ctx.clearRect(0, 0, this.game.width, this.game.height);
        // move the camera by the amount the mouse has moved since last update
        this.game.camera.x += this.game.origDragPoint.x - this.game.input.activePointer.position.x;
        this.game.camera.y += this.game.origDragPoint.y - this.game.input.activePointer.position.y;
        
      }
      // set new drag origin to current position
      this.game.origDragPoint = this.game.input.activePointer.position.clone();
    }else{
      this.game.origDragPoint = null;
    }
  },
  setUpObject:function(object){
      var position, prefab;
      console.log(object.type,object.name);    // tiled coordinates starts in the bottom left corner?
      position = {"x": object.x, "y": object.y };
      // create object according to its type
      switch (object.type) {
        case 'object':
          prefab = this.game.add.sprite(position.x,position.y,object.name)
          prefab.rotation = Math.radians(object.rotation);
          prefab.anchor.setTo(0,1);// for tiled boottom left
          if(object.properties){
            if(object.properties.collision){
              this.game.physics.arcade.enable(prefab);
              prefab.body.immovable = true;
              prefab.body.moves     = false;
            }
          }
          break;
        case 'collisionLight':

          break;
        default:

      }

      if(prefab){
        this.backgroundObjects.add(prefab)
        this.objects.push(prefab);
      }
  },
  editor:function(sprite,event){
    if(event.type == 'mouseup' && event.button == 2){
      if( this.selectedObject && Gameplay.enum.mode.PLAN ){
        console.log(this.editorMode);
        var path;
        switch(this.editorMode){
          case Gameplay.enum.character.status.MOVE:
            if(this.currentMove == null){
              this.currentMove = new Move()
              this.currentMove.type = Gameplay.enum.character.status.MOVE;
              this.currentMove.x    = this.game.input.activePointer.worldX;
              this.currentMove.y    = this.game.input.activePointer.worldY;
              this.currentMove.cid  = this.selectedObject.id;
              //= this.findPathTo(this.layers[1].getTileX(marker.x), this.layers[1].getTileY(marker.y),this.graphics);
            }else if(this.currentMove.type == Gameplay.enum.character.status.MOVE){
              this.currentMove.lookx    = this.game.input.activePointer.worldX;
              this.currentMove.looky    = this.game.input.activePointer.worldY;
              this.currentMove.ready = true;
            }else{
              this.currentMove = null;
            }
          break;
          case Gameplay.enum.character.status.SIGNAL:
            if(this.currentMove == null){
              this.currentMove = new Move();
              this.currentMove.type = Gameplay.enum.character.status.SIGNAL;
              this.currentMove.cid  = this.selectedObject.id;
              this.currentMove.ready = true;
            }else{
              this.currentMove = null;
            }
          break;
          case Gameplay.enum.character.status.INTERACT:
          break;
          case Gameplay.enum.character.status.ACTION:
            if(this.currentMove == null){
              this.currentMove = new Move();
              this.currentMove.type = Gameplay.enum.character.status.ACTION;
              this.currentMove.lookx= this.game.input.activePointer.worldX;
              this.currentMove.looky= this.game.input.activePointer.worldY;
              this.currentMove.cid  = this.selectedObject.id;
              this.currentMove.ready = true;
            }else{
              this.currentMove = null;
            }
          break;
          case Gameplay.enum.character.status.CAMP:
            if(this.currentMove == null){
              this.currentMove = new Move();
              this.currentMove.type = Gameplay.enum.character.status.CAMP;
              this.currentMove.cid  = this.selectedObject.id;
              this.currentMove.ready = true;
            }else{
              this.currentMove = null;
            }
          break;
          case Gameplay.enum.character.status.RELOAD:
            if(this.currentMove == null){
              this.currentMove = new Move();
              this.currentMove.type = Gameplay.enum.character.status.RELOAD;
              this.currentMove.cid  = this.selectedObject.id;
              this.currentMove.ready = true;
            }else{
              this.currentMove = null;
            }
          break;
          default:
        }
        if(this.currentMove){
          if(this.currentMove.ready){
            this.currentMove.lUT = this.currentMove.cT = this.lastGameTime;
            if(this.online){
              if(this.isServer){
                this.selectedObject.moves.push(this.currentMove);
              } else {

              }
              var message = {
                type : 'g',
                subtype: 'm',
                value: this.currentMove
              }
              this.client.addMessage(message);
              this.currentMove = null;
            }else{
              this.selectedObject.moves.push(this.currentMove);
              this.currentMove = null;
            }
          }
        }
      }
    }
  },
  fireBullet:function(){
      if (this.game.time.now > nextFire && bullets.countDead() > 0)
      {
          nextFire = this.game.time.now + fireRate;
          var bullet = bullets.getFirstDead();
          //bullet.reset(this.playerArray[id].x - 8, this.playerArray[id].y - 8);
          this.game.physics.arcade.moveToPointer(bullet, 300);
      }
  },
  fireGranade:function(){
      if (this.game.time.now > nextFire && bullets.countDead() > 0)
      {
          nextFire = this.game.time.now + fireRate;
          var granade = this.grenades.getFirstDead();
          granade.reset(this.playerArray[id].x - 8, this.playerArray[id].y - 8);
          this.game.physics.arcade.moveToPointer(granade, 300);
          granade.lifespan=500;
      }
  },
  findPathTo:function(tilex, tiley) {
      this.pathfinder.setCallbackFunction(function(path) {
          path = path || [];
          /*
          for(var i = 0, ilen = path.length; i < ilen; i++) {
              graphics.lineTo(path[i].x*this.mx, path[i].y*this.my);
              //map.putTile(46, path[i].x, path[i].y);
          }
          blocked = false;
          this.playerArray[id].path = path;
          */
      }.bind(this));
      this.pathfinder.preparePathCalculation([this.layers[1].getTileX(this.playerArray[id].x),this.layers[1].getTileY(this.playerArray[id].y)], [tilex,tiley]);
      this.pathfinder.calculatePath();
  },
  fullscreen: function(){
    if (this.game.scale.isFullScreen)
    {
        this.game.scale.stopFullScreen();
    }
    else
    {
        this.game.scale.startFullScreen(false);
    }
  },
  render: function(){
    this.game.debug.text(this.game.time.fps || '--', 2, 14, "#00ff00");
    //game.debug.pointer(this.game.input.mousePointer);
    //game.debug.pointer(this.game.input.pointer1);
    //game.debug.pointer(this.game.input.pointer2);
  },
  setUpVariables:function() {
    this.mode = this.gameplay.mode==Gameplay.enum.mode.HYBRID?Gameplay.enum.mode.PLAN:this.gameplay.mode;
    this.hide = false;
    this.mySquad = {};
    this.characterID = 0; //0 means no one is selected
    this.selectedObject = null;
    this.follow = false;
    this.origDragPoint = null;
    this.editorMode = null;
    this.actionMode = Gameplay.enum.action.WEAPON_1;
    this.currentMove = null;
    this.ray = new Phaser.Line();
    this.testExecute = false;
  },
  setUpGUI: function(){
    //this.gui.pivot.setTo(this.game.width/2,this.game.height/2)
    this.miniMapBmd = {}
    this.miniMapSize = this.game.width*this.settings.MINIMAP_SIZE;
    this.miniMapBmd = this.game.add.bitmapData(this.miniMapSize,this.miniMapSize);
    var buttons = []
    var move      = buttons.push(this.game.add.button(this.game.width-200, 200, 'button', this.buttonOnMove, this, 2, 1, 0));
    /*
    var cancel    = this.game.add.button(this.game.width-200, 280, 'button', this.buttonOnMove, this, 2, 1, 0);
    var action    = this.game.add.button(this.game.width-200, 250, 'button', this.buttonOnMove, this, 2, 1, 0);
    var interact  = this.game.add.button(this.game.width-200, 420, 'button', this.buttonOnMove, this, 2, 1, 0);
    var camp      = this.game.add.button(this.game.width-200, 490, 'button', this.buttonOnMove, this, 2, 1, 0);
    var signal    = this.game.add.button(this.game.width-200, 550, 'button', this.buttonOnMove, this, 2, 1, 0);
    var mode      = this.game.add.button(this.game.width-200, 400, 'button', this.buttonOnMove, this, 2, 1, 0);
    var follow    = this.game.add.button(this.game.width-200, 400, 'button', this.buttonOnMove, this, 2, 1, 0);
    var reload    = this.game.add.button(this.game.width-200, 400, 'button', this.buttonOnMove, this, 2, 1, 0);
    var signal    = this.game.add.button(this.game.width-200, 400, 'button', this.buttonOnMove, this, 2, 1, 0);
    */
    for( i = 0; i < buttons.length; i++){
        this.subgui.add(buttons[i])
        buttons[i].input.priorityID = 5;
    }
    this.gui.add(this.subgui);
    this.miniMapSprite = this.game.add.sprite((this.game.width-this.miniMapSize), 0, this.tempmini);
    this.miniMapSprite.scale.setTo(this.miniMapSize/this.map.width,this.miniMapSize/this.map.height);
    this.miniMapSprite.inputEnabled = true;
    this.miniMapSprite.input.priorityID = 4;
    this.miniMapSprite.events.onInputDown.add(this.onClickMiniMap,this);
    this.miniMapSprite.events.onInputOver.add(this.onClickMiniMap,this);
    this.miniMapSprite.events.onInputUp.add(this.onClickMiniMap,this);
    this.miniMapSprite.events.onInputOut.add(this.onOutMiniMap,this);
    this.miniMapSprite.clicked = false;
    this.miniMapSprite.hovered = false;
    this.gui.add(this.miniMapSprite)
    this.miniMapOverlaySprite = this.game.add.sprite((this.game.width-this.miniMapSize), 0,this.miniMapBmd);
    this.gui.add(this.miniMapOverlaySprite)
    this.gui.fixedToCamera = true;
    this.tweenGUION = this.game.add.tween(this.gui,this.game).to({alpha:1}, 500, Phaser.Easing.Cubic.In);
    this.tweenGUIOFF = this.game.add.tween(this.gui,this.game).to({alpha:0.05}, 500, Phaser.Easing.Cubic.In);
    
    //waypoints and lines
    this.graphics = this.game.add.bitmapData(this.game.width,this.game.height);
    this.graphicsSprite = this.game.add.sprite(0, 0, this.graphics);    
    this.gui.add(this.graphicsSprite);
  },
  onClickMiniMap: function(sprite,event) {
    if(event.leftButton.isDown){
      this.miniMapSprite.clicked = true;
    }else{
      this.miniMapSprite.clicked = false;
    }
    this.miniMapSprite.hovered = true;
  },
  onOutMiniMap: function(sprite,event) {
    this.miniMapSprite.hovered = false;
  },
  setUpGameplay: function() {
    this.gameplay = {};
    this.gameplay.mode =  Gameplay.enum.mode.HYBRID;
  },
  setUpFog:function() {
    if(this.settings.FOG){
      this.fogBmd = this.game.add.bitmapData(this.game.width, this.game.height);
      this.fogBmd.ctx.fillStyle = this.settings.FOG_COLOR;
      this.fogBmd.ctx.fillRect(0, 0, this.game.width, this.game.height);
      this.game.cache.addBitmapData('fog', this.fogBmd);
      this.fogSprite = this.game.add.sprite(0, 0, this.fogBmd);
      this.fogSprite.fixedToCamera = true;
      this.foreground.add(this.fogSprite);
    }
  },
  setUpTimer: function() {
    this.timer = this.game.time.create(false);
    this.gameTimer = this.game.time.create(false);
    this.timer.start()
    this.gameTimer.start()
    this.gameTimer.pause()
    //this.timer.pause()
    //this.timer.resume()
    this.lastTime = this.timer.seconds;
    this.lastGameTime = this.gameTimer.seconds;
    this.gameTimer.lastGameTime = this.lastGameTime;
    this.gameTimerOffset = 0;
    this.timeScale = 1.0;
    this.totalTime = 0;
    this.timeTracker = 0;
    //this.timeline = new Array();
  },
  dt:function(){
    var dte = this.timer.seconds - this.lastTime;
    this.lastTime = this.timer.seconds;
    this.lastGameTime = this.gameTimer.seconds + this.gameTimerOffset;
    this.gameTimer.lastGameTime = this.lastGameTime;
    return dte;
  },
  setUpGroups: function(){
    this.zoomGroup          = this.game.add.group();
    this.behindBackground   = this.game.add.group();//behind background layer
    this.background         = this.game.add.group();//background layer and middleground
    this.backgroundObjects  = this.game.add.group();//objects over background like vehicles
    this.charactersGroup    = this.game.add.group();// contains groups of squads which again contaion characters inside
    this.physicsGroup       = this.game.add.physicsGroup();
    this.foreground         = this.game.add.group();//trees and fog

    this.zoomGroup.add(this.behindBackground);
    this.zoomGroup.add(this.background);
    this.zoomGroup.add(this.backgroundObjects);
    this.zoomGroup.add(this.charactersGroup);
    this.zoomGroup.add(this.foreground);

    this.gui                = this.game.add.group();// minimap
    this.subgui             = this.game.add.group();// buttons and icons on gui
  },
  rearrangeGroups: function(){
    this.game.world.bringToTop(this.background)
    this.game.world.bringToTop(this.backgroundObjects)
    this.game.world.bringToTop(this.charactersGroup)
    this.game.world.bringToTop(this.foreground)
    this.game.world.bringToTop(this.gui)
    this.game.world.bringToTop(this.subgui)
    this.game.world.bringToTop(this.physicsGroup)
  },
  setUpMap: function(){
    console.log('loading map');
    this.map =  this.add.tilemap('tilemap');
    this.tempmini = this.game.add.bitmapData(this.map.width, this.map.height)
    this.tempmini.ctx.globalAlpha = this.settings.MINIMAP_ALPHA;
    this.layers = [];
    console.log('map loaded');
    for(i=0;i<tileSheet.length;i++){
      this.map.addTilesetImage(tileSheet[i].name,tileSheet[i].name );
    }
    this.mapSizeX = this.map.widthInPixels;
    this.mapSizeY = this.map.heightInPixels;
    this.mx = this.mapSizeX / this.map.width;
    this.my = this.mapSizeY / this.map.height;

    this.walkables=[];
    var walkables = {}
    this.opaqueObjects = [];
    this.collisionBodiesBackground = [];
    var collisionBodiesBackground = {}//temp
    this.collisionBodiesMiddleground = [];
    var collisionBodiesMiddleground = {}//temp
    this.objects  = []

    //plan an extra layer for high graphics
    //plan dynamic lights for high graphics
    /*
    for( k = 0; k < this.map.layers[3].data.length; k++)
    {
      for( i = 0; i < this.map.layers[3].data[k].length; i++)
      {
        if(this.walkables.length){
          var test = false;
          for(j = this.walkables.length-1; j >= 0; j--){
            if(this.walkables[j] == this.map.layers[0].data[k][i].index){
              test = true;
              break;
            }
            //console.log(this.temp);
          }
          if(!test){
            if(!(this.map.layers[0].data[k][i].index == -1)){
              this.walkables.push(this.map.layers[0].data[k][i].index);
            }
          }
        }else{
          if(!(this.map.layers[0].data[k][i].index == -1)){
            this.walkables.push(this.map.layers[0].data[k][i].index);
          }
        }
      }
    }
    */
    for(i=0; i < this.map.layers.length; i++){
      if(this.map.layers[i].name == 'background'){
        this.layers[i] = this.map.createLayer(this.map.layers[i].name)
        this.layers[i].inputEnabled = true;
        this.layers[i].input.priorityID   = 2;
        this.layers[i].events.onInputDown.add(this.select,this);
        this.background.add(this.layers[i]);
        this.layers[i].resizeWorld();
      }
      if(this.map.layers[i].name == 'middleground'){
        this.layers[i] = this.map.createLayer(this.map.layers[i].name)
        this.background.add(this.layers[i]);
        this.layers[i].resizeWorld();
      }
      if(this.map.layers[i].name == 'foreground'){
        this.layers[i] = this.map.createLayer(this.map.layers[i].name)
        this.foreground.add(this.layers[i]);
        this.layers[i].resizeWorld();
      }

      if(this.map.layers[i].name == 'description'){
        this.layers[i] = this.map.layers[i]
        //pathfinder.setGrid(map.layers[0].data, walkables);
      }

      //console.log(i);
      for (y = 0; y < this.map.height; y++) {
        for (x = 0; x < this.map.width; x++) {
           var tile = this.map.getTile(x, y, i);
           if(tile){
             if(tile.properties.color){
               this.tempmini.ctx.fillStyle = tile.properties.color;
             }else{
               this.tempmini.ctx.fillStyle = '#111111';
             }
             this.tempmini.ctx.fillRect(x,y,1,1);
             if(tile.properties.collision){
               tile.collides = true;
               if (this.map.layers[i].name == 'middleground') {
                 if(!collisionBodiesMiddleground[tile.index]){
                   collisionBodiesMiddleground[tile.index] = true;
                   this.collisionBodiesMiddleground.push(tile.index)
                 }
               }
               if (this.map.layers[i].name == 'background') {
                 if(!collisionBodiesBackground[tile.index]){
                   collisionBodiesBackground[tile.index] = true;
                   this.collisionBodiesBackground.push(tile.index)
                 }
              }
             }
             if(this.settings.LIGHTING){
               if(tile.properties.collisionLight){
                 var o =this.game.add.illuminated.rectangleObject(tile.x*tile.width, tile.y*tile.height, tile.width, tile.height)
                 this.opaqueObjects.push(o);
               }
             }
             if (this.map.layers[i].name == 'description') {
               if((tile.properties.type == 'hide')||(tile.properties.type == 'walk')){
                 walkables[tile.index] = true;
               }
             }
           }
        }
      }
    }
    var indices = Object.getOwnPropertyNames(walkables);
    console.log(indices);
    for (var i = 0; i < indices.length; i++) {
      this.walkables.push(Number(indices[i]));
    }
    /////////////////////////////////////////////////////////////////
    //this.pathfinder.setGrid(this.map.layers[3].data, this.walkables);
    /////////////////////////////////////////////////////////////////
    this.map.setCollision(this.collisionBodiesBackground,true,this.layers[0],true)
    this.map.setCollision(this.collisionBodiesMiddleground,true,this.layers[1],true)
    var object_layer;
    for (object_layer in this.map.objects) {
        if (this.map.objects.hasOwnProperty(object_layer)) {
            // create layer objects
            this.map.objects[object_layer].forEach(this.setUpObject, this);
        }
    }
  },
  handleZoom: function(zoomDirection) {
    if (zoomDirection > 0) {
      this.zoomScale += this.zoomScaleIncrement;
    } else if (zoomDirection < 0) {
      this.zoomScale -= this.zoomScaleIncrement;
    }
    this.zoomScale = Phaser.Math.clamp(this.zoomScale,this.zoomScaleMin,this.zoomScaleMax);
    // Set world zoom (this is a group I have sprites in that will need to be scaled)
    //this.zoomGroup.scale.set(this.zoomScale);
    this.game.camera.scale.x = this.zoomScale;
    this.game.camera.scale.y = this.zoomScale;

    this.game.camera.bounds.x = this.game.world.bounds.width * (1 - this.zoomScale)/2;
    this.game.camera.bounds.y = this.game.world.bounds.height * (1 - this.zoomScale)/2;
    this.game.camera.bounds.width = this.game.world.bounds.width * this.zoomScale;
    this.game.camera.bounds.height = this.game.world.bounds.height * this.zoomScale;
    // Zoom background layer & resize

    //this.layers[0].resize(this.game.width / this.zoomScale,this.game.height / this.zoomScale);
    //this.layers[1].resize(this.game.width / this.zoomScale,this.game.height / this.zoomScale);
    //this.layers[2].resize(this.game.width / this.zoomScale,this.game.height / this.zoomScale);
    // My game area scales so I use the ScaleManager to get the actual canvas dimensions to resize the background to
    // Adjust body size of scaled sprites

  },

  setUpInput: function() {
    this.game.input.keyboard.onUpCallback = this.handlerInputOnUp.bind(this)
    this.game.input.onUp.add(this.editor, this);
    //this.game.input.keyboard.onDownCallback = this.handlerInputOnDown.bind(this)
  },
  handlerInputOnDown: function() {
    if(this.mode == Gameplay.enum.mode.PLAN){
      // fix this temporary issue
      if (this.settings.keys.CAMERA_UP.isDown )
      {        
        this.graphics.ctx.clearRect(0, 0, this.game.width, this.game.height)
        this.game.camera.y -= 100;
      }
      else if (this.settings.keys.CAMERA_DOWN.isDown)
      {        
        this.graphics.ctx.clearRect(0, 0, this.game.width, this.game.height)
        this.game.camera.y += 100;
      }
      if (this.settings.keys.CAMERA_LEFT.isDown)
      {        
        this.graphics.ctx.clearRect(0, 0, this.game.width, this.game.height)
        this.game.camera.x -= 100;
      }
      else if (this.settings.keys.CAMERA_RIGHT.isDown)
      {        
        this.graphics.ctx.clearRect(0, 0, this.game.width, this.game.height)
        this.game.camera.x += 100;
      }
    }else if(this.mode == Gameplay.enum.mode.SINGLE){
      if(this.selectedObject){
        if (this.settings.keys.CHARACTER_UP.isDown )
        {
          this.selectedObject.physics.body.velocity.y = -this.dte*this.selectedObject.stats.speed*50
        }
        else if (this.settings.keys.CHARACTER_DOWN.isDown )
        {
          this.selectedObject.physics.body.velocity.y = this.dte*this.selectedObject.stats.speed*50
        }
        if (this.settings.keys.CHARACTER_LEFT.isDown )
        {
          this.selectedObject.physics.body.velocity.x = -this.dte*this.selectedObject.stats.speed*50
        }
        else if (this.settings.keys.CHARACTER_RIGHT.isDown )
        {
          this.selectedObject.physics.body.velocity.x = this.dte*this.selectedObject.stats.speed*50
        }
      }
    }
  },
  handlerInputOnUp: function(e) {
    if (this.settings.keys.FULLSCREEN.keyCode == e.keyCode )
    {
      this.fullscreen();
    }
    if (this.settings.keys.MODE.keyCode == e.keyCode )
    {
      this.changeMode();
    }
    if (this.settings.keys.HIDE.keyCode == e.keyCode )
    {
      this.changeHide();
    }
    if (this.settings.keys.MOVE.keyCode == e.keyCode )
    {
      if(this.mode == Gameplay.enum.mode.PLAN){
        this.editorMode = Gameplay.enum.character.status.MOVE
      }
    }
    if (this.settings.keys.SIGNAL.keyCode == e.keyCode )
    {
      if(this.mode == Gameplay.enum.mode.PLAN){
        this.editorMode = Gameplay.enum.character.status.SIGNAL
      }
    }
    if (this.settings.keys.CANCEL.keyCode == e.keyCode )
    {
      if(this.mode == Gameplay.enum.mode.PLAN){
        if(this.currentMove){
          this.currentMove = null
        }else if(this.selectedObject){
          if(this.online){
            if(this.isServer){
                this.selectedObject.moves.pop();
                if(this.selectedObject.isCamping){
                  this.selectedObject.isCamping = false;
                }
            }
            var data = {}
            data.cid = this.selectedObject.id;
            var message = {
              type: 'g',
              subtype: 'rm',
              value: data
            }
            this.client.addMessage(message);
          } else  {
            this.selectedObject.moves.pop();
            if(this.selectedObject.isCamping){
              this.selectedObject.isCamping = false;
            }
          }
        }
      }
    }
    if (this.settings.keys.FOLLOW_CHARACTER.keyCode == e.keyCode )
    {
      //Decide on whether we allow camera to not follow character in single mode
      this.changeFollow();
    }
    if (this.settings.keys.INTERACT.keyCode == e.keyCode )
    {
      if(this.mode == Gameplay.enum.mode.PLAN){
        this.editorMode = Gameplay.enum.character.status.INTERACT
      }else{

      }
    }
    if (this.settings.keys.ACTION.keyCode == e.keyCode )
    {
      if(this.mode == Gameplay.enum.mode.PLAN){
        this.editorMode = Gameplay.enum.character.status.ACTION
        if(this.actionMode==Gameplay.enum.action.WEAPON_1){
          this.actionMode = Gameplay.enum.action.WEAPON_2
        }else{
          this.actionMode = Gameplay.enum.action.WEAPON_1
        }
      }
    }
    if (this.settings.keys.GRENADE.keyCode == e.keyCode )
    {
      if(this.mode == Gameplay.enum.mode.PLAN){
        this.editorMode = Gameplay.enum.character.status.ACTION
        if(this.actionMode==Gameplay.enum.action.EQUIP_1){
          this.actionMode = Gameplay.enum.action.EQUIP_2
        }else{
          this.actionMode = Gameplay.enum.action.EQUIP_1
        }
      }else{

      }
    }
    if (this.settings.keys.TOGGLE.keyCode == e.keyCode )
    {
      this.actionMode = (this.actionMode+1) % Object.keys(Gameplay.enum.action).length;

    }
    if (this.settings.keys.CAMP.keyCode == e.keyCode )
    {
      if(this.mode == Gameplay.enum.mode.PLAN){
        this.editorMode = Gameplay.enum.character.status.CAMP
      }
    }
    if (this.settings.keys.RELOAD.keyCode == e.keyCode )
    {
      if(this.mode == Gameplay.enum.mode.PLAN){
        this.editorMode = Gameplay.enum.character.status.RELOAD
      }
    }
    if (this.settings.keys.FACTION_CHAT.keyCode == e.keyCode )
    {

    }
    if (this.settings.keys.PUBLIC_CHAT.keyCode == e.keyCode )
    {
      this.testExecute=!this.testExecute
      if(this.testExecute){
        this.gameTimer.resume()
      }else{
        this.gameTimer.pause()
      }
    }
    if (this.settings.keys.CHARACTER1.keyCode == e.keyCode )
    {
      this.changeCharacter(0)
    }
    if (this.settings.keys.CHARACTER2.keyCode == e.keyCode )
    {
      this.changeCharacter(1)
    }
    if (this.settings.keys.CHARACTER3.keyCode == e.keyCode )
    {
      this.changeCharacter(2)
    }
    if (this.settings.keys.CHARACTER4.keyCode == e.keyCode )
    {
      this.changeCharacter(3)
    }
    if (this.settings.keys.CHARACTER5.keyCode == e.keyCode )
    {
      this.changeCharacter(4)
    }
    if (this.settings.keys.CHARACTER6.keyCode == e.keyCode )
    {
      this.changeCharacter(5)
    }
    if (this.settings.keys.CHARACTER7.keyCode == e.keyCode )
    {
      this.changeCharacter(6)
    }
    if (this.settings.keys.CHARACTER8.keyCode == e.keyCode )
    {
      this.changeCharacter(7)
    }
    if (this.settings.keys.CHARACTER9.keyCode == e.keyCode )
    {
      this.changeCharacter(8)
    }
  },
  changeCharacter: function(id) {
      if(id < this.mySquad.characters.length){
        for (var i = 0; i < this.mySquad.characters.length; i++) {
          if(this.mySquad.characters[i].mySquadID == id){
            if(this.mySquad.characters[i].alive){
              this.selectedObject = this.mySquad.characters[i];
              //call changeFollow twice so that the camera follows the new character on change
              this.changeFollow()
              this.changeFollow()
            }
          }
        }
      }
  },
  changeMode: function (){
      if(this.gameplay.mode == Gameplay.enum.mode.HYBRID){
        this.mode=!this.mode;
        this.gui.dirty = true;
      }
  },
  reload:function(){

  },
  editorCamp:function(){

  },
  editorCancel:function(){

  },
  editorInteract:function(){

  },
  editorAction:function(){

  },
  editorSignal:function(){

  },
  changeFollow: function (){
    this.follow=!this.follow;
      if(!this.follow){
        this.game.camera.unfollow()
      }else{
        if(this.selectedObject){
          this.game.camera.follow(this.selectedObject.body, Phaser.Camera.FOLLOW_LOCKON, this.settings.CAMERA_CATCH_UP, this.settings.CAMERA_CATCH_UP);
        }
      }
      this.gui.dirty = true;
  },
  changeHide: function (){
    if(this.hide){
      this.tweenGUION.start()
    }else{
      this.tweenGUIOFF.start()
    }
    this.hide = !this.hide;
  },
  loadSettings: function() {
      this.settings = Settings(this.game);
  },
  setUpPlugins: function(){
    game = this.game;
    if(this.settings.LIGHTING){
      this.game.plugins.add(Phaser.Plugin.PhaserIlluminated);
    }
    this.pathfinder = this.game.plugins.add(Phaser.Plugin.PathFinderPlugin);
    game = null;
  },
  setUpCamera: function(){
    this.game.world.setBounds(0, 0, this.map.width, this.map.height);
  },
  setUpCharacters: function(){
    //var data = this.initialData.factions;
    var data  = this.factions;
    d = data;
    //ID of client
    var id    = this.client.get('id');
    this.factions    = [];
    this.characters  = [];
    //Identify myfaction and mysquad
    console.log('setup');
    for(var i = 0; i < data.length; i++){
      var faction = data[i];
      for (var j = 0; j < faction.squads.length; j++) {
        var squad = faction.squads[j];
        console.log(squad.id,id);
        if(squad.id === id){
          squad.mySquad     = true;
          faction.myFaction = true;
          break;
        }
      }
    }

    for(var i = 0; i < data.length; i++){
      var f=new Faction(data[i].name,data[i].squads.length,this.game)
      if(data[i].myFaction){
        f.myFaction = true;
      }
      this.factions.push(f)

      for(var k = 0; k < data[i].squads.length;k++){
        var t = new Squad(data[i].squads[k].name,data[i].squads[k].characters.length,this.game)
        if(data[i].squads[k].mySquad){
          t.mySquad = true
          this.mySquad = t;
        }
        t.faction = f;
        f.squads.push(t)
        for(var j = 0; j < data[i].squads[k].characters.length; j++ ){
          var c = new Character(this.game);
          c.defaultDetails();
          c.calculateStats();
          var bullet = new Bullet();
          bullet.defaultStats();
          var weapon = new Weapon(c, this.game, this.gameTimer, bullet, c.weapons);
          weapon.defaultStats();
          c.weapons[0] = weapon;
          c.weapons[0].equip();
          c.squad    = t;
          if(c.squad.mysquad){
            console.log(c.name);
          }
          c.faction = f;
          t.characters.push(c);
          f.characters.push(c);
          this.characters.push(c);
          t.charactersGroup.add(c.allViewable);


          c.body = this.game.spritebones.addSprite('soldier', 'soldier', 'soldier', 300+j*100, 400+k*100+i*200);
          //want a glow on selected character
          c.body.filters = [this.game.add.filter('Glow')]

          c.allViewable.add(c.body)

          if(this.settings.LIGHTING){
            c.fov = this.game.add.illuminated.lamp(c.body.x, c.body.y,{distance:100});
            c.fov.lamp.roughness = .99
            c.fov.lamp.angle = 135*Math.PI/2
            c.fov.lamp.color = "rgba(255,255,255,0.8)";
            /*
            var x = this.game.rnd.integerInRange(0,255)
            var y = this.game.rnd.integerInRange(0,255)
            var z = this.game.rnd.integerInRange(0,255)
            var d = 'rgba('+x+','+y+','+z+',0.8)'
            c.fov.lamp.color = d;
            */
            c.fov.createLighting(this.opaqueObjects);
            c.fov.refresh()
            c.allViewable.add(c.fov)
          }

          //"rgba(255,255,255,0.8)"
          /*
          c.fov.createLighting(this.opaqueObjects);
          */

          c.physics = this.game.add.sprite(c.body.x, c.body.y, 'soldier_p');
          c.hitbox = new Phaser.Circle(c.body.x, c.body.y, c.physics.width - 6);
          c.physics.p = c; // p is parent, can't use parent coz its taken
          c.physics.anchor.setTo(0.5, 0.5);
          c.physics.alpha = 0;
          this.game.physics.arcade.enable(c.physics);
          c.physics.body.collideWorldBounds = true;
          //c.allViewable.inputEnabled = true
          //c.body.input.priorityID = 3;
          this.physicsGroup.add(c.physics)
          c.body.stop();
          c.spawned = true;
          c.status = Gameplay.enum.character.status.IDLE;
          c.body.lookAngle = 0;
          this.game.physics.enable(c.body)
          if(c.squad.id == this.mySquad.id){
            c.mySquadID = j;
            c.body.mySquadID = j;
            c.body.setAll('inputEnabled', true);
            c.body.setAll('input.priorityID', 3);
            c.body.callAll('events.onInputDown.add', 'events.onInputDown', this.select, this);
            //c.events.onInputDown.add(this.select,this);
            //this.game.physics.enable(this.playerArray[i]);
            //this.playerArray[i].body.collideWorldBounds = true;
          }
          this.charactersGroup.add(c.allViewable)//
        }
        if(t.mySquad){

        }
      }
    }
    for (var i = 0; i < this.factions.length; i++) {
      for (var j = 0; j < this.factions[i].characters.length; j++) {
        if(this.factions[i].characters[j].squad.mySquad || this.factions[i].characters[j].faction.myFaction){
          this.factions[i].characters[j].allViewable.setAll('alpha',1);
        }else {
          if(this.settings.FOG_OF_WAR){
            this.factions[i].characters[j].allViewable.setAll('alpha',0);
          }
        }
      }
    }
  },
  updateGUI:function(){
    this.miniMapBmd.context.clearRect(0,0,this.miniMapBmd.width,this.miniMapBmd.height);
    this.miniMapBmd.ctx.fillStyle = this.settings.MINIMAP_CAMERA_COLOUR;
    this.miniMapBmd.ctx.fillRect(this.camera.position.x/this.world.width*this.miniMapSize,this.camera.position.y/this.world.height*this.miniMapSize,this.game.width/this.world.width*this.miniMapSize,this.game.height/this.world.height*this.miniMapSize);
    var gWmMPS = this.game.width * this.settings.MINIMAP_POINT_SIZE;
    var gHmMPS = this.game.height * this.settings.MINIMAP_POINT_SIZE;
    var mMSbWW = this.miniMapSize / this.world.width;
    var mMSbWH = this.miniMapSize / this.world.height;
    for ( i = 0; i < this.characters.length; i++) {
      if(!this.characters[i].alive){
        continue;
      }
      if(this.characters[i].squad.mySquad){
        var t = this.characters[i].body;
        this.miniMapBmd.ctx.fillStyle = this.settings.MINIMAP_TEAM_COLOUR;
        this.miniMapBmd.ctx.fillRect(t.x * mMSbWW,t.y * mMSbWH, gWmMPS, gHmMPS);
        continue;
      } else if (this.characters[i].faction.myFaction){
        var t = this.characters[i].body;
        this.miniMapBmd.ctx.fillStyle = this.settings.MINIMAP_FACTION_COLOUR;
        this.miniMapBmd.ctx.fillRect(t.x * mMSbWW,t.y * mMSbWH, gWmMPS, gHmMPS);
        continue;
      } else {
        if(this.characters[i].visible || (!this.settings.FOG_OF_WAR)){
          var t = this.characters[i].body;
          this.miniMapBmd.ctx.fillStyle = this.settings.MINIMAP_ENEMY_COLOUR;
          this.miniMapBmd.ctx.fillRect(t.x * mMSbWW,t.y * mMSbWH, gWmMPS, gHmMPS);
        }
      }
    }
    this.miniMapBmd.dirty = true;
    this.graphics.ctx.clearRect(0, 0, this.game.width, this.game.height)
    if(this.selectedObject){
      if(this.selectedObject.type == 'Character'){
        if(this.selectedObject.alive){
          //this.game.debug.geom(this.selectedObject.hitbox,'rgba(0,0,255,0.5)');
          this.waypointDrawer();
        }
      }
      /*
      graphics = this.game.add.graphics(0, 0);
      graphics.beginFill(0xFF33ff);
      graphics.fillalpha = 1
      graphics.drawPolygon(this.selectedObject.fov.points);
      graphics.endFill();
      */
    }
    if(this.gui.dirty){
      this.gui.dirty = false;
    }
  },
  buttonOnMove:function(button, pointer, isOver){
    //set editorMode to move
    if (isOver) {
      //hover brightens...
    }
  },
  init:function(){
    this.zoomScale = 1;
    this.zoomScaleMin = .6;
    this.zoomScaleMax = 2;
    this.zoomScaleIncrement = .01;

    this.app      = arguments[0];
    this.game     = this.app.game;
    this.settings = this.app.settings;
    this.initialData = data;
    this.app.gui.busy = true;
    this.ready    = false;
    this.info     = {};
    if(this.app.gui.state.type == 'multi'){
      this.online = true;
      this.info   = this.app.gui.state;
      //array of ids characters selected 
      var squad   = [];
      for(var i = 0; i < this.app.gui.characters.length; i++){
        if(this.app.gui.characters[i].selected){
          //unselecting it for next time
          this.app.gui.characters[i].selected = false;
          squad.push(Number(this.app.gui.characters[i].id));
        }
      }
      this.squad  = squad;
      this.client = this.app.client;
      this.client.off(this.app.gui.elM);
      delete this.app.gui.elM;
      //this.elM = this.client.on('message', this.messageHandler.bind(this));
      this.acknowledgement = {};
      if(this.info.host == this.client.get('id')){
        this.isServer = true;
      } else {
        this.isServer = false;
      }
      this.updateRate = 15;
      setTimeout(this.messageHandler.bind(this),1);
    } else {
      this.isServer = true;
      this.online = false;
    }
    this.waitForOtherPlayers();
    //enable keyboard input on click
    this.game.input.onDown.add(function(){this.game.input.keyboard.enabled=true;}.bind(this));
  },
  startGame:function(){
    if(this.isServer){
      var message = {
        type: 'g',
        subtype: 'start'
      }
      this.client.addMessage(message);
    }
    this.setUpCharacters();
    this.info.started = true;
  },
  shareGameInfo:function(){
    if(this.isServer){
      var message = {
        type: 'info',
        value: this.info
      }
      this.client.addMessage(message);
    }
  },
  deliverPayload:function(){
    //This is the dynamic content to be loaded all done initially...
    var factions = new Array;
    var squads = new Array;
    for(var i = 0; i < this.info.players.length; i++){
      var player  = this.info.players[i];
      //s for squad
      var s       = {};
      s.id        = player.id;
      s.faction   = player.faction;
      s.commander = player.name;
      s.name      = 'Squad'+(i+1);
      s.characters= new Array;
      for (var j = 0; j < player.squad.length; j++) {
        var character = {};
        character.id  = player.squad[j];
        s.characters.push(character);
      }
      squads.push(s);
    }
    // hard coded max factions as 4 here 
    for (var i = 0; i < 4; i++) {
      var faction     = {};
      faction.name    = 'Faction'+(i+1);
      faction.squads  = new Array;
      factions.push(faction);
    }
    for (var i = 0; i < squads.length; i++) {
      var s = squads[i];
      factions[s.faction - 1].squads.push(s);      
    }
    //details regarding factions
    var detailsRegdFactions = {
      type      : 'factions',
      factions  : factions      
    };

    dynamic.push(detailsRegdFactions);

    if(this.isServer){
      var message = {
        type: 'initial',
        value: dynamic
      }
      this.client.addMessage(message);
      this.handlePayload(dynamic);
    }
  },
  handlePayload:function(data){
    for (var i = 0; i < data.length; i++) {
      switch (data[i].type) {
        case 'dragon':
          this.game.spritebones.loadAssets(data[i].key, data[i].atlas, data[i].image, data[i].skeleton);
          break;
        case 'factions':
          this.factions = data[i].factions;          
          break;
        default:

      }
    }
    this.game.load.start();
  },
  messageHandler:function(event){
    if(this.app.client.rqdata.length > 0) {
      var messagePacket = this.app.client.rqdata.shift();
      var data          = messagePacket.data;
      var id            = messagePacket.id;
      var name          = messagePacket.name;
      switch(data.type){
        case 'chat':

        break;
        //game
        case 'g':
          //server side
          if(this.isServer){
            switch(data.subtype){
              case 'm':
                for (var i = 0; i < this.characters.length; i++) {
                  if(this.characters[i].id == data.value.cid){
                    this.characters[i].moves.push(data.value);
                    var message = {
                      type : 'g',
                      subtype: 'm',
                      value: data.value
                    }
                    this.client.addMessage(message);
                    break;
                  }
                }
              break;
              case 'rm':
                for (var i = 0; i < this.characters.length; i++) {
                  if(this.characters[i].id == data.value.cid){
                    this.characters[i].moves.pop();
                    if(this.characters[i].isCamping){
                      this.characters[i].isCamping = false;
                    }
                    var message = {
                      type : 'g',
                      subtype: 'rm',
                      value: data.value
                    }
                    this.client.addMessage(message);
                    break;
                  }
                }
              break;
              default:
            }
          }
          else {
            //client side
            switch(data.subtype){
              case 'start':
                this.startGame();
              break;
              //update character
              case 'uc':
                for (var i = 0; i < this.characters.length; i++) {
                  if(this.characters[i].id == data.v.cid){
                    this.characters[i][data.k] = data.kv;
                    switch (data.k) {
                      case 'alive':
                        if(data.kv){
                          this.characters[i].physics.body.enable = true;
                        } else {
                          this.characters[i].physics.body.enable = false;
                        }
                        break;
                      default:

                    }
                    break;
                  }
                }
              break;
              case 'm':
                for (var i = 0; i < this.characters.length; i++) {
                  if(this.characters[i].id == data.value.cid){
                    this.characters[i].moves.push(data.value);
                    break;
                  }
                }
              break;
              case 'rm':
                for (var i = 0; i < this.characters.length; i++) {
                  if(this.characters[i].id == data.value.cid){
                    this.characters[i].moves.pop();
                    if(this.characters[i].isCamping){
                      this.characters[i].isCamping = false;
                    }
                    break;
                  }
                }
              break;
              case 'um':
                for (var i = 0; i < this.characters.length; i++) {
                  if(this.characters[i].id == data.value.cid){
                    this.characters[i].moves.unshift(data.value);
                    break;
                  }
                }
              break;
              case 'sm':
                for (var i = 0; i < this.characters.length; i++) {
                  if(this.characters[i].id == data.value.cid){
                    this.characters[i].moves.shift();
                    break;
                  }
                }
              break;
              case 'fm':
                for (var i = 0; i < this.characters.length; i++) {
                  if(this.characters[i].id == data.cid){
                    this.characters[i].moves[0] = data.value;
                    break;
                  }
                }
              break;
              case 'sync':

              break;
              default:
            }
          }
        break;
        //Share game info (regarding players also)
        case 'info':
          if(this.isServer){

          } else {
            this.info = data.value;
          }
        break;
        //initialData
        case 'initial':
          if(this.isServer){

          } else {
            this.handlePayload(data.value);
          }
        break;
        //inform server the game is started and ready to receive intial data and
        //also when all loaded and stuff...
        case 'ready':
          if(this.isServer){
            var message = {
              type: 'ack',
              id: id
            };
            for (var i = 0; i < this.info.players.length; i++) {
              if(this.info.players[i].id == id){
                switch (data.value) {
                  case 's':
                    this.info.players[i].staticLoaded   = true;
                    this.info.players[i].squad          = data.squad;
                    message.value = 's';
                    this.client.addMessage(message);
                    break;
                  case 'd':
                    this.info.players[i].dynamicLoaded  = true;
                    message.value = 'd';
                    this.client.addMessage(message);
                    break;
                  default:

                }
              }
            }
          }
        break;
        //acknowledge by client
        case 'ack':
          if(this.isServer){

          } else {
            if(data.id == this.client.get('id')){
              switch (data.value) {
                case 's':
                  this.acknowledgement.s = true;
                break;
                case 'd':
                  this.acknowledgement.d = true;
                break;
                default:
              }
            }
          }
        break;
        default:
      }
    }
    if(this.app.client.rqdata.length > 0){
      setTimeout(this.messageHandler.bind(this),1);
    } else {
      setTimeout(this.messageHandler.bind(this),1000/this.updateRate);
    }
  },
  staticLoaded:function(){
    //this function is called when map and other static stuff is loaded in multiplayer mode
    //
    if(this.online){

      if(this.isServer){
        this.info.players[0].staticLoaded = true;
        this.acknowledgement.s = true;
        this.info.players[0].squad = this.squad;
      } else {
        if(!this.acknowledgement.s){
          var message = {
            type  : 'ready',
            value : 's',
            squad : this.squad
          }
          this.client.addMessage(message);
          setTimeout(this.staticLoaded.bind(this),100);
        }
      }
    }
  },
  dynamicLoaded:function(){
    //this function is called when map and other static stuff is loaded in multiplayer mode
    //
    if(this.online){
      if(this.isServer){
        this.info.players[0].dynamicLoaded = true;
        this.acknowledgement.d = true;
      } else {
        if(!this.acknowledgement.d){
          var message = {
            type  : 'ready',
            value : 'd'
          }
          this.client.addMessage(message);
          setTimeout(this.dynamicLoaded.bind(this),100);
        }
      }
    }
  },
  waitForOtherPlayers:function(){
    var everyOneIsStaticLoaded = true;
    var everyOneIsDynamicLoaded = true;

    if(this.online){
      if(this.isServer){
        for (var i = 0; i < this.info.players.length; i++) {
          if(this.info.players[i].staticLoaded ){

          } else {
            everyOneIsStaticLoaded = false;
          }
          if(this.info.players[i].dynamicLoaded){

          } else {
            everyOneIsDynamicLoaded = false;
            console.log('Waiting for others to load');
          }
        }
        if(everyOneIsStaticLoaded){
          if(!this.info.staticLoaded){
            this.deliverPayload();
            this.info.staticLoaded = everyOneIsStaticLoaded;
          }
        }
        this.info.dynamicLoaded = everyOneIsDynamicLoaded;
        if(!(this.info.dynamicLoaded && this.info.staticLoaded)){
          setTimeout(this.waitForOtherPlayers.bind(this),100)
        }else{
          this.startGame();
          this.shareGameInfo();
        }
      }else{

      }
    }
  }
};
function Move(){
  this.type   = null; // types none, move, shoot, grenade, camp
  this.x      = null;
  this.y      = null;
  this.lookx  = null;
  this.looky  = null;
  this.ready  = false;
  this.ai     = false; // made by ai
  this.cT     = 0; // createTime
  this.lUT    = 0; // lastUpdateTime
  this.cid    = null;
  this.eid    = null; //enemyid
}

function Shot(game, character, weapon, bullet, x, y, angle) {
  this.game       = game;
  this.character  = character;
  this.weapon     = weapon;
  this.bullet     = bullet;
  this.x          = x;
  this.y          = y;
  this.angle      = angle;
  this.hits       = 0; // initially hit 0 people
}

function Equipment(){
  this.type = 'Equipment'
  this.stats = {}
  this.kind = null
}
Equipment.prototype.defaultStats = function() {
  this.stats.cost = 10;
}

function Message(type, subtype, value){
  this.t  = type || null; // type
  this.s  = subtype || null; // sub type
  this.v  = value || null; // value
}

function Dot(a, b){
  return a.x * b.x + a.y * b.y;
}

function Vec2(x, y){
  this.x = 0 || x;
  this.y = 0 || y;
}

Vec2.prototype.subtract = function(a){
  return new Vec2(this.x - a.x, this.y - a.y);
}

Vec2.prototype.multiply = function(a){
  return new Vec2(this.x * a, this.y * a);
}

// Will be used by next timeline object to remember each state of the progressing game like a keyframe
function Incident() {
  this.character
  this.grenade
  this.bullet
}
//
// want to use this object to remember all moves in the game to allow replay video
function Timeline() {
  this.incidents    = new Array();
  this.initialState = {};
}
//

// Glow shader want to use it over the currently selected player or player which mouse hovers
Phaser.Filter.Glow = function (game) {
    Phaser.Filter.call(this, game);
    this.fragmentSrc = [
        "precision lowp float;",
        "varying vec2 vTextureCoord;",
        "varying vec4 vColor;",
        'uniform sampler2D uSampler;',

        'void main() {',
            'vec4 sum = vec4(0);',
            'vec2 texcoord = vTextureCoord;',
            'for(int xx = -4; xx <= 4; xx++) {',
                'for(int yy = -3; yy <= 3; yy++) {',
                    'float dist = sqrt(float(xx*xx) + float(yy*yy));',
                    'float factor = 0.0;',
                    'if (dist == 0.0) {',
                        'factor = 2.0;',
                    '} else {',
                        'factor = 2.0/abs(float(dist));',
                    '}',
                    'vec4 ;',
                    'sum += texture2D(uSampler, texcoord + vec2(xx, yy) * 0.002) * factor;',
                '}',
            '}',
            'gl_FragColor = sum * 0.009 + texture2D(uSampler, texcoord);',
        '}'
    ];
};

Phaser.Filter.Glow.prototype = Object.create(Phaser.Filter.prototype);
Phaser.Filter.Glow.prototype.constructor = Phaser.Filter.Glow;
