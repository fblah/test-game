var Splash = {};

Splash = {
    init: function () {
      this.app      = arguments[0];
      this.game     = this.app.game;
      this.client   = this.app.client
      this.localStorage = this.app.localStorage;
      this.settings = this.app.settings;
    },
    preload: function () {
      this.time = app.game.time.now;
      this.startTime = Number(app.game.time.now);

      this.game.load.onLoadComplete.add(this.loadComplete, this);
      this.splash   = this.game.add.sprite(0, 0, 'splash');
      this.splash.alpha = 0;
      this.splash.anchor.setTo(0.5, 0.5);
      this.splash.x = this.game.world.centerX;
      this.splash.y = this.game.world.centerY;
      var scale = 2560/this.game.width;
      this.splash.scale.setTo(1/scale, 1/scale);

      this.textColor = 'rgb(191, 57, 34)';
      this.bgColorComponents = "rgb(255, 196, 19)".split(',');
      for (var i = 0; i < this.bgColorComponents.length; i++) {
        this.bgColorComponents[i] = this.bgColorComponents[i].replace(/[^0-9.]/g, "");
      }
      this.text = this.game.add.text(this.game.width/2, this.game.height*.97, '', { fill: this.textColor });
      this.text.alpha = 0;
      //this.    = this.game.add.sprite(game.world.centerX, game.world.centerY, 'dudenstein');
      this.stage.disableVisibilityChange = true;
      this.game.scale.pageAlignHorizontally=true;
      this.game.scale.pageAlignVertically=true;
      this.game.scale.forceOrientation(true, false);
      this.game.scale.updateLayout(true);
    },

    create: function () {
      this.game.input.onDown.add(function(){this.game.input.keyboard.enabled=true;}.bind(this));
      this.game.load.onLoadStart.add(this.loadStart, this);
      this.game.load.onFileComplete.add(this.fileComplete, this);
      this.game.load.onLoadComplete.add(this.loadComplete, this);
      this.game.input.keyboard.onUpCallback = this.handlerInputOnUp.bind(this);
      this.game.scale.scaleMode           = Phaser.ScaleManager.SHOW_ALL;
      this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
      this.app.resources = {};
      this.app.resources.menu = [];
      for (var i = 0; i < Menu.resources.images_menu.length; i++) {
        this.app.resources.menu.push('menu'+i);
        this.game.load.image('menu'+i,Menu.resources.images_menu[i]);
      }
      this.game.load.start();
    },

    bg: function () {
      if(this.endTime){
        var color = new Array(3);
        var alpha = 1;
        for (var i = 0; i < this.bgColorComponents.length; i++) {
          var d     = (this.time - this.endTime)/2000;
          alpha    -= alpha*d;
          color[i]  = this.bgColorComponents[i] - (this.bgColorComponents[i] * d);
        }
        this.game.stage.backgroundColor = Phaser.Color.getColor(color[0],color[1],color[2]);
        this.text.alpha   = alpha;
        this.splash.alpha = alpha;
        if(this.time - this.endTime > 2000){
          this.game.state.start('Menu',true,false,this.app);
        }
      }
    },
    loadStart: function () {

    },

    fileComplete: function (progress, cacheKey, success, totalLoaded, totalFiles) {
      this.text.setText(progress + "%");
    },

    loadComplete: function () {
      this.game.load.onLoadStart.removeAll(this);
      this.game.load.onFileComplete.removeAll(this);
      this.game.load.onLoadComplete.removeAll(this);
      this.complete = true;
      this.game.state.start('Menu',true,false,this.app);
    },

    update: function () {
      this.time = this.game.time.now;
      if(this.time - this.startTime > 5000){
        if(this.time - this.startTime > 7000){
          this.bg();
          if(this.complete){
            if(!this.endTime){
              this.endTime = this.time;
            }
          }
        } else {
          var alpha = (this.time - this.startTime + 5000)/2000;
          this.text.alpha = alpha;
        }
      } else {
        var alpha = (this.time - this.startTime)/5000;
        this.splash.alpha = alpha;
      }
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
