import Vec2 from "./Utilities/vec2.js";
import $ from "jquery";
import LevelEditorMatterHandler from "./LevelEditor/LevelEditorMatterHandler.js"
import { ElementFactory } from "./LevelEditor/Elements/ElementHandler.js";
import MouseDraggingHelper from "./Player/MouseEventHandler.js";

class LevelEditor {
    constructor() {
        this.matterHandler = new LevelEditorMatterHandler();
        this.mouseEventHandler = new MouseDraggingHelper(this.matterHandler.domElement,document);
        this.ElementFactory = new ElementFactory(this.matterHandler);
        this.elements = [];
        this.events();
    }

    events() {
        $("#addElement").on("click", () => { this.addElement(); });
        this.mouseEventHandler.mouseDownHandler.register((e)=>{
            this.onClick(e);
        });
    }

    onClick(e){
        var pos = this.mouseEventHandler.eToVec(e);
        for (let i = 0; i < this.elements.length; i++) {
            const element = this.elements[i];
            if(element.selected){
                element.move(pos);
                element.deselect();
                return;
            }
        }
    }


    addElement() {

        this.elements .push(this.ElementFactory.createRect());

    }

}



new LevelEditor();