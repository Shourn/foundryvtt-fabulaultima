export class SkillData extends foundry.abstract.TypeDataModel {

    static defineSchema() {
        const {HTMLField, NumberField} = foundry.data.fields;
        return {
            description: new HTMLField(),
            level: new NumberField({initial: 0, integer: true, min: 0}),
            maxLevel: new NumberField({initial: 1, integer: true, min: 1, max: 10})
        }
    }

}