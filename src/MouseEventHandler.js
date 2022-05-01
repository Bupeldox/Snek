import Vec2 from "./vec2.js";
import $ from "jquery";

export class JQEventHandler {
    constructor(element, event) {
        this.listeners = [];
        $(element).on(event, (e) => { this.onEvent(e) });

    }
    register(func) {
        this.listeners.push(func);
    }
    onEvent(e) {
        
        for (var i = 0; i < this.listeners.length; i++) {
            var f = this.listeners[i];
            f(e);
        }
    }
  
}


export default class MouseDraggingHelper {
    constructor(element, allElement) {
        this.isDragging = false;
        this.pos = new Vec2(0,0);
        this.element = element;

        this.mouseDownHandler = new JQEventHandler(allElement, "mousedown touchstart");
        this.mouseUpHandler = new JQEventHandler(allElement, "mouseup touchend touchcancel");
        this.mouseLeaveHandler = new JQEventHandler(allElement, "mouseleave");
        this.mouseMoveHandler = new JQEventHandler(allElement, "mousemove");
        this.touchMoveHandler = new JQEventHandler(allElement,"touchmove");
        this.spaceDownHandler = new JQEventHandler(allElement,"keydown");
        this.spaceUpHandler = new JQEventHandler(allElement,"keyup");

        this.mouseDownHandler.register((p)=>{this.startDrag(p)});
        this.mouseUpHandler.register((p)=>{this.stopDrag(p)});
        this.mouseLeaveHandler.register((p)=>{this.stopDrag(p)})
        this.mouseMoveHandler.register((p)=>{this.move(p)});
        this.touchMoveHandler.register((p)=>{this.move(p)});
        this.spaceDownHandler.register((e)=>{if(e.which == 32){this.startDrag()}})
        this.spaceUpHandler.register((e)=>{if(e.which == 32){this.stopDrag()}})

    }
    startDrag(){
        this.isDragging = true;
    }
    stopDrag(){
        this.isDragging = false; 
    }
    move(e){
        var p;
        if(e.pageX){
            p = this.eToVec(e);
        }else{
            p = this.eToVec(e.changedTouches[0]);
        }
        
        this.pos = p;
    }
    eToVec(e) {
        var oTop = this.element.offsetTop;
        var oLeft = this.element.offsetLeft;

        var x = e.pageX - oLeft;
        var y = e.pageY - oTop;

        y=this.element.height * y/this.element.offsetHeight
        x=this.element.width * x/this.element.offsetWidth

        return new Vec2(x, y);
    }

}
