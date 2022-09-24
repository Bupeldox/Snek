import { Vector } from "matter-js";
import Vec2 from "../Utilities/vec2";
import { engine, render, width, height, Render, Bounds } from "./MatterHandler";



export class CameraFollowController {
    constructor() {
        this.following;
        this.offset = new Vec2(0, 0);
        this.currentpos = new Vec2(render.options.width/2,render.options.height/2)
        this.boundsScale = new Vec2(1,1);
        render.options.hasBounds = true;
    }
    updateFollow(bod) {
        this.following = bod;
    }
    Update() {
        if (!this.following && engine) {
            return;
        }
        var newPos = new Vec2(this.following.position);

        var toTranslate = false;
        var maxDist = 100;
        var newDist = newPos.distance(this.currentpos);
        var delta = newPos.sub(this.currentpos);
        if(newDist<maxDist){
            toTranslate = .normalised().times(newDist-maxDist);
            toTranslate = toTranslate.times(-0.01);
        }

        if(toTranslate){
            Bounds.translate(render.bounds,Vector.create(toTranslate.x,toTranslate.y));
        }
    }
}
