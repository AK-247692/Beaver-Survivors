import { input } from "./controller.js";
import { checkDistance, checkRectCollision, findObjectInArray, lerp, lerpDegrees, lookAt, radialMove } from "./essentials.js";
import { bullet, screen, deltaTime, gameObjects, cam, addXp } from "./main.js";
import { particleGenerator } from "./particles.js";
import { sounds } from "./sound.js";

export function playerBhv(){
    //console.log(this.rotation);
    let move = {x:input.axis.horizontal.value,y:input.axis.vertical.value}
    if(Math.abs(move.x)+Math.abs(move.y) != 0){
        this.vars.newRot = lookAt(origin,{position:{x:input.axis.horizontal.value,y:input.axis.vertical.value}})+90;
        let mod = radialMove(this.vars.newRot);
        move.x *= Math.abs(mod.y);
        move.y *= Math.abs(mod.x);
        gameObjects.push(new particleGenerator(2,[0.2,0.5],[this.rotation+70,this.rotation+110],[100,150],10,{x:this.position.x+this.size/2-6,y:this.position.y+this.size/2-6},["red","orange"]));
    }
    this.rotation = lerpDegrees(this.rotation,this.vars.newRot, deltaTime*10);


    if(Date.now() >= this.vars.lastShot){

        //find closest enemy
        let closest = this;
        let minDist = screen.cw*2;
        for(let i=1;i<gameObjects.length;i++){
            let element = gameObjects[i];
            if(element.type == "ship" && element.isHostile != this.isHostile){
                let distance = checkDistance(this, element);
                if(distance < minDist){
                    closest = element;
                    minDist = distance;
                    //console.log(closest);
                }
            }

        }


        let shot = new bullet("32x/bulletBlue_32.png",this.baseDmg,lookAt(this,closest)+90,this,400,16, false);
        
        gameObjects.push(shot);

        shot = new bullet("32x/bulletGreen_32.png",this.baseDmg*1.5,this.rotation,this,380,32, false);
        gameObjects.push(shot);
        if(this.lvl >= 5){
            shot = new bullet("bulletGreen.png",this.baseDmg*1.5,this.rotation-35,this,380,16, false);
            gameObjects.push(shot);
            shot = new bullet("bulletGreen.png",this.baseDmg*1.5,this.rotation+35,this,380,16, false);
            gameObjects.push(shot);
        }
        if(this.lvl >= 10){
            shot = new bullet("bulletGreen.png",this.baseDmg*1.5,this.rotation-20,this,380,16, false);
            gameObjects.push(shot);
            shot = new bullet("bulletGreen.png",this.baseDmg*1.5,this.rotation+20,this,380,16, false);
            gameObjects.push(shot);
        }
        

        sounds.shotBlaster.play();

        this.vars.lastShot = Date.now() + 1000 - Math.min(Math.floor(this.lvl/5)*100,900);
    }

    if(this.skillPts >= 1){
        if(input.keys.upg1.state == 1){
            this.baseHp = Math.ceil(this.baseHp*1.1);
            this.skillPts --;
        }else if(input.keys.upg2.state == 1){
            this.baseDmg = Math.ceil(this.baseDmg*1.2);
            this.skillPts --;
        }else if(input.keys.upg3.state == 1){
            this.speed = Math.ceil(this.speed*1.1);
            this.skillPts --;
        }
    }
    
    this.position.x += move.x*this.speed*deltaTime;
    this.position.y += move.y*this.speed*deltaTime;
}

export function kamikazeBhv(){
    this.rotation = lookAt(this,this.vars.target)+90;
    let move = radialMove(this.rotation-90);

    this.position.x += move.x*this.speed*deltaTime;
    this.position.y += move.y*this.speed*deltaTime;
}

export function trooperBhv(){
    let move = {x:0,y:0};
    this.rotation = lookAt(this,this.vars.target)+90;
    if(checkDistance(this,this.vars.target) > 300){
        move = radialMove(this.rotation-90);

    
    }else{
        if(Date.now() >= this.vars.lastShot){
            let shot = new bullet("bulletRed.png",this.baseDmg,this.rotation,this,350,8, true);
            sounds.shotTrooper.play();
            gameObjects.push(shot);
            this.vars.lastShot = Date.now() + 2000;
        }
    }

    this.position.x += move.x*this.speed*deltaTime;
    this.position.y += move.y*this.speed*deltaTime;
    
}


export function bulletBhv(){
    let move = radialMove(this.rotation-90);
    

    if(this.position.x > cam.x+screen.cw/2 || this.position.x < cam.x-screen.cw/2 || this.position.y > cam.y+screen.ch/2 || this.position.y < cam.y-screen.ch/2){
        removeObject(this);
        delete this;
        return;
    }

    //check collision
    

    for(let i=0;i<gameObjects.length;i++){
        let element = gameObjects[i];
        if(element.type == "ship" && element.isHostile != this.isHostile){
                
            if(checkDistance(this, element) <= (this.size/2)*Math.sqrt(2) + (element.size/2)*Math.sqrt(2)){
                element.damage(this.dmg);
                gameObjects.push(new particleGenerator(10,[1,3],[this.rotation-100, this.rotation-80],[this.speed*0.8,this.speed*1.2],0,{x:this.position.x+this.size/2,y:this.position.y+this.size/2},["cyan","green"]));
                removeObject(this);
                delete this;
                return;
                
                
            }
        }

    }

    this.position.x += move.x*this.speed*deltaTime;
    this.position.y += move.y*this.speed*deltaTime;

}


export function expBhv(){
    let element = gameObjects[0];
    if(!this.pickedUp){
        if(checkDistance(this, element) <= element.pickupRange ){
            this.pickedUp = true;
            
            
            
        }
    }
    if(this.pickedUp){
        this.position.x = lerp(this.position.x,element.position.x,deltaTime*10);
        this.position.y = lerp(this.position.y,element.position.y,deltaTime*10);
        if(Math.round(checkDistance(this, element)) <= element.size ){
            
            addXp(this.value);
            sounds.expPickup.play();
            removeObject(this);
            delete this;
            return;
            
            
        }
    }

}

export function hpBhv(){
    let element = gameObjects[0];
    if(!this.pickedUp){
        if(checkDistance(this, element) <= element.pickupRange ){
            this.pickedUp = true;
            
            
            
        }
    }
    if(this.pickedUp){
        this.position.x = lerp(this.position.x,element.position.x,deltaTime*10);
        this.position.y = lerp(this.position.y,element.position.y,deltaTime*10);
        if(Math.round(checkDistance(this, element)) <= element.size ){
            
            element.damage(-this.value);
            sounds.expPickup.play();
            removeObject(this);
            delete this;
            return;
            
            
        }
    }

}

export function magnetBhv(){
    let element = gameObjects[0];
    if(!this.pickedUp){
        if(checkDistance(this, element) <= element.pickupRange ){
            this.pickedUp = true;
            
            
            
        }
    }
    if(this.pickedUp){
        this.position.x = lerp(this.position.x,element.position.x,deltaTime*10);
        this.position.y = lerp(this.position.y,element.position.y,deltaTime*10);
        if(Math.round(checkDistance(this, element)) <= element.size ){
            
            for(let i=0;i<gameObjects.length;i++){
                if(gameObjects[i].type=="pickup" && gameObjects[i].bhv == "xp"){
                    gameObjects[i].pickedUp = true;
                }
            }
            sounds.expPickup.play();
            removeObject(this);
            delete this;
            return;
            
            
        }
    }

}

export function removeObject(obj){
    let id = findObjectInArray(obj, gameObjects);
    gameObjects.splice(id,1);
}


var origin = {position:{x:0,y:0}}

