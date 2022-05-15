import Vec2 from "../Utilities/vec2";

const WORM_CATEGORY = 0b0010;
const DEFAULT_CATEGORY = 0b0001;
const maxAngle = 0.3;
const maxDeltaAngle = 0.1;
const jointStiffness = 0.9;
const historyLength = 10; //frames of history ish


export default class WormV2 {
    constructor(moveDist, maxLength, moveSpeed, width, matterHandler) {
        this.matterHandler = matterHandler;
        this.moveDist = moveDist;
        this.moveSpeed = moveSpeed;
        this.maxLength = maxLength;
        this.width = width
        this.objects = [];
        this.lastPlaced = Date.now();
    }
    move(p) {


        if (this.lastPlaced < Date.now() - (this.moveDist / this.moveSpeed)) {
            this.lastPlaced = Date.now();
        } else {
            return;
        }



        p = new Vec2(p);
        //line from end to p,max(dist)
        if (this.objects.length >= 1) {
            var endPos = new Vec2(this.objects[this.objects.length - 1].position);
            var delta = p.add(endPos.times(-1));
            var length = delta.magnitude();
            if (length > this.moveDist) {
                delta = delta.normalised().times(this.moveDist);
            }

            p = endPos.add(delta);
        }

        var removedPos;
        if (this.objects.length >= (this.maxLength / this.moveDist)) {
            var toRemove = this.objects[0];
            removedPos = new Vec2(toRemove.position);
            this.matterHandler.removeObject(toRemove);
            this.objects.shift();
        }

        var s = this.matterHandler.addObject(p, this.width);
        s.collisionFilter.category = WORM_CATEGORY;
        s.collisionFilter.mask = DEFAULT_CATEGORY;
        //only collides with default cat. not worm cat.
        this.objects.push(s);
        if (this.objects.length >= 2) {
            for (var i = Math.max(0, this.objects.length - 3); i < this.objects.length - 1; i++) {
                this.matterHandler.joinObjects(this.objects[i], this.objects[this.objects.length - 1]);
            }
        }


        //its like every piece just moved backwards.
        const moveBackForceMultiplier = 0.05 / this.moveDist;
        for (let i = 0; i < this.objects.length - 1; i++) {
            const bodElem = this.objects[i];
            const prevBodElem = this.objects[i + 1];
            var forceDirForThis = new Vec2(bodElem.position).sub(new Vec2(prevBodElem.position)).normalised().times(1).times(moveBackForceMultiplier);
            this.matterHandler.applyForce(bodElem, prevBodElem.position, forceDirForThis);
        }

    }
}