import Templates from "../templates.mjs";
import {affinities, attributeDice, attributes, damageTypes, rank, species, villain} from "../Constants.mjs";

export class NpcSheet extends ActorSheet {
    get template() {
        return Templates.actorNpc;
    }

    getData(options = {}) {
        let data = super.getData(options);
        console.log(data)
        return {
            ...data,
            system: {
                ...data.data.system,
                isChampion: data.actor.system.isChampion(),
                isVillain: data.actor.system.isVillain()
            },
            constants: {
                species: this.toObject(species, value => `FABULA_ULTIMA.species.${value}`),
                rank: this.toObject(rank, value => `FABULA_ULTIMA.rank.${value}`),
                villain: this.toObject(villain, value => `FABULA_ULTIMA.villain.${value}`),
                attributeDice: this.toObject(attributeDice, value => `FABULA_ULTIMA.attributeDice.${value}`),
                attributes: this.toObject(attributes, value => ({
                    short: `FABULA_ULTIMA.attribute.${value}.short`,
                    full: `FABULA_ULTIMA.attribute.${value}.full`
                })),
                affinities: this.toObject(affinities, value => ({
                    short: `FABULA_ULTIMA.affinity.${value}.short`,
                    full: `FABULA_ULTIMA.affinity.${value}.full`
                }))
            }
        };
    }


    toObject(source, getValue) {
        const result = {};

        source.forEach(value => {
            return result[value] = getValue(value);
        })
        return result;
    }

    _getSubmitData(updateData = {}) {
        return super._getSubmitData(updateData);
    }

    activateListeners(html) {
        super.activateListeners(html);
    }

}