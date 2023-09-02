import {CommonData} from "../CommonData.mjs";
import {rank, species, villain} from "../../Constants.mjs";
import {Attack} from "../../item/attack/Attack.mjs";

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
        if (this.isChampion){
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
        if (this.isChampion){
            this.mp.max = this.mp.max * 2;
        }
        super.prepareMp();
    }

    get isChampion(){
        return this.rank === "champion";
    }

    get isVillain(){
        return this.villain !== "no";
    }

}