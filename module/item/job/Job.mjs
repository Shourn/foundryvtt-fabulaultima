import {BaseItem} from "../BaseItem.mjs";


/**
 * @property {JobData} system
 */
export class Job extends BaseItem {

    static getDefaultArtwork(itemData) {
        return { img: "systems/fabulaultima/assets/game-icons/domino-mask.svg" };
    }

}