import { MatterHandler } from "./MatterHandler.js";
import { Player } from "./Player/Player";

export default class Game {
    constructor() {
        this.MatterHandler = new MatterHandler();

        this.loadNewLevel(0);
        this.running = true;
        
        this.update();
    }
    loadNewLevel(index) {
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