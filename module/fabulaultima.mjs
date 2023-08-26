import FUItemSheet from "./item/FUItemSheet.mjs";
import {preloadTemplates} from "./templates.mjs";
import {FUCharacterData} from "./actor/FUCharacterData.mjs";
import {FUNpcData} from "./actor/FUNpcData.mjs";
import {FUActorProxy} from "./actor/FUActorProxy.mjs";
import {FUCharacterSheet} from "./actor/FUCharacterSheet.mjs";
import {FUNpcSheet} from "./actor/FUNpcSheet.mjs";
import {Mutex} from "./utils/Mutex.mjs";

Hooks.once('init', async () => {

    console.log('fabulaultima | Initializing fabulaultima');
    // Preload Handlebars templates
    await preloadTemplates();
    // Register custom sheets (if any)

    CONFIG.Actor.documentClass = FUActorProxy;
    CONFIG.Actor.dataModels.character = FUCharacterData;
    CONFIG.Actor.dataModels.npc = FUNpcData;

    Actors.registerSheet("fabulaultima", FUCharacterSheet, {
        types: ["character"],
        makeDefault: true,
        label: "FabulaUltima.DefaultCharacter"
    });

    Actors.registerSheet("fabulaultima", FUNpcSheet, {
        types: ["npc"],
        makeDefault: true,
        label: "FabulaUltima.DefaultNpc"
    });

    Items.registerSheet("fabulaultima", FUItemSheet, {
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
