/**
 * Created by Travis on 7/31/2016.
 */
/* Losing sound by Joe Lamb via SoundBible http://soundbible.com/1830-Sad-Trombone.html */
/*Button sounds via FreeCodeCamp */
/*Win sound by Mike Koenig via SoundBible http://soundbible.com/988-Applause.html*/
/*Try again sound by Mike Koenig via SoundBible http://soundbible.com/1198-Buzz-Fade-Out.html*/
$(document).ready(function(){
    (function(){

        var game = {

            commands : [],
            inputs : [],
            buttons : [$("#top-left"), $("#top-right"), $("#bottom-left"), $("#bottom-right")],
            regularColors: ["#1681DB", "#B3452D", "#DB1D16", "#00A89B"],
            indicatorColors: ["#1A3042", "#1A3042", "#1A3042", "#1A3042"],
            sounds: ["https://s3.amazonaws.com/freecodecamp/simonSound1.mp3", "https://s3.amazonaws.com/freecodecamp/simonSound2.mp3", "https://s3.amazonaws.com/freecodecamp/simonSound3.mp3", "https://s3.amazonaws.com/freecodecamp/simonSound4.mp3"],
            buttonPickerForColors : 0,
            round : 0,
            compareCounter : 0,
            mode : "easy",
            wins : 0,
            running : false,
            clickable : false,

            init : function(){
                this.cacheDOM();
                this.bindEvents();
                this.updateDisplay();
            },


            cacheDOM : function(){
                this.$el = $("#game");
                this.$topLeft = this.$el.find("#top-left");
                this.$topRight = this.$el.find("#top-right");
                this.$bottomLeft = this.$el.find("#bottom-left");
                this.$bottomRight = this.$el.find("#bottom-right");
                this.$display = this.$el.find("#display");
                this.$easyButton = this.$el.find("#easy-button");
                this.$strictButton = this.$el.find("#strict-button");
                this.$startButton = this.$el.find("#start-button");
                this.$resetButton = this.$el.find("#reset-button");
            },

            bindEvents : function(){
                this.$topLeft.on("click", {number : 0},  this.acceptInputs.bind(this));
                this.$topRight.on("click", {number : 1},  this.acceptInputs.bind(this));
                this.$bottomLeft.on("click", {number : 2},  this.acceptInputs.bind(this));
                this.$bottomRight.on("click", {number : 3},  this.acceptInputs.bind(this));
                this.$startButton.on("click",  this.startAndPause.bind(this));
                this.$resetButton.on("click", this.resetGame.bind(this));
                this.$easyButton.on("click", {value : "easy"}, this.modeSwitch.bind(this));
                this.$strictButton.on("click", {value : "strict"}, this.modeSwitch.bind(this));
            },

            generateCommands : function(){
                if(this.running == true) {
                    var buttonToPush = Math.floor(Math.random() * 4);
                    this.commands.push(buttonToPush);
                    console.log("COMMANDS", this.commands);
                    var i = this.buttonPickerForColors;
                    this.indicateButtons(i);
                }
            },

            indicateButtons : function(i){
                if(this.running == true) {
                    if (i < this.commands.length) {
                        this.buttonPickerForColors = i;
                        setTimeout(this.changeToIndicatorColors, 1000);
                    } else if(i >= this.commands.length){
                        this.clickable = true;
                    }
                }
            },

            changeToIndicatorColors : function(){
                var i = game.buttonPickerForColors;
                console.log("CHANGE TO INDICATOR", game.buttonPickerForColors, "I", i);
                game.buttons[game.commands[i]].css("background-color", game.indicatorColors[game.commands[i]]);
                var audio = new Audio(game.sounds[game.commands[i]]);
                audio.play();
                setTimeout(game.backToNormalColors, 1000);
            },

            backToNormalColors : function(){
                var i = game.buttonPickerForColors;
                console.log("CHANGING BACK");
                game.buttons[game.commands[i]].css("background-color", game.regularColors[game.commands[i]]);
                game.indicateButtons(i+1);
            },

            acceptInputs : function(event){
                if(this.running == true && this.clickable == true) {
                    this.inputs.push(event.data.number);
                    console.log("COMMANDS", this.commands);
                    console.log("INPUTS", this.inputs);
                    var audio = new Audio(game.sounds[event.data.number]);
                    audio.play();
                    this.compareCommandsAndInputs();
                }
            },

            compareCommandsAndInputs : function(){

                if((this.inputs[this.compareCounter] === this.commands[this.compareCounter]) && (this.compareCounter >= this.round)){
                    console.log("NEXT ROUND", this.round);
                    this.nextRound();
                } else if((this.inputs[this.compareCounter] === this.commands[this.compareCounter]) && (this.compareCounter < this.round)){
                    console.log("CORRECT", this.compareCounter);
                    this.compareCounter++;
                } else if(this.mode === "easy"){
                    console.log("TRY AGAIN");
                    this.tryAgainSound();
                    this.clearInputs();
                    var i = this.buttonPickerForColors;
                    this.indicateButtons(i);
                } else if(this.mode === "strict"){
                    console.log("YOU LOSE!");
                    this.loseSound();
                    this.resetGame();
                }
            },

            nextRound : function(){
                if(this.round < 19){
                    this.round++;
                    this.clickable = false;
                    this.clearInputs();
                    this.updateDisplay();
                    this.generateCommands();
                } else if (this.round >= 19){
                    this.clickable = false;
                    console.log("YOU WIN");
                    this.winSound();
                    this.commands = [];
                    this.round = 0;
                    this.wins++;
                    this.updateDisplay();
                    this.clearInputs();
                    this.generateCommands();
                }
            },

            clearInputs : function(){
                this.inputs = [];
                this.buttonPickerForColors = 0;
                this.compareCounter = 0;
            },

            updateDisplay : function(){
                if(this.running == true) {
                    this.$display.html("<p>Round: " + (this.round + 1) + "<br>Wins: " + this.wins + "</p>");
                } else if(this.running == "paused"){
                    this.$display.html("<p>Paused</p>");
                } else if(this.running == false){
                    this.$display.html("<p>Stopped</p>");
                }
            },

            startAndPause : function(){
                if(this.running == false || this.running == "paused"){
                    if(this.running == "paused"){
                        this.running = true;
                        this.updateDisplay();
                        var i = this.buttonPickerForColors;
                        this.indicateButtons(i);
                    } else if(this.running == false){
                        this.running = true;
                        this.updateDisplay();
                        this.generateCommands();
                    }
                } else if(this.running == true){
                    this.clearInputs();
                    this.running = "paused";
                    this.updateDisplay();
                }
            },

            resetGame : function(){
                this.clearInputs();
                this.commands = [];
                this.round = 0;
                this.running = false;
                this.clickable = false;

                for(var i = 0; i < this.buttons.length; i++){
                    this.buttons[i].css("background-color", this.regularColors[i]);
                }
                this.startAndPause();
            },

            modeSwitch : function(event){
                if(event.data.value === "easy"){
                    this.mode = "easy";
                } else this.mode = "strict";
                console.log("MODE", this.mode);
                this.resetGame();
            },

            loseSound : function(){
                var audio = new Audio("http://soundbible.com/grab.php?id=1830&type=mp3");
                audio.play();
            },

            winSound : function(){
                var audio = new Audio("http://soundbible.com/grab.php?id=988&type=mp3");
                audio.play();
            },

            tryAgainSound : function(){
                var audio = new Audio("http://soundbible.com/grab.php?id=1198&type=mp3");
                audio.play();
            }
        };
        game.init();

    })();
});