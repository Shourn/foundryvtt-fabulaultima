/**
 * @typedef CheckAttribute
 * @property {Attribute} attribute
 * @property {AttributeDie} dice
 */
/**
 * @typedef CheckData
 * @property {CheckAttribute} attr1
 * @property {CheckAttribute} attr2
 * @property {number} modifier
 */

import {FLAGS, SYSTEM_ID} from "../System.mjs";
import Templates from "../Templates.mjs";
import {Character} from "../actor/character/Character.mjs";
import {Npc} from "../actor/npc/Npc.mjs";
import {attributes as Attributes} from "../Constants.mjs";
import {toObject} from "../utils/helper.mjs";

/**
 * @type CheckData
 */
const check = {
    attr1: {
        attribute: "might",
        dice: "d8"
    },
    attr2: {
        attribute: "insight",
        dice: "d8"
    },
    modifier: 1
}

/**
 * @typedef CheckResult
 * @property {number} attr1
 * @property {number} attr2
 * @property {number} modifier
 * @property {number} total
 * @property {boolean} fumble
 * @property {boolean} crit
 * @property {Roll} roll
 */
/**
 * @type CheckResult
 */
const result = {
    attr1: 5,
    attr2: 3,
    modifier: 1,
    total: 9,
    fumble: false,
    crit: false,
    roll: Roll
}

/**
 * @typedef CheckReroll
 * @property {"identity" | "theme" | "origin" | "trait"} trait
 * @property {string} value
 * @property {"attr1" | "attr2" | ("attr1"| "attr2")[] } selection
 */
/**
 * @type CheckReroll
 */
const reroll = {
    trait: "origin",
    value: "The Moon",
    selection: ["attr1", "attr2"]
}

/**
 * @typedef CheckPush
 * @property {Bond} bond
 * @property {number} modifier
 */
/**
 * @type CheckPush
 */
const push = {
    bond: {
        with: "Best Friend",
        feeling1: "none",
        feeling2: "loyalty",
        feeling3: "affection"
    },
    modifier: 2
}

/**
 * @typedef CheckParams
 * @property {CheckData} check
 * @property {CheckResult?} result
 * @property {CheckReroll?} reroll
 * @property {ChatSpeakerData} [speaker]
 */

/**
 * @param {CheckParams} params
 * @returns {Promise<CheckParams>}
 */
export async function rollCheck(params) {
    const check = params.check;

    const attribute1 = check.attr1;
    const attribute2 = check.attr2;
    const modifier = check.modifier;
    const modPart = `${modifier ? `${modifier < 0 ? "-" : "+"} ${Math.abs(modifier)}` : ""}`
    const formula = `${attribute1.dice}[${attribute1.attribute}] + ${attribute2.dice}[${attribute2.attribute}] ${modPart}`;
    /** @type Roll */
    const roll = await new Roll(formula).roll();

    /** @type number */
    const roll1 = roll.dice[0].total;
    /** @type number */
    const roll2 = roll.dice[1].total;
    /** @type CheckResult */
    const result = {
        attr1: roll1,
        attr2: roll2,
        modifier: modifier,
        total: roll.total,
        fumble: roll1 === 1 && roll2 === 1,
        crit: roll1 === roll2 && roll1 >= 6 && roll2 >= 6,
        roll: roll
    }

    return {
        ...params,
        result: result
    }
}

/**
 * @param {CheckParams} params
 * @param {CheckReroll} reroll
 * @returns {Promise<CheckParams>}
 */
export async function rerollCheck(params, reroll) {

    const check = params.check;

    const attribute1 = check.attr1;
    const attribute2 = check.attr2;
    const modifier = check.modifier;
    const modPart = `${modifier ? `${modifier < 0 ? "-" : "+"} ${Math.abs(modifier)}` : ""}`

    let attribute1Part
    const rerollAttr1 = reroll.selection === "attr1" || (Array.isArray(reroll.selection) && reroll.selection.includes("attr1"));
    if (rerollAttr1) {
        attribute1Part = `${attribute1.dice}[${attribute1.attribute}]`;
    } else {
        attribute1Part = `${params.result.attr1}[${attribute1.attribute}]`
    }

    let attribute2Part
    const rerollAttr2 = reroll.selection === "attr2" || (Array.isArray(reroll.selection) && reroll.selection.includes("attr2"));
    if (rerollAttr2) {
        attribute2Part = `${attribute2.dice}[${attribute2.attribute}]`;
    } else {
        attribute2Part = `${params.result.attr2}[${attribute2.attribute}]`
    }

    const formula = `${attribute1Part} + ${attribute2Part} ${modPart}`;
    /** @type Roll */
    const roll = await new Roll(formula).roll();

    /** @type number */
    let roll1 = params.result.attr1;
    /** @type number */
    let roll2 = params.result.attr2;

    if (rerollAttr1 && rerollAttr2) {
        roll1 = roll.dice[0].total;
        roll2 = roll.dice[1].total;
    } else if (rerollAttr1) {
        roll1 = roll.dice[0].total;
    } else if (rerollAttr2) {
        roll2 = roll.dice[0].total;
    }

    /** @type CheckResult */
    const result = {
        attr1: roll1,
        attr2: roll2,
        modifier: modifier,
        total: roll.total,
        fumble: roll1 === 1 && roll2 === 1,
        crit: roll1 === roll2 && roll1 >= 6 && roll2 >= 6,
        roll: roll
    }

    return {
        ...params,
        result,
        reroll
    }
}

/**
 * @param {jQuery} html
 * @param {ContextMenuEntry[]} options
 */
export function addRerollContextMenuEntries(html, options) {
    // Character reroll
    options.unshift({
        name: "FABULA_ULTIMA.chat.context.reroll.fabula",
        icon: '<i class="fas fa-dice"></i>',
        group: SYSTEM_ID,
        condition: li => {
            const messageId = li.data("messageId");
            /** @type ChatMessage | undefined */
            const message = game.messages.get(messageId);
            return message && message.isRoll && message.getFlag(SYSTEM_ID, FLAGS.CheckParams) && ChatMessage.getSpeakerActor(message.speaker) instanceof Character
        },
        callback: async li => {
            const messageId = li.data("messageId");
            /** @type ChatMessage | undefined */
            const message = game.messages.get(messageId);
            if (message) {
                const checkParams = message.getFlag(SYSTEM_ID, FLAGS.CheckParams);
                const rerollParams = await getRerollParams(checkParams, ChatMessage.getSpeakerActor(message.speaker));
                if (rerollParams) {
                    const newMessage = await rerollCheck(checkParams, rerollParams)
                    await createCheckMessage(newMessage)
                }
            }
        }
    })

    // Villain reroll
    options.unshift({
        name: "FABULA_ULTIMA.chat.context.reroll.ultima",
        icon: '<i class="fas fa-dice"></i>',
        group: SYSTEM_ID,
        condition: li => {
            const messageId = li.data("messageId");
            /** @type ChatMessage | undefined */
            const message = game.messages.get(messageId);
            const speakerActor = ChatMessage.getSpeakerActor(message.speaker);
            return message && message.isRoll && message.getFlag(SYSTEM_ID, FLAGS.CheckParams) && speakerActor instanceof Npc && speakerActor.system.isVillain
        },
        callback: async li => {
            const messageId = li.data("messageId");
            /** @type ChatMessage | undefined */
            const message = game.messages.get(messageId);
            if (message) {
                const checkParams = message.getFlag(SYSTEM_ID, FLAGS.CheckParams);
                const rerollParams = await getRerollParams(checkParams, ChatMessage.getSpeakerActor(message.speaker));
                if (rerollParams) {
                    const newMessage = await rerollCheck(checkParams, rerollParams)
                    await createCheckMessage(newMessage)
                }
            }
        }
    })
}

/**
 *
 * @param {CheckParams} params
 * @param {Actor} actor
 * @returns {Promise<CheckReroll | undefined>}
 */
async function getRerollParams(params, actor) {
    const traits = [];
    if (actor instanceof Character) {
        Object.entries(actor.system.traits)
            .map(([trait, value]) => ({type: trait, value: value}))
            .forEach(trait => traits.push(trait));
    }
    if (actor instanceof Npc) {
        actor.system.traits.map(trait => ({type: "trait", value: trait}))
            .forEach(trait => traits.push(trait))
    }

    const attr1 = {
        ...params.check.attr1,
        result: params.result.attr1
    }

    const attr2 = {
        ...params.check.attr2,
        result: params.result.attr2
    }

    /** @type CheckReroll */
    const reroll = await Dialog.prompt({
        title: game.i18n.localize("FABULA_ULTIMA.dialog.reroll.title"),
        label: game.i18n.localize("FABULA_ULTIMA.dialog.reroll.label"),
        content: await renderTemplate(Templates.dialogCheckReroll, {traits, attr1, attr2}),
        options: {classes: ["dialog-reroll"]},
        /** @type {(jQuery) => CheckReroll} */
        callback: (html) => {

            const trait = html.find("input[name=trait]:checked");

            const selection = html.find("input[name=results]:checked")
                .map((_, el) => el.value)
                .get();


            return {
                trait: trait.val(),
                value: trait.data("value"),
                selection: selection
            }
        }
    })

    if (!reroll.trait) {
        ui.notifications.error("FABULA_ULTIMA.dialog.reroll.missingTrait", {localize: true})
        return;
    }

    if (!reroll.selection || !reroll.selection.length) {
        ui.notifications.error("FABULA_ULTIMA.dialog.reroll.missingDice", {localize: true})
        return;
    }

    return reroll;
}

export async function createCheckMessage(checkParams) {

    /** @type Partial<ChatMessageData> */
    const chatMessage = {
        content: await renderTemplate(Templates.chatCheck, checkParams),
        rolls: [checkParams.result.roll],
        type: CONST.CHAT_MESSAGE_TYPES.ROLL,
        speaker: checkParams.speaker,
        flags: {
            [SYSTEM_ID]: {
                [FLAGS.CheckParams]: checkParams
            }
        }
    }

    return ChatMessage.create(chatMessage);
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
        const attributes = actor.system.attributes;
        const checkConfig = await Dialog.wait({
            title: game.i18n.localize("FABULA_ULTIMA.dialog.check.title"),
            content: await renderTemplate(Templates.dialogCheckConfig, {
                attributes: toObject(Attributes, value => `FABULA_ULTIMA.attribute.${value}.short`),
                attributeValues: Object.entries(attributes).reduce((previousValue, [attribute, {current}]) => ({
                    ...previousValue,
                    [attribute]: current
                }), {}),
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

        const speaker = ChatMessage.implementation.getSpeaker({actor});

        const rolledCheck = await rollCheck({
            check: {
                attr1: {
                    attribute: checkConfig.attr1,
                    dice: attributes[checkConfig.attr1].current
                },
                attr2: {
                    attribute: checkConfig.attr2,
                    dice: attributes[checkConfig.attr2].current
                },
                modifier: checkConfig.modifier
            },
            speaker: speaker
            //TODO: Difficulty
        });


        return await createCheckMessage(rolledCheck);
    } catch (e) {
        console.log(e)
        // TODO
    }
}