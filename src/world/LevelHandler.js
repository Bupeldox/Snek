import { Level2 } from "./Levels/Level2";
import { Level1 } from "./Levels/Level1";
import { BasicLevel } from "./levels/BasicLevel";
import { RandomLevel } from "./Levels/RandomLevel";



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
        this.toChangeLevel = toChangeLevel;

        //Levelouts = [exit] = level index.
        this.levelOrder = [
            {levelIndex:0,levelOuts:[1]},
            {levelIndex:1,levelOuts:[2]},
            {levelIndex:2,levelOuts:[3]},
            {levelIndex:3,levelOuts:[4]},
            {levelIndex:4,levelOuts:[5]},
            {levelIndex:5,levelOuts:[6]},
            {levelIndex:6,levelOuts:[7]},
            {levelIndex:7,levelOuts:[8]},
            {levelIndex:8,levelOuts:[8]},
        ];


        this.Levels = [
            (mwh, w, h) => new Level2(       mwh,w,h,(e)=>{this.onLevelComplete(0,e);}   ), //Tutorial 1
            (mwh, w, h) => new BasicLevel(   mwh,w,h,(e)=>{this.onLevelComplete(1,e);}   ,"Tutorial 2"),
            (mwh, w, h) => new BasicLevel(   mwh,w,h,(e)=>{this.onLevelComplete(2,e);}   ,"Ball pit"),
            (mwh, w, h) => new BasicLevel(   mwh,w,h,(e)=>{this.onLevelComplete(3,e);}   ,"Bush gap"), 
            (mwh, w, h) => new BasicLevel(   mwh,w,h,(e)=>{this.onLevelComplete(4,e);}   ,"Grass mound"), 
            (mwh, w, h) => new BasicLevel(   mwh,w,h,(e)=>{this.onLevelComplete(5,e);}   ,"Hisyphus"), 
            (mwh, w, h) => new BasicLevel(   mwh,w,h,(e)=>{this.onLevelComplete(6,e);}   ,"Bench and gate"), 
            (mwh, w, h) => new BasicLevel(   mwh,w,h,(e)=>{this.onLevelComplete(7,e);}   ,"Totem"), 
            (mwh, w, h) => new RandomLevel(  mwh,w,h,(e)=>{this.onLevelComplete(8,e);}   ), //Random (Loop)
        ];
    }
    onLevelComplete(levelIndexCompleted,exitNumber = 0){
        var nextLevel = this.levelOrder.find(i=>i.levelIndex == levelIndexCompleted).levelOuts[exitNumber];
        if(this.toChangeLevel == undefined){
            throw "level change function not seta on level handler!";
        }
        this.toChangeLevel(nextLevel);
    }
    setToChangeLevel(i){
        this.toChangeLevel = i;
    }
    getLevel(index) {
        if(index >= this.Levels.length){
            index= 0;
        }
        return this.Levels[index];
    }
}
