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

}