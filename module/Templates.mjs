import * as Translations from "./Translations.mjs"

const Templates = {
    // Add paths to "systems/fabulaultima/templates"
    actorCharacter: "systems/fabulaultima/templates/actor/actor_character.hbs",
    actorNpc: "systems/fabulaultima/templates/actor/actor_npc.hbs",
    chatAttack: "systems/fabulaultima/templates/chat/chat_attack.hbs",
    chatCheck: "systems/fabulaultima/templates/chat/chat_check.hbs",
    chatSpell: "systems/fabulaultima/templates/chat/chat_spell.hbs",
    dialogAddItem: "systems/fabulaultima/templates/item/dialog_addItem.hbs",
    dialogCheckConfig: "systems/fabulaultima/templates/dialog/dialog_check.hbs",
    itemAccessory: "systems/fabulaultima/templates/item/item_accessory.hbs",
    itemArmor: "systems/fabulaultima/templates/item/item_armor.hbs",
    itemSpell: "systems/fabulaultima/templates/item/item_spell.hbs",
    itemWeapon: "systems/fabulaultima/templates/item/item_weapon.hbs",
    itemJob: "systems/fabulaultima/templates/item/item_job.hbs",
    dataSkill: "systems/fabulaultima/templates/data/data_skill.hbs",
    itemShield: "systems/fabulaultima/templates/item/item_shield.hbs",
    itemMisc: "systems/fabulaultima/templates/item/item_misc.hbs",
    dialogNpcAddTrait: "systems/fabulaultima/templates/dialog/dialog_npc_trait_add.hbs",
    dialogCheckReroll: "systems/fabulaultima/templates/dialog/dialog_check_reroll.hbs",
    dialogCheckPush: "systems/fabulaultima/templates/dialog/dialog_check_push.hbs",
    metaCurrencyTracker: "systems/fabulaultima/templates/ui/metacurrency_tracker.hbs",
    chatExpAward: "systems/fabulaultima/templates/chat/chat_exp_award.hbs",
    combatTracker: "systems/fabulaultima/templates/ui/combat_tracker.hbs",
    dialogFirstTurn: "systems/fabulaultima/templates/dialog/dialog_first_turn.hbs",
    dialogAdvancementType: "systems/fabulaultima/templates/dialog/dialog_advancement_types.hbs",
    dataAdvancement: "systems/fabulaultima/templates/data/data_advancement_grantSpell.hbs"

};

export const Partials = {
    check: "systems/fabulaultima/templates/partials/partial_check.hbs",
    checkConfig: "systems/fabulaultima/templates/partials/partial_check_config.hbs",
    damage: "systems/fabulaultima/templates/partials/partial_damage.hbs",
    damageConfig: "systems/fabulaultima/templates/partials/partial_damage_config.hbs",
    // affinities: "",
    affinitiesConfig: "systems/fabulaultima/templates/partials/partial_affinities_config.hbs",
    spellDisplay: "systems/fabulaultima/templates/partials/partial_spell_display.hbs",
    weaponDisplay: "systems/fabulaultima/templates/partials/partial_weapon_display.hbs",
    attributeConfig: "systems/fabulaultima/templates/partials/partial_attribute_config.hbs",
    weaponEquipment: "systems/fabulaultima/templates/partials/partial_equipment_weapon.hbs",
    accessoryEquipment: "systems/fabulaultima/templates/partials/partial_equipment_accessory.hbs",
    armorEquipment: "systems/fabulaultima/templates/partials/partial_equipment_armor.hbs",
    shieldEquipment: "systems/fabulaultima/templates/partials/partial_equipment_shield.hbs",
    statusEffects: "systems/fabulaultima/templates/partials/partial_status_effects.hbs"
}

export default Templates;

export async function preloadTemplates() {

    for (let key in Translations) {
        const translation = Translations[key];
        const helper = `fu-${key}`;
        Handlebars.registerHelper(helper, () => translation)
    }

    Handlebars.registerHelper("fu-abs", (val) => Math.abs(val))

    const templates = await loadTemplates(Object.values(Templates));
    const partials = await loadTemplates(Partials);
    return [...templates, ...partials];

}
