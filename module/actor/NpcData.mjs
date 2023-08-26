import {CommonData} from "./CommonData.mjs";
import {
    attackTypes,
    attributes,
    damageTypes,
    rank,
    rollVariables,
    species,
    statusEffects,
    villain
} from "../Constants.mjs";
import {clamp} from "../utils/helper.mjs";

export class NpcData extends CommonData {
    static defineSchema() {
        const {
            NumberField,
            StringField,
            SchemaField,
            ArrayField
        } = foundry.data.fields
        return Object.assign({}, super.defineSchema(), {
                villain: new StringField({required: true, initial: villain[0], choices: villain}),
                ultimaPoints: new NumberField({initial: 0, min:0, max: 15, integer: true}),
                rank: new StringField({required: true, initial: rank[0], choices: rank}),
                replacesSoldiers: new NumberField({initial: 1, positive: true, integer: true}),
                species: new StringField({initial: species[0], choices: species}),
                description: new StringField({initial: ""}),
                traits: new StringField({initial: ""}),
                initiative: new NumberField({initial: 0, integer: true}),
                attacks: new ArrayField(new SchemaField({
                    attackType: new StringField({initial: attackTypes[0], choices: attackTypes}),
                    name: new StringField({initial: ""}),
                    check: new SchemaField({
                        die1: new StringField({initial: attributes[0], choices: attributes}),
                        die2: new StringField({initial: attributes[0], choices: attributes}),
                        bonus: new NumberField({initial: 0, min: 0})
                    }),
                    damage: new SchemaField({
                        calculation: new SchemaField({
                            variable: new StringField({initial: rollVariables[0], choices: rollVariables}),
                            flat: new NumberField({initial: 0, min: 0})
                        }),
                        type: new StringField({initial: "physical", choices: damageTypes})
                    }),
                    status: new StringField({choices: statusEffects})
                })),
                otherActions: new ArrayField(new SchemaField({
                    name: new StringField({initial: ""}),
                    description: new StringField({initial: ""})
                }))
            }
        )
    }


    prepareBaseData() {
        this.replacesSoldiers = this.rank === "soldier" ? 1 : this.rank === "elite" ? 2 : Math.max(2, this.replacesSoldiers)
        super.prepareBaseData();
        this.initiative = (this.getDieSize(this.attributes.dexterity.base) + this.getDieSize(this.attributes.insight.base)) / 2;
        if (this.isChampion()){
            this.initiative = this.initiative + this.replacesSoldiers;
        }
    }


    prepareHp() {
        this.hp.max = this.level * 2 + this.getDieSize(this.attributes.might.base) * 5;
        this.hp.max = this.hp.max * this.replacesSoldiers;
        super.prepareHp();
    }


    prepareMp() {
        this.mp.max = this.level + this.getDieSize(this.attributes.willpower.base) * 5;
        if (this.isChampion()){
            this.mp.max = this.mp.max * 2;
        }
        super.prepareMp();
    }

    isChampion(){
        return this.rank === "champion";
    }

    isVillain(){
        return this.villain !== "no";
    }
}