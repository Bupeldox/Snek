import { CustomRunner } from "./Utilities/CustomRunner.js";
import { MatterHandler } from "./MatterHandler.js";
import { Player } from "./Player/Player";
import { ButtonEventHandler } from "./Player/MouseEventHandler.js";
import { EnvironmentSounds } from "./Sound/EnvironmentSounds.js";

export default class Game {
    constructor() {
        this.matterHandler = new MatterHandler((i)=>this.loadNewLevel(i));
        this.updateLoop = new CustomRunner();
        this.updateLoop.registerOnUpdate((t) => { this.update(t); });
        this.environmentSoundHandler = new EnvironmentSounds();
        this.loadNewLevel(0);

        this.updateLoop.start();
        this.cheatsButton = new ButtonEventHandler(document,"@");
        this.cheatsButton.registerDown(()=>{
            this.level.onComplete();
        })
    }
    loadNewLevel(index) {
        this.matterHandler.unloadLevel();
        if (this.player) {
            this.player.destroy();
        } else {
            this.player = new Player(this.matterHandler);
        }

        this.level = this.matterHandler.LoadLevel(index);
        
        if( this.currentLevel != index){
            this.environmentSoundHandler.onNewLevel();
        }else{
            this.environmentSoundHandler.onPhysicsBreak();
        }

        this.currentLevel = index;

        this.player.resetWormPos(undefined, this.level.getSnekStartPos());

    }
    update(t) {
        this.player.update();
        this.matterHandler.DoTick(t);
        this.environmentSoundHandler.update();
    }
}



var game = new Game();