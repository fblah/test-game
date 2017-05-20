// Settings object to store all the game settings and constants take it to another file later
function Settings(game) {
  this.game = game;
  this.enum = {}
  this.enum.graphicsSettings = {
    LOW     : 0,
    MEDIUM  : 1,
    HIGH    : 2,
    CUSTOM  : 3
  };
  this.enum.languages = Language.enum.languages;
  this.defaultKeys = {
    CHARACTER_UP  : Phaser.Keyboard.W,
    CHARACTER_DOWN: Phaser.Keyboard.S,
    CHARACTER_LEFT: Phaser.Keyboard.A,
    CHARACTER_RIGHT: Phaser.Keyboard.D,
    CAMERA_UP     : Phaser.Keyboard.W,
    CAMERA_DOWN   : Phaser.Keyboard.S,
    CAMERA_LEFT   : Phaser.Keyboard.A,
    CAMERA_RIGHT  : Phaser.Keyboard.D,
    GAMEPLAY_MODE : Phaser.Keyboard.M,
    MOVE          : Phaser.Keyboard.Q,
    CANCEL        : Phaser.Keyboard.X,
    SIGNAL        : Phaser.Keyboard.Z,
    FOLLOW_CHARACTER : Phaser.Keyboard.CAPS_LOCK,
    INTERACT      : Phaser.Keyboard.E,
    ACTION        : Phaser.Keyboard.F,
    GRENADE       : Phaser.Keyboard.G,
    HIDE          : Phaser.Keyboard.SPACEBAR,
    TOGGLE        : Phaser.Keyboard.V,
    CAMP          : Phaser.Keyboard.C,
    RELOAD        : Phaser.Keyboard.R,
    CHARACTER1    : Phaser.Keyboard.ONE,
    CHARACTER2    : Phaser.Keyboard.TWO,
    CHARACTER3    : Phaser.Keyboard.THREE,
    CHARACTER4    : Phaser.Keyboard.FOUR,
    CHARACTER5    : Phaser.Keyboard.FIVE,
    CHARACTER6    : Phaser.Keyboard.SIX,
    CHARACTER7    : Phaser.Keyboard.SEVEN,
    CHARACTER8    : Phaser.Keyboard.EIGHT,
    CHARACTER9    : Phaser.Keyboard.NINE,
    FACTION_CHAT  : Phaser.Keyboard.U,
    PUBLIC_CHAT   : Phaser.Keyboard.Y,
    FULLSCREEN    : Phaser.Keyboard.O
  }
  this.keysConfig = this.defaultKeys;
  this.keys = {
    CHARACTER_UP  : this.game.input.keyboard.addKey(this.keysConfig.CHARACTER_UP),
    CHARACTER_DOWN: this.game.input.keyboard.addKey(this.keysConfig.CHARACTER_DOWN),
    CHARACTER_LEFT: this.game.input.keyboard.addKey(this.keysConfig.CHARACTER_LEFT),
    CHARACTER_RIGHT: this.game.input.keyboard.addKey(this.keysConfig.CHARACTER_RIGHT),
    CAMERA_UP     : this.game.input.keyboard.addKey(this.keysConfig.CAMERA_UP),
    CAMERA_DOWN   : this.game.input.keyboard.addKey(this.keysConfig.CAMERA_DOWN),
    CAMERA_LEFT   : this.game.input.keyboard.addKey(this.keysConfig.CAMERA_LEFT),
    CAMERA_RIGHT  : this.game.input.keyboard.addKey(this.keysConfig.CAMERA_RIGHT),
    MODE          : this.game.input.keyboard.addKey(this.keysConfig.MODE),
    MOVE          : this.game.input.keyboard.addKey(this.keysConfig.MOVE),
    CANCEL        : this.game.input.keyboard.addKey(this.keysConfig.CANCEL),
    SIGNAL        : this.game.input.keyboard.addKey(this.keysConfig.SIGNAL),
    FOLLOW_CHARACTER : this.game.input.keyboard.addKey(this.keysConfig.FOLLOW_CHARACTER),
    INTERACT      : this.game.input.keyboard.addKey(this.keysConfig.INTERACT),
    ACTION        : this.game.input.keyboard.addKey(this.keysConfig.ACTION),
    GRENADE       : this.game.input.keyboard.addKey(this.keysConfig.GRENADE),
    HIDE          : this.game.input.keyboard.addKey(this.keysConfig.HIDE),
    TOGGLE        : this.game.input.keyboard.addKey(this.keysConfig.TOGGLE),
    CAMP          : this.game.input.keyboard.addKey(this.keysConfig.CAMP),
    RELOAD        : this.game.input.keyboard.addKey(this.keysConfig.RELOAD),
    CHARACTER1    : this.game.input.keyboard.addKey(this.keysConfig.CHARACTER1),
    CHARACTER2    : this.game.input.keyboard.addKey(this.keysConfig.CHARACTER2),
    CHARACTER3    : this.game.input.keyboard.addKey(this.keysConfig.CHARACTER3),
    CHARACTER4    : this.game.input.keyboard.addKey(this.keysConfig.CHARACTER4),
    CHARACTER5    : this.game.input.keyboard.addKey(this.keysConfig.CHARACTER5),
    CHARACTER6    : this.game.input.keyboard.addKey(this.keysConfig.CHARACTER6),
    CHARACTER7    : this.game.input.keyboard.addKey(this.keysConfig.CHARACTER7),
    CHARACTER8    : this.game.input.keyboard.addKey(this.keysConfig.CHARACTER8),
    CHARACTER9    : this.game.input.keyboard.addKey(this.keysConfig.CHARACTER9),
    FACTION_CHAT  : this.game.input.keyboard.addKey(this.keysConfig.FACTION_CHAT),
    PUBLIC_CHAT   : this.game.input.keyboard.addKey(this.keysConfig.PUBLIC_CHAT),
    FULLSCREEN    : this.game.input.keyboard.addKey(this.keysConfig.FULLSCREEN)
  }
  this.defaultSettings = {
    ASPECT_RATIO      : 1.777778,
    FOG_OF_WAR        : true,
    FOG               : false,
    LIGHTING          : false,
    GAMEPLAY_MODE     : Gameplay.enum.mode.HYBRID,
    GRAPHICS_SETTINGS : this.enum.graphicsSettings.HIGH,
    LANGUAGE          : this.enum.languages.EN,
    FOG_COLOR         : "rgba(33,33,33,0.3)",
    MINIMAP_SIZE      : .15,//% of screen
    MINIMAP_ALPHA     : .5,
    MINIMAP_CAMERA_COLOUR : 'rgba(255,0,0,0.4)',
    MINIMAP_TEAM_COLOUR : 'rgba(0,0,255,1)',
    MINIMAP_ENEMY_COLOUR : 'rgba(255,0,0,1)',
    MINIMAP_FACTION_COLOUR : 'rgba(0,255,0,1)',
    MINIMAP_HOSTAGE_COLOUR : 'rgba(255,255,0,1)',
    INTERACTIVE_MINIMAP : true,
    PLAN_TIME           : 120,
    EXECUTION_TIME      : 180,
    TOTAL_TIME          : 600,
    CAMERA_CATCH_UP     : .1//time for camera to catch up smaller is longer
  }
  this.ASPECT_RATIO   = 1.777778; // ONLY 16:9 SUPPORTED w/h
  this.FOG_OF_WAR     = true;
  this.FOG            = true;//Not fog of war yet just fog...
  this.LIGHTING       = false;
  this.GAMEPLAY_MODE  = Gameplay.enum.mode.HYBRID;
  this.LANGUAGE       = this.enum.languages.EN;
  this.GRAPHICS_SETTINGS = this.enum.graphicsSettings.HIGH;
  this.FOG_COLOR      = "rgba(33,33,33,0.3)";
  this.MINIMAP_SIZE   = .15;
  this.MINIMAP_POINT_SIZE = .002;
  this.MINIMAP_ALPHA  = .5;
  this.MINIMAP_CAMERA_COLOUR = 'rgba(255,0,0,0.4)';
  this.MINIMAP_TEAM_COLOUR = 'rgba(0,0,255,1)';
  this.MINIMAP_ENEMY_COLOUR = 'rgba(255,0,0,1)';
  this.MINIMAP_FACTION_COLOUR = 'rgba(0,255,0,1)';
  this.MINIMAP_HOSTAGE_COLOUR = 'rgba(255,255,0,1)';
  this.graphicsSettings = {};
  this.INTERACTIVE_MINIMAP = true;
  this.PLAN_TIME      = 120;
  this.EXECUTION_TIME = 180;
  this.TOTAL_TIME     = 600;
  this.CAMERA_CATCH_UP= .1;

  this.graphicsSettings[this.enum.graphicsSettings.HIGH] = {}
  this.graphicsSettings[this.enum.graphicsSettings.MEDIUM] = {}
  this.graphicsSettings[this.enum.graphicsSettings.LOW] = {}
  this.graphicsSettings[this.enum.graphicsSettings.CUSTOM] = {}
}
