import { Colors } from "../Utilities/Colors";


export class LevelBase {
    constructor(MatterWorldHandler, width, height,changeLevelFunc) {
        console.log("boop");
        this.MatterWorldHandler = MatterWorldHandler;

        this.changeLevelFunc = changeLevelFunc;

        this.width = width;
        this.height = height;

        this.goals = [];
        this.bodies = [];
    }
    createBodies() {
        return [];
    }
    addWalls() {
        var props = { isStatic: true, render: { fillStyle: Colors.Obsticals } };
        this.bodies.push(this.MatterWorldHandler.createRect(this.width / 2, this.height, this.width, 100, props));
        this.bodies.push(this.MatterWorldHandler.createRect(this.width / 2, 0, this.width, 100, props));
        this.bodies.push(this.MatterWorldHandler.createRect(0, this.height / 2, 100, this.height, props));
        this.bodies.push(this.MatterWorldHandler.createRect(this.width, this.height / 2, 100, this.height, props));
    }
}