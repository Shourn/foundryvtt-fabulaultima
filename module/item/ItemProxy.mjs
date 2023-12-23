//Provide a type string to class object mapping to keep our code clean
import {Accessory} from "./accessory/Accessory.mjs";
import {Armor} from "./armor/Armor.mjs";
import {MiscItem} from "./misc/MiscItem.mjs";
import {Shield} from "./shield/Shield.mjs";
import {Weapon} from "./weapon/Weapon.mjs";
import {Spell} from "./spell/Spell.mjs";
import {Job} from "./job/Job.mjs";
import {Skill} from "./skill/Skill.mjs";
import {BaseItem} from "./BaseItem.mjs";

export const itemMappings = {
    accessory: Accessory,
    armor: Armor,
    job: Job,
    misc: MiscItem,
    shield: Shield,
    skill: Skill,
    spell: Spell,
    weapon: Weapon
};

export const ItemProxy = new Proxy(BaseItem, {
    //Will intercept calls to the "new" operator
    construct: function (target, args) {
        const [data] = args;

        //Handle missing mapping entries
        if (!itemMappings.hasOwnProperty(data.type))
            throw new Error("Unsupported Item type for create(): " + data.type);

        //Return the appropriate, actual object from the right class
        return new itemMappings[data.type](...args);
    }
});