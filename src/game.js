
import $ from "jquery";
import { Colors } from "./Colors.js";
import MatterHandler from "./MatterHandler.js";
import { Player } from "./Player";
import Vec2 from "./vec2.js";


export const MOVE_DIST = 10;
export const WORM_RADIUS = 20;
export const MAX_LENGTH = 400;
export const MOVE_SPEED = 150/1000; //px per second


export default class Game{
    constructor(){
        this.MatterHandler = new MatterHandler();
        
        this.player = new Player(this.MatterHandler);
        this.running = true;
        var target = new Collectable(new Vec2(500,200), this.MatterHandler);
        this.update();
    }
    update(){
        this.player.update();

        if(this.running){
            requestAnimationFrame(()=>{this.update()});
        }
    }
}


class Collectable{
    constructor(pos,MatterHandler){
        this.MatterHandler = MatterHandler;

        this.bod = this.MatterHandler.addCollectable(pos,{
            isStatic:true,
            render:{
                fillStyle:Colors.Collectable
            }
        });
    }
}



var game = new Game();
