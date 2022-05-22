import { LevelObjects } from "./Levels/LevelObjects";
import { ElementFactory } from "../LevelEditor/ElementFactory.js";
import { Colors } from "../Utilities/Colors";


export class LevelLoader {
    constructor(levelEditorMatterHandler) {
        this.matterHandler = levelEditorMatterHandler;
        this.ElementFactory = new ElementFactory(levelEditorMatterHandler);
    }

    ///returns list of elements, and a list of objectives, and the snek start settings.
    getElements(index) {

        var data = LevelObjects[index];

        var output = {
            levelElements: [],
            goals: [],
            snekSettings: data.snekSettings
        };


        for (let i = 0; i < data.elementData.length; i++) {
            const elemData = data.elementData[i];
            var elem = this.ElementFactory.createFromShape(elemData.shape);
            elem.setFromExportData(elemData);
            if (elemData.options.render.fillStyle == Colors.Collectable) {
                output.goals.push(elem.body);
            } else {
                output.levelElements.push(elem.body);
            }
        }

        this.matterHandler.unloadLevel();

        return output;
    }
}