import { Colors } from "./Colors";
import Vec2 from "./vec2";

function pSin(x) {
    return (Math.sin(x) / 2) + 0.5;
}
function rotater(x) {
    return new Vec2(Math.sin(x), Math.cos(x));
}
function lerp(a, b, proportion) {
    var delta = b-a;
    delta *= proportion;
    return a + delta;
}
export default class SnekTongue {

    constructor(matterHandler, headRadius) {
        this.MatterHandler = matterHandler;
        matterHandler.registerAfterDraw((a, b) => { this.draw(a, b) });
        this.showing = false;
        this.angle = 0;
        this.pos = new Vec2(0, 0);
        this.headRadius = headRadius;
        this.showing = false;
        this.extension = 0;
        this.extensionSpeed = 0.1;
    }

    calculateTonguePath() {
        var tongueBaseAngle = 0.5;
        var tongueEndAngle = 2.4;
        var tongueLength = 0.8 * this.extension + (pSin((Date.now() / 1000) * 20) * 0.2);
        this.tongueDist = 0.8;
        var tongueWidth = 0.2;

        tongueLength *= this.headRadius;
        this.tongueDist *= this.headRadius;
        tongueWidth *= this.headRadius;

        //
        /*  _________
         . /     .-*`
           \_____`*-.
        */


        var halfTongueWidth = tongueWidth / 2;
        var r = rotater(Date.now() / 1000 * 20).times(2);

        var a = new Vec2(0, halfTongueWidth);
        var b = new Vec2(0 + tongueLength, halfTongueWidth);
        var c = new Vec2(b.x - Math.tan(tongueEndAngle / 2) * halfTongueWidth, 0);
        var d = b.clone(); d.y = d.y * -1;
        var e = a.clone(); e.y = e.y * -1;
        var f = new Vec2(0 - Math.tan(tongueBaseAngle / 2) * halfTongueWidth, 0);

        b = b.add(r);
        d = d.add(r);

        a.rotatePer = 0;
        b.rotatePer = 1;
        c.rotatePer = 1;
        d.rotatePer = 1;
        e.rotatePer = 0;
        f.rotatePer = 0;

        return [a, b, c, d,  e, f];

    }

    draw(ctx, e) {

        if (this.extension <= 0 && !this.showing) {
            this.extension = 0;
            return;

        }
        console.log(this.extension);
        if (!this.showing) {
            this.extension -= this.extensionSpeed;
        } else {
            if (this.extension < 1) {
                this.extension += this.extensionSpeed;
            } else {
                this.extension = 1;
            }
        }

        var tonguePath = this.calculateTonguePath();

        var rota = (i, angle) => {
            return i.rotate(angle-(Math.PI / 2)  ).add(new Vec2(this.pos).add(new Vec2(0,this.tongueDist).rotate(this.baseAngle)))
        };

        tonguePath = tonguePath.map(i => {
            return rota(i,
                lerp(this.baseAngle, this.angle, i.rotatePer)
            )
        });

        ctx.beginPath();
        ctx.fillStyle = Colors.SnekTongue;
        ctx.moveTo(tonguePath[0].x, tonguePath[0].y)
        for (let i = 1; i < tonguePath.length; i++) {
            const p = tonguePath[i];
            ctx.lineTo(p.x, p.y);
        }
        ctx.closePath();
        ctx.fill();
    }

    updatePos(pos) { this.pos = new Vec2(pos); }
    updateAngle(angle, baseAngle) {
        this.angle = angle;
        this.baseAngle = baseAngle;
    }
    show() { this.showing = true; }
    hide() { 
        this.showing = false; 
    }

    destroy() {
        this.MatterHandler.unregisterAfterDraw(this.draw);
        this.showing = false;
    }
}