import { useEffect, useRef } from "react";
import Phaser from "phaser";

const Level3 = () => {
  const gameContainer = useRef(null);

  useEffect(() => {
    const config = {
      type: Phaser.AUTO,
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1920,
        height: 1080,
      },
      physics: {
        default: "arcade",
        arcade: {
          gravity: { y: 800 },
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

    let cursors,
      personaje,
      bloques,
      suelo,
      items,
      textScore,
      scorePerson,
      levelCompleteText,
      nextButton;
    let enemigos,
      gameOverWindow,
      botonReset,
      botonNext,
      game_over,
      final_score,
      musicadefondo;

    function preload() {
      this.load.image("fondo", "/assets/level3/images/universidad.jpg");
      this.load.image("bloques", "/assets/level3/images/mesauni.png");
      this.load.spritesheet(
        "personaje",
        "/assets/level3/images/personaje.png",
        {
          frameWidth: 278,
          frameHeight: 369,
        }
      );
      this.load.image("suelo", "/assets/level3/images/suelo.png");
      this.load.image("item", "/assets/level3/items/chilaquiles.png");
      this.load.image("enemigo", "/assets/level3/enemies/coco.png");
      this.load.image("window", "/assets/level3/images/gameover.png");
      this.load.image("reset", "/assets/level3/images/reset.png");
      this.load.image("next", "/assets/level3/images/nextbotton.png");
      this.load.audio("musicfondo", "/assets/level3/images/musicll.mp3");
    }

    function create() {
      game_over = false;

      // Música de fondo
      musicadefondo = this.sound.add("musicfondo", {
        loop: true,
        volume: 0.5,
      });
      musicadefondo.play();

      // Fondo
      const fondo = this.add.image(930, 475, "fondo").setScale(0.8);

      // Puntuación
      textScore = this.add.text(770, 20, "SCORE: 0", {
        font: "40px Arial Black",
        fill: "#FF0000",
      });
      scorePerson = 0;

      // Enemigos
      enemigos = this.physics.add.group({
        key: "enemigo",
        setScale: { x: 0.3, y: 0.3 },
        repeat: 0,
        setXY: { x: 1000, y: 50, stepX: 350 },
      });

      enemigos.children.iterate((enemigo) => {
        enemigo.setBounce(1);
        enemigo.setVelocityX(-30);
        enemigo.setCollideWorldBounds(true);
      });

      // Bloques
      bloques = this.physics.add.staticGroup();
      const bloquePosiciones = [
        [250, 300],
        [250, 800],
        [580, 650],
        [850, 350],
        [1050, 650],
        [1280, 400],
        [1550, 700],
        [1800, 500],
      ];
      bloquePosiciones.forEach(([x, y]) => {
        bloques
          .create(x, y, "bloques")
          .setScale(0.7)
          .setSize(270, 120)
          .setOffset(50, 30);
      });

      // Suelo
      suelo = this.physics.add.staticGroup();
      for (let x = 90; x <= 1950; x += 155) {
        suelo
          .create(x, 920, "suelo")
          .setScale(0.1)
          .setSize(240, 120)
          .setOffset(635, 415);
      }

      // Personaje
      personaje = this.physics.add.sprite(90, 400, "personaje");
      personaje.setScale(0.4);
      personaje.setSize(300, 335).setOffset(2, 10);
      personaje.setCollideWorldBounds(true);

      // Ítems
      items = this.physics.add.group({
        key: "item",
        setScale: { x: 0.4, y: 0.4 },
        repeat: 4,
        setXY: { x: 500, y: 50, stepX: 300 },
      });

      items.children.iterate((item) => item.setBounce(0.5));

      // Teclas
      cursors = this.input.keyboard.createCursorKeys();

      // Interfaz de Game Over
      gameOverWindow = this.add
        .image(900, 500, "window")
        .setScale(0.4)
        .setVisible(false);
      botonReset = this.add
        .image(900, 800, "reset")
        .setScale(0.7)
        .setVisible(false)
        .setInteractive()
        .on("pointerdown", () => this.scene.restart());
      botonNext = this.add
        .image(900, 900, "next")
        .setScale(0.2)
        .setVisible(false)
        .setInteractive()
        .on("pointerdown", () => this.scene.start("level4"));
      final_score = this.add
        .text(850, 290, "0", { font: "60px Arial Black", fill: "#FF0000" })
        .setVisible(false);

      // Texto de nivel completado
      levelCompleteText = this.add
        .text(900, 400, "¡Nivel Completado!", {
          font: "64px Arial Black",
          fill: "#00FF00",
        })
        .setOrigin(0.5)
        .setVisible(false);

      // Botón para avanzar al siguiente nivel
      nextButton = this.add
        .text(900, 500, "Siguiente Nivel", {
          font: "40px Arial",
          fill: "#FFFFFF",
          backgroundColor: "#000000",
          padding: { x: 10, y: 10 },
        })
        .setOrigin(0.5)
        .setInteractive()
        .setVisible(false)
        .on("pointerdown", () => {
          window.location.href = "/level4";
        });

      // Colisiones
      this.physics.add.collider(bloques, personaje);
      this.physics.add.collider(suelo, personaje);
      this.physics.add.collider(bloques, items);
      this.physics.add.collider(suelo, items);
      this.physics.add.overlap(personaje, items, desapItem, null, this);
      this.physics.add.collider(bloques, enemigos);
      this.physics.add.overlap(personaje, enemigos, gameOver, null, this);
    }

    function update() {
      if (!game_over) {
        if (cursors.right.isDown) {
          personaje.setVelocityX(180);
        } else if (cursors.left.isDown) {
          personaje.setVelocityX(-180);
        } else {
          personaje.setVelocityX(0);
        }

        if (cursors.up.isDown && personaje.body.touching.down) {
          personaje.setVelocityY(-700);
        }

        // Enemigos persiguen al personaje
        enemigos.children.iterate((enemigo) => {
          if (enemigo.active) {
            this.physics.moveToObject(enemigo, personaje, 50);
          }
        });
      }
    }

    function desapItem(personaje, item) {
      item.disableBody(true, true);
      scorePerson += 100;
      textScore.setText("SCORE: " + scorePerson);

      if (items.countActive() === 0) {
        items.children.iterate((item) => {
          item.enableBody(true, item.x, 10, true, true);
        });
      }

      // Mostrar nivel completado al alcanzar 100 puntos
      if (scorePerson >= 1000) {
        this.physics.pause();
        levelCompleteText.setVisible(true);
        nextButton.setVisible(true);
      }
    }

    function gameOver() {
      game_over = true;
      this.physics.pause();
      gameOverWindow.setVisible(true);
      botonReset.setVisible(true);
      final_score.setVisible(true);
      final_score.setText(scorePerson);
    }

    return () => {
      game.destroy(true);
    };
  }, []);

  return (
    <div ref={gameContainer} style={{ width: "100vw", height: "100vh" }}></div>
  );
};

export default Level3;
