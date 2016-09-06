var Wave = {};
Wave.Game = function(game) {};

Wave.Game.prototype = {
  init: function(){
    this.count = 0;
    this.waveTotalLength = 1600;
    this.numWaves = 10;
    this.waves = null;
    this.boat = null;
    this.sky = null;

    this.firstWave = null;
    this.lastWave = null;

    this.WAVE_LENGTH = 160;

    this.debug = false;
    this.debugKey = null;
    this.showBodies = false;
    this.bodyKey = null;
  },

  preload: function(){
    this.game.load.spritesheet('wave', 'wave.png', this.WAVE_LENGTH, this.WAVE_LENGTH);
    this.game.load.image('boat', 'boat.png');
    this.game.load.image('sky', 'sky.png');
  },

  create: function(){
    var x, y, wave;
    this.game.world.setBounds(0, 0, 3200, 600);
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.time.advancedTiming = true;

    this.debugKey = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
    this.debugKey.onUp.add(function(){
      this.debug = !this.debug;
      this.game.debug.reset();
    }, this);
    this.bodyKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    this.bodyKey.onUp.add(function(){
      this.showBodies = !this.showBodies;
      this.game.debug.reset();
    }, this);

    this.sky = this.game.add.image(0,0,'sky');
    this.sky.fixedToCamera = true;
    this.sky.scale.setTo(1.2,1.2);

    this.waves = this.game.add.group();
    this.waves.x = -this.WAVE_LENGTH*2;
    this.waves.y = this.game.world.height - 50;
    this.waves.enableBody = true;
    this.waves.physicsBodyType = Phaser.Physics.ARCADE;

    for (var i = 0; i < this.numWaves; i++)
    {
      x = i*this.WAVE_LENGTH;
      y = 0;
      wave = this.game.add.sprite(x, y, 'wave', this.game.rnd.between(0,1));
      wave.anchor.set(0.5,0.5);
      this.waves.add(wave);
      wave.body.setCircle(this.game.rnd.between(80,140));
      wave.body.offset.set(0, 50);
      wave.body.immovable = true;
    }
    this.setFirstLastWave();

    this.boat = this.game.add.sprite(0, 0, 'boat');
    this.game.physics.arcade.enable(this.boat);
    this.boat.body.gravity.y = 250;
    this.boat.body.setCircle(32);
    this.game.camera.follow(this.boat);
  },

  update: function(){
    this.game.physics.arcade.collide(this.boat, this.waves);
    this.boat.body.velocity.x = 90; // Constantly move boat to the right
    if(this.debug) {
      this.game.debug.text("Camera "+this.game.camera.x, 0, 10);
    }

    this.animateWaves();
    this.fps();
  },

  fps: function(){
    this.game.debug.text(this.game.time.fps+"fps", 750, 20);
  },

  setFirstLastWave: function() {
    this.firstWave = this.waves.children[0];
    this.lastWave  = this.waves.children[this.numWaves-1];
  },

  shuffleLeftMostWave: function(){
    // Look at left-most this.waves.children only!
    // check if the current wave's right edge (in world coords) is less than the camera's left edge
    if((this.firstWave.world.x + this.firstWave.offsetX) < this.game.camera.x) {
      if(this.debug) {
        this.game.debug.text("First Wave: (" + this.firstWave.x + ","+ this.firstWave.y+")", 10, 100);
      }
      newX = this.lastWave.x + this.WAVE_LENGTH;
      this.firstWave.x = newX;
      // Push firstWave to end of list
      this.waves.remove(this.firstWave, false);
      this.waves.add(this.firstWave);
      this.setFirstLastWave();
    }
  },

  animateWaves: function(){
    this.count += 0.1;

    this.shuffleLeftMostWave();

    this.waves.forEach(function(currentWave){
      var i = this.waves.getChildIndex(currentWave);
      var amp = 5;
      var x = i * 0.9 + this.count;
      var y = Math.sin(x) * amp;
      var newX;
      currentWave.y = y;

      if(this.debug) {
        this.game.debug.text("Wave["+i+"]: (" + currentWave.x + ","+ currentWave.y+")", 10, 11*i+20)
      }
    }, this);
  },

  render: function(){
    if(this.showBodies) {
      this.game.debug.body(this.boat);
      this.waves.forEach(function(wave){
        this.game.debug.body(wave);
      }, this);
    }
  }
};