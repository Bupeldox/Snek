import $ from "jquery";
import { WorldElement } from "../WorldElement.js";


const shapeName = "rect";
export class RectElem extends WorldElement {
    static shape = shapeName;

    constructor(matterHandler, isStatic = true) {
        super(matterHandler);
        this.shape = shapeName;

        this.height = 100;
        this.width = 100;

        this.updateInspector();
        this.reCreateBody();
    }
    reCreateBody() {
        this.removeBody();
        this.body = this.matterHandler.createRect(
            this.position.x,
            this.position.y,
            this.width,
            this.height,
            this.options,
            this.rotation
        );
    }
    changeDimentions(a, b) {
        this.height = a;
        this.width = b;
        
        $(this.inspectorElement).find("[name='height']").val(this.height);
        $(this.inspectorElement).find("[name='width']").val(this.width);
        this.reCreateBody();
    }
    getExportObject() {
        var obj = super.getExportObject();
        obj.height = this.height;
        obj.width = this.width;
        obj.shape = this.shape;
        return obj;
    }
    setFromExportData(data) {
        super.setFromExportData(data);
        this.height = data.height;
        this.width = data.width;
        
        this.updateInspector();
        this.reCreateBody();
    }
    updateInspector(){
        super.updateInspector();
        $(this.inspectorElement).find("[name='height']").val(this.height);
        $(this.inspectorElement).find("[name='width']").val(this.width);
    }
}