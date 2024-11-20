import { kamikazeBhv } from "./bhv.js";
import { lookAt } from "./essentials.js";
import { bullet, gameObjects } from "./main.js";
import { particleGenerator } from "./particles.js";
import { ship } from "./ship.js";
import { drawBossBar } from "./ui.js";

export class boss1 extends ship{

    constructor(lvl, position){
        super(lvl,100,20,position,48,"32x/eShip_b1_32.png","boss1",{target: gameObjects[0]},100,true);
        this.vars.childTimer = 0;
        this.vars.childCd = 3000;

        this.vars.attack1Timer = 0;
        this.vars.attack1Cd = 2000;

        this.vars.attack2Timer = 0;
        this.vars.attack2Cd = 10000;
        console.log(this)
        this.kamikaze = kamikazeBhv;
    }

    action(){
        this.kamikaze();
        let actualTime = Date.now();

        if(actualTime >= this.vars.childTimer){
            this.spawnChild(1);
            this.vars.childTimer = actualTime + this.vars.childCd;
        }

        if(actualTime >= this.vars.attack1Timer){
            this.attack1();
            gameObjects.push(new particleGenerator(130,[1,5],[0,359],[100,400],0,this.position,["red","white"]))
            //let missingHealth = this.hp/this.baseHp/2;

            this.vars.attack1Timer = actualTime + this.vars.attack1Cd;
        }

        if(actualTime >= this.vars.attack2Timer){
            this.attack2();
            this.vars.attack2Timer = actualTime + this.vars.attack2Cd;
        }

        drawBossBar("CRABULLUS MARK 1", this);
    
    }

    spawnChild(amount){
        while(amount > 0){
            gameObjects.push(new ship(this.lvl,1,5,{x:this.position.x,y:this.position.y},24,"32x/eShip_b1h_32.png","kamikaze",{target: gameObjects[0]},150,true))
            amount--;
        }

    }

    attack1(){
        for(let i=0; i<16; i++){
            gameObjects.push(new bullet("32x/bulletBoss1_32.png",this.baseDmg,i*22.5,this,this.speed*2,32,true));
            
        }



    }

    attack2(){
        let dir = lookAt(this,this.vars.target)+90;
        gameObjects.push(new bullet("32x/bulletBoss1_end_32.png",this.baseDmg*2,dir,this,this.speed*5,64,true));
        gameObjects.push(new particleGenerator(180,[1,5],[dir-90-30,dir-90+30],[600,1000],0,this.position,["red","red","white"]))

    }

}