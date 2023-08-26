import Templates from "../templates.mjs";

export class FUCharacterSheet extends ActorSheet {
    get template() {
        return Templates.actorCharacter;
    }


    getData(options = {}) {
        const data = super.getData(options);
        return {...data, actor: data.system};
    }

    async _updateObject(event, formData) {
        return super._updateObject(event, formData);
    }
}