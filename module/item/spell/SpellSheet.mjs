import Templates from "../../Templates.mjs";


export class SpellSheet extends ItemSheet {

    static get defaultOptions() {
        const defaultOptions = super.defaultOptions;
        return foundry.utils.mergeObject(defaultOptions, {
            template: Templates.itemSpell,
            classes: [...defaultOptions.classes, "fabula-ultima", "item-spell"]
        });
    }

    getData(options = {}) {
        const data = super.getData(options);
        return foundry.utils.mergeObject(data, {
            system: data.item.system,
            enrichedHtml: {
                description: TextEditor.enrichHTML(data.item.system.description)
            }
        });
    }

    activateListeners(html) {
        super.activateListeners(html);
    }
}