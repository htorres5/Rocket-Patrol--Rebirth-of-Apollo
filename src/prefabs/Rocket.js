// Rocket prefab
class Rocket extends Phaser.GameObjects.Sprite {
   constructor(scene, x, y, texture, frame) {
     super(scene, x, y, texture, frame);
 
     // add object to existing scene
     scene.add.existing(this);
     this.isFiring = false; // track rocket's firing status
     this.initialSpeed = 2;
     this.moveSpeed = this.initialSpeed;   // pixels per frame
     this.breakCombo = false;

     this.sfxRocket = scene.sound.add('sfx_rocket'); // add rocket sfx
   }

   speedup(multiplier) {
      this.moveSpeed = this.initialSpeed*multiplier;
   }

   update() {
      // left/right movement
      //if(!this.isFiring) {
         if(keyLEFT.isDown && this.x >= borderUISize + this.width) {
            this.x -= this.moveSpeed;
         } else if (keyRIGHT.isDown && this.x <= game.config.width - borderUISize - this.width) {
            this.x += this.moveSpeed;
         }
      //}

      // fire button
      if(Phaser.Input.Keyboard.JustDown(keyF) && !this.isFiring) {
         this.isFiring = true;
         
         // play sfx
         this.sfxRocket.play();
      }

      // if fired, move up
      if(this.isFiring && this.y >= borderUISize * 3 + borderPadding) {
         this.y -= this.moveSpeed;
      }

      // reset on miss
      if(this.y <= borderUISize * 3 + borderPadding) {
         this.breakCombo = true;
         this.reset();
      }
   }

   // reset rocket to "ground"
   reset() {
      this.isFiring = false;
      this.y = game.config.height - borderUISize - borderPadding;
   }
 }