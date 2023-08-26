import ItemSheet from "./item/ItemSheet.mjs";
import {preloadTemplates} from "./Templates.mjs";
import {CharacterData} from "./actor/CharacterData.mjs";
import {NpcData} from "./actor/NpcData.mjs";
import {ActorProxy} from "./actor/ActorProxy.mjs";
import {CharacterSheet} from "./actor/CharacterSheet.mjs";
import {NpcSheet} from "./actor/NpcSheet.mjs";

console.log("at least something is happening")

Hooks.once('init', async () => {
    console.log('fabulaultima | Initializing fabulaultima');
    // Preload Handlebars templates
    await preloadTemplates();
    // Register custom sheets (if any)

    CONFIG.Actor.documentClass = ActorProxy;
    CONFIG.Actor.dataModels.character = CharacterData;
    CONFIG.Actor.dataModels.npc = NpcData;

    Actors.registerSheet("fabulaultima", CharacterSheet, {
        types: ["character"],
        makeDefault: true,
        label: "FabulaUltima.DefaultCharacter"
    });

    Actors.registerSheet("fabulaultima", NpcSheet, {
        types: ["npc"],
        makeDefault: true,
        label: "FabulaUltima.DefaultNpc"
    });

    Items.registerSheet("fabulaultima", ItemSheet, {
        makeDefault: true,
        label: "FabulaUltima.SheetItem"
    });

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
