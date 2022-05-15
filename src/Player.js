import MouseDraggingHelper, { JQEventHandler, ButtonEventHandler } from "./MouseEventHandler";
import Vec2 from "./vec2.js";
import Worm from "./WormV2.js";
import { MOVE_DIST, MAX_LENGTH, MOVE_SPEED, WORM_RADIUS } from "./game";

export class Player {
    constructor(MatterHandler) {
        this.MatterHandler = MatterHandler;

        this.MouseDraggingHelper = new MouseDraggingHelper(this.MatterHandler.domElement, document.body);
        this.clickHandler = new JQEventHandler(document.getElementById("thing"), "click");
        this.reverseControlHandler = new ButtonEventHandler(document.body,"s");

        this.clickHandler.register(() => { this.Worm.onPhysicsBreak(); });
        this.Worm = new Worm(MOVE_DIST, MAX_LENGTH, MOVE_SPEED, WORM_RADIUS, this.MatterHandler, () => { this.resetWormPos(); });
        this.resetWormPos();
    }
    
    resetWormPos() {
        this.Worm.create(new Vec2(300, 730));
    }

    update() {
        if (this.MouseDraggingHelper.isDragging) {
            this.Worm.move(this.MouseDraggingHelper.pos);
        }else if(this.reverseControlHandler.isPressed){
            console.log("reverse");
            this.Worm.reverse(this.MouseDraggingHelper.pos);
        }
        this.Worm.update();
    }
}
