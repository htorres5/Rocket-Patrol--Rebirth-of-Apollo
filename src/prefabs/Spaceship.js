class Spaceship extends Phaser.GameObjects.Sprite {
   constructor(scene, x, y, texture, frame, pointValue, extraTime=1) {
      super(scene, x, y, texture, frame);
      scene.add.existing(this);   // add to existing scene
      this.points = pointValue;   // store pointValue
      this.extraTime = extraTime; // store extra time
      this.initialSpeed = game.settings.spaceshipSpeed;
      this.moveSpeed = this.initialSpeed; // pixels per frame  
      this.direction = Math.floor(Math.random() * 2);
      this.toRightSide = game.config.width;
      this.toLeftSide = 0;   
   }

   speedup(multiplier) {
      this.moveSpeed = this.initialSpeed*multiplier;
   }

   update() {
      // move spaceship left
      if (this.direction == 0) {
         this.x -= this.moveSpeed;

         // wrap around from left edge to right edge
         if(this.x <= 0 - this.width) {
            this.reset();
         }
      
      // move spaceship right
      } else {
         this.flipX = true;

         this.x += this.moveSpeed;

         // wrap around from right edge to left edge
         if(this.x >= game.config.width + this.width) {
            this.reset();
         }

      }
      

   }

   // position reset
   reset() {
      if (this.direction == 0) {
         this.x = this.toRightSide;
      } else {
         this.x = this.toLeftSide;
      }
   }
}