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

/**
 * @param {Character, Npc} actor
 * @returns {Promise<ChatMessage|Object>}
 */
export async function promptCheck(actor) {
    const recentChecks = JSON.parse(sessionStorage.getItem(KEY_RECENT_CHECKS) || "{}");
    const recentActorChecks = recentChecks[actor.uuid] || (recentChecks[actor.uuid] = {});
    try {
        const checkConfig = await Dialog.wait({
            title: game.i18n.localize("FABULA_ULTIMA.dialog.check.title"),
            content: await renderTemplate(Templates.dialogCheckConfig, {
                attributes: toObject(attributes, value => `FABULA_ULTIMA.attribute.${value}.short`),
                attributeValues: Object.entries(actor.system.attributes).reduce((previousValue, [attribute, {current}]) => ({...previousValue, [attribute]: current}), {}),
                attr1: recentActorChecks.attr1 || "might",
                attr2: recentActorChecks.attr2 || "might",
                modifier: recentActorChecks.modifier || 0,
                difficulty: recentActorChecks.difficulty || 0
            }),
            buttons: [{
                icon: '<i class="fas fa-dice"></i>',
                label: game.i18n.localize("FABULA_ULTIMA.dialog.check.roll"),
                callback: jQuery => {
                    return {
                        attr1: jQuery.find("*[name=attr1]:checked").val(),
                        attr2: jQuery.find("*[name=attr2]:checked").val(),
                        modifier: +jQuery.find("*[name=modifier]").val(),
                        difficulty: +jQuery.find("*[name=difficulty]").val()
                    }
                }
            }]
        }, {}, {});

        recentActorChecks.attr1 = checkConfig.attr1;
        recentActorChecks.attr2 = checkConfig.attr2;
        recentActorChecks.modifier = checkConfig.modifier;
        recentActorChecks.difficulty = checkConfig.difficulty;
        sessionStorage.setItem(KEY_RECENT_CHECKS, JSON.stringify(recentChecks));

        const roll = await SystemRoll.rollCheck(checkConfig, actor.system.attributes);

        return roll.toMessage({
                speaker: ChatMessage.getSpeaker({actor}),
                content: await renderTemplate(Templates.chatCheck, {
                    result: roll,
                    difficulty: checkConfig.difficulty
                })
            })
    } catch (e) {
        console.log(e)
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
