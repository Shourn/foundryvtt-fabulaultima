import Templates from "../../Templates.mjs";
import {SystemRoll} from "../../roll/SystemRoll.mjs";
import {getDamage} from "../../utils/helper.mjs";

/**
 * @property {AttackData} system
 */
export class Attack extends Item {


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

        const roll = await SystemRoll.rollCheck(this.system.check, this.actor.system.attributes);

        await roll.toMessage({
            speaker: ChatMessage.getSpeaker({actor: this.actor}),
            flavor: this.name + " (HR: " + roll.highRoll + ")",
            content: await renderTemplate(Templates.chatAttack, {
                result: roll,
                damage: getDamage(this.system.damage, roll)
            })
        });

    }

}