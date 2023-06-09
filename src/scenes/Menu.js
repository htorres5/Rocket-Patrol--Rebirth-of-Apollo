class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload() {
        // load bgs
        this.load.image('starfield', './assets/starfield.png');
        this.load.image('planets', './assets/planets.png')
        
        // load audio

        // music
        this.load.audio('battle', './assets/RetroRPG_Battle2_loop.mp3');

        // sfx
        this.load.audio('combo_break', './assets/comboBreak.wav')
        this.load.audio('game_over', './assets/game_over.wav')
        this.load.audio('sfx_select', './assets/blip_select12.wav');
        this.load.audio('sfx_explosion', './assets/explosion38.wav');
        this.load.audio('sfx_explosion_01','./assets/explosion01.wav');
        this.load.audio('sfx_rocket', './assets/rocket_shot.wav');
    }

    create() {

        // place tile sprites
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0)
        this.planets = this.add.tileSprite(0, 0, 640, 480, 'planets').setOrigin(0, 0)

        // title text config
        let titleConfig = {
            fontFamily: 'Pixel_NES',
            fontSize: '40px',
            backgroundColor: '#F3B141',
            color: '#00FF00',
            strokeThickness: 4,
            align: 'center',
            padding: {
            top: 5,
            bottom: 5,
            },
            fixedWidth: 0
        }


        // menu text configuration
        let menuConfig = {
            fontFamily: 'Pixel_NES',
            fontSize: '16px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
            top: 5,
            bottom: 5,
            },
            fixedWidth: 0
        }

        //show menu text
        this.add.text(game.config.width/2, game.config.height/2 - borderUISize - borderPadding - 30, 'ROCKET PATROL:\n Rebirth of Apollo', titleConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/2, 'Use ←→ arrows to move & (F) to fire', menuConfig).setOrigin(0.5);

        menuConfig.backgroundColor ='#00FF00'
        menuConfig.color = '#000';

        this.add.text(game.config.width/2, game.config.height/2 + borderUISize + borderPadding, 'Press ← for Novice or → for Expert', menuConfig).setOrigin(0.5);
        
        // define keys
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    }

    update() {
        // * PARALLAX SCROLLING  * //

        this.starfield.tilePositionX -= 4;
        this.planets.tilePositionX -= 8;

        if (Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            // easy mode
            game.settings = {
                difficulty: 'novice',
                spaceshipSpeed: 3,
                gameTimer: 60000,    
            }
            this.sound.play('sfx_select');
            this.scene.start('playScene');    
        }
        if (Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
            // hard mode
            game.settings = {
                difficulty: 'expert',
                spaceshipSpeed: 5,
                gameTimer: 30000,
            }

            this.sound.play('sfx_select');
            this.scene.start('playScene');    
        }
    }
}