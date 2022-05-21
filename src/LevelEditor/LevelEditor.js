import Vec2 from "../Utilities/vec2.js";
import $ from "jquery";
import { LevelEditorMatterHandler } from "../MatterHandler.js";
import { ElementFactory } from "./ElementFactory.js";
import MouseDraggingHelper from "../Player/MouseEventHandler.js";

export class LevelEditor {
    constructor() {
        this.matterHandler = new LevelEditorMatterHandler();
        this.mouseEventHandler = new MouseDraggingHelper(this.matterHandler.domElement, document);
        this.ElementFactory = new ElementFactory(this.matterHandler);
        this.Prefabs = new Prefabs(this.ElementFactory);
        this.elements = [];
        this.events();
        this.elements.push(...this.Prefabs.walls(this.matterHandler.height,this.matterHandler.width));

    }

    events() {
        $(".addElement").on("click", (e) => {
            var type = e.target.dataset.shape;
            this.addElement(type);
        });
      
        this.mouseEventHandler.mouseMoveHandler.register((e) => {
            this.onMove(e);
        });
        this.mouseEventHandler.mouseUpHandler.register((e) => {
            this.onMouseUp(e);
        });
        $("#exportButton").on("click", () => {
            if ($("#jsonOutput").val() != "") {
                this.import($("#jsonOutput").val());
            } else {
                this.export();
            }
        });
        $("#jsonOutput").on("input", (e) => {
            if ($("#jsonOutput").val() != "") {
                $("#exportButton").text("Import");
            } else {
                $("#exportButton").text("Export");
            }
        });
    }
    getFirstSelected(com){
        if(!com){
            com = (i)=>{return i.selected};
        }
        for (let i = 0; i < this.elements.length; i++) {
            const element = this.elements[i];
            if (com(element)) {
                return element;
            }
        }
        return false;
    }
    onMove(e) {
        var pos = this.mouseEventHandler.eToVec(e);
        var element = this.getFirstSelected((i)=>i.selected && i.isMoving);
        if (element) {
            element.move(pos);
        }
        
    }
    onMouseUp(e) {
        if($(e.target).hasClass("copy")){
            var element = this.getFirstSelected();

            this.duplicate(element);
            element.deselect(true);
        }else{
            var element = this.getFirstSelected((i=>i.selected && i.isMoving));
            if(element){
                var pos = this.mouseEventHandler.eToVec(e);
                element.move(pos);
                element.deselect(true);
            }
        }   
        
    }
    addElement(type) {
        var newelem;
        if(type == "rect"){
            newelem = this.ElementFactory.createRect();
        }else if(type=="circle"){
            newelem = this.ElementFactory.createCircle();
        }
        this.elements.push(newelem);
        return newelem;
    }
    duplicate(element){
       
        var newElement = this.addElement(element.shape);
        newElement.setFromExportData(element.getExportObject());
        this.elements.push(newElement);
        element.deselect();
        newElement.select(true);
            
    }
    export () {
        var outputObj = [];
        for (let i = 0; i < this.elements.length; i++) {
            const element = this.elements[i];
            outputObj.push(element.getExportObject());
        }
        $("#jsonOutput").val(JSON.stringify(outputObj));
        $("#jsonOutput").trigger("input");
    }
    import (json) {
        for (let i = 0; i < this.elements.length; i++) {
            const element = this.elements[i];
            element.destroy();
        }


        var elemsObj = JSON.parse(json);
        for (let i = 0; i < elemsObj.length; i++) {
            const elemData = elemsObj[i];
            var element;
            if (elemData.shape == "rect") {
                element = this.ElementFactory.createRect(elemData.isStatic);
            } else {
                element = this.ElementFactory.createCircle(elemData.isStatic);
            }
            element.setFromExportData(elemData);
            this.elements.push(element);
        }
    }
}


class Prefabs{
    constructor(elementFactory){
        this.elementFactory = elementFactory;
    }
    walls(height,width){

        var output = [];

        var floor = this.elementFactory.createRect();
        floor.changeDimentions(100, width + 40);
        floor.move(new Vec2(width / 2, height));

        var wallLeft = this.elementFactory.createRect();
        wallLeft.changeDimentions(height + 40,100);
        wallLeft.move(new Vec2(0,height / 2));

        var wallRight = this.elementFactory.createRect();
        wallRight.changeDimentions(height + 40,100);
        wallRight.move(new Vec2(width,height / 2));

        var ceil = this.elementFactory.createRect();
        ceil.changeDimentions(100, width + 40);
        ceil.move(new Vec2(width / 2, 0));
        
        

        output.push(floor,wallLeft,wallRight,ceil);
        return output;
    }
}