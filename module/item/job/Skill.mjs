import BaseAdvancement from "./BaseAdvancement.mjs";
import {Job} from "./Job.mjs";

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
            advancement: new ArrayField(new EmbeddedDataField(BaseAdvancement, {nullable: false}))
        }
    }

    get id() {
        return this._id;
    }

    /**
     * @return {Job|null}
     */
    get job(){
        return this.parent.parent || null;
    }

}