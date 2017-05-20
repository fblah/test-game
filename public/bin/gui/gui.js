var GUI = {};

GUI = function(app){
    this.app = app;

    //Random names used when player names are identical
    this.names = [
      'DustR3m0ver2000',
      'BrooOAAAOoaoH',
      '1D10t',
      'm30Ws1r',
      'C0mmand3r'
    ]

    //The state for the new game which will be shared with everone by the host when the game is started
    this.state  = {}; // maintained by host

    //Various parts of the main menu
    this.main     =  document.getElementById("main");
    this.single   =  document.getElementById("single");
    this.multi    =  document.getElementById("multi");
    this.settings =  document.getElementById("settings");
    this.help     =  document.getElementById("help");
    this.join     =  document.getElementById("join");
    this.room     =  document.getElementById("room");
    this.credits  =  document.getElementById("credits");

    //IS GUI busy
    this.busy     = false;
    //Characters for simple multiplayer
    this.characters = null;

    //Initially set the main part of main menu to block or visible and others as invisible or none
    this.main.style.display      = "block";
    this.single.style.display    = "none";
    this.multi.style.display     = "none";
    this.settings.style.display  = "none";
    this.help.style.display      = "none";
    this.join.style.display      = "none";
    this.room.style.display      = "none";
    this.credits.style.display   = "none";

    // Button b Single S Player P
    $( "#bSP" ).click(function() {
      this.main.style.display      = "none";
      this.single.style.display    = "block";
    }.bind(this));

    // Button b Multi M Player P
    $( "#bMP" ).click(function() {
      this.main.style.display      = "none";
      this.multi.style.display     = "block";
      this.app.client.goOnline();
      this.updateMapList();
      this.updateCharList();
    }.bind(this));

    $( "#bSet" ).click(function() {
      this.main.style.display      = "none";
      this.settings.style.display  = "block";
    }.bind(this));

    $( "#bHelp" ).click(function() {
      this.main.style.display      = "none";
      this.help.style.display      = "block";
    }.bind(this));

    $( "#bCre" ).click(function() {
      this.main.style.display      = "none";
      this.credits.style.display   = "block";
    }.bind(this));

    $( "#bSNG" ).click(function() {

    }.bind(this));

    $( "#bSLG" ).click(function() {

    }.bind(this));

    $( "#bSB" ).click(function() {
      this.main.style.display      = "block";
      this.single.style.display    = "none";
    }.bind(this));

    $( "#bMJ" ).click(function() {
      var textArea = document.getElementById('chatArea');
      textArea.innerHTML = "";
      $('#readyToPlay').attr('checked', false);
      this.join.style.display      = "block";
      this.multi.style.display    = "none";
    }.bind(this));

    $( "#bJB" ).click(function() {
      this.join.style.display      = "none";
      this.multi.style.display    = "block";
    }.bind(this));

    $( "#bJR" ).click(function() {
      this.app.client.request('server-list');
    }.bind(this));

    //When a new room is created clear the state and create a new one...
    $( "#bMC" ).click(function() {
      var textArea = document.getElementById('chatArea');
      textArea.innerHTML = "";
      $('#readyToPlay').attr('checked', false);
      $("#roomDetails input").prop("disabled", false);
      this.room.style.display     = "block";
      //Make the client HOST state
      this.app.client.updateStatus(this.app.client.enumerations.userStatus.Host);
      this.state                  = {};
      //store the hostname in the state
      this.state.host             = this.app.client.get('id');
      //store all the players in the state
      this.state.players          = [];
      //is the state ready to start
      this.state.ready            = false;
      this.updatePlayerList();
      this.multi.style.display    = "none";
    }.bind(this));

    // Button b Multi M Manual M Connection C
    $( "#bMMC" ).click(function() {
      this.room.style.display = "block";
      this.join.style.display = "none";
      this.multi.style.display    = "none";
      $("#roomDetails input").prop("disabled", true);
      $('#readyToPlay').attr('checked', false);
      this.app.client.connectToPeer($('#connectToID').val());
      $('#connectToID').val('');
    }.bind(this));

    //When online players are Available and once they join a room they become InGame
    $( "#bCB" ).click(function() {
      $('#readyToPlay').attr('checked', false);
      if(this.app.client.isServer){
        this.state.players[0].ready = false;
        this.updatePlayerList();
      }
      this.room.style.display     = "none";
      this.multi.style.display    = "block";
      this.app.client.disconnectAllPeers();
      if(this.app.client.isOnline()){
        this.app.client.updateStatus(this.app.client.enumerations.userStatus.Available);
      } else {
        this.app.client.updateStatus(this.app.client.enumerations.userStatus.Connected);
      }
    }.bind(this));

    //Leaving multi players makes you go offline
    $( "#bMB" ).click(function() {
      this.main.style.display      = "block";
      this.multi.style.display     = "none";
      this.app.client.goOffline();
    }.bind(this));

    $( "#bSetB" ).click(function() {
      this.main.style.display      = "block";
      this.settings.style.display  = "none";
    }.bind(this));

    $( "#bHB" ).click(function() {
      this.main.style.display      = "block";
      this.help.style.display      = "none";
    }.bind(this));

    $( "#bCreB" ).click(function() {
      this.main.style.display      = "block";
      this.credits.style.display   = "none";
    }.bind(this));

    //Close the main menu with escape key
    $( "#mainMenu" ).dialog({
      closeOnEscape: false
    });
    //Disable game keyboard input when the main menu is focused
    $( "#mainMenu" ).click(function() {
      this.app.game.input.keyboard.enabled = false;
    }.bind(this));

    $( "#mainMenu" ).dialog("close");
    $( "#mainMenu" ).dialog( "option", "maxHeight", 800 );
    $( "#mainMenu" ).dialog( "option", "maxWidth", 1200 );
    $( "#mainMenu" ).dialog( "option", "minHeight", 500 );
    $( "#mainMenu" ).dialog( "option", "minWidth", 820 );
    $( "#mainMenu" ).dialog( "option", "show", { effect: "fade", duration: 1000 } );
    $( "#mainMenu" ).dialog( "option", "hide", { effect: "fade", duration: 1000 } );
    this.openMain = function(){
        $( "#mainMenu" ).dialog( "open" );
    }
    this.closeMain= function(){
        $( "#mainMenu" ).dialog( "close" );
    }

    $( "#pauseMenu" ).dialog({
      closeOnEscape: false
    });
    $( "#pauseMenu" ).click(function() {
      this.app.game.input.keyboard.enabled = false;
    }.bind(this));
    $( "#pauseMenu" ).dialog("close");
    $( "#pauseMenu" ).dialog( "option", "maxHeight", 800 );
    $( "#pauseMenu" ).dialog( "option", "maxWidth", 1200 );
    $( "#pauseMenu" ).dialog( "option", "minHeight", 500 );
    $( "#pauseMenu" ).dialog( "option", "minWidth", 820 );
    $( "#pauseMenu" ).dialog( "option", "show", { effect: "fade", duration: 1000 } );
    $( "#pauseMenu" ).dialog( "option", "hide", { effect: "fade", duration: 1000 } );
    this.openPause = function(){
        $( "#pauseMenu" ).dialog( "open" );
    }
    this.closePause= function(){
        $( "#pauseMenu" ).dialog( "close" );
    }

    $( "#endMenu" ).dialog({
      closeOnEscape: false
    });
    $( "#endMenu" ).click(function() {
      this.app.game.input.keyboard.enabled = false;
    }.bind(this));
    $( "#endMenu" ).dialog("close");
    $( "#endMenu" ).dialog( "option", "maxHeight", 800 );
    $( "#endMenu" ).dialog( "option", "maxWidth", 1200 );
    $( "#endMenu" ).dialog( "option", "minHeight", 500 );
    $( "#endMenu" ).dialog( "option", "minWidth", 820 );
    $( "#endMenu" ).dialog( "option", "show", { effect: "fade", duration: 1000 } );
    $( "#endMenu" ).dialog( "option", "hide", { effect: "fade", duration: 1000 } );
    this.openEnd = function(){
        $( "#endMenu" ).dialog( "open" );
    }
    this.closeEnd= function(){
        $( "#endMenu" ).dialog( "close" );
    }

    //Click listener for each room listed in server list so that when clicked it connects
    $('#server-list').on('click', 'li', {gui: this}, function (event) {
        event.data.gui.room.style.display = "block";
        event.data.gui.join.style.display = "none";
        $("#roomDetails input").prop("disabled", true);
        $('#readyToPlay').attr('checked', false);
        event.data.gui.app.client.connectToPeer(this.childNodes[0].innerHTML);
    });

    //Chat button in the room
    $('#bChat').click(function() {
      var text = $.trim($('#chatMessage').val());
      text = text.replace(/</g, "&lt;").replace(/>/g, "&gt;");

      if(text == ""){
        return;
      }
      $('#chatMessage').val('');
      var message = {
        type:'chat',
        value:text
      }
      if(this.app.client.isServer){
        var textArea = document.getElementById('chatArea');
        textArea.innerHTML += this.app.client.details.name + ": " + text+"<br />";
      }
      this.app.client.addMessage(message);
    }.bind(this));
    
    //Update game details
    this.updateGameDetails = function() {
      var els = $('#roomDetails input, #roomDetails select');
      var data = {};
      for (var i = 0; i < els.length; i++) {
        if(els[i].type == "select-one"){
          data[els[i].type] = els[i].value;
        } else {
          data[els[i].name] = els[i].value;
        }
      }
      var message = {
        type:'game-details',
        value:data
      }
      this.app.client.addMessage(message);
      //budget might have been updated
      setTimeout(this.assertCharacterList.bind(this),1);
    }
    //get all room details and share it with players (host only)
    $("#roomDetails :input").change(this.updateGameDetails.bind(this));
    //Updates the map list
    this.updateMapList = function () {
      $.getJSON("/assets/json/maplist.json", function(obj) {
        $("#mapName").html('')
        $.each(obj.maps, function(key, value) {
            $("#mapName").append("<option value=" + value.value + " >" + value.name + "</option>");
        });
      });
    }
    //Updates the character list
    this.updateCharList = function () {        
      $.getJSON("/assets/json/characterlist.json", function(obj) {        
          
          $.each(obj, function(key,value) {            
            if(key == 'characters'){
              this.characters = obj[key];
              var ul = document.getElementById("characterList");
              for(var i = 0; i < value.length; i++){
                var char = value[i];
                var li = document.createElement("li");
                var div = document.createElement("div");                
                div.setAttribute("class","character-card");
                div.setAttribute("id","character"+char.id);
                div.onclick = onClickCharacter.bind([this,div]);
                div.onmouseover = onHoverCharacter.bind([this,div])
                div.innerHTML = JSON.stringify(char);
                // Set its contents:
                li.appendChild(div);

                // Add it to the list:
                ul.appendChild(li);
              }
            }
        }.bind(this));
      }.bind(this));
    }
    function onHoverCharacter(){
      var gui = this[0];
      var div = this[1];
      if ($('#readyToPlay').is(":checked")) {
        if ( div.classList.contains('character-card-inactive') ){

        } else {
            div.classList.add('character-card-inactive');
        }        
      } else {
        if ( div.classList.contains('character-card-inactive') ){
            div.classList.remove('character-card-inactive');
        }
      }
    }

    function onClickCharacter(){
      var gui = this[0];
      var div = this[1];
      var id  = div.id.substring(9);
      var totalCost = 0;
      var balance   = 0;

      if ($('#readyToPlay').is(":checked")) {
        if ( div.classList.contains('character-card-inactive') ){

        } else {
            div.classList.add('character-card-inactive');
        }        
        return;
      }
     
      if ( div.classList.contains('character-card-inactive') ){
        div.classList.remove('character-card-inactive');
      }
      if ( div.classList.contains('character-card-active') ){
        div.classList.remove('character-card-active');
        for(var i = 0; i < gui.characters.length; i++){
          if(id == gui.characters[i].id){
            if(gui.characters[i].selected){
              gui.characters[i].selected = false;
            }
          }
        }
        for(var j = 0; j < gui.characters.length; j++){
          if(gui.characters[j].selected){
            totalCost += Number(gui.characters[j].cost);
          }
        }
      } else {
        for(var i = 0; i < gui.characters.length; i++){          
          if(id == gui.characters[i].id){
            
            if(!gui.characters[i].selected){
              for(var j = 0; j < gui.characters.length; j++){
                if(gui.characters[j].selected){
                  totalCost += Number(gui.characters[j].cost);
                }
              }
              balance = Number($('#budget').val()) - totalCost;
              if(balance >= Number(gui.characters[i].cost)){
                gui.characters[i].selected = true;
                div.classList.add('character-card-active');
                totalCost += Number(gui.characters[i].cost);
              }              
            }
          }
        }        
      }
      $('#totalCost').html(totalCost);
    }
    //assert character list
    this.assertCharacterList = function(){
      var totalCost = 0;
      var characterAtEndOfListSelected = null;
      for(var j = 0; j < this.characters.length; j++){
        if(this.characters[j].selected){
          totalCost += Number(this.characters[j].cost);
          characterAtEndOfListSelected = this.characters[j]; 
        }
      }
      if(totalCost > Number($('#budget').val())){        
        $('#character'+characterAtEndOfListSelected.id).click();
        setTimeout(this.assertCharacterList.bind(this),1);
      }
    }

    //Status event listener of mobius_client
    this.statusHandler = function (event) {
      $('#hostname').text(this.app.client.get('id'));
      switch(event.value){
        case 0:
        $('#status').text("Status: Not connected to Master");
        break;
        case 1:
        $('#status').text("Status: Available");
        break;
        case 2:
        $('#status').text("Status: InGame");
        break;
        case 3:
        $('#status').text("Status: Disconnected");
        break;
        case 4:
        $('#status').text("Status: Registration");
        break;
        case 5:
        $('#status').text("Status: Hosting");
        break;
      }
    }

    //Function is called by mobius when a new server list is obtained
    this.serverListHandler = function (event) {
      var ul = document.getElementById("server-list");
      while (ul.firstChild) {
          ul.removeChild(ul.firstChild);
      }
      var sList = this.app.client.get('server-list');
      for (var i = 0; i < sList.length; i++) {
        var entry = document.createElement('li');
        var aTag = document.createElement('a');
        var textEntry = sList[i];
        aTag.setAttribute('href',"#");
        aTag.innerHTML = textEntry;
        entry.appendChild(aTag);
        document.getElementById('server-list').appendChild(entry);
      }
    }

    //Message handler for both host and other player
    this.messageHandler = function(event) {
      if(this.app.client.rqdata.length > 0) {
        var messagePacket = this.app.client.rqdata.shift();
        var id = messagePacket.id;
        switch(messagePacket.data.type){
          //update the chat box
          case 'chat':
            var textArea = document.getElementById('chatArea');
            textArea.innerHTML += messagePacket.name +": " +messagePacket.data.value+"<br />";
            if(this.app.client.isServer){
              this.app.client.addMessage(messagePacket.data);
            }
          break;
          //update the room details box
          case 'game-details':
            if(this.app.client.isServer){

            } else {
              var els = $('#roomDetails input, #roomDetails select');
              var data = messagePacket.data.value;
              for (var i = 0; i < els.length; i++) {
                if(els[i].type == "select-one"){
                  $('#mapName').val(data[els[i].type]);
                } else {
                  els[i].value = data[els[i].name];
                }
              }
              //budget might have been updated
              setTimeout(this.assertCharacterList.bind(this),1);
            }
          break;
          //update the players box
          case 'players':
            if(this.app.client.isServer){

            } else {
              $('#players').html(messagePacket.data.value);
            }
          break;
          //When player is ready only host gets informed
          case 'ready':
            if(this.app.client.isServer){
              for (var j = 0; j < this.state.players.length; j++) {
                if(this.state.players[j].id == id){
                  this.state.players[j].ready = messagePacket.data.value;
                }
              }
              this.updatePlayerList();
            }
          break;
          case 'state':
            if(this.app.client.isServer){

            } else {
              this.state = messagePacket.data.value;
              if(this.state.start){
                this.startMPGame();
              }
            }
          break;
          default:
        }
      }
    }

    //Player updates informed to each other...
    this.updateHandler = function(event) {
      if(this.app.client.isServer){
        if(!this.busy){
          this.updatePlayerList();
          this.updateGameDetails();
          setTimeout(this.updatePlayerList.bind(this),2000);
          setTimeout(this.updateGameDetails.bind(this),2000);
        }
      }
      $('#alias').text(this.app.client.get('name'));
    }

    //New peer is connected
    this.peerHandler = function(event) {
      if(this.app.client.isServer){
        if(!this.busy){
          this.updatePlayerList();
          this.updateGameDetails();
          setTimeout(this.updatePlayerList.bind(this),2000);
          setTimeout(this.updateGameDetails.bind(this),2000);
        }
      }
    }

    //update the player list box host only
    this.updatePlayerList = function(){
      $('#players').text('');
      var html = "Players<br/>";
      var htmlOthers = '';
      var peers = Object.getOwnPropertyNames(this.app.client.peers);
      var players = new Array;
      var allReady = true;
      //add all peers connected as players
      for (var i = 0; i < peers.length; i++) {
        players[i] = {};
        var peer = peers[i];
        var name = null;
        if(this.app.client.peers[peer].details){
          name = this.app.client.peers[peer].details.name;
        }
        players[i].id    = peer;
        players[i].name  = name;
        players[i].faction= 1;
        players[i].ready = false;
      }
      //add admin/host first
      players.unshift({id:this.app.client.get('id'),name:this.app.client.get('name'),faction:1,ready:false});

      for (var i = 0; i < this.state.players.length; i++) {
        for (var j = 0; j < players.length; j++) {
          if(this.state.players[i].id == players[j].id){
            players[j].faction = this.state.players[i].faction;
            players[j].ready   = this.state.players[i].ready;
          }
        }
      }
      delete this.state.players;
      this.state.players = players;
      //only 4 factions hard coded 
      var options = ['1','2','3','4'];
      htmlOthers += html;

      for (var i = 0; i < players.length; i++) {
        for (var j = i+1; j < players.length; j++) {
          if(i == j){

          } else {
            if(players[i].name === players[j].name){              
              players[j].name = this.names[Math.floor(Math.random()*this.names.length)]+Math.floor(Math.random()*1000);
              this.app.client.updatePeer(players[j].id,'name',players[j].name);
            }
          }
        }
        if(players[i].ready){
          html        +="✔";
          htmlOthers  +="✔";
        } else {
          allReady = false;
        }
        if(players[i].name) {
          html        += players[i].name;
          htmlOthers  += players[i].name;
        } else {
          html        += players[i].id;
          htmlOthers  += players[i].id;
        }
        if(i == 0){
          html += ' (host)'
        }
        //html other players see and html host sees 
        htmlOthers  += " Faction  " + players[i].faction + "</br>";
        html        += " Faction  <input type =number value=" + players[i].faction + " min=1 max=4 id =\"Faction" + players[i].id + "\" /><br/>";
      }
      if(allReady){
        //block client from accepting new connections
        this.app.client.block = true
        if(!this.state.ready){
          //All are ready to play
          this.state.ready = true;
          this.state.readyTime = this.app.game.time.now;
        } else {
            var Countdown = (this.app.game.time.now - this.state.readyTime)/1000;
            html += "Countdown "+ Math.floor(3 - Countdown) + "<br/>";
            htmlOthers += "Countdown "+ Math.floor(3 - Countdown) + "<br/>";
            if( Countdown > 3 ){
              // the game will start
              this.state.start = true;
              this.state.passphrase = passphrase();
              this.state.game = {};
              var els = $('#roomDetails input');
              var data = {};
              for (var i = 0; i < els.length; i++) {
                if(els[i].type == "select-one"){
                  data[els[i].type] = els[i].value;
                } else {
                  data[els[i].name] = els[i].value;
                }
              }
              this.state.game       = data;
              this.state.type       = 'multi';
              this.state.game.map   = $('#mapName').val();
              delete this.state.readyTime;
              this.app.client.updateStatus(this.app.client.enumerations.userStatus.InGame);
              this.shareState();
              this.startMPGame();
              $('#readyToPlay').attr('checked', false);
            }
        }
        if(!this.state.start){
          setTimeout(this.updatePlayerList.bind(this), 500);
        } else {
          html        += "The Game will start now";
          htmlOthers  += "The Game will start now";
        }
      } else {
          this.app.client.block = false;
          this.state.ready = false;
      }

      $('#players').html(html);
      var message = {
        type:'players',
        value:htmlOthers
      }
      this.app.client.addMessage(message);
      $('[id^=Faction]').change(function() {
        var p = $('[id^=Faction]');
        for (var i = 0; i < p.length; i++) {
          var id = p[i].id.substring(7)
          for (var j = 0; j < this.state.players.length; j++) {
              if(this.state.players[j].id == id){
                this.state.players[j].faction = p[i].value;
              }
          }
        }
        this.updatePlayerList();
      }.bind(this));
    }

    //shareState state (host only)
    this.shareState = function(){
      var message = {
        type:'state',
        value:this.state
      }
      this.app.client.addMessage(message);
    }

    //Start the multi player game
    this.startMPGame = function(){
      this.closeMain();
      this.main.style.display      = "none";
      this.single.style.display    = "none";
      this.multi.style.display     = "block";
      this.settings.style.display  = "none";
      this.help.style.display      = "none";
      this.join.style.display      = "none";
      this.room.style.display      = "none";
      this.app.game.state.start('Game',true,false,this.app);
    }
    $('#private').change(function() {
      var bool = false;
      if ($('#private').is(":checked")) {
        bool = true;
      } else {
        bool = false;
      }
      this.app.client.details.private = bool;
      this.app.client.update('details');
    }.bind(this))
    //When clicking the ready checkbox
    $('#readyToPlay').change(function() {
      var ready = false
      if ($('#readyToPlay').is(":checked")) {
        ready = true;
      } else {
        ready = false;
      }
      if(this.app.client.isServer){
        this.state.players[0].ready = ready;
        this.updatePlayerList();
      }else{
        var message = {
          type:'ready',
          value:ready
        }
        this.app.client.addMessage(message);
      }
    }.bind(this));

    //Various listeners initialized
    this.app.client.on('status', this.statusHandler.bind(this));
    this.app.client.on('server-list', this.serverListHandler.bind(this));
    //Use elM to removeListener later in game
    this.elM = this.app.client.on('message', this.messageHandler.bind(this));
    this.app.client.on('update', this.updateHandler.bind(this));
    this.app.client.on('peer', this.peerHandler.bind(this));

    //update nick name on game start in top
    $('#alias').text(this.app.client.get('name'));

    //passphrase generator
    function passphrase()
    {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for( var i=0; i < 256; i++ )
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }
}
