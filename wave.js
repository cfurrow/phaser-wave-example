var Wave = {};
Wave.Game = function(game) {};

Wave.Game.prototype = {
  init: function(){
    this.WAVE_LENGTH = 160;
    this.count = 0;
    this.numWaves = 6; // Screen is only 800px wide, 6*160 = 960 pixels of coverage.
    this.waveTotalLength = this.WAVE_LENGTH * this.numWaves;
    this.waves = null;
    this.boat = null;
    this.sky = null;

    this.firstWaveIndex = 0;
    this.lastWaveIndex = this.numWaves-1;

    this.showBodies = true;
  },

  preload: function(){
    this.game.load.spritesheet('wave', 'wave.png', this.WAVE_LENGTH, this.WAVE_LENGTH);
    this.game.load.image('boat', 'boat.png');
    this.game.load.image('sky', 'sky.png');
  },

  create: function(){
    var x, y, wave;
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.time.advancedTiming = true;
    this.game.time.desiredFps = 30;
    this.game.stage.backgroundColor = '#fff';
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

    this.boat = this.game.add.sprite(100, 0, 'boat');
    this.game.physics.arcade.enable(this.boat);
    this.boat.body.gravity.y = 250;
    this.boat.body.setCircle(32);
    this.game.camera.follow(this.boat);
  },

  update: function() {
    this.game.physics.arcade.collide(this.boat, this.waves);
    this.animateWaves();
  },

  animateWaves: function(){
    this.count += 0.1;

    var i = 0;
    this.waves.forEach(function(currentWave){
      var amp = 5;
      var x = i * 0.9 + this.count;
      var y = Math.sin(x) * amp;
      var newX;
      currentWave.y = y;
      i++;
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
