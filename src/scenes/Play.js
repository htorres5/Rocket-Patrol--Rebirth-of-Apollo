class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    supportsLocalStorage() {
        try {
            return 'localStorage' in window && window['localStorage'] !== null;
        } catch (e) {
            return false;
        }
    }

    preload() {

        // load particles
        this.load.atlas('flares', 'assets/flares.png', 'assets/flares.json');

        // load images/tile sprites
        this.load.image('rocket', './assets/rocket.png');
        this.load.image('spaceship', './assets/spaceship.png');
        this.load.image('blackbird', './assets/blackbird.png')
        this.load.image('starfield', './assets/starfield.png');
        
        // load spritesheet
        this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
    }

    create() {

        // * BACKGROUND * //

        // place tile sprites
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0);
        this.planets = this.add.tileSprite(0, 0, 640, 480, 'planets').setOrigin(0, 0);
        
        // * UI * //

        // green UI Background
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x00FF00).setOrigin(0, 0);

        // white borders
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);

        // * MUSIC * //

        // play music
        this.music = this.sound.add('battle', {volume: 0.25, loop: true});
        this.music.play();

        // * PREFABS * //

        // add rocket (p1)
        this.p1Rocket = new Rocket(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'rocket').setOrigin(0.5, 0);
        
        // add spaceships (x5)

        // BlackBird 1: Agent Joe
        this.ship00 = new BlackBird(this, game.config.width + borderUISize*8, borderUISize*3 + borderPadding*2, 'blackbird', 0, 50, 1).setOrigin(0,0);

        // Black Bird 007: Special Agent Craig
        this.ship007 = new BlackBird(this, game.config.width + borderUISize*3, borderUISize*6 + borderPadding*2,'blackbird', 0, 50, 1).setOrigin(0,0);

        // Spaceships: Rick, Richard and Ronnie
        this.ship01 = new Spaceship(this, game.config.width + borderUISize*6, borderUISize*5, 'spaceship', 0, 30, 1).setOrigin(0, 0);
        this.ship02 = new Spaceship(this, game.config.width, borderUISize*8 + borderPadding*2, 'spaceship', 0, 20, 1).setOrigin(0,0);

        // * PARTICLE EFFECTS * //

        this.lifespan = 350;
        // Explosion Particles
        this.emitter = this.add.particles(0, 0, 'flares', {
            frame: [ 'red', 'yellow', 'green' ],
            lifespan: this.lifespan,
            speed: { min: 150, max: 250 },
            scale: { start: 0.8, end: 0 },
            gravityY: 150,
            blendMode: 'ADD',
            emitting: false
        });

        // * CONTROLS * //

        // define keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        // display score
        this.scoreConfig = {
            fontFamily: 'Pixel_NES',
            fontSize: '20px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
            top: 5,
            left: 5,
            right: 5,
            bottom: 5,
            },
            fixedWidth: 100
        }

        // * COMBO UI * //

        // Combo
        this.combo = 0;
        this.highestCombo = 0;
        
        if (game.settings.difficulty == 'novice') {
            this.isComboPBSaved = (localStorage.getItem('isComboPBSavedNovice') == "true");
            this.comboPB = (!this.isComboPBSaved) ? 0 : parseInt(localStorage.getItem('comboPBNovice'));
        } else if (game.settings.difficulty == 'expert') {
            this.isComboPBSaved = (localStorage.getItem('isComboPBSavedExpert') == "true");
            this.comboPB = (!this.isComboPBSaved) ? 0 : parseInt(localStorage.getItem('comboPBExpert'));
        }

        // Combo UI 
        this.scoreConfig.fontSize = '16px';
        this.scoreConfig.backgroundColor = '';
        this.scoreConfig.fixedWidth = 0;
        this.comboUI =this.add.text(game.config.width/2, borderUISize + borderPadding*4.5, ``, this.scoreConfig).setOrigin(0.5, 0);

        // Highest Combo UI
        this.scoreConfig.align = 'right';
        this.scoreConfig.color = '#36454f';
        this.scoreConfig.backgroundColor = '#F3B141';
        this.scoreConfig.fixedWidth = 100;
        this.highestComboUI = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*4, `x${this.highestCombo}`, this.scoreConfig);

        // Combo PB UI
        this.comboPB_UI = this.add.text(game.config.width - borderUISize - borderPadding - 50, borderUISize + borderPadding*4.5, `x${this.comboPB}`, this.scoreConfig).setOrigin(0.5,0)

        // * SCORE UI * //

        // initialize score
        this.p1Score = 0;

        this.scoreConfig.fontSize = '20px';
        this.scoreConfig.color = '#843605';
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, this.p1Score, this.scoreConfig);

        if (game.settings.difficulty == 'novice') {
            this.savedHighScore = (localStorage.getItem('savedHighScoreNovice') == "true");
            this.highScore = (!this.savedHighScore) ? 0 : parseInt(localStorage.getItem('highScoreNovice'));
        } else if (game.settings.difficulty == 'expert') {
            this.savedHighScore = (localStorage.getItem('savedHighScoreExpert') == "true");
            this.highScore = (!this.savedHighScore) ? 0 : parseInt(localStorage.getItem('highScoreExpert'));
        }
        
        this.highScoreUI = this.add.text(game.config.width - borderUISize - borderPadding - 50, borderUISize + borderPadding*3 - 3, this.highScore, this.scoreConfig).setOrigin(0.5,0)
        
        this.scoreConfig.fontSize = '12px';
        this.highScoreUIText = this.add.text(game.config.width - borderUISize - borderPadding - 50, borderUISize + borderPadding*3 - 15, 'HIGH SCORE', this.scoreConfig).setOrigin(0.5,0);

        // * CLOCK UI * //

        // Current Time
        this.currentTime = Math.floor((game.settings.gameTimer-(game.settings.gameTimer%1000))/1000);

        // Clock Text Style
        let clockConfig = {
            fontFamily: 'Pixel_NES',
            fontSize: '28px',
            color: '#843605',
            padding: {
            top: 5,
            bottom: 5,
            },
        }

        // Render Timer
        this.clockUI = this.add.text(game.config.width/2, borderUISize + borderPadding*2, this.currentTime, clockConfig).setOrigin(0.5, 0);

        // Each 1000 ms call updateTimer
        this.timerUpdate = this.time.addEvent({ delay: 1000, callback: this.updateTimer, callbackScope: this, loop: true });

        // Render Added Time Text
        this.isAddedTimeVisible = false;
        this.extraTime = 1;

        this.addTimeUI = this.add.text(game.config.width/2 + 20, borderUISize + borderPadding*2, '', clockConfig).setOrigin(0, 0);

        // * SPEED UP * //

        // Speedup Game Every 30 Seconds (15 Seconds Expert)
        this.multiplier = 1;

        this.speedupUpdate = this.time.addEvent({ delay: 10000, callback: this.speedupGame, callbackScope: this, loop: true });

        // * GAME OVER * //
        this.scoreConfig.color = '#843605';
        this.scoreConfig.align = '';
        this.scoreConfig.backgroundColor = '#F3B141';
        this.scoreConfig.fontSize = '16px';
        this.scoreConfig.fixedWidth = 0;

        // GAME OVER flag
        this.gameOver = false;

    }

    update() {

        // * GAME OVER * //

        // If the time reaches 0...
        if(this.currentTime == 0) {
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', this.scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or ← for Menu', this.scoreConfig).setOrigin(0.5);

            this.music.stop();

            // Save High Score
            if(this.p1Score > this.highScore) {
                this.highScore = this.p1Score;
                this.highScoreUI.text = `${this.highScore}`;
                this.saveHighScore();
                // If High Score, save highest Combo
                this.comboPB = this.highestCombo;
                this.comboPB_UI = `x${this.comboPB}`;
                this.saveComboPB();

            }
            this.gameOver = true;
        }

        if(this.gameOver) {
            this.timerUpdate.remove();
            this.speedupUpdate.remove();
        }

        // check key input for restart
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
            this.scene.restart();
        }

        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
        }

        // * PARALLAX SCROLLING (REAL) * //

        this.starfield.tilePositionX -= 4;
        this.planets.tilePositionX -= 8;
        
        // * GAMEPLAY * //

        if (!this.gameOver) {               
            this.p1Rocket.update();         // update rocket sprite
            this.ship00.update();           // update spaceships (x5)
            this.ship01.update();
            this.ship02.update();
            this.ship007.update();
        } 

        // check collisions
        if(this.checkCollision(this.p1Rocket, this.ship007)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship007); 
        }
        if (this.checkCollision(this.p1Rocket, this.ship02)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship02);
        }
        if (this.checkCollision(this.p1Rocket, this.ship01)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship01);
        }
        if(this.checkCollision(this.p1Rocket, this.ship00)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship00); 
        }
        
        // Save highest combo
        if(this.combo > this.highestCombo) {
            this.highestCombo = this.combo;
            this.highestComboUI.text = `x${this.highestCombo}`;
        }

        // break combo if hit ceiling
        if(this.p1Rocket.breakCombo == true) {
            this.combo = 0;
            this.comboUI.text = ``;
            this.p1Rocket.breakCombo = false;
            this.sound.play('combo_break');
        }
    }

    // * Called every second to update UI
    updateTimer () {
        this.currentTime -= 1; // One second
        if((this.currentTime <= 5) && (this.currentTime >= 1)) {
            this.sound.play('sfx_select');
        } else if (this.currentTime == 0) {
            this.sound.play('game_over');
        }
        this.clockUI.setText(this.currentTime);
    }

    // * Speeds up the game * multiplier up to a certain point
    speedupGame () {
        if (this.multiplier <= 3) {
            this.multiplier += 0.2;
        }

        // update speed (x5)
        this.p1Rocket.speedup(this.multiplier-0.1);
        this.ship00.speedup(this.multiplier);
        this.ship01.speedup(this.multiplier);
        this.ship02.speedup(this.multiplier); 
        this.ship007.speedup(this.multiplier);
    }

    // * Saves High Score for each game mode to local storage
    saveHighScore () {
        if (!this.supportsLocalStorage()) { return false; }
        
        this.savedHighScore = true;

        if (game.settings.difficulty == 'novice') {
            localStorage.setItem('savedHighScoreNovice', `${this.savedHighScore}`);
            localStorage.setItem('highScoreNovice', `${this.highScore}`);
        } else if (game.settings.difficulty == 'expert') {
            localStorage.setItem('savedHighScoreExpert', `${this.savedHighScore}`);
            localStorage.setItem('highScoreExpert', `${this.highScore}`);
        }

        return true;
    }

    // * Saves High Score for each game mode to local storage
    saveComboPB () {
        if (!this.supportsLocalStorage()) { return false; }
        
        this.isComboPBSaved = true;

        if (game.settings.difficulty == 'novice') {
            localStorage.setItem('isComboPBSavedNovice', `${this.isComboPBSaved}`);
            localStorage.setItem('comboPBNovice', `${this.comboPB}`);
        } else if (game.settings.difficulty == 'expert') {
            localStorage.setItem('isComboPBSavedExpert', `${this.isComboPBSaved}`);
            localStorage.setItem('comboPBExpert', `${this.comboPB}`);
        }

        return true;
    }

    checkCollision(rocket, ship) {
        // simple AABB checking
        if (rocket.x < ship.x + ship.width && 
          rocket.x + rocket.width > ship.x && 
          rocket.y < ship.y + ship.height &&
          rocket.height + rocket.y > ship. y) {
          return true;
        } else {
          return false;
        }
    }
    
    // * On ship explode...
    shipExplode(ship) {
        
        // temporarily hide ship
        ship.alpha = 0;

        // create explosion effect at ship's position
        this.emitter.explode(16, ship.x, ship.y);
        this.time.delayedCall(this.lifespan, () => {
            ship.reset();                         // reset ship position
            ship.alpha = 1;                       // make ship visible again 
        })

        // Add Time
        this.currentTime += ship.extraTime;
        if (this.isAddedTimeVisible == false) {
            this.addTimeUI.text = `+${ship.extraTime}`;
            this.isAddedTimeVisible = true;
            this.time.delayedCall(1000, () => {
                this.addTimeUI.text = '';
                this.isAddedTimeVisible = false;
            })
        }

        // add to combo
        this.combo += 1;
        this.comboUI.text = `COMBO x${this.combo}`;

        // score add and repaint
        this.p1Score += ship.points*this.combo;
        this.scoreLeft.text = this.p1Score;

        // play BOOM
        if(ship.constructor.name == "BlackBird") {
            this.sound.play('sfx_explosion_01');
        } else if(ship.constructor.name == "Spaceship") {
            this.sound.play('sfx_explosion');
        }
      }
}