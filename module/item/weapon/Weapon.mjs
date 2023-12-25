import {createCheckMessage, rollCheck} from "../../checks/Checks.mjs";

/**
 * @property {WeaponData} system
 */
export class Weapon extends Item {

    static getDefaultArtwork(itemData) {
        return {img: "systems/fabulaultima/assets/game-icons/plain-dagger.svg"};
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
        const {quality, category, attackType, defense, check, damage} = this.system;
        const attributes = this.actor.system.attributes;
        const rolledCheck = await rollCheck({
            check: {
                attr1: {
                    attribute: check.attr1,
                    dice: attributes[check.attr1].current
                },
                attr2: {
                    attribute: check.attr2,
                    dice: attributes[check.attr2].current
                },
                modifier: check.modifier
            },
            weapon: {
                name: this.name,
                uuid: this.uuid,
                quality,
                category,
                attackType,
                defense
            },
            damage: {
                roll: damage.roll,
                bonus: damage.bonus,
                type: damage.type
            },
            speaker: ChatMessage.implementation.getSpeaker({actor: this.actor})
        });

        await createCheckMessage(rolledCheck);

    }

}