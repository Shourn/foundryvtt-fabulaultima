import Templates from "../../Templates.mjs";
import {activateStatusEffectListeners, extractStatusEffects} from "../../StatusEffects.mjs";
import {promptCheck} from "../../checks/Checks.mjs";


export class NpcSheet extends ActorSheet {

    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            tabs: [{navSelector: ".tabs", contentSelector: ".tab-container"}]
        });
    }

    get template() {
        return Templates.actorNpc;
    }

    async getData(options = {}) {
        const data = super.getData(options);
        return foundry.utils.mergeObject({
            system: data.actor.system, enrichedHtml: {
                description: await TextEditor.enrichHTML(data.actor.system.description)
            },
            statusEffects: extractStatusEffects(this.actor)
        }, data);
    }


    /**
     * @type {Npc}
     */
    get actor() {
        // noinspection JSValidateTypes
        return super.actor;
    }

    activateListeners(html) {
        super.activateListeners(html);

        html.find("*[data-action=create][data-type=weapon]").click((event) => this.createItem(event, "weapon"))
        html.find("*[data-action=create][data-type=spell]").click((event) => this.createItem(event, "spell"))
        html.find("*[data-action=roll][data-type=item]").click(clickEvent => this.rollItem(clickEvent));
        html.find("*[data-action=edit][data-type=item]").click(clickEvent => this.editItem(clickEvent));
        html.find("*[data-action=delete][data-type=item]").click(clickEvent => this.deleteItem(clickEvent));
        html.find("*[data-action=roll][data-type=check]").click(clickEvent => this.promptCheck(clickEvent));
        html.find("*[data-action=add][data-type=trait]").click(clickEvent => this.addTrait(clickEvent));
        html.find("*[data-action=delete][data-type=trait]").click(clickEvent => this.deleteTrait(clickEvent));

        activateStatusEffectListeners(html, this.actor)
    }

    editItem(clickEvent) {
        const itemId = $(clickEvent.currentTarget).parents("*[data-item-id]").data("itemId");
        this.actor.items.get(itemId).sheet.render(true);
    }

    createItem(event, type) {
        event.preventDefault();

        // Initialize a default name.
        const name = game.i18n.localize(`FABULA_ULTIMA.itemType.${type}`) || "Unknown";

        // Finally, create the item!
        // noinspection JSCheckFunctionSignatures typecheck gets confused between DOM Document and Foundry Document
        Item.create({type: type, name: name}, {parent: this.actor, type: type})
            .then(item => this.actor.items.get(item.id).sheet.render(true));
    }

    deleteItem(event) {
        event.preventDefault();
        const itemId = $(event.currentTarget).parents("*[data-item-id]").data("itemId");
        this.actor.items.get(itemId).delete()
    }

    rollItem(event) {
        event.preventDefault();
        const element = event.currentTarget;
        const dataset = element.dataset;
        const itemId = $(event.currentTarget).parents("*[data-item-id]").data("itemId");
        const item = this.actor.items.get(itemId);
        if (item.roll) {
            item.roll();
        }
    }

    async promptCheck(clickEvent) {
        return promptCheck(this.actor)
    }

    async addTrait(clickEvent) {
        const newTrait = await Dialog.prompt({
            title: game.i18n.localize("FABULA_ULTIMA.sheet.npc.traits.dialog.title"),
            label: game.i18n.localize("FABULA_ULTIMA.sheet.npc.traits.dialog.label"),
            content: await renderTemplate(Templates.dialogNpcAddTrait, {}),
            callback: (html) => {
                console.log(html)
                return html.find("input[name=trait]").val();
            }
        });

        if (newTrait && newTrait.trim()) {
            await this.actor.update({system: {traits: [...this.actor.system.traits, newTrait]}})
        } else {
            ui.notifications.warn("FABULA_ULTIMA.npc.traits.dialog.empty", {localize: true})
        }
    }

    async deleteTrait(clickEvent) {
        event.preventDefault()
        console.log(this)
        const index = event.currentTarget.dataset.index;

        const traits = [...this.actor.system.traits].toSpliced(index, 1);
        await this.actor.update({system: {traits: traits}})
    }
}