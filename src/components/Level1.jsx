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
      this.load.image("sky", "/assets/level1/sky.png");
      this.load.image("ground", "/assets/level1/platform.png");
      this.load.image("star", "/assets/level1/star.png");
      this.load.image("diamond", "/assets/level1/diamond.png");
      this.load.image("speedBoost", "/assets/level1/velocidad.png");
      this.load.spritesheet("dude", "/assets/level1/dude.png", {
        frameWidth: 32,
        frameHeight: 48,
      });
      this.load.image("heart", "/assets/level1/heart.png");
      this.load.spritesheet("baddie", "/assets/level1/baddie.png", {
        frameWidth: 32,
        frameHeight: 32,
      });

      // COMENTADO POR AHORA
      // this.load.audio("backgroundMusic", "/assets/level1/music.mp3");
    }

    let player;
    let platforms;
    let cursors;
    let stars;
    let diamonds;
    let speedBoosts;
    let score = 0;
    let scoreText;
    let background;
    let speedBoostActive = true;
    let hearts;
    let lives = 3;
    let baddies;

    function create() {
      background = this.add.tileSprite(0, 0, 8000, 1800, "sky");
      background.setOrigin(0, 0);
      background.setScale(0.5);

      this.cameras.main.setBounds(0, 0, 4000, 800);
      this.physics.world.setBounds(0, 0, 4000, 800);

      platforms = this.physics.add.staticGroup();

      const ground = platforms.create(0, this.scale.height - 32, "ground");
      ground.setScale(60, 2).refreshBody();

      platforms.create(500, 600, "ground").refreshBody();
      platforms.create(-150, 450, "ground").refreshBody();
      platforms.create(850, 350, "ground").refreshBody();
      platforms.create(100, 200, "ground").refreshBody();
      platforms.create(1500, 400, "ground").refreshBody();
      platforms.create(2500, 250, "ground").refreshBody();

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

      // Añadir y reproducir música de fondo
      // const music = this.sound.add("backgroundMusic");
      // music.play({ loop: true }); // Reproducir en bucle

      stars = this.physics.add.group();
      stars.create(100, 300, "star");
      stars.create(400, 500, "star");
      stars.create(700, 200, "star");

      stars.children.iterate(function (child) {
        child.setBounceY(Phaser.Math.FloatBetween(0.6, 0.8));
      });

      this.physics.add.collider(stars, platforms);
      this.physics.add.overlap(player, stars, collectStar, null, this);

      diamonds = this.physics.add.group();
      diamonds.create(200, 400, "diamond");
      diamonds.create(600, 300, "diamond");
      diamonds.create(1000, 500, "diamond");

      diamonds.children.iterate(function (child) {
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
      });

      this.physics.add.collider(diamonds, platforms);
      this.physics.add.overlap(player, diamonds, collectDiamond, null, this);

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

      hearts = this.add.group({
        key: "heart",
        repeat: 2,
        setXY: { x: 16, y: 16, stepX: 40 },
      });

      hearts.children.iterate(function (child) {
        child.setScrollFactor(0);
      });

      scoreText = this.add
        .text(16, 50, "Score: 0", {
          fontSize: "32px",
          fill: "#000",
        })
        .setScrollFactor(0);

      cursors = this.input.keyboard.createCursorKeys();

      baddies = this.physics.add.group();
      const baddie = baddies.create(600, 500, "baddie");

      baddie.setBounce(0);
      baddie.setCollideWorldBounds(true);
      baddie.setVelocity(Phaser.Math.Between(-100, 100), 20);

      this.physics.add.collider(baddies, platforms);
      this.physics.add.collider(player, baddies, hitbaddie, null, this);
    }

    function update() {
      background.tilePositionX = this.cameras.main.scrollX;
      background.tilePositionY = this.cameras.main.scrollY;

      if (cursors.left.isDown) {
        player.setVelocityX(speedBoostActive ? -600 : -150);
        player.anims.play("left", true);
      } else if (cursors.right.isDown) {
        player.setVelocityX(speedBoostActive ? 600 : 150);
        player.anims.play("right", true);
      } else {
        player.setVelocityX(0);
        player.anims.stop();
        player.setFrame(4);
      }

      if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-350);
      }
    }

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

    function collectSpeedBoost(player, speedBoost) {
      speedBoost.disableBody(true, true);
      speedBoostActive = true;

      this.time.delayedCall(
        10000,
        () => {
          speedBoostActive = false;
        },
        [],
        this
      );
    }

    function hitbaddie(player, baddie) {
      if (player.body.velocity.y > 0) {
        baddie.disableBody(true, true);
        score += 100;
        scoreText.setText("Score: " + score);
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
      this.physics.pause();
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
