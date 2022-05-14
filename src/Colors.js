import Colorjs from "color";

export const Colors = {
    SnekA : "#665337",
    SnekB : "#766040",
    Background : "#697740",
    Obsticals : "#5A6637",
    MoveableObsticals:"#774044",
    MoveableObsticalsBorder:"#5E3235",
    Collectable:"#fb1",
    
    SnekEye:"#000",
    SnekTongue:"#f06",
    SnekGradient: (p)=>{
        var base = "hsl(36, 30%, #LIGHTNESS#%)"
        var min = 31;
        var max = 36;
        var delta = max-min;
        var l = (p*delta)+min;
        var color = base.replace("#LIGHTNESS#",l);
        return Colorjs(color).hex();
    },

    updateAColor:function(which,color){
        this[which] = color;
    }
};
