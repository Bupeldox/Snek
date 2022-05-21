import { WorldElement } from "../WorldElement.js";
import $ from "jquery";


export class CircleElem extends WorldElement {
    constructor(matterHandler, isStatic = true) {
        super(matterHandler,isStatic);
        this.radius = 20;
        this.shape = "circle";
        
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
    getExportObject() {
        var obj = super.getExportObject();
        obj.radius = this.radius;
        obj.shape = this.shape;
        return obj;
    }
    rotate(){
        //does nothing, its a circle
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