import {Job} from "./Job.mjs";
import {AdvancementField, getAdvancementTypes} from "./Advancements.mjs";

/**
 * @extends {DataModel}
 * @property {string} _id
 * @property {string} name
 * @property {string} img
 * @property {string} description
 * @property {number} level
 * @property {number} maxLevel
 * @property {Array.<BaseAdvancement>} advancement
 */
export class Skill extends foundry.abstract.DataModel {


    /**
     * @param {Partial<Skill>} data
     * @param {DataModel} parent
     * @param {*} options
     */
    constructor(data = {}, {parent = null, ...options} = {}) {
        if (parent instanceof Job) parent = parent.system;
        super(data, {...options, parent});

        /**
         * A collection of Application instances which should be re-rendered whenever this document is updated.
         * The keys of this object are the application ids and the values are Application instances. Each
         * Application in this object will have its render method called by {@link Document#render}.
         * @type {Object<Application>}
         */
        Object.defineProperty(this, "apps", {
            value: {},
            writable: false,
            enumerable: false
        });

    }

    static defineSchema() {
        const {
            DocumentIdField,
            StringField,
            FilePathField,
            ArrayField,
            HTMLField,
            NumberField,
            EmbeddedDataField
        } = foundry.data.fields;
        return {
            _id: new DocumentIdField({initial: () => foundry.utils.randomID()}),
            name: new StringField({
                required: true,
                blank: false,
                textSearch: true,
                initial: () => game.i18n.localize("FABULA_ULTIMA.itemType.skill")
            }),
            img: new FilePathField({
                categories: ["IMAGE"],
                initial: "systems/fabulaultima/assets/game-icons/skills.svg"
            }),
            description: new HTMLField(),
            level: new NumberField({initial: 0, integer: true, min: 0}),
            maxLevel: new NumberField({initial: 1, integer: true, min: 1, max: 10}),
            advancement: new ArrayField(new AdvancementField({nullable: false}))
        }
    }

    _initialize(options = {}) {
        super._initialize(options)

        this.advancementById = {}
        for (let advancement of this.advancement) {
            this.advancementById[advancement.id] = advancement;
        }
    }

    get id() {
        return this._id;
    }

    /**
     * @return {Job|null}
     */
    get job() {
        return this.parent.parent || null;
    }

    /**
     * @param changes
     */
    async update(changes) {
        this.job.updateSkill(this.id, changes)
        return this
    }

    /**
     * Render all of the Application instances which are connected to this advancement.
     * @param {boolean} [force=false]     Force rendering
     * @param {object} [context={}]       Optional context
     */
    render(force = false, context = {}) {
        for (const app of Object.values(this.apps)) app.render(force, context);
    }

    /**
     *
     * @param {string} type
     * @return {Promise<BaseAdvancement | void>}
     */
    async addAdvancement(type) {
        const advancementType = getAdvancementTypes()[type];
        if (advancementType) {
            const advancement = new advancementType(undefined, {parent: this});
            const updatedAdvancements = this.toObject().advancement.concat(advancement.toObject());
            await this.update({"advancement": updatedAdvancements})
            this.render()
            return this.advancementById[advancement.id]
        }
    }

    async updateAdvancement(id, changes, {source = false} = {}) {
        const idx = this.advancement.findIndex(a => a._id === id);
        if (idx === -1) throw new Error(`Advancement with ID ${id} could not be found to update`);

        const advancement = this.advancementById[id];
        advancement.updateSource(changes);
        if (source) {
            advancement.render();
            return this;
        }

        const advancements = this.toObject().advancement
        advancements[idx] = advancement.toObject();
        await this.update({"advancement": advancements});
        advancement.render();
        return this;
    }

    async deleteAdvancement(id) {
        const idx = this.advancement.findIndex(a => a._id === id);
        if (idx === -1) throw new Error(`Advancement with ID ${id} could not be found to delete`);

        await Promise.all(Object.values(this.advancementById[id].apps).map(value => value.close()))

        const advancements = this.toObject().advancement.toSpliced(idx, 1)
        await this.update({"advancement": advancements});
        return this;
    }

}