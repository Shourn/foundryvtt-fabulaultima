import Templates from "../../Templates.mjs";
import {promptCheck} from "../../utils/helper.mjs";


export class NpcSheet extends ActorSheet {

    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            tabs: [{navSelector: ".tabs", contentSelector: ".tab-container"}]
        });
    }

    get template() {
        return Templates.actorNpc;
    }

    getData(options = {}) {
        const data = super.getData(options);
        const object = foundry.utils.mergeObject({system: data.actor.system}, data);
        console.log(object)
        return object;
    }


    /**
     * @type {Npc}
     */
    get actor() {
        // noinspection JSValidateTypes
        return super.actor;
    }
    _getSubmitData(updateData = {}) {
        return super._getSubmitData(updateData);
    }

    activateListeners(html) {
        super.activateListeners(html);

        html.find("*[data-action=create][data-type=item]").click((event) => this.createItem(event))
        html.find("*[data-action=roll][data-type=item]").click(clickEvent => this.rollItem(clickEvent));
        html.find("*[data-action=edit][data-type=item]").click(clickEvent => this.editItem(clickEvent));
        html.find("*[data-action=delete][data-type=item]").click(clickEvent => this.deleteItem(clickEvent));
        html.find("*[data-action=roll][data-type=check]").click(clickEvent => this.promptCheck(clickEvent));

    }

    editItem(clickEvent) {
        const itemId = $(clickEvent.currentTarget).parents("*[data-item-id]").data("itemId");
        this.actor.items.get(itemId).sheet.render(true);
    }

    createItem(event) {
        event.preventDefault();
        const element = event.currentTarget;

        // Grab any data associated with this control.
        const data = {...element.dataset};
        const type = data.documentType;
        delete data.type;
        delete data.action;
        delete data.subtype;

        // Initialize a default name.
        const name = type || "Unknown";

        // Finally, create the item!
        // noinspection JSCheckFunctionSignatures typecheck gets confused between DOM Document and Foundry Document
        Item.create({type: type, name: name, data}, {parent: this.actor, type: type})
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

    promptCheck(clickEvent) {
        promptCheck(this.actor)
            .then(value => console.log(value))
    }
}