import { Colors } from "../Colors.js";
import Vec2 from "./vec2.js";

const maxAngle = 0.3;
const maxDeltaAngle = 0.05;
const jointStiffness = 0.9;
const historyLength = 10; //frames of history ish


export default class Snek {
    constructor(moveDist, maxLength, moveSpeed,width, matterHandler) {
        this.matterHandler = matterHandler;
        this.moveDist = moveDist;
        this.moveSpeed = moveSpeed;
        this.maxLength = maxLength;
        this.partCount = Math.floor(this.maxLength / this.moveDist);
        this.width = width;
        this.objects = [];
        this.joints = [];
        this.lastPlaced = Date.now();
    }
    addSegment(p,width){

        if(this.objects.length!=0){
            p= new Vec2(this.objects[this.objects.length-1].position);
            p.x+= this.moveDist;
        }

        var s = this.matterHandler.addObject(p,width);

     
        // if(this.objects.length == this.partCount-1){
        //     s.render.fillStyle=Colors.MoveableObsticals;
        // }else{
            if(Math.random()>0.5){
                s.render.fillStyle=Colors.SnekA;
            }else{
                s.render.fillStyle=Colors.SnekB;
            }
        //}


        this.objects.push(s);
        if (this.objects.length >= 2) {
            for (var i = Math.max(0,this.objects.length -2); i < this.objects.length - 1; i++) {
                this.objects[i].myJoint = 
                new WormJoint(
                    this.objects[i],
                    this.objects[this.objects.length - 1],
                    0,
                    this.width*2,
                    this.matterHandler
                );
                
            }
        }
    }

    createWholeWorm(p){
        for(var i=0;i<this.partCount;i++){
            //var width = (Math.log((i/this.partCount)+3)*1.6)*this.width/2;
            this.addSegment(p,this.width);
        }
        var head = this.objects[this.objects.length-1];
        var eyePos = new Vec2(head.position);
        var eye = this.matterHandler.addEye(this.width/2.5,head);
        eye.render.fillStyle=Colors.SnekEye;
        

    }
    move(p) {
        p = new Vec2(p);

        if(this.objects.length<this.partCount){
            this.createWholeWorm(p);
            return;
        }


        var lastWormElement = this.objects[this.objects.length-1];
        var lastElemPos =new Vec2(lastWormElement.position);
        var secondLastWormElement = this.objects[this.objects.length-2];
        var secondLastPos = new Vec2(secondLastWormElement.position)
        var lastSegmentVec = lastElemPos.sub(secondLastPos);

        var secondToEndToMouse = p.sub(secondLastPos);
        var angle = lastSegmentVec.angle(secondToEndToMouse)*-1;

        this.shuffleAnglesBackwards(0);
        secondLastWormElement.myJoint.setAngle(angle);


        
    
    }
    shuffleAnglesBackwards(){
        for (let i = 0; i < this.objects.length-2; i++) {
            const obj = this.objects[i];
            const nextObj = this.objects[i+1];
            obj.myJoint.setAngle(nextObj.myJoint.angleHistory[0]);

        }
    }
    
}

class WormJoint{
    constructor(a,b,angle, baseLength,matterHander){
        this.matterHander = matterHander;
        this.bodA = a;
        this.bodB = b;
        this.baseLength = baseLength;
        this.angle = angle;
        this.angleHistory = [0];
        this.targetAngle = angle;

        //1 = top
        //p = parallel
        //d = diagonal

        var a1 = new Vec2(0,baseLength/2);
        var a2 = new Vec2(0,-baseLength/2);
        var c = new Vec2(0,0);
        var f = new Vec2(baseLength/2,0);


        this.joints = {
            p1:this.matterHander.createJoint(a,b,a1,a1,jointStiffness),
            p2:this.matterHander.createJoint(a,b,a2,a2,jointStiffness),
            d1:this.matterHander.createJoint(a,b,c,a2,jointStiffness),
            d2:this.matterHander.createJoint(a,b,c,a1,jointStiffness),
            f:this.matterHander.createJoint(a,b,c,f,jointStiffness),
        };
        for(var i in this.joints){
            var joint = this.joints[i];
            joint.myStartLength = joint.length+0;
            joint.render.strokeStyle="#0000";
        }
        
        
    }

    setAngle(angle){
        if(Math.abs(angle)>maxAngle){
            var sign = Math.sign(angle);
            angle = maxAngle*sign;
        }
        this.targetAngle = angle;


        if(this.angleHistory.length >= historyLength){
            this.angleHistory.shift();
        }
        this.angleHistory.push(angle);


        var deltaAngle = this.angle-this.targetAngle;
        if(Math.abs(deltaAngle)<maxDeltaAngle){
            this.angle = this.targetAngle;
        }else{
            this.angle -= maxDeltaAngle*Math.sign(deltaAngle);
        }
        


        this.setParrallel(this.joints.p1,this.angle);
        this.setParrallel(this.joints.p2,-this.angle);

    }

    setParrallel(j,angle){
        var delta = Math.sin(angle)*this.baseLength/2;
        var length = j.myStartLength + delta;
        
        j.length = Math.max(length,2);

    }
    update(){
        
    }

}

