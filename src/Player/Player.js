import MouseDraggingHelper, { JQEventHandler, ButtonEventHandler } from "./MouseEventHandler";
import Vec2 from "../Utilities/vec2.js";
import Worm from "./Worm.js";
import { MOVE_DIST, MAX_LENGTH, MOVE_SPEED, WORM_RADIUS } from "../game";

export class Player {
    constructor(MatterHandler) {
        this.MatterHandler = MatterHandler;

        this.MouseDraggingHelper = new MouseDraggingHelper(this.MatterHandler.domElement, document.body);
        this.clickHandler = new JQEventHandler(document.getElementById("thing"), "click");
        this.reverseControlHandler = new ButtonEventHandler(document.body, "s");
        this.forwardsControlHandler = new ButtonEventHandler(document.body, "w");

        this.clickHandler.register(() => { this.Worm.onPhysicsBreak(); });
        this.Worm = new Worm(MOVE_DIST, MAX_LENGTH, MOVE_SPEED, WORM_RADIUS, this.MatterHandler, () => { this.resetWormPos(); });
        this.resetWormPos();
    }

    resetWormPos(p) {
        if (!p) {
            p = new Vec2(300, 730);
        }
        this.Worm.create(p);
    }

    update() {
        if (this.MouseDraggingHelper.isDragging || this.forwardsControlHandler.isPressed) {
            this.Worm.move(this.MouseDraggingHelper.pos);
        } else if (this.reverseControlHandler.isPressed) {

            this.Worm.reverse(this.MouseDraggingHelper.pos);
        }
        this.Worm.update();
    }
    destroy() {
        this.Worm.removeWholeWorm();
    }
}