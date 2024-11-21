import { useEffect, useRef } from "react";
import Phaser from "phaser";

const Level4 = () => {
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
          gravity: { y: 200 }, // Gravedad en el eje Y
          debug: false,
        },
      },
      scene: {
        preload, // Función para cargar recursos
        create, // Función para inicializar el nivel
        update, // Función de actualización en cada frame
      },
      parent: gameContainer.current,
    };

    const game = new Phaser.Game(config);

    // Función para cargar los recursos necesarios antes de iniciar el nivel
    function preload() {
      /******************** TERRENO *********************************/
      // Cargar imágenes del terreno del nivel
      this.load.image("ucaribe", "/assets/level4/terrain/Ucaribe.png");
      this.load.image("ground", "/assets/level4/terrain/BG.png");
      this.load.image("goal", "/assets/level4/terrain/Birrete.png");

      /******************** ITEMS *********************************/
      // Cargar imágenes de los ítems coleccionables del nivel
      this.load.image("star", "/assets/level4/items/star.png");
      this.load.image("diamond", "/assets/level4/items/diamond.png");
      this.load.spritesheet("apple", "/assets/level4/items/apple.png", {
        frameWidth: 32,
        frameHeight: 30,
      });

      /******************** POWER-UPS *********************************/
      // Cargar imágenes de los power-ups
      this.load.image("redBull", "/assets/level4/power-ups/RedBull.png");
      this.load.image("heart", "/assets/level4/power-ups/heart.png");
      this.load.image("lifeKit", "/assets/level4/power-ups/Dardo.png");
      this.load.image("jumpBoots", "/assets/level4/power-ups/Bota.png");
      this.load.image("pistol", "/assets/level4/power-ups/pistol.png");
      this.load.image("bullet", "/assets/level4/power-ups/bullet.png");

      /******************** SOUNDS *********************************/
      // Cargar archivos de sonido para el nivel
      this.load.audio("liveSound", "/assets/level4/songs/Live.ogg");
      this.load.audio("hitSound", "/assets/level4/songs/Hit.ogg");
      this.load.audio("jumpSound", "/assets/level4/songs/Jump.ogg");
      this.load.audio("speedSound", "/assets/level4/songs/Speed.ogg");
      this.load.audio("bootsSound", "/assets/level4/songs/Boots.ogg");
      this.load.audio("pistolSound", "/assets/level4/songs/Pistol.ogg");
      this.load.audio("starSound", "/assets/level4/songs/Star.ogg");
      this.load.audio("diamondSound", "/assets/level4/songs/Diamond.ogg");
      this.load.audio("appleSound", "/assets/level4/songs/Apple.ogg");
      this.load.audio("damageSound", "/assets/level4/songs/Damage.ogg");
      this.load.audio("goalSound", "/assets/level4/songs/Win.ogg");
      this.load.audio("backgroundMusic", "/assets/level4/songs/Music.ogg");
      this.load.audio("gameOverSound", "/assets/level4/songs/GameOver.ogg");

      /******************** PLAYER *********************************/
      // Cargar sprites del personaje principal
      this.load.spritesheet("dave", "/assets/level1/character/dude.png", {
        frameWidth: 32,
        frameHeight: 48,
        // frameHeight: 32,
      });

      /******************** ENEMIES *********************************/
      // Cargar sprites de los enemigos
      this.load.spritesheet("rana", "/assets/level4/enemies/Rana.png", {
        frameWidth: 32,
        frameHeight: 32,
      });

      this.load.spritesheet("zombi", "/assets/level4/enemies/Zombi.png", {
        frameWidth: 32,
        frameHeight: 32,
      });

      this.load.spritesheet("cocodrilo", "/assets/level4/enemies/Cocodrilo.png", {
        frameWidth: 64,
        frameHeight: 32,
      });
      this.load.image("flamaRadioactive", "/assets/level4/enemies/Flama.png");

      this.load.spritesheet("profesor", "/assets/level4/enemies/Profesor.png", {
        frameWidth: 32,
        frameHeight: 32,
      });
    }

    // Variables globales del nivel

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

    let redBulls;
    let bullets;

    let ranas;
    let zombis;
    let cocodrilos;
    let flamaRadioactives;
    let profesors;

    // Estado del jugador (dirección, power-ups activos, etc.)
    let lastDirection = "right";
    let redBullActive = false;
    let jumpBoostActive = false;
    let isInvulnerable = false;
    let nextLifeAt = 1000;
    let isJumping = true;

    // Función que inicializa el nivel
    function create() {
      /**************************** BACKGROUND *****************************/
      // Crear el fondo del nivel y ajustar el tamaño de la cámara

      //background = this.add.tileSprite(0, 0, 8000, 950, "ucaribe");
      background = this.add.image(0,0, "ucaribe");
      background.setOrigin(0, 0);
      //background.setScale(0.5);
      background.setDisplaySize(8000, 1000);

      this.cameras.main.setBounds(0, 0, 8000, 950);
      this.physics.world.setBounds(0, 0, 8000, 950);

      platforms = this.physics.add.staticGroup();

      //const ground = platforms.create(0, this.scale.height - 32, "ground");
      const ground = platforms.create(8000, 850, "ground");
      ground.setScale(60, 0).refreshBody();
      //ground.setScale(1, 1).refreshBody();

      /**************************** MÚSICA DE FONDO *****************************/
      // Reproducir música de fondo

      const music = this.sound.add("backgroundMusic", {
        volume: 0.3,
        loop: true,
      });

      music.play();

      /**************************** PLAYER *****************************/
      // Inicializar al personaje jugador con propiedades como rebote y colisión

      player = this.physics.add.sprite(32, this.scale.height - 150, "dave");
      player.setBounce(0.2);
      player.setCollideWorldBounds(true);

      this.cameras.main.startFollow(player);
      this.physics.add.collider(player, platforms);

      this.anims.create({
        key: "left",
        frames: this.anims.generateFrameNumbers("dave", { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1,
      });

      this.anims.create({
        key: "right",
        frames: this.anims.generateFrameNumbers("dave", { start: 5, end: 8 }),
        // frames: this.anims.generateFrameNumbers("dave", { start: 4, end: 7 }),
        frameRate: 10,
        repeat: -1,
      });

      /**************************** META *****************************/
      // Crear el objeto meta que el jugador debe alcanzar para completar el nivel

      this.goal = this.physics.add.sprite(7900, 830, "goal");
      this.goal.body.allowGravity = false;

      this.physics.add.collider(this.goal, platforms);
      this.physics.add.overlap(player, this.goal, reachGoal, null, this);

      /**************************** PLATAFORMAS *****************************/
      // Crear plataformas en diferentes posiciones

      platforms.create(500, 594, "ground").setScale(0.8, 0.8).refreshBody();
      platforms.create(1500, 594, "ground").setScale(0.8, 0.8).refreshBody();
      platforms.create(2000, 328, "ground").setScale(0.8, 0.8).refreshBody();
      platforms.create(2700, 150, "ground").setScale(0.8, 0.8).refreshBody();
      platforms.create(2400, 594, "ground").setScale(0.8, 0.8).refreshBody();
      platforms.create(3000, 400, "ground").setScale(0.8, 0.8).refreshBody();
      platforms.create(3500, 594, "ground").setScale(0.8, 0.8).refreshBody();
      platforms.create(4500, 550, "ground").setScale(0.8, 0.8).refreshBody();
      platforms.create(5000, 594, "ground").setScale(0.8, 0.8).refreshBody();
      platforms.create(5500, 400, "ground").setScale(0.8, 0.8).refreshBody();
      platforms.create(6000, 300, "ground").setScale(0.8, 0.8).refreshBody();
      platforms.create(6700, 200, "ground").setScale(0.8, 0.8).refreshBody();
      platforms.create(7200, 594, "ground").setScale(0.8, 0.8).refreshBody();

      /**************************** POWER UPS *****************************/
      // Crear los power-ups y añadirles colisiones

      const jumpBoots = this.physics.add.group();
      jumpBoots.create(2700, 600, "jumpBoots");
      jumpBoots.create(5500, 550, "jumpBoots");

      this.physics.add.collider(jumpBoots, platforms);
      this.physics.add.overlap(player, jumpBoots, collectJumpBoots, null, this);

      const lifeKits = this.physics.add.group();
      lifeKits.create(1800, 500, "lifeKit");
      lifeKits.create(4000, 800, "lifeKit");
      lifeKits.create(6000, 500, "lifeKit");

      this.physics.add.collider(lifeKits, platforms);
      this.physics.add.overlap(player, lifeKits, collectLifeKit, null, this);

      redBulls = this.physics.add.group();
      redBulls.create(3500, 600, "redBull");

      this.physics.add.collider(redBulls, platforms);
      this.physics.add.overlap(
        player,
        redBulls,
        collectredBull,
        null,
        this
      );

      const pistols = this.physics.add.group();
      pistols.create(2300, 700, "pistol");
      pistols.create(5000, 700, "pistol");

      bullets = this.physics.add.group({
        defaultKey: "bullet",
        maxSize: 20,
        runChildUpdate: true,
      });

      this.physics.add.collider(pistols, platforms);
      this.physics.add.overlap(player, pistols, collectPistol, null, this);
      this.physics.add.collider(bullets, platforms, destroyBullet, null, this);

      /**************************** ITEMS *****************************/
      // Crear ítems coleccionables (diamantes, estrellas y manzanas)

      diamonds = this.physics.add.group();
      diamonds.create(2600, 110, "diamond");
      diamonds.create(2650, 100, "diamond");
      diamonds.create(2700, 110, "diamond");
      diamonds.create(2750, 100, "diamond");
      diamonds.create(2800, 110, "diamond");
      diamonds.create(6600, 110, "diamond");
      diamonds.create(6650, 100, "diamond");
      diamonds.create(6700, 110, "diamond");
      diamonds.create(6750, 100, "diamond");
      diamonds.create(6800, 110, "diamond");

      diamonds.children.iterate(function (child) {
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
      });

      this.physics.add.collider(diamonds, platforms);
      this.physics.add.overlap(player, diamonds, collectDiamond, null, this);

      stars = this.physics.add.group();
      stars.create(400, 410, "star");
      stars.create(450, 400, "star");
      stars.create(500, 410, "star");
      stars.create(550, 400, "star");
      stars.create(600, 410, "star");
      stars.create(1400, 310, "star");
      stars.create(1450, 300, "star");
      stars.create(1500, 310, "star");
      stars.create(1550, 300, "star");
      stars.create(1600, 310, "star");
      stars.create(1900, 210, "star");
      stars.create(1950, 200, "star");
      stars.create(2000, 210, "star");
      stars.create(2050, 200, "star");
      stars.create(2100, 210, "star");
      stars.create(4400, 410, "star");
      stars.create(4450, 400, "star");
      stars.create(4500, 410, "star");
      stars.create(4550, 400, "star");
      stars.create(4600, 410, "star");
      stars.create(5900, 210, "star");
      stars.create(5950, 200, "star");
      stars.create(6000, 210, "star");
      stars.create(6050, 200, "star");
      stars.create(6100, 210, "star");

      stars.children.iterate(function (child) {
        child.setBounceY(Phaser.Math.FloatBetween(0.6, 0.8));
      });

      this.physics.add.collider(stars, platforms);
      this.physics.add.overlap(player, stars, collectStar, null, this);

      /* APPLES */

      this.anims.create({
        key: "appleSpin",
        frames: this.anims.generateFrameNumbers("apple", { start: 0, end: 16 }),
        frameRate: 16,
        reflamaRadioactivet: -1,
      });

      apples = this.physics.add.group();
      apples = this.physics.add.group();
      apples = this.physics.add.group();
      apples = this.physics.add.group();

      apples
        .create(800, 600, "apple")
        .anims.play("appleSpin", true)
        .setScale(1);
      apples
        .create(850, 600, "apple")
        .anims.play("appleSpin", true)
        .setScale(1);
      apples
        .create(900, 600, "apple")
        .anims.play("appleSpin", true)
        .setScale(1);
      apples
        .create(950, 600, "apple")
        .anims.play("appleSpin", true)
        .setScale(1);
      apples
        .create(1000, 600, "apple")
        .anims.play("appleSpin", true)
        .setScale(1);
      apples
        .create(1050, 600, "apple")
        .anims.play("appleSpin", true)
        .setScale(1);
      apples
        .create(1100, 600, "apple")
        .anims.play("appleSpin", true)
        .setScale(1);
      apples
        .create(1150, 600, "apple")
        .anims.play("appleSpin", true)
        .setScale(1);
      apples
        .create(2300, 500, "apple")
        .anims.play("appleSpin", true)
        .setScale(1);
      apples
        .create(2350, 500, "apple")
        .anims.play("appleSpin", true)
        .setScale(1);
      apples
        .create(2400, 500, "apple")
        .anims.play("appleSpin", true)
        .setScale(1);
      apples
        .create(2450, 500, "apple")
        .anims.play("appleSpin", true)
        .setScale(1);
      apples
        .create(2500, 500, "apple")
        .anims.play("appleSpin", true)
        .setScale(1);
      apples
        .create(2900, 300, "apple")
        .anims.play("appleSpin", true)
        .setScale(1);
      apples
        .create(2950, 300, "apple")
        .anims.play("appleSpin", true)
        .setScale(1);
      apples
        .create(3000, 300, "apple")
        .anims.play("appleSpin", true)
        .setScale(1);
      apples
        .create(3050, 300, "apple")
        .anims.play("appleSpin", true)
        .setScale(1);
      apples
        .create(3100, 300, "apple")
        .anims.play("appleSpin", true)
        .setScale(1);
      apples
        .create(3400, 500, "apple")
        .anims.play("appleSpin", true)
        .setScale(1);
      apples
        .create(3450, 500, "apple")
        .anims.play("appleSpin", true)
        .setScale(1);
      apples
        .create(3500, 500, "apple")
        .anims.play("appleSpin", true)
        .setScale(1);
      apples
        .create(3550, 500, "apple")
        .anims.play("appleSpin", true)
        .setScale(1);
      apples
        .create(3600, 500, "apple")
        .anims.play("appleSpin", true)
        .setScale(1);
      apples
        .create(4900, 400, "apple")
        .anims.play("appleSpin", true)
        .setScale(1);
      apples
        .create(4950, 400, "apple")
        .anims.play("appleSpin", true)
        .setScale(1);
      apples
        .create(5000, 400, "apple")
        .anims.play("appleSpin", true)
        .setScale(1);
      apples
        .create(5050, 400, "apple")
        .anims.play("appleSpin", true)
        .setScale(1);
      apples
        .create(5100, 400, "apple")
        .anims.play("appleSpin", true)
        .setScale(1);
      apples
        .create(5400, 300, "apple")
        .anims.play("appleSpin", true)
        .setScale(1);
      apples
        .create(5450, 300, "apple")
        .anims.play("appleSpin", true)
        .setScale(1);
      apples
        .create(5500, 300, "apple")
        .anims.play("appleSpin", true)
        .setScale(1);
      apples
        .create(5550, 300, "apple")
        .anims.play("appleSpin", true)
        .setScale(1);
      apples
        .create(5600, 300, "apple")
        .anims.play("appleSpin", true)
        .setScale(1);
      apples
        .create(7100, 100, "apple")
        .anims.play("appleSpin", true)
        .setScale(1);
      apples
        .create(7150, 100, "apple")
        .anims.play("appleSpin", true)
        .setScale(1);
      apples
        .create(7200, 100, "apple")
        .anims.play("appleSpin", true)
        .setScale(1);
      apples
        .create(7250, 100, "apple")
        .anims.play("appleSpin", true)
        .setScale(1);
      apples
        .create(7300, 100, "apple")
        .anims.play("appleSpin", true)
        .setScale(1);

      this.physics.add.collider(apples, platforms);
      this.physics.add.overlap(player, apples, collectApple, null, this);

      /**************************** SCORE *****************************/
      // Mostrar el puntaje del jugador

      scoreText = this.add
        .text(16, 50, "Score: 0", {
          fontSize: "32px",
          fill: "#000",
        })
        .setScrollFactor(0);

      cursors = this.input.keyboard.createCursorKeys();

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
      
      /**************************** ENEMIES *****************************/
      // Inicializar los enemigos (patos, pollos, cocodriloas, camaleones)

      // -------------> ranaS <------------- //
      
      ranas = this.physics.add.group();

      const ranaPositions = [
        { x: 1000, y: 500 },
        { x: 1500, y: 300 },
        { x: 2000, y: 400 },
        { x: 2500, y: 350 },
        { x: 3000, y: 300 },
        { x: 6500, y: 300 },
        { x: 7200, y: 400 },
        { x: 7500, y: 500 },
        { x: 7900, y: 600 },
      ];

      ranaPositions.forEach((pos) => {
        const rana = ranas.create(pos.x, pos.y, "rana");
        rana.setBounce(1);
        rana.setCollideWorldBounds(true);
        rana.setVelocity(Phaser.Math.Between(-100, 100), 20);

        rana.flipX = rana.body.velocity.x < 0;
      });

      this.physics.add.collider(ranas, platforms);
      this.physics.add.collider(player, ranas, hitrana, null, this);
      
      // -------------> zombi <------------- //

      this.anims.create({
        key: "zombiWalk",
        frames: this.anims.generateFrameNumbers("zombi", {
          start: 0,
          end: 13,
        }),
        frameRate: 13,
        repeat: -1,
      });

      zombis = this.physics.add.group();
      const zombi1 = zombis
        .create(2000, 500, "zombi")
        .setVelocityX(100)
        .anims.play("zombiWalk", true);
      const zombi2 = zombis
        .create(2500, 400, "zombi")
        .setVelocityX(100)
        .anims.play("zombiWalk", true);
      const zombi3 = zombis
        .create(3000, 350, "zombi")
        .setVelocityX(100)
        .anims.play("zombiWalk", true);
      const zombi4 = zombis
        .create(3500, 300, "zombi")
        .setVelocityX(100)
        .anims.play("zombiWalk", true);
      const zombi5 = zombis
        .create(5000, 500, "zombi")
        .setVelocityX(100)
        .anims.play("zombiWalk", true);
      const zombi6 = zombis
        .create(5500, 400, "zombi")
        .setVelocityX(100)
        .anims.play("zombiWalk", true);
      const zombi7 = zombis
        .create(6500, 350, "zombi")
        .setVelocityX(100)
        .anims.play("zombiWalk", true);
      const zombi8 = zombis
        .create(7500, 300, "zombi")
        .setVelocityX(100)
        .anims.play("zombiWalk", true);
      const zombi9 = zombis
        .create(7900, 600, "zombi")
        .setVelocityX(100)
        .anims.play("zombiWalk", true);

      this.time.addEvent({
        delay: Phaser.Math.Between(2000, 4000),
        callback: () => changezombiDirection(zombi1),
        loop: true,
      });

      this.time.addEvent({
        delay: Phaser.Math.Between(2000, 4000),
        callback: () => changezombiDirection(zombi2),
        loop: true,
      });

      this.time.addEvent({
        delay: Phaser.Math.Between(2000, 4000),
        callback: () => changezombiDirection(zombi3),
        loop: true,
      });

      this.time.addEvent({
        delay: Phaser.Math.Between(2000, 4000),
        callback: () => changezombiDirection(zombi4),
        loop: true,
      });

      this.time.addEvent({
        delay: Phaser.Math.Between(2000, 4000),
        callback: () => changezombiDirection(zombi5),
        loop: true,
      });

      this.time.addEvent({
        delay: Phaser.Math.Between(2000, 4000),
        callback: () => changezombiDirection(zombi6),
        loop: true,
      });

      this.time.addEvent({
        delay: Phaser.Math.Between(2000, 4000),
        callback: () => changezombiDirection(zombi7),
        loop: true,
      });

      this.time.addEvent({
        delay: Phaser.Math.Between(2000, 4000),
        callback: () => changezombiDirection(zombi8),
        loop: true,
      });

      this.time.addEvent({
        delay: Phaser.Math.Between(2000, 4000),
        callback: () => changezombiDirection(zombi9),
        loop: true,
      });

      this.physics.add.collider(zombis, platforms);
      this.physics.add.collider(player, zombis, hitzombi, null, this);

      // -------------> cocodrilo <------------- //

      cocodrilos = this.physics.add.group();
      flamaRadioactives = this.physics.add.group();

      const cocodrilo1 = cocodrilos.create(3000, 400, "cocodrilo");
      const cocodrilo2 = cocodrilos.create(2000, 650, "cocodrilo");
      const cocodrilo3 = cocodrilos.create(5000, 400, "cocodrilo");
      const cocodrilo4 = cocodrilos.create(6000, 200, "cocodrilo");
      const cocodrilo5 = cocodrilos.create(7000, 600, "cocodrilo");
      const cocodrilo6 = cocodrilos.create(7300, 300, "cocodrilo");
      const cocodrilo7 = cocodrilos.create(7500, 500, "cocodrilo");

      this.anims.create({
        key: "cocodriloIdle",
        frames: this.anims.generateFrameNumbers("cocodrilo", { start: 0, end: 3 }),
        frameRate: 3,
        repeat: -1,
      });

      cocodrilos.children.iterate((cocodrilo) => {
        cocodrilo.anims.play("cocodriloIdle", true);
      });

      this.time.addEvent({
        delay: 1300,
        callback: () => shootflamaRadioactive(cocodrilo1),
        loop: true,
      });

      this.time.addEvent({
        delay: 1300,
        callback: () => shootflamaRadioactive(cocodrilo2),
        loop: true,
      });

      this.time.addEvent({
        delay: 1300,
        callback: () => shootflamaRadioactive(cocodrilo3),
        loop: true,
      });

      this.time.addEvent({
        delay: 1300,
        callback: () => shootflamaRadioactive(cocodrilo4),
        loop: true,
      });

      this.time.addEvent({
        delay: 1300,
        callback: () => shootflamaRadioactive(cocodrilo5),
        loop: true,
      });

      this.time.addEvent({
        delay: 1300,
        callback: () => shootflamaRadioactive(cocodrilo6),
        loop: true,
      });

      this.time.addEvent({
        delay: 1300,
        callback: () => shootflamaRadioactive(cocodrilo7),
        loop: true,
      });

      this.physics.add.collider(cocodrilos, platforms);
      this.physics.add.overlap(player, flamaRadioactives, hitflamaRadioactive, null, this);
      this.physics.add.collider(flamaRadioactives, platforms, destroyflamaRadioactive, null, this);

      // -------------> PROFESOR <------------- //

      this.anims.create({
        key: "profesorWalk",
        frames: this.anims.generateFrameNumbers("profesor", {
          start: 0,
          end: 9,
        }),
        frameRate: 25,
        repeat: -1,
      });

      profesors = this.physics.add.group();

      const profesor1 = profesors
        .create(3500, 400, "profesor")
        .setVelocityX(200)
        .anims.play("profesorWalk", true);
      const profesor2 = profesors
        .create(4500, 350, "profesor")
        .setVelocityX(250)
        .anims.play("profesorWalk", true);
      const profesor3 = profesors
        .create(6000, 500, "profesor")
        .setVelocityX(200)
        .anims.play("profesorWalk", true);
      const profesor4 = profesors
        .create(7200, 500, "profesor")
        .setVelocityX(200)
        .anims.play("profesorWalk", true);
      const profesor5 = profesors
        .create(7500, 700, "profesor")
        .setVelocityX(200)
        .anims.play("profesorWalk", true);
      const profesor6 = profesors
        .create(7900, 600, "profesor")
        .setVelocityX(200)
        .anims.play("profesorWalk", true);

      this.time.addEvent({
        delay: Phaser.Math.Between(2000, 4000),
        callback: () => changeprofesorDirection(profesor1),
        loop: true,
      });

      this.time.addEvent({
        delay: Phaser.Math.Between(2000, 4000),
        callback: () => changeprofesorDirection(profesor2),
        loop: true,
      });

      this.time.addEvent({
        delay: Phaser.Math.Between(2000, 4000),
        callback: () => changeprofesorDirection(profesor3),
        loop: true,
      });

      this.time.addEvent({
        delay: Phaser.Math.Between(2000, 4000),
        callback: () => changeprofesorDirection(profesor4),
        loop: true,
      });

      this.time.addEvent({
        delay: Phaser.Math.Between(2000, 4000),
        callback: () => changeprofesorDirection(profesor5),
        loop: true,
      });

      this.time.addEvent({
        delay: Phaser.Math.Between(2000, 4000),
        callback: () => changeprofesorDirection(profesor6),
        loop: true,
      });

      this.physics.add.collider(profesors, platforms);
      this.physics.add.collider(player, profesors, hitprofesor, null, this);

      this.physics.add.overlap(bullets, ranas, killEnemy, null, this);
      this.physics.add.overlap(bullets, zombis, killEnemy, null, this);
      this.physics.add.overlap(bullets, profesors, killEnemy, null, this);
    }

    function update() {
      background.tilePositionX = this.cameras.main.scrollX;

      if (cursors.left.isDown) {
        player.setVelocityX(redBullActive ? -300 : -150);
        player.anims.play("left", true);
        lastDirection = "left";
      } else if (cursors.right.isDown) {
        player.setVelocityX(redBullActive ? 300 : 150);
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

      ranas.children.iterate(function (rana) {
        if (rana.body.velocity.x > 0) {
          rana.flipX = true;
        } else if (rana.body.velocity.x < 0) {
          rana.flipX = false;
        }
      });

      if (player.body.touching.down) {
        isJumping = false;
      }

      zombis.children.iterate(function (zombi) {
        if (zombi.body.blocked.right) {
          zombi.setVelocityX(-100);
          zombi.flipX = true;
        } else if (zombi.body.blocked.left) {
          zombi.setVelocityX(100);
          zombi.flipX = false;
        }
      });

      flamaRadioactives.getChildren().forEach((flamaRadioactive) => {
        if (Math.abs(flamaRadioactive.x - flamaRadioactive.startX) >= 500) {
          flamaRadioactive.destroy();
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

    function collectredBull(player, redBull) {
      redBull.disableBody(true, true);
      redBullActive = true;

      this.sound.play("speedSound", { volume: 0.1 });

      this.time.delayedCall(
        10000,
        () => {
          redBullActive = false;
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

    function hitzombi(player, zombi) {
      if (
        (player.body.velocity.y > 0 &&
          zombi.body.touching.up &&
          !zombi.body.touching.down) ||
        (player.body.touching.down && zombi.body.touching.up)
      ) {
        zombi.disableBody(true, true);
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

    function hitrana(player, rana) {
      if (
        (player.body.velocity.y > 0 &&
          rana.body.touching.up &&
          !rana.body.touching.down) ||
        (player.body.touching.down && rana.body.touching.up)
      ) {
        rana.disableBody(true, true);
        score += 20;
        scoreText.setText("Score: " + score);
        player.setVelocityY(-50);
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

    function changezombiDirection(zombi) {
      const newDirection = Phaser.Math.Between(0, 1) === 0 ? -100 : 100;
      zombi.setVelocityX(newDirection);
      zombi.flipX = newDirection > 0;
    }

    function shootflamaRadioactive(cocodrilo) {
      const flamaRadioactive = flamaRadioactives.create(cocodrilo.x -20, cocodrilo.y, "flamaRadioactive");
      flamaRadioactive.setVelocityX(-200);
      flamaRadioactive.body.allowGravity = false;
      flamaRadioactive.startX = flamaRadioactive.x;
    }

    function hitflamaRadioactive(player, flamaRadioactive) {
      flamaRadioactive.destroy();
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

    function destroyflamaRadioactive(flamaRadioactive) {
      flamaRadioactive.destroy();
    }

    function changeprofesorDirection(profesor) {
      const newDirection = Phaser.Math.Between(0, 1) === 0 ? -100 : 100;
      profesor.setVelocityX(newDirection);
      profesor.flipX = newDirection > 0;
    }

    function hitprofesor(player, profesor) {
      if (
        (player.body.velocity.y > 0 &&
          profesor.body.touching.up &&
          !profesor.body.touching.down) ||
        (player.body.touching.down && profesor.body.touching.up)
      ) {
        profesor.disableBody(true, true);
        score += 20;
        scoreText.setText("Score: " + score);
        player.setVelocityY(-300);
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

      ranas.children.iterate(function (rana) {
        rana.anims.stop();
        rana.body.setVelocity(0);
      });

      zombis.children.iterate(function (zombi) {
        zombi.anims.stop();
        zombi.body.setVelocity(0);
      });

      profesors.children.iterate(function (profesor) {
        profesor.anims.stop();
        profesor.body.setVelocity(0);
      });

      const nextLevelButton = this.add.text(
        this.cameras.main.centerX,
        this.cameras.main.centerY - 100,
        "Siguiente Nivel",
        { fontSize: "64px", fill: "#DAA520" }
      );
      nextLevelButton.setOrigin(0.5, 0.5);
      nextLevelButton.setInteractive();
      nextLevelButton.on("pointerdown", () => {
        window.location.href = "/level5";
      });
      nextLevelButton.setScrollFactor(0);

      const exitButton = this.add.text(
        this.cameras.main.centerX,
        this.cameras.main.centerY,
        "Salir",
        { fontSize: "32px", fill: "#000000" }
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

      ranas.children.iterate(function (rana) {
        rana.anims.stop();
        rana.body.setVelocity(0);
      });

      zombis.children.iterate(function (zombi) {
        zombi.anims.stop();
        zombi.body.setVelocity(0);
      });

      profesors.children.iterate(function (profesor) {
        profesor.anims.stop();
        profesor.body.setVelocity(0);
      });

      this.input.keyboard.enabled = false;

      const gameOverText = this.add.text(
        this.cameras.main.centerX,
        this.cameras.main.centerY - 100,
        "GAME OVER",
        { fontSize: "64px", fill: "#8B0000" }
      );
      gameOverText.setOrigin(0.5, 0.5);

      const restartButton = this.add.text(
        this.cameras.main.centerX,
        this.cameras.main.centerY,
        "Reiniciar Nivel",
        { fontSize: "32px", fill: "#333333" }
      );
      restartButton.setOrigin(0.5, 0.5);
      restartButton.setInteractive();
      restartButton.on("pointerdown", () => {
        //this.scene.restart();
        //this.input.keyboard.enabled = true;
        location.reload();
      });

      const exitButton = this.add.text(
        this.cameras.main.centerX,
        this.cameras.main.centerY + 100,
        "Salir",
        { fontSize: "32px", fill: "#000000" }
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
        //this.scene.restart();
        //this.input.keyboard.enabled = true;
        location.reload();
      });

      this.input.keyboard.on("keydown-r", () => {
        //this.scene.restart();
        //this.input.keyboard.enabled = true;
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

export default Level4;
