import Templates from "../../Templates.mjs";
import {Spell} from "../spell/Spell.mjs";
import {Skill} from "../skill/Skill.mjs";


export class JobSheet extends ItemSheet {

    static get defaultOptions() {
        const defaultOptions = super.defaultOptions;
        return foundry.utils.mergeObject(defaultOptions, {
            tabs: [{navSelector: ".tabs", contentSelector: ".tab-container"}],
            classes: [...defaultOptions.classes, "fabula-ultima", "item-job"],
            dragDrop: [{
                dropSelector: "form",
            }]
        });
    }

    get template() {
        return Templates.itemJob;
    }


    /**
     * @returns {Job}
     */
    get item() {
        return super.item;
    }

    async getData(options = {}) {
        const data = super.getData(options);
        return foundry.utils.mergeObject(data, {
            system: data.item.system,
            enrichedHtml: {
                description: await TextEditor.enrichHTML(data.item.system.description),
                questions: await TextEditor.enrichHTML(data.item.system.questions)
            }
        });
    }

    activateListeners(html) {
        super.activateListeners(html);

        html.find("[data-action=delete][data-type=item]").click(event => this.deleteItem(event))
        html.find("[data-action=delete][data-type=item]").click(event => this.deleteItem(event))

    }

    async deleteItem(event) {
        const itemId = $(event.currentTarget).parents("[data-item-id]").data("itemId");
        const item = Item.get(itemId);
        if (item instanceof Skill) {
            await this.item.system.removeSkill(itemId);
        }
        if (item instanceof Spell) {
            await this.item.system.removeSpell(itemId);
        }
        this.render(true)
    }

    async _onDrop(event) {
        const dragEventData = TextEditor.getDragEventData(event);
        const document = await fromUuid(dragEventData.uuid);

        if (document instanceof Skill) {
            await this.item.system.addSkill(document);
        }

        if (document instanceof Spell) {
            await this.item.system.addSpell(document)
        }

        this.render(true)
    }
}