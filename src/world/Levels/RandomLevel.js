import { Colors } from "../../Utilities/Colors";
import Vec2 from "../../Utilities/vec2";
import { LevelBase } from "../LevelBase";

export class RandomLevel extends LevelBase {
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
        var maxSize = 200;
        var minSize = 10;
        var sizeRange = maxSize-minSize;

        for (var i = 0; i < 30; i++) {
            var rect = this.MatterWorldHandler.createRect(
                Math.random() * w,
                Math.random() * h,
                minSize + (Math.random() * sizeRange),
                minSize + (Math.random() * sizeRange),
                grassProps,
                Math.PI * Math.random()
            );
            this.bodies.push(rect);
        }


        this.addWalls();

        this.goals[0] = (this.MatterWorldHandler.createCollectable(w-100, h - 200));
       
        this.MatterWorldHandler.registerPlayerCollisionEvent(this.goals[0],()=>{
            this.changeLevelFunc(this.targetLevel);
        });

    }
}