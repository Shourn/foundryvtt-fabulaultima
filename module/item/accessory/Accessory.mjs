import {BaseItem} from "../BaseItem.mjs";

/**
 * @extends {Item}
 * @extends {ItemData}
 * @property {AccessoryData} system
 */
export class Accessory extends BaseItem {

    static getDefaultArtwork(itemData) {
        return { img: "systems/fabulaultima/assets/game-icons/gem-pendant.svg" };
    }

    get price(){
        return this.system.price;
    }

    get description() {
        return this.system.description;
    }
}