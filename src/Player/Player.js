import MouseDraggingHelper, { JQEventHandler, ButtonEventHandler, ControllerHandler } from "./MouseEventHandler";
import Vec2 from "../Utilities/vec2.js";
import Worm from "./Worm.js";

import { MAX_LENGTH,MOVE_DIST,MOVE_SPEED,WORM_RADIUS } from "../Utilities/WormSettings.js";

export class Player {
    constructor(MatterHandler,controllerNumber) {
        this.MatterHandler = MatterHandler;

        this.MouseDraggingHelper = new MouseDraggingHelper(this.MatterHandler.domElement, document);
        this.clickHandler = new JQEventHandler(document.getElementById("thing"), "click");
        this.reverseControlHandler = new ButtonEventHandler(document.body, "s");
        this.forwardsControlHandler = new ButtonEventHandler(document.body, "w");
        this.controllerHandler = new ControllerHandler();
        

        this.clickHandler.register(() => { this.Worm.onPhysicsBreak(); });
        this.Worm = new Worm(MOVE_DIST, MAX_LENGTH, MOVE_SPEED, WORM_RADIUS, this.MatterHandler, () => { this.resetWormPos(); });
        
    }

    resetWormPos(p) {
        this.Worm.removeWholeWorm();
        if (!p) {
            p = new Vec2(300, 730);
        }
        this.Worm.create(p);
    }

    update() {

        if(this.controllerHandler.isConnected(0)){
            var sticks = this.controllerHandler.getSticks(0);
            var triggers = this.controllerHandler.getTriggers(0);
            var moveStick = sticks[1];
            if(sticks[1].magnitude()>0.5){
                var notMousePos = new Vec2(this.Worm.objects[this.Worm.objects.length-1].position).add(sticks[1].times(20));
                this.Worm.move(notMousePos);
            }else if(sticks[0].magnitude()>0.5){
                var notMousePos = new Vec2(this.Worm.objects[0].position).add(sticks[0].times(20));
                this.Worm.reverse(notMousePos);
            }
        }else{
            if (this.MouseDraggingHelper.isDragging || this.forwardsControlHandler.isPressed) {
                this.Worm.move(this.MouseDraggingHelper.pos);
            } else if (this.reverseControlHandler.isPressed) {
    
                this.Worm.reverse(this.MouseDraggingHelper.pos);
            }
        }

      
        this.Worm.update();
    }
    destroy() {
        this.Worm.removeWholeWorm();
    }
}