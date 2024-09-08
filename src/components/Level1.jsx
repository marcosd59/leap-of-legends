import { useEffect, useRef } from "react";
import Phaser from "phaser";

const Level1 = () => {
  // Referencia al contenedor del juego para que Phaser lo monte dentro del componente de React
  const gameContainer = useRef(null);

  useEffect(() => {
    // Configuración inicial del juego Phaser
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
          gravity: { y: 300 }, // Gravedad del juego (caída de los objetos)
          debug: true, /***** DESACTIVAR PARA LANZAR EL JUEGO ********/
        },
      },
      scene: {
        preload, // Función para precargar los recursos del juego
        create, // Función para crear los elementos del juego
        update, // Función para actualizar el estado del juego en cada frame
      },
      parent: gameContainer.current,
    };

    // Creación de una instancia de Phaser con la configuración dada
    const game = new Phaser.Game(config);

    // Precarga de recursos (imágenes, sprites, etc.)
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

    // Variables globales para los objetos del juego
    let player;
    let platforms;
    let cursors;
    let stars;
    let diamonds;
    let score = 0;
    let scoreText;
    let background;

    // Creación de los elementos del juego
    function create() {
      // Añade un fondo que se repite en el eje X
      background = this.add.tileSprite(0, 0, 1600, 800, "sky");
      background.setOrigin(0).setScrollFactor(0); // Fija el fondo para que no se mueva con la cámara

      // Configura los límites de la cámara y el mundo del juego
      this.cameras.main.setBounds(0, 0, 4000, 800);
      this.physics.world.setBounds(0, 0, 4000, 800);

      // Crea un grupo de plataformas estáticas
      platforms = this.physics.add.staticGroup();

      // Crea la plataforma del suelo
      const ground = platforms.create(0, this.scale.height - 32, "ground");
      ground.setScale(30, 2).refreshBody();

      // Crea otras plataformas estáticas en posiciones específicas
      platforms.create(500, 600, "ground").refreshBody();
      platforms.create(-150, 450, "ground").refreshBody();
      platforms.create(850, 350, "ground").refreshBody();
      platforms.create(100, 200, "ground").refreshBody();
      platforms.create(1500, 400, "ground").refreshBody();
      platforms.create(2500, 250, "ground").refreshBody();

      // Crea el jugador y configura sus propiedades físicas
      player = this.physics.add.sprite(32, this.scale.height - 150, "dude");
      player.setBounce(0.2); // Establece el rebote del jugador
      player.setCollideWorldBounds(true); // Previene que el jugador salga de los límites del mundo

      // Configura la cámara para que siga al jugador
      this.cameras.main.startFollow(player);
      this.cameras.main.setBounds(0, 0, 4000, 800);

      // Añade colisiones entre el jugador y las plataformas
      this.physics.add.collider(player, platforms);

      // Define las animaciones del jugador
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

      // Crea un grupo de estrellas colectables
      stars = this.physics.add.group({
        key: "star",
        repeat: 20, // Número de estrellas
        setXY: { x: 12, y: 0, stepX: 150 }, // Posición inicial y espaciado
      });

      // Configura el rebote de cada estrella
      stars.children.iterate(function (child) {
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
      });

      // Añade colisiones entre las estrellas y las plataformas
      this.physics.add.collider(stars, platforms);

      // Detecta cuando el jugador recoge una estrella
      this.physics.add.overlap(player, stars, collectStar, null, this);

      // Crea un grupo de diamantes colectables
      diamonds = this.physics.add.group({
        key: "diamond",
        repeat: 5, // Número de diamantes
        setXY: { x: 400, y: 0, stepX: 400 }, // Posición inicial y espaciado
      });

      // Configura el rebote de cada diamante
      diamonds.children.iterate(function (child) {
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
      });

      // Añade colisiones entre los diamantes y las plataformas
      this.physics.add.collider(diamonds, platforms);

      // Detecta cuando el jugador recoge un diamante
      this.physics.add.overlap(player, diamonds, collectDiamond, null, this);

      // Muestra la puntuación en la pantalla
      scoreText = this.add
        .text(16, 16, "Score: 0", {
          fontSize: "32px",
          fill: "#000",
        })
        .setScrollFactor(0); // El texto de la puntuación permanece fijo en la pantalla

      // Configura los controles del teclado
      cursors = this.input.keyboard.createCursorKeys();
    }

    // Actualiza el estado del juego en cada frame
    function update() {
      // Hace que el fondo se mueva con la cámara para dar la ilusión de desplazamiento
      background.tilePositionX = this.cameras.main.scrollX;

      // Maneja el movimiento del jugador basado en las teclas presionadas
      if (cursors.left.isDown) {
        player.setVelocityX(-150); // Mueve el jugador hacia la izquierda
        player.anims.play("left", true); // Reproduce la animación de caminar hacia la izquierda
      } else if (cursors.right.isDown) {
        player.setVelocityX(150); // Mueve el jugador hacia la derecha
        player.anims.play("right", true); // Reproduce la animación de caminar hacia la derecha
      } else {
        player.setVelocityX(0); // Detiene el movimiento horizontal del jugador
        player.anims.stop(); // Detiene la animación
        player.setFrame(4); // Cambia a la posición neutral
      }

      // Permite que el jugador salte si está en el suelo
      if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-350); // Aplica una fuerza de salto
      }
    }

    // Función que se llama cuando el jugador recoge una estrella
    function collectStar(player, star) {
      star.disableBody(true, true); // Desactiva la estrella recogida
      score += 10; // Aumenta la puntuación
      scoreText.setText("Score: " + score); // Actualiza el texto de la puntuación
    }

    // Función que se llama cuando el jugador recoge un diamante
    function collectDiamond(player, diamond) {
      diamond.disableBody(true, true); // Desactiva el diamante recogido
      score += 50; // Aumenta la puntuación
      scoreText.setText("Score: " + score); // Actualiza el texto de la puntuación
    }

    // Limpia el juego cuando el componente se desmonta
    return () => {
      game.destroy(true);
    };
  }, []);

  // Renderiza el contenedor del juego
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
