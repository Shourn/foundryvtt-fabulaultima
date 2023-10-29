import {costTypes, durations, statusChoices, statusEffects, targetTypes} from "../../Constants.mjs";
import {CheckSchema} from "../../schema/CheckSchema.mjs";
import {DamageSchema} from "../../schema/DamageSchema.mjs";

/**
 * @property {Duration} duration
 * @property {boolean} offensive
 * @property {Damage} damage
 * @property {number} cost
 * @property {number} maxTargets
 * @property {CostType} costType
 * @property {string} opportunity
 * @property {string} description - HTMLField
 * @property {TargetType} targetType
 * @property {Check} check
 * @property {StatusChoice} statusChoice
 * @property {StatusEffect[]} status
 * @extends TypeDataModel
 */
export class SpellData extends foundry.abstract.TypeDataModel {

    static defineSchema() {
        const {NumberField, StringField, BooleanField, HTMLField} = foundry.data.fields
        return {
            cost: new NumberField({initial: 5, min: 5, integer: true, step: 5}),
            costType: new StringField({initial: costTypes[0], costTypes}),
            targetType: new StringField({initial: targetTypes[0], choices: targetTypes, required: true}),
            maxTargets: new NumberField({initial: 1, min: 1, integer: true}),
            duration: new StringField({initial: durations[0], durations}),
            offensive: new BooleanField({initial: true}),
            check: new CheckSchema({
                attr1: "insight",
                attr2: "willpower"
            }),
            damage: new DamageSchema(),
            effect: new StringField(),
            opportunity: new StringField(),
            description: new HTMLField({initial: game.i18n.localize('FABULA_ULTIMA.description')})
        }
    }

    prepareDerivedData(){
        super.prepareDerivedData()
        this.fixCost = this.costType === "total"
    }

}