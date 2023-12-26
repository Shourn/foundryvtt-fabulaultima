import {HOOKS, SETTINGS, SYSTEM_ID} from "../../System.mjs";
import Templates from "../../Templates.mjs";


export class MetaCurrencyTrackerApplication extends FormApplication {

    static #app;

    /**
     * @param {SceneControlTool[]} tools
     */
    static getTool(tools) {
        tools.push({
            name: MetaCurrencyTrackerApplication.name,
            title: "FABULA_ULTIMA.ui.metaCurrencyTracker.title",
            icon: "fa-solid fa-chart-line-up",
            visible: true,
            onClick: () => {
                if (!MetaCurrencyTrackerApplication.#app) {
                    MetaCurrencyTrackerApplication.#app = new MetaCurrencyTrackerApplication();
                    MetaCurrencyTrackerApplication.#app.render(true);
                }
            }
        })
    }

    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            classes: ["form"],
            closeOnSubmit: false,
            editable: true,
            sheetConfig: false,
            submitOnChange: true,
            submitOnClose: true,
            minimizable: false,
            title: "FABULA_ULTIMA.ui.metaCurrencyTracker.title"
        });
    }

    get template() {
        return Templates.metaCurrencyTracker;
    }

    fabulaHook;

    ultimaHook;

    constructor() {
        const usedFabulaPoints = game.settings.get(SYSTEM_ID, SETTINGS.MetaCurrencyFabula);
        const usedUltimaPoints = game.settings.get(SYSTEM_ID, SETTINGS.MetaCurrencyUltima);
        super({fabula: usedFabulaPoints, ultima: usedUltimaPoints});

        this.fabulaHook = Hooks.on(HOOKS.UpdateMetaCurrencyFabula, (newValue) => {
            this.object.fabula = newValue;
            this.render()
        })

        this.fabulaHook = Hooks.on(HOOKS.UpdateMetaCurrencyUltima, (newValue) => {
            this.object.ultima = newValue;
            this.render()
        })

    }

    async close(options = {}) {
        Hooks.off(HOOKS.UpdateMetaCurrencyFabula, this.fabulaHook)
        Hooks.off(HOOKS.UpdateMetaCurrencyUltima, this.ultimaHook)
        MetaCurrencyTrackerApplication.#app = undefined
        return super.close(options);
    }

    async _updateObject(event, formData) {
        if (game.settings.get(SYSTEM_ID, SETTINGS.MetaCurrencyFabula) !== formData.fabula) {
            game.settings.set(SYSTEM_ID, SETTINGS.MetaCurrencyFabula, formData.fabula);
        }
        if (game.settings.get(SYSTEM_ID, SETTINGS.MetaCurrencyUltima) !== formData.ultima) {
            game.settings.set(SYSTEM_ID, SETTINGS.MetaCurrencyUltima, formData.ultima);
        }
    }

    activateListeners(html) {
        html.find("button[data-action=calc-exp]").click((event) => this.calculateExp(event))
        html.find("button[data-action=increment-fabula]").click(() => this.increment(SETTINGS.MetaCurrencyFabula))
        html.find("button[data-action=increment-ultima]").click(() => this.increment(SETTINGS.MetaCurrencyUltima))
        return super.activateListeners(html);
    }

    increment(setting) {
        const oldValue = game.settings.get(SYSTEM_ID, setting);
        game.settings.set(SYSTEM_ID, setting, oldValue + 1)
    }

    async calculateExp(event) {
        const {fabula: spentFabulaPoints, ultima: spentUltimaPoints} = this.object;
        /** @type User[] */
        const users = game.users;
        const activeCharacters = users.filter(user => user.active && user.character).map(user => user.character);

        const baseExp = 5 //TODO add setting
        const fabulaExp = Math.floor(spentFabulaPoints / Math.max(1, activeCharacters.length))

        const data = {
            baseExp: baseExp,
            ultimaExp: spentUltimaPoints,
            fabulaExp: fabulaExp,
            totalExp: baseExp + spentUltimaPoints + fabulaExp,
            activeCharacters: activeCharacters
        }

        /** @type ChatMessageData */
        const messageData = {
            flavor: game.i18n.localize('FABULA_ULTIMA.chat.expAward.flavor'),
            content: await renderTemplate(Templates.chatExpAward, data)
        };

        ChatMessage.create(messageData)

        game.settings.set(SYSTEM_ID, SETTINGS.MetaCurrencyFabula, 0)
        game.settings.set(SYSTEM_ID, SETTINGS.MetaCurrencyUltima, 0)
    }
}