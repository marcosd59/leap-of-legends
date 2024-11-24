import Phaser from "phaser";

let player;
let bees;
let score = 0;
let lives = 3;
let immunityActive = false;
let scoreText;

export default class Level2 extends Phaser.Scene {
  constructor() {
    super("Level2");
  }

  preload() {
    this.load.image("background", "/assets/level2/background.png");
    this.load.image("player", "/assets/player/player.png");
    this.load.image("bee", "/assets/level2/bee.png");
    this.load.image("heart", "/assets/level2/heart.png");
    this.load.image("imune", "/assets/level2/imun.png");
    this.load.image("star", "/assets/level1/items/pc.png");
    this.load.audio("liveSound", "/assets/sounds/live.mp3");
  }

  create() {
    this.add.image(400, 300, "background");

    // Player setup
    player = this.physics.add.sprite(400, 500, "player");
    player.setCollideWorldBounds(true);

    // Bee group
    bees = this.physics.add.group();

    // Hearts (lives display)
    this.hearts = this.add.group();
    for (let i = 0; i < lives; i++) {
      const heart = this.add.image(50 + i * 30, 50, "heart");
      heart.setScrollFactor(0);
      this.hearts.add(heart);
    }

    // Score display
    scoreText = this.add.text(16, 16, "Puntos: 0", {
      fontSize: "32px",
      fill: "#fff",
    });

    // Spawning bees
    this.time.addEvent({
      delay: 1000,
      callback: this.spawnBee,
      callbackScope: this,
      loop: true,
    });

    // Overlap detection for player and bees
    this.physics.add.overlap(player, bees, (player, bee) =>
      this.hitBee(this, player, bee)
    );

    // Spawn immunity power-ups
    this.time.addEvent({
      delay: 10000,
      callback: this.spawnImmunity,
      callbackScope: this,
      loop: true,
    });
  }

  update() {
    // Player movement logic
    if (this.input.keyboard.isDown(Phaser.Input.Keyboard.KeyCodes.LEFT)) {
      player.setVelocityX(immunityActive ? -200 : -150);
    } else if (this.input.keyboard.isDown(Phaser.Input.Keyboard.KeyCodes.RIGHT)) {
      player.setVelocityX(immunityActive ? 200 : 150);
    } else {
      player.setVelocityX(0);
    }
  }

  spawnBee() {
    const x = Phaser.Math.Between(50, this.scale.width - 50);
    const bee = bees.create(x, 0, "bee");
    bee.setVelocityY(100);
    bee.setCollideWorldBounds(true);
    bee.setBounce(0.5);
  }

  spawnImmunity() {
    const x = Phaser.Math.Between(50, this.scale.width - 50);
    const immunity = this.physics.add.sprite(x, 0, "imune");
    immunity.setVelocityY(150);

    // Overlap detection for player and immunity
    this.physics.add.overlap(player, immunity, (player, immunity) =>
      this.collectImmunity(this, immunity)
    );

    // Remove immunity after 2 seconds
    this.time.delayedCall(2000, () => {
      if (immunity.active) {
        immunity.setAlpha(0.5);
        this.tweens.add({
          targets: immunity,
          alpha: 0,
          duration: 500,
          onComplete: () => {
            immunity.destroy();
          },
        });
      }
    });
  }

  collectImmunity(scene, immunity) {
    immunity.destroy();
    this.activateImmunity(scene);
  }

  activateImmunity(scene) {
    immunityActive = true;
    player.setAlpha(0.5);
    scene.time.delayedCall(10000, () => {
      immunityActive = false;
      player.setAlpha(1);
    });
  }

  hitBee(scene, player, bee) {
    if (!immunityActive) {
      this.loseLife(scene);
      player.setTint(0xff0000);
      scene.time.delayedCall(500, () => player.clearTint());
    } else {
      bee.destroy();
      score += 20;
      scoreText.setText(`Puntos: ${score}`);
    }
  }

  loseLife(scene) {
    lives--;
    const hearts = this.hearts.getChildren();
    if (lives >= 0 && hearts[lives]) {
      hearts[lives].setVisible(false);
    }

    if (lives <= 0) {
      this.endGame(scene);
    }
  }

  endGame(scene) {
    scene.physics.pause();
    player.setTint(0xff0000);

    const gameOverText = scene.add.text(
      scene.scale.width / 2,
      scene.scale.height / 2,
      "Game Over",
      { fontSize: "64px", fill: "#ff0000" }
    );
    gameOverText.setOrigin(0.5, 0.5);

    const restartButton = scene.add.text(
      scene.scale.width / 2,
      scene.scale.height / 2 + 100,
      "Reiniciar",
      { fontSize: "32px", fill: "#ffffff" }
    );
    restartButton.setOrigin(0.5, 0.5);
    restartButton.setInteractive();
    restartButton.on("pointerdown", () => {
      scene.scene.restart();
    });
  }
}