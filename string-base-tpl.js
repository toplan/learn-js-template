;(function (factory) {
  if (typeof module === "object" && typeof exports === "object") {
    module.exports = factory()
    return
  }
  if (typeof window !== "undefined") {
    window.stringBaseTpl = factory()
  }
}(function () {
  var jsCodeReg = /<%([^%>]*)?%>/g
  var jsCodeOutReg = /(if|for|else|switch|case|break|\{|\})+/gi

  var codes,
    tplIndex,
    tplMatch

  //internal functions  
  var reset,
    addCode,
    isObject,
    objectKeys,
    objectValues 

  isObject = function (target) {
    return target && Object.prototype.toString.call(target) === "[object Object]"
  }

  reset = function () {
    codes = ";var out = [];"
    tplIndex = 0
    tplMatch = null
  }

  addCode = function (str, isJsCode) {
    if (!str) {
      return
    }
    if (!isJsCode) {
      codes += "out.push('" + str + "');"
      return
    }
    if (str.match(jsCodeOutReg)) {
      codes += str
    } else {
      codes += "out.push(" + str + ");"
    }
  }

  objectKeys = function (obj) {
    if (!isObject(obj)) {
      return []
    }

    return Object.keys(obj)
  }

  objectValues = function (obj) {
    var values = []
    var keys = objectKeys(obj)
    keys.forEach(function (key, index) {
      var value = obj[key]
      values[index] = typeof value === "function"
        ? value.call(null)
        : value
    })
    return values
  }

  return function (tpl, tplData) {
    reset()

    if (!tpl || typeof tpl !== "string") {
      return tpl + ""
    }

    if (!isObject(tplData)) {
      throw new TypeError("Template data must be object.")
    }

    while (tplMatch = jsCodeReg.exec(tpl)) {
      var matchIndex = tplMatch["index"]

      addCode(tpl.slice(tplIndex, matchIndex), false)
      addCode(tplMatch[1], true)
      tplIndex = matchIndex + (tplMatch[0]).length
    }

    if (tplIndex < tpl.length) {
      addCode(tpl.slice(tplIndex), false)
    }
    codes += "return out.join('');"

    var argNames = objectKeys(tplData)
    var fn = Function.apply(null, argNames.concat(codes))

    return fn.apply(tplData, objectValues(tplData))
  }
}))
