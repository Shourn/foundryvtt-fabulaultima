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
