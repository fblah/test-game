//Our appp
var app = {};
(function(){
  var l = function(){
    var scripts = [
      "/lib/css/jquery-ui.css",
      "/bin/css/style.css",
      "/lib/jquery.js",
      "/lib/jquery-ui.js",
      "https://code.createjs.com/preloadjs-0.6.2.min.js",
      "/socket.io/socket.io.js",
      "/lib/peer.min.js",
      "/bin/network/mobius_client.js",
      "/lib/phaser.js",
      "/lib/path.js",
      "/lib/sprite_bones.min.js",

      "/lib/howler.min.js",

      "/bin/game/Character.js",
      "/bin/game/Bullet.js",
      "/bin/game/Weapon.js",
      "/bin/game/Squad.js",
      "/bin/game/Faction.js",
      "/bin/game/Gameplay.js",
      "/bin/game/Language.js",
      "/bin/game/Settings.js",
      "/bin/game/game.js",
      "/bin/game/splash.js",
      "/bin/game/simple.js",
      "/bin/game/menu.js",
      "/bin/game/boot.js",
      "/bin/gui/gui.js",
      "/bin/game/Audio.js",
      "/bin/game/Channel.js",
      "/bin/game/Sound.js"
    ];
    var l = 0;
    var ch=300,cw=1280;
    if(window.innerWidth  < 923){
      cw = 853;
      ch = 480;
    }
    else if(window.innerWidth <1350){
        cw = window.innerWidth  - 70;
        ch = cw / 1.7777777777777777777777777777778;
    }
    var g = document.getElementById('loader');
    g.setAttribute('width',cw);g.setAttribute('height',ch);
    // Define the size and position of indicator
    var progress = 0;
    var res = 0;
    var context = null;
    var initial_x = 50;
    var initial_y = 200/2;
    var total_width = cw - initial_x-10;
    var total_height = 34;
    var radius = total_height/2;

    function load(url,type, callback){
        var file    = null;
        if(type == "js"){
          file      = document.createElement("script")
          file.type = "text/javascript";
          file.src  = url;
        } else if(type == "css") {
          file      = document.createElement("link");
          file.rel  = "stylesheet";
          file.type = "text/css";
          file.href = url;
        }  else {
          throw "Invalid file type";
        }
        file.async  = true;
        if (file.readyState){  //IE
            file.onreadystatechange = function(){
                if (file.readyState == "loaded" ||
                        file.readyState == "complete"){
                    file.onreadystatechange = null;
                    callback();
                }
            };
        } else {  //Others
            file.onload = function(){
              callback();
            };
            file.onerror = function(){
              alert("Error loading files");
            };
        }
        document.getElementsByTagName("head")[0].appendChild(file);
    }

    function draw() {
      // Clear the layer
      context.clearRect(initial_x-5,initial_y-5,total_width+15,total_height+15);
      progressLayerRect(context, initial_x, initial_y, total_width, total_height, radius);
      progressBarRect(context, initial_x, initial_y, progress, total_height, radius, total_width);
      progressText(context, initial_x, initial_y, progress, total_height, radius, total_width );
      // stop the animation when it reaches 100%
      if (progress>=total_width) {
          var elem = document.getElementById('loader');
          elem.parentNode.removeChild(elem);
      }
    }

    function loader(){
      // Get the canvas element
      var elem = document.getElementById('loader');
      // Check the canvas support with the help of browser
      if (!elem || !elem.getContext) {
        return;
      }
      context = elem.getContext('2d');
      if (!context) {
        return;
      }
      // Text’s font of the progress
      context.font = "16px Verdana";
      // Gradient of the progress
      var progress_lingrad = context.createLinearGradient(0,initial_y+total_height,0,0);
      progress_lingrad.addColorStop(0, '#000000');
      progress_lingrad.addColorStop(0.4, '#ce4b37');
      progress_lingrad.addColorStop(1, '#FFFFFF');
      context.fillStyle = progress_lingrad;
    }

    function roundRect(ctx, x, y, width, height, radius) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.arc(x+width-radius, y+radius, radius, -Math.PI/2, Math.PI/2, false);
        ctx.lineTo(x + radius, y + height);
        ctx.arc(x+radius, y+radius, radius, Math.PI/2, 3*Math.PI/2, false);
        ctx.closePath();
        ctx.fill();
    }

    function progressLayerRect(ctx, x, y, width, height, radius) {
        ctx.save();
        // Set shadows to make some depth
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        ctx.shadowBlur = 5;
        ctx.shadowColor = '#666';
         // Create initial grey layer
        ctx.fillStyle = 'rgba(189,189,189,1)';
        roundRect(ctx, x, y, width, height, radius);
        // Overlay with gradient
        ctx.shadowColor = 'rgba(0,0,0,0)'
        var lingrad = ctx.createLinearGradient(0,y+height,0,0);
        lingrad.addColorStop(0, 'rgba(255,255,255, 0.1)');
        lingrad.addColorStop(0.4, 'rgba(255,255,255, 0.7)');
        lingrad.addColorStop(1, 'rgba(255,255,255,0.4)');
        ctx.fillStyle = lingrad;
        roundRect(ctx, x, y, width, height, radius);
        ctx.fillStyle = 'white';
        ctx.restore();
    }

    function progressBarRect(ctx, x, y, width, height, radius, max) {
        // var to store offset for proper filling when inside rounded area
        var offset = 0;
        ctx.beginPath();
        if (width<radius) {
            offset = radius - Math.sqrt(Math.pow(radius,2)-Math.pow((radius-width),2));
            ctx.moveTo(x + width, y+offset);
            ctx.lineTo(x + width, y+height-offset);
            ctx.arc(x + radius, y + radius, radius, Math.PI - Math.acos((radius - width) / radius), Math.PI + Math.acos((radius - width) / radius), false);
        }
        else if (width+radius>max) {
            offset = radius - Math.sqrt(Math.pow(radius,2)-Math.pow((radius - (max-width)),2));
            ctx.moveTo(x + radius, y);
            ctx.lineTo(x + width, y);
            ctx.arc(x+max-radius, y + radius, radius, -Math.PI/2, -Math.acos((radius - (max-width)) / radius), false);
            ctx.lineTo(x + width, y+height-offset);
            ctx.arc(x+max-radius, y + radius, radius, Math.acos((radius - (max-width)) / radius), Math.PI/2, false);
            ctx.lineTo(x + radius, y + height);
            ctx.arc(x+radius, y+radius, radius, Math.PI/2, 3*Math.PI/2, false);
        }
        else {
            ctx.moveTo(x + radius, y);
            ctx.lineTo(x + width, y);
            ctx.lineTo(x + width, y + height);
            ctx.lineTo(x + radius, y + height);
            ctx.arc(x+radius, y+radius, radius, Math.PI/2, 3*Math.PI/2, false);
        }
        ctx.closePath();
        ctx.fill();
        // draw progress bar right border shadow
        if (width<max-1) {
            ctx.save();
            ctx.shadowOffsetX = 1;
            ctx.shadowBlur = 1;
            ctx.shadowColor = '#666';
            if (width+radius>max)
              offset = offset+1;
            ctx.fillRect(x+width,y+offset,1,total_height-offset*2);
            ctx.restore();
        }
    }

    function progressText(ctx, x, y, width, height, radius, max) {
        ctx.save();
        ctx.fillStyle = 'white';
        var text = Math.floor(width/max*100)+"%";
        var text_width = ctx.measureText(text).width;
        var text_x = x+width-text_width-radius/2;
        if (width<=radius+text_width) {
            text_x = x+radius/2;
        }
        ctx.fillText(text, text_x, y+22);
        ctx.restore();
    }
    function init(){
      loader();
      if(l < scripts.length){
        var s = scripts[l++];
        var t = s.substr(s.length - 3);
        if(t == '.js'){
          load(s, 'js', init);
        }else if(t == 'css'){
          load(s, 'css', init);
        }
        progress = (l)/scripts.length*total_width;
        draw();
      }else{
        //var app;
        app = new Simple();
        if(window.Worker&false){
          app.client = new Worker("/bin/network/mobius_client.js");
          app.client.onmessage = function(e) {
        		console.log('Message received from worker ' + e.data);
        	};
        }else{
          app.localStorage = localStorage;
          app.client = mobius_client();
          app.game = new Phaser.Game(1600, 900, Phaser.WEBGL, 'game');
          app.gui  = new GUI(app);
          app.audio= new Audio(app);

          app.client.connect();

          app.game.state.add('Boot', Boot);
          app.game.state.add('Splash', Splash);
          app.game.state.add('Game', Game);
          app.game.state.add('Menu', Menu);

          //Boot = Splash = Menu = Game = null
          app.game.state.start('Boot',true,false,app);
        }
        //app.client.postMessage(['client.connect()']);
        app.serverList = [];
      }
    }
    init();
  }
  l();
})()
