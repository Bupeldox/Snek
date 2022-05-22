import { Colors } from "../Utilities/Colors";
import Vec2 from "../Utilities/vec2";


export class LevelBase {
    constructor(MatterWorldHandler, width, height,changeLevelFunc,targetLevel) {
        console.log("boop");
        this.MatterWorldHandler = MatterWorldHandler;
        this.targetLevel = targetLevel;
        this.changeLevelFunc = changeLevelFunc;

        this.width = width;
        this.height = height;

        this.goals = [];
        this.bodies = [];
    }
    createBodies() {
        return [];
    }
    getSnekStartPos(){
        return new Vec2(300, 730);
    }
    addWalls() {
        var props = { isStatic: true, render: { fillStyle: Colors.Obsticals } };
        var wallWidth = 100;
        var wallOverlap = 0.8;
        var wallEdgeOffset = wallOverlap*wallWidth/2
        this.bodies.push(this.MatterWorldHandler.createRect(this.width / 2, this.height+wallEdgeOffset, this.width, wallWidth, props));//bottom
        this.bodies.push(this.MatterWorldHandler.createRect(this.width / 2, -wallEdgeOffset, this.width, wallWidth, props)); //top
        this.bodies.push(this.MatterWorldHandler.createRect(-wallEdgeOffset, this.height / 2, wallWidth, this.height, props));//left
        this.bodies.push(this.MatterWorldHandler.createRect(this.width+wallEdgeOffset, this.height / 2, wallWidth, this.height, props));//right
    }
}