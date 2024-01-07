import BaseAdvancement from "./BaseAdvancement.mjs";
import {Spell} from "../spell/Spell.mjs";
import {GrantSpellConfig} from "./GrantSpellConfig.mjs";


export default class GrantSpell extends BaseAdvancement {

    static defineSchema(){
        const {StringField, ArrayField, EmbeddedDataField} = foundry.data.fields;
        return foundry.utils.mergeObject(super.defineSchema(), {
            name: new StringField({initial: game.i18n.localize("FABULA_ULTIMA.job.advancement.grantSpell")}),
            options: new ArrayField(new EmbeddedDataField(Spell, {nullable: false}))
        })
    }

    static get metadata(){
        return foundry.utils.mergeObject(super.metadata, {
            title: "FABULA_ULTIMA.job.skill.advancement.type.grantSpell.title",
            apps:{
                config: GrantSpellConfig
            }
        })
    }


}