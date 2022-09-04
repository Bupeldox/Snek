import { Colors } from "../Utilities/Colors.js";
import SnekTongue from "./SnekTongue.js";
import Vec2 from "../Utilities/vec2.js";
import WormJoint from "./WormJoint.js";
import SnekSounds from "./SnekSounds.js";

export const maxAngle = 0.3;
export const maxDeltaAngle = 0.05;
export const jointStiffness = 0.9;
export const historyLength = 7; //frames of history ish
const MaxAngularVelocity = 3;

export default class Snek {
    constructor(moveDist, maxLength, moveSpeed, width, matterHandler, resetFunc,isWorm2 = false) {
       
        this.askForReset = resetFunc;
        this.matterHandler = matterHandler;
        this.moveDist = moveDist;
        this.moveSpeed = moveSpeed;
        this.maxLength = maxLength;
        this.partCount = Math.floor(this.maxLength / this.moveDist);
        this.width = width;
        this.objects = [];
        this.joints = [];
        this.lastPlaced = Date.now();
        this.isMoving = false;
        this.isReversing = false;
        this.SingularityCounter = 20;
        this.isWorm2 = isWorm2;
    }
    addSegment(p, width) {

        if (this.objects.length != 0) {
            p = new Vec2(this.objects[this.objects.length - 1].position);
            p.x += this.moveDist;
        }

        var s = this.matterHandler.addSnekSegment(p, width,this.isWorm2);


        if (Math.random() > 0.5) {
            s.render.fillStyle = Colors.SnekA;
        } else {
            s.render.fillStyle = Colors.SnekB;
        }

        this.objects.push(s);
        if (this.objects.length >= 2) {
            for (var i = Math.max(0, this.objects.length - 2); i < this.objects.length - 1; i++) {
                this.objects[i].myJoint =
                    new WormJoint(
                        this.objects[i],
                        this.objects[this.objects.length - 1],
                        0,
                        this.width * 2,
                        this.matterHandler
                    );

            }
        }
    }

    createWholeWorm(p) {
        for (var i = 0; i < this.partCount; i++) {
            this.addSegment(p, this.width,this.isWorm2);
        }
        var head = this.objects[this.objects.length - 1];
        var eyePos = new Vec2(head.position);
        this.eye = this.matterHandler.addEye(this.width / 2.5, head,this.isWorm2);
        this.eye.render.fillStyle = Colors.SnekEye;

        this.tongue = new SnekTongue(this.matterHandler, this.width);
        this.tail = new SnekTongue(this.matterHandler, this.width);

        this.soundHandler = new SnekSounds(this);
    }

    create(p) {
        console.log("created");
        if (this.objects.length < this.partCount) {
            this.createWholeWorm(p);
        }
        this.setStartAngles();
    }

    setStartAngles(){
        this.objects.forEach((obj,i) => {
            if(obj && obj.hasOwnProperty("myJoint")){
                var joint = obj.myJoint;
                joint.setInitialAngle(startPos[i]);
            }
        });
    }
    move(p) {
        p = new Vec2(p);
        this.isMoving = true;

        var lastWormElement = this.objects[this.objects.length - 1];
        var lastElemPos = new Vec2(lastWormElement.position);
        var secondLastWormElement = this.objects[this.objects.length - 2];
        var secondLastPos = new Vec2(secondLastWormElement.position)
        var lastSegmentVec = lastElemPos.sub(secondLastPos);

        var secondToEndToMouse = p.sub(secondLastPos);
        var angle = lastSegmentVec.angle(secondToEndToMouse) * -1;

        this.shuffleAnglesBackwards();
        secondLastWormElement.myJoint.setAngle(angle);


        var relativeTongueAngle = angle;
        var maxAngle = 1;

        if (Math.abs(angle) > maxAngle) {
            relativeTongueAngle = maxAngle * Math.sign(angle);
        }

        var tongueVec = lastSegmentVec.rotate(relativeTongueAngle);
        var tongueAngle = tongueVec.angle(new Vec2(0, 1));


        this.tongue.updateAngle(tongueAngle, lastSegmentVec.angle(new Vec2(0, 1)));
    }

    reverse(p) {
        p = new Vec2(p);
        this.isReversing = true;


        if (this.objects.length < this.partCount) {
            this.createWholeWorm(p);
            return;
        }

        var lastWormElement = this.objects[0];
        var lastElemPos = new Vec2(lastWormElement.position);
        var secondLastWormElement = this.objects[1];
        var secondLastPos = new Vec2(secondLastWormElement.position)
        var lastSegmentVec = lastElemPos.sub(secondLastPos);

        var secondToEndToMouse = p.sub(secondLastPos);
        var angle = lastSegmentVec.angle(secondToEndToMouse);

        //This needs to be the other way around for reverse
        lastWormElement.myJoint.setAngle(angle);
        secondLastWormElement.myJoint.setAngle(angle);
        this.shuffleAnglesForwards();

        var relativeTongueAngle = angle;
        var maxAngle = 1;

        if (Math.abs(angle) > maxAngle) {
            relativeTongueAngle = maxAngle * Math.sign(angle);
        }

        var tongueVec = lastSegmentVec.rotate(-relativeTongueAngle);
        var tongueAngle = tongueVec.angle(new Vec2(0, 1));


        this.tail.updateAngle(tongueAngle, lastSegmentVec.angle(new Vec2(0, 1)));
    }

    shuffleAnglesBackwards() {
        //For moving 'forwards'
        for (let i = 0; i < this.objects.length - 2; i++) {
            const obj = this.objects[i];
            const nextObj = this.objects[i + 1];
            obj.myJoint.setAngle(nextObj.myJoint.angleHistory[0]);
        }
    }
    shuffleAnglesForwards() {
        //for moving 'backwards'
        for (let i = this.objects.length - 2; i >= 2; i--) {
            const obj = this.objects[i];
            const nextObj = this.objects[i - 1];
            obj.myJoint.setAngle(nextObj.myJoint.angleHistory[0]);
        }
    }

    update() {
        if (this.objects && this.objects.length >= 1) {
            if (Math.abs(this.objects[0].angularVelocity) > MaxAngularVelocity) {
                this.soundHandler.onPhysicsBreak();
                this.onPhysicsBreak();
            }
        }
        this.tongue.updatePos(this.objects[this.objects.length - 1].position);
        this.tail.updatePos(this.objects[0].position);

        if (this.isMoving) {
            this.tongue.show();
        } else {
            this.tongue.hide();
        }
        if (this.isReversing) {
            this.tail.show();
        } else {
            this.tail.hide();
        }
        this.soundHandler.update();


        //undo for next time
        this.isMoving = false;
        this.isReversing = false;
    }
    onPhysicsBreak() {
        this.SingularityCounter --;

        if(this.SingularityCounter<=0){
            Colors.SnekGradient = Colors.SnekGradientB;
        }
        this.removeWholeWorm();
        this.objects = [];
        this.askForReset();
    }
    removeWholeWorm() {
        if(!this.eye){
            return;
        }
        for (let i = 0; i < this.objects.length; i++) {
            const e = this.objects[i];
            this.matterHandler.remove(e);
        }
        this.tongue?.destroy();
        this.tail?.destroy();
        this.matterHandler.remove(this.eye)
        this.objects = [];
        this.eye = undefined;

        this.setStartAngles();
        this.soundHandler.destroy();
    }

}


const startPos = 
[1,0.3,0.3,0.3,0,-0.3,-0.3,-0.27,-0,0.3,0.3,0.3,0.3,0.03,-0.3,-0.3,-0.3,-0.3,-0.18,0.16,0.3,0.3,0.3,0.3,0.059,-0.29,-0.3,-0.3,-0.185,-0.05,0.2,0.3,0.3,0.3,0.14,0.01,-0.1,-0.3,-0.3];