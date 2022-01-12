let config={
    type:Phaser.CANVAS,
    scale:{
        mode:Phaser.Scale.FIT,
        width:800,
        height:600,
    },
    backgroundColor : 0xff0000,
    
    physics:
    {
        default:'arcade',
        arcade:{
            gravity:{
                y:1000,
            },
            debug:false,
        }
    },
    
    scene : {
    preload : preload,
    create : create,
    update : update,
}

};
let game=new Phaser.Game(config);

function preload()
{
    this.load.image("ground","topground.png");
    this.load.image("sky","background.png");
    this.load.spritesheet("player","dude.png",{frameWidth:32,frameHeight:48});
    this.load.image("apple","apple.png");
    this.load.image("ray","ray.png");
}
function create()
{
 W=game.config.width;
 H=game.config.height;
 let ground=this.add.tileSprite(0,H-128,W,128,'ground');
    ground.setOrigin(0,0);
    let background=this.add.sprite(0,0,'sky');
   //  let background=this.add.tileSprite(0,0,W,512,'sky');
    
    background.setOrigin(0,0);
    background.displayWidth=W;
    background.depth=-2;
    let rays = [];
    
    for(let i=-10;i<=10;i++){
        let ray = this.add.sprite(W/2,H-100,'ray');
        ray.displayHeight = 1.2*H;
        ray.setOrigin(0.5,1);
        ray.alpha = 0.4;
        ray.angle = i*20;
        ray.depth = -1;
        rays.push(ray);
    }
    this.tweens.add({
        targets: rays,
        props:{
            angle:{
                value : "+=20"
            },
        },
        duration : 8000,
        repeat : -1
    });
    this.player=this.physics.add.sprite(100,100,'player',4);
    this.physics.add.existing(ground);
    ground.body.allowGravity=false;
    ground.body.immovable=true;
    this.physics.add.collider(ground,this.player);
    
    let fruits=this.physics.add.group({
        key:'apple',
        repeat:8,
        setXY:{x:10,y:0,stepX:100},
        setScale:{x:0.2,y:0.2},
    });
    this.physics.add.collider(ground,fruits);
    this.player.setBounce(0.5);
    this.player.setCollideWorldBounds(true);
    fruits.children.iterate(function (f){
        f.setBounce(Phaser.Math.FloatBetween(0.4,0.7));
        
        
    });
    let platforms = this.physics.add.staticGroup();
    platforms.create(600,400,'ground').setScale(2,0.5).refreshBody();
    platforms.create(400,200,'ground').setScale(2,0.5).refreshBody();
    platforms.create(200,300,'ground').setScale(2,0.5).refreshBody();
    platforms.add(ground);
    this.physics.add.collider(platforms,fruits);
    this.physics.add.collider(platforms,this.player);
    this.anims.create({
        key:'left',
        frames:this.anims.generateFrameNumbers('player',{start:0,end:3}),
        frameRate:10,
        repeat:-1,
    });
    
    this.anims.create({
        key:'right',
        frames:this.anims.generateFrameNumbers('player',{start:5,end:8}),
        frameRate:10,
        repeat:-1,
    });
    this.anims.create({
        key:'centre',
        frames:this.anims.generateFrameNumbers('player',{start:4,end:4}),
        frameRate:10,
        repeat:-1,
    });
    
    //input
this.cursors =this.input.keyboard.createCursorKeys(); 
    this.physics.add.overlap(this.player,fruits,eatFruit,null,this);
    
   
    
}
function update()
{
    if(this.cursors.left.isDown)
        {
            this.player.setVelocityX(-150);
            this.player.anims.play('left',true);
        }
    else if(this.cursors.right.isDown)
        {
            this.player.setVelocityX(150);
            this.player.anims.play('right',true);
        }
    else
        {
            this.player.setVelocityX(0);
          this.player.anims.play('centre',true);
        }
    if(this.cursors.up.isDown && this.player.body.touching.down)
        {
            this.player.setVelocityY(-600);
            
        }
}
function eatFruit(player,fruit){
    fruit.disableBody(true,true);
}