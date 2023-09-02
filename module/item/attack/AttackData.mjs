import {
    attackTypes,
    attributes,
    damageTypes,
    defenses,
    rollTypes,
    statusChoices,
    statusEffects
} from "../../Constants.mjs";
import {CheckSchema} from "../../schema/CheckSchema.mjs";
import {DamageSchema} from "../../schema/DamageSchema.mjs";

/**
 * @property {Defense} defense
 * @property {AttackType} attackType
 * @property {Check} check
 * @property {Damage} damage
 * @property {StatusChoice} statusChoice
 * @property {StatusEffect[]} status
 */
export class AttackData extends foundry.abstract.TypeDataModel {

    static defineSchema() {
        const {
            StringField,
            ArrayField
        } = foundry.data.fields
        return {
            defense: new StringField({initial: defenses[0], choices: defenses}),
            attackType: new StringField({initial: attackTypes[0], choices: attackTypes}),
            check: new CheckSchema(),
            damage: new DamageSchema(),
            statusChoice: new StringField({initial: statusChoices[0], statusChoices}),
            status: new ArrayField(new StringField({choices: statusEffects}), {initial: []})
        };
    }


}