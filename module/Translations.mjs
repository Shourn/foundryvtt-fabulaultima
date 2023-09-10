import {toObject} from "./utils/helper.mjs";
import * as c from "./Constants.mjs";


export const species = toObject(c.species, value => `FABULA_ULTIMA.species.${value}`);

export const rank = toObject(c.rank, value => `FABULA_ULTIMA.rank.${value}`);

export const villain = toObject(c.villain, value => `FABULA_ULTIMA.villain.${value}`);

export const attributeDice = toObject(c.attributeDice, value => `FABULA_ULTIMA.attributeDice.${value}`);

export const attributes = toObject(c.attributes, value => ({
    short: `FABULA_ULTIMA.attribute.${value}.short`,
    full: `FABULA_ULTIMA.attribute.${value}.full`
}));

export const affinities = toObject(c.affinities, value => ({
    short: `FABULA_ULTIMA.affinity.${value}.short`,
    full: `FABULA_ULTIMA.affinity.${value}.full`
}));

export const attackTypes = toObject(c.attackTypes, value => `FABULA_ULTIMA.attackType.${value}`);

export const rollVariables = toObject(c.rollTypes, value => `FABULA_ULTIMA.rollVariables.${value}`);

export const damageTypes = toObject(c.damageTypes, value => `FABULA_ULTIMA.damageType.${value}`);

export const statusEffects = toObject(c.statusEffects, value => `FABULA_ULTIMA.statusEffect.${value}`);


export const rollTypes = toObject(c.rollTypes, value => ({
    short: `FABULA_ULTIMA.rollType.${value}.short`,
    full: `FABULA_ULTIMA.rollType.${value}.full`,
}))

export const defenses = toObject(c.defenses, value => ({
    short: `FABULA_ULTIMA.defense.${value}.short`,
    full: `FABULA_ULTIMA.defense.${value}.full`
}))

export const statusChoices = toObject(c.statusChoices, value => `FABULA_ULTIMA.statusChoice.${value}`)

export const costTypes = toObject(c.costTypes, value => `FABULA_ULTIMA.costType.${value}`)

export const targetTypes = toObject(c.targetTypes, value => `FABULA_ULTIMA.targetType.${value}`)

export const durations = toObject(c.durations, value => `FABULA_ULTIMA.duration.${value}`)

export const feelings1 = toObject(c.feelings1, value => `FABULA_ULTIMA.feeling.${value}`)

export const feelings2 = toObject(c.feelings2, value => `FABULA_ULTIMA.feeling.${value}`)

export const feelings3 = toObject(c.feelings3, value => `FABULA_ULTIMA.feeling.${value}`)

export const weaponCategories = toObject(c.weaponCategories, value => `FABULA_ULTIMA.weaponCategory.${value}`)