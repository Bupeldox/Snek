import { Level2 } from "./Levels/Level2";
import { Level1 } from "./Levels/Level1";
import { BasicLevel } from "./levels/BasicLevel";



export class Collectable {
    constructor(body) {
        this.body = body;
        this.collected = false;
    }
    onCollect() {

    }
}



export default class LevelFactory {
    constructor(toChangeLevel) {
        // basic level, mwh,w,h,func,nextLevelindex(in this list),source
        var ln=1;
        this.Levels = [
            (mwh, w, h, toChangeLevel) => new Level2(mwh,w,h, toChangeLevel,ln++), //Tutorial
            (mwh, w, h, toChangeLevel) => new BasicLevel(mwh,w,h, toChangeLevel,ln++,0), //another tutorial
            (mwh, w, h, toChangeLevel) => new BasicLevel(mwh,w,h, toChangeLevel,ln++,2), //ball pit
            (mwh, w, h, toChangeLevel) => new Level1(mwh,w,h, toChangeLevel,ln++), //First one i made
            (mwh, w, h, toChangeLevel) => new BasicLevel(mwh,w,h, toChangeLevel,ln++,3), //bush gap
            (mwh, w, h, toChangeLevel) => new BasicLevel(mwh,w,h, toChangeLevel,ln++,4), //bush gap
            (mwh, w, h, toChangeLevel) => new BasicLevel(mwh,w,h, toChangeLevel,ln++,1), //tree?
        ];
    }
    getLevel(index) {
        if(index >= this.Levels.length){
            index= 0;
        }
        return this.Levels[index];
    }
}