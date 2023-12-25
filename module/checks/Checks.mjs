import {FLAGS, SYSTEM_ID} from "../System.mjs";
import Templates from "../Templates.mjs";
import {Character} from "../actor/character/Character.mjs";
import {Npc} from "../actor/npc/Npc.mjs";
import {attributes as Attributes} from "../Constants.mjs";
import {toObject} from "../utils/helper.mjs";

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
 * @property {number} [push]
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
    push: 2,
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
 * @property {string} with
 * @property {("admiration"|"inferiority"|"loyalty"|"mistrust"|"affection"|"hatred")[]} feelings
 * @property {number} strength
 */
/**
 * @type CheckPush
 */
const push = {
    with: "Best Friend",
    feelings: ["loyalty", "affection"],
    strength: 2
}

/**
 * @typedef CheckWeapon
 * @property {string} name
 * @property {string} quality
 * @property {WeaponCategory} category
 * @property {AttackType} attackType
 * @property {Defense} defense
 * @property {string} uuid
 */
/**
 * @type CheckWeapon
 */
const weapon = {
    name: "Excalibird",
    quality: "multi(2)",
    category: "sword",
    attackType: "melee",
    defense: "defense",
    uuid: ""
}

/**
 * @typedef CheckSpell
 * @property {string} name
 * @property {number} cost
 * @property {CostType} costType
 * @property {number} maxTargets
 * @property {TargetType} targetType
 * @property {Duration} duration
 * @property {string} effect
 * @property {string} opportunity
 * @property {string} uuid
 */
/**
 * @type CheckSpell
 */
const spell = {
    name: "Flare",
    cost: 50,
    costType: "total",
    maxTargets: 3,
    targetType: "creature",
    duration: "instant",
    effect: "ignores resistance",
    opportunity: "targets suffer Dazed and Shaken",
    uuid: ""
}

/**
 * @typedef CheckDamage
 * @property {RollType} roll
 * @property {number} bonus
 * @property {DamageType} type
 * @property {number} [total]
 * @property {"attr1" | "attr2"} [attribute]
 */
/**
 * @type CheckDamage
 */
const damage = {
    roll: "highRoll",
    bonus: 7,
    type: "air",
    total: 14,
    attribute: "attr1"
}

/**
 * @typedef CheckParams
 * @property {CheckData} check
 * @property {CheckResult} [result]
 * @property {CheckReroll} [reroll]
 * @property {ChatSpeakerData} [speaker]
 * @property {CheckPush} [push]
 * @property {CheckDamage} [damage]
 * @property {CheckWeapon} [weapon]
 * @property {CheckSpell} [spell]
 */

/**
 * @param {CheckParams} check
 * @returns {Promise<void>}
 */
async function handleRoll(check) {
    const {attr1: attribute1, attr2: attribute2, modifier} = check.check;

    const modPart = `${modifier ? `${modifier < 0 ? "-" : "+"} ${Math.abs(modifier)}` : ""}`
    const formula = `${attribute1.dice}[${attribute1.attribute}] + ${attribute2.dice}[${attribute2.attribute}] ${modPart}`;
    /** @type Roll */
    const roll = await new Roll(formula).roll();

    /** @type number */
    const roll1 = roll.dice[0].total;
    /** @type number */
    const roll2 = roll.dice[1].total;

    check.result = {
        attr1: roll1,
        attr2: roll2,
        modifier: modifier,
        total: roll.total,
        fumble: roll1 === 1 && roll2 === 1,
        crit: roll1 === roll2 && roll1 >= 6 && roll2 >= 6,
        roll: roll
    }
}

/**
 * @param {CheckParams} check
 */
function handleDamage(check) {
    if (check.damage) {
        const {roll, bonus} = check.damage;
        const {attr1, attr2} = check.result;

        const damageRoll = ({
            none: 0,
            lowRoll: Math.min(attr1, attr2),
            highRoll: Math.max(attr1, attr2)
        })[roll]

        const total = damageRoll + bonus
        /** @type {"attr1" | "attr2" | undefined} */
        let attribute = undefined
        if (roll !== "none") {
            attribute = damageRoll === attr1 ? "attr1" : "attr2"
        }

        check.damage = {
            ...check.damage,
            total,
            attribute
        }
    }
}

/**
 * @param {CheckParams} params
 * @returns {Promise<CheckParams>}
 */
export async function rollCheck(params) {
    /** @type CheckParams */
    const check = {...params};

    await handleRoll(check);
    handleDamage(check);

    return check
}

/**
 * @param {CheckParams} check
 * @returns {Promise<void>}
 */
async function handleReroll(check) {

    const {attr1: attribute1, attr2: attribute2, modifier, push} = check.check;
    const selection = check.reroll.selection;

    let {attr1: attr1Result, attr2: attr2Result} = check.result;

    const modPart = `${modifier ? `${modifier < 0 ? "-" : "+"} ${Math.abs(modifier)}` : ""}`
    let attribute1Part
    const rerollAttr1 = selection === "attr1" || (Array.isArray(selection) && selection.includes("attr1"));
    if (rerollAttr1) {
        attribute1Part = `${attribute1.dice}[${attribute1.attribute}]`;
    } else {
        attribute1Part = `${attr1Result}[${attribute1.attribute}]`
    }

    let attribute2Part
    const rerollAttr2 = selection === "attr2" || (Array.isArray(selection) && selection.includes("attr2"));
    if (rerollAttr2) {
        attribute2Part = `${attribute2.dice}[${attribute2.attribute}]`;
    } else {
        attribute2Part = `${attr2Result}[${attribute2.attribute}]`
    }

    let pushPart = ""
    if (check.push) {
        const {strength, with: bond} = check.push;
        pushPart = `+ ${strength}[${bond}]`
    }

    const formula = `${attribute1Part} + ${attribute2Part} ${modPart} ${pushPart}`;
    /** @type Roll */
    const roll = await new Roll(formula).roll();

    if (rerollAttr1 && rerollAttr2) {
        attr1Result = roll.dice[0].total;
        attr2Result = roll.dice[1].total;
    } else if (rerollAttr1) {
        attr1Result = roll.dice[0].total;
    } else if (rerollAttr2) {
        attr2Result = roll.dice[0].total;
    }

    /** @type CheckResult */
    check.result = {
        attr1: attr1Result,
        attr2: attr2Result,
        modifier: modifier,
        push: push,
        total: roll.total,
        fumble: attr1Result === 1 && attr2Result === 1,
        crit: attr1Result === attr2Result && attr1Result >= 6 && attr2Result >= 6,
        roll: roll
    }
}

/**
 * @param {CheckParams} params
 * @param {CheckReroll} reroll
 * @returns {Promise<CheckParams>}
 */
export async function rerollCheck(params, reroll) {
    /** @type CheckParams */
    const check = {...params}

    check.reroll = reroll
    await handleReroll(check);
    handleDamage(check)

    return check
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

    // Character push
    options.unshift({
        name: "FABULA_ULTIMA.chat.context.push",
        icon: '<i class="fas fa-arrow-up-right-dots"></i>',
        group: SYSTEM_ID,
        condition: li => {
            const messageId = li.data("messageId");
            /** @type ChatMessage | undefined */
            const message = game.messages.get(messageId);
            const flag = message.getFlag(SYSTEM_ID, FLAGS.CheckParams);
            return message && message.isRoll && flag && ChatMessage.getSpeakerActor(message.speaker) instanceof Character && !flag.push
        },
        callback: async li => {
            const messageId = li.data("messageId");
            /** @type ChatMessage | undefined */
            const message = game.messages.get(messageId);
            if (message) {
                const checkParams = message.getFlag(SYSTEM_ID, FLAGS.CheckParams);
                const pushParams = await getPushParams(ChatMessage.getSpeakerActor(message.speaker));
                if (pushParams) {
                    const newMessage = await pushCheck(checkParams, pushParams)
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
 * @param {CheckParams} check
 * @returns {Promise<void>}
 */
async function handlePush(check) {
    const {result: oldResult, push} = check;

    const {attr1: {attribute: attribute1}, attr2: {attribute: attribute2}, modifier} = check.check;
    const {attr1: attr1Roll, attr2: attr2Roll} = oldResult;
    const attr1Part = `${attr1Roll}[${attribute1}]`
    const attr2Part = `${attr2Roll}[${attribute2}]`
    const modPart = `${modifier < 0 ? "-" : "+"} ${Math.abs(modifier)}`
    const pushPart = `+ ${push.strength}`
    const roll = await new Roll(`${attr1Part} + ${attr2Part} ${modPart} ${pushPart}`).roll()

    /** @type CheckResult */
    check.result = {
        ...oldResult,
        push: push.strength,
        total: attr1Roll + attr2Roll + modifier + push.strength,
        roll: roll
    }
}

/**
 *
 * @param {CheckParams} params
 * @param {CheckPush} push
 * @returns {Promise<CheckParams>}
 */
async function pushCheck(params, push) {
    /** @type CheckParams */
    const check = {...params};
    check.push = push

    await handlePush(check);

    return check;
}

/**
 *
 * @param {Character} actor
 * @returns {Promise<CheckPush | undefined>}
 */
async function getPushParams(actor) {

    /** @type CheckPush[] */
    const bonds = actor.system.bonds.map(value => {

        const feelings = []
        value.feeling1 !== "none" && feelings.push(value.feeling1)
        value.feeling2 !== "none" && feelings.push(value.feeling2)
        value.feeling3 !== "none" && feelings.push(value.feeling3)

        return ({
            with: value.with,
            feelings: feelings,
            strength: feelings.length
        });
    })

    /** @type CheckPush */
    const push = await Dialog.prompt({
        title: game.i18n.localize("FABULA_ULTIMA.dialog.push.title"),
        label: game.i18n.localize("FABULA_ULTIMA.dialog.push.label"),
        content: await renderTemplate(Templates.dialogCheckPush, {bonds}),
        options: {classes: ["dialog-reroll"]},
        /** @type {(jQuery) => CheckPush} */
        callback: (html) => {
            const index = +html.find("input[name=bond]:checked").val();
            return bonds[index]
        }
    })

    if (!push) {
        ui.notifications.error("FABULA_ULTIMA.dialog.reroll.missingBond", {localize: true})
        return;
    }

    return push;
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

    const flavor = (() => {
       if (checkParams.weapon) {
           return "FABULA_ULTIMA.chat.check.flavor.accuracy"
       }
       if (checkParams.spell){
           return "FABULA_ULTIMA.chat.check.flavor.magic"
       }
       return "FABULA_ULTIMA.chat.check.flavor.default"
    })()

    /** @type Partial<ChatMessageData> */
    const chatMessage = {
        flavor: game.i18n.localize(flavor),
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