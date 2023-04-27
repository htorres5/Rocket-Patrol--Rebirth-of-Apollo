class Spaceship extends Phaser.GameObjects.Sprite {
   constructor(scene, x, y, texture, frame, pointValue) {
      super(scene, x, y, texture, frame);
      scene.add.existing(this);   // add to existing scene
      this.points = pointValue;   // store pointValue
      this.moveSpeed = game.settings.spaceshipSpeed; // pixels per frame  
      this.direction = Math.floor(Math.random() * 2);
      this.toRightSide = game.config.width;
      this.toLeftSide = 0;   
   }

   update() {
      // move spaceship left
      if (this.direction == 0) {
         this.x -= this.moveSpeed;

         // wrap around from left edge to right edge
         if(this.x <= 0 - this.width) {
            this.reset(this.toRightSide);
         }
      
      // move spaceship right
      } else {
         this.flipX = true;

         this.x += this.moveSpeed;

         // wrap around from right edge to left edge
         if(this.x >= game.config.width + this.width) {
            this.reset(this.toLeftSide);
         }

      }
      

   }

   // position reset
   reset(position) {
      this.x = position;
   }
}