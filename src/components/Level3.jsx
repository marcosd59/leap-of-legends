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
        height: 950,
      },
      physics: {
        default: "arcade",
        arcade: {
          gravity: { y: 800 },
          debug: false, // Desactivado para simplificar
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

    let cursors, personaje, bloques, suelo, items, textScore, scorePerson;
    let enemigos,
      gameOverWindow,
      botonReset,
      game_over,
      final_score,
      musicadefondo;

    function preload() {
      this.load.image("fondo", "/assets/level3/images/universidad.jpg");
      this.load.image("bloques", "/assets/level3/images/mesauni.png");
      this.load.spritesheet(
        "personaje",
        "/assets/level3/images/Person_LLD.png",
        {
          frameWidth: 141,
          frameHeight: 253,
        }
      );
      this.load.image("suelo", "/assets/level3/images/suelo.png");
      this.load.image("item", "/assets/level3/items/chilaquiles.png");
      this.load.image("enemigo", "/assets/level3/enemies/coco.png");
      this.load.image("window", "/assets/level3/images/gameover.png");
      this.load.image("reset", "/assets/level3/images/reset.png");
      this.load.audio("musicfondo", "/assets/level3/images/musicll.mp3");
    }

    function create() {
      game_over = false;

      // Música de fondo con volumen reducido
      musicadefondo = this.sound.add("musicfondo", {
        loop: true,
        volume: 0.2,
      });
      musicadefondo.play();

      // Fondo
      const fondo = this.add.image(930, 475, "fondo");
      fondo.setScale(0.5);

      // Puntuación
      textScore = this.add.text(770, 20, "SCORE: 0", {
        font: "40px Arial Black",
        fill: "#FF0000",
      });
      scorePerson = 0;

      // Enemigos simplificados
      enemigos = this.physics.add.group({
        key: "enemigo",
        setScale: { x: 0.3, y: 0.3 },
        repeat: 1, // Reducido el número de enemigos
        setXY: { x: 500, y: 50, stepX: 800 },
      });

      enemigos.children.iterate((enemigo) => {
        enemigo.setBounce(1);
        enemigo.setVelocityX(30); // Velocidad reducida
        enemigo.setCollideWorldBounds(true);
      });

      // Bloques simplificados
      bloques = this.physics.add.staticGroup();
      bloques.create(350, 800, "bloques").setScale(0.7).refreshBody();
      bloques.create(750, 700, "bloques").setScale(0.7).refreshBody();
      bloques.create(1300, 600, "bloques").setScale(0.7).refreshBody();
      bloques.create(1700, 800, "bloques").setScale(0.7).refreshBody();

      // Suelo
      suelo = this.physics.add.staticGroup();
      for (let x = 90; x <= 1950; x += 155) {
        suelo.create(x, 920, "suelo").setScale(0.1).refreshBody();
      }

      // Personaje
      personaje = this.physics.add.sprite(90, 600, "personaje");
      personaje.setScale(0.75);
      personaje.setSize(140, 255);
      personaje.setCollideWorldBounds(true);

      // Items
      items = this.physics.add.group({
        key: "item",
        setScale: { x: 0.4, y: 0.4 },
        repeat: 2, // Menos items para simplificar
        setXY: { x: 600, y: 50, stepX: 700 },
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
        .setVisible(false);
      botonReset
        .setInteractive()
        .on("pointerdown", () => window.location.reload());
      final_score = this.add
        .text(850, 290, "0", { font: "60px Arial Black", fill: "#FF0000" })
        .setVisible(false);

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
      }
    }

    function desapItem(personaje, item) {
      item.disableBody(true, true);
      scorePerson += 100;
      textScore.setText("SCORE: " + scorePerson);
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
