import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';

function Level2({ loseLife, gameOver, reachGoal }) {
  const gameContainer = useRef(null);

  useEffect(() => {
    let player, cursors, boss, bossHealthBar, background, platforms, bees, bossSpawned, projectiles, beeHits;
    let bossHealth = 100;
    let spawnBeeTimer;
    const projectileSpeed = -400;
    const beeMaxHits = 5;
    let score = 0;
    let powerUps;
    let scoreText;
    let stars;
    let hearts;
    let lives = 3;
    let trophy; // Trofeo
    const config = {
      type: Phaser.AUTO,
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1600,
        height: 800,
      },
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 300 },
          debug: false,
        },
      },
      scene: {
        preload: preload,
        create: create,
        update: update,
      },
      parent: gameContainer.current,
    };

    const game = new Phaser.Game(config);
    
    function preload() {
      
     /******************** TERRENO *********************************/
      // Cargar imágenes del terreno del nivel
      this.load.image("background", "/assets/level2/fondo.jpg");
      this.load.image("ground", "/assets/level2/platform.png");
      this.load.image("heart", "/assets/level2/heart.png");
      this.load.image("goal", "/assets/level2/end.png");
      this.load.spritesheet('bee', '/assets/level2/abej.png',{ frameWidth: 36, frameHeight: 34});
      this.load.spritesheet('player', '/assets/level2/dude.png', { frameWidth: 32, frameHeight: 48 });
      this.load.image("star", "/assets/level2/pc.png");
      this.load.image("imune", "/assets/level2/imun.png");
      this.load.image("velocidad", "/assets/level2/patin.png");
      this.load.image("congela", "/assets/level2/congela.png");
      this.load.image("calavera", "/assets/level2/calavera.png");
      this.load.image("bomba", "/assets/level2/bomba.png");
      //this.load.image('projectile', '/path/to/projectile.png');
    }
    let lastDirection = "right";
    let speedBoostActive = false;
    function create() {
      background = this.add.tileSprite(800, 400, 1600, 800, 'background');
      //this.cameras.main.setBounds(0, 0, 8000, 800);
      //this.physics.world.setBounds(0, 0, 8000, 800);
      platforms = this.physics.add.staticGroup();
      const ground = platforms.create(0, this.scale.height - 1, "ground");
      ground.setScale(20, 2).refreshBody();

      player = this.physics.add.sprite(400, 550, 'player');
      player.setCollideWorldBounds(true);//para que el jugador no salga de la pantalla
      this.physics.add.collider(player, platforms);//para que el jugador no pase a traves de las plataformas
      cursors = this.input.keyboard.createCursorKeys();

      this.anims.create({
        key: "left",
        frames: this.anims.generateFrameNumbers("player", { start: 0, end: 4 }),
        frameRate: 10,
        repeat: -1,
      });

      this.anims.create({
        key: "right",
        frames: this.anims.generateFrameNumbers("player", { start: 4, end: 8 }),
        frameRate: 10,
        repeat: -1,
      });
      
      //Items del personaje
      // Crear un grupo para las estrellas
      stars = this.physics.add.group();

      // Temporizador para generar estrellas
      this.time.addEvent({
      delay: 1000, // Cada 1 segundos
      callback: () => spawnStar(this),
      loop: true,
      });
      /**************************** META *****************************/
      // Crear el objeto meta que el jugador debe alcanzar para completar el nivel

      let trophy; // Trofeo
      // Temporizador de 3:30 minutos para mostrar el trofeo
      this.time.delayedCall(210000, () => spawnTrophy(this), null, this);//210000

      /**************************** SCORE *****************************/
      // Mostrar el puntaje del jugador

      scoreText = this.add
        .text(16, 50, "Score: 0", {
          fontSize: "32px",
          fill: "#000",
        })
        .setScrollFactor(0);

        //cursors = this.input.keyboard.createCursorKeys();

        /**************************** LIVES *****************************/
        // Mostrar las vidas del jugador con íconos de corazones
  
        hearts = this.add.group({
          key: "heart",
          repeat: 2,
          setXY: { x: 16, y: 16, stepX: 40 },
        });
  
        hearts.children.iterate(function (child) {
          child.setScrollFactor(0);
        });
  
      //enemigos abejas

      
      
      bees = this.physics.add.group();
      beeHits = new Map();
      //bees = this.physics.add.sprite(400, 550, 'bee');
      this.anims.create({
        key: 'fly',
        frames: this.anims.generateFrameNumbers('bee', { start: 0, end: 1 }),
        frameRate: 10,
      repeat: -1,});
      beeHits = new Map();

      spawnBeeTimer = this.time.addEvent({
        delay: 250,//tiempo en la que aparecen las abejas
        callback: () => spawnRandomBee(this),
        loop: true,
      });

      projectiles = this.physics.add.group({
        defaultKey: 'projectile',
        maxSize: 10,//numero de proyectiles
      });

      this.input.keyboard.on('keydown-SPACE', () => {
        shootProjectile(this);
      });
  
      bossSpawned = false;

      /*******************Power Ups************************ */
      powerUps = this.physics.add.group();

      // Temporizador para generar ítems cada 0.25 segundos
      this.time.addEvent({
      delay: 20000, // 0.25 segundos
      callback: () => spawnRandomPowerUp(this),
      loop: true,
      });
    }

    function update() {
      //movimiento del personaje
        if (cursors.left.isDown) {
          player.setVelocityX(speedBoostActive ? -300 : -150);
          player.anims.play("left", true);
          lastDirection = "left";
        } else if (cursors.right.isDown) {
          player.setVelocityX(speedBoostActive ? 300 : 150);
          player.anims.play("right", true);
          lastDirection = "right";
        } 
        else {
          player.setVelocityX(0);
          player.anims.stop();
          player.setFrame(4);
        }
  

      Phaser.Actions.Call(bees.getChildren(), (bee) => {
        bee.setVelocityY(100 + Math.random() * 100);
        if (bee.y > 8000) bee.y = -10;//bee.y=600, bee.y=-10
      });
      // Revisa la posición de cada proyectil y destruye los que llegan a la coordenada máxima sin colisionar
    projectiles.getChildren().forEach((projectile) => {
        if (projectile.y <= 20) { // Coordenada máxima en el borde superior de la pantalla
        projectile.destroy();
    }
    });
      if (bossSpawned) {
        updateBossHealthBar();
      }
    }
    function spawnRandomPowerUp(scene) {
      const x = Phaser.Math.Between(50, scene.scale.width - 50); // Posición aleatoria
  const powerUpTypes = ["imune", "velocidad", "congela", "calavera", "bomba"];
  const randomType = Phaser.Utils.Array.GetRandom(powerUpTypes);

  const powerUp = scene.physics.add.sprite(x, 0, randomType);
  powerUp.setVelocityY(150); // Velocidad de caída
  powerUp.setCollideWorldBounds(true);
  powerUps.add(powerUp);

  // Parpadeo y desaparición después de 2 segundos
  scene.time.delayedCall(3000, () => {
    if (powerUp.active) {
      powerUp.setAlpha(0.5);
      scene.tweens.add({
        targets: powerUp,
        alpha: 0,
        duration: 500,
        onComplete: () => {
          powerUp.destroy();
        },
      });
    }
  });
    
      // Colisión con el jugador
      scene.physics.add.collider(powerUp, platforms);
      scene.physics.add.overlap(player, powerUp, () => handlePowerUpCollision(scene, powerUp));
    }    
    
    function handlePowerUpCollision(scene, powerUp) {
      const type = powerUp.texture.key;
      powerUp.destroy(); // Eliminar ítem después de recogerlo
    
      switch (type) {
        case "velocidad":
          applySpeedBoost(scene);
          break;
    
        case "calavera":
          invertControls(scene);
          break;
    
        case "bomba":
          clearScreen(scene);
          break;
    
        case "congela":
          freezeBees(scene);
          break;
    
        case "imune":
          applyImmunity(scene);
          break;
      }
    }
        
    //Función para aplicar el aumento de velocidad
    function applySpeedBoost(scene) {
      speedBoostActive = true;
      scene.time.delayedCall(5000, () => {
        //speedBoostActive = false; // Restaurar velocidad normal
      });
    }    
    //Función para invertir los controles
    function invertControls(scene) {
      let inverted = true;
      scene.time.delayedCall(10000, () => {
        inverted = false; // Restaurar controles normales
      });
    
      cursors.left.isDown = inverted ? cursors.right.isDown : cursors.left.isDown;
      cursors.right.isDown = inverted ? cursors.left.isDown : cursors.right.isDown;
    }    
    //Función para limpiar la pantalla
    function clearScreen(scene) {
      scene.cameras.main.flash(300, 255, 0, 0); // Efecto de pantalla
      powerUps.clear(true, true); // Eliminar ítems
      bees.clear(true, true); // Eliminar abejas
    }
        
    //Función para congelar las abejas
    function freezeBees(scene) {
      bees.children.iterate((bee) => bee.setVelocityY(0)); // Detener abejas
      scene.time.delayedCall(5000, () => {
        bees.children.iterate((bee) => bee.setVelocityY(150)); // Restaurar movimiento
      });
    }    
    //Función para aplicar inmunidad
    function applyImmunity(scene) {
      player.setTint(0x00ff00); // Cambiar color del jugador para indicar inmunidad
      scene.physics.add.overlap(player, bees, (player, bee) => {
        bee.destroy(); // Eliminar abejas al tocarlas
      });
    
      scene.time.delayedCall(10000, () => {
        player.clearTint(); // Restaurar estado normal
        scene.physics.world.removeCollider(player); // Eliminar efecto
      });
    }
        
                      
    //Función para generar las estrellas
    function spawnStar(scene) {
      const x = Phaser.Math.Between(50, scene.scale.width - 50); // Posición horizontal aleatoria
      const star = scene.physics.add.sprite(x, 0, "star");
      star.setVelocityY(150); // Velocidad de caída
      star.setCollideWorldBounds(true);
    
      // Añadir estrella al grupo
      stars.add(star);
    
      // Desaparecer la estrella después de 2 segundos
      scene.time.delayedCall(3000, () => {
        if (star.active) {
          star.setAlpha(0.5); // Parpadeo antes de desaparecer
          scene.tweens.add({
            targets: star,
            alpha: 0,
            duration: 500,
            onComplete: () => {
              star.destroy();
            },
          });
        }
      });
    
      // Colisión con el jugador
      scene.physics.add.collider(star, platforms);
      scene.physics.add.overlap(player, star, () => collectStar(scene, star));
    }
    function collectStar(scene, star) {
      star.destroy(); // Eliminar la estrella del juego
      score += 10; // Incrementar puntuación
      scoreText.setText(`Puntos: ${score}`); // Actualizar texto en pantalla
    }
    
    //Función para actualizar la barra de salud del personaje
    function loseLife(scene) {
      /*if (isInvulnerable) return;

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
      }*/
        lives--;
        const hearts = scene.hearts.getChildren();
        if (lives >= 0 && hearts[lives]) {
          hearts[lives].setVisible(false);
        }

        if (lives <= 0) {
          endGame(scene);
        }
    }
    //Función para crear la meta del nivel
    function spawnTrophy(scene) {
      // Crea el trofeo en el centro superior de la pantalla
      trophy = scene.physics.add.sprite(scene.scale.width / 2, 0, "goal");
      trophy.setVelocityY(100); // Velocidad de caída
      trophy.setCollideWorldBounds(true);
      trophy.setBounce(0.5);
    
      // Colisión del trofeo con plataformas
      scene.physics.add.collider(trophy, platforms); 
      //Colision entre el jugador y el trofeo
      // Colisión del trofeo con el jugador
      scene.physics.add.overlap(player, trophy, () => gameWin(scene));//handleTrophyCollision(scene));
    }
    function gameWin(scene) {
      // Detiene todo movimiento y físicas
      //trophy.setVelocity(0);
      //trophy.setBounce(0);
      scene.physics.pause();
      player.setTint(0x00ff00);
      bees.children.iterate(function (bee) {
        bee.anims.stop();
        bee.body.setVelocity(0);
      });
      //this.sound.play("goalSound", { volume: 1 });
        const victoryText = scene.add.text(
        scene.cameras.main.centerX,
        scene.cameras.main.centerY - 200,
        "¡Nivel completado!",
        { fontSize: "64px", fill: "#fff" }
      );
      victoryText.setOrigin(0.5, 0.5);
      victoryText.setScrollFactor(0);

      const nextLevelButton = scene.add.text(
        scene.cameras.main.centerX,
        scene.cameras.main.centerY - 50,
        "Siguiente Nivel",
        { fontSize: "32px", fill: "#fff" }
      );
      nextLevelButton.setOrigin(0.5, 0.5);
      nextLevelButton.setInteractive();
      nextLevelButton.on("pointerdown", () => {
        window.location.href = "/level3";
      });
      nextLevelButton.setScrollFactor(0);

      const exitButton = scene.add.text(
        scene.cameras.main.centerX,
        scene.cameras.main.centerY + 50,
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
    function spawnRandomBee(scene) {
     
    const randomX = Phaser.Math.Between(50,1550);//scene.scale.width - 100
    const bee = scene.physics.add.sprite(randomX, 0, 'bees');//-50
    bee.setCollideWorldBounds(false);//bee.setFrame(Phaser.Math.Between(0, 5));
    bee.setVelocityY(100 + Math.random() * 100);//bee.setVelocity(Phaser.Math.Between(-50, 50), 100 + Math.random() * 100);
    // Seleccionar marco aleatorio para la abeja
    const randomFrame = Phaser.Math.Between(0, 4);
    bee.setFrame(randomFrame);

    bee.play('fly');

    beeHits.set(bee, 0);

    scene.physics.add.overlap(projectiles, bee, (projectile, bee) => {
      handleBeeHit(scene, bee, projectile);
    });

    scene.physics.add.collider(player, bee, () => hitBee(scene, player, bee));
    //hitBee(scene, player, bee)
  }

    function handleBeeHit(scene, bee, projectile) {
     

    }

    function dropItem(scene, x, y) {
      // Implement item drop, similar to Level 1 logic
    }

    /*function hitBee(scene, player, bee) {
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
    }*/

    function spawnBoss(scene) {
      bossSpawned = true;
      boss = scene.physics.add.sprite(400, 100, 'goal');
      boss.setCollideWorldBounds(true);
      boss.setVelocityX(0);
      scene.physics.add.collider(boss, platforms);
      //scene.physics.add.overlap(projectiles, boss, damageBoss, null, scene);
    }

    function updateBossHealthBar() {
      bossHealthBar.clear();
      bossHealthBar.fillStyle(0xff0000, 1);
      bossHealthBar.fillRect(10, 10, bossHealth, 20);
    }
    function reachGoal(player) {
      this.physics.pause();
        player.setTint(0x00ff00);
      //this.sound.play("goalSound", { volume: 1 });
        const victoryText = this.add.text(
        this.cameras.main.centerX,
        this.cameras.main.centerY - 200,
        "¡Nivel completado!",
        { fontSize: "64px", fill: "#fff" }
      );
      victoryText.setOrigin(0.5, 0.5);
      victoryText.setScrollFactor(0);
        bees.children.iterate(function (bee) {
        bee.anims.stop();
        bee.body.setVelocity(0);
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
        window.location.href = "/level3";
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
    //Función Game Over
    function endGame(scene) {
      scene.physics.pause(); // Pausar toda la física
      player.setTint(0xff0000); // Efecto visual de derrota
      const gameOverText = scene.add.text(
        scene.scale.width / 2,
        scene.scale.height / 2,
        "Game Over",
        { fontSize: "64px", fill: "#ff0000" }
      );
      gameOverText.setOrigin(0.5, 0.5);
    
      // Opcional: Agregar botón para reiniciar el nivel o regresar al menú
      const restartButton = scene.add.text(
        scene.scale.width / 2,
        scene.scale.height / 2 + 100,
        "Reiniciar",
        { fontSize: "32px", fill: "#ffffff" }
      );
      restartButton.setOrigin(0.5, 0.5);
      restartButton.setInteractive();
      restartButton.on("pointerdown", () => {
        scene.scene.restart(); // Reinicia el nivel
      });
    }
    function hitBee(scene, player, bee) {
      if (!immunityActive) {
        loseLife(scene); // Llamar a la función para reducir vida
        player.setTint(0xff0000); // Mostrar daño
        scene.time.delayedCall(500, () => player.clearTint()); // Quitar el tinte rojo tras 0.5 segundos
      } else {
        // Si hay inmunidad, destruir la abeja y sumar puntos
        bee.destroy();
        score += 20; // Ajusta el puntaje según sea necesario
        scoreText.setText(`Puntos: ${score}`);
      }
    }
    
    function damageBoss(boss, projectile) {
      projectile.destroy();
      bossHealth -= 10;
      if (bossHealth <= 0) {
        boss.disableBody(true, true);
        bossSpawned = false;
        reachGoal();
      }
    }

    return () => {
      game.destroy(true);
    };
  }, [loseLife, gameOver, reachGoal]);

  return <div ref={gameContainer} style={{ width: "100vw", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}></div>;
}

export default Level2;


