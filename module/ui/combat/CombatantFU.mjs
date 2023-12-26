export class CombatantFU extends Combatant {

    /**
     * @return {"friendly" | "hostile"}
     */
    get faction() {
        return this.token?.disposition === foundry.CONST.TOKEN_DISPOSITIONS.FRIENDLY ? "friendly" : "hostile"
    }

}