
import { MatterCollisionHandler } from "../MatterHandler";
import Vec2 from "../Utilities/vec2";
import { Environment, Snake } from "../world/Sounds.js";

class Sound {
    constructor(src,loop,volume){
        
        this.sound = new Audio(src)
        this.sound.volume = volume;
        if(loop){
            this.sound.addEventListener('timeupdate', function(){
                var buffer = .44
                if(this.currentTime > this.duration - buffer){
                    this.currentTime = 0;
                    if(this.playing){
                        this.play()
                    }
                        
                }
            });
        }
        this.sound.loop = loop;
        this.playing = false;
    }
    play(){
        this.playing = true;
       
        this.sound.play();
    }
    stop(){
        this.playing = false;
        this.sound.pause();
        if(!this.sound.loop){
            this.sound.currentTime =0;
        }
        //console.log("pause "+this.sound.src);
    }
    destroy(){
        this.sound.pause();
    }
  }


export default class SnekSounds {
    constructor(snek){
        this.snek = snek;
        this.snekIds = snek.objects.map(i=>i.id);
        this.collisionDetector = new MatterCollisionHandler();
        this.slitherSound = new Sound(Snake.move,true,0.1);
        this.slitherSound.sound.maxVolume = 0.7;
        this.hissSound = new Sound(Snake.hiss,false,0.05);
        this.fallingSound = new Sound(Environment.falling,false,0.4);
        
        this.blackholeSound = new Sound(Snake.blackHole,false,0.6);
        window.sliterFactor = 5;
    }
    update(){
        var playingFallSound = false;
        //sliding sound
        var collisions = this.collisionDetector.getPairs().filter(i=>this.snekIds.includes(i.bodyA.id) ||this.snekIds.includes(i.bodyB.id));
        var playSliterSound = false;
        if(collisions.length>0){
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
                var vol = Math.min(this.slitherSound.sound.maxVolume* Math.pow(totalForce/window.sliterFactor,2),this.slitherSound.sound.maxVolume);
                this.slitherSound.sound.volume = vol;
            }
        }else{
            //falling
            this.fallingSound.play();
            playingFallSound = true;
        }
        if(playSliterSound){
            if(!this.slitherSound.playing){
                this.slitherSound.play();
            }
        }else{
            this.slitherSound.stop();
        }

        //Hiss Sound
        
        if(!this.wasPreviouslyMoving && (this.snek.isMoving || this.snek.isReversing)){
            //this.hissSound.play();
            this.wasPreviouslyMoving = true;
        }else if(!(this.snek.isMoving || this.snek.isReversing)){
            //this.hissSound.stop();
            this.wasPreviouslyMoving = false;
        }

        if(!playingFallSound){
            this.fallingSound.stop();
        }

        

    }
    onPhysicsBreak(){
        this.blackholeSound.play();
    }
    destroy(){
        this.slitherSound.destroy();
        this.fallingSound.destroy();
        this.hissSound.destroy();
        //Don't destroy blackhole noise
    }
}