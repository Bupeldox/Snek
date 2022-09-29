import Vec2 from "../../Utilities/vec2";
import { LevelBase } from "../LevelBase";
import { LevelLoader } from "../LevelLoader";




export class BasicLevel extends LevelBase {
    constructor(matterHandler, width, height, onComplete,levelDataIndex) {
        super(matterHandler, width, height)
        this.matterHandler = matterHandler;
        this.levelLoader = new LevelLoader(matterHandler);
        this.onComplete = onComplete;

        if(typeof (levelDataIndex)  == 'number'){
            this.levelIndex = levelDataIndex;
        }else if(typeof(levelDataIndex) == 'string'){
            this.levelIndex = this.levelLoader.getIndexOfTitle(levelDataIndex);
        }

        var dat = this.levelLoader.getElements(this.levelIndex);


        this.bodies = dat.levelElements;
        this.goals = dat.goals;

        this.startpos = new Vec2(dat.snekSettings.startPos);
        this.followCamera = dat.snekSettings.followCamera;
       
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
            this.onComplete();
        });

    }



}