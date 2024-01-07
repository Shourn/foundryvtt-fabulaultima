import {HOOKS} from "../../System.mjs";
import GrantSpell from "./GrantSpell.mjs";
import BaseAdvancement from "./BaseAdvancement.mjs";

Hooks.once(HOOKS.RegisterAdvancementTypes, callback => {
    callback(GrantSpell)
})

/**
 * @type {Object.<string, typeof BaseAdvancement>}
 */
let advancementTypes;

export function registerAdvancementTypes() {
    if (advancementTypes) {
        throw new Error("Registration already complete")
    }

    const types = {}

    /**
     * @param {typeof BaseAdvancement} advancementType
     */
    function registrationCallback(advancementType) {
        if (!advancementType) {
            return;
        }
        const typeName = advancementType.typeName;
        if (!types[typeName]) {
            types[typeName] = advancementType
        } else {
            throw new Error(`${typeName} already registered to ${types[typeName]}`)
        }
    }

    Hooks.callAll(HOOKS.RegisterAdvancementTypes, registrationCallback)

    advancementTypes = Object.freeze(types);
}

export function getAdvancementTypes() {
    return advancementTypes;
}

/**
 * @extends {ObjectField}
 */
export class AdvancementField extends foundry.data.fields.ObjectField {

    constructor(options) {
        super(options);
    }


    _cast(value){
        return typeof value === "object" ? value : {};
    }

    initialize(value, model, options){
        const advancementType = getAdvancementTypes()[value.type];
        return advancementType ? new advancementType(value, {...options, parent: model}) : null;
    }

}
