import { findObjectInArray, radialMove } from "./essentials.js";
import { deltaTime, screen, cam } from "./main.js";

class Particle{
    constructor(x,y,dir,velocity,color,lifeTime,gen){
        this.position = {x:x,y:y}
        this.rotation = dir;
        this.velocity = velocity;
        this.color = color;
        this.lifeTime = lifeTime;
        this.size = 4;
        this.gen = gen;
        //console.log(this);
    }
    move(){
        let move = radialMove(this.rotation);
        this.position.x += move.x * this.velocity * deltaTime; 
        this.position.y += move.y * this.velocity * deltaTime; 

        this.lifeTime -= deltaTime;
       
    }
    checkLifeSpan(){
        if(this.lifeTime < 0){
            let id = findObjectInArray(this, this.gen.particles);
            this.gen.particles.splice(id,1);
            this.destroy();
        }
    }

    destroy(){
        delete this;
    }

    draw(){
        screen.ctx.translate(this.position.x+this.size/2*screen.zoom/2-cam.x+screen.cw/2, this.position.y+this.size/2*screen.zoom/2-cam.y+screen.ch/2);
        screen.ctx.rotate(this.rotation*Math.PI/180);
        screen.ctx.translate(-(this.position.x+this.size*screen.zoom/2), -(this.position.y+this.size*screen.zoom/2));

        screen.ctx.fillStyle = this.color;
        screen.ctx.fillRect(this.position.x,this.position.y,this.size,this.size);

        screen.ctx.setTransform(1, 0, 0, 1, 0, 0);

        //console.log(this)
    }
}

export class particleGenerator{
    constructor(numberOfParticles, lifeTimeRange, dirRange, velocityRange, generatorDelay, originPoint, colorArr){
        this.type = "particleGen";
        this.numberOfParticles = numberOfParticles;
        this.lifeTimeRange = lifeTimeRange;
        this.dirRange = dirRange;
        this.velocityRange = velocityRange;
        this.generatorDelay = generatorDelay;
        this.lastGeneration = Date.now();
        this.originPoint = originPoint;
        //console.log(originPoint)
        this.colorArr = colorArr;
        this.particles = [];
    }

    action(){
        if(this.numberOfParticles > 0){
            this.generate();
        }
        this.update();
        
    }

    generate(){
        let now = Date.now();
        if(now > this.lastGeneration){
            let toShot = 0;
            if(this.generatorDelay == 0){
                toShot = this.numberOfParticles;
            }else{
                toShot = Math.max(Math.floor((now-this.lastGeneration)/this.generatorDelay),this.numberOfParticles);
                this.lastGeneration += toShot*this.generatorDelay;
            }
            this.numberOfParticles -= toShot;
            while(toShot > 0){
                this.particles.push(new Particle(this.originPoint.x,this.originPoint.y,this.randomizeRange(this.dirRange),this.randomizeRange(this.velocityRange),this.colorArr[this.randomizeRange([0,this.colorArr.length])],this.randomizeRange(this.lifeTimeRange),this))
                toShot --;
            }
            
        }
    }

    update(){
        for(let i=this.particles.length-1;i>=0;i--){
            let element = this.particles[i];
            element.move();
            element.draw();
            element.checkLifeSpan();
        }
    }

    randomizeRange(range){
        return Math.floor(Math.random()*(range[1]-range[0]))+range[0];
    }
}