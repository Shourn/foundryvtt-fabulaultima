import {attributes} from "../../Constants.mjs";

/**
 * @extends TypeDataModel
 */
export class ArmorData extends foundry.abstract.TypeDataModel {

    static defineSchema() {
        const {StringField, NumberField, HTMLField, SchemaField} = foundry.data.fields;
        return {
            price: new NumberField({initial: 100, min: 0, integer: true}),
            quality: new StringField(),
            description: new HTMLField({initial: ""}),
            defense: new SchemaField({
                attribute: new StringField({
                    initial: "dexterity",
                    choices: ["none", ...attributes]
                }),
                modifier: new NumberField({initial: 0, integer: true})
            }),
            magicDefense: new SchemaField({
                attribute: new StringField({
                    initial: "insight",
                    choices: ["none", ...attributes]
                }),
                modifier: new NumberField({initial: 0, integer: true})
            }),
            initiativeModifier: new NumberField({initial: 0, integer: true})
        }
    }


}