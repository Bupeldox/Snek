import MouseDraggingHelper, { JQEventHandler } from "./MouseEventHandler";
import Vec2 from "./vec2.js";
import Worm from "./WormV2.js";
import { MOVE_DIST, MAX_LENGTH, MOVE_SPEED, WORM_RADIUS } from "./game";

export class Player {
    constructor(MatterHandler) {
        this.MatterHandler = MatterHandler;

        this.MouseDraggingHelper = new MouseDraggingHelper(this.MatterHandler.domElement, document.body);
        this.clickHandler = new JQEventHandler(document.getElementById("thing"), "click");
        
        this.clickHandler.register(() => { this.Worm.onPhysicsBreak(); });
        this.Worm = new Worm(MOVE_DIST, MAX_LENGTH, MOVE_SPEED, WORM_RADIUS, this.MatterHandler, () => { this.resetWormPos(); });
        this.resetWormPos();
    }
    resetWormPos() {
        this.Worm.move(new Vec2(300, 730));
    }
    update() {
        if (this.MouseDraggingHelper.isDragging) {
            this.Worm.move(this.MouseDraggingHelper.pos);
        }
        this.Worm.update();
    }
}
