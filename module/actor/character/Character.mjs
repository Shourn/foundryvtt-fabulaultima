import {Accessory} from "../../item/accessory/Accessory.mjs";
import {Armor} from "../../item/armor/Armor.mjs";
import {Shield} from "../../item/shield/Shield.mjs";
import {Weapon} from "../../item/weapon/Weapon.mjs";
import {BaseActor} from "../BaseActor.mjs";

/**
 * @augments {Actor}
 * @augments {foundry.abstract.Document}
 * @augments {ActorData}
 * @extends {ClientDocumentMixin}
 * @property {PlayerCharacterData} system
 */
export class Character extends BaseActor {

    get backpack() {
        return [...this.itemTypes.accessory, ...this.itemTypes.armor, ...this.itemTypes.misc, ...this.itemTypes.shield, ...this.itemTypes.weapon]
    }

    get equipped() {
        const {accessory, armor, mainHand, offHand} = this.system.equipment;
       return {
           [accessory?.id]: true,
           [armor?.id]: true,
           [mainHand?.id]: true,
           [offHand?.id]: true
       }
    }

    async equip(itemId) {
        const item = this.items.get(itemId);
        if (item instanceof Accessory) {
            await this.update({"system.equipment.accessory": this.system.equipment.accessory === item ? null : item.id});
        }
        if (item instanceof Armor) {
            await this.update({"system.equipment.armor": this.system.equipment.armor === item ? null : item.id});
        }
        if (item instanceof Shield) {
            await this.update({"system.equipment.offHand": this.system.equipment.offHand === item ? null : item.id});
        }
        if (item instanceof Weapon) {
            if (!this.system.equipment.mainHand) {
                await this.update({"system.equipment.mainHand": this.system.equipment.mainHand === item ? null : item.id});
            }
        }
    }

    async unequip(itemId){
        const item = this.items.get(itemId);
        const data = {}
        for (let [key, value] of Object.entries(this.system.equipment)) {
            if (value === item) {
                data[`system.equipment.${key}`] = null;
            }
        }
        await this.update(data);
    }

    applyActiveEffects() {
        return super.applyActiveEffects();
    }
}
