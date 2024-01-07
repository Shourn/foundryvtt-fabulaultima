import Templates from "../../Templates.mjs";
import {getAdvancementTypes} from "./Advancements.mjs";

/**
 * @extends {FormApplication}
 * @property {Skill} object
 */
export class SkillSheet extends FormApplication {

    static get defaultOptions() {
        const defaultOptions = super.defaultOptions;
        return foundry.utils.mergeObject(defaultOptions, {
            classes: [...defaultOptions.classes, "fabula-ultima", "item-armor"],
            tabs: [{navSelector: ".tabs", contentSelector: ".tab-container"}],
            closeOnSubmit: false,
            editable: true,
            sheetConfig: false,
            submitOnChange: true,
            submitOnClose: true
        });
    }

    get template() {
        return Templates.dataSkill;
    }

    async getData(options = {}) {
        const data = super.getData(options);
        return foundry.utils.mergeObject(data, {
            enrichedHtml: {
                description: await TextEditor.enrichHTML(data.object.description)
            }
        });
    }

    /**
     *
     * @param {jQuery} html
     */
    activateListeners(html) {
        super.activateListeners(html);
        html.find("[data-type=advancement][data-action=add]").click(event => this.addAdvancement(event))
        html.find("[data-type=advancement][data-action=edit]").click(event => this.editAdvancement(event))
        html.find("[data-type=advancement][data-action=delete]").click(event => this.deleteAdvancement(event))
    }


    async _updateObject(event, formData) {
        this.object.update(formData)
    }


    render(force = false, options = {}) {
        console.log(this.object.apps[this.appId] = this);
        return super.render(force, options);
    }

    async close(options = {}) {
        delete this.object.apps[this.appId]
        return super.close(options);
    }

    async addAdvancement(event) {
        const advancementTypes = Object.entries(getAdvancementTypes()).map(([key, value]) => ({
            value: key,
            title: value.metadata.title
        }));
        const type = await Dialog.prompt({
            title: game.i18n.localize("FABULA_ULTIMA.job.skill.advancement.title"),
            content: await renderTemplate(Templates.dialogAdvancementType, advancementTypes),
            rejectClose: false,
            callback: html => html.find("select[name=type]").val()
        });

        if (type) {
            const advancement = await this.object.addAdvancement(type);
            if (advancement) {
                new advancement.constructor.metadata.apps.config(advancement).render(true)
            }
        }
    }

    async editAdvancement(event) {
        const advancementId = $(event.currentTarget).parents("[data-advancement-id]").data("advancementId");
        const advancement = this.object.advancementById[advancementId];

        if (advancement){
            new advancement.constructor.metadata.apps.config(advancement).render(true);
        }
    }

    async deleteAdvancement(event) {
        const advancementId = $(event.currentTarget).parents("[data-advancement-id]").data("advancementId");
        await this.object.deleteAdvancement(advancementId)
    }


}