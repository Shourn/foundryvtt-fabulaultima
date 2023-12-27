
export const SYSTEM_ID = "fabulaultima";

export const FLAGS = Object.freeze({
    CheckParams: "CheckParams",
    CombatantsTurnTaken: "CombatantTurnTaken",
    FirstTurn: "FirstTurn",
    CurrentTurn: "CurrentTurn"
})

export const HOOKS = Object.freeze({
    UpdateMetaCurrencyFabula: `${SYSTEM_ID}.updateMetaCurrencyFabula`,
    UpdateMetaCurrencyUltima: `${SYSTEM_ID}.updateMetaCurrencyUltima`,
    GetSystemControlTools: `${SYSTEM_ID}.getSystemControlTools`,
    RegisterAdvancementTypes: `${SYSTEM_ID}.registerAdvancementTypes`
})

export const SETTINGS = Object.freeze({
    MetaCurrencyFabula: "MetaCurrencyFabula",
    MetaCurrencyUltima: "MetaCurrencyUltima"
})