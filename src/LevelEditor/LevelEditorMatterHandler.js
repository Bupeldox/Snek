
// import Matter from "matter-js";
// import { Colors } from "../Utilities/Colors.js";


// export var Engine = Matter.Engine,
// Render = Matter.Render,
// Runner = Matter.Runner,
// Bodies = Matter.Bodies,
// Composite = Matter.Composite,
// Body = Matter.Body,
// Constraint = Matter.Constraint,
// Events = Matter.Events;



// // create an engine
// var engine = Engine.create({});

// const height = 800;
// const width = 1000;

// // create a renderer
// var render = Render.create({
// element: document.getElementById("canvasTarget") || document.body,
// engine: engine,
// options: {
//     height: height,
//     width: width,
//     wireframes: false,
//     background: Colors.Background
// }

// });



// // run the renderer
// Render.run(render);

// // create runner
// var runner = Runner.create({
// //isFixed: true,
// });
// runner.minDelta = 1;
// runner.maxDelta = 100;

// // run the engine
// Runner.run(runner, engine);





// export default class LevelEditorMatterHandler {
//     constructor() {
//         this.domElement = render.canvas;
//         this.height = height;
//         this.width = width;
//     }

//     createRect(pos, width, height, options, rotation = 0) {
//         var b = Bodies.rectangle(pos.x, pos.y, width, height, options);

//         if (rotation != 0) {
//             Body.rotate(b, rotation);
//         }

//         Composite.add(engine.world, b);
//         return b;
//     }
//     createCircle(pos, radius, options, rotation = 0) {
//         var b = Bodies.circle(pos.x, pos.y, radius, options);

//         if (rotation != 0) {
//             Body.rotate(b, rotation);
//         }

//         Composite.add(engine.world, b);
//         return b;
//     }

//     remove(bod) {
//         if (bod) {

//             if (bod.myConstraints) {
//                 for (var i = 0; i < bod.myConstraints.length; i++) {
//                     Composite.removeConstraint(engine.world, bod.myConstraints[i]);
//                 }
//             }
//             Composite.remove(engine.world, bod, true);
//         }
//     }

//     move(body,pos){
//         Body.setPosition(body,Matter.Vector.create(pos.x,pos.y));
//     }
    
//     rotate(body,angle){
//         Body.setAngle(body,angle);
//     }
//     updateIsStatic(body,val){
//         Body.setStatic(body,val);
//     }
//     registerAfterDraw(func) {
//         var thing = Events.on(render, "afterRender", (a, c, b) => func(render.canvas.getContext("2d"), { a, b, c }));

//         return thing;
//     }

//     unregisterAfterDraw(func) {
//         Events.off(render, "afterRender", func);
//     }

// }


