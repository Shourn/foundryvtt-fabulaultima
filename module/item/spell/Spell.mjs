import Templates from "../../Templates.mjs";
import {createCheckMessage, rollCheck} from "../../checks/Checks.mjs";

/**
 * @property {SpellData} system
 */
export class Spell extends Item {

    static getDefaultArtwork(itemData) {
        return {img: "systems/fabulaultima/assets/game-icons/magic-palm.svg"};
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
            const {cost, costType, maxTargets, targetType, duration, effect, opportunity, check, damage} = this.system;
            const attributes = this.actor.system.attributes;

            /** @type CheckTarget[] */
            const targets = [...game.user.targets]
                .filter(token => !!token.actor)
                .map(token => ({
                    name: token.actor.name,
                    uuid: token.actor.uuid,
                    difficulty: token.actor.system.defenses.magicDefense.current
                }));

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
                spell: {
                    name: this.name,
                    uuid: this.uuid,
                    img: this.img,
                    cost,
                    costType,
                    maxTargets,
                    targetType,
                    duration,
                    effect,
                    opportunity
                },
                damage: {
                    roll: damage.roll,
                    bonus: damage.bonus,
                    type: damage.type
                },
                targets: targets,
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