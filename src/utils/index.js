/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (!time) {
    return ''
  } else if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
      time = parseInt(time)
    }
    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value ] }
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function getQueryObject(url) {
  url = url == null ? window.location.href : url
  const search = url.substring(url.lastIndexOf('?') + 1)
  const obj = {}
  const reg = /([^?&=]+)=([^?&=]*)/g
  search.replace(reg, (rs, $1, $2) => {
    const name = decodeURIComponent($1)
    let val = decodeURIComponent($2)
    val = String(val)
    obj[name] = val
    return rs
  })
  return obj
}

/**
 * @param {string} input value
 * @returns {number} output value
 */
export function byteLength(str) {
  // returns the byte length of an utf8 string
  let s = str.length
  for (var i = str.length - 1; i >= 0; i--) {
    const code = str.charCodeAt(i)
    if (code > 0x7f && code <= 0x7ff) s++
    else if (code > 0x7ff && code <= 0xffff) s += 2
    if (code >= 0xDC00 && code <= 0xDFFF) i--
  }
  return s
}

/**
 * @param {Array} actual
 * @returns {Array}
 */
export function cleanArray(actual) {
  const newArray = []
  for (let i = 0; i < actual.length; i++) {
    if (actual[i]) {
      newArray.push(actual[i])
    }
  }
  return newArray
}

/**
 * @param {Object} json
 * @returns {Array}
 */
export function param(json) {
  if (!json) return ''
  return cleanArray(
    Object.keys(json).map(key => {
      if (json[key] === undefined) return ''
      return encodeURIComponent(key) + '=' + encodeURIComponent(json[key])
    })
  ).join('&')
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse(
    '{"' +
      decodeURIComponent(search)
        .replace(/"/g, '\\"')
        .replace(/&/g, '","')
        .replace(/=/g, '":"')
        .replace(/\+/g, ' ') +
      '"}'
  )
}

/**
 * @param {string} val
 * @returns {string}
 */
export function html2Text(val) {
  const div = document.createElement('div')
  div.innerHTML = val
  return div.textContent || div.innerText
}

/**
 * Merges two objects, giving the last one precedence
 * @param {Object} target
 * @param {(Object|Array)} source
 * @returns {Object}
 */
export function objectMerge(target, source) {
  if (typeof target !== 'object') {
    target = {}
  }
  if (Array.isArray(source)) {
    return source.slice()
  }
  Object.keys(source).forEach(property => {
    const sourceProperty = source[property]
    if (typeof sourceProperty === 'object') {
      target[property] = objectMerge(target[property], sourceProperty)
    } else {
      target[property] = sourceProperty
    }
  })
  return target
}

/**
 * @param {HTMLElement} element
 * @param {string} className
 */
export function toggleClass(element, className) {
  if (!element || !className) {
    return
  }
  let classString = element.className
  const nameIndex = classString.indexOf(className)
  if (nameIndex === -1) {
    classString += '' + className
  } else {
    classString =
      classString.substr(0, nameIndex) +
      classString.substr(nameIndex + className.length)
  }
  element.className = classString
}

/**
 * @param {string} type
 * @returns {Date}
 */
export function getTime(type) {
  if (type === 'start') {
    return new Date().getTime() - 3600 * 1000 * 24 * 90
  } else {
    return new Date(new Date().toDateString())
  }
}

/**
 * @param {Function} func
 * @param {number} wait
 * @param {boolean} immediate
 * @return {*}
 */
export function debounce(func, wait, immediate) {
  let timeout, args, context, timestamp, result

  const later = function() {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp

    // 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  }

  return function(...args) {
    context = this
    timestamp = +new Date()
    const callNow = immediate && !timeout
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }

    return result
  }
}

/**
 * This is just a simple version of deep copy
 * Has a lot of edge cases bug
 * If you want to use a perfect deep copy, use lodash's _.cloneDeep
 * @param {Object} source
 * @returns {Object}
 */
export function deepClone(source) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'deepClone')
  }
  const targetObj = source.constructor === Array ? [] : {}
  Object.keys(source).forEach(keys => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = deepClone(source[keys])
    } else {
      targetObj[keys] = source[keys]
    }
  })
  return targetObj
}

/**
 * @param {Array} arr
 * @returns {Array}
 */
export function uniqueArr(arr) {
  return Array.from(new Set(arr))
}

/**
 * @returns {string}
 */
export function createUniqueString() {
  const timestamp = +new Date() + ''
  const randomNum = parseInt((1 + Math.random()) * 65536) + ''
  return (+(randomNum + timestamp)).toString(32)
}

/**
 * Check if an element has a class
 * @param {HTMLElement} elm
 * @param {string} cls
 * @returns {boolean}
 */
export function hasClass(ele, cls) {
  return !!ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'))
}

/**
 * Add class to element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function addClass(ele, cls) {
  if (!hasClass(ele, cls)) ele.className += ' ' + cls
}

/**
 * Remove class from element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function removeClass(ele, cls) {
  if (hasClass(ele, cls)) {
    const reg = new RegExp('(\\s|^)' + cls + '(\\s|$)')
    ele.className = ele.className.replace(reg, ' ')
  }
}
/**
 * number to string
 */
export function transformMoney(tranvalue) {
  try {
    var i = 1
    var dw2 = ['', '万', '亿']// 大单位
    var dw1 = ['拾', '佰', '仟']// 小单位
    var dw = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖']// 整数部分用
    // 以下是小写转换成大写显示在合计大写的文本框中
    // 分离整数与小数
    // 拆分整数与小数
    var source = (function(tranvalue) {
      var value = ['', '']
      temp = tranvalue.split('.')
      for (var i = 0; i < temp.length; i++) {
        value[i] = temp[i]
      }
      return value
    })(tranvalue)
    var num = source[0]
    var dig = source[1]

    // 转换整数部分
    var k1 = 0// 计小单位
    var k2 = 0// 计大单位
    var sum = 0
    var str = ''
    var len = source[0].length// 整数的长度
    for (i = 1; i <= len; i++) {
      var n = source[0].charAt(len - i)// 取得某个位数上的数字
      var bn = 0
      if (len - i - 1 >= 0) {
        bn = source[0].charAt(len - i - 1)// 取得某个位数前一位上的数字
      }
      sum = sum + Number(n)
      if (sum != 0) {
        str = dw[Number(n)].concat(str)// 取得该数字对应的大写数字，并插入到str字符串的前面
        if (n == '0')sum = 0
      }
      if (len - i - 1 >= 0) { // 在数字范围内
        if (k1 != 3) { // 加小单位
          if (bn != 0) {
            str = dw1[k1].concat(str)
          }
          k1++
        } else { // 不加小单位，加大单位
          k1 = 0
          var temp = str.charAt(0)
          if (temp == '万' || temp == '亿')// 若大单位前没有数字则舍去大单位
          { str = str.substr(1, str.length - 1) }
          str = dw2[k2].concat(str)
          sum = 0
        }
      }
      if (k1 == 3)// 小单位到千则大单位进一
      { k2++ }
    }

    // 转换小数部分
    var strdig = ''
    if (dig != '') {
      var n = dig.charAt(0)
      if (n != 0) {
        strdig += dw[Number(n)] + '角'// 加数字
      }
      var n = dig.charAt(1)
      if (n != 0) {
        strdig += dw[Number(n)] + '分'// 加数字
      }
    }
    str += '元' + strdig
  } catch (e) {
    return ''
  }
  return str
}
/**
 * getFileName 
 * 获取文件后缀名
 */
export function splitFileName(url, type='0') {
  const fnameurl = url.split('.')
  const fname = fnameurl[fnameurl.length - 1]
  return type === '0' ? fname.toUpperCase() : fname
}
/**
 * getFileName1 
 * 获取文件全名
 */
export function splitFileName1(url) {
  const fnameurl = url.split('/')
  const fname = fnameurl[fnameurl.length - 1]
  return fname
}


/**
 * 打印html节点
 * @param {printConent} elm
 */
export function printElement(printConent) {
  if (!printConent) {
    console.error('打印对象不存在')
    return
  }
  let prnhtml = '<style>.fontColor{color: red}table{width: 100%;text-align: center;border-collapse:collapse;table-layout:fixed;}tr{height: 40px;}</style>'
  const newContent = printConent.innerHTML
  prnhtml += newContent
  let iframe = document.getElementById('printIframe')
  if (!iframe) {
    iframe = document.createElement('iframe')
    iframe.id = 'printIframe'
    iframe.style.display = 'none'
    document.body.appendChild(iframe)
  }
  const iwindow = iframe.contentWindow
  iwindow.document.close()
  iwindow.document.write(prnhtml)
  iwindow.print()
}
/**
 * 创建下载
 * @param {string} url
 * @param {string} fileName
 */
export function downloadFile(url, fileName) {
  const aLink = document.createElement('a')
  const evt = document.createEvent('MouseEvents')
  evt.initEvent('click', false, false, window)
  if (fileName) {
    const fileSuffix = splitFileName(url, '1')
    fileName = `${fileName}.${fileSuffix}`
  }else{
    fileName = splitFileName1(url)
  }
  aLink.href = url
  aLink.download = fileName
  aLink.target = '_blank'
  aLink.dispatchEvent(evt)
}
/**
 * 导出下载
 * @param {string} url
 * @param {string} fileName
 */
export function exportDownload(blobData, fileName) {
  const aLink = document.createElement('a')
  const blob = new Blob([blobData]);
  const evt = document.createEvent('MouseEvents')
  evt.initEvent('click', false, false, window)
  aLink.download = fileName
  aLink.href = URL.createObjectURL(blob)
  aLink.target = '_blank'
  aLink.dispatchEvent(evt)
}
/**
 * 计算N年后日期的前一天
 * @param {timestamp,时间对象,'yyyy-MM-dd hh-mm-ss'} newDate
 * @param {number} n
 */
export function calcYear(newDate, n) {
  let date = new Date(newDate);
  date.setFullYear(date.getFullYear() + n);
  date.setTime(date.getTime() - 24 * 3600 * 1000);
  return date.getTime();
}
/** 格式化字符串为金额
* @param Number || String
* @return [string]->11.11
*/
export function formatToMoney(num, limitNum = 2) {
  num = num.replace(/^[\.]/, '').replace(/[^\d.]/g, '');
  let index = num.indexOf('.');
  if (index > -1) {
    let prevStr = num.substring(0, index) * 1
    let decimal = num.substring(index + 1)
    let decInex = decimal.indexOf('.')
    if (decInex > -1) {
      num = prevStr + '.' + decimal.substring(0, decInex)
    } else {
      //保留小数点后几位（limitNum）
      num = prevStr + '.' + decimal.substr(0, limitNum)
    }
  } else {
    num = num ? String(num * 1) : num;
  }
  return num
}
