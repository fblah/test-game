var Boot = {};

Boot = {
    init: function () {
      this.app      = arguments[0];
      this.game     = this.app.game;
      this.client   = this.app.client
      this.localStorage = this.app.localStorage;
      this.settings = this.app.settings;

    },
    preload: function () {
      this.stage.disableVisibilityChange = true;
      this.game.scale.pageAlignHorizontally=true;
      this.game.scale.pageAlignVertically=true;
      this.game.scale.forceOrientation(true, false);
      this.game.scale.updateLayout(true);
      this.game.stage.backgroundColor = "rgb(255, 196, 19)";
      this.game.load.onLoadStart.add(this.ls, this);
      this.game.load.onFileComplete.add(this.fc, this);
      this.game.load.onLoadComplete.add(this.lc, this);
    },

    create: function () {
      this.app.settings                   = new Settings(this.app.game);
      this.game.scale.scaleMode           = Phaser.ScaleManager.SHOW_ALL;
      this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
      this.game.load.image('splash','/assets/gfx/splash/dudenstein.png');
      this.game.load.start();
    },

    ls: function () {
    },

    fc: function (progress, cacheKey, success, totalLoaded, totalFiles) {
    },

    lc: function () {
      this.game.load.onLoadStart.removeAll(this);
      this.game.load.onFileComplete.removeAll(this);
      this.game.load.onLoadComplete.removeAll(this);
      this.game.state.start('Splash',true,false,this.app);
    }
};
