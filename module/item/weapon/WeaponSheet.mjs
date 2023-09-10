import Templates from "../../Templates.mjs";

export class WeaponSheet extends ItemSheet {

    static get defaultOptions() {
        const defaultOptions = super.defaultOptions;
        return foundry.utils.mergeObject(defaultOptions, {
            template: Templates.itemWeapon,
            classes: [...defaultOptions.classes, "fabula-ultima", "item-weapon"]
        });
    }


    async getData(options = {}) {
        const data = super.getData(options);
        return foundry.utils.mergeObject(data, {
            system: data.item.system,
            enrichedHtml: {description: await TextEditor.enrichHTML(data.item.system.description)}
        });
    }


    activateListeners(html) {
        super.activateListeners(html);
    }
}