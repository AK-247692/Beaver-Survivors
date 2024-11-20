import { getLevelCost, screen } from "./main.js";

export function drawXp(player){
    
    drawText("LVL: "+player.lvl+" ("+player.xp+"/"+getLevelCost()+"XP)",10, screen.ch-10,"white",20);

    screen.ctx.fillStyle = "grey";
    screen.ctx.fillRect(0,screen.ch-5,screen.cw, 5);
    screen.ctx.fillStyle = "yellow";
    screen.ctx.fillRect(0,screen.ch-5,(player.xp/getLevelCost())*screen.cw, 5);


}

export function drawStats(player){
    let offset = 30;
    if(player.skillPts >= 1){
        let tzo = screen.ctx.textAlign;
        screen.ctx.textAlign = "center";
        drawText("LEVEL UP!",screen.cw/2, screen.ch - 128 ,"yellow", 48);

        screen.ctx.drawImage(
            upgradeImages.hpUpg, 0, 0, 32, 32, screen.cw/2 - 32 - 16 - 64, screen.ch - 16 -64 - 24, 64, 64); 
            drawText("Press [1]",screen.cw/2 - 16 - 64, screen.ch - 16 - 64 - 28 ,"yellow", 16);
        
            screen.ctx.drawImage(
            upgradeImages.atkUpg, 0, 0, 32, 32, screen.cw/2 - 32, screen.ch - 16 -64 - 24, 64, 64); 
            drawText("Press [2]",screen.cw/2, screen.ch - 16 - 64 - 28 ,"yellow", 16);

        screen.ctx.drawImage(
            upgradeImages.spdUpg, 0, 0, 32, 32, screen.cw/2 + 32 + 16, screen.ch - 16 -64 - 24, 64, 64);
            drawText("Press [3]",screen.cw/2 + 16 + 64, screen.ch - 16 -64 - 28  ,"yellow", 16);

        drawText("Skill points available: "+player.skillPts,screen.cw/2, screen.ch - 16 ,"yellow", 24);
            screen.ctx.textAlign = tzo;
    }
    drawText("HP: "+player.hp+"/"+player.baseHp,10, screen.ch/1.5 + offset,"white",16);
    drawText("AT: "+player.baseDmg,10, screen.ch/1.5 + offset*2,"white",16);
    drawText("SP: "+player.speed,10, screen.ch/1.5 + offset*3,"white",16);

    

}

export function drawHp(player){

    let maxBar = (Math.PI*2)*(player.baseHp/500);

    

    screen.ctx.beginPath();
    screen.ctx.strokeStyle = "gray";
    screen.ctx.lineWidth = 8;
    screen.ctx.arc(screen.cw/2,screen.ch/2,36,Math.PI,Math.PI-maxBar,true);
    screen.ctx.stroke();

    screen.ctx.beginPath();
    screen.ctx.strokeStyle = "red";
    screen.ctx.lineWidth = 8;
    screen.ctx.arc(screen.cw/2,screen.ch/2,36,Math.PI,Math.PI-(maxBar*(player.hp/player.baseHp)),true);
    screen.ctx.stroke();
    let tzo = screen.ctx.textAlign;
    screen.ctx.textAlign = "center";
    drawText( "HP",screen.cw/2-36,screen.ch/2 - 5,"red",16);
    //drawText( player.hp,screen.cw/2+36,screen.ch/2 - 5,"red",16)
    screen.ctx.textAlign = tzo;

    return;
    screen.ctx.fillStyle = "grey";
    screen.ctx.fillRect(screen.cw/2-24,screen.ch/2 + 32,64, 8);
    screen.ctx.fillStyle = "red";
    screen.ctx.fillRect(screen.cw/2-24,screen.ch/2 + 32,(player.hp/player.baseHp)*64, 8);
}

export function drawPortrait(){
    screen.ctx.drawImage(
        portrait.img,(portrait.actualFrame-1)*32,0,32,32,
        screen.cw - 64, screen.ch - 5 - 16 - 64, 64, 64)
    screen.ctx.drawImage(
        portrait.sig,0,0,32,8,
        screen.cw - 64, screen.ch - 5 - 16, 64, 16)
    if(Date.now() > portrait.lastAnim){
        portrait.actualFrame += 1;
        portrait.lastAnim = Date.now() + portrait.timer;
        portrait.forward = true;
    }
    if(portrait.actualFrame != 1 && Date.now() > portrait.lastFrame){
        if(portrait.forward){
            portrait.actualFrame += 1;
            if(portrait.actualFrame == portrait.frames){
                portrait.forward = false;
            }
        }else{
            portrait.actualFrame -= 1;
        }

        portrait.lastFrame = Date.now() + portrait.animationSpeed;
        
    }

    
}
var portrait = {
    img : new Image(),
    frames : 3,
    sig : new Image(),
    timer : 1800,
    actualFrame : 1,
    animationSpeed : 100,
    lastAnim : 0,
    lastFrame : 0,
    forward : true
}

portrait.img.src = "textures/charPortrait.png";
portrait.sig.src = "textures/charSig.png"; 

export function drawBossBar(name, boss){
    let tzo = screen.ctx.textAlign;
    screen.ctx.textAlign = "left";
    drawText(name, 100, 32, "red", 24);

    screen.ctx.textAlign = "right";
    drawText(Math.ceil(boss.hp)+" HP", screen.cw-100, 32, "red", 24);

    screen.ctx.fillStyle = "grey";
    screen.ctx.fillRect(100,36,screen.cw-200,8);

    screen.ctx.fillStyle = "red";
    screen.ctx.fillRect(100,36,(screen.cw-200)*(boss.hp/boss.baseHp),8);

    screen.ctx.textAlign = tzo;
}




function drawText(msg,x,y,color,size){
    screen.ctx.font = size+"px fonciak";
    screen.ctx.fillStyle = color;
    screen.ctx.textBaseLine = "top";
    screen.ctx.fillText(msg,x,y);
}

var upgradeImages = {
    hpUpg : new Image(),
    atkUpg : new Image(),
    spdUpg : new Image()
}

upgradeImages.hpUpg.src = "textures/ui/upgHp.png";
upgradeImages.atkUpg.src = "textures/ui/upgDmg.png"
upgradeImages.spdUpg.src = "textures/ui/upgSpd.png"
