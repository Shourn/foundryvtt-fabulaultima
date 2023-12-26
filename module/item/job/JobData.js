import {Skill} from "../skill/Skill.mjs";
import {Spell} from "../spell/Spell.mjs";

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
 * @property {Spell[]} spells
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
            ForeignDocumentField
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
            skills: new ArrayField(new ForeignDocumentField(Skill, {nullable: false})),
            spells: new ArrayField(new ForeignDocumentField(Spell, {nullable: false}))
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

    prepareBaseData() {
        this.skills = this.skills.map(fn => fn instanceof Skill ? fn : fn()).filter(value => !!value);
        this.spells = this.spells.map(fn => fn instanceof Spell ? fn : fn()).filter(value => !!value);
    }

    /**
     * @param {Spell} spell
     */
    async addSpell(spell) {
        if (!spell instanceof Spell) throw new Error("Not a Spell");
        if (spell.pack) throw new Error("You may only add Spells which exist within the World.");
        const spellIds = this._source.spells;
        if (spellIds.includes(spell.id)) return;
        return this.parent.update({
            system: {
                spells: spellIds.concat([spell.id])
            }
        });
    }

    /**
     * @param {string} spellId
     * @returns {Promise<*>}
     */
    async removeSpell(spellId) {
        const spellIds = this._source.spells;
        if (!spellIds.includes(spellId)) return;
        return this.parent.update({
            system: {
                spells: spellIds.filter(id => id !== spellId)
            }
        });
    }

    /**
     * @param {Skill} skill
     */
    async addSkill(skill) {
        if (!skill instanceof Skill) throw new Error("Not a Spell");
        if (skill.pack) throw new Error("You may only add Skills which exist within the World.");
        const skillIds = this._source.skills;
        if (skillIds.includes(skill.id)) return;
        return this.parent.update({
            system: {
                skills: skillIds.concat([skill.id])
            }
        });
    }

    /**
     * @param {string} skillId
     * @returns {Promise<*>}
     */
    async removeSkill(skillId) {
        const skillIds = this._source.skills;
        if (!skillIds.includes(skillId)) return;
        return this.parent.update({
            system: {
                skills: skillIds.filter(id => id !== skillId)
            }
        });
    }

    prepareDerivedData() {
        super.prepareDerivedData();
    }

}