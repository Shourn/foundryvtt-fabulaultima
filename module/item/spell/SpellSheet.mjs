import Templates from "../../Templates.mjs";


/**
 * @extends {ItemSheet}
 */
export class SpellSheet extends ItemSheet {

    static get defaultOptions() {
        const defaultOptions = super.defaultOptions;
        return foundry.utils.mergeObject(defaultOptions, {
            classes: [...defaultOptions.classes, "fabula-ultima", "item-spell"]
        });
    }

    get template() {
        return Templates.itemSpell;
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