import {HOOKS} from "../../System.mjs";
import {GrantSpell} from "./GrantedItem.mjs";

export class Advancements {

    static #instance;

    types;

    constructor() {
        if (Advancements.#instance) {
            return Advancements.#instance
        }
        Advancements.#instance = this
    }




}

Hooks.once(HOOKS.RegisterAdvancementTypes, callback => {
    callback(GrantSpell)
})

let advancementTypes;

export function registerAdvancementTypes() {
    if (advancementTypes){
        throw new Error("Registration already complete")
    }

    const types = {}

    /**
     * @param {typeof BaseAdvancement} advancementType
     */
    function registrationCallback(advancementType) {
        if (!advancementType){
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

export function getAdvancementTypes(){
    return advancementTypes;
}