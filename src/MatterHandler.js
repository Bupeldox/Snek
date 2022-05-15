import Matter from "matter-js";
import { Colors } from "./Utilities/Colors";
import LevelFactory from "./world/LevelHandler";

import Vec2 from "./Utilities/vec2";


export var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite,
    Body = Matter.Body,
    Constraint = Matter.Constraint,
    Events = Matter.Events,
    levelFactory = new LevelFactory()



// create an engine
var engine = Engine.create({});

const height = 800;
const width = 1000;

// create a renderer
var render = Render.create({
    element: document.body,
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

// run the engine
Runner.run(runner, engine);



const WORM_CATEGORY = 0b0010;
const DEFAULT_CATEGORY = 0b0001;

export default class MatterHandler {
    constructor() {
        this.domElement = render.canvas;

    }

    playFor(time, onComplete) {

    }
    addSnekSegment(p, width) {
        var n = Bodies.circle(p.x, p.y, width, 20);
        n.mySize = width;
        Composite.add(engine.world, n);
        n.collisionFilter.category = WORM_CATEGORY;
        n.collisionFilter.mask = DEFAULT_CATEGORY;
        return n;
    }
    addBox(p) {
        var n = Bodies.circle(p.x, p.y, 80, 80);

        Composite.add(engine.world, n);
        return n;
    }
    addEye(width, head) {
        var p = head.position;
        var n = Bodies.circle(p.x, p.y, width, 20);
        n.mySize = width;
        n.collisionFilter.category = WORM_CATEGORY;
        n.collisionFilter.mask = DEFAULT_CATEGORY;
        Composite.add(engine.world, n);
        //Body.setParts(head,[n],true);

        var c = Constraint.create({
            bodyA: head,
            bodyB: n,
            //length:0,
            render: {
                strokeStyle: "#0000"
            }
        })
        Composite.add(engine.world, c);
        return n;
    }
    addCollectable(p, options) {
        var n = Bodies.circle(p.x, p.y, 20, options, 10);

        Composite.add(engine.world, n);
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
    removeObject(bod) {
        if (bod) {

            if (bod.myConstraints) {
                for (var i = 0; i < bod.myConstraints.length; i++) {
                    Composite.removeConstraint(engine.world, bod.myConstraints[i]);
                }
            }
            Composite.remove(engine.world, bod, true);
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
        var level = levelFactory.getLevel(levelNumber)(worldHandler, width, height, (i) => this.LoadLevel(i));
        level.createBodies();

        return level;

    }
    unloadLevel() {
        Composite.clear(engine.world);
    }
}


export class MatterWorldHandler {
    constructor() {
        this.domElement = render.canvas;
    }
    createRect(x, y, width, height, options, rotation = 0) {
        var b = Bodies.rectangle(x, y, width, height, options);

        if (rotation != 0) {
            Body.rotate(b, rotation);
        }

        Composite.add(engine.world, b);
        return b;
    }
    createCollectable(x, y, r, options) {
        if (!options) {
            options = {};
        }
        options.isStatic = true;
        if(!options.render){
            options.render = {};
        }
        options.render.fillStyle = Colors.Collectable;
        var b = Bodies.circle(x, y, r, options);

        Composite.add(engine.world, b);
        return b;
    }
    registerPlayerCollisionEvent(bod, callback) {
        Events.on(engine, 'collisionStart', (event) => {

            var rightPairs = event.pairs.filter((e)=>
                {
                    var a = e.bodyA;
                    var b = e.bodyB;
                    return (a.id == bod.id || b.id == bod.id) && (a.collisionFilter.category == WORM_CATEGORY || b.collisionFilter.category == WORM_CATEGORY);
                }
            );
            if(rightPairs.length>0){
                callback();
            }
               
        });
    }
    removeObj(bod){
        Composite.remove(engine.world, bod, true);
    }
}