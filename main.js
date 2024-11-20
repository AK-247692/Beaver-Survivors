import { bulletBhv, expBhv, hpBhv, kamikazeBhv, magnetBhv, playerBhv, removeObject, trooperBhv } from "./bhv.js";
import { boss1 } from "./boss1.js";
import { radialMove } from "./essentials.js";
import { particleGenerator } from "./particles.js";
import { ship } from "./ship.js";
import { sounds } from "./sound.js";
import { drawHp, drawPortrait, drawStats, drawXp } from "./ui.js";

class ui{
    
}

export class pickup{
    constructor(value,position,sprite,size,bhv){
        this.type = "pickup";
        this.value = value;
        this.position = position;
        this.size = size;
        this.sprite = new Image(),
        this.sprite.src = "textures/"+sprite;
        this.bhv = bhv;
        this.pickedUp = false;
        switch (this.bhv){
            case "xp":
                this.action = expBhv
            break;
            case "hp":
                this.action = hpBhv
            break;
            case "magnet":
                this.action = magnetBhv
            break;
        }
    }
}



export class bullet{
    constructor(sprite, dmg, rotation, origin, speed, size, isHostile){
        this.type = "bullet";
        this.isHostile = isHostile;
        this.sprite = new Image(),
        this.sprite.src = "textures/"+sprite;
        this.dmg = dmg,
        this.rotation = rotation;
        this.origin = origin;
        this.size = size;
        this.position = {x:origin.position.x+origin.size/2-this.size/2,y:origin.position.y+origin.size/2-this.size/2}
        this.speed = speed;
        this.toRotate = false;

        this.action = bulletBhv;
    }

}

export class bgElement{
    constructor(x,y,size,sprite,distance){
        this.position = {x:x,y:y}
        this.size = size;
        this.sprite = new Image(),
        this.sprite.src = "textures/"+sprite;
        this.origin = {x:x,y:y}
        this.distance = distance;
        this.rotation = 0;//Math.floor(Math.random()*360);
    }

    updatePos(){
        this.position.x = this.origin.x + player.position.x/this.distance;
        this.position.y = this.origin.y + player.position.y/this.distance;
    }
}


//globals

export class camera {

    constructor(target){
        this.target = target;
        this.x = 0;
        this.y = 0;
        this.set();
    }
    
    set(){
        this.x = this.target.position.x+this.target.size/2;
        this.y = this.target.position.y+this.target.size/2;
    }
}

export class Screen {
    constructor(){
        this.canvas = document.getElementById("canvas");
        this.cw = 600;
        this.ch = 400;
        this.zoom = 1.5;
        this.ctx = this.canvas.getContext("2d");
        this.ctx.imageSmoothingEnabled = false;
        this.updateCanvasSize();
        window.onresize = this.updateCanvasSize.bind(this);
    }

    updateCanvasSize(){
        this.cw = window.innerWidth;
        this.ch = window.innerHeight;
        this.canvas.width = this.cw;
        this.canvas.height = this.ch;
        this.ctx.imageSmoothingEnabled = false;
    }
    
}

export var cam;
export var screen = new Screen();

export var gameObjects = [];

var player;



function stageStart(){
    screen.updateCanvasSize();
    player = new ship(1,100,5,{x:0,y:0},32,"32x/pShip_32.png","player",{newRot : 0 , lastShot : 0},200,false);
    setPlayer();
    gameObjects.push(player);
   
    cam = new camera(player);

    gameObjects.push(new boss1(1, {x:0,y:-500}))

    window.requestAnimationFrame(frame);
}



var bgs = [];
bgs.push(new bgElement(0,-200,256,"bgs/beaverton bg.png",1.11));
for(let i = 0; i<20; i++){
    let x,y,id;
    x = Math.floor(Math.random()*screen.cw)-screen.cw/2;
    y = Math.floor(Math.random()*screen.ch)-screen.ch/2;
    id = Math.floor(Math.random()*3)+1;
    bgs.push(new bgElement(x,y,32,"bgs/bg"+id+".png",1.1+(6-Math.floor(Math.random()*5)+(2-id))*0.1));
    if(bgs[Math.max(0,bgs.length-1)].distance < bgs[Math.max(0,bgs.length-2)].distance){
        let temp = bgs[Math.max(0,bgs.length-1)];
        bgs[Math.max(0,bgs.length-1)] = bgs[Math.max(0,bgs.length-2)];
        bgs[Math.max(0,bgs.length-2)] = temp;
    }
}
console.log(bgs)
export var deltaTime = 0;
var prevTime = 0;

var lastEnemySpawn = 0;
var lastAsteroidSpawn = 0;

function frame(timestamp){
    deltaTime = (timestamp - prevTime)/1000;
    prevTime = timestamp;
    cls();
    for (let i = 0; i < bgs.length; i++) {
        bgs[i].updatePos();
        //draw(bgs[i]);
        
    }
    
    

    for (let i = 0; i < gameObjects.length; i++) {
        gameObjects[i].action();
        
        
    }
    cam.set();
    for (let i = 0; i < gameObjects.length; i++) {
        draw( gameObjects[i]);
        
        
    }

    if(Date.now() >= lastEnemySpawn){
        lastEnemySpawn = Date.now()+(2200-Math.min(player.lvl,20)*100);
        console.log(Math.min(player.lvl/5,5)*100)
        let roll = Math.floor(Math.random()*100);
        if (roll<20){
            spawnEnemy(new ship(player.lvl,8,5,radialMove(Math.random()*359),16,"eShip2.png","trooper",{target:player, lastShot: 0},100,true))

        }else{
            spawnEnemy(new ship(player.lvl,10,5,radialMove(Math.random()*359),32,"32x/eShip1_32.png","kamikaze",{target:player},100,true));

        }
    }

    
    drawXp(player);
    drawStats(player);
    drawHp(player); 
    drawPortrait();
    //console.log(gameObjects);
    
    //draw("red",gameObjects[1]);
    window.requestAnimationFrame(frame);
}



function cls(){
    screen.ctx.clearRect(0,0,screen.cw,screen.ch)
}

function draw(ship){

    if(ship.type == "particleGen"){
        return;
    }

    screen.ctx.translate(ship.position.x+ship.size/2*screen.zoom/2-cam.x+screen.cw/2, ship.position.y+ship.size/2*screen.zoom/2-cam.y+screen.ch/2);
    screen.ctx.rotate(ship.rotation*Math.PI/180);
    screen.ctx.translate(-(ship.position.x+ship.size*screen.zoom/2), -(ship.position.y+ship.size*screen.zoom/2));

    screen.ctx.drawImage(ship.sprite,0,0,ship.size,ship.size,ship.position.x,ship.position.y,ship.size*screen.zoom,ship.size*screen.zoom);

    screen.ctx.setTransform(1, 0, 0, 1, 0, 0);
}

function setPlayer(){
    player.xp = 0;
    player.pickupRange = 50;
    player.skillPts = 0;
    
}

export function addXp(value){
    player.xp += value;
    while(player.xp >= getLevelCost()){
        player.xp -= getLevelCost();
        player.lvl += 1;
        player.skillPts += 1;
        gameObjects.push(new particleGenerator(100,[1,4],[0,-90],[100,400],0,{x:player.position.x+player.size/2-screen.cw/2,y:player.position.y+player.size/2+screen.ch/2},["yellow","gold"]));
        gameObjects.push(new particleGenerator(100,[1,4],[-90,-180],[100,400],0,{x:player.position.x+player.size/2+screen.cw/2,y:player.position.y+player.size/2+screen.ch/2},["yellow","gold"]));

    }
}

export function getLevelCost(){
    return Math.floor(50*(player.lvl ** 1.19));
}


function spawnEnemy(enemy){
   
        enemy.position.x *= 1000;
        enemy.position.x += Math.sign(enemy.position.x)*100+player.position.x;
        enemy.position.y *= 1000;
        enemy.position.y += Math.sign(enemy.position.y)*100+player.position.y;
        gameObjects.push(enemy);

        
        
}

stageStart();