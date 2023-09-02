import {preloadTemplates} from "./Templates.mjs";
import {CharacterData} from "./actor/character/CharacterData.mjs";
import {NpcData} from "./actor/npc/NpcData.mjs";
import {ActorProxy} from "./actor/ActorProxy.mjs";
import {CharacterSheet} from "./actor/character/CharacterSheet.mjs";
import {NpcSheet} from "./actor/npc/NpcSheet.mjs";
import {ItemProxy} from "./item/ItemProxy.mjs";
import {AttackData} from "./item/attack/AttackData.mjs";
import {SystemRoll} from "./roll/SystemRoll.mjs";
import {AttackSheet} from "./item/attack/AttackSheet.mjs";
import {SpellData} from "./item/spell/SpellData.mjs";
import {SpellSheet} from "./item/spell/SpellSheet.mjs";
import {SYSTEM_ID} from "./System.mjs";

console.log("at least something is happening")

Hooks.once('init', async () => {
    console.log('fabulaultima | Initializing fabulaultima');
    // Preload Handlebars templates
    await preloadTemplates();
    // Register custom sheets (if any)

    CONFIG.Actor.documentClass = ActorProxy;
    CONFIG.Actor.dataModels.character = CharacterData;
    CONFIG.Actor.dataModels.npc = NpcData;

    // noinspection JSCheckFunctionSignatures
    Actors.registerSheet(SYSTEM_ID, CharacterSheet, {
        types: ["character"],
        makeDefault: true,
        label: "FabulaUltima.DefaultCharacter"
    });

    // noinspection JSCheckFunctionSignatures
    Actors.registerSheet(SYSTEM_ID, NpcSheet, {
        types: ["npc"],
        makeDefault: true,
        label: "FabulaUltima.DefaultNpc"
    });

    CONFIG.Item.documentClass = ItemProxy;
    CONFIG.Item.dataModels.attack = AttackData;
    CONFIG.Item.dataModels.spell = SpellData;

    // noinspection JSCheckFunctionSignatures
    Items.registerSheet(SYSTEM_ID, AttackSheet, {
        types: ["attack"],
        makeDefault: true,
        label: "FabulaUltima.DefaultAttack"
    })

    // noinspection JSCheckFunctionSignatures
    Items.registerSheet(SYSTEM_ID, SpellSheet, {
        types: ["spell"],
        makeDefault: true,
        label: "FabulaUltima.DefaultSpell"
    })

    CONFIG.Dice.rolls.push(SystemRoll)

});
// Setup system
Hooks.once('setup', async () => {
    // Do anything after initialization but before
    // ready
});
// When ready
Hooks.once('ready', async () => {
    // Do anything once the system is ready
});
// Add any additional hooks if necessary
