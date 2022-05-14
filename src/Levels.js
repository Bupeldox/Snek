import { Colors } from "./Colors";

export const Levels = [

    (Bodies,width,height)=>{
                
        // create two boxes and a ground
        var bodsToCreate = [];


        var obsticalSize = 90;

        var moveableObsticalProps = { render :{
            fillStyle:Colors.MoveableObsticals,
            strokeStyle:Colors.MoveableObsticalsBorder, 
            lineWidth:1
        } };
        bodsToCreate.push(Bodies.rectangle(400, 200, obsticalSize, obsticalSize,moveableObsticalProps));
        bodsToCreate.push(Bodies.rectangle(450, 50, obsticalSize, obsticalSize,moveableObsticalProps));
        bodsToCreate.push(Bodies.rectangle(500, 300, obsticalSize, obsticalSize,moveableObsticalProps));


        obsticalSize = 80;
        //obsticals
        var obsticalProps = { isStatic: true,render :{fillStyle:Colors.Obsticals} }
        bodsToCreate.push(Bodies.rectangle(450, height-50-40-80, obsticalSize, obsticalSize, obsticalProps));
        bodsToCreate.push(Bodies.rectangle(450+80+60, height-50-40-80, obsticalSize, obsticalSize, obsticalProps));
        bodsToCreate.push(Bodies.rectangle(450-50, height-50-40-80-50-80, obsticalSize, obsticalSize, obsticalProps));
        bodsToCreate.push(Bodies.rectangle(450+80+60-50, height-50-40-80-50-80, obsticalSize, obsticalSize, obsticalProps));
        bodsToCreate.push(Bodies.rectangle(450,       height-50-40-80-50-80-50-80, obsticalSize, obsticalSize, obsticalProps));
        bodsToCreate.push(Bodies.rectangle(450+80+60, height-50-40-80-50-80-50-80, obsticalSize, obsticalSize, obsticalProps));


        //walls
        bodsToCreate.push(Bodies.rectangle(width/2, height, width, 100, obsticalProps));
        bodsToCreate.push(Bodies.rectangle(width/2, 0, width, 100, obsticalProps));
        bodsToCreate.push(Bodies.rectangle(0, height/2, 100, height, obsticalProps));
        bodsToCreate.push(Bodies.rectangle(width, height/2, 100, height, obsticalProps));

        return bodsToCreate;
    }
];