import {SystemRoll} from "../../roll/SystemRoll.mjs";
import Templates from "../../Templates.mjs";
import {getDamage} from "../../utils/helper.mjs";

/**
 * @property {SpellData} system
 */
export class Spell extends Item {

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

            const roll = await SystemRoll.rollCheck(this.system.check, this.actor.system.attributes);

            await roll.toMessage({
                speaker: ChatMessage.getSpeaker({actor: this.actor}),
                flavor: this.name + " (HR: " + roll.highRoll + ")",
                content: await renderTemplate(Templates.chatSpell, {
                    result: roll,
                    damage: getDamage(this.system.damage, roll),
                    system: this.getRollData(),
                    description: await TextEditor.enrichHTML(this.system.description)
                })
            });
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