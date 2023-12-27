import {Skill} from "./Skill.mjs";

/**
 * @property {string} description
 * @property {string} questions
 * @property {number} level
 * @property {object} benefits
 * @property {number} benefits.hp
 * @property {number} benefits.mp
 * @property {number} benefits.ip
 * @property {boolean} benefits.me
 * @property {boolean} benefits.melee
 * @property {boolean} benefits.ranged
 * @property {boolean} benefits.shield
 * @property {boolean} benefits.armor
 * @property {string} benefits.special
 * @property {Skill[]} skills
 * @extends TypeDataModel
 */
export class JobData extends foundry.abstract.TypeDataModel {

    static defineSchema() {
        const {
            HTMLField,
            SchemaField,
            NumberField,
            BooleanField,
            StringField,
            ArrayField,
            EmbeddedDataField
        } = foundry.data.fields;
        return {
            description: new HTMLField(),
            questions: new HTMLField(),
            level: new NumberField({initial: 1, min: 1, max: 10}),
            benefits: new SchemaField({
                hp: new NumberField({initial: 0, min: 0, integer: true}),
                mp: new NumberField({initial: 0, min: 0, integer: true}),
                ip: new NumberField({initial: 0, min: 0, integer: true}),
                armor: new BooleanField({initial: false}),
                melee: new BooleanField({initial: false}),
                ranged: new BooleanField({initial: false}),
                shield: new BooleanField({initial: false}),
                special: new StringField()
            }),
            skills: new ArrayField(new EmbeddedDataField(Skill, {nullable: false})),
        }
    }

    /**
     * @returns {Job}
     */
    get parent() {
        return super.parent;
    }

    get grantsHp() {
        return this.benefits.hp > 0;
    }

    get grantsMp() {
        return this.benefits.mp > 0;
    }

    get grantsIp() {
        return this.benefits.ip > 0;
    }

    get grantsSpecial() {
        return this.benefits.special && (this.benefits.special.trim().length !== 0);
    }

}