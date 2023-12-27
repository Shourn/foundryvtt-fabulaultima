import BaseAdvancement from "./BaseAdvancement.mjs";
import {Spell} from "../spell/Spell.mjs";


export class GrantSpell extends BaseAdvancement {

    static defineSchema(){
        const {StringField, ArrayField, EmbeddedDataField} = foundry.data.fields;
        return foundry.utils.mergeObject(super.defineSchema(), {
            name: new StringField({initial: game.i18n.localize("FABULA_ULTIMA.job.advancement.grantSpell")}),
            options: new ArrayField(new EmbeddedDataField(Spell, {nullable: false}))
        })
    }


}

const skill = {
    _id: "blablabl",
    advancements: [{
        _id: "ansfdin",
        type: "GrantArcanum",
        itemType: "Arcanum",
        options: [{
            _id: "sdfjghn",
            name: "Arcanum of the Forge",
            system: {
                merge: "You have Resistance to fire damage.\nAny fire damage you deal ignores Resistances.",
                dismiss: "When you dismiss this Arcanum, choose Forge or Inferno:\nForge. You create a basic armor, shield or weapon of your choice (see pages 130\nto 133). If you select this option again, the previously created item vanishes. If you\ncreate a weapon this way, it deals fire damage instead of physical.\nInferno. Choose any number of creatures you can see: each of them suffers 30 fire\ndamage. This damage ignores Resistances."
            }
        }]
    }]
}