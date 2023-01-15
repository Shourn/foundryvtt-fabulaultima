import {TEMPLATES} from "../preloadTemplates";

export default class FUCharacterSheet extends ActorSheet {


  get template(): string {
    return TEMPLATES.characterPlayer;
  }
}
