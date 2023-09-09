/**
 * @property {number} price
 * @property {string} description
 */
export class AccessoryData extends foundry.abstract.TypeDataModel {

    static defineSchema() {
        const {NumberField, HTMLField} = foundry.data.fields;
        return {
            price: new NumberField({initial: 500, min: 0, integer: true}),
            description: new HTMLField({initial: ""})
        }
    }

}