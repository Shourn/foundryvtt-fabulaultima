import Templates from "../../Templates.mjs";

export class CharacterSheet extends ActorSheet {

    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            tabs: [{navSelector: ".tabs", contentSelector: ".tab-container"}]
        });
    }

    get template() {
        return Templates.actorCharacter;
    }

    /**
     * @type {Character}
     */
    get actor() {
        // noinspection JSValidateTypes
        return super.actor;
    }

    getData(options = {}) {
        const data = super.getData(options);
        return foundry.utils.mergeObject(data, {system: data.actor.system});
    }
}