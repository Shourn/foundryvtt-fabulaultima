import {Skill} from "../skill/Skill.mjs";
import {Spell} from "../spell/Spell.mjs";

export class JobData extends foundry.abstract.TypeDataModel {

    static defineSchema() {
        const {
            HTMLField,
            SchemaField,
            NumberField,
            BooleanField,
            StringField,
            SetField,
            ForeignDocumentField
        } = foundry.data.fields;
        return {
            description: new HTMLField(),
            level: new NumberField({initial: 1, min: 1, max: 10}),
            benefits: new SchemaField({
                hp: new NumberField({initial: 0, min: 0, integer: true}),
                mp: new NumberField({initial: 0, min: 0, integer: true}),
                ip: new NumberField({initial: 0, min: 0, integer: true}),
                meleeWeapons: new BooleanField({initial: false}),
                rangedWeapons: new BooleanField({initial: false}),
                shields: new BooleanField({initial: false}),
                armor: new BooleanField({initial: false}),
                special: new StringField()
            }),
            skills: new SetField(new ForeignDocumentField(Skill, {nullable: false})),
            spells: new SetField(new ForeignDocumentField(Spell, {nullable: false}))
        }
    }

}