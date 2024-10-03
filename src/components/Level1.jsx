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
          debug: false,
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
      this.load.image("goal", "/assets/level1/terrain/end.png");

      /******************** ITEMS *********************************/

      this.load.image("star", "/assets/level1/items/star.png");
      this.load.image("diamond", "/assets/level1/items/diamond.png");
      this.load.spritesheet("apple", "/assets/level1/items/apple.png", {
        frameWidth: 32,
        frameHeight: 30,
      });

      /******************** POWER-UPS *********************************/

      this.load.image("speedBoost", "/assets/level1/power-ups/velocidad.png");
      this.load.image("heart", "/assets/level1/power-ups/heart.png");
      this.load.image("lifeKit", "/assets/level1/power-ups/life.png");
      this.load.image("jumpBoots", "/assets/level1/power-ups/boots.png");
      this.load.image("pistol", "/assets/level1/power-ups/pistol.png");
      this.load.image("bullet", "/assets/level1/power-ups/bullet.png");

      /******************** SOUNDS *********************************/

      this.load.audio("liveSound", "/assets/level1/songs/Live.ogg");
      this.load.audio("hitSound", "/assets/level1/songs/Hit.ogg");
      this.load.audio("jumpSound", "/assets/level1/songs/Jump.ogg");
      this.load.audio("speedSound", "/assets/level1/songs/Speed.ogg");
      this.load.audio("bootsSound", "/assets/level1/songs/Boots.ogg");
      this.load.audio("pistolSound", "/assets/level1/songs/Pistol.ogg");

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
    let apples;

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

    let lastDirection = "right";
    let speedBoostActive = false;
    let jumpBoostActive = false;
    let isInvulnerable = false;
    let nextLifeAt = 1000;
    let isJumping = true;

    function create() {
      /**************************** BACKGROUND *****************************/
      background = this.add.tileSprite(0, 0, 20000, 2800, "sky");
      background.setOrigin(0, 0);
      background.setScale(0.5);

      this.cameras.main.setBounds(0, 0, 8000, 800);
      this.physics.world.setBounds(0, 0, 8000, 800);

      platforms = this.physics.add.staticGroup();

      const ground = platforms.create(0, this.scale.height - 32, "ground");
      ground.setScale(60, 2).refreshBody();

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

      /**************************** META *****************************/

      this.goal = this.physics.add.sprite(7900, 705, "goal");
      this.goal.body.allowGravity = false;

      this.physics.add.collider(this.goal, platforms);
      this.physics.add.overlap(player, this.goal, reachGoal, null, this);

      /**************************** PLATAFORMAS *****************************/
      platforms.create(500, 600, "ground").setScale(0.8, 0.8).refreshBody();
      platforms.create(1500, 600, "ground").setScale(0.8, 0.8).refreshBody();
      platforms.create(2000, 400, "ground").setScale(0.8, 0.8).refreshBody();
      platforms.create(2700, 200, "ground").setScale(0.8, 0.8).refreshBody();
      platforms.create(2400, 600, "ground").setScale(0.8, 0.8).refreshBody();
      platforms.create(3000, 400, "ground").setScale(0.8, 0.8).refreshBody();
      platforms.create(3500, 600, "ground").setScale(0.8, 0.8).refreshBody();
      platforms.create(4500, 550, "ground").setScale(0.8, 0.8).refreshBody();
      platforms.create(5000, 600, "ground").setScale(0.8, 0.8).refreshBody();
      platforms.create(5500, 400, "ground").setScale(0.8, 0.8).refreshBody();
      platforms.create(6000, 300, "ground").setScale(0.8, 0.8).refreshBody();
      platforms.create(6700, 200, "ground").setScale(0.8, 0.8).refreshBody();
      platforms.create(7200, 600, "ground").setScale(0.8, 0.8).refreshBody();

      /**************************** POWER UPS *****************************/

      const jumpBoots = this.physics.add.group();
      jumpBoots.create(2700, 600, "jumpBoots");
      jumpBoots.create(5500, 550, "jumpBoots");

      this.physics.add.collider(jumpBoots, platforms);
      this.physics.add.overlap(player, jumpBoots, collectJumpBoots, null, this);

      const lifeKits = this.physics.add.group();
      lifeKits.create(1800, 500, "lifeKit");
      lifeKits.create(4000, 800, "lifeKit");
      lifeKits.create(6000, 500, "lifeKit");

      this.physics.add.collider(lifeKits, platforms);
      this.physics.add.overlap(player, lifeKits, collectLifeKit, null, this);

      speedBoosts = this.physics.add.group();
      speedBoosts.create(3500, 600, "speedBoost");

      this.physics.add.collider(speedBoosts, platforms);
      this.physics.add.overlap(
        player,
        speedBoosts,
        collectSpeedBoost,
        null,
        this
      );

      const pistols = this.physics.add.group();
      pistols.create(2300, 700, "pistol");
      pistols.create(5000, 700, "pistol");

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
      diamonds.create(2600, 110, "diamond");
      diamonds.create(2650, 100, "diamond");
      diamonds.create(2700, 110, "diamond");
      diamonds.create(2750, 100, "diamond");
      diamonds.create(2800, 110, "diamond");
      diamonds.create(6600, 110, "diamond");
      diamonds.create(6650, 100, "diamond");
      diamonds.create(6700, 110, "diamond");
      diamonds.create(6750, 100, "diamond");
      diamonds.create(6800, 110, "diamond");

      diamonds.children.iterate(function (child) {
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
      });

      this.physics.add.collider(diamonds, platforms);
      this.physics.add.overlap(player, diamonds, collectDiamond, null, this);

      stars = this.physics.add.group();
      stars.create(400, 410, "star");
      stars.create(450, 400, "star");
      stars.create(500, 410, "star");
      stars.create(550, 400, "star");
      stars.create(600, 410, "star");
      stars.create(1400, 310, "star");
      stars.create(1450, 300, "star");
      stars.create(1500, 310, "star");
      stars.create(1550, 300, "star");
      stars.create(1600, 310, "star");
      stars.create(1900, 210, "star");
      stars.create(1950, 200, "star");
      stars.create(2000, 210, "star");
      stars.create(2050, 200, "star");
      stars.create(2100, 210, "star");
      stars.create(4400, 410, "star");
      stars.create(4450, 400, "star");
      stars.create(4500, 410, "star");
      stars.create(4550, 400, "star");
      stars.create(4600, 410, "star");
      stars.create(5900, 210, "star");
      stars.create(5950, 200, "star");
      stars.create(6000, 210, "star");
      stars.create(6050, 200, "star");
      stars.create(6100, 210, "star");

      stars.children.iterate(function (child) {
        child.setBounceY(Phaser.Math.FloatBetween(0.6, 0.8));
      });

      this.physics.add.collider(stars, platforms);
      this.physics.add.overlap(player, stars, collectStar, null, this);

      /* APPLES */

      this.anims.create({
        key: "appleSpin",
        frames: this.anims.generateFrameNumbers("apple", { start: 0, end: 16 }),
        frameRate: 16,
        repeat: -1,
      });

      apples = this.physics.add.group();
      apples = this.physics.add.group();
      apples = this.physics.add.group();
      apples = this.physics.add.group();

      apples
        .create(800, 600, "apple")
        .anims.play("appleSpin", true)
        .setScale(1);
      apples
        .create(850, 600, "apple")
        .anims.play("appleSpin", true)
        .setScale(1);
      apples
        .create(900, 600, "apple")
        .anims.play("appleSpin", true)
        .setScale(1);
      apples
        .create(950, 600, "apple")
        .anims.play("appleSpin", true)
        .setScale(1);
      apples
        .create(1000, 600, "apple")
        .anims.play("appleSpin", true)
        .setScale(1);
      apples
        .create(1050, 600, "apple")
        .anims.play("appleSpin", true)
        .setScale(1);
      apples
        .create(1100, 600, "apple")
        .anims.play("appleSpin", true)
        .setScale(1);
      apples
        .create(1150, 600, "apple")
        .anims.play("appleSpin", true)
        .setScale(1);
      apples
        .create(2300, 500, "apple")
        .anims.play("appleSpin", true)
        .setScale(1);
      apples
        .create(2350, 500, "apple")
        .anims.play("appleSpin", true)
        .setScale(1);
      apples
        .create(2400, 500, "apple")
        .anims.play("appleSpin", true)
        .setScale(1);
      apples
        .create(2450, 500, "apple")
        .anims.play("appleSpin", true)
        .setScale(1);
      apples
        .create(2500, 500, "apple")
        .anims.play("appleSpin", true)
        .setScale(1);
      apples
        .create(2900, 300, "apple")
        .anims.play("appleSpin", true)
        .setScale(1);
      apples
        .create(2950, 300, "apple")
        .anims.play("appleSpin", true)
        .setScale(1);
      apples
        .create(3000, 300, "apple")
        .anims.play("appleSpin", true)
        .setScale(1);
      apples
        .create(3050, 300, "apple")
        .anims.play("appleSpin", true)
        .setScale(1);
      apples
        .create(3100, 300, "apple")
        .anims.play("appleSpin", true)
        .setScale(1);
      apples
        .create(3400, 500, "apple")
        .anims.play("appleSpin", true)
        .setScale(1);
      apples
        .create(3450, 500, "apple")
        .anims.play("appleSpin", true)
        .setScale(1);
      apples
        .create(3500, 500, "apple")
        .anims.play("appleSpin", true)
        .setScale(1);
      apples
        .create(3550, 500, "apple")
        .anims.play("appleSpin", true)
        .setScale(1);
      apples
        .create(3600, 500, "apple")
        .anims.play("appleSpin", true)
        .setScale(1);
      apples
        .create(4900, 400, "apple")
        .anims.play("appleSpin", true)
        .setScale(1);
      apples
        .create(4950, 400, "apple")
        .anims.play("appleSpin", true)
        .setScale(1);
      apples
        .create(5000, 400, "apple")
        .anims.play("appleSpin", true)
        .setScale(1);
      apples
        .create(5050, 400, "apple")
        .anims.play("appleSpin", true)
        .setScale(1);
      apples
        .create(5100, 400, "apple")
        .anims.play("appleSpin", true)
        .setScale(1);
      apples
        .create(5400, 300, "apple")
        .anims.play("appleSpin", true)
        .setScale(1);
      apples
        .create(5450, 300, "apple")
        .anims.play("appleSpin", true)
        .setScale(1);
      apples
        .create(5500, 300, "apple")
        .anims.play("appleSpin", true)
        .setScale(1);
      apples
        .create(5550, 300, "apple")
        .anims.play("appleSpin", true)
        .setScale(1);
      apples
        .create(5600, 300, "apple")
        .anims.play("appleSpin", true)
        .setScale(1);
      apples
        .create(7100, 100, "apple")
        .anims.play("appleSpin", true)
        .setScale(1);
      apples
        .create(7150, 100, "apple")
        .anims.play("appleSpin", true)
        .setScale(1);
      apples
        .create(7200, 100, "apple")
        .anims.play("appleSpin", true)
        .setScale(1);
      apples
        .create(7250, 100, "apple")
        .anims.play("appleSpin", true)
        .setScale(1);
      apples
        .create(7300, 100, "apple")
        .anims.play("appleSpin", true)
        .setScale(1);

      this.physics.add.collider(apples, platforms);
      this.physics.add.overlap(player, apples, collectApple, null, this);

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

      // -------------> DUCKS <------------- //

      ducks = this.physics.add.group();

      const duckPositions = [
        { x: 1000, y: 500 },
        { x: 1500, y: 300 },
        { x: 2000, y: 400 },
        { x: 2500, y: 350 },
      ];

      duckPositions.forEach((pos) => {
        const duck = ducks.create(pos.x, pos.y, "duck");
        duck.setBounce(1);
        duck.setCollideWorldBounds(true);
        duck.setVelocity(Phaser.Math.Between(-100, 100), 20);

        duck.flipX = duck.body.velocity.x < 0;
      });

      this.physics.add.collider(ducks, platforms);
      this.physics.add.collider(player, ducks, hitduck, null, this);

      // -------------> CHICKEN <------------- //

      this.anims.create({
        key: "chickenWalk",
        frames: this.anims.generateFrameNumbers("chicken", {
          start: 0,
          end: 13,
        }),
        frameRate: 13,
        repeat: -1,
      });

      chickens = this.physics.add.group();
      const chicken1 = chickens
        .create(2000, 500, "chicken")
        .setVelocityX(100)
        .anims.play("chickenWalk", true);
      const chicken2 = chickens
        .create(2500, 400, "chicken")
        .setVelocityX(100)
        .anims.play("chickenWalk", true);
      const chicken3 = chickens
        .create(3000, 350, "chicken")
        .setVelocityX(100)
        .anims.play("chickenWalk", true);
      const chicken4 = chickens
        .create(3500, 300, "chicken")
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

      this.time.addEvent({
        delay: Phaser.Math.Between(2000, 4000),
        callback: () => changechickenDirection(chicken4),
        loop: true,
      });

      this.physics.add.collider(chickens, platforms);
      this.physics.add.collider(player, chickens, hitchicken, null, this);

      // -------------> PLANT <------------- //

      plants = this.physics.add.group();
      peas = this.physics.add.group();

      const plant1 = plants.create(3000, 400, "plant");
      const plant2 = plants.create(2000, 650, "plant");

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

      // -------------> CAMALEON <------------- //

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
        .create(3500, 400, "camaelon")
        .setVelocityX(200)
        .anims.play("camaelonWalk", true);
      const camaelon2 = camaelons
        .create(4500, 350, "camaelon")
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
        player.setVelocityX(speedBoostActive ? -300 : -150);
        player.anims.play("left", true);
        lastDirection = "left";
      } else if (cursors.right.isDown) {
        player.setVelocityX(speedBoostActive ? 300 : 150);
        player.anims.play("right", true);
        lastDirection = "right";
      } else {
        player.setVelocityX(0);
        player.anims.stop();
        player.setFrame(4);
      }

      if (cursors.up.isDown && player.body.touching.down && !isJumping) {
        player.setVelocityY(jumpBoostActive ? -450 : -350);
        this.sound.play("jumpSound", { volume: 0.8 });
        isJumping = true;
      }

      ducks.children.iterate(function (duck) {
        if (duck.body.velocity.x > 0) {
          duck.flipX = true;
        } else if (duck.body.velocity.x < 0) {
          duck.flipX = false;
        }
      });

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

      if (score >= nextLifeAt) {
        giveExtraLife(this);
        nextLifeAt += 1000;
      }
    }

    function collectDiamond(player, diamond) {
      diamond.disableBody(true, true);
      score += 50;
      scoreText.setText("Score: " + score);

      if (score >= nextLifeAt) {
        giveExtraLife(this);
        nextLifeAt += 1000;
      }
    }

    function collectApple(player, apple) {
      apple.disableBody(true, true);
      score += 30;
      scoreText.setText("Score: " + score);

      if (score >= nextLifeAt) {
        giveExtraLife(this);
        nextLifeAt += 1000;
      }
    }

    /* POWER UPS */

    function collectSpeedBoost(player, speedBoost) {
      speedBoost.disableBody(true, true);
      speedBoostActive = true;

      this.sound.play("speedSound", { volume: 0.1 });

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
      this.sound.play("bootsSound");
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
      this.sound.play("liveSound");
      if (lives < 3) {
        lives++;
        if (lives > 0) {
          hearts.getChildren()[lives - 1].setVisible(true);
        }
      }
    }

    function collectPistol(player, pistol) {
      pistol.disableBody(true, true);
      this.sound.play("pistolSound");
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

    function hitchicken(player, chicken) {
      if (
        (player.body.velocity.y > 0 &&
          chicken.body.touching.up &&
          !chicken.body.touching.down) ||
        (player.body.touching.down && chicken.body.touching.up)
      ) {
        chicken.disableBody(true, true);
        score += 20;
        scoreText.setText("Score: " + score);
        player.setVelocityY(-200);
        this.sound.play("hitSound");

        if (score >= nextLifeAt) {
          giveExtraLife(this);
          nextLifeAt += 1000;
        }
      } else {
        loseLife(this);
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

    function hitduck(player, duck) {
      if (
        (player.body.velocity.y > 0 &&
          duck.body.touching.up &&
          !duck.body.touching.down) ||
        (player.body.touching.down && duck.body.touching.up)
      ) {
        duck.disableBody(true, true);
        score += 20;
        scoreText.setText("Score: " + score);
        player.setVelocityY(-50);
        this.sound.play("hitSound");

        if (score >= nextLifeAt) {
          giveExtraLife(this);
          nextLifeAt += 1000;
        }
      } else {
        loseLife(this);
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
      loseLife(this);
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
      camaelon.flipX = newDirection > 0;
    }

    function hitCamaelon(player, camaelon) {
      if (
        (player.body.velocity.y > 0 &&
          camaelon.body.touching.up &&
          !camaelon.body.touching.down) ||
        (player.body.touching.down && camaelon.body.touching.up)
      ) {
        camaelon.disableBody(true, true);
        score += 20;
        scoreText.setText("Score: " + score);
        player.setVelocityY(-300);
        this.sound.play("hitSound");

        if (score >= nextLifeAt) {
          giveExtraLife(this);
          nextLifeAt += 1000;
        }
      } else {
        loseLife(this);
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

    function loseLife(scene) {
      if (isInvulnerable) return;

      lives--;
      isInvulnerable = true;

      if (lives >= 0) {
        hearts.getChildren()[lives].setVisible(false);
      }

      if (lives === 0) {
        gameOver.call(scene);
      } else {
        const blinkTimer = scene.time.addEvent({
          delay: 100,
          callback: () => {
            player.visible = !player.visible;
          },
          repeat: 30,
        });

        scene.time.delayedCall(3000, () => {
          isInvulnerable = false;
          player.visible = true;
          blinkTimer.remove();
        });
      }
    }

    function giveExtraLife(scene) {
      if (lives < 3) {
        lives++;
        hearts.getChildren()[lives - 1].setVisible(true);
        scene.sound.play("liveSound");
      }
    }

    function reachGoal(player) {
      this.physics.pause();
      player.setTint(0x00ff00);

      const victoryText = this.add.text(
        this.cameras.main.centerX,
        this.cameras.main.centerY - 200,
        "¡Nivel completado!",
        { fontSize: "64px", fill: "#fff" }
      );
      victoryText.setOrigin(0.5, 0.5);
      victoryText.setScrollFactor(0);

      ducks.children.iterate(function (duck) {
        duck.anims.stop();
        duck.body.setVelocity(0);
      });

      chickens.children.iterate(function (chicken) {
        chicken.anims.stop();
        chicken.body.setVelocity(0);
      });

      camaelons.children.iterate(function (camaelon) {
        camaelon.anims.stop();
        camaelon.body.setVelocity(0);
      });

      const nextLevelButton = this.add.text(
        this.cameras.main.centerX,
        this.cameras.main.centerY - 50,
        "Siguiente Nivel",
        { fontSize: "32px", fill: "#fff" }
      );
      nextLevelButton.setOrigin(0.5, 0.5);
      nextLevelButton.setInteractive();
      nextLevelButton.on("pointerdown", () => {
        window.location.href = "/level2";
      });
      nextLevelButton.setScrollFactor(0);

      // Opción para salir
      const exitButton = this.add.text(
        this.cameras.main.centerX,
        this.cameras.main.centerY + 50,
        "Salir",
        { fontSize: "32px", fill: "#fff" }
      );
      exitButton.setOrigin(0.5, 0.5);
      exitButton.setInteractive();
      exitButton.on("pointerdown", () => {
        window.location.href = "/";
      });
      exitButton.setScrollFactor(0);
    }

    function gameOver() {
      this.physics.pause();

      player.setTint(0xff0000);
      player.anims.play("turn");

      ducks.children.iterate(function (duck) {
        duck.anims.stop();
        duck.body.setVelocity(0);
      });

      chickens.children.iterate(function (chicken) {
        chicken.anims.stop();
        chicken.body.setVelocity(0);
      });

      camaelons.children.iterate(function (camaelon) {
        camaelon.anims.stop();
        camaelon.body.setVelocity(0);
      });

      this.input.keyboard.enabled = false;

      const gameOverText = this.add.text(
        this.cameras.main.centerX,
        this.cameras.main.centerY - 100,
        "GAME OVER",
        { fontSize: "64px", fill: "#fff" }
      );
      gameOverText.setOrigin(0.5, 0.5);

      const restartButton = this.add.text(
        this.cameras.main.centerX,
        this.cameras.main.centerY,
        "Reiniciar Nivel",
        { fontSize: "32px", fill: "#fff" }
      );
      restartButton.setOrigin(0.5, 0.5);
      restartButton.setInteractive();
      restartButton.on("pointerdown", () => {
        this.scene.restart();
        this.input.keyboard.enabled = true;
      });

      const exitButton = this.add.text(
        this.cameras.main.centerX,
        this.cameras.main.centerY + 100,
        "Salir",
        { fontSize: "32px", fill: "#fff" }
      );
      exitButton.setOrigin(0.5, 0.5);
      exitButton.setInteractive();
      exitButton.on("pointerdown", () => {
        window.location.href = "/";
      });

      gameOverText.setScrollFactor(0);
      restartButton.setScrollFactor(0);
      exitButton.setScrollFactor(0);

      this.input.keyboard.on("keydown-R", () => {
        this.scene.restart();
        this.input.keyboard.enabled = true;
      });

      this.input.keyboard.on("keydown-r", () => {
        this.scene.restart();
        this.input.keyboard.enabled = true;
      });
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
