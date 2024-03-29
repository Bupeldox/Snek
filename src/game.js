import { CustomRunner } from "./Utilities/CustomRunner.js";
import { MatterHandler } from "./Matter/MatterHandler.js";
import { Player } from "./Player/Player";
import { ButtonEventHandler } from "./Player/MouseEventHandler.js";

export default class Game {
    constructor() {
        this.MatterHandler = new MatterHandler((i)=>this.loadNewLevel(i));
        this.updateLoop = new CustomRunner();
        this.updateLoop.registerOnUpdate((t) => { this.update(t); });
        this.loadNewLevel(0);

        this.updateLoop.start();
        this.cheatsButton = new ButtonEventHandler(document,"@");
        this.cheatsButton.registerDown(()=>{
            this.level.onComplete();
        })
    }
    loadNewLevel(index) {

        this.MatterHandler.unloadLevel();
        if (this.player) {
            this.player.destroy();
        } else {
            this.player = new Player(this.MatterHandler);
        }
    
        this.level = this.MatterHandler.LoadLevel(index);
 
        this.player.onNewLevel(this.level.getSnekStartPos(), this.level.followCamera??false);
        this.player.resetWormPos();

    }
    update(t) {
        this.player.update();
        this.MatterHandler.DoTick(t);
    }
}



var game = new Game();