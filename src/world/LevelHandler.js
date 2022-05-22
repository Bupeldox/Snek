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
        this.Levels = [
            (mwh, w, h, toChangeLevel) => new Level2(mwh,w,h, toChangeLevel,1), //Tutorial
            (mwh, w, h, toChangeLevel) => new BasicLevel(mwh,w,h, toChangeLevel,2,0), //another tutorial
            (mwh, w, h, toChangeLevel) => new BasicLevel(mwh,w,h, toChangeLevel,3,2), //ball pit
            (mwh, w, h, toChangeLevel) => new Level1(mwh,w,h, toChangeLevel,4), //First one i made
            (mwh, w, h, toChangeLevel) => new BasicLevel(mwh,w,h, toChangeLevel,0,1), //tree/impossible
        ];
    }
    getLevel(index) {
        return this.Levels[index];
    }
}