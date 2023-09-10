import {attributes} from "../Constants.mjs";

/**
 * @typedef Check
 * @property {Attribute} attr1
 * @property {Attribute} attr2
 * @property {number} modifier
 */
/**
 * @extends Check
 */
export class CheckSchema extends foundry.data.fields.SchemaField {

    /**
     * @param {Partial<Check>} initials
     */
    constructor(initials = {}) {
        const {StringField, NumberField} = foundry.data.fields;
        super({
            attr1: new StringField({initial: initials.attr1 || attributes[0], choices: attributes}),
            attr2: new StringField({initial: initials.attr2 || attributes[0], choices: attributes}),
            modifier: new NumberField({initial: initials.modifier || 0, integer: true})
        });
    }

}
