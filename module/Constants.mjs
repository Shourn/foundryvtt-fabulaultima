/**
 * @typedef {"physical", "air", "bolt", "dark", "earth", "fire", "ice", "light", "poison"} DamageType
 */
/**
 * @type {Readonly<DamageType[]>}
 */
export const damageTypes = Object.freeze(["physical", "air", "bolt", "dark", "earth", "fire", "ice", "light", "poison", "special"]);

/**
 * @typedef {"beast", "construct", "demon", "elemental", "humanoid", "monster", "plant", "undead"} Species
 */
/**
 * @type {Readonly<Species[]>}
 */
export const species = Object.freeze(["beast", "construct", "demon", "elemental", "humanoid", "monster", "plant", "undead"]);

/**
 * @typedef {"might", "willpower", "dexterity", "insight"} Attribute
 */
/**
 * @type {Readonly<Attribute[]>}
 */
export const attributes = Object.freeze(["might", "willpower", "dexterity", "insight"]);

/**
 * @typedef {"melee", "ranged"} AttackType
 */
/**
 * @type {Readonly<string[]>}
 */
export const attackTypes = Object.freeze(["melee", "ranged"]);

/**
 * @typedef {"no", "minor", "major", "supreme"} Villain
 */
/**
 * @type {Readonly<Villain[]>}
 */
export const villain = Object.freeze(["no", "minor", "major", "supreme"]);

/**
 * @typedef {"soldier", "elite", "champion"} Rank
 */
/**
 * @type {Readonly<Rank[]>}
 */
export const rank = Object.freeze(["soldier", "elite", "champion"]);

/**
 * @typedef {"highRoll", "lowRoll", "none"} RollType
 */
/**
 * @type {Readonly<RollType[]>}
 */
export const rollTypes = Object.freeze(["highRoll", "lowRoll", "none"]);

/**
 * @typedef {"dazed", "enraged", "poisoned", "shaken", "slow", "weak"} StatusEffect
 */
/**
 * @type {Readonly<StatusEffect[]>}
 */
export const statusEffects = Object.freeze(["dazed", "enraged", "poisoned", "shaken", "slow", "weak"]);

/**
 * @typedef {"none", "vulnerability", "resistance", "immunity", "absorption"} Affinity
 */
/**
 * @type {Readonly<Affinity[]>}
 */
export const affinities = Object.freeze(["none", "vulnerability", "resistance", "immunity", "absorption"]);

/**
 * @typedef {"d6", "d8", "d10", "d12"} AttributeDie
 */
/**
 * @type {Readonly<AttributeDie[]>}
 */
export const attributeDice = Object.freeze(["d6", "d8", "d10", "d12"])

/**
 * @typedef {"defense", "magicDefense"} Defense
 */
/**
 * @type {Readonly<Defense[]>}
 */
export const defenses = Object.freeze(["defense", "magicDefense"])

/**
 * @typedef {"or", "and"} StatusChoice
 */
/**
 * @type {Readonly<StatusChoice[]>}
 */
export const statusChoices = Object.freeze(["or", "and"])

/**
 * @typedef {"creature", "self", "weapon", "special"} TargetType
 */
/**
 * @type {Readonly<TargetType[]>}
 */
export const targetTypes = Object.freeze(["creature", "self", "weapon", "special"])

/**
 * @typedef {"instant", "scene"} Duration
 */
/**
 * @type {Readonly<Duration[]>}
 */
export const durations = Object.freeze(["instant", "scene"])

/**
 * @typedef {"total", "target"} CostType
 */
/**
 * @type {Readonly<CostType[]>}
 */
export const costTypes = Object.freeze(["total", "target"])

/**
 * @typedef {"none", "admiration", "inferiority"} Feeling1
 */
/**
 * @type {Readonly<Feeling1[]>}
 */
export const feelings1 = Object.freeze(["none", "admiration", "inferiority"])
/**
 * @typedef {"none", "loyalty", "mistrust"} Feeling2
 */
/**
 * @type {Readonly<Feeling2[]>}
 */
export const feelings2 = Object.freeze(["none", "loyalty", "mistrust"])
/**
 * @typedef {"none", "affection", "hatred"} Feeling3
 */
/**
 * @type {Readonly<Feeling3[]>}
 */
export const feelings3 = Object.freeze(["none", "affection", "hatred"])

/**
 * @typedef {"arcane", "bow", "brawling", "dagger", "firearm", "flail", "heavy", "spear", "sword", "thrown", "special"} WeaponCategory
 */
/**
 *
 * @type {Readonly<WeaponCategory[]>}
 */
export const weaponCategories = Object.freeze(["arcane", "bow", "brawling", "dagger", "firearm", "flail", "heavy", "spear", "sword", "thrown", "special"])
