import {affinities, attributeDice, attributes} from "../Constants.mjs";
import {clamp} from "../utils/helper.mjs";

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
            attributes: new SchemaField({
                dexterity: new SchemaField({
                    base: new StringField({initial: attributeDice[1], choices: attributeDice}),
                    current: new StringField({initial: attributeDice[1], choices: attributeDice})
                }),
                insight: new SchemaField({
                    base: new StringField({initial: attributeDice[1], choices: attributeDice}),
                    current: new StringField({initial: attributeDice[1], choices: attributeDice})
                }),
                might: new SchemaField({
                    base: new StringField({initial: attributeDice[1], choices: attributeDice}),
                    current: new StringField({initial: attributeDice[1], choices: attributeDice})
                }),
                willpower: new SchemaField({
                    base: new StringField({initial: attributeDice[1], choices: attributeDice}),
                    current: new StringField({initial: attributeDice[1], choices: attributeDice})
                })
            }),
            defenses: new SchemaField({
                defense: new SchemaField({
                    attribute: new StringField({
                        initial: "dexterity",
                        choices: ["none", ...attributes],
                        nullable: true
                    }),
                    bonus: new NumberField({initial: 0, integer: true}),
                    current: new NumberField({initial: 8, integer: true})
                }),
                magicDefense: new SchemaField({
                    attribute: new StringField({
                        initial: "insight",
                        choices: ["none", ...attributes],
                        nullable: true
                    }),
                    bonus: new NumberField({initial: 0, integer: true}),
                    current: new NumberField({initial: 8, integer: true})
                })
            }),
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
            })
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
        statistic.current = base + statistic.bonus;
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

    inCrisis(){
        return this.hp.value <= this.hp.crisis;
    }
}