import { WorldElement } from "../WorldElement.js";


export class CircleElem extends WorldElement {
    constructor(matterHandler, isStatic = true) {
        super(matterHandler);
        this.radius = 100;
        
        $(this.inspectorElement).find("[name='height']").val(this.height);
        $(this.inspectorElement).find("[name='width']").val(-1);
        this.shape = "circle";
        this.reCreateBody();
    }
    reCreateBody() {
        this.removeBody();
        this.body = matterHandler.createCircle(
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
    setFromExportData(data) {
        super.setFromExportData(data);
        this.radius = data.radius;
        
        $(this.inspectorElement).find("[name='height']").val(this.radius);
        this.reCreateBody();
    }
}