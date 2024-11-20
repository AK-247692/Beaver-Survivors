import { kamikazeBhv, playerBhv, removeObject, trooperBhv } from "./bhv.js";
import { gameObjects, pickup } from "./main.js";
import { particleGenerator } from "./particles.js";
import { sounds } from "./sound.js";

export class ship{
    constructor(lvl, baseHp, baseDmg, position, size, sprite, bhv, vars, speed, isHostile){
        this.type = "ship";
        this.isHostile = isHostile;

        this.lvl = lvl,
        this.baseHp = baseHp + baseHp * ((this.lvl-1)/2),
        this.hp = this.baseHp;
        this.baseDmg = baseDmg,
        this.position = position,
        this.size = size,
        this.sprite = new Image(),
        this.sprite.src = "textures/"+sprite;
        this.vars = vars;
        this.rotation = 45;
        this.bhv = bhv;
        this.speed = speed;
        /*
        bhv - behaviour
            types:
                - player - is controlled by player
                - kamikaze - charges straight at player
                - trooper - tries to be close, then shoots bullets at player
                - sniper - tries to be far, then shoots bullets at player at higher speed


        */ 
        switch (this.bhv){
            case "player":
                this.action = playerBhv;
            break;
            case "kamikaze":
                this.action = kamikazeBhv;
            break;
            case "trooper":
                this.action = trooperBhv;
            break;
        }


    }

    damage(value){
        this.hp -= value;
        if(this.hp > this.baseHp){
            this.hp = this.baseHp;
            return;
        }
        if(this.hp <= 0){
            this.kill();
            return
        }
        sounds.damageDealt.play();
    }

    kill(){
        let roll = Math.floor(Math.random()*100);
            if(roll < 5){
                gameObjects.push(new pickup(0,this.position,"pickupMagnet.png",8,"magnet"));
            }else if(roll >= 5 && roll < 15){
                gameObjects.push(new pickup(30,this.position,"pickupHp.png",8,"hp"));
            }else{
                gameObjects.push(new pickup(Math.floor(10 + 10*((this.lvl-1)**0.5)),this.position,"32x/pickupExp_32.png",16,"xp"));
            }
        

        gameObjects.push(new particleGenerator(30,[1,3],[0,360],[50,200],0,{x:this.position.x+this.size/2,y:this.position.y+this.size/2},["red","orange"]));

        
        removeObject(this);
        sounds.destroy.play();
        delete this;
        
    }
}