import {affinities} from "../Constants.mjs";

/**
 * @typedef Affinities
 * @property {Affinity} physical
 * @property {Affinity} air
 * @property {Affinity} bolt
 * @property {Affinity} dark
 * @property {Affinity} earth
 * @property {Affinity} fire
 * @property {Affinity} light
 * @property {Affinity} poison
 */
/**
 * @extends Affinities
 */
export class AffinitiesSchema extends foundry.data.fields.SchemaField {

    constructor() {
        const {StringField} = foundry.data.fields
        super({
            physical: new StringField({
                initial: "none",
                required: true,
                choices: affinities
            }),
            air: new StringField({
                initial: "none",
                required: true,
                choices: affinities
            }),
            bolt: new StringField({
                initial: "none",
                required: true,
                choices: affinities
            }),
            dark: new StringField({
                initial: "none",
                required: true,
                choices: affinities
            }),
            earth: new StringField({
                initial: "none",
                required: true,
                choices: affinities
            }),
            fire: new StringField({
                initial: "none",
                required: true,
                choices: affinities
            }),
            ice: new StringField({
                initial: "none",
                required: true,
                choices: affinities
            }),
            light: new StringField({
                initial: "none",
                required: true,
                choices: affinities
            }),
            poison: new StringField({
                initial: "none",
                required: true,
                choices: affinities
            })
        })
    }
}