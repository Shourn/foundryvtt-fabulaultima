/**
 * @param {number} value
 * @param {number} [max]
 * @param {number} [min]
 * @returns {number}
 */
export const clamp = (value, max = Number.MAX_VALUE, min = 0) => Math.min(Math.max(min, value), max);

/**
 * @template {string} T
 * @template R
 * @param {T[]} source
 * @param {(string) => R} getValue
 * @returns {Record<T, R>}
 */
export function toObject(source, getValue) {
    const result = {};

    source.forEach(value => {
        return result[value] = getValue(value);
    })
    return result;
}

/**
 *
 * @param {jQuery} jquery
 */
export function registerCollapse(jquery) {
    const collapseTriggers = jquery.find("[data-collapse-toggle]");
    collapseTriggers.click(event => {
        const collapseId = $(event.currentTarget).data("collapseToggle");
        const collapse = jquery.find(`.collapse[data-collapse="${collapseId}"]`);
        collapse.toggleClass("show");
    })
}
