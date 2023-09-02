import {attributeDice} from "../Constants.mjs";

/**
 * @typedef Attributes
 * @property {AttributeValue} dexterity
 * @property {AttributeValue} insight
 * @property {AttributeValue} might
 * @property {AttributeValue} willpower
 */
/**
 * @typedef AttributeValue
 * @property {AttributeDie} base
 * @property {AttributeDie} current
 */
/**
 * @extends Attributes
 */
export class AttributesSchema extends foundry.data.fields.SchemaField {

    /**
     * @param initials {{[dexterity]: AttributeDie, [insight]: AttributeDie, [might]: AttributeDie, [willpower]: AttributeDie}}
     */
    constructor(initials = {}) {
        const {StringField, SchemaField} = foundry.data.fields;
        super({
            dexterity: new SchemaField({
                base: new StringField({initial: initials.dexterity || "d8", choices: attributeDice}),
                current: new StringField({initial: initials.dexterity || "d8", choices: attributeDice})
            }),
            insight: new SchemaField({
                base: new StringField({initial: initials.insight || "d8", choices: attributeDice}),
                current: new StringField({initial: initials.insight || "d8", choices: attributeDice})
            }),
            might: new SchemaField({
                base: new StringField({initial: initials.might || "d8", choices: attributeDice}),
                current: new StringField({initial: initials.might || "d8", choices: attributeDice})
            }),
            willpower: new SchemaField({
                base: new StringField({initial: initials.willpower || "d8", choices: attributeDice}),
                current: new StringField({initial: initials.willpower || "d8", choices: attributeDice})
            })
        })
    }

}