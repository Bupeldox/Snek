function setIntervalX(callback, delay, repetitions) {
    var x = 0;
    var intervalID = window.setInterval(function () {

       callback();

       if (++x === repetitions) {
           window.clearInterval(intervalID);
       }
    }, delay);
    return intervalID;
}

function Clamp(min,v,max){
    return Math.min(max,Math.max(min,v));
}


export class ProportionalSoundHelper {
    constructor(src,loop,volume){
        this.maxVolume = volume;
        this.volume = volume;
        this.sound = new Audio(src);
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
        if(this.playing){
            return;
        }
        this.playing = true;
        var index = 0;
        var reps = 200;
        clearInterval(this.stopInterval);
        //console.log("start");
        this.startInterval = setIntervalX(()=>{
            index++;
            var prop = index/reps;
            this.sound.volume = Clamp(0,this.volume * prop * this.maxVolume,this.maxVolume) ;
        },1,reps);
        this.sound.volume = 0;
        this.sound.play();
    }
    stop(){
        clearInterval(this.startInterval);
        if(!this.playing){
            return;
        }

        this.playing = false;

        var index = 0;
        var reps = 20;
        ///console.log("stop");
        this.stopInterval = setIntervalX(()=>{
            index++;
            var prop = index/reps;
            this.sound.volume = this.volume * (1-prop);
            if(prop == 1){
                this.sound.pause();
                if(!this.sound.loop){
                    this.sound.currentTime = 0;
                }
            }
        },1,reps);
    }
    destroy(){
        this.sound.pause();
        clearInterval(this.startInterval);
        clearInterval(this.stopInterval);
    }
    update(){
        this.sound.volume = Clamp(0,this.volume * 1 * this.maxVolume,this.maxVolume);
    }
}



export class SoundHelper {
    constructor(src,loop,volume,interuptable = false){
        this.src = src;
        this.interuptable = interuptable;
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

        this.sound.addEventListener("ended",()=>{
            this.playing = false;
        })
    }
    play(){
        if(this.playing && !this.interuptable){
            return;
        }
        this.playing = true;
        this.currentTime = 0;
        this.sound.play();
       
    }
    stop(){
        this.playing = false;
        this.sound.pause();
        if(!this.sound.loop){
            this.sound.currentTime =0;
        }
    }
    destroy(){
        this.sound.pause();
    }
    update(){

    }
  }


