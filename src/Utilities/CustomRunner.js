export class CustomRunner {
    constructor() {
        this.running = false;
        this.fps = 60;

    }
    start() {
        this.running = true;
        this.step();
    }
    stop() {
        this.running = false;
    }
    registerOnUpdate(func) {
        this.onUpdate = func;
    }
    getFrameTime() {
        return 1000 / this.fps;
    }
    step() {

        var frameTime = this.getFrameTime();
        this.onUpdate(frameTime);

        if (this.running) {
            setTimeout(() => {
                this.step();
            }, frameTime);
        }
    }
}