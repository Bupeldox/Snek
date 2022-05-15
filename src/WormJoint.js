import { Colors } from "./Colors.js";
import Vec2 from "./vec2.js";
import { historyLength, jointStiffness, maxAngle, maxDeltaAngle } from "./Worm";

export default class WormJoint {
    constructor(a, b, angle, baseLength, matterHander) {
        this.matterHander = matterHander;
        this.bodA = a;
        this.bodB = b;
        this.baseLength = baseLength;
        this.angle = angle;
        this.angleHistory = Array(historyLength).fill(0);
        this.targetAngle = angle;


        //1 = top
        //p = parallel
        //d = diagonal
        var a1 = new Vec2(0, baseLength / 2);
        var a2 = new Vec2(0, -baseLength / 2);
        var c = new Vec2(0, 0);
        var f = new Vec2(baseLength / 2, 0);


        this.joints = {
            p1: this.matterHander.createJoint(a, b, a1, a1, jointStiffness),
            p2: this.matterHander.createJoint(a, b, a2, a2, jointStiffness),
            d1: this.matterHander.createJoint(a, b, c, a2, jointStiffness),
            d2: this.matterHander.createJoint(a, b, c, a1, jointStiffness),
            f: this.matterHander.createJoint(a, b, c, f, jointStiffness),
        };

        if (!(a.myConstraints)) {
            a.myConstraints = [];
        }


        for (var i in this.joints) {
            var joint = this.joints[i];
            a.myConstraints.push(joint);
            joint.myStartLength = joint.length + 0;
            joint.render.strokeStyle = "#0000";
        }


    }


    setColor(angle) {
        var strain = Math.abs(angle / maxAngle);
        this.bodA.render.fillStyle = Colors.SnekGradient(strain);
    }

    setAngle(angle) {
        if (Math.abs(angle) > maxAngle) {
            var sign = Math.sign(angle);
            angle = maxAngle * sign;
        }
        this.targetAngle = angle;
        

        if (this.angleHistory.length >= historyLength) {
            this.angleHistory.shift();
        }
        this.angleHistory.push(angle);


        var deltaAngle = this.angle - this.targetAngle;
        if (Math.abs(deltaAngle) < maxDeltaAngle) {
            this.angle = this.targetAngle;
        } else {
            this.angle -= maxDeltaAngle * Math.sign(deltaAngle);
        }



        this.setParrallel(this.joints.p1, this.angle);
        this.setParrallel(this.joints.p2, -this.angle);

        this.setColor(this.angle);
    }

    setParrallel(j, angle) {
        var delta = Math.sin(angle) * this.baseLength / 2;
        var length = j.myStartLength + delta;

        j.length = Math.max(length, 2);

    }
    update() {
    }
}
