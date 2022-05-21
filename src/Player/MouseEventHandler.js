import Vec2 from "../Utilities/vec2.js";
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
        this.pos = new Vec2(0, 0);
        this.button = "None";
        this.element = element;

        this.mouseDownHandler = new JQEventHandler(allElement, "mousedown touchstart");
        this.mouseUpHandler = new JQEventHandler(allElement, "mouseup touchend touchcancel");
        this.mouseLeaveHandler = new JQEventHandler(allElement, "mouseleave");
        this.mouseMoveHandler = new JQEventHandler(allElement, "mousemove");
        this.touchMoveHandler = new JQEventHandler(allElement, "touchmove");

        this.spaceDownHandler = new JQEventHandler(allElement, "keydown");
        this.spaceUpHandler = new JQEventHandler(allElement, "keyup");

        this.mouseDownHandler.register((p) => { this.startDrag(p) });
        this.mouseUpHandler.register((p) => { this.stopDrag(p) });
        this.mouseLeaveHandler.register((p) => { this.stopDrag(p) });
        this.mouseMoveHandler.register((p) => { this.move(p) });
        this.touchMoveHandler.register((p) => { this.move(p) });
    }
    startDrag() {
        this.isDragging = true;
    }
    stopDrag() {
        this.isDragging = false;
    }
    move(e) {
        var p;
        if (e.pageX) {
            p = this.eToVec(e);
        } else {
            if (e.changedTouches) {
                p = this.eToVec(e.changedTouches[0]);
            } else {
                return;
            }
        }

        this.pos = p;
    }
    eToVec(e) {

        var x,y;

        var rect = this.element.getBoundingClientRect()

        var oTop = rect.y;
        var oLeft = rect.x;
        
        x = e.pageX - oLeft;
        y = e.pageY - oTop;
        
        y = this.element.height * y / this.element.offsetHeight
        x = this.element.width * x / this.element.offsetWidth

        return new Vec2(x, y);
    }

}


export class ButtonEventHandler {
    constructor(element, key) {
        this.key = key;
        this.keyDownListeners = [];
        this.keyUpListeners = [];
        this.isPressed = false;
        $(element).on("keydown", (e) => { this.onKeyDown(e) });
        $(element).on("keyup", (e) => { this.onKeyUp(e) });
    }
    onKeyDown(e) {
        if (e.key == this.key) {
            this.isPressed = true;
            this.callListeners(this.keyDownListeners, e);
        }
    }
    onKeyUp(e) {
        if (e.key == this.key) {
            this.isPressed = false;
            this.callListeners(this.keyUpListeners, e);
        }
    }
    registerDown(f) {
        this.keyDownListeners.push(f);
    }
    registerUp(f) {
        this.keyUpListeners.push(f);
    }
    callListeners(listneners, e) {
        for (var i = 0; i < listneners.length; i++) {
            var f = listneners[i];
            f(e);
        }
    }

}