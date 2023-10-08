//Provide a type string to class object mapping to keep our code clean
import {Accessory} from "./accessory/Accessory.mjs";
import {Armor} from "./armor/Armor.mjs";
import {MiscItem} from "./misc/MiscItem.mjs";
import {Shield} from "./shield/Shield.mjs";
import {Weapon} from "./weapon/Weapon.mjs";
import {Spell} from "./spell/Spell.mjs";
import {Job} from "./job/Job.mjs";
import {Skill} from "./skill/Skill.mjs";

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

export const ItemProxy = new Proxy(Item, {
    //Will intercept calls to the "new" operator
    construct: function (target, args) {
        const [data] = args;

        //Handle missing mapping entries
        if (!itemMappings.hasOwnProperty(data.type))
            throw new Error("Unsupported Entity type for create(): " + data.type);

        //Return the appropriate, actual object from the right class
        return new itemMappings[data.type](...args);
    },
    // Property access on this weird, dirty proxy object
    get: function (target, prop, receiver) {
        switch (prop) {
            case "create":
            case "createDocuments":
                //Calling the class' create() static function
                return function (data, options) {
                    if (data.constructor === Array) {
                        //Array of data, this happens when creating Actors imported from a compendium
                        return data.map(i => ItemProxy.create(i, options));
                    }

                    if (!itemMappings.hasOwnProperty(data.type))
                        throw new Error("Unsupported Entity type for create(): " + data.type);

                    return itemMappings[data.type].create(data, options);
                };
            case Symbol.hasInstance:
                //Applying the "instanceof" operator on the instance object
                return function (instance) {
                    return Object.values(itemMappings).some(i => instance instanceof i);
                };

            default:
                //Just forward any requested properties to the base Actor class
                return Item[prop];
        }
    }
});