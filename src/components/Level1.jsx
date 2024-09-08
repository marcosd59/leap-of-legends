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
      this.load.image("sky", "/assets/level1/sky.png");
      this.load.image("ground", "/assets/level1/platform.png");
      this.load.image("star", "/assets/level1/star.png");
      this.load.image("diamond", "/assets/level1/diamond.png");
      this.load.spritesheet("dude", "/assets/level1/dude.png", {
        frameWidth: 32,
        frameHeight: 48,
      });
      this.load.spritesheet("baddie", "/assets/level1/baddie.png", {
        frameWidth: 32,
        frameHeight: 32,
      });
    }

    let player;
    let platforms;
    let cursors;
    let stars;
    let diamonds;
    let score = 0;
    let scoreText;
    let background;

    function create() {
      background = this.add.tileSprite(0, 0, 1600, 800, "sky");
      background.setOrigin(0).setScrollFactor(0);

      this.cameras.main.setBounds(0, 0, 4000, 800);
      this.physics.world.setBounds(0, 0, 4000, 800);

      platforms = this.physics.add.staticGroup();

      const ground = platforms.create(0, this.scale.height - 32, "ground");
      ground.setScale(30, 2).refreshBody();

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
      this.cameras.main.setBounds(0, 0, 4000, 800);

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

      stars = this.physics.add.group({
        key: "star",
        repeat: 20,
        setXY: { x: 12, y: 0, stepX: 150 },
      });

      stars.children.iterate(function (child) {
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
      });

      this.physics.add.collider(stars, platforms);
      this.physics.add.overlap(player, stars, collectStar, null, this);

      diamonds = this.physics.add.group({
        key: "diamond",
        repeat: 5,
        setXY: { x: 400, y: 0, stepX: 400 },
      });

      diamonds.children.iterate(function (child) {
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
      });

      this.physics.add.collider(diamonds, platforms);
      this.physics.add.overlap(player, diamonds, collectDiamond, null, this);

      scoreText = this.add
        .text(16, 16, "Score: 0", {
          fontSize: "32px",
          fill: "#000",
        })
        .setScrollFactor(0);

      cursors = this.input.keyboard.createCursorKeys();
    }

    function update() {
      background.tilePositionX = this.cameras.main.scrollX;

      if (cursors.left.isDown) {
        player.setVelocityX(-150);
        player.anims.play("left", true);
      } else if (cursors.right.isDown) {
        player.setVelocityX(150);
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
