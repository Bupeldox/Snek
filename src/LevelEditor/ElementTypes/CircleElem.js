import { WorldElement } from "../WorldElement.js";
import $ from "jquery";

const shapeName = "circle";

export class CircleElem extends WorldElement {
    static shape = shapeName;
    constructor(matterHandler) {
        super(matterHandler);
        this.radius = 20;
        this.shape = shapeName;

        this.updateInspector();
        this.reCreateBody();
    }
    reCreateBody() {
        this.removeBody();
        this.body = this.matterHandler.createCircle(
            this.position,
            this.radius,
            this.options,
            this.rotation
        );
    }
    changeDimentions(a, b) {
        this.matterHandler.remove(this.body);
        this.radius = a;

        this.reCreateBody();
    }
    rotate(){
        //does nothing, its a circle
    }
    getExportObject() {
        var obj = super.getExportObject();
        obj.radius = this.radius;
        obj.shape = this.shape;
        return obj;
    }
    setFromExportData(data) {
        super.setFromExportData(data);
        this.radius = data.radius;
        
        this.updateInspector();
        this.reCreateBody();
    }
    updateInspector(){
        super.updateInspector();
        $(this.inspectorElement).find("[name='height']").val(this.radius);
        $(this.inspectorElement).find("[name='height']").attr("step",20);
        $(this.inspectorElement).find("[name='width']").remove();
        $(this.inspectorElement).find("[name='rotation']").remove();
    }
}