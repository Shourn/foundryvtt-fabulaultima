import Templates from "../../Templates.mjs";

export class AttackSheet extends ItemSheet {

    static get defaultOptions() {
        const defaultOptions = super.defaultOptions;
        return foundry.utils.mergeObject(defaultOptions, {
            template: Templates.itemAttack,
            classes: [...defaultOptions.classes, "fabula-ultima", "item-attack"]
        });
    }


    getData(options = {}) {
        const data = super.getData(options);
        return foundry.utils.mergeObject(data, {system: data.item.system});
    }


    activateListeners(html) {
        super.activateListeners(html);
    }
}