import Vec2 from "../../Utilities/vec2";
import { LevelBase } from "../LevelBase";
import { LevelLoader } from "../LevelLoader";




export class BasicLevel extends LevelBase {
    constructor(matterHandler, width, height, changeLevelFunc, nextLevelIndex,levelDataIndex) {
        super(matterHandler, width, height, changeLevelFunc)
        this.matterHandler = matterHandler;
        this.changeLevelFunc = changeLevelFunc;
        this.levelLoader = new LevelLoader(matterHandler);
        this.levelIndex = levelDataIndex;
        this.nextLevelIndex = nextLevelIndex

        var dat = this.levelLoader.getElements(levelDataIndex);


        this.bodies = dat.levelElements;
        this.goals = dat.goals;

        this.startpos = new Vec2(dat.snekSettings.startPos);
        
       
    }

    createBodies() {

        this.bodies.forEach(i => {
            this.matterHandler.addBody(i);
        })
        this.goals.forEach(i => {
            this.matterHandler.addBody(i);
        })

        this.setupEvents();
        return this.bodies;
    }
    getSnekStartPos() {
        return this.startpos;
    }

    setupEvents() {

        this.matterHandler.registerPlayerCollisionEvent(this.goals[0], () => {
            this.changeLevelFunc(this.nextLevelIndex);
        });

    }



}