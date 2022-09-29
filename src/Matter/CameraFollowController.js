import { Vector } from "matter-js";
import Vec2 from "../Utilities/vec2";
import { engine, render, width, height, Render, Bounds } from "./MatterHandler";



export class CameraFollowController {
    constructor() {
        this.following;
        this.levelRequiresStaticCamera = false;
        this.offset = new Vec2(0, 0);
        this.currentpos = new Vec2((render.bounds.min.x+render.bounds.max.x)/2,(render.bounds.min.y+render.bounds.max.y)/2);
        this.boundsScale = new Vec2(1,1);
        render.options.hasBounds = true;
    }
    onNewLevel(followCam){
        this.levelRequiresFollowCam = followCam;
        console.log("requiresFollowcam = "+ followCam);

        if(!followCam){
            this.Move(this.offset.times(-1));
        }
    }
    updateFollow(bod,snap=true) {
        this.following = bod;


        if(snap && this.following && this.levelRequiresFollowCam){
            var delta = new Vec2(bod.position).sub(this.currentpos);
            this.Move(delta);
        }
    }
    Update(mousePos) {

        if(!this.levelRequiresFollowCam){
            return;
        }


        if (!this.following || !engine) {
            return;
        }
        var newPos = new Vec2(this.following.position);
        //newPos = newPos.add(mousePos).times(1/2);
        var maxDist = 100;

        var theSigmoidThing = (x)=>{
            var a = 10;
            var b = 12;
            var c = 0.01;
            var d = 1.4;
            var g = 2;
            var h = 0.06;
            return (g*((1/(1+(Math.pow(d,1-(b-(a*x))))))+c));
        };

        var toTranslate = false;
        var newDist = newPos.distance(this.currentpos);

        if(newDist>maxDist){
            var delta = newPos.sub(this.currentpos);
            var deltaDist = newDist-maxDist;

            toTranslate = delta.normalised(deltaDist).times(newDist-maxDist);
            toTranslate = toTranslate.times(theSigmoidThing(deltaDist*(maxDist*maxDist))).add(toTranslate.normalised().times(0.01));
        }
        
        if(toTranslate){
            this.Move(toTranslate);
        }
    }

    Move(delta){
        Bounds.translate(render.bounds,Vector.create(delta.x,delta.y));
        this.currentpos = this.currentpos.add(delta);
        this.offset = this.offset.add(delta);
    }
}
