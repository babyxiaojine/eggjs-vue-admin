/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} url
 * @returns {Boolean}
 */
export function validURL(url) {
  const reg = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return reg.test(url)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validLowerCase(str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUpperCase(str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validAlphabets(str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}

/**
 * @param {string} email
 * @returns {Boolean}
 */
export function validEmail(email) {
  const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return reg.test(email)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function isString(str) {
  if (typeof str === 'string' || str instanceof String) {
    return true
  }
  return false
}

/**
 * @param {Array} arg
 * @returns {Boolean}
 */
export function isArray(arg) {
  if (typeof Array.isArray === 'undefined') {
    return Object.prototype.toString.call(arg) === '[object Array]'
  }
  return Array.isArray(arg)
}

const validRules = {
  '*': /[\S]+/,
  'required': /[\S]+/,
  'phone': /^[1][0-9]{10}$/,
  'mobile': /^[1][0-9]{10}$/,
  'email': /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/,
  'telephone': /^([0-9]{3,4}-)?[0-9]{7,8}$/,
  'remark': /^[\w\W]{5,50}$/,
  'remark2': /^[\w\W]{0,50}$/,
  'remark3': /^[\w\W]{10,50}$/,
  'amount': /^[0-9]{1,6}(\.\d{1,2})?$/,
  'contactWay': function(str) {
    return validRules.phone.test(str) || validRules.email.test(str) || validRules.telephone.test(str)
  }
}

function formatRegexp(str) {
  const reg = /^(.+?)(\d+)-(\d+)$/
  const marr = str.match(reg)
  if (marr) {
    const headings = {
      's': '[\\u4E00-\\u9FA5\\uf900-\\ufa2d\\w\\.\\s]', //字符
      '*': '[\\w\\W]', //任意字符
      'n': '\\d', //**数字
    }
    if (marr[1] in headings) {
      const prefix = headings[marr[1]]
      const allReg = '^' + prefix + '{' + marr[2] + ',' + marr[3] + '}$'
      const resReg = new RegExp(allReg)
      return resReg
    }
    if (marr[1] === 'int:r') {
      return function(v) {
        return /^\d+$/.test(v) && v >= parseInt(marr[2]) && v <= parseInt(marr[3])
      }
    }
  }
  return false
}
export function validForm(formObj) {
  if (!formObj) {
    return
  }
  const formDom = formObj.$el ? formObj.$el : formObj
  let status = true
  let msg = '验证通过'
  console.log(formDom.elements.length)
  for (var i = 0; i < formDom.elements.length; i++) {
    const actEle = formDom.elements[i]
    const rule = actEle.getAttribute('rule')
    const tip = actEle.getAttribute('error') || actEle.getAttribute('placeholder')
    const val = actEle.value.trim()
    if (rule) {
      if (validRules[rule]) {
        const subRule = validRules[rule]
        if (typeof subRule === 'function') {
          if (!subRule(val)) {
            status = false
            msg = tip || '请填写必填字段'
            break
          }
        } else {
          if (!subRule.test(val)) {
            status = false
            msg = tip || '请填写必填字段'
            break
          }
        }
      } else {
        const cusRule = formatRegexp(rule)
        if (cusRule) {
          if ((Object.prototype.toString.call(cusRule).indexOf('RegExp') > -1 && !cusRule.test(val)) || (Object.prototype.toString.call(cusRule).indexOf('Function') > -1 && !cusRule(val))) {
            status = false
            msg = tip || '请填写必填字段'
            break
          }
        }
      }
    }
  }
  return { status, msg }
}
