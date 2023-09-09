/**
 * @augments {Actor}
 * @augments {foundry.abstract.Document}
 * @augments {ActorData}
 * @extends {ClientDocumentMixin}
 * @property {PlayerCharacterData} system
 */
export class Character extends Actor {

    get backpack() {
        return [...this.itemTypes.accessory, ...this.itemTypes.armor, ...this.itemTypes.misc, ...this.itemTypes.shield, ...this.itemTypes.weapon]
    }


    applyActiveEffects() {
        return super.applyActiveEffects();
    }
}
