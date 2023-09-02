import Templates from "../../Templates.mjs";
import {toObject} from "../../utils/helper.mjs";
import {
    attackTypes,
    attributes, costTypes,
    damageTypes,
    defenses, durations,
    rollTypes,
    statusChoices,
    statusEffects, targetTypes
} from "../../Constants.mjs";

const constants = {
    costTypes: toObject(costTypes, value => `FABULA_ULTIMA.costType.${value}`),
    targetTypes: toObject(targetTypes, value => `FABULA_ULTIMA.targetType.${value}`),
    durations: toObject(durations, value => `FABULA_ULTIMA.duration.${value}`),
    attributes: toObject(attributes, value => ({
        short: `FABULA_ULTIMA.attribute.${value}.short`,
        full: `FABULA_ULTIMA.attribute.${value}.full`,
    })),
    rollTypes: toObject(rollTypes, value => ({
        short: `FABULA_ULTIMA.rollType.${value}.short`,
        full: `FABULA_ULTIMA.rollType.${value}.full`,
    })),
    damageTypes: toObject(damageTypes, value => `FABULA_ULTIMA.damageType.${value}`),
    statusChoices: toObject(statusChoices, value => `FABULA_ULTIMA.statusChoice.${value}`),
    statusEffects: toObject(statusEffects, value => `FABULA_ULTIMA.statusEffect.${value}`)
}

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
            system: data.item.system, constants, enrichedHtml: {
                description: TextEditor.enrichHTML(data.item.system.description)
            }
        });
    }


    activateListeners(html) {
        super.activateListeners(html);
    }
}