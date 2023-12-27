import Templates from "../../Templates.mjs";

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
        return Templates.itemSkill;
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
    }



    async _updateObject(event, formData) {
        this.object.updateSource(formData)
        const index = this.object.job.system.skills.findIndex(value => value.id === this.object.id);
        const skills = this.object.job.toObject().system.skills;
        skills[index] = this.object.toObject()
        this.object.job.update({"system.skills": skills})
    }
}