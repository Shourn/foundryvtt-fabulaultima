import Templates from "../../Templates.mjs";
import {Skill} from "./Skill.mjs";
import {SkillSheet} from "./SkillSheet.mjs";


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
        html.find("[data-action=delete][data-type=skill]").click(event => this.deleteSkill(event))
        html.find("[data-action=add][data-type=skill]").click(event => this.addSkill(event))
    }

    async deleteSkill(event) {
        const skillId = $(event.currentTarget).parents("[data-skill-id]").data("skillId");

        const skills = this.item.toObject().system.skills.filter(skill => skill._id !== skillId);

        this.item.update({"system.skills": skills})
        this.render(true)

    }

    async addSkill(event) {
        const skill = new Skill(undefined, {parent: this.item});
        const skills = this.item.toObject().system.skills.concat(skill.toObject())
        await this.item.update({"system.skills": skills})
        const find = this.item.system.skills.find(v => v._id === skill._id);
        new SkillSheet(find, {}).render(true)
    }

}