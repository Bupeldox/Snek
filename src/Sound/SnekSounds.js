
import { MatterCollisionHandler } from "../MatterHandler";
import { SoundHelper, ProportionalSoundHelper} from "./SoundHelper.js";
import Vec2 from "../Utilities/vec2";
import { Environment, Snake } from "./SoundSrc.js";

var onBeat = ()=>{};
setInterval(()=>{
    onBeat();
},9000);

export class SnekSounds {
    constructor(snek){
        this.sounds = {
            slitherSound : new ProportionalSoundHelper(Snake.move,true,0.1,0.51),
            hissSound : new SoundHelper(Snake.hiss,true,0.1),
            fallingSound : new SoundHelper(Environment.falling,false,0.4),
        }
        this.snek = snek;
        this.snekIds = snek.objects.map(i=>i.id);
        this.collisionDetector = new MatterCollisionHandler();
        window.sliterFactor = 5;

        this.sounds.slitherSound.b = false;


        onBeat = ()=>{
            this.sounds.slitherSound.destroy();
            if(this.sounds.slitherSound.b){
                this.sounds.slitherSound.sound.src = Snake.move
            }else{
                this.sounds.slitherSound.sound.src = Snake.moveb
            }
            this.sounds.slitherSound.b = !this.sounds.slitherSound.b; 
        };

    }
    update(){
        var playingFallSound = false;
        //sliding sound
        var collisions = this.collisionDetector.getPairs().filter(i=>this.snekIds.includes(i.bodyA.id) ||this.snekIds.includes(i.bodyB.id));
        var playSliterSound = false;
        if(collisions.length > 0){
            var totalNormals = new Vec2(0,0);
            for(var i=0;i<collisions.length;i++){
                var pair = collisions[i];
                

                var bodyAMomentum = new Vec2(pair.bodyA.velocity);
                var bodyBMomentum = new Vec2(pair.bodyB.velocity);
                var relativeMomentum = bodyAMomentum.sub(bodyBMomentum);
                var force = relativeMomentum.magnitude();
                

                var flip = 1;
                if(this.snekIds.includes(pair.bodyB.id)){
                    flip = -1;
                }
                totalNormals = totalNormals.add(new Vec2(pair.collision.normal).times(flip).times(force));
            }
            var tdot = totalNormals.normalised().dot(new Vec2(0,-1));
            var totalForce = totalNormals.magnitude();
            if(tdot<0.97 && totalForce>2){
                playSliterSound = true;
                //var vol = Math.min(1,Math.pow(totalForce/window.sliterFactor,2));
                //this.sounds.slitherSound.volume = vol;
            }
        }else{
            //falling
            this.sounds.fallingSound.play();
            playingFallSound = true;
        }
        if(playSliterSound){
            this.sounds.slitherSound.play();
        }else{
            this.sounds.slitherSound.stop();
        }

        //Hiss Sound
        
        if(!this.wasPreviouslyMoving && (this.snek.isMoving || this.snek.isReversing)){
            this.sounds.hissSound.play();
            this.wasPreviouslyMoving = true;
        }else if(!(this.snek.isMoving || this.snek.isReversing)){
            this.sounds.hissSound.stop();
            this.wasPreviouslyMoving = false;
        }

        if(!playingFallSound){
            this.sounds.fallingSound.stop();
        }

        for(var i in this.sounds){
            var sound = this.sounds[i];
            sound.update();

        }

    }
    destroy(){
        for(var i in this.sounds){
            var sound = this.sounds[i]
            sound.destroy();
        }
        clearInterval(this.beatInterval);
    }
}

