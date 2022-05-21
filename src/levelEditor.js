import Vec2 from "./Utilities/vec2.js";
import $ from "jquery";
import { LevelEditorMatterHandler } from "./MatterHandler.js"
import { ElementFactory } from "./LevelEditor/ElementFactory";
import MouseDraggingHelper from "./Player/MouseEventHandler.js";


class LevelEditor {
    constructor() {
        this.matterHandler = new LevelEditorMatterHandler();
        this.mouseEventHandler = new MouseDraggingHelper(this.matterHandler.domElement, document);
        this.ElementFactory = new ElementFactory(this.matterHandler);
        this.elements = [];
        this.events();
        this.addElement();
        this.elements[0].changeDimentions(100, this.matterHandler.width + 40);
        this.elements[0].move(new Vec2(this.matterHandler.width / 2, this.matterHandler.height));

    }

    events() {
        $("#addElement").on("click", () => {
            this.addElement();
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
        })
    }
    onMove(e) {
        var pos = this.mouseEventHandler.eToVec(e);
        for (let i = 0; i < this.elements.length; i++) {
            const element = this.elements[i];
            if (element.selected && element.isMoving) {
                element.move(pos);
                return;
            }
        }
    }
    onMouseUp(e) {
        var pos = this.mouseEventHandler.eToVec(e);
        for (let i = 0; i < this.elements.length; i++) {
            const element = this.elements[i];
            if (element.selected) {
                element.deselect(true);
                return;
            }
        }
    }
    addElement() {
        this.elements.push(this.ElementFactory.createRect());
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
        }
    }

}



new LevelEditor();