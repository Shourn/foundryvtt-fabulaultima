import Templates from "../../Templates.mjs";

export class GrantSpellConfig extends FormApplication {

    get template() {
        return Templates.dataAdvancement
    }


    getData(options = {}) {
        return foundry.utils.mergeObject(super.getData(options), {
            json: JSON.stringify(this.object)
        });
    }
}