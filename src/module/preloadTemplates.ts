// SPDX-FileCopyrightText: 2022 Johannes Loher
//
// SPDX-License-Identifier: MIT

export const TEMPLATES = {
  // Add paths to "systems/fabulaultima/templates"
  characterPlayer: "systems/fabulaultima/templates/character_pc.hbs",
  itemWeapon: "systems/fabulaultima/templates/item_weapon.hbs"
} as const;


export async function preloadTemplates(): Promise<Handlebars.TemplateDelegate[]> {

  return loadTemplates(Object.values(TEMPLATES));
}
