
import { MatterCollisionHandler } from "../MatterHandler";
import { SoundHelper, ProportionalSoundHelper} from "./SoundHelper.js";
import Vec2 from "../Utilities/vec2";
import { Environment, Snake } from "./SoundSrc.js";

import {Howl, Howler} from 'howler';


var onBeat = ()=>{};
setInterval(()=>{
    onBeat();
},9000);

export class SnekSounds {
    constructor(snek){
        this.sounds = {
           
            hissSound : new Howl({ src:Snake.hiss,loop:true,volume:0.1}),
            fallingSound : new Howl({ src:Environment.falling,loop:false,volume:0.4}),
        }
        this.snek = snek;
        this.snekIds = snek.objects.map(i=>i.id);
        this.collisionDetector = new MatterCollisionHandler();


    }
    update(){

        //sliding sound
        var collisions = this.collisionDetector.getPairs().filter(i=>this.snekIds.includes(i.bodyA.id) ||this.snekIds.includes(i.bodyB.id));
        if(collisions.length == 0){
            //falling
            if(!this.sounds.fallingSound.playing()){
                this.sounds.fallingSound.play();
            }
        }else{
            this.sounds.fallingSound.stop();
        }

        //Hiss Sound
        
        if(!this.wasPreviouslyMoving && (this.snek.isMoving || this.snek.isReversing)){
            this.sounds.hissSound.play();
            this.wasPreviouslyMoving = true;
        }else if(!(this.snek.isMoving || this.snek.isReversing)){
            this.sounds.hissSound.stop();
            this.wasPreviouslyMoving = false;
        }


    }
    destroy(){
        for(var i in this.sounds){
            var sound = this.sounds[i];
            sound.stop();

        }
        clearInterval(this.beatInterval);
    }
}

