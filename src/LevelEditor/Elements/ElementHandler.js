import Vec2 from "../../Utilities/vec2";
import $ from "jquery";
import { Colors } from "../../Utilities/Colors";
import Color from "color";


var startPos = new Vec2(100,100);

export class ElementFactory {
    constructor(matterHandler){
        this.matterHandler = matterHandler;
    }
    createRect(isStatic){
        return new RectElem(this.matterHandler,isStatic);
    }
    createCircle(isStatic){
        return new CircleElem(this.matterHandler,isStatic);
    }
}


class WorldElement{
    constructor(matterHandler,isStatic){
        this.matterHandler = matterHandler;
        this.body;
        this.position = startPos;
        this.rotation = 0;
        
        this.options = {
            isStatic:isStatic,
           render:{}
        };

        this.inspectorElement = $("#templates").find(".inspectorItemElement").clone();

        $(this.inspectorElement).find("[name='width']").val(this.rotation);
        $(this.inspectorElement).find("[name='isStatic']").val(this.options.isStatic);


        this.updateColors();
     
        $("#inspectorItems").append(this.inspectorElement);
        this.events();
    }
    events(){
        
        $(this.inspectorElement).on("click",".move",()=>{
            this.select();
        });
        $(this.inspectorElement).on("input","[name='height'], [name='width']",()=>{
            this.changeDimentions(+$(this.inspectorElement).find("[name='height']").val(),+$(this.inspectorElement).find("[name='width']").val());
        });
        $(this.inspectorElement).on("input","[name='rotation']",()=>{
            this.rotate(+$(this.inspectorElement).find("[name='rotation']").val());
        });
        $(this.inspectorElement).on("change","[name='isStatic']",()=>{
            this.updateIsStatic(+$(this.inspectorElement).find("[name='isStatic']").is(":checked"));
        });
    }
    move(pos){
        this.position = pos;
        this.matterHandler.move(this.body,pos);
    }
    rotate(angle){
        this.angle = angle;
        this.matterHandler.rotate(this.body,angle);
    }
    updateIsStatic(val){
        this.options.isStatic= val;
        this.matterHandler.updateIsStatic(this.body,val);
        this.updateColors();
    }
    updateColors(){

        if(!this.options.isStatic){
            this.options.render.strokeStyle = Colors.MoveableObsticalsBorder;
            this.options.render.fillStyle = Colors.MoveableObsticals;
        }else{
            this.options.render.strokeStyle = undefined;
            this.options.render.fillStyle = Colors.Obsticals;
        }
    }
    select(){
        this.selected = true;
        this.body.render.fillStyle="#f00";
    }   
    deselect(){
        this.selected = false;
        if(this.options.hasOwnProperty("render") && this.options.render.hasOwnProperty("fillStyle")){
        this.body.render.fillStyle=this.options.render.fillStyle;
        }else{
            this.body.render.fillStyle = undefined;
        }
    }
}

class RectElem extends WorldElement {
    constructor(matterHandler,isStatic = true){
        super(matterHandler,isStatic);
        this.shape = "rect";
        this.height = 100;
        this.width = 100;
        $(this.inspectorElement).find("[name='height']").val(this.height);
        $(this.inspectorElement).find("[name='width']").val(this.width);
        this.reCreateBody();
    }
    reCreateBody(){
        if(this.body){
            this.matterHandler.remove(this.body);
        }
        this.body = this.matterHandler.createRect(
            this.position,
            this.width,
            this.height,
            this.options,
            this.rotation
        );
    }
    changeDimentions(a,b){
        this.height = a;
        this.width = b;
        this.reCreateBody()
    }
}
class CircleElem extends WorldElement {
    constructor(matterHandler,isStatic = true){
        super(matterHandler);
        this.radius = 100;
        this.shape = "circle";
    }
    reCreateBody(){
        this.matterHandler.removeObject(this.body);
        this.body = matterHandler.createCircle(
            this.position,
            this.radius,
            this.options,
            this.rotation
        );
    }
    changeDimentions(a,b){
        this.matterHandler.remove(this.body);
        this.radius = a;

        this.reCreateBody()
    }
}