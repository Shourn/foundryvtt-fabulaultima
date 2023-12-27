
export default class BaseAdvancement extends foundry.abstract.DataModel {

    static get typeName(){
        return this.name
    }

    static defineSchema(){
        const {DocumentIdField, StringField} = foundry.data.fields;
        return {
            _id: new DocumentIdField({initial: () => foundry.utils.randomID()}),
            type: new StringField({
                required: true, initial: this.typeName, validate: v => v === this.typeName,
                validationError: `must be the same as typeName but was ${this.typeName}`
            }),
        }
    }

    static get metadata() {
        return {
            icon: "icons/svg/upgrade.svg",
            title: game.i18n.localize("FABULA_ULTIMA.job.skill.advancement.title"),
            hint: "",
            apps: {
                config: FormApplication,
                flow: FormApplication
            }
        };

    }

}