class Axis {
    constructor(positive,negative,input){
        this.positive = positive;
        this.negative = negative;
        this.input = input;
        this.value = 0;
    }
    updateAxis(){
        this.value = this.input.keys[this.positive].state - this.input.keys[this.negative].state;
        //console.log(this.value);
    }
}

class Key {

    constructor(alias, keyCode){
        this.keyCode = keyCode;
        this.alias = alias;
        this.state = 0;
    }
}

export class Input{
    constructor(keys){
        this.axis = {
            horizontal : new Axis("right", "left", this),
            vertical : new Axis("down", "up", this),
        }
        this.keys = {};
        for(let i=0;i<keys.length;i++){
            //console.log(keys[i].alias)
            this.keys[keys[i].alias] = 0;
            this.keys[keys[i].alias] = keys[i];
        }
        
        this.mouse = {
            x : 0,
            y : 0,
            lmb : 0,
        }
    }

    updateAxises(){
        for (const key in this.axis) {
            this.axis[key].updateAxis();
        }
    }
}


export var input = new Input(
    [
        new Key('left',"KeyA"),
        new Key('right',"KeyD"),
        new Key('up',"KeyW"),
        new Key('down',"KeyS"),
        new Key('fire',"KeyF"),
        new Key('upg1',"Digit1"),
        new Key('upg2',"Digit2"),
        new Key('upg3',"Digit3")
    ]
)
console.log(input);

document.onkeydown = function(e){
    for (const key in input.keys) {
        if (input.keys[key].keyCode == e.code && input.keys[key].state == 0) {
            input.keys[key].state = 1;
            console.log(input.keys[key].alias+" state: "+input.keys[key].state)
            e.preventDefault();
            input.updateAxises();
        }
    }

}

document.onkeyup = function(e){
    for (const key in input.keys) {
        if (input.keys[key].keyCode == e.code && input.keys[key].state == 1) {
            input.keys[key].state = 0;
            //console.log(input.keys[key].alias+" state: "+input.keys[key].state)
            e.preventDefault();
            input.updateAxises();
        }
    }

}