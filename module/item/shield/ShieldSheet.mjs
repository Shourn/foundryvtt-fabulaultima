import Templates from "../../Templates.mjs";

/**
 * @extends {ItemSheet}
 */
export class ShieldSheet extends ItemSheet {

    static get defaultOptions() {
        const defaultOptions = super.defaultOptions;
        return foundry.utils.mergeObject(defaultOptions, {
            classes: [...defaultOptions.classes, "fabula-ultima", "item-armor"],
            tabs: [{navSelector: ".tabs", contentSelector: ".tab-container"}]
        });
    }

    get template() {
        return Templates.itemShield;
    }

    /**
     * @returns {FUActor}
     */
    get actor() {
        return super.actor;
    }

    async getData(options = {}) {
        const data = super.getData(options);
        return foundry.utils.mergeObject(data, {
            system: data.item.system,
            effects: this.item.effects,
            enrichedHtml: {
                description: await TextEditor.enrichHTML(data.item.description)
            }
        });
    }


    /**
     *
     * @param {jQuery} html
     */
    activateListeners(html) {
        super.activateListeners(html);

        html.find("[data-action=add][data-type=effect]").click(event => this.addEffect(event))
        html.find("[data-action=toggle][data-type=effect]").click(event => {
        })
        html.find("[data-action=edit][data-type=effect]").click(event => this.editEffect(event))
        html.find("[data-action=delete][data-type=effect]").click(event => {
        })
    }
}