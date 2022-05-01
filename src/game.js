
import $ from "jquery";
import MatterHandler from "./MatterHandler.js";
import MouseDraggingHelper from "./MouseEventHandler";
import Vec2 from "./vec2.js";
import Worm from "./WormV2.js";

const MOVE_DIST = 10;
const WORM_RADIUS = 20;
const MAX_LENGTH = 400;
const MOVE_SPEED = 150/1000; //px per second


class Player {
    constructor(){
        this.MatterHandler = new MatterHandler();
 
        this.MouseDraggingHelper = new MouseDraggingHelper(this.MatterHandler.domElement,$("body")[0]);

        this.Worm = new Worm(MOVE_DIST,MAX_LENGTH,MOVE_SPEED,WORM_RADIUS,this.MatterHandler);
        
    }
   
    update(){
        if(this.MouseDraggingHelper.isDragging){
            this.Worm.move(this.MouseDraggingHelper.pos);
        }
    }

    
}


export default class Game{
    constructor(){
        this.player = new Player();
        this.running = true;
        this.update();
        this.player.Worm.move(new Vec2(300,730));
    }
    update(){
        this.player.update();

        if(this.running){
            requestAnimationFrame(()=>{this.update()});
        }
    }
}
var game = new Game();