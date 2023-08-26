import {FUCommonData} from "./FUCommonData.mjs";
import {FUItem} from "../item/FUItem.mjs";

export class FUCharacterData extends FUCommonData {
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
                bond: new StringField({initial: ""}),
                feeling1: new StringField({initial: "none", choices: ["none", "admiration", "inferiority"]}),
                feeling2: new StringField({initial: "none", choices: ["none", "loyalty", "mistrust"]}),
                feeling3: new StringField({initial: "none", choices: ["none", "affection", "hatred"]}),
            }), {initial: []}),
            fabulaPoints: new NumberField({initial: 1, positive: true, integer: true}),
            experience: new NumberField({initial: 0, min: 0, integer: true}),
            initiativeMod: new NumberField({initial: 0, integer: true}),
            proficiencies: new SchemaField({
                armor: new BooleanField({initial: false}),
                shields: new BooleanField({initial: false}),
                melee: new BooleanField({initial: false}),
                ranged: new BooleanField({initial: false})
            }),
            equipment: new SchemaField({
                accessory: new ForeignDocumentField(FUItem),
                armor: new ForeignDocumentField(FUItem),
                mainHand: new ForeignDocumentField(FUItem),
                offHand: new ForeignDocumentField(FUItem)
            }),
            zenit: new NumberField({initial: 500, positive: true, integer: true}),
            inventoryPoints: new SchemaField({
                value: new NumberField({min: 0, initial: 6, max: 6, integer: true}),
                max: new NumberField({min: 0, initial: 6, max: 6, integer: true})
            })
        })
    }

}