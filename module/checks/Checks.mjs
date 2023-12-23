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
 * @property {string} [actor]
 */

const FORMULA = "@attr1.dice[@attr1.attribute] + @attr2.dice[@attr2.attribute] @signum @modifier"

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

    console.log(params, reroll)

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
        name: "FABULA_ULTIMA.chat.context.reroll",
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
                const newMessage = await rerollCheck(message.getFlag(SYSTEM_ID, FLAGS.CheckParams), {
                    trait: "identity",
                    value: "Thirsty Sword Lesbian",
                    selection: "attr1"
                })
                await createCheckMessage(newMessage)
            }
        }
    })

}

export async function createCheckMessage(checkParams) {

    let reroll = checkParams.reroll
    if (checkParams.actor && checkParams.reroll) {
        /** @type Actor | undefined */
        const actor = game.actors.get(checkParams.actor);
        if (actor instanceof Character) {
            reroll = {
                ...reroll,
                traitValue: actor.system.traits[reroll.trait]
            }
        }
    }

    /** @type Partial<ChatMessageData> */
    const chatMessage = {
        content: await renderTemplate(Templates.chatCheck, checkParams),
        rolls: [checkParams.result.roll],
        type: CONST.CHAT_MESSAGE_TYPES.ROLL,
        speaker: {
            actor: checkParams.actor
        },
        flags: {
            [SYSTEM_ID]: {
                [FLAGS.CheckParams]: checkParams
            }
        }
    }

    return ChatMessage.create(chatMessage);
}
