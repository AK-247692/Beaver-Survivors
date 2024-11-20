import { screen } from "./main.js";


export function lookAt(self, target){
    return Math.atan2(target.position.y-self.position.y, target.position.x-self.position.x) * (180 / Math.PI);
}

export function radialMove(deg){
    let x = Math.cos(deg*(Math.PI/180));
    let y = Math.sin(deg*(Math.PI/180));
    return {x: x, y: y};
}

export function lerp(start, end, t) {
    return start * (1 - t) + end * t;
  }

export function lerpDegrees(start, end, t) {
    // Adjust start and end values to be within 0-360 range
    start = (start + 360) % 360;
    end = (end + 360) % 360;
  
    // Calculate shortest distance between start and end angles
    var shortestDist = ((((end - start) % 360) + 540) % 360) - 180;
  
    // Calculate interpolated angle
    var interpolatedAngle = (start + shortestDist * t + 360) % 360;
  
    return interpolatedAngle;
}


export function findObjectInArray(obj, array) {
    return array.findIndex(function(element) {
      return element === obj;
    });
  }

export function checkDistance(from, to){
    return Math.sqrt((from.position.x - to.position.x)**2 + (from.position.y - to.position.y)**2);
}

export function checkRectCollision(a,b){
    if (
        a.position.x < b.position.x + b.width &&
        a.position.x + a.width > b.position.x &&
        a.position.y < b.position.y + b.height &&
        a.position.y + a.height > b.position.y
    ){
      return true;
    }else{
      return false;
    }
}





