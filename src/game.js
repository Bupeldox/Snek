
import $ from "jquery";
import { Colors } from "../Colors.js";
import MatterHandler from "./MatterHandler.js";
import MouseDraggingHelper from "./MouseEventHandler";
import Vec2 from "./vec2.js";
import Worm from "./WormV2.js";

const MOVE_DIST = 10;
const WORM_RADIUS = 20;
const MAX_LENGTH = 400;
const MOVE_SPEED = 150/1000; //px per second


class Player {
    constructor(MatterHandler){
        this.MatterHandler = MatterHandler
 
        this.MouseDraggingHelper = new MouseDraggingHelper(this.MatterHandler.domElement,document.body);

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
        this.MatterHandler = new MatterHandler();
        this.player = new Player(this.MatterHandler);
        this.running = true;
        var target = new Collectable(new Vec2(500,200), this.MatterHandler);
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
