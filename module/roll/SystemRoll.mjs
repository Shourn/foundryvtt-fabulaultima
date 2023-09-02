/**
 * @extends Roll
 */
export class SystemRoll extends Roll {

    static FORMULA = "@attr1[@label1] + @attr2[@label2] + @modifier"

    /**
     * @param {Check} check
     * @param {Attributes} attributes
     * @returns {Promise<SystemRoll>}
     */
    static async rollCheck(check, attributes) {
        return new SystemRoll(
            this.FORMULA,
            {
                attr1: attributes[check.attr1].current,
                label1: game.i18n.localize(`FABULA_ULTIMA.attribute.${check.attr1}.short`),
                attr2: attributes[check.attr2].current,
                label2: game.i18n.localize(`FABULA_ULTIMA.attribute.${check.attr2}.short`),
                modifier: check.modifier
            }
        ).roll();
    }

    /**
     *
     * @returns {boolean}
     */
    get isFumble() {
        if (!this._evaluated) {
            return false;
        }
        return this.dice.flatMap(value => value.values).every(value => value === 1);
    }

    /**
     * @returns {boolean}
     */
    get isCrit() {
        if (!this._evaluated) {
            return false;
        }
        const dice = this.dice.flatMap(value => value.values);
        const allSameNumber = dice.length >= 2 && dice.reduce((previousValue, currentValue) => previousValue === currentValue);
        return allSameNumber && dice[0] >= 6;
    }

    /**
     * @returns {number}
     */
    get highRoll() {
        if (!this._evaluated) {
            return 0;
        }

        return this.dice.reduce((previousValue, currentValue) => Math.max(previousValue, currentValue.total), 0)
    }

    /**
     * @returns {number}
     */
    get lowRoll() {
        if (!this._evaluated) {
            return 0;
        }
        let lowRoll = NaN;
        for (let die of this.dice) {
            if (Number.isNaN(lowRoll)) {
                lowRoll = die.total
            } else {
                lowRoll = Math.min(lowRoll, die.total)
            }
        }
        return lowRoll;
    }

}