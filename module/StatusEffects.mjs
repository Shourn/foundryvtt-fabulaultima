/**
 * @type {Object.<string,ActiveEffectData>}
 */
export const StatusEffects = Object.freeze({
    dazed: {
        id: "dazed",
        name: "FABULA_ULTIMA.statusEffect.dazed",
        icon: "icons/svg/daze.svg",
        statuses: new Set(["dazed"])
    }, enraged: {
        id: "enraged",
        name: "FABULA_ULTIMA.statusEffect.enraged",
        icon: "systems/fabulaultima/assets/game-icons/enrage.svg",
        statuses: new Set(["enraged"])
    }, poisoned: {
        id: "poisoned",
        name: "FABULA_ULTIMA.statusEffect.poisoned",
        icon: "icons/svg/poison.svg",
        statuses: new Set(["poisoned"])
    }, shaken: {
        id: "shaken",
        name: "FABULA_ULTIMA.statusEffect.shaken",
        icon: "icons/svg/terror.svg",
        statuses: new Set(["shaken"])
    }, slow: {
        id: "slow",
        name: "FABULA_ULTIMA.statusEffect.slow",
        icon: "icons/svg/net.svg",
        statuses: new Set(["slow"])
    }, weak: {
        id: "weak",
        name: "FABULA_ULTIMA.statusEffect.weak",
        icon: "icons/svg/unconscious.svg",
        statuses: new Set(["weak"])
    }
})

export function initStatusEffects() {
    /**
     * @type {ActiveEffectData[]}
     */
    CONFIG.statusEffects = [...Object.values(StatusEffects)]
}

function toggleStatus(event, actor) {
    const status = event.currentTarget.dataset.status;
    if (actor.statuses.has(status)) {
        const activeEffect = actor.effects.find(effect => effect.statuses.has(status));
        if (activeEffect) {
            activeEffect.delete();
        }
    } else {
        const statusEffect = StatusEffects[status];
        console.log(statusEffect)
        ActiveEffect.create({
            ...statusEffect,
            name: game.i18n.localize(statusEffect.name),
            statuses: [...statusEffect.statuses],
            origin: actor.uuid
        }, {parent: actor})
    }

}

/**
 *
 * @param {jQuery} jquery
 * @param {Actor} actor
 */
export function activateStatusEffectListeners(jquery, actor) {
    jquery.find("[data-status]").click(event => toggleStatus(event, actor))
}

/**
 * @param {Actor} actor
 */
export function extractStatusEffects(actor) {
    return [...actor.statuses].reduce((previousValue, currentValue) => {
        previousValue[currentValue] = true
        return previousValue;
    }, {})

}