import Templates from "../../Templates.mjs";

/**
 * @extends {FormApplication}
 * @property {Skill} object
 */
export class SkillSheet extends FormApplication {

    #skillId
    #job

    constructor(skill, options={}) {
        super(skill, options);
        this.#skillId = skill.id;
        this.#job = skill.job;
    }

    static get defaultOptions() {
        const defaultOptions = super.defaultOptions;
        return foundry.utils.mergeObject(defaultOptions, {
            classes: [...defaultOptions.classes, "fabula-ultima", "sheet"],
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

    /**
     * @type Skill
     */
    get skill(){
        return this.#job.skills[this.#skillId]
    }

    async getData() {
        const skill = this.skill;
        return {
            skill,
            enrichedHtml: {
                description: await TextEditor.enrichHTML(skill.description, {rollData: skill.getRollData()})
            }
        };
    }

    async _updateObject(event, formData) {
        this.skill.update(formData)
    }


    render(force = false, options = {}) {
        this.skill.apps[this.appId] = this;
        return super.render(force, options);
    }

    async close(options = {}) {
        delete this.skill.apps[this.appId]
        return super.close(options);
    }

}