class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {

        // load music
        //this.load.audio('battle', './assets/RetroRPG_Battle2_loop.mp3');

        // load images/tile sprites
        this.load.image('rocket', './assets/rocket.png');
        this.load.image('spaceship', './assets/spaceship.png');
        this.load.image('starfield', './assets/starfield.png');
        
        // load spritesheet
        this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
    }

    supportsLocalStorage() {
        try {
            return 'localStorage' in window && window['localStorage'] !== null;
        } catch (e) {
            return false;
        }
    }

    updateTimer () {
        this.currentTime -= 1; // One second
        if((this.currentTime <= 5) && (this.currentTime >= 1)) {
            this.sound.play('sfx_select');
        } else if (this.currentTime == 0) {
            this.sound.play('game_over');
        }
        this.clockUI.setText(this.currentTime);
    }

    speedupGame () {
        if (this.multiplier <= 2) {
            this.multiplier += 0.1;
        }

        // update speed (x4)
        this.p1Rocket.speedup(this.multiplier);
        this.ship01.speedup(this.multiplier);           
        this.ship02.speedup(this.multiplier); 
        this.ship03.speedup(this.multiplier);
    }

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

    create() {
        // place tile sprite
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0);

        // green UI Background
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x00FF00).setOrigin(0, 0);

        // white borders
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);

        // play music
        this.music = this.sound.add('battle', {volume: 0.25, loop: true});
        this.music.play();

        // add rocket (p1)
        this.p1Rocket = new Rocket(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'rocket').setOrigin(0.5, 0);
        
        // add spaceships (x3)
        this.ship01 = new Spaceship(this, game.config.width + borderUISize*6, borderUISize*4, 'spaceship', 0, 30).setOrigin(0, 0);
        this.ship02 = new Spaceship(this, game.config.width + borderUISize*3, borderUISize*5 + borderPadding*2, 'spaceship', 0, 20).setOrigin(0,0);
        this.ship03 = new Spaceship(this, game.config.width, borderUISize*6 + borderPadding*4, 'spaceship', 0, 10).setOrigin(0,0);

        // define keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        // animation config
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 9, first: 0}),
            frameRate: 30
        });

        // initialize score
        this.p1Score = 0;

        // display score
        this.scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
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

        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, this.p1Score, this.scoreConfig);

        //console.log(`test: ${localStorage.getItem('this.savedHighScore')}`);

        if (game.settings.difficulty == 'novice') {
            this.savedHighScore = (localStorage.getItem('savedHighScoreNovice') == "true");
            this.highScore = (!this.savedHighScore) ? 0 : parseInt(localStorage.getItem('highScoreNovice'));
        } else if (game.settings.difficulty == 'expert') {
            this.savedHighScore = (localStorage.getItem('savedHighScoreExpert') == "true");
            this.highScore = (!this.savedHighScore) ? 0 : parseInt(localStorage.getItem('highScoreExpert'));
        }


        console.log(this.highScore);
        
        this.highScoreUI = this.add.text(game.config.width - borderUISize - borderPadding - 50, borderUISize + borderPadding*3, this.highScore, this.scoreConfig).setOrigin(0.5,0)
        
        this.scoreConfig.fontSize = '12px';
        this.highScoreUIText = this.add.text(game.config.width - borderUISize - borderPadding - 50, borderUISize + borderPadding*3 - 15, 'HIGH SCORE', this.scoreConfig).setOrigin(0.5,0)

        // Clock UI

        // Current Time
        this.currentTime = Math.floor((game.settings.gameTimer-(game.settings.gameTimer%1000))/1000);

        // Clock Text Style
        let clockConfig = {
            fontFamily: 'Courier',
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

        // Speedup Game Every 30 Seconds (15 Seconds Expert)
        this.multiplier = 1;

        this.speedupUpdate = this.time.addEvent({ delay: game.settings.gameTimer/2, callback: this.speedupGame, callbackScope: this, loop: true });

        this.scoreConfig.fontSize = '28px';
        this.scoreConfig.fixedWidth = 0;

        // GAME OVER flag
        this.gameOver = false;

    }

    update() {
        //console.log(this.time.now);
        //console.log(game.settings.gameTimer/2);

        // If the time reaches 0...
        if(this.currentTime == 0) {
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', this.scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or ← for Menu', this.scoreConfig).setOrigin(0.5);

            this.music.stop();

            // Save High Score
            if(this.p1Score > this.highScore) {
                this.highScore = this.p1Score;
                console.log(this.saveHighScore());
                this.saveHighScore();
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

        this.starfield.tilePositionX -= 4;
        
        if (!this.gameOver) {               
            this.p1Rocket.update();         // update rocket sprite
            this.ship01.update();           // update spaceships (x3)
            this.ship02.update();
            this.ship03.update();
        } 

        // check collisions
        if(this.checkCollision(this.p1Rocket, this.ship03)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship03); 
        }
        if (this.checkCollision(this.p1Rocket, this.ship02)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship02);
        }
        if (this.checkCollision(this.p1Rocket, this.ship01)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship01);
        }
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
    
    shipExplode(ship) {
        // temporarily hide ship
        ship.alpha = 0;
        // create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode');             // play explode animation
        boom.on('animationcomplete', () => {    // callback after anim completes
          ship.reset();                         // reset ship position
          ship.alpha = 1;                       // make ship visible again
          boom.destroy();                       // remove explosion sprite
        });       

        // Add Time
        this.currentTime += this.extraTime;
        if (this.isAddedTimeVisible == false) {
            this.addTimeUI.text = `+${this.extraTime}`;
            this.isAddedTimeVisible = true;
            this.time.delayedCall(this.extraTime*1000, () => {
                this.addTimeUI.text = '';
                this.isAddedTimeVisible = false;
            })
        }

        // score add and repaint
        this.p1Score += ship.points;
        this.scoreLeft.text = this.p1Score;
        
        // play BOOM
        this.sound.play('sfx_explosion');
      }
}