import {TEMPLATES} from "../preloadTemplates";

export default class FUItemSheet extends ItemSheet {


  get template(): string {
    return TEMPLATES.itemWeapon;
  }
}
