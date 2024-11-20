
class Sound{
    constructor(url){
        this.url = "sfx/"+url;
        this.sample = new Audio(this.url);
        
    }
    play(){
        this.sample.play();
    }
}

export var sounds = {
    damageDealt : new Sound("damageDealt.wav"),
    destroy : new Sound("destroy.wav"),
    expPickup : new Sound("expPickup.wav"),
    shotBlaster : new Sound("shotBlaster.wav"),
    shotTrooper : new Sound("shotTrooper.wav")
}

console.log(sounds.damageDealt)