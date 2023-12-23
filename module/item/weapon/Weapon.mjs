import {createCheckMessage, rollCheck} from "../../checks/Checks.mjs";

export class Weapon extends Item {

    static getDefaultArtwork(itemData) {
        return { img: "systems/fabulaultima/assets/game-icons/plain-dagger.svg" };
    }


    /**
     * @type {Character, Npc}
     */
    get actor() {
        return super.actor;
    }

    async roll() {
        if (!this.actor) {
            return;
        }

        const check = this.system.check;
        const attributes = this.actor.system.attributes;
        const rolledCheck = await rollCheck({
            check: {
                attr1: {
                    attribute: check.attr1,
                    dice: attributes[check.attr1]
                },
                attr2: {
                    attribute: check.attr2,
                    dice: attributes[check.attr2]
                },
                modifier: check.modifier
            }
        });

        await createCheckMessage(rolledCheck);

    }

}