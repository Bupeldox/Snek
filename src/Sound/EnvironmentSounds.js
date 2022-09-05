
import { MatterCollisionHandler } from "../MatterHandler";
import { SoundHelper} from "./SoundHelper.js";
import { Environment } from "./SoundSrc.js";


export class EnvironmentSounds{
    constructor(){
        this.collisionDetector = new MatterCollisionHandler();
        this.createCollisionSound = ()=>new SoundHelper(Environment.hit,false,0.2);
        this.sounds = {
            collision:[this.createCollisionSound()],
            levelEnd:new SoundHelper(Environment.finishLevel,false,0.05),
            blackHole:new SoundHelper(Environment.blackHole,false,0.5)
        }
        window.hit = 5;
        
        this.playedCollisions = [];
    }
    update(){
        var collisions = this.collisionDetector.getPairs();

        var hardCollisions = collisions.filter(i=>i.collision.depth>7)
        var freeCollisionSounds = this.sounds.collision.filter(i=>!i.playing);
        var index = 0;
        for(var i=0;i<hardCollisions.length;i++){
            var col = hardCollisions[i];
            if(this.playedCollisions.includes(col.id)){
                continue;
            }
            if(freeCollisionSounds.length>index){
                freeCollisionSounds[index].play();
                index++;
            }else{
                var colSound = this.createCollisionSound();
                colSound.play();
                this.sounds.collision.push(colSound);
                console.log(this.sounds.collision.length)
            }
            this.playedCollisions.push(col.id)
        }
        
        

        
    }
    onNewLevel(){
        this.sounds.levelEnd.play();
        console.log("levelEndPlayed")
    }
    onPhysicsBreak(){
        this.sounds.blackHole.play();
        blackHole.play();
    }
}