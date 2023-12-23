import {preloadTemplates} from "./Templates.mjs";
import {CharacterData} from "./actor/character/CharacterData.mjs";
import {NpcData} from "./actor/npc/NpcData.mjs";
import {ActorProxy} from "./actor/ActorProxy.mjs";
import {CharacterSheet} from "./actor/character/CharacterSheet.mjs";
import {NpcSheet} from "./actor/npc/NpcSheet.mjs";
import {ItemProxy} from "./item/ItemProxy.mjs";
import {SpellData} from "./item/spell/SpellData.mjs";
import {SpellSheet} from "./item/spell/SpellSheet.mjs";
import {SYSTEM_ID} from "./System.mjs";
import {AccessoryData} from "./item/accessory/AccessoryData.mjs";
import {AccessorySheet} from "./item/accessory/AccessorySheet.mjs";
import {WeaponData} from "./item/weapon/WeaponData.mjs";
import {WeaponSheet} from "./item/weapon/WeaponSheet.mjs";
import {ArmorData} from "./item/armor/ArmorData.mjs";
import {JobData} from "./item/job/JobData.js";
import {MiscItemData} from "./item/misc/MiscItemData.mjs";
import {ShieldData} from "./item/shield/ShieldData.mjs";
import {SkillData} from "./item/skill/SkillData.mjs";
import {JobSheet} from "./item/job/JobSheet.js";
import {ArmorSheet} from "./item/armor/ArmorSheet.mjs";
import {MiscItemSheet} from "./item/misc/MiscItemSheet.mjs";
import {ShieldSheet} from "./item/shield/ShieldSheet.mjs";
import {SkillSheet} from "./item/skill/SkillSheet.mjs";
import {initStatusEffects} from "./StatusEffects.mjs";
import {addRerollContextMenuEntries, createCheckMessage, rollCheck} from "./checks/Checks.mjs";

function initActors() {
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
}

function initItems() {
    CONFIG.Item.documentClass = ItemProxy;

    foundry.utils.mergeObject(CONFIG.Item.dataModels, {
        accessory: AccessoryData,
        armor: ArmorData,
        job: JobData,
        misc: MiscItemData,
        shield: ShieldData,
        skill: SkillData,
        spell: SpellData,
        weapon: WeaponData
    }, {inplace: true})

    foundry.utils.mergeObject(CONFIG.Item.typeLabels, {
        accessory: "FABULA_ULTIMA.itemType.accessory",
        armor: "FABULA_ULTIMA.itemType.armor",
        job: "FABULA_ULTIMA.itemType.job",
        misc: "FABULA_ULTIMA.itemType.misc",
        shield: "FABULA_ULTIMA.itemType.shield",
        skill: "FABULA_ULTIMA.itemType.skill",
        spell: "FABULA_ULTIMA.itemType.spell",
        weapon: "FABULA_ULTIMA.itemType.weapon"
    }, {inplace: true})

    // noinspection JSCheckFunctionSignatures
    Items.registerSheet(SYSTEM_ID, AccessorySheet, {
        types: ["accessory"],
        makeDefault: true,
        label: "FabulaUltima.DefaultAccessory"
    })

    // noinspection JSCheckFunctionSignatures
    Items.registerSheet(SYSTEM_ID, ArmorSheet, {
        types: ["armor"],
        makeDefault: true,
        label: "FabulaUltima.DefaultArmor"
    })

    // noinspection JSCheckFunctionSignatures
    Items.registerSheet(SYSTEM_ID, JobSheet, {
        types: ["job"],
        makeDefault: true,
        label: "FabulaUltima.DefaultJob"
    })

    // noinspection JSCheckFunctionSignatures
    Items.registerSheet(SYSTEM_ID, MiscItemSheet, {
        types: ["misc"],
        makeDefault: true,
        label: "FabulaUltima.DefaultMisc"
    })

    // noinspection JSCheckFunctionSignatures
    Items.registerSheet(SYSTEM_ID, ShieldSheet, {
        types: ["shield"],
        makeDefault: true,
        label: "FabulaUltima.DefaultShield"
    })

    // noinspection JSCheckFunctionSignatures
    Items.registerSheet(SYSTEM_ID, SkillSheet, {
        types: ["skill"],
        makeDefault: true,
        label: "FabulaUltima.DefaultSkill"
    })

    // noinspection JSCheckFunctionSignatures
    Items.registerSheet(SYSTEM_ID, SpellSheet, {
        types: ["spell"],
        makeDefault: true,
        label: "FabulaUltima.DefaultSpell"
    })

    // noinspection JSCheckFunctionSignatures
    Items.registerSheet(SYSTEM_ID, WeaponSheet, {
        types: ["weapon"],
        makeDefault: true,
        label: "FabulaUltima.DefaultWeapon"
    })

}

Hooks.once('init', async () => {
    console.log('fabulaultima | Initializing fabulaultima');
    // Preload Handlebars templates
    console.log('fabulaultima | Preloading templates');
    await preloadTemplates();
    // Register custom sheets (if any)
    console.log('fabulaultima | Initializing actors');
    initActors();

    console.log('fabulaultima | Initializing items');
    initItems();

    console.log('fabulaultima | Initializing status effects');
    CONFIG.ActiveEffect.legacyTransferral = false;
    initStatusEffects()

    console.log('fabulaultima | Initializing rolls');

    Hooks.on('getChatLogEntryContext', addRerollContextMenuEntries);

    console.log('fabulaultima | Finished initialization');
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
