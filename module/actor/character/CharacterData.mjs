import {CommonData} from "../CommonData.mjs";
import {Accessory} from "../../item/accessory/Accessory.mjs";
import {Armor} from "../../item/armor/Armor.mjs";
import {feelings1, feelings2, feelings3} from "../../Constants.mjs";

/**
 * @typedef Bond
 * @property {string} with
 * @property {Feeling1} feeling1
 * @property {Feeling2} feeling2
 * @property {Feeling3} feeling3
 */

/**
 * @typedef Proficiencies
 * @property {boolean} armor
 * @property {boolean} shields
 * @property {boolean} melee
 * @property {boolean} ranged
 */

/**
 * @typedef Equipment
 * @property {Accessory} [accessory]
 * @property {Armor} [armor]
 * @property {Weapon} [mainHand]
 * @property {Weapon, Shield} [offHand]
 */

/**
 * @alias PlayerCharacterData
 * @extends CommonData
 * @property {string} pronouns
 * @property {{identity: string, theme: string, origin: string}} traits
 * @property {Bond[]} bonds
 * @property {number} fabulaPoints
 * @property {number} experience
 * @property {Proficiencies} proficiencies
 * @property {Equipment} equipment
 * @property {number} zenit
 * @property {Object} inventoryPoints
 * @property {number} inventoryPoints.value
 * @property {number} inventoryPoints.max
 */
export class CharacterData extends CommonData {
    static defineSchema() {
        const {
            NumberField,
            StringField,
            BooleanField,
            SchemaField,
            ArrayField,
            ForeignDocumentField
        } = foundry.data.fields
        return Object.assign({}, super.defineSchema(), {
            pronouns: new StringField({initial: "They/Them"}),
            traits: new SchemaField({
                identity: new StringField({initial: ""}),
                theme: new StringField({initial: ""}),
                origin: new StringField({initial: ""})
            }),
            bonds: new ArrayField(new SchemaField({
                with: new StringField({initial: ""}),
                feeling1: new StringField({initial: "none", choices: feelings1}),
                feeling2: new StringField({initial: "none", choices: feelings2}),
                feeling3: new StringField({initial: "none", choices: feelings3}),
            }), {initial: []}),
            fabulaPoints: new NumberField({initial: 1, min: 0, integer: true}),
            experience: new NumberField({initial: 0, min: 0, integer: true}),
            proficiencies: new SchemaField({
                armor: new BooleanField({initial: false}),
                shields: new BooleanField({initial: false}),
                melee: new BooleanField({initial: false}),
                ranged: new BooleanField({initial: false})
            }),
            equipment: new SchemaField({
                accessory: new ForeignDocumentField(Accessory),
                armor: new ForeignDocumentField(Armor),
                mainHand: new ForeignDocumentField(Item),
                offHand: new ForeignDocumentField(Item)
            }),
            zenit: new NumberField({initial: 500, positive: true, integer: true}),
            inventoryPoints: new SchemaField({
                value: new NumberField({initial: 6, min: 0, max: 6, integer: true}),
                max: new NumberField({initial: 6, min: 0, max: 6, integer: true})
            })
        })
    }


    prepareBaseData() {
        super.prepareBaseData();
    }


    prepareDerivedData() {
        super.prepareDerivedData();
        this.hp.max = this.level + this.getDieSize(this.attributes.might.base) * 5;
        this.mp.max = this.level + this.getDieSize(this.attributes.willpower.base) * 5;
    }
}