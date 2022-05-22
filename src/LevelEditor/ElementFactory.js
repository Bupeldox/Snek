import { CircleElem } from "./ElementTypes/CircleElem.js";
import { RectElem } from "./ElementTypes/RectElem.js";


export class ElementFactory {
    constructor(matterHandler) {
        this.matterHandler = matterHandler;
    }
    createFromShape(shape){
        if(shape == RectElem.shape){
            return this.createRect();
        }else if(shape == CircleElem.shape){
            return this.createCircle();
        }
    }
    createRect() {
        return new RectElem(this.matterHandler);
    }
    createCircle() {
        return new CircleElem(this.matterHandler);
    }
}