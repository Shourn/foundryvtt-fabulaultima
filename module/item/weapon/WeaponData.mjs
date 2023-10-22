import {attackTypes, defenses, weaponCategories} from "../../Constants.mjs";
import {CheckSchema} from "../../schema/CheckSchema.mjs";
import {DamageSchema} from "../../schema/DamageSchema.mjs";

/**
 * @extends TypeDataModel
 */
export class WeaponData extends foundry.abstract.TypeDataModel {

    static defineSchema() {
        const {
            NumberField,
            StringField,
            HTMLField,
            BooleanField
        } = foundry.data.fields
        return {
            attackType: new StringField({initial: attackTypes[0], choices: attackTypes}),
            category: new StringField({initial: "brawling", choices: weaponCategories}),
            defense: new StringField({initial: defenses[0], choices: defenses}),
            check: new CheckSchema(),
            damage: new DamageSchema(),
            price: new NumberField({initial: 0, min: 0, integer: true}),
            quality: new StringField(),
            martial: new BooleanField(),
            description: new HTMLField()
        };
    }

}