/**
 * @extends {Item}
 * @extends {ItemData}
 * @property {AccessoryData} system
 */
export class Accessory extends Item {

    get price(){
        return this.system.price;
    }

    get description() {
        return this.system.description;
    }
}