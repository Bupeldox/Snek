import Vec2 from "./vec2.js";
import $ from "jquery";

export class MouseEventHandler {
    constructor(element, event) {
        this.listeners = [];
        this.event = event;
        $(element).on(event, (e) => { this.onEvent(e) });
        this.element = $(element);
    }
    register(func) {
        this.listeners.push(func);
    }
    onEvent(e) {
        
        for (var i = 0; i < this.listeners.length; i++) {
            var f = this.listeners[i];
            var p = this.eToVec(e);
            f(p);
        }
    }
    eToVec(e) {
        var oTop = this.element[0].offsetTop;
        var oLeft = this.element[0].offsetLeft;

        var x = e.pageX - oLeft;
        var y = e.pageY - oTop;

        return new Vec2(x, y);
    }
}


export default class MouseDraggingHelper {
    constructor(element, allElement) {
        this.isDragging = false;
        this.pos = new Vec2(0,0);

        this.mouseDownHandler = new MouseEventHandler(element, "mousedown");
        this.mouseUpHandler = new MouseEventHandler(allElement, "mouseup");
        this.mouseLeaveHandler = new MouseEventHandler(element, "mouseleave");
        this.mouseMoveHandler = new MouseEventHandler(element, "mousemove");

        this.mouseDownHandler.register((p)=>{this.startDrag(p)});
        this.mouseUpHandler.register((p)=>{this.stopDrag(p)});
        this.mouseLeaveHandler.register((p)=>{this.stopDrag(p)})
        this.mouseMoveHandler.register((p)=>{this.move(p)});

    }
    startDrag(){
        this.isDragging = true;
    }
    stopDrag(){
        this.isDragging = false; 
    }
    move(p){
        this.pos = p;
    }

}
