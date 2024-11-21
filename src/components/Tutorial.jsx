import { useEffect, useRef } from "react";
import Phaser from "phaser";

const LevelTutorial = () => {
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
      this.load.image("sky", "/assets/tutorial/terrain/sky.jpg");
      this.load.image("ground", "/assets/tutorial/terrain/platform.png");
      this.load.image("goal", "/assets/tutorial/terrain/end.png");

      /******************** ITEMS *********************************/
      this.load.image("star", "/assets/tutorial/items/star.png");
      this.load.image("diamond", "/assets/tutorial/items/diamond.png");
      this.load.spritesheet("apple", "/assets/tutorial/items/apple.png", {
        frameWidth: 32,
        frameHeight: 30,
      });

      /******************** POWER-UPS *********************************/
      this.load.image("speedBoost", "/assets/level1/power-ups/velocidad.png");
      this.load.image("pistol", "/assets/level1/power-ups/pistol.png");
      this.load.image("bullet", "/assets/level1/power-ups/bullet.png");
      this.load.image("heart", "/assets/level1/power-ups/heart.png");
      this.load.image("lifeKit", "/assets/level1/power-ups/life.png");
      this.load.image("jumpBoots", "/assets/level1/power-ups/boots.png");

      /******************** SOUNDS *********************************/
      this.load.audio("liveSound", "/assets/tutorial/songs/Live.ogg");
      this.load.audio("hitSound", "/assets/tutorial/songs/Hit.ogg");
      this.load.audio("jumpSound", "/assets/tutorial/songs/Jump.ogg");
      this.load.audio("speedSound", "/assets/tutorial/songs/Speed.ogg");
      this.load.audio("pistolSound", "/assets/tutorial/songs/Pistol.ogg");
      this.load.audio("bootsSound", "/assets/tutorial/songs/Boots.ogg");
      this.load.audio("starSound", "/assets/tutorial/songs/Star.ogg");
      this.load.audio("diamondSound", "/assets/tutorial/songs/Diamond.ogg");
      this.load.audio("appleSound", "/assets/tutorial/songs/Apple.ogg");
      this.load.audio("damageSound", "/assets/tutorial/songs/Damage.ogg");
      this.load.audio("goalSound", "/assets/tutorial/songs/Win.ogg");
      this.load.audio("backgroundMusic", "/assets/tutorial/songs/Music.ogg");
      this.load.audio("gameOverSound", "/assets/tutorial/songs/GameOver.ogg");

      /******************** PLAYER *********************************/
      this.load.spritesheet("dude", "/assets/level1/character/dude.png", {
        frameWidth: 32,
        frameHeight: 48,
      });

      /******************** ENEMIES *********************************/
      this.load.spritesheet("chicken", "/assets/level1/enemies/chicken.png", {
        frameWidth: 32,
        frameHeight: 32,
      });

      this.load.spritesheet("plant", "/assets/level1/enemies/plant.png", {
        frameWidth: 44,
        frameHeight: 42,
      });

      this.load.image("pea", "/assets/level1/enemies/pea.png");
    }

    // Variables globales
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
    let chickens;
    let plants;
    let peas;
    let bullets;
    let lastDirection = "right";
    let speedBoostActive = false;
    let jumpBoostActive = false;
    let isInvulnerable = false;
    let nextLifeAt = 1000;
    let isJumping = false;

    function create() {
      /**************************** BACKGROUND *****************************/
      background = this.add.tileSprite(0, 0, 4000, 800, "sky");
      background.setOrigin(0, 0);
      background.setScale(0.95);

      this.cameras.main.setBounds(0, 0, 4000, 800);
      this.physics.world.setBounds(0, 0, 4000, 800);

      platforms = this.physics.add.staticGroup();

      const ground = platforms.create(0, this.scale.height - 32, "ground");
      ground.setScale(30, 2).refreshBody();

      /**************************** MÚSICA DE FONDO *****************************/
      const music = this.sound.add("backgroundMusic", {
        volume: 0.9,
        loop: true,
      });
      music.play();

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
      this.goal = this.physics.add.sprite(3900, 705, "goal");
      this.goal.body.allowGravity = false;

      this.physics.add.collider(this.goal, platforms);
      this.physics.add.overlap(player, this.goal, reachGoal, null, this);

      /**************************** PLATAFORMAS *****************************/
      platforms.create(500, 600, "ground").setScale(0.5, 0.5).refreshBody();
      platforms.create(1000, 500, "ground").setScale(0.5, 0.5).refreshBody();
      platforms.create(1500, 400, "ground").setScale(0.5, 0.5).refreshBody();
      platforms.create(2000, 300, "ground").setScale(0.5, 0.5).refreshBody();
      platforms.create(2500, 400, "ground").setScale(0.5, 0.5).refreshBody();
      platforms.create(3000, 500, "ground").setScale(0.5, 0.5).refreshBody();
      platforms.create(3500, 600, "ground").setScale(0.5, 0.5).refreshBody();

      /**************************** POWER UPS *****************************/
      const jumpBoots = this.physics.add.group();
      jumpBoots.create(1500, 350, "jumpBoots");

      this.physics.add.collider(jumpBoots, platforms);
      this.physics.add.overlap(player, jumpBoots, collectJumpBoots, null, this);

      const lifeKits = this.physics.add.group();
      lifeKits.create(2500, 350, "lifeKit");

      this.physics.add.collider(lifeKits, platforms);
      this.physics.add.overlap(player, lifeKits, collectLifeKit, null, this);

      speedBoosts = this.physics.add.group();
      speedBoosts.create(2000, 250, "speedBoost");

      this.physics.add.collider(speedBoosts, platforms);
      this.physics.add.overlap(
        player,
        speedBoosts,
        collectSpeedBoost,
        null,
        this
      );

      const pistols = this.physics.add.group();
      pistols.create(3500, 500, "pistol");

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
      diamonds.create(500, 550, "diamond");
      this.physics.add.collider(diamonds, platforms);
      this.physics.add.overlap(player, diamonds, collectDiamond, null, this);

      stars = this.physics.add.group();
      stars.create(1000, 450, "star");
      this.physics.add.collider(stars, platforms);
      this.physics.add.overlap(player, stars, collectStar, null, this);

      this.anims.create({
        key: "appleSpin",
        frames: this.anims.generateFrameNumbers("apple", { start: 0, end: 16 }),
        frameRate: 16,
        repeat: -1,
      });

      apples = this.physics.add.group();
      apples
        .create(3000, 450, "apple")
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

      const chickenPositions = [
        { x: 800, y: 600 },
        { x: 1500, y: 500 },
        { x: 2000, y: 400 },
        { x: 2500, y: 400 },
        { x: 3000, y: 500 },
        { x: 3200, y: 500 },
        { x: 3600, y: 600 },
      ];

      chickenPositions.forEach((pos) => {
        const chicken = chickens.create(pos.x, pos.y, "chicken");
        chicken.setVelocityX(100).anims.play("chickenWalk", true);

        // Cambiar dirección periódicamente
        this.time.addEvent({
          delay: Phaser.Math.Between(2000, 4000),
          callback: () => changeChickenDirection(chicken),
          loop: true,
        });
      });

      this.physics.add.collider(chickens, platforms);
      this.physics.add.collider(player, chickens, hitChicken, null, this);

      // Plantas

      plants = this.physics.add.group();
      peas = this.physics.add.group();

      const plant1 = plants.create(2500, 400, "plant");

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

      this.physics.add.collider(plants, platforms);
      this.physics.add.overlap(player, peas, hitPea, null, this);
      this.physics.add.collider(peas, platforms, destroyPea, null, this);

      /**************************** TUTORIAL MESSAGES *****************************/
      const tutorialMessages = [
        {
          x: 350,
          y: 230,
          message:
            "Objetivo: Llega a la meta con la mayor cantidad de puntos.\nUsa las flechas para moverte y saltar.\nColecciona ítems para ganar puntos.\nDerrota enemigos saltando sobre ellos.",
        },
        {
          x: 700,
          y: 100,
          message: "En cada nivel hay distintos ítems y enemigos.",
        },
        { x: 500, y: 500, message: "Este es un diamante. ¡Vale 50 puntos!" },
        {
          x: 1000,
          y: 400,
          message: "Esta es una estrella. Obtén 10 puntos al recogerla.",
        },
        {
          x: 1500,
          y: 300,
          message:
            "Estas son botas de salto. Te permiten saltar más alto por 10 segundos.",
        },
        {
          x: 2000,
          y: 200,
          message:
            "Este es un aumento de velocidad. Te hace más rápido por 10 segundos.",
        },
        {
          x: 2500,
          y: 300,
          message:
            "Este es un kit de vida. Recupera una vida al recogerlo. Gana una vida extra cada 1000 puntos.",
        },
        {
          x: 2500,
          y: 600,
          message:
            "Los enemigos que lanzan proyectiles son invensibles. ¡Evítalos!",
        },
        { x: 3000, y: 400, message: "Este es una manzana. ¡Vale 30 puntos!" },
        {
          x: 3500,
          y: 550,
          message:
            "Este una pistola. Usalo para matar enemigos por 10 segundos",
        },
        {
          x: 3700,
          y: 700,
          message: "¡Llega a la meta para completar el nivel!",
        },
      ];

      tutorialMessages.forEach((msg) => {
        const tutorialText = this.add.text(msg.x, msg.y - 50, msg.message, {
          fontSize: "20px",
          fill: "#fff",
          backgroundColor: "#000",
          padding: { x: 10, y: 10 },
          wordWrap: { width: 600 },
          align: "center",
        });
        tutorialText.setOrigin(0.5);
        // NOTA: No utilizamos `setScrollFactor` para que el texto sea parte del mundo del juego y no de la cámara.
      });

      this.physics.add.overlap(bullets, chickens, killEnemy, null, this);
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

      if (player.body.touching.down) {
        isJumping = false;
      }
      peas.getChildren().forEach((pea) => {
        if (Math.abs(pea.x - pea.startX) > pea.maxRange) {
          pea.destroy();
        }
      });

      chickens.children.iterate(function (chicken) {
        if (chicken.body.blocked.right) {
          chicken.setVelocityX(-100);
          chicken.flipX = true;
        } else if (chicken.body.blocked.left) {
          chicken.setVelocityX(100);
          chicken.flipX = false;
        }
      });
    }

    /* ITEMS */

    function collectStar(player, star) {
      this.sound.play("starSound", { volume: 1 });
      star.disableBody(true, true);
      score += 10;
      scoreText.setText("Score: " + score);

      if (score >= nextLifeAt) {
        giveExtraLife(this);
        nextLifeAt += 1000;
      }
    }

    function collectDiamond(player, diamond) {
      this.sound.play("diamondSound", { volume: 1 });
      diamond.disableBody(true, true);
      score += 50;
      scoreText.setText("Score: " + score);

      if (score >= nextLifeAt) {
        giveExtraLife(this);
        nextLifeAt += 1000;
      }
    }

    function collectApple(player, apple) {
      this.sound.play("appleSound", { volume: 1 });
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
      this.sound.play("liveSound", { volume: 0.4 });
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

    function hitChicken(player, chicken) {
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

    function changeChickenDirection(chicken) {
      const newDirection = Phaser.Math.Between(0, 1) === 0 ? -100 : 100;
      chicken.setVelocityX(newDirection);
      chicken.flipX = newDirection > 0;
    }

    function shootPea(plant) {
      const pea = peas.create(plant.x, plant.y, "pea");
      pea.setVelocityX(-200);
      pea.body.allowGravity = false;
      pea.startX = pea.x;
      pea.maxRange = 400;
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

    /* PLAYER */

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
      this.sound.play("goalSound", { volume: 1 });
      const victoryText = this.add.text(
        this.cameras.main.centerX,
        this.cameras.main.centerY - 200,
        "¡Nivel completado!",
        { fontSize: "64px", fill: "#fff" }
      );
      victoryText.setOrigin(0.5, 0.5);
      victoryText.setScrollFactor(0);

      chickens.children.iterate(function (chicken) {
        chicken.anims.stop();
        chicken.body.setVelocity(0);
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
        window.location.href = "/level1";
      });
      nextLevelButton.setScrollFactor(0);

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
      this.sound.stopAll();
      this.sound.play("gameOverSound", { volume: 0.7 });

      player.setTint(0xff0000);
      player.anims.play("turn");

      chickens.children.iterate(function (chicken) {
        chicken.anims.stop();
        chicken.body.setVelocity(0);
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
        location.reload();
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
        location.reload();
      });

      this.input.keyboard.on("keydown-r", () => {
        location.reload();
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

export default LevelTutorial;
