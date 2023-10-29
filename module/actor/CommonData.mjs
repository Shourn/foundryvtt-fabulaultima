import {affinities, attributeDice, attributes} from "../Constants.mjs";


/**
 * @typedef Attributes
 * @property {AttributeValue} dexterity
 * @property {AttributeValue} insight
 * @property {AttributeValue} might
 * @property {AttributeValue} willpower
 */
/**
 * @typedef DefensiveStatistic
 * @property {Attribute | "none"} attribute
 * @property {number} modifier
 * @property {number} current
 */
/**
 * @typedef AttributeValue
 * @property {AttributeDie} base
 * @property {AttributeDie} current
 */

/**
 * @typedef Affinities
 * @property {Affinity} physical
 * @property {Affinity} air
 * @property {Affinity} bolt
 * @property {Affinity} dark
 * @property {Affinity} earth
 * @property {Affinity} fire
 * @property {Affinity} light
 * @property {Affinity} poison
 */
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
 * @property {number} initiativeModifier
 * @property {Affinities}
 * @extends TypeDataModel
 */
export class CommonData extends foundry.abstract.TypeDataModel {

    static defineSchema() {
        const {NumberField, StringField, SchemaField, HTMLField} = foundry.data.fields
        return {
            level: new NumberField({initial: 5, min: 5, integer: true}),
            hp: new SchemaField({
                value: new NumberField({initial: 45, min: 0, positive: true, integer: true}),
                max: new NumberField({initial: 45, min: 0, positive: true, integer: true}),
            }),
            mp: new SchemaField({
                value: new NumberField({initial: 45, positive: true, integer: true}),
                max: new NumberField({initial: 45, positive: true, integer: true})
            }),
            attributes: new SchemaField({
                dexterity: new SchemaField({
                    base: new StringField({initial: "d8", choices: attributeDice})
                }),
                insight: new SchemaField({
                    base: new StringField({initial: "d8", choices: attributeDice})
                }),
                might: new SchemaField({
                    base: new StringField({initial: "d8", choices: attributeDice}),
                }),
                willpower: new SchemaField({
                    base: new StringField({initial: "d8", choices: attributeDice}),
                })
            }),
            defenses: new SchemaField({
                defense: new SchemaField({
                    attribute: new StringField({
                        initial: "dexterity",
                        choices: ["none", ...attributes],
                        nullable: true
                    }),
                    modifier: new NumberField({initial: 0, integer: true})
                }),
                magicDefense: new SchemaField({
                    attribute: new StringField({
                        initial: "insight",
                        choices: ["none", ...attributes],
                        nullable: true
                    }),
                    modifier: new NumberField({initial: 0, integer: true})
                })
            }),
            initiativeModifier: new NumberField({initial: 0, integer: true}),
            affinities: new SchemaField({
                physical: new StringField({
                    initial: "none",
                    required: true,
                    choices: affinities
                }),
                air: new StringField({
                    initial: "none",
                    required: true,
                    choices: affinities
                }),
                bolt: new StringField({
                    initial: "none",
                    required: true,
                    choices: affinities
                }),
                dark: new StringField({
                    initial: "none",
                    required: true,
                    choices: affinities
                }),
                earth: new StringField({
                    initial: "none",
                    required: true,
                    choices: affinities
                }),
                fire: new StringField({
                    initial: "none",
                    required: true,
                    choices: affinities
                }),
                ice: new StringField({
                    initial: "none",
                    required: true,
                    choices: affinities
                }),
                light: new StringField({
                    initial: "none",
                    required: true,
                    choices: affinities
                }),
                poison: new StringField({
                    initial: "none",
                    required: true,
                    choices: affinities
                })
            }),
            description: new HTMLField()
        }
    }

    /**
     * @returns {FUActor}
     */
    get parent() {
        return super.parent;
    }

    prepareBaseData() {
        const hp = this.hp;
        Object.defineProperty(hp, "crisis", {
            get() {
                return Math.floor(hp.max / 2)
            }
        });

        this.attributes.might.current = this.attributes.might.base;
        this.attributes.dexterity.current = this.attributes.dexterity.base;
        this.attributes.insight.current = this.attributes.insight.base;
        this.attributes.willpower.current = this.attributes.willpower.base;
    }

    prepareDerivedData() {
        this.deriveAttributes();
        this.deriveDefense(this.defenses.defense);
        this.deriveDefense(this.defenses.magicDefense);
    }

    deriveDefense(statistic) {
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

    get inCrisis() {
        return this.hp.value <= this.hp.crisis;
    }

    deriveAttributes() {
        const statuses = this.parent.statuses;
        if (statuses.has("slow")) this.reduceDieSize(this.attributes.dexterity);
        if (statuses.has("dazed")) this.reduceDieSize(this.attributes.insight);
        if (statuses.has("weak")) this.reduceDieSize(this.attributes.might);
        if (statuses.has("shaken")) this.reduceDieSize(this.attributes.willpower);

        if (statuses.has("enraged")) {
            this.reduceDieSize(this.attributes.dexterity);
            this.reduceDieSize(this.attributes.insight);
        }

        if (statuses.has("poisoned")) {
            this.reduceDieSize(this.attributes.might);
            this.reduceDieSize(this.attributes.willpower);
        }
    }

    /**
     * @param {AttributeValue} attribute
     */
    reduceDieSize(attribute) {
        const index = attributeDice.indexOf(attribute.current);
        attribute.current = attributeDice[Math.max(0, index - 1)]
    }
}