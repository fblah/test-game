var Menu = {};

Menu = {
    init: function () {
      this.app      = arguments[0];
      this.game     = this.app.game;
      this.client   = this.app.client
      this.localStorage = this.app.localStorage;
      this.settings = this.app.settings;
    },
    preload: function () {
      this.game.stage.backgroundColor = 0;
    },
    create: function () {
      this.scale.scaleMode=Phaser.ScaleManager.SHOW_ALL;
      this.scale.pageAlignHorizontally=true;
      this.scale.pageAlignVertically=true;
      this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
      this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
      this.game.input.keyboard.onUpCallback = this.handlerInputOnUp.bind(this);
      this.counter = 0;
      this.bg = []
      for (var i = 0; i < this.app.resources.menu.length; i++) {
        var s = this.game.add.sprite(0, 0, this.app.resources.menu[i])
        s.alpha = 0;
        s.anchor.setTo(0.5,0.5)
        s.x = this.game.world.centerX;
        s.y = this.game.world.centerY;
        this.bg.push(s);
      }
      this.tween =  this.game.add.tween(this.bg[this.counter]).to( { alpha: 1, x: this.game.rnd.integerInRange(this.game.world.centerX-100,this.game.world.centerX+100), y: this.game.rnd.integerInRange(this.game.world.centerY-100,this.game.world.centerY+100)}, 5000, Phaser.Easing.Cubic.Out, true);
      this.tween.onComplete.add(this.disappear, this);
      this.app.gui.openMain();
      this.game.input.onDown.add(function(){this.game.input.keyboard.enabled=true;this.app.gui.openMain()}.bind(this));
    },
    disappear: function () {
      this.tween =  this.game.add.tween(this.bg[this.counter]).to( { alpha: 0, x: this.game.rnd.integerInRange(this.game.world.centerX-100,this.game.world.centerX+100), y: this.game.rnd.integerInRange(this.game.world.centerY-100,this.game.world.centerY+100) }, 5000, Phaser.Easing.Cubic.In, true);
      this.tween.onComplete.add(this.appear, this);
    },
    appear: function () {
      this.counter = (this.counter + 1) % this.app.resources.menu.length;
      this.bg[this.counter].x = this.game.world.centerX;
      this.bg[this.counter].y = this.game.world.centerY;
      this.tween =  this.game.add.tween(this.bg[this.counter]).to( { alpha: 1, x: this.game.rnd.integerInRange(this.game.world.centerX-100,this.game.world.centerX+100), y: this.game.rnd.integerInRange(this.game.world.centerY-100,this.game.world.centerY+100) }, 5000, Phaser.Easing.Cubic.Out, true);
      this.tween.onComplete.add(this.disappear, this);
    },
    update: function () {
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
    handlerInputOnUp: function(e) {
      if (this.settings.keys.FULLSCREEN.keyCode == e.keyCode )
      {
        this.fullscreen();
      }
    }
};

Menu.resources = {
  images_menu:[
    '/assets/gfx/menu/1.jpg',
    '/assets/gfx/menu/2.jpg',
    '/assets/gfx/menu/3.jpg',
    '/assets/gfx/menu/4.jpg',
    '/assets/gfx/menu/5.jpg',
    '/assets/gfx/menu/6.jpg',
    '/assets/gfx/menu/7.jpg',
    '/assets/gfx/menu/8.jpg',
    '/assets/gfx/menu/4.png'
  ]
}
