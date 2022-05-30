import Colorjs from "colorjs.io";


var rgbToHex = function (r, g, b) {
    var toHex = function (rgb) {
        var hex = Number(rgb).toString(16);
        if (hex.length < 2) {
            hex = "0" + hex;
        }
        return hex;
    };
    var red = toHex(r * 255);
    var green = toHex(g * 255);
    var blue = toHex(b * 255);
    return "#" + red + green + blue;
};


export const Colors = {
    SnekA: "#665337",
    SnekB: "#766040",
    Background: "#697740",
    Obsticals: "#5A6637",
    MoveableObsticals: "#774044",
    MoveableObsticalsBorder: "#5E3235",
    Collectable: "#fb1",

    SnekEye: "#000",
    SnekTongue: "#f06",
    SnekGradient: (p) => {
        var base = "hsl(36, 30%, #LIGHTNESS#%)"
        var min = 31;
        var max = 36;
        var delta = max - min;
        var l = (p * delta) + min;
        var color = base.replace("#LIGHTNESS#", l);
        return new Colorjs(color).toString();
    },
    SnekGradientB: (p) => {
        let cola = new Colorjs("#5F3766");
        var gradient = cola.range("#EEFB5F", {
            space: "lch",
            outputSpace: "srgb",
        });

        var color = gradient(p);
        return new Colorjs(color).toString();
    },
    updateAColor: function (which, color) {
        this[which] = color;
    }
};
