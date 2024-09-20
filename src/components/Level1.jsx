import { useEffect, useRef } from "react";
import Phaser from "phaser";

const Level1 = () => {
  const gameContainer = useRef(null);

  useEffect(() => {
    const config = {
      type: Phaser.AUTO,
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1600,
        height: 800,
      },
      physics: {
        default: "arcade",
        arcade: {
          gravity: { y: 300 },
          debug: true,
        },
      },
      scene: {
        preload,
        create,
        update,
      },
      parent: gameContainer.current,
    };

    const game = new Phaser.Game(config);

    function preload() {
      /******************** TERRENO *********************************/
      this.load.image("sky", "/assets/level1/terrain/sky.png");
      this.load.image("ground", "/assets/level1/terrain/platform.png");

      /******************** ITEMS *********************************/
      this.load.image("star", "/assets/level1/items/star.png");
      this.load.image("diamond", "/assets/level1/items/diamond.png");

      /******************** POWER-UPS *********************************/
      this.load.image("speedBoost", "/assets/level1/power-ups/velocidad.png");
      this.load.image("heart", "/assets/level1/power-ups/heart.png");
      this.load.image("lifeKit", "/assets/level1/power-ups/life.png");
      this.load.image("jumpBoots", "/assets/level1/power-ups/boots.png");
      this.load.image("pistol", "/assets/level1/power-ups/pistol.png");
      this.load.image("bullet", "/assets/level1/enemies/pea.png");

      /******************** SOUNDS *********************************/
      this.load.audio("hitSound", "/assets/level1/songs/Hit.ogg");
      this.load.audio("jumpSound", "/assets/level1/songs/Jump.ogg");
      this.load.audio("powerSound", "/assets/level1/songs/Power.ogg");

      /******************** PLAYER *********************************/

      this.load.spritesheet("dude", "/assets/level1/character/dude.png", {
        frameWidth: 32,
        frameHeight: 48,
      });

      /******************** ENEMIES *********************************/

      this.load.spritesheet("duck", "/assets/level1/enemies/duck.png", {
        frameWidth: 36,
        frameHeight: 36,
      });

      this.load.spritesheet("chicken", "/assets/level1/enemies/chicken.png", {
        frameWidth: 32,
        frameHeight: 32,
      });

      this.load.spritesheet("plant", "/assets/level1/enemies/plant.png", {
        frameWidth: 44,
        frameHeight: 42,
      });
      this.load.image("pea", "/assets/level1/enemies/pea.png");

      this.load.spritesheet("camaelon", "/assets/level1/enemies/camaelon.png", {
        frameWidth: 84,
        frameHeight: 38,
      });
    }

    let player;

    let background;
    let platforms;
    let cursors;

    let stars;
    let diamonds;

    let score = 0;
    let scoreText;
    let hearts;
    let lives = 3;

    let speedBoosts;
    let bullets;

    let ducks;
    let chickens;
    let plants;
    let peas;
    let camaelons;

    let speedBoostActive = true;
    let jumpBoostActive = false;
    let lastDirection = "right";
    let isJumping = true;

    function create() {
      /**************************** BACKGROUND *****************************/

      background = this.add.tileSprite(0, 0, 20000, 1800, "sky");
      background.setOrigin(0, 0);
      background.setScale(0.5);

      this.cameras.main.setBounds(0, 0, 8000, 800);
      this.physics.world.setBounds(0, 0, 8000, 800);

      platforms = this.physics.add.staticGroup();

      const ground = platforms.create(0, this.scale.height - 32, "ground");
      ground.setScale(60, 2).refreshBody();

      platforms.create(500, 600, "ground").refreshBody();
      platforms.create(-150, 450, "ground").refreshBody();
      platforms.create(850, 350, "ground").refreshBody();
      platforms.create(100, 200, "ground").refreshBody();
      platforms.create(1500, 400, "ground").refreshBody();
      platforms.create(2500, 250, "ground").refreshBody();

      /**************************** PLAYER *****************************/

      player = this.physics.add.sprite(32, this.scale.height - 150, "dude");
      player.setBounce(0.2);
      player.setCollideWorldBounds(true);

      this.cameras.main.startFollow(player);
      this.physics.add.collider(player, platforms);

      this.anims.create({
        key: "left",
        frames: this.anims.generateFrameNumbers("dude", { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1,
      });

      this.anims.create({
        key: "right",
        frames: this.anims.generateFrameNumbers("dude", { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1,
      });

      /**************************** POWER UPS *****************************/

      const jumpBoots = this.physics.add.group();
      jumpBoots.create(400, 500, "jumpBoots");
      jumpBoots.create(1600, 350, "jumpBoots");
      jumpBoots.create(2300, 200, "jumpBoots");

      this.physics.add.collider(jumpBoots, platforms);
      this.physics.add.overlap(player, jumpBoots, collectJumpBoots, null, this);

      const lifeKits = this.physics.add.group();
      lifeKits.create(300, 500, "lifeKit");
      lifeKits.create(1200, 350, "lifeKit");
      lifeKits.create(2000, 300, "lifeKit");
      lifeKits.create(2800, 150, "lifeKit");

      this.physics.add.collider(lifeKits, platforms);
      this.physics.add.overlap(player, lifeKits, collectLifeKit, null, this);

      speedBoosts = this.physics.add.group();
      speedBoosts.create(500, 300, "speedBoost");

      this.physics.add.collider(speedBoosts, platforms);
      this.physics.add.overlap(
        player,
        speedBoosts,
        collectSpeedBoost,
        null,
        this
      );

      const pistols = this.physics.add.group();
      pistols.create(300, 400, "pistol");
      pistols.create(800, 400, "pistol");
      pistols.create(2000, 300, "pistol");
      pistols.create(3000, 200, "pistol");

      bullets = this.physics.add.group({
        defaultKey: "bullet",
        maxSize: 20,
        runChildUpdate: true,
      });

      this.physics.add.collider(pistols, platforms);
      this.physics.add.overlap(player, pistols, collectPistol, null, this);
      this.physics.add.collider(bullets, platforms, destroyBullet, null, this);

      /**************************** ITEMS *****************************/

      diamonds = this.physics.add.group();
      diamonds.create(200, 400, "diamond");
      diamonds.create(600, 300, "diamond");
      diamonds.create(1000, 500, "diamond");

      diamonds.children.iterate(function (child) {
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
      });

      this.physics.add.collider(diamonds, platforms);
      this.physics.add.overlap(player, diamonds, collectDiamond, null, this);

      stars = this.physics.add.group();
      stars.create(100, 300, "star");
      stars.create(400, 500, "star");
      stars.create(700, 200, "star");

      stars.children.iterate(function (child) {
        child.setBounceY(Phaser.Math.FloatBetween(0.6, 0.8));
      });

      this.physics.add.collider(stars, platforms);
      this.physics.add.overlap(player, stars, collectStar, null, this);

      /**************************** SCORE *****************************/

      scoreText = this.add
        .text(16, 50, "Score: 0", {
          fontSize: "32px",
          fill: "#000",
        })
        .setScrollFactor(0);

      cursors = this.input.keyboard.createCursorKeys();

      /**************************** LIVES *****************************/

      hearts = this.add.group({
        key: "heart",
        repeat: 2,
        setXY: { x: 16, y: 16, stepX: 40 },
      });

      hearts.children.iterate(function (child) {
        child.setScrollFactor(0);
      });

      /**************************** ENEMIES *****************************/

      ducks = this.physics.add.group();
      const duckPositions = [
        { x: 600, y: 500 },
        { x: 800, y: 300 },
        { x: 1200, y: 400 },
        { x: 1600, y: 350 },
      ];

      duckPositions.forEach((pos) => {
        const duck = ducks.create(pos.x, pos.y, "duck");
        duck.setBounce(1);
        duck.setCollideWorldBounds(true);
        duck.setVelocity(Phaser.Math.Between(-100, 100), 20);
      });

      this.physics.add.collider(ducks, platforms);
      this.physics.add.collider(player, ducks, hitduck, null, this);

      this.anims.create({
        key: "chickenWalk",
        frames: this.anims.generateFrameNumbers("chicken", {
          start: 0,
          end: 13,
        }),
        frameRate: 10,
        repeat: -1,
      });

      chickens = this.physics.add.group();
      const chicken1 = chickens
        .create(600, 500, "chicken")
        .setVelocityX(100)
        .anims.play("chickenWalk", true);
      const chicken2 = chickens
        .create(1200, 400, "chicken")
        .setVelocityX(100)
        .anims.play("chickenWalk", true);
      const chicken3 = chickens
        .create(1800, 350, "chicken")
        .setVelocityX(100)
        .anims.play("chickenWalk", true);

      this.time.addEvent({
        delay: Phaser.Math.Between(2000, 4000),
        callback: () => changechickenDirection(chicken1),
        loop: true,
      });

      this.time.addEvent({
        delay: Phaser.Math.Between(2000, 4000),
        callback: () => changechickenDirection(chicken2),
        loop: true,
      });

      this.time.addEvent({
        delay: Phaser.Math.Between(2000, 4000),
        callback: () => changechickenDirection(chicken3),
        loop: true,
      });

      this.physics.add.collider(chickens, platforms);
      this.physics.add.collider(player, chickens, hitchicken, null, this);

      plants = this.physics.add.group();
      peas = this.physics.add.group();

      const plant1 = plants.create(1200, 700, "plant");
      const plant2 = plants.create(1800, 650, "plant");

      this.anims.create({
        key: "plantIdle",
        frames: this.anims.generateFrameNumbers("plant", { start: 0, end: 7 }),
        frameRate: 5,
        repeat: -1,
      });

      plants.children.iterate((plant) => {
        plant.anims.play("plantIdle", true);
      });

      this.time.addEvent({
        delay: 1300,
        callback: () => shootPea(plant1),
        loop: true,
      });

      this.time.addEvent({
        delay: 1300,
        callback: () => shootPea(plant2),
        loop: true,
      });

      this.physics.add.collider(plants, platforms);
      this.physics.add.overlap(player, peas, hitPea, null, this);
      this.physics.add.collider(peas, platforms, destroyPea, null, this);

      this.anims.create({
        key: "camaelonWalk",
        frames: this.anims.generateFrameNumbers("camaelon", {
          start: 0,
          end: 9,
        }),
        frameRate: 25,
        repeat: -1,
      });

      camaelons = this.physics.add.group();

      const camaelon1 = camaelons
        .create(1400, 400, "camaelon")
        .setVelocityX(200)
        .anims.play("camaelonWalk", true);
      const camaelon2 = camaelons
        .create(1900, 350, "camaelon")
        .setVelocityX(250)
        .anims.play("camaelonWalk", true);

      this.time.addEvent({
        delay: Phaser.Math.Between(2000, 4000),
        callback: () => changeCamaelonDirection(camaelon1),
        loop: true,
      });

      this.time.addEvent({
        delay: Phaser.Math.Between(2000, 4000),
        callback: () => changeCamaelonDirection(camaelon2),
        loop: true,
      });

      this.physics.add.collider(camaelons, platforms);
      this.physics.add.collider(player, camaelons, hitCamaelon, null, this);

      this.physics.add.overlap(bullets, ducks, killEnemy, null, this);
      this.physics.add.overlap(bullets, chickens, killEnemy, null, this);
      this.physics.add.overlap(bullets, camaelons, killEnemy, null, this);
    }

    function update() {
      background.tilePositionX = this.cameras.main.scrollX;

      if (cursors.left.isDown) {
        player.setVelocityX(speedBoostActive ? -600 : -150);
        player.anims.play("left", true);
        lastDirection = "left";
      } else if (cursors.right.isDown) {
        player.setVelocityX(speedBoostActive ? 600 : 150);
        player.anims.play("right", true);
        lastDirection = "right";
      } else {
        player.setVelocityX(0);
        player.anims.stop();
        player.setFrame(4);
      }

      if (cursors.up.isDown && player.body.touching.down && !isJumping) {
        player.setVelocityY(jumpBoostActive ? -600 : -350);
        this.sound.play("jumpSound");
        isJumping = true;
      }

      if (player.body.touching.down) {
        isJumping = false;
      }

      chickens.children.iterate(function (chicken) {
        if (chicken.body.blocked.right) {
          chicken.setVelocityX(-100);
          chicken.flipX = true;
        } else if (chicken.body.blocked.left) {
          chicken.setVelocityX(100);
          chicken.flipX = false;
        }
      });

      peas.getChildren().forEach((pea) => {
        if (Math.abs(pea.x - pea.startX) >= 500) {
          pea.destroy();
        }
      });
    }

    /* ITEMS */

    function collectStar(player, star) {
      star.disableBody(true, true);
      score += 10;
      scoreText.setText("Score: " + score);
    }

    function collectDiamond(player, diamond) {
      diamond.disableBody(true, true);
      score += 50;
      scoreText.setText("Score: " + score);
    }

    /* POWER UPS */

    function collectSpeedBoost(player, speedBoost) {
      speedBoost.disableBody(true, true);
      speedBoostActive = true;

      this.sound.play("powerSound");

      this.time.delayedCall(
        10000,
        () => {
          speedBoostActive = false;
        },
        [],
        this
      );
    }

    function collectJumpBoots(player, boots) {
      boots.disableBody(true, true);

      jumpBoostActive = true;

      this.time.delayedCall(
        10000,
        () => {
          jumpBoostActive = false;
        },
        [],
        this
      );
    }

    function collectLifeKit(player, lifeKit) {
      lifeKit.disableBody(true, true);

      if (lives < 3) {
        lives++;
        if (lives > 0) {
          hearts.getChildren()[lives - 1].setVisible(true);
        }
      }
    }

    function collectPistol(player, pistol) {
      pistol.disableBody(true, true);

      const bulletTimer = this.time.addEvent({
        delay: 200,
        callback: fireBullet,
        callbackScope: this,
        args: [player],
        repeat: 24,
      });

      this.time.delayedCall(5000, () => {
        bulletTimer.remove();
      });
    }

    function fireBullet(player) {
      const bullet = bullets.get(player.x, player.y, "bullet");

      if (bullet) {
        bullet.setActive(true);
        bullet.setVisible(true);
        bullet.body.allowGravity = false;

        if (lastDirection === "right") {
          bullet.setVelocityX(400);
        } else if (lastDirection === "left") {
          bullet.setVelocityX(-400);
        }

        this.time.delayedCall(600, () => {
          if (bullet.active) {
            bullet.destroy();
          }
        });
      }
    }

    function destroyBullet(bullet) {
      if (bullet.active) {
        bullet.destroy();
      }
    }

    function killEnemy(bullet, enemy) {
      if (bullet.active) {
        bullet.destroy();
      }

      enemy.disableBody(true, true);
      score += 100;
      scoreText.setText("Score: " + score);

      this.sound.play("hitSound");
    }

    /* ENEMIES */

    function hitduck(player, duck) {
      if (
        (player.body.velocity.y > 0 &&
          duck.body.touching.up &&
          !duck.body.touching.down) ||
        (player.body.touching.down && duck.body.touching.up)
      ) {
        duck.disableBody(true, true);
        score += 100;
        scoreText.setText("Score: " + score);
        player.setVelocityY(-50);

        this.sound.play("hitSound");
      } else {
        loseLife();
        player.setTint(0xff0000);

        this.time.delayedCall(
          500,
          () => {
            player.clearTint();
          },
          [],
          this
        );
      }
    }

    function hitchicken(player, chicken) {
      if (
        (player.body.velocity.y > 0 &&
          chicken.body.touching.up &&
          !chicken.body.touching.down) ||
        (player.body.touching.down && chicken.body.touching.up)
      ) {
        chicken.disableBody(true, true);
        score += 100;
        scoreText.setText("Score: " + score);
        player.setVelocityY(-200);
        this.sound.play("hitSound");
      } else {
        loseLife();
        player.setTint(0xff0000);
        this.time.delayedCall(
          500,
          () => {
            player.clearTint();
          },
          [],
          this
        );
      }
    }

    function changechickenDirection(chicken) {
      const newDirection = Phaser.Math.Between(0, 1) === 0 ? -100 : 100;
      chicken.setVelocityX(newDirection);
      chicken.flipX = newDirection > 0;
    }

    function shootPea(plant) {
      const pea = peas.create(plant.x, plant.y, "pea");
      pea.setVelocityX(-200);
      pea.body.allowGravity = false;
      pea.startX = pea.x;
    }

    function hitPea(player, pea) {
      pea.destroy();
      loseLife();
      player.setTint(0xff0000);
      this.time.delayedCall(
        500,
        () => {
          player.clearTint();
        },
        [],
        this
      );
    }

    function destroyPea(pea) {
      pea.destroy();
    }

    function changeCamaelonDirection(camaelon) {
      const newDirection = Phaser.Math.Between(0, 1) === 0 ? -100 : 100;
      camaelon.setVelocityX(newDirection);
      camaelon.flipX = newDirection > 0; // Girar el sprite según la dirección
    }

    function hitCamaelon(player, camaelon) {
      if (
        (player.body.velocity.y > 0 &&
          camaelon.body.touching.up &&
          !camaelon.body.touching.down) ||
        (player.body.touching.down && camaelon.body.touching.up)
      ) {
        camaelon.disableBody(true, true);
        score += 150;
        scoreText.setText("Score: " + score);

        player.setVelocityY(-300);
        this.sound.play("hitSound");
      } else {
        loseLife();
        player.setTint(0xff0000);
        this.time.delayedCall(
          500,
          () => {
            player.clearTint();
          },
          [],
          this
        );
      }
    }

    /* PLAYER */

    function loseLife() {
      lives--;
      if (lives >= 0) {
        hearts.getChildren()[lives].setVisible(false);
      }

      if (lives === 0) {
        gameOver();
      }
    }

    function gameOver() {
      // this.physics.pause();
      player.setTint(0xff0000);
      player.anims.play("turn");
    }

    return () => {
      game.destroy(true);
    };
  }, []);

  return (
    <div
      ref={gameContainer}
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    ></div>
  );
};

export default Level1;
