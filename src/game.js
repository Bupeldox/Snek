import { MatterHandler } from "./MatterHandler.js";
import { Player } from "./Player/Player";

export default class Game {
    constructor() {
        this.MatterHandler = new MatterHandler();
        this.updateLoop = new CustomRunner();
        this.updateLoop.registerOnUpdate((t)=>{this.update(t);});
        
        this.loadNewLevel(0);        
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

        this.player.resetWormPos(undefined,this.level.getSnekStartPos());

    }
    update(t) {
        this.player.update();
        this.MatterHandler.DoTick(t);
    }
}



class CustomRunner {
    constructor() {
        this.running = false;
        this.fps = 60;

    }
    start() {
        this.running = true;
        this.step();
    }
    stop() {
        this.running = false;
    }
    registerOnUpdate(func) {
        this.onUpdate = func;
    }
    getFrameTime() {
        return 1000 / this.fps;
    }
    step() {

        var frameTime = this.getFrameTime();
        this.onUpdate(frameTime);

        if (this.running) {
            setTimeout(() => {
                this.step()
            }, frameTime);
        }
    }
}


var game = new Game();
