import {SystemRoll} from "../../roll/SystemRoll.mjs";
import Templates from "../../Templates.mjs";

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

            const roll = await SystemRoll.rollCheck(this.actor, this.system.check.attr1, this.system.check.attr2, this.system.check.bonus);
            await roll.roll();

            await roll.toMessage({
                speaker: ChatMessage.getSpeaker({actor: this.actor}),
                flavor: this.name + " (HR: " + roll.highRoll + ")",
                content: await renderTemplate(Templates.chatSpell, {
                    result: roll,
                    damage: this.getDamage(this.actor, roll),
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