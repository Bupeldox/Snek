import { CircleElem } from "./ElementTypes/CircleElem.js";
import { RectElem } from "./ElementTypes/RectElem.js";


export class ElementFactory {
    constructor(matterHandler) {
        this.matterHandler = matterHandler;
    }
    createRect(isStatic) {
        return new RectElem(this.matterHandler, isStatic);
    }
    createCircle(isStatic) {
        return new CircleElem(this.matterHandler, isStatic);
    }
}