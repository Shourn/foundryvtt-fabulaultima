import Templates from "../../Templates.mjs";
import {
    affinities,
    attackTypes,
    attributeDice,
    attributes,
    damageTypes,
    rank,
    rollTypes,
    species,
    statusEffects,
    villain
} from "../../Constants.mjs";
import {promptCheck, toObject} from "../../utils/helper.mjs";


const constants = {
    species: toObject(species, value => `FABULA_ULTIMA.species.${value}`),
    rank: toObject(rank, value => `FABULA_ULTIMA.rank.${value}`),
    villain: toObject(villain, value => `FABULA_ULTIMA.villain.${value}`),
    attributeDice: toObject(attributeDice, value => `FABULA_ULTIMA.attributeDice.${value}`),
    attributes: toObject(attributes, value => ({
        short: `FABULA_ULTIMA.attribute.${value}.short`,
        full: `FABULA_ULTIMA.attribute.${value}.full`
    })),
    affinities: toObject(affinities, value => ({
        short: `FABULA_ULTIMA.affinity.${value}.short`,
        full: `FABULA_ULTIMA.affinity.${value}.full`
    })),
    attackTypes: toObject(attackTypes, value => `FABULA_ULTIMA.attackType.${value}`),
    rollVariables: toObject(rollTypes, value => `FABULA_ULTIMA.rollVariables.${value}`),
    damageTypes: toObject(damageTypes, value => `FABULA_ULTIMA.damageType.${value}`),
    statusEffects: toObject(statusEffects, value => `FABULA_ULTIMA.statusEffect.${value}`)
};


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
        let data = super.getData(options);
        const object = foundry.utils.mergeObject({constants, system: data.actor.system}, data);
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