var Wave = {};
Wave.Game = function(game) {};

Wave.Game.prototype = {
  init: function(){
    this.count = 0;
    this.waveTotalLength = 1600;
    this.numWaves = 10;
    this.waves = null;
    this.boat = null;
  },

  preload: function(){
    this.game.load.spritesheet('wave', 'wave.png', 160, 160);
    this.game.load.image('boat', 'boat.png');
  },

  create: function(){
    var length = this.waveTotalLength / this.numWaves;
    var x, y, wave;
    this.game.world.setBounds(0, 0, 3200, 600);
    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    this.waves = this.game.add.group();
    this.waves.x = -320;
    this.waves.y = this.game.world.height - 50;
    this.waves.enableBody = true;
    this.waves.physicsBodyType = Phaser.Physics.ARCADE;

    for (var i = 0; i < this.numWaves; i++)
    {
      x = i*length;
      y = 0;
      wave = this.game.add.sprite(x, y, 'wave', this.game.rnd.between(0,1));
      wave.anchor.set(0.5,0.5);
      this.waves.add(wave);
      wave.body.setCircle(this.game.rnd.between(80,140));
      wave.body.offset.set(0, 50);
      wave.body.immovable = true;
    }

    this.boat = this.game.add.sprite(0, 0, 'boat');
    this.game.physics.arcade.enable(this.boat);
    this.boat.body.gravity.y = 250;
    this.boat.body.setCircle(32);
    this.game.camera.follow(this.boat);
  },

  update: function(){
    this.game.physics.arcade.collide(this.boat, this.waves);
    this.count += 0.1;
    this.boat.body.velocity.x = 90; // Constantly move boat to the right

    this.waves.forEach(function(currentWave){
      var i = this.waves.getChildIndex(currentWave);
      var x = i * 0.9 + this.count;
      var amp = 5;
      currentWave.y = Math.sin(x) * amp;
    }, this);
  },

  render: function(){
    // this.game.debug.body(this.boat);
    // for(var i = 0; i < this.numWaves; i++) {
    //   this.game.debug.body(this.waves.children[i]);
    // }
  }
};