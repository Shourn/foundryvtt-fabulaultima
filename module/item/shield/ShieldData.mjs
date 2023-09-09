import {attributes} from "../../Constants.mjs";

/**
 * @extends TypeDataModel
 */
export class ShieldData extends foundry.abstract.TypeDataModel {

    static defineSchema() {
        const {NumberField, HTMLField} = foundry.data.fields;
        return {
            price: new NumberField({initial: 500, min: 0, integer: true}),
            description: new HTMLField({initial: ""}),
            defenseModifier: new NumberField({initial: 0, integer: true}),
            magicDefenseModifier: new NumberField({initial: 0, integer: true}),
            initiativeModifier: new NumberField({initial: 0, integer: true})
        }
    }


}