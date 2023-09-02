import {attributes} from "../Constants.mjs";

/**
 * @typedef DefensiveStatistic
 * @property {Attribute | "none"} attribute
 * @property {number} modifier
 * @property {number} current
 */
/**
 * @extends DefensiveStatistic
 */
export class DefensiveStatisticSchema extends foundry.data.fields.SchemaField {

    /**
     * @param {Partial<DefensiveStatistic>} initials
     */
    constructor(initials = {}) {
        const {StringField, NumberField} = foundry.data.fields;
        super({
            attribute: new StringField({
                initial: initials.attribute || "dexterity",
                choices: ["none", ...attributes],
                nullable: true
            }),
            modifier: new NumberField({initial: initials.modifier || 0, integer: true}),
            current: new NumberField({initial: 8, integer: true})
        })
    }
}