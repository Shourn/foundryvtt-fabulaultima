import Templates from "../../Templates.mjs";
import {activateStatusEffectListeners, extractStatusEffects} from "../../StatusEffects.mjs";
import {promptCheck} from "../../checks/Checks.mjs";

export class CharacterSheet extends ActorSheet {

    static get defaultOptions() {
        const defaultOptions = super.defaultOptions;
        return foundry.utils.mergeObject(defaultOptions, {
            classes: [...defaultOptions.classes, "actor-character"],
            tabs: [{navSelector: ".tabs", contentSelector: ".tab-container"}]
        });
    }

    get template() {
        return Templates.actorCharacter;
    }

    /**
     * @type {Character}
     */
    get actor() {
        // noinspection JSValidateTypes
        return super.actor;
    }

    async getData(options = {}) {
        const data = super.getData(options);
        const skillDescriptions = {}
        for (const /** @type Job */ job of this.actor.itemTypes.job) {
            for (const [id, skill] of Object.entries(job.skills)) {
                if (skill.level > 0){
                    skillDescriptions[id] = await TextEditor.enrichHTML(skill.description, {rollData: skill.getRollData(true)})
                }
            }
        }

        return foundry.utils.mergeObject(data, {
            system: data.actor.system,
            partials: {
                accessory: "accessoryEquipment",
                armor: "armorEquipment",
                weapon: "weaponEquipment",
                shield: "shieldEquipment"
            },
            enrichedHtml: {
                description: await TextEditor.enrichHTML(data.actor.system.description),
                skillDescriptions
            },
            statusEffects: extractStatusEffects(this.actor)
        });
    }


    /**
     *
     * @param {jQuery} html
     */
    activateListeners(html) {
        super.activateListeners(html);

        html.find("[data-action=add][data-type=bond]").click((event) => this.addBond(event));
        html.find("[data-action=delete][data-type=bond]").click((event) => this.removeBond(event));
        html.find("[data-action=roll][data-type=check]").click(clickEvent => this.promptCheck(clickEvent));
        html.find("[data-action=add][data-type=item]").click(event => this.addItem(event))
        html.find("[data-action=edit][data-type=item]").click(event => this.editItem(event))
        html.find("[data-action=delete][data-type=item]").click(event => this.deleteItem(event))
        html.find("[data-action=equip]").click(event => this.toggleEquipment(event))
        html.find("[data-action=roll][data-type=item]").click(event => this.rollItem(event))
        activateStatusEffectListeners(html, this.actor)
    }

    async addBond() {
        const bonds = [...this.actor.system.bonds];
        bonds.push({with: "", feeling1: "none", feeling2: "none", feeling3: "none"})
        await this.document.update({"system.bonds": bonds});
        await this.render()
    }

    async removeBond(event) {
        const index = $(event.currentTarget).parents("*[data-index]").data("index");
        const bonds = this.actor.system.bonds.toSpliced(index, 1);
        await this.document.update({"system.bonds": bonds});
        await this.render()
    }

    async addItem() {
        const types = {
            misc: "FABULA_ULTIMA.itemType.misc",
            accessory: "FABULA_ULTIMA.itemType.accessory",
            armor: "FABULA_ULTIMA.itemType.armor",
            shield: "FABULA_ULTIMA.itemType.shield",
            weapon: "FABULA_ULTIMA.itemType.weapon",
        };
        const dialog = new Dialog({
            title: game.i18n.localize("FABULA_ULTIMA.dialog.addItem.title"),
            content: await renderTemplate(Templates.dialogAddItem, {types}),
            buttons: {
                select: {
                    label: game.i18n.localize("FABULA_ULTIMA.dialog.addItem.confirm"),
                    callback: async (html) => {
                        const find = html.find("[name=type]");
                        const itemType = find.val();
                        const item = await Item.create({
                            type: itemType,
                            name: game.i18n.localize(types[itemType])
                        }, {parent: this.actor, type: itemType});
                        this.actor.items.get(item.id).sheet.render(true);
                    }
                }
            }
        });
        dialog.render(true, {renderData: {types}})
    }

    editItem(clickEvent) {
        const itemId = $(clickEvent.currentTarget).parents("*[data-item-id]").data("itemId");
        this.actor.items.get(itemId).sheet.render(true);
    }

    deleteItem(event) {
        event.preventDefault();
        const itemId = $(event.currentTarget).parents("*[data-item-id]").data("itemId");
        this.actor.unequip(itemId);
        this.actor.items.get(itemId).delete()
    }

    rollItem(event) {
        event.preventDefault();
        const itemId = $(event.currentTarget).parents("*[data-item-id]").data("itemId");
        const item = this.actor.items.get(itemId);
        if (item.roll) {
            item.roll();
        }
    }

    promptCheck(clickEvent) {
        promptCheck(this.actor)
    }

    async toggleEquipment(event) {
        const itemId = $(event.currentTarget).parents("[data-item-id]").data("itemId");
        if (this.actor.isEquipped(itemId)){
            await this.actor.unequip(itemId)
        } else {
            await this.actor.equip(itemId);
        }
        this.render(true)
    }
}