import {damageTypes, rollTypes} from "../Constants.mjs";

/**
 * @property {RollType} roll
 * @property {number} bonus
 * @property {DamageType} type
 */
export class DamageSchema extends foundry.data.fields.SchemaField {

    /**
     * @param {DamageSchema} initials
     */
    constructor(initials = {}) {
        const {NumberField, StringField} = foundry.data.fields
        super({
            roll: new StringField({initial: initials.roll || rollTypes[0], choices: rollTypes}),
            bonus: new NumberField({initial: initials.bonus || 0, integer: true}),
            type: new StringField({initial: initials.type || damageTypes[0], choices: damageTypes})
        });

    }

}