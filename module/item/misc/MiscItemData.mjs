/**
 * @extends TypeDataModel
 */
export class MiscItemData extends foundry.abstract.TypeDataModel {

    static defineSchema(){
        const {NumberField, HTMLField} = foundry.data.fields;
        return {
            price: new NumberField({initial: 0, min: 0, integer:true}),
            description: new HTMLField()
        }
    }

}