import { Colors } from "../../Utilities/Colors";
import Vec2 from "../../Utilities/vec2";
import { LevelBase } from "../LevelBase";

export class Level2 extends LevelBase {
    getSnekStartPos(){
        return new Vec2(200, 700);
    }
    createBodies() {
        var w = this.width;
        var h = this.height;

        var staticObjProps = {
            isStatic: true,
            render: {
                fillStyle: Colors.Obsticals
            }
        };

        var grassProps = staticObjProps;
        var grassSpacing = 120;
        var grassSize = 80;
        var grassCount = (w - 40) / grassSize;

        for (var i = 0; i < grassCount; i++) {
            var rect = this.MatterWorldHandler.createRect(i * grassSpacing, h - 40, grassSize, grassSize, grassProps, Math.PI / 4);
            this.bodies.push(rect);
        }


        this.addWalls();

        this.goals[0] = (this.MatterWorldHandler.createCollectable(w-100, h - 200));
       
        this.MatterWorldHandler.registerPlayerCollisionEvent(this.goals[0],()=>{
            this.changeLevelFunc(0);
        });

    }
}