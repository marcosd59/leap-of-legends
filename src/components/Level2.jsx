/*import React, { useEffect ,useRef} from 'react';
import Phaser from 'phaser';
import Level1 from './Level1'; // Importar si necesitas funciones compartidas

let player, cursors, boss, bossHealthBar, background, platforms, bees, bossSpawned;
let bossHealth = 100;
let spawnBeeTimer;

function Level2({ loseLife, gameOver, reachGoal })  {

    useEffect(() => {
        const gameContainer = useRef(null);
        const config = {
            type: Phaser.AUTO,
            scale:{
                mode: Phaser.Scale.FIT,
                autoCenter: Phaser.Scale.CENTER_BOTH,
                width: 1600,//800,
                height: 800,//600,
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
            // Cargar imágenes de fondo, plataformas, jugador, abejas y jefe
            this.load.image('background', '/assets/level2/fondo.jpg');
            this.load.image('platform', '/path/to/platform.png');
            this.load.image('boss', '/path/to/boss.png');
            for (let i = 1; i <= 5; i++) {
                this.load.image(`bee${i}`, `/path/to/bee${i}.png`);
            }
            this.load.spritesheet('player', '/assets/level2/personaj.png',{frameWidth: 32,
                frameHeight: 48,}); // Imagen del personaje principal
        }
        
        
    
        function create() {
            // Fondo y desplazamiento
            background = this.add.tileSprite(400, 300, 800, 600, 'background');
            
            //Animación del personaje principal

            player = this.physics.add.sprite(32, this.scale.height - 150, "player");
            //player.setBounce(0.2);
            player.setCollideWorldBounds(true);

            this.cameras.main.startFollow(player);
            //this.physics.add.collider(player);

            this.anims.create({
                key: "left",
                frames: this.anims.generateFrameNumbers("player", { start: 0, end: 5 }),
                frameRate: 10,
                repeat: -1,
            });
    
            this.anims.create({
                key: "right",
                frames: this.anims.generateFrameNumbers("player", { start: 5, end: 11 }),
                frameRate: 10,
                repeat: -1,
            });

            // Crear plataformas
            platforms = this.physics.add.staticGroup();
            platforms.create(400, 500, 'platform').setScale(0.5).refreshBody();
            platforms.create(600, 400, 'platform').setScale(0.5).refreshBody();
            platforms.create(200, 300, 'platform').setScale(0.5).refreshBody();

            // Configuración del jugador (personaje principal)
            player = this.physics.add.sprite(400, 550, 'player');
            player.setCollideWorldBounds(true);
            this.physics.add.collider(player, platforms);

            cursors = this.input.keyboard.createCursorKeys();

            // Grupo de abejas
            bees = this.physics.add.group();

            // Temporizador para generar abejas de forma aleatoria
            spawnBeeTimer = this.time.addEvent({
                delay: 1000, // Intervalo en milisegundos entre cada aparición de abejas
                callback: () => spawnRandomBee(this),
                loop: true,
            });

            // Crear barra de salud del jefe
            bossHealthBar = this.add.graphics();
            bossHealthBar.fillStyle(0xff0000, 1);

            bossSpawned = false; // Inicialmente, el jefe no ha aparecido
        }

        function update() {
            // Desplazamiento del fondo hacia arriba
            background.tilePositionY += 1;

            // Movimiento del jugador
            if (cursors.left.isDown) {
                player.setVelocityX(-160);
            } else if (cursors.right.isDown) {
                player.setVelocityX(160);
            } else {
                player.setVelocityX(0);
            }

            if (cursors.up.isDown && player.body.touching.down) {
                player.setVelocityY(-330);
            }

            // Aumentar velocidad de las abejas con el tiempo
            bees.children.iterate((bee) => {
                bee.setVelocityY(100 + Math.random() * 100);
                if (bee.y > 600) bee.y = -10;
            });

            // Activar el jefe cuando el fondo ha avanzado lo suficiente
            if (!bossSpawned && background.tilePositionY > 1500) {
                spawnBoss(this);
            }

            // Actualizar barra de salud del jefe
            if (bossSpawned) {
                updateBossHealthBar();
            }
        }

        function spawnRandomBee(scene) {
            const randomX = Phaser.Math.Between(50, 750); // Posición X aleatoria
            const randomBeeType = `bee${Phaser.Math.Between(1, 5)}`; // Selección aleatoria de la imagen de abeja
            const bee = scene.physics.add.sprite(randomX, -50, randomBeeType);
            bee.setVelocityY(100 + Math.random() * 100); // Velocidad inicial aleatoria
            bees.add(bee);

            // Detectar colisiones entre jugador y abejas
            scene.physics.add.collider(player, bee, hitBee, null, scene);
        }

        function hitBee(player, bee) {
            bee.destroy(); // Destruir la abeja al colisionar
            loseLife(); // Llamar a la función para perder una vida
        }

        function spawnBoss(scene) {
            bossSpawned = true;
            boss = scene.physics.add.sprite(400, 100, 'boss');
            boss.setCollideWorldBounds(true);
            boss.setVelocityX(50);
            scene.physics.add.collider(boss, platforms);
            scene.physics.add.overlap(player, boss, damageBoss, null, scene);
        }

        function updateBossHealthBar() {
            bossHealthBar.clear();
            bossHealthBar.fillStyle(0xff0000, 1);
            bossHealthBar.fillRect(10, 10, bossHealth, 20);
        }

        function damageBoss() {
            bossHealth -= 10;
            if (bossHealth <= 0) {
                boss.disableBody(true, true);
                bossSpawned = false;
                reachGoal(); // Reutilizamos reachGoal para completar el nivel
            }
        }

        return () => {
            game.destroy(true);
        };
    }, [loseLife, gameOver, reachGoal]);

    return <div id="game-container" />;
}

export default Level2;*/

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
      //this.load.image('background', '/assets/level2/fondo.jpg');
      //this.load.image('platform', '/path/to/platform.png');
      //this.load.spritesheet('boss', '/path/to/boss_sprite.png', { frameWidth: 64, frameHeight: 64 });
      /*for (let i = 1; i <= 5; i++) {
        this.load.spritesheet(`bee${i}`, `/assets/level2/bee${i}_abej.png`, { frameWidth: 32, frameHeight: 32 });
      }*/
     /******************** TERRENO *********************************/
      // Cargar imágenes del terreno del nivel
      this.load.image("background", "/assets/level2/fondo.jpg");
      this.load.image("ground", "/assets/level2/platform.png");
      //this.load.image("goal", "/assets/level1/terrain/end.png");
     this.load.spritesheet('bee', '/assets/level2/abej.png',{ frameWidth: 32, frameHeight: 48});
      this.load.spritesheet('player', '/assets/level2/personaj.png', { frameWidth: 32, frameHeight: 48 });
      this.load.image('projectile', '/path/to/projectile.png');
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
      //background = this.add.tileSprite(800, 400,'background');
      /*platforms = this.physics.add.staticGroup();
      platforms.create(400, 500, 'platform').setScale(0.5).refreshBody();
      platforms.create(600, 400, 'platform').setScale(0.5).refreshBody();
      platforms.create(200, 300, 'platform').setScale(0.5).refreshBody();*/

      player = this.physics.add.sprite(400, 550, 'player');
      player.setCollideWorldBounds(true);//para que el jugador no salga de la pantalla
      this.physics.add.collider(player, platforms);//para que el jugador no pase a traves de las plataformas
      cursors = this.input.keyboard.createCursorKeys();

      this.anims.create({
        key: "left",
        frames: this.anims.generateFrameNumbers("player", { start: 2, end: 4 }),
        frameRate: 10,
        repeat: -1,
      });

      this.anims.create({
        key: "right",
        frames: this.anims.generateFrameNumbers("player", { start: 7, end: 9 }),
        frameRate: 10,
        repeat: -1,
      });

      //enemigos abejas

      this.anims.create({
        key: 'fly',
        frames: this.anims.generateFrameNumbers('bee', { start: 0, end: 1 }),
        frameRate: 10,
      repeat: -1,
      });
  
  /*this.anims.create({
    key: 'fly1',
    frames: this.anims.generateFrameNumbers('bee', { start: 1, end: 2 }),
    frameRate: 10,
    repeat: -1,
  });
  
  this.anims.create({
    key: 'fly2',
    frames: this.anims.generateFrameNumbers('bee', { start: 2, end: 3 }),
    frameRate: 10,
    repeat: -1,
  });
  
  this.anims.create({
    key: 'fly3',
    frames: this.anims.generateFrameNumbers('bee', { start: 3, end: 4 }),
    frameRate: 10,
    repeat: -1,
  });
  
  this.anims.create({
    key: 'fly4',
    frames: this.anims.generateFrameNumbers('bee', { start: 4, end: 5 }),
    frameRate: 10,
    repeat: -1,
  });
  
  this.anims.create({
    key: 'fly5',
    frames: this.anims.generateFrameNumbers('bee', { start: 5, end: 6 }),
    frameRate: 10,
    repeat: -1,
  });*/

      //chickens = this.physics.add.group()
      
      bees = this.physics.add.group();
      //bees = this.physics.add.sprite(400, 550, 'bee');
      /*this.anims.create({
        //key: "left",
        frames: this.anims.generateFrameNumbers("bee", { start: 0, end: 5 }),
        frameRate: 10,
        repeat: -1,
      });*/
      beeHits = new Map();

      spawnBeeTimer = this.time.addEvent({
        delay: 1000,
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

      bossHealthBar = this.add.graphics();
      bossHealthBar.fillStyle(0xff0000, 1);
      bossSpawned = false;

      this.time.delayedCall(90000, () => {
        spawnBoss(this);
      });
    }

    function update() {
      //movimiento del personaje
      //background.tilePositionY += 1;

      /*if (cursors.left.isDown) {
        player.setVelocityX(-160);
        player.anims.play("left", true);
        lastDirection = "left";
      } else if (cursors.right.isDown) {
        player.setVelocityX(160);
      } else {
        player.setVelocityX(0);
      }*/

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
  

      /*if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-330);
      }*/

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

    function spawnRandomBee(scene) {
      /*const randomX = Phaser.Math.Between(50, 1550);
      const randomy = Phaser.Math.Between(50, 750);
      const randomBeeType = `bee${Phaser.Math.Between(0, 5)}`;
      const bee = scene.physics.add.sprite(randomX, -50, randomBeeType);
      bee.setVelocityY(100 + Math.random() * 100);
      bees.add(bee);
      beeHits.set(bee, 0);

      scene.physics.add.overlap(projectiles, bee, (projectile, bee) => {
        handleBeeHit(scene, bee, projectile);
      });

      scene.physics.add.collider(player, bee, () => hitBee(scene, player, bee));*/
      /*const randomX = Phaser.Math.Between(50, 1550); // Posición X aleatoria
    const bee = scene.physics.add.sprite(randomX, -50, 'bee'); // Usar siempre el spritesheet 'bee'

    // Seleccionar un frame aleatorio del spritesheet
    const randomFrame = Phaser.Math.Between(0, 5); // Ajusta según la cantidad de frames en el spritesheet
    bee.setFrame(randomFrame); // Asigna un frame aleatorio

    // Configurar la velocidad de caída
    bee.setVelocityY(100 + Math.random() * 100);

    // Agregar la abeja al grupo
    bees.add(bee);

    // Inicializar el contador de impactos
    beeHits.set(bee, 0);

    // Detectar colisiones entre proyectiles y abejas
    scene.physics.add.overlap(projectiles, bee, (projectile, bee) => {
        handleBeeHit(scene, bee, projectile);
    });

    // Detectar colisiones entre el jugador y las abejas
    scene.physics.add.collider(player, bee, () => hitBee(scene, player, bee))*/
    /*const randomX = Phaser.Math.Between(50, 1550); // Posición X aleatoria
    const bee = scene.physics.add.sprite(randomX, -50, 'bee'); // Usar el spritesheet de las abejas

    // Seleccionar un frame aleatorio (0 a 5)
    const randomFrame = Phaser.Math.Between(0, 5);
    bee.setFrame(randomFrame); // Asigna un frame aleatorio

    // Configurar la velocidad de caída
    bee.setVelocityY(100 + Math.random() * 100);

    // Agregar la abeja al grupo
    bees.add(bee);
    //bees.play('fly'); // Animación de vuelo
    // Inicializar el contador de impactos
    beeHits.set(bee, 0);

    // Detectar colisiones entre proyectiles y abejas
    scene.physics.add.overlap(projectiles, bee, (projectile, bee) => {
        handleBeeHit(scene, bee, projectile);
    });

    // Detectar colisiones entre el jugador y las abejas
    scene.physics.add.collider(player, bee, () => hitBee(scene, player, bee));*/
    const randomX = Phaser.Math.Between(50, 1550);
    const bee = scene.physics.add.sprite(randomX, -50, 'bee');
    bee.setFrame(Phaser.Math.Between(0, 5));
    bee.setVelocityY(100 + Math.random() * 100);
    bees.add(bee);
    //bee.play('fly'); // Reproducir animación de vuelo
     // Reproducir animación de vuelo solo si la abeja está en pantalla
    if (bee.y > 0 && bee.y < scene.scale.height) {
      bee.play('fly');
    }

      /*const randomX = Phaser.Math.Between(50, 1550);
      const bee_Forms = [0, 1, 2, 3, 4, 5]; // Formas de abeja
      const selectedForm = Phaser.Math.RND.pick(beeForms);
      const bee = scene.physics.add.sprite(randomX, -50, 'bee');
      bee.setFrame(selectedForm - 1); // Establecer frame inicial
      bee.setVelocityY(100 + Math.random() * 100);
      bees.add(bee);
  
    // Reproducir animación de vuelo solo para la forma seleccionada
    if (selectedForm === 0) {
      bee.anims.play('fly'); // Animación para forma 1
    } else if (selectedForm === 1) {
      bee.anims.play('fly1'); // Animación para forma 2
    } else if (selectedForm === 2) {
      bee.anims.play('fly2'); // Animación para forma 3
    } else if (selectedForm === 3) {
      bee.anims.play('fly3'); // Animación para forma 4
    } else if (selectedForm === 4) {
      bee.anims.play('fly4'); // Animación para forma 5
    } else if (selectedForm === 5) {
      bee.anims.play('fly5'); // Animación para forma 6
    }*/
  
    beeHits.set(bee, 0);
  
    scene.physics.add.overlap(projectiles, bee, (projectile, bee) => {
      handleBeeHit(scene, bee, projectile);
    });
  
    scene.physics.add.collider(player, bee, () => hitBee(scene, player, bee));
  }

    function handleBeeHit(scene, bee, projectile) {
      /*projectile.destroy();
      beeHits.set(bee, beeHits.get(bee) + 1);

      if (beeHits.get(bee) >= beeMaxHits) {
        bee.destroy();
        beeHits.delete(bee);
        // Drop item occasionally
        if (Math.random() < 0.3) dropItem(scene, bee.x, bee.y);
      }*/
      // Destruir el proyectil al impactar
      /*projectile.destroy();

      // Incrementar el contador de impactos para la abeja
      const hits = beeHits.get(bee) + 1;
      beeHits.set(bee, hits);

      // Verificar si la abeja ha recibido 3 impactos
      if (hits >= 3) {
          // Destruir la abeja tras 3 impactos
          bee.destroy();

          // Opcional: Agregar un efecto o animación al destruir la abeja
          const explosion = scene.add.sprite(bee.x, bee.y, 'explosion');
          explosion.play('explode');
          scene.time.delayedCall(500, () => explosion.destroy());
        }*/

      // Destruir el proyectil al impactar
    projectile.destroy();

    // Incrementar el contador de impactos
    const hits = beeHits.get(bee) + 1;
    beeHits.set(bee, hits);

    // Verificar si la abeja ha recibido 3 impactos
    if (hits >= 3) {
        // Destruir la abeja tras 3 impactos
        bee.destroy();

        // Opcional: Agregar un efecto visual al destruir la abeja
        const explosion = scene.add.sprite(bee.x, bee.y, 'explosion');
        explosion.play('explode');
        scene.time.delayedCall(500, () => explosion.destroy());
    }
    }

    function dropItem(scene, x, y) {
      // Implement item drop, similar to Level 1 logic
    }

    function hitBee(scene, player, bee) {
      bee.destroy();
      loseLife();
    }

    function spawnBoss(scene) {
      bossSpawned = true;
      boss = scene.physics.add.sprite(400, 100, 'boss');
      boss.setCollideWorldBounds(true);
      boss.setVelocityX(50);
      scene.physics.add.collider(boss, platforms);
      scene.physics.add.overlap(projectiles, boss, damageBoss, null, scene);
    }

    function updateBossHealthBar() {
      bossHealthBar.clear();
      bossHealthBar.fillStyle(0xff0000, 1);
      bossHealthBar.fillRect(10, 10, bossHealth, 20);
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


