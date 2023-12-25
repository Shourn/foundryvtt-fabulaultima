import {HOOKS, SYSTEM_ID} from "../../System.mjs";

/**
 * @param {SceneControl[]} controls
 */
export function initializeSystemControl(controls) {
    /** @type SceneControlTool[] */
    const tools = [];

    Hooks.callAll(HOOKS.GetSystemControlTools, tools)

    controls.push({
        name: SYSTEM_ID,
        title: "FABULA_ULTIMA.ui.control.title",
        icon: 'fa-solid fa-solar-system',
        visible: game.user.isGM,
        tools: tools,
        layer: SYSTEM_ID
    })
}