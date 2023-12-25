import Templates from "../../Templates.mjs";
import {createCheckMessage, rollCheck} from "../../checks/Checks.mjs";

/**
 * @property {SpellData} system
 */
export class Spell extends Item {

    static getDefaultArtwork(itemData) {
        return { img: "systems/fabulaultima/assets/game-icons/magic-palm.svg" };
    }

    /**
     * @type FUActor
     */
    get actor() {
        return super.actor;
    }

    async roll() {
        if (!this.actor) {
            return;
        }

        if (this.system.offensive) {
            const {check, damage} = this.system;
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
                damage: {
                    roll: damage.roll,
                    bonus: damage.bonus,
                    type: damage.type
                },
                speaker: ChatMessage.implementation.getSpeaker({actor: this.actor})
            });

            await createCheckMessage(rolledCheck);
        } else {
            await ChatMessage.create({
                content: await renderTemplate(Templates.chatSpell, {
                    system: this.getRollData(),
                    description: await TextEditor.enrichHTML(this.system.description)
                })
            })
        }

    }
}