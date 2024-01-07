import {BaseItem} from "../BaseItem.mjs";


/**
 * @property {JobData} system
 * @property {Object.<string,Skill>} skills
 */
export class Job extends BaseItem {

    static getDefaultArtwork(itemData) {
        return {img: "systems/fabulaultima/assets/game-icons/domino-mask.svg"};
    }

    prepareDerivedData() {
        super.prepareDerivedData();
        this.skills = {}
        for (let skill of this.system.skills) {
            this.skills[skill.id] = skill;
        }
    }

    async updateSkill(id, changes, {source = false} = {}) {
        const idx = this.system.skills.findIndex(a => a._id === id);
        if (idx === -1) throw new Error(`Skill with ID ${id} could not be found to update`);

        const skill = this.skills[id];
        skill.updateSource(changes);
        if (source) {
            skill.render();
            return this;
        }

        const skills = this.toObject().system.skills;
        skills[idx] = skill.toObject();
        const updated = await this.update({"system.skills": skills});
        skill.render();
        return updated;

    }

    async deleteSkill(id){
        const idx = this.system.skills.findIndex(value => value.id === id);
        if (idx === -1) throw new Error(`Skill with ID ${id} could not be found to be deleted`)

        await Promise.all(Object.values(this.skills[id].apps).map(value => value.close()))

        const skills = this.toObject().system.skills.toSpliced(idx, 1);
        this.item.update({"system.skills": skills})
        this.render(true)
    }
}