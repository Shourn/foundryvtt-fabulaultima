const Templates = {
    // Add paths to "systems/fabulaultima/templates"
    actorCharacter: "systems/fabulaultima/templates/actor_character.hbs",
    actorNpc: "systems/fabulaultima/templates/actor_npc.hbs",
    itemWeapon: "systems/fabulaultima/templates/item_weapon.hbs"
};

const Partials = {
    resources: "systems/fabulaultima/templates/partials/character_resources.hbs",
    attributeSelect: "systems/fabulaultima/templates/partials/attribute_select.hbs"
}

export default Templates

export async function preloadTemplates() {

    Handlebars.registerHelper("fu-id", function (prefix, options) {
        if (typeof prefix !== "string"){
            throw new TypeError("")
        }
        let context = options.data;
        while (context) {
            if (context.root.document?._id) {
                return prefix + "-" + context.root.document._id;
            }
            context = context._parent;
        }
    })

    Handlebars.registerHelper("fu-die-size", function (dieSize) {
        return HandlebarsHelpers.localize(`FABULA_ULTIMA.dieSize.${dieSize}`, {})
    })

    const templates = await loadTemplates(Object.values(Templates));
    const partials = await loadTemplates(Partials);
    return [...templates, ...partials];

}
