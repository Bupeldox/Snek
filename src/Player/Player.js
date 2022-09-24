import MouseDraggingHelper, { JQEventHandler, ButtonEventHandler, ControllerHandler } from "./MouseEventHandler";
import Vec2 from "../Utilities/vec2.js";
import Worm from "./Worm.js";

import { MAX_LENGTH,MOVE_DIST,MOVE_SPEED,WORM_RADIUS } from "../Utilities/WormSettings.js";
import { CameraFollowController } from "../Matter/CameraFollowController";

export class Player {
    constructor(MatterHandler,controllerNumber) {
        this.MatterHandler = MatterHandler;

        this.MouseDraggingHelper = new MouseDraggingHelper(this.MatterHandler.domElement, document);
        this.clickHandler = new JQEventHandler(document.getElementById("thing"), "click");
        this.reverseControlHandler = new ButtonEventHandler(document.body, "s");
        this.forwardsControlHandler = new ButtonEventHandler(document.body, "w");
        this.resetControlHandler = new ButtonEventHandler(document.body,"r");
        this.controllerHandler = new ControllerHandler();
        this.followCamera = new CameraFollowController();

        this.clickHandler.register(() => { this.Worm.onPhysicsBreak(); });
        this.Worm = new Worm(MOVE_DIST, MAX_LENGTH, MOVE_SPEED, WORM_RADIUS, this.MatterHandler, () => { this.resetWormPos(this.Worm); });

        
    }

    resetWormPos(worm,p) {
        if (!p) {
            if(this.startPos){
                p = this.startPos;
            }else{
                p = new Vec2(300, 730);
            }
                
        }else{
            this.startPos = p;
        }

        if(!worm){
            this.resetWormPos(this.Worm,p);
            if(this.Worm2){
                this.resetWormPos(this.Worm2,p);
            }
        }
        else{
            worm.removeWholeWorm();
            worm.create(p);
            this.followCamera.updateFollow(worm.objects[0]);
        }
    }

    update() {

        if(this.controllerHandler.isConnected(0)){
            if(!this.Worm2){
                document.getElementById("coopCollisionBox")?.classList.remove("hidden");
                this.Worm2 = new Worm(MOVE_DIST, MAX_LENGTH, MOVE_SPEED, WORM_RADIUS, this.MatterHandler, () => { this.resetWormPos(this.Worm2); },true);
                this.resetWormPos(this.Worm2);
            }
            var sticks = this.controllerHandler.getSticks(0);

            if(sticks[1].magnitude()>0.5){
                var notMousePos = new Vec2(this.Worm2.objects[this.Worm2.objects.length-1].position).add(sticks[1].times(20));
                this.Worm2.move(notMousePos);
            }else if(sticks[0].magnitude()>0.5){
                var notMousePos = new Vec2(this.Worm2.objects[0].position).add(sticks[0].times(20));
                this.Worm2.reverse(notMousePos);
            }
        }else{
            if(this.Worm2){
                this.Worm2.removeWholeWorm();
                this.Worm2 = null;
            }
        }

        if (this.MouseDraggingHelper.isDragging || this.forwardsControlHandler.isPressed) {
            this.Worm.move(this.MouseDraggingHelper.pos);
        } else if (this.reverseControlHandler.isPressed) {

            this.Worm.reverse(this.MouseDraggingHelper.pos);
        }
    
        if(this.resetControlHandler.isPressed){
            this.resetWormPos(this.Worm);
            if(this.Worm2){
                this.resetWormPos(this.Worm2);
            }
        }
      
        this.Worm.update();
        this.Worm2?.update();


        this.followCamera.Update();
    }
    destroy() {
        this.Worm.removeWholeWorm();
        this.Worm2?.removeWholeWorm();
    }
}