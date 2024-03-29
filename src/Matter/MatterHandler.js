import Matter from "matter-js";
import { Colors } from "../Utilities/Colors";
import LevelFactory from "../world/LevelHandler";

import Vec2 from "../Utilities/vec2";

//https://brm.io/matter-js/docs/classes/Constraint.html#methods

export var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite,
    Body = Matter.Body,
    Constraint = Matter.Constraint,
    Events = Matter.Events,
    levelFactory = new LevelFactory(),
    Bounds = Matter.Bounds;

    
const collisionDif = 3;
const newCollideFunc = function(filterA, filterB) {
        
    if(filterA.category == WORM_CATEGORY && filterB.category == WORM_CATEGORY){
        return Math.abs(filterA.segmentIndex-filterB.segmentIndex)>collisionDif;
    }
    if (filterA.group === filterB.group && filterA.group !== 0)
        return filterA.group > 0;
    
    return (filterA.mask & filterB.category) !== 0 && (filterB.mask & filterA.category) !== 0;
};
Matter.Detector.canCollide = newCollideFunc;

// create an engine
export var engine = Engine.create({});

export const height = 800;
export const width = 1000;

// create a renderer
export var render = Render.create({
    element: document.getElementById("canvasTarget") || document.body,
    engine: engine,
    options: {
        height: height,
        width: width,
        wireframes: false,
        background: Colors.Background
    }

});

// run the renderer
Render.run(render);



// create runner
var runner = Runner.create({
    isFixed: true,
    
});


const WORM_CATEGORY = 0b0010;
const DEFAULT_CATEGORY = 0b0001;

class MatterHandlerBase{
    constructor() {
        this.domElement = render.canvas;
        this.height = height;
        this.width = width;
    }
    remove(bod) {
        if (bod) {
            if (bod.myConstraints) {
                for (var i = 0; i < bod.myConstraints.length; i++) {
                    Composite.removeConstraint(engine.world, bod.myConstraints[i]);
                }
            }
            Composite.remove(engine.world, bod, true);
        }
    }
    DoTick(frameTime){
        Runner.tick(runner, engine, frameTime);
    }
}

var snekSegmentIndex = 1;
export class MatterHandler extends MatterHandlerBase {
    constructor(loadNewLevelFunc){
        super();
        if(document.getElementById("fullscreen")){
            document.getElementById("fullscreen").addEventListener("click",()=>{
                render.element.requestFullscreen();
            });
        }
        this.loadNewLevelFunc = loadNewLevelFunc;
    }

    setSnekCollisionStuff(body,isSnek2){
        var enableCoopCollision = document.getElementById("coopCollision")?.checked??false;
        
        if(enableCoopCollision){
            body.collisionFilter.snekNumber = isSnek2?0:1;
        }else{
            body.collisionFilter.snekNumber = 0;
        }

        body.collisionFilter.category = WORM_CATEGORY;
        body.collisionFilter.mask = DEFAULT_CATEGORY;

        snekSegmentIndex++;
        body.collisionFilter.segmentIndex = snekSegmentIndex;
    }

    addSnekSegment(p, width,isSnek2) {
        var n = Bodies.circle(p.x, p.y, width, 20);
        n.mySize = width;
        Composite.add(engine.world, n);
        this.setSnekCollisionStuff(n,isSnek2);
        
        return n;
    }

    addEye(width, head,isSnek2) {
        var p = head.position;
        var n = Bodies.circle(p.x, p.y, width, 20);
        n.mySize = width;

        this.setSnekCollisionStuff(n,isSnek2);
        Composite.add(engine.world, n);

        var c = Constraint.create({
            bodyA: head,
            bodyB: n,
            damping:0.01,
            render: {
                strokeStyle: "#0000"
            }
        })
        Composite.add(engine.world, c);
        return n;
    }

    joinObjects(parent, child) {
        var veca = new Vec2(0, parent.mySize);
        var vecb = new Vec2(0, child.mySize);
        var constriantCount = 3;

        if (parent.myConstraints) {

        } else {
            parent.myConstraints = [];
        }

        for (var i = 0; i < constriantCount; i++) {

            var c = Constraint.create({
                bodyA: parent,
                pointA: Matter.Vector.create(veca.x, veca.y),
                bodyB: child,
                pointB: Matter.Vector.create(vecb.x, vecb.y),
                stiffness: 0.6
            });
            parent.myConstraints.push(c);
            Composite.add(engine.world, c)
            var dangle = 2 * Math.PI / constriantCount;
            veca = veca.rotate(dangle);
            vecb = vecb.rotate(-dangle);
        }
    }
    
    applyForce(bod, from, vec) {
        Body.applyForce(bod, Matter.Vector.create(from.x, from.y), Matter.Vector.create(vec.x, vec.y));
    }

    createJoint(a, b, pa, pb, stiffness) {
        var c = Constraint.create({
            bodyA: a,
            bodyB: b,
            pointA: Matter.Vector.create(pa.x, pa.y),
            pointB: Matter.Vector.create(pb.x, pb.y),
            stiffness: stiffness,
            damping: 0.2
        });

        Composite.add(engine.world, c)
        return c;
    }
    registerAfterDraw(func) {
        var thing = Events.on(render, "afterRender", (a, c, b) => func(render.canvas.getContext("2d"), { a, b, c }));

        return thing;
    }
    unregisterAfterDraw(func) {
        Events.off(render, "afterRender", func);
    }

    LoadLevel(levelNumber) {
        this.unloadLevel();
        // add all of the bodies to the world
        
        var worldHandler = new MatterWorldHandler();
        levelFactory.setToChangeLevel((i) => this.loadNewLevelFunc(i));
        var level = levelFactory.getLevel(levelNumber)(worldHandler, width, height);
        level.createBodies();

        return level;

    }
    unloadLevel() {
        Composite.clear(engine.world);
    }
}


export class MatterWorldHandler extends MatterHandler {
  
    createRect(x, y, width, height, options, rotation = 0) {
        var b = Bodies.rectangle(x, y, width, height, options);
        
        Composite.add(engine.world, b);

        if (rotation != 0) {
            Body.rotate(b, rotation);
        }
        
        return b;
    }
    createCircle(pos, radius, options, rotation = 0) {
        var b = Bodies.circle(pos.x, pos.y, radius, options);

        Composite.add(engine.world, b);
        return b;
    }
    createCollectable(x, y, options) {
        if (!options) {
            options = {};
        }
        options.isStatic = true;
        if(!options.render){
            options.render = {};
        }
        options.render.fillStyle = Colors.Collectable;
        var b = Bodies.circle(x, y, 20, options);

        Composite.add(engine.world, b);
        return b;
    }
    registerPlayerCollisionEvent(bod, callback) {
        Events.on(engine, 'collisionStart', (event) => {

            var rightPairs = event.pairs.filter((e)=>{
                var a = e.bodyA;
                var b = e.bodyB;
                return (a.id == bod.id || b.id == bod.id) && (a.collisionFilter.category == WORM_CATEGORY || b.collisionFilter.category == WORM_CATEGORY);
            });
            
            if(rightPairs.length>0){
                callback();
            }
               
        });
    }
    addBody(bod){
        Composite.add(engine.world, bod);
    }
}


export class LevelEditorMatterHandler extends MatterWorldHandler {
  
    createCircle(pos, radius, options, rotation = 0) {
        var b = Bodies.circle(pos.x, pos.y, radius, options);

        // if (rotation != 0) {
        //     Body.rotate(b, rotation);
        // }

        Composite.add(engine.world, b);
        return b;
    }

    move(body,pos){
        Body.setPosition(body,Matter.Vector.create(pos.x,pos.y));
    }
    rotate(body,angle){
        Body.setAngle(body,angle);
    }

    updateIsStatic(body,val){
        Body.setStatic(body,val);
    }

    registerAfterDraw(func) {
        var thing = Events.on(render, "afterRender", (a, c, b) => func(render.canvas.getContext("2d"), { a, b, c }));

        return thing;
    }

    unregisterAfterDraw(func) {
        Events.off(render, "afterRender", func);
    }

}


