import {attributes} from "../../Constants.mjs";

/**
 * @extends TypeDataModel
 */
export class ArmorData extends foundry.abstract.TypeDataModel {

    static defineSchema() {
        const {StringField, NumberField, HTMLField, SchemaField} = foundry.data.fields;
        return {
            price: new NumberField({initial: 500, min: 0, integer: true}),
            description: new HTMLField({initial: ""}),
            defense: new SchemaField({
                attribute: new StringField({
                    initial: "dexterity",
                    choices: ["none", ...attributes],
                    nullable: true
                }),
                modifier: new NumberField({initial: 0, integer: true})
            }),
            magicDefense: new SchemaField({
                attribute: new StringField({
                    initial: "insight",
                    choices: ["none", ...attributes],
                    nullable: true
                }),
                modifier: new NumberField({initial: 0, integer: true})
            }),
            initiativeModifier: new NumberField({initial: 0, integer: true})
        }
    }


}