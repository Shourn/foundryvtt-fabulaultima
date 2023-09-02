import Templates from "../../Templates.mjs";
import {toObject} from "../../utils/helper.mjs";
import {
    attackTypes,
    attributes,
    damageTypes,
    defenses,
    rollTypes,
    statusChoices,
    statusEffects
} from "../../Constants.mjs";

const constants = {
    attackTypes: toObject(attackTypes, value => `FABULA_ULTIMA.attackType.${value}`),
    attributes: toObject(attributes, value => ({
        short: `FABULA_ULTIMA.attribute.${value}.short`,
        full: `FABULA_ULTIMA.attribute.${value}.full`,
    })),
    rollTypes: toObject(rollTypes, value => ({
        short: `FABULA_ULTIMA.rollType.${value}.short`,
        full: `FABULA_ULTIMA.rollType.${value}.full`,
    })),
    damageTypes: toObject(damageTypes, value => `FABULA_ULTIMA.damageType.${value}`),
    statusEffects: toObject(statusEffects, value => `FABULA_ULTIMA.statusEffect.${value}`),
    defenses: toObject(defenses, value => ({
        short: `FABULA_ULTIMA.defense.${value}.short`,
        full: `FABULA_ULTIMA.defense.${value}.full`
    })),
    statusChoices: toObject(statusChoices, value => `FABULA_ULTIMA.statusChoice.${value}`)
}

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
        return foundry.utils.mergeObject(data, {system: data.item.system, constants});
    }


    activateListeners(html) {
        super.activateListeners(html);
    }
}