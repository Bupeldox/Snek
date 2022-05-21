import $ from "jquery";import { WorldElement } from "../WorldElement.js";


export class RectElem extends WorldElement {
    constructor(matterHandler, isStatic = true) {
        super(matterHandler, isStatic);
        this.shape = "rect";
        this.height = 100;
        this.width = 100;
        $(this.inspectorElement).find("[name='height']").val(this.height);
        $(this.inspectorElement).find("[name='width']").val(this.width);
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
        
        $(this.inspectorElement).find("[name='height']").val(this.height);
        $(this.inspectorElement).find("[name='width']").val(this.width);

        this.reCreateBody();
    }
}