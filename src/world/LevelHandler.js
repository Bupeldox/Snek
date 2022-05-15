import { Level2 } from "./Levels/Level2";
import { Level1 } from "./Levels/Level1";




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
        this.Levels = [
            (mwh, w, h, toChangeLevel) => new Level1(mwh,w,h, toChangeLevel),
            (mwh, w, h, toChangeLevel) => new Level2(mwh,w,h, toChangeLevel)
        ];
    }
    getLevel(index) {
        return this.Levels[index];
    }
}