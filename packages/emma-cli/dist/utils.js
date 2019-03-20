'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
/**
 *
 * Remove particular key from the object.
 *
 * @param k
 * @param obj
 */
function removeKey(k, obj) {
  return Object.keys(obj).reduce((acc, key) => {
    if (key === k) return acc
    return Object.assign({}, acc, { [key]: obj[key] })
  }, {})
}
exports.removeKey = removeKey
