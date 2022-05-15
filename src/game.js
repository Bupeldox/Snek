import $ from "jquery";
import { Colors } from "./Utilities/Colors.js";
import LevelFactory from "./world/LevelHandler";
import MatterHandler from "./MatterHandler.js";
import { Player } from "./Player/Player";
import Vec2 from "./Utilities/vec2.js";


export const MOVE_DIST = 10;
export const WORM_RADIUS = 20;
export const MAX_LENGTH = 400;
export const MOVE_SPEED = 150 / 1000; //px per second


export default class Game {
    constructor() {
        this.MatterHandler = new MatterHandler();

        this.loadNewLevel(1);
        this.running = true;
        
        this.update();
    }
    loadNewLevel(index) {
        debugger;
        this.MatterHandler.unloadLevel();
        if (this.player) {
            this.player.destroy();
        }else{
            this.player = new Player(this.MatterHandler);
        }

        this.level = this.MatterHandler.LoadLevel(index);
        this.level.changeLevelFunc = (i) => this.loadNewLevel(i);

        this.player.resetWormPos(this.level.getSnekStartPos());

    }
    update() {
        this.player.update();

        if (this.running) {
            requestAnimationFrame(() => { this.update() });
        }
    }
}




var game = new Game();