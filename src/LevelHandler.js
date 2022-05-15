import { Colors } from "./Colors";

export default class LevelHandler {
    constructor() {
        this.Levels = [
            (a,b,c)=>this.Level1(a,b,c),
            (a,b,c)=>this.Level2(a,b,c)
        ];
    }
    getLevel(index) {
        return this.Levels[index];
    }
    Level1(B, w, h) {
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

        bodsToCreate.push(B.rectangle(400, 200, obsticalSize, obsticalSize, moveableObsticalProps));
        bodsToCreate.push(B.rectangle(450, 50, obsticalSize, obsticalSize, moveableObsticalProps));
        bodsToCreate.push(B.rectangle(500, 300, obsticalSize, obsticalSize / 1.5, moveableObsticalProps));

        obsticalSize = 80;

        //obsticals
        var obsticalProps = { isStatic: true, render: { fillStyle: Colors.Obsticals } };
        bodsToCreate.push(B.rectangle(450, h - 50 - 40 - 80, obsticalSize, obsticalSize, obsticalProps));
        bodsToCreate.push(B.rectangle(450 + 80 + 60, h - 50 - 40 - 80, obsticalSize, obsticalSize, obsticalProps));
        bodsToCreate.push(B.rectangle(450 - 50, h - 50 - 40 - 80 - 50 - 80, obsticalSize, obsticalSize, obsticalProps));
        bodsToCreate.push(B.rectangle(450 + 80 + 60 - 50, h - 50 - 40 - 80 - 50 - 80, obsticalSize, obsticalSize, obsticalProps));
        bodsToCreate.push(B.rectangle(450, h - 50 - 40 - 80 - 50 - 80 - 50 - 80, obsticalSize, obsticalSize, obsticalProps));
        bodsToCreate.push(B.rectangle(450 + 80 + 60, h - 50 - 40 - 80 - 50 - 80 - 50 - 80, obsticalSize, obsticalSize, obsticalProps));

        //walls
        this.addWalls(B,w,h,bodsToCreate);

        return bodsToCreate;
    }
    Level2(b, w, h) {
        var bodsToCreate = [];

        this.addWalls(B,w,h,bodsToCreate);

        return bodsToCreate;
    }
    addWalls(B,w,h,p){
        var props = { isStatic: true, render: { fillStyle: Colors.Obsticals } }
        p.push(B.rectangle(w / 2, h, w, 100, props));
        p.push(B.rectangle(w / 2, 0, w, 100, props));
        p.push(B.rectangle(0, h / 2, 100, h, props));
        p.push(B.rectangle(w, h / 2, 100, h, props));

    }
}

