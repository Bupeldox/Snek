import Matter from "matter-js";
import Vec2 from "./vec2";

var Engine = Matter.Engine,
Render = Matter.Render,
Runner = Matter.Runner,
Bodies = Matter.Bodies,
Composite = Matter.Composite,
Body = Matter.Body,
Constraint = Matter.Constraint;

// create an engine
var engine = Engine.create({ });

const height = 800;
const width = 1000;

// create a renderer
var render = Render.create({
    element: document.body,
    engine: engine,
    options:{
        height: height,
        width: width
    }
});

// create two boxes and a ground
var bodsToCreate = [];

bodsToCreate.push(Bodies.rectangle(400, 200, 80, 80));
bodsToCreate.push(Bodies.rectangle(450, 50, 80, 80));


//obsticals
bodsToCreate.push(Bodies.rectangle(450, height-50-40-80, 80, 80, { isStatic: true }));
bodsToCreate.push(Bodies.rectangle(450+80+60, height-50-40-80, 80, 80, { isStatic: true }));
bodsToCreate.push(Bodies.rectangle(450-50, height-50-40-80-50-80, 80, 80, { isStatic: true }));
bodsToCreate.push(Bodies.rectangle(450+80+60-50, height-50-40-80-50-80, 80, 80, { isStatic: true }));
bodsToCreate.push(Bodies.rectangle(450,       height-50-40-80-50-80-50-80, 80, 80, { isStatic: true }));
bodsToCreate.push(Bodies.rectangle(450+80+60, height-50-40-80-50-80-50-80, 80, 80, { isStatic: true }));


//walls
bodsToCreate.push(Bodies.rectangle(width/2, height, width, 100, { isStatic: true }));
bodsToCreate.push(Bodies.rectangle(width/2, 0, width, 100, { isStatic: true }));
bodsToCreate.push(Bodies.rectangle(0, height/2, 100, height, { isStatic: true }));
bodsToCreate.push(Bodies.rectangle(width, height/2, 100, height, { isStatic: true }));

// add all of the bodies to the world
Composite.add(engine.world, bodsToCreate);

// run the renderer
Render.run(render);

// create runner
var runner = Runner.create();

// run the engine
Runner.run(runner, engine);



export default class MatterHandler{
    constructor(){
        this.domElement = render.canvas;

    }

    playFor(time, onComplete){
        
    }
    addObject(p,width){
        var n = Bodies.circle(p.x, p.y, width, 20);
        n.mySize = width;
        Composite.add(engine.world,n);
        return n;
    }
    addBox(p){
        var n = Bodies.circle(p.x, p.y, 80, 80);
       
        Composite.add(engine.world,n);
        return n;
    }
    joinObjects(parent,child){
        
        var veca = new Vec2(0,parent.mySize);
        var vecb = new Vec2(0,child.mySize);
        var constriantCount = 3;
        
        console.log(veca);

        if(parent.myConstraints){
            
        }else{
            parent.myConstraints = [];
        }

        console.log(veca);

        for(var i=0;i<constriantCount;i++){

            var c = Constraint.create({
                bodyA:parent,
                pointA:Matter.Vector.create(veca.x,veca.y),
                bodyB:child,
                pointB:Matter.Vector.create(vecb.x,vecb.y),
                stiffness:0.6
            });
            parent.myConstraints.push(c);
            Composite.add(engine.world, c)
            var dangle = 2*Math.PI/constriantCount;
            veca = veca.rotate(dangle);
            vecb = vecb.rotate(-dangle);
        }
       
    }
    removeObject(bod){
        if(bod.myConstraints){
            for(var i=0;i<bod.myConstraints.length;i++){
                Composite.removeConstraint(engine.world,bod.myConstraints[i]);
            }
        }
        Composite.remove(engine.world, bod,true);
    }
    applyForce(bod,from,vec){
        Body.applyForce(bod,Matter.Vector.create(from.x,from.y),Matter.Vector.create(vec.x,vec.y));
    }

    createJoint(a,b,pa,pb,stiffness){
        var c = Constraint.create({
            bodyA:a,
            bodyB:b,
            pointA:Matter.Vector.create(pa.x,pa.y),
            pointB:Matter.Vector.create(pb.x,pb.y),
            stiffness:stiffness,
            damping:0.2
        });
        
        Composite.add(engine.world, c)
        return c;
    }
}



class WorldHandler{
    constructor(){

    }
}

