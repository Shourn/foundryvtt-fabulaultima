import {CommonData} from "../CommonData.mjs";
import {rank, species, villain} from "../../Constants.mjs";

/**
 * @extends CommonData
 * @property {Villain} villain
 * @property {number} ultimaPoints
 * @property {Rank} rank
 * @property {number} replacesSoldiers
 * @property {Species} species
 * @property {string} description
 * @property {string} traits
 * @property {number} initiative
 */
export class NpcData extends CommonData {
    static defineSchema() {
        const {
            NumberField,
            StringField,
            ArrayField
        } = foundry.data.fields
        return Object.assign({}, super.defineSchema(), {
                villain: new StringField({required: true, initial: villain[0], choices: villain}),
                ultimaPoints: new NumberField({initial: 0, min: 0, max: 15, integer: true}),
                rank: new StringField({required: true, initial: rank[0], choices: rank}),
                replacesSoldiers: new NumberField({initial: 1, positive: true, integer: true}),
                species: new StringField({initial: species[0], choices: species}),
                traits: new ArrayField(new StringField({initial: ""}), {})
            }
        )
    }


    prepareBaseData() {
        super.prepareBaseData();
    }

    prepareDerivedData() {
        super.prepareDerivedData();
        this.replacesSoldiers = this.rank === "soldier" ? 1 : this.rank === "elite" ? 2 : Math.max(2, this.replacesSoldiers)

        this.hp.max = this.level * 2 + this.getDieSize(this.attributes.might.base) * 5;
        this.hp.max = this.hp.max * this.replacesSoldiers;
        this.mp.max = this.level + this.getDieSize(this.attributes.willpower.base) * 5;

        this.initiative = ((this.getDieSize(this.attributes.dexterity.base) + this.getDieSize(this.attributes.insight.base)) / 2) + this.initiativeModifier;

        if (this.isChampion) {
            this.initiative = this.initiative + this.replacesSoldiers;
            this.mp.max = this.mp.max * 2;
        }
    }

    get isChampion() {
        return this.rank === "champion";
    }

    get isVillain() {
        return this.villain !== "no";
    }

}