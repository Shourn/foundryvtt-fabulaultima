import * as Translations from "./Translations.mjs"

const Templates = {
    // Add paths to "systems/fabulaultima/templates"
    actorCharacter: "systems/fabulaultima/templates/actor/actor_character.hbs",
    actorNpc: "systems/fabulaultima/templates/actor/actor_npc.hbs",
    itemWeapon: "systems/fabulaultima/templates/item/item_weapon.hbs",
    itemAttack: "systems/fabulaultima/templates/item/item_attack.hbs",
    chatAttack: "systems/fabulaultima/templates/chat/chat_attack.hbs",
    dialogCheck: "systems/fabulaultima/templates/dialog/dialog_check.hbs",
    itemSpell: "systems/fabulaultima/templates/item/item_spell.hbs",
    chatSpell: "systems/fabulaultima/templates/chat/chat_spell.hbs"
};

const Partials = {
    check: "systems/fabulaultima/templates/partials/partial_check.hbs",
    checkConfig: "systems/fabulaultima/templates/partials/partial_check_config.hbs",
    damage: "systems/fabulaultima/templates/partials/partial_damage.hbs",
    damageConfig: "systems/fabulaultima/templates/partials/partial_damage_config.hbs",
    // affinities: "",
    affinitiesConfig: "systems/fabulaultima/templates/partials/partial_affinities_config.hbs",
    spellDisplay: "systems/fabulaultima/templates/partials/partial_spell_display.hbs",
    attackDisplay: "systems/fabulaultima/templates/partials/partial_attack_display.hbs"
}

export default Templates

export async function preloadTemplates() {

    for (let key in Translations) {
        const translation = Translations[key];
        const helper = `fu-${key}`;
        Handlebars.registerHelper(helper, () => {
            console.log(helper, translation)
            return translation;
        })
    }

    const templates = await loadTemplates(Object.values(Templates));
    const partials = await loadTemplates(Partials);
    return [...templates, ...partials];

}
