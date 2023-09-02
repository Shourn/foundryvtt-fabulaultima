import {affinities, attributeDice, attributes} from "../Constants.mjs";
import {clamp} from "../utils/helper.mjs";
import {AttributesSchema} from "../schema/AttributesSchema.mjs";
import {AffinitiesSchema} from "../schema/AffinitiesSchema.mjs";
import {DefensiveStatisticSchema} from "../schema/DefensiveStatisticSchema.mjs";

/**
 * @property {number} level
 * @property {Object} hp
 * @property {number} hp.value
 * @property {number} hp.max
 * @property {number} hp.crisis
 * @property {number} mp.value
 * @property {number} mp.max
 * @property {Attributes} attributes
 * @property {Object} defenses
 * @property {DefensiveStatistic} defenses.defense
 * @property {DefensiveStatistic} defenses.magicDefense
 * @property {Affinities}
 */
export class CommonData extends foundry.abstract.TypeDataModel {

    static defineSchema() {
        const {NumberField, StringField, SchemaField} = foundry.data.fields
        return {
            level: new NumberField({initial: 5, min: 5, integer: true}),
            hp: new SchemaField({
                value: new NumberField({initial: 45, min: 0, positive: true, integer: true}),
                max: new NumberField({initial: 45, min: 0, positive: true, integer: true}),
                crisis: new NumberField({initial: 22, positive: true, integer: true})
            }),
            mp: new SchemaField({
                value: new NumberField({initial: 45, positive: true, integer: true}),
                max: new NumberField({initial: 45, positive: true, integer: true})
            }),
            attributes: new AttributesSchema(),
            defenses: new SchemaField({
                defense: new DefensiveStatisticSchema({attribute: "dexterity"}),
                magicDefense: new DefensiveStatisticSchema({attribute: "insight"})
            }),
            affinities: new AffinitiesSchema()
        }
    }

    prepareBaseData() {
        this.prepareHp()
        this.prepareMp()
        this.syncAttribute(this.attributes.might)
        this.syncAttribute(this.attributes.dexterity)
        this.syncAttribute(this.attributes.insight)
        this.syncAttribute(this.attributes.willpower)
        this.calculateDefense(this.defenses.defense);
        this.calculateDefense(this.defenses.magicDefense);
    }

    syncAttribute(attribute) {
        attribute.current = attribute.base;
    }

    prepareDerivedData() {
    }

    calculateDefense(statistic) {
        const base = statistic.attribute === "none" ? 0 : this.getDieSize(this.attributes[statistic.attribute].current);
        statistic.current = base + statistic.modifier;
    }

    getDieSize(dice) {
        switch (dice) {
            case "d6":
                return 6;
            case "d8":
                return 8;
            case "d10":
                return 10;
            case "d12":
                return 12;
            default:
                return NaN;
        }
    }

    prepareHp() {
        this.hp.crisis = Math.floor(this.hp.max / 2);
        this.hp.value = clamp(this.hp.value, this.hp.max);
    }

    prepareMp() {
        this.mp.value = clamp(this.mp.value, this.mp.max);
    }

    get inCrisis() {
        return this.hp.value <= this.hp.crisis;
    }
}