import { Colors } from "../../Utilities/Colors";
import { LevelBase } from "../LevelBase";

export class Level1 extends LevelBase {
    
    createBodies() {
        var h = this.height;
        var w = this.width;
        // create two boxes and a ground
        var bodsToCreate = [];

        var obsticalSize = 90;
        var moveableObsticalProps = {
            render: {
                fillStyle: Colors.MoveableObsticals,
                strokeStyle: Colors.MoveableObsticalsBorder,
                lineWidth: 1
            }
        };

        this.bodies.push(this.MatterWorldHandler.createRect(400, 200, obsticalSize, obsticalSize, moveableObsticalProps));
        this.bodies.push(this.MatterWorldHandler.createRect(450, 50, obsticalSize, obsticalSize, moveableObsticalProps));
        this.bodies.push(this.MatterWorldHandler.createRect(500, 300, obsticalSize, obsticalSize / 1.5, moveableObsticalProps));

        obsticalSize = 80;

        //obsticals
        var obsticalProps = { isStatic: true, render: { fillStyle: Colors.Obsticals } };
        this.bodies.push(this.MatterWorldHandler.createRect(450, h - 50 - 40 - 80, obsticalSize, obsticalSize, obsticalProps));
        this.bodies.push(this.MatterWorldHandler.createRect(450 + 80 + 60, h - 50 - 40 - 80, obsticalSize, obsticalSize, obsticalProps));
        this.bodies.push(this.MatterWorldHandler.createRect(450 - 50, h - 50 - 40 - 80 - 50 - 80, obsticalSize, obsticalSize, obsticalProps));
        this.bodies.push(this.MatterWorldHandler.createRect(450 + 80 + 60 - 50, h - 50 - 40 - 80 - 50 - 80, obsticalSize, obsticalSize, obsticalProps));
        this.bodies.push(this.MatterWorldHandler.createRect(450, h - 50 - 40 - 80 - 50 - 80 - 50 - 80, obsticalSize, obsticalSize, obsticalProps));
        this.bodies.push(this.MatterWorldHandler.createRect(450 + 80 + 60, h - 50 - 40 - 80 - 50 - 80 - 50 - 80, obsticalSize, obsticalSize, obsticalProps));

        //walls
        this.addWalls();

        this.goals[0] = (this.MatterWorldHandler.createCollectable(w/2 - 25, h - 50 - 40 - 80 - 50 - 80 - 50 - 80-200,20));
      
        this.bodies = bodsToCreate;

        this.setupEvents();
    }

    setupEvents(){
          
        this.MatterWorldHandler.registerPlayerCollisionEvent(this.goals[0],()=>{
            this.MatterWorldHandler.removeObj(this.goals[0]);
        });

    }
}