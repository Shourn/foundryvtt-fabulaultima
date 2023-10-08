import Templates from "../Templates.mjs";
import {attributes} from "../Constants.mjs";
import {SystemRoll} from "../roll/SystemRoll.mjs";

/**
 * @param {number} value
 * @param {number} [max]
 * @param {number} [min]
 * @returns {number}
 */
export const clamp = (value, max = Number.MAX_VALUE, min = 0) => Math.min(Math.max(min, value), max);

/**
 * @template {string} T
 * @template R
 * @param {T[]} source
 * @param {(string) => R} getValue
 * @returns {Record<T, R>}
 */
export function toObject(source, getValue) {
    const result = {};

    source.forEach(value => {
        return result[value] = getValue(value);
    })
    return result;
}

const KEY_RECENT_CHECKS = "fabulaultima.recentChecks"

const ROLL_FORMULA = "@attr1[@label1] + @attr2[@label2] + @modifier"


/**
 * @param {Character, Npc} actor
 * @returns {Promise<ChatMessage|Object>}
 */
export async function promptCheck(actor) {
    const recentChecks = JSON.parse(sessionStorage.getItem(KEY_RECENT_CHECKS) || "{}");
    const recentActorChecks = recentChecks[actor.uuid] || (recentChecks[actor.uuid] = {});
    try {
        const result = await Dialog.wait({
            title: game.i18n.localize("FABULA_ULTIMA.dialog.check.title"),
            content: await renderTemplate(Templates.dialogCheck, {
                attributes: toObject(attributes, value => `FABULA_ULTIMA.attribute.${value}.short`),
                attr1: recentActorChecks.attr1 || "might",
                attr2: recentActorChecks.attr2 || "might"
            }),
            buttons: [{
                icon: '<i class="fas fa-dice"></i>',
                label: game.i18n.localize("FABULA_ULTIMA.dialog.check.roll"),
                callback: jQuery => {
                    return {
                        attr1: jQuery.find("*[name=attr1]:checked").val(),
                        attr2: jQuery.find("*[name=attr2]:checked").val(),
                        modifier: jQuery.find("*[name=modifier]").val()
                    }
                }
            }]
        }, {}, {});

        recentActorChecks.attr1 = result.attr1;
        recentActorChecks.attr2 = result.attr2;
        sessionStorage.setItem(KEY_RECENT_CHECKS, JSON.stringify(recentChecks));

        game.i18n.localize(`FABULA_ULTIMA.attribute.${result.attr1}.full`);
        game.i18n.localize(`FABULA_ULTIMA.attribute.${result.attr2}.full`);

        const roll = await SystemRoll.rollCheck(result, actor.system.attributes);

        return roll.toMessage({
                speaker: ChatMessage.getSpeaker({actor}),
                content: await renderTemplate(Templates.chatCheck, {
                    result: roll,
                })
            })
    } catch (e) {
        // TODO
    }
}

/**
 * @param {Damage} damage
 * @param {SystemRoll} roll
 * @returns {{total: number, bonus: number, type: string, base: number}}
 */
export function getDamage(damage, roll) {
    const rollType = damage.roll;
    const base = rollType !== "none" ? roll[rollType] : 0;
    const bonus = damage.bonus;
    return {
        base: base,
        bonus: bonus,
        total: base + bonus,
        type: `FABULA_ULTIMA.damageType.${damage.type}`
    };
}

/**
 *
 * @param {jQuery} jquery
 */
export function registerCollapse(jquery) {
    const collapseTriggers = jquery.find("[data-collapse-toggle]");
    collapseTriggers.click(event => {
        const collapseId = $(event.currentTarget).data("collapseToggle");
        const collapse = jquery.find(`.collapse[data-collapse="${collapseId}"]`);
        collapse.toggleClass("show");
    })
}
