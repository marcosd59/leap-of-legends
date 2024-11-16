import { useEffect, useRef } from "react";
import Phaser from "phaser";

const Level5 = () => {
  const gameContainer = useRef(null);
  let player;
  let score = 0;
  let scoreText;
  let hearts;
  let lives = 3;
  let background;
  let platforms;
  let cursors;
  let boss;
  let bossDuckHealth = 10;
  let bossDuckMaxHealth = 10;
  let bossHealthBar;
  let bossNameText;
  let lastDirection = "right";
  let speedBoostActive = false;
  let jumpBoostActive = false;
  let isInvulnerable = false;
  let isJumping = false;
  let goal;
  let itemSpawnEvent;
  let bossAttackEvent;
  let items;
  let backgroundMusic;

  const preload = function () {
    this.load.image("sky", "/assets/level5/terrain/manglar_bg.png");
    this.load.image("ground", "/assets/level5/terrain/ground.png");
    this.load.image("goal", "/assets/level5/terrain/copa.png");
    this.load.image("platform", "/assets/level5/terrain/platform.png");
    this.load.image("heart", "/assets/level1/power-ups/heart.png");
    this.load.spritesheet("dude", "/assets/level1/character/dude.png", {
      frameWidth: 32,
      frameHeight: 48,
    });
    this.load.spritesheet("boss", "/assets/level5/enemies/boss.png", {
      frameWidth: 46.1,
      frameHeight: 43,
    });
    this.load.image("projectile", "/assets/level1/power-ups/bullet.png");
    this.load.image("jumpBoost", "/assets/level1/power-ups/boots.png");
    this.load.image("speedBoost", "/assets/level1/power-ups/velocidad.png");
    this.load.image("heart", "/assets/level1/power-ups/heart.png");
    this.load.audio("goalSound", "/assets/level1/songs/Win.ogg");
    this.load.audio("damageSound", "/assets/level1/songs/Damage.ogg");
    this.load.audio("gameOverSound", "/assets/level1/songs/GameOver.ogg");
    this.load.audio("hitSound", "/assets/level1/songs/Hit.ogg");
    this.load.audio("music", "/assets/level5/song/music.ogg");
  };

  const create = function () {
    background = this.add.tileSprite(0, 0, 20000, 2800, "sky");
    background.setOrigin(0, 0);
    background.setScale(0.4);
    this.cameras.main.setBounds(0, 0, this.scale.width, this.scale.height);
    this.physics.world.setBounds(0, 0, this.scale.width, this.scale.height);
    platforms = this.physics.add.staticGroup();
    const ground = platforms.create(0, this.scale.height - 32, "ground");
    ground.setScale(60, 2).refreshBody();
    platforms.create(400, 300, "platform");
    platforms.create(400, 600, "platform");
    platforms.create(800, 450, "platform");
    platforms.create(1200, 300, "platform");
    platforms.create(1200, 600, "platform");
    scoreText = this.add
      .text(16, 50, "Score: 0", {
        fontSize: "32px",
        fill: "#FFFFFF",
      })
      .setScrollFactor(0);
    cursors = this.input.keyboard.createCursorKeys();
    hearts = this.add.group({
      key: "heart",
      repeat: 2,
      setXY: { x: 16, y: 16, stepX: 40 },
    });
    hearts.children.iterate(function (child) {
      child.setScrollFactor(0);
    });
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
    boss = this.physics.add.sprite(1500, 500, "boss");
    boss.setBounce(0.2);
    boss.setCollideWorldBounds(true);
    this.anims.create({
      key: "bossLeft",
      frames: this.anims.generateFrameNumbers("boss", { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "bossRight",
      frames: this.anims.generateFrameNumbers("boss", { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1,
    });
    this.physics.add.collider(boss, platforms);
    this.physics.add.collider(player, boss, hitBoss, null, this);
    bossHealthBar = this.add.graphics();
    updateBossHealthBar();
    bossNameText = this.add.text(this.cameras.main.width - 216, 40, "Boss", {
      fontSize: "20px",
      fill: "#FFFFFF",
    });
    bossNameText.setScrollFactor(0);
    boss.projectiles = this.physics.add.group({
      defaultKey: "projectile",
      maxSize: 10,
    });
    this.physics.add.collider(player, boss.projectiles, hitByProjectile, null, this);
    bossAttackEvent = this.time.addEvent({
      delay: 5000,
      callback: bossAttack,
      callbackScope: this,
      loop: true,
    });
    items = this.physics.add.group();
    itemSpawnEvent = this.time.addEvent({
      delay: 3000,
      callback: spawnItem,
      callbackScope: this,
      loop: true,
    });
    this.physics.add.collider(items, platforms);
    this.physics.add.overlap(player, items, collectItem, null, this);

    // Reproducir música de fondo
    backgroundMusic = this.sound.add("music", { loop: true });
    backgroundMusic.play();
  };

  const update = function () {
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
      isJumping = true;
    }
    if (player.body.touching.down) {
      isJumping = false;
    }
    if (boss.body.velocity.x < 0) {
      boss.anims.play("bossLeft", true);
    } else if (boss.body.velocity.x > 0) {
      boss.anims.play("bossRight", true);
    }
    if (boss.visible && this.cameras.main.worldView.contains(boss.x, boss.y)) {
      updateBossHealthBar.call(this);
      bossNameText.setVisible(true);
    } else {
      bossHealthBar.clear();
      bossNameText.setVisible(false);
    }
    if (player.x < boss.x) {
      boss.setVelocityX(-125);
    } else if (player.x > boss.x) {
      boss.setVelocityX(125);
    }
    if (player.y < boss.y) {
      boss.setVelocityY(-120);
    } else if (player.y > boss.y) {
      boss.setVelocityY(120);
    }
  };

  function loseLife(scene) {
    if (isInvulnerable) return;
    lives--;
    isInvulnerable = true;
    scene.sound.play("damageSound", { volume: 0.3 });
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

  function gameOver() {
    this.physics.pause();
    this.sound.stopAll();
    this.sound.play("gameOverSound", { volume: 0.7 });
    player.setTint(0xff0000);
    player.anims.play("turn");
    bossAttackEvent.remove();
    itemSpawnEvent.remove();
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
      backgroundMusic.stop();
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
      backgroundMusic.stop();
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

  function updateBossHealthBar() {
    bossHealthBar.clear();
    bossHealthBar.fillStyle(0xff0000, 1);
    bossHealthBar.fillRect(1300, 16, (bossDuckHealth / bossDuckMaxHealth) * 200, 20);
    bossHealthBar.setScrollFactor(0);
  }

  function hitBoss(player, duck) {
    if (
      (player.body.velocity.y > 0 &&
        duck.body.touching.up &&
        !duck.body.touching.down) ||
      (player.body.touching.down && duck.body.touching.up)
    ) {
      bossDuckHealth--;
      player.setVelocityY(-200);
      this.sound.play("hitSound");
      updateBossHealthBar.call(this);
      if (bossDuckHealth <= 0) {
        duck.disableBody(true, true);
        score += 100;
        scoreText.setText("Score: " + score);
        createGoal.call(this);
      }
    } else {
      loseLife(this);
    }
  }

  function hitByProjectile(player, projectile) {
    projectile.destroy();
    loseLife(this);
  }

  function bossAttack() {
    const projectile = boss.projectiles.get(boss.x, boss.y);
    if (projectile) {
      this.physics.moveToObject(projectile, player, 200);
      projectile.body.allowGravity = false;
      projectile.setCollideWorldBounds(true);
      projectile.setBounce(1);
    }
  }

  function spawnItem() {
    const x = Phaser.Math.Between(100, this.physics.world.bounds.width);
    const y = Phaser.Math.Between(100, this.physics.world.bounds.height);
    const itemType = Phaser.Math.Between(0, 2);
    let itemKey;
    if (itemType === 0) {
      itemKey = "speedBoost";
    } else if (itemType === 1) {
      itemKey = "jumpBoost";
    } else {
      itemKey = "heart";
    }
    const item = items.create(x, y, itemKey);
    item.setBounce(0.5);
    item.setCollideWorldBounds(true);
  }

  function collectItem(player, item) {
    item.disableBody(true, true);
    if (item.texture.key === "speedBoost") {
      speedBoostActive = true;
      this.time.delayedCall(5000, () => {
        speedBoostActive = false;
      });
    } else if (item.texture.key === "jumpBoost") {
      jumpBoostActive = true;
      this.time.delayedCall(5000, () => {
        jumpBoostActive = false;
      });
    } else if (item.texture.key === "heart") {
      if (lives < 3) {
        lives++;
        hearts.getChildren()[lives - 1].setVisible(true);
      }
    }
  }

  function createGoal() {
    goal = this.physics.add.sprite(1000, 705, "goal");
    goal.body.allowGravity = false;
    goal.setScale(0.3);
    this.physics.add.collider(goal, platforms);
    this.physics.add.overlap(player, goal, reachGoal, null, this);
  }

  function reachGoal(player) {
    this.physics.pause();
    player.setTint(0x00ff00);
    this.sound.play("goalSound", { volume: 1 });
    bossAttackEvent.remove();
    itemSpawnEvent.remove();
    const victoryText = this.add.text(
      this.cameras.main.centerX,
      this.cameras.main.centerY - 200,
      "Feliciadades has completado el juego!",
      { fontSize: "64px", fill: "#fff" }
    );
    victoryText.setOrigin(0.5, 0.5);
    victoryText.setScrollFactor(0);
    const exitButton = this.add.text(
      this.cameras.main.centerX,
      this.cameras.main.centerY + 50,
      "Salir",
      { fontSize: "32px", fill: "#fff" }
    );
    exitButton.setOrigin(0.5, 0.5);
    exitButton.setInteractive();
    exitButton.on("pointerdown", () => {
      backgroundMusic.stop();
      window.location.href = "/";
    });
    exitButton.setScrollFactor(0);
  }

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

export default Level5;