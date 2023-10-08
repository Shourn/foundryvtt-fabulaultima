import Templates, {Partials} from "../../Templates.mjs";
import {promptCheck, registerCollapse} from "../../utils/helper.mjs";

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

    getData(options = {}) {
        const data = super.getData(options);
        return foundry.utils.mergeObject(data, {
            system: data.actor.system,
            partials: {
                accessory: "accessoryEquipment",
                armor: "armorEquipment",
                weapon: "weaponEquipment",
                shield: "shieldEquipment"
            }
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
        html.find("[data-action=add][data-type=equipment]").click(event => this.addItem(event))
        html.find("[data-action=edit][data-type=equipment]").click(event => this.editItem(event))
        html.find("[data-action=delete][data-type=equipment]").click(event => this.deleteItem(event))
        html.find("[data-action=delete][data-type=job]").click(event => this.deleteItem(event))
        html.find("[data-action=equip]").click(event => this.equipItem(event))

        registerCollapse(html);
    }

    async addBond(event) {
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

    async addItem(event) {
        const types = {
            accessory: "FABULA_ULTIMA.item.accessory.type",
            armor: "FABULA_ULTIMA.item.armor.type",
            misc: "FABULA_ULTIMA.item.misc.type",
            shield: "FABULA_ULTIMA.item.shield.type",
            weapon: "FABULA_ULTIMA.item.weapon.type",
        };
        const dialog = new Dialog({
            title: game.i18n.localize("FABULA_ULTIMA.dialog.addItem.title"),
            content: await renderTemplate(Templates.dialogAddItem, {types}),
            buttons: {
                select: {
                    label: game.i18n.localize("FABULA_ULTIMA.button.select"),
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


    promptCheck(clickEvent) {
        promptCheck(this.actor)
    }

    async equipItem(event) {
        const itemId = $(event.currentTarget).parents("[data-item-id]").data("itemId");
        await this.actor.equip(itemId);
        console.log(this)
        this.render(true)
    }
}