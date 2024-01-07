import {Job} from "./Job.mjs";
import {Skill} from "./Skill.mjs";

export default class BaseAdvancement extends foundry.abstract.DataModel {

    /**
     * @param {Partial<BaseAdvancement>} data
     * @param {*} options
     */
    constructor(data = {}, options = {}) {
        super(data, options);

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

    static get typeName() {
        return this.name
    }

    static defineSchema() {
        const {DocumentIdField, StringField} = foundry.data.fields;
        return {
            _id: new DocumentIdField({initial: () => foundry.utils.randomID()}),
            type: new StringField({
                required: true, initial: this.typeName, validate: v => v === this.typeName,
                validationError: `must be the same as typeName but was ${this.typeName}`
            }),
        }
    }

    static get metadata() {
        return {
            icon: "icons/svg/upgrade.svg",
            title: "FABULA_ULTIMA.job.skill.advancement.title",
            hint: "",
            apps: {
                config: FormApplication,
                flow: FormApplication
            }
        };

    }

    get id() {
        return this._id;
    }

    /**
     * @return {Skill|null}
     */
    get skill() {
        return this.parent instanceof Skill ? this.parent : null;
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
     * @param changes
     */
    async update(changes){
        await this.skill.updateAdvancement(this.id, changes)
    }

}