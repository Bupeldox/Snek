import Vec2 from "../Utilities/vec2.js";
import $ from "jquery";
import { LevelEditorMatterHandler, MatterHandler } from "../MatterHandler.js";
import { ElementFactory } from "./ElementFactory.js";
import MouseDraggingHelper from "../Player/MouseEventHandler.js";
import { Player } from "../Player/Player.js";
import { Colors } from "../Utilities/Colors.js";

export class LevelEditor {
    constructor() {
        this.matterHandler = new LevelEditorMatterHandler();
        this.mouseEventHandler = new MouseDraggingHelper(this.matterHandler.domElement, document);
        this.ElementFactory = new ElementFactory(this.matterHandler);
        this.Prefabs = new Prefabs(this.ElementFactory);
        this.elements = [];
        this.events();
        this.elements.push(...this.Prefabs.walls(this.matterHandler.height,this.matterHandler.width));

        this.player = new EditerPlayerHelper(this.matterHandler);

        var goal = this.addElement("circle");
        goal.options.render.fillStyle = Colors.Collectable;
        goal.reCreateBody();
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
        $("#movePlayerStart").on("click",()=>{
            this.movingPlayerStart = true;
        });
        $("#togglePlay").on("mousedown", () => {
            if(this.player.isPlaying){
                this.player.stopPlaying();
            }else{
                this.player.play();
                this.reCreateLevelAndPlay();
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
        if(!this.movingPlayerStart){
            var element = this.getFirstSelected((i)=>i.selected && i.isMoving);
            if (element) {
                var pos = this.mouseEventHandler.eToVec(e);
                element.move(pos);
            }
        }else{
            var pos = this.mouseEventHandler.eToVec(e);
            this.player.setStartPosition(pos);
        }
    }
    onMouseUp(e) {
        if(this.movingPlayerStart){
            this.movingPlayerStart = false;
        }else if($(e.target).hasClass("copy")){
            var element = this.getFirstSelected();

            this.duplicate(element);
            element.deselect(true);
        }else if($(e.target).hasClass("delete")){
            var element = this.getFirstSelected();

            element.destroy();
            
            var index = this.elements.indexOf(element);
            if (index !== -1) {
                this.elements.splice(index, 1);
            }
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
    addElement(type,push = true) {
        var newelem = this.ElementFactory.createFromShape(type);
        
        if(push){
            this.elements.push(newelem);
        }
        return newelem;
    }
    duplicate(element){
       
        var newElement = this.addElement(element.shape);
        newElement.setFromExportData(element.getExportObject());
        
        element.deselect();
        newElement.select(true);

            
    }

    reCreateLevelAndPlay(){
        $("#jsonOutput").val("");
        var json = this.export();
        this.import(json);

    }

    export() {
        var outputObj = {
            elementData:[],
            snekSettings:{}
        };
        var elementData = [];
        for (let i = 0; i < this.elements.length; i++) {
            const element = this.elements[i];
            elementData.push(element.getExportObject());
        }


        outputObj.snekSettings = this.player.snekSettings;
        outputObj.elementData = elementData;

        var json = JSON.stringify(outputObj);
        $("#jsonOutput").val(json);
        $("#jsonOutput").trigger("input");
        return json;
    }
    import (json) {
        for (let i = 0; i < this.elements.length; i++) {
            const element = this.elements[i];
            element.destroy();
        }
    
        var levelData = JSON.parse(json);
        
        //Snek
        this.player.snekSettings = levelData.snekSettings;
        this.player.reset();

        this.elements=[];
        
        //Elements
        var elemsObj = levelData.elementData;
        for (let i = 0; i < elemsObj.length; i++) {
            const elemData = elemsObj[i];
            var element = this.addElement(elemData.shape);
            element.setFromExportData(elemData);
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

class EditerPlayerHelper{
    constructor(mh){
        this.player = new Player(mh);
        this.tempSnekHolder = this.player.Worm;
        this.snekSettings = {
            startPos:new Vec2(200,500)
        };
        this.isPlaying = false;
    }
    setStartPosition(p){
        this.snekSettings.startPos = p;
        this.player.resetWormPos(p);
    }
    reset(){
        this.player.resetWormPos(this.snekSettings.startPos);
    }
    play(){
        this.player.resetWormPos(this.snekSettings.startPos);
        this.isPlaying = true;
        this.update();
    }
    stopPlaying(){
       
        this.isPlaying = false;
    }
    update() {
        this.player.update();

        if (this.isPlaying) {
            requestAnimationFrame(() => { this.update() });
        }
    }

}