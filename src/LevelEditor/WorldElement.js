
import $ from "jquery";
import { Colors } from "../Utilities/Colors.js";
import Vec2 from "../Utilities/vec2.js";


export var startPos = new Vec2(100, 100);

export class WorldElement {
    constructor(matterHandler, isStatic) {
        this.matterHandler = matterHandler;
        this.body;
        this.position = startPos;
        this.rotation = 0;
        this.isMoving = false;
        this.selected = false;
        this.options = {
            isStatic: isStatic,
            render: {}
        };

        this.inspectorElement = $("#templates").find(".inspectorItem.Element").clone();


        this.updateColors();

        $("#inspectorItems").append(this.inspectorElement);
        this.events();
    }

    events() {

        $(this.inspectorElement).on("click", ".move", () => {
            this.select(true);
        });
        $(this.inspectorElement).on("mouseenter", () => {
            this.select();
        });
        $(this.inspectorElement).on("mouseleave", () => {
            if (!this.isMoving) {
                this.deselect();
            }
        });
        $(this.inspectorElement).on("input", "[name='height'], [name='width']", () => {
            this.changeDimentions(+$(this.inspectorElement).find("[name='height']").val(), +$(this.inspectorElement).find("[name='width']").val());
        });
        $(this.inspectorElement).on("input", "[name='rotation']", () => {
            this.rotate(+$(this.inspectorElement).find("[name='rotation']").val());
        });
        $(this.inspectorElement).on("change", "[name='isStatic']", () => {
            this.updateIsStatic(+$(this.inspectorElement).find("[name='isStatic']").is(":checked"));
        });
    }
    move(pos) {
        this.position = pos;
        
        if(!this.options.isStatic){
            this.reCreateBody();
        }else{
            this.matterHandler.move(this.body, pos);
        }
    }
    rotate(angle) {
        this.rotation = angle;
        if(!this.options.isStatic){
            this.reCreateBody();
        }else{
            this.matterHandler.rotate(this.body, angle);
        }
    }
    updateIsStatic(val) {
        this.options.isStatic = val;
        this.matterHandler.updateIsStatic(this.body, val);
        this.updateColors();
        this.reCreateBody();
    }
    updateColors() {

        if (this.options.isStatic) {
            this.options.render.strokeStyle = undefined;
            this.options.render.fillStyle = Colors.Obsticals;
        } else {
            this.options.render.strokeStyle = Colors.MoveableObsticalsBorder;
            this.options.render.fillStyle = Colors.MoveableObsticals;
        }
    }
    select(startMoving) {
        this.selected = true;
        if (startMoving) {
            this.isMoving = true;
        }
        this.body.render.fillStyle = "#f00";
    }
    deselect(cancelMove) {
        this.selected = false;
        if (cancelMove) {
            this.isMoving = false;
        }
        this.body.render.fillStyle = this.options?.render?.fillStyle;
        
    }
    getExportObject() {
        return {
            pos: {
                x: this.position.x,
                y: this.position.y
            },
            rotation: this.rotation,
            isStatic: this.isStatic,
            options: this.options
        };
    }
    setFromExportData(data) {
        this.position = new Vec2(data.pos.x, data.pos.y);
        this.rotation = data.rotation;
        this.options = data.options;
    }
    removeBody() {
        if (this.body) {
            this.matterHandler.remove(this.body);
        }
    }
    destroy() {
        $(this.inspectorElement).remove();
        this.removeBody();
    }

    updateInspector(){
        $(this.inspectorElement).find("[name='rotation']").val(this.rotation);
        $(this.inspectorElement).find("[name='isStatic']").prop('checked', this.options.isStatic);
    }
}