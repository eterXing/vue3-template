/*
 * @Date: 2021-03-25 15:02:54
 * @LastEditTime: 2021-03-25 15:20:14
 * @Description: 工具函数
 */
const util = {
    getType: (obj: any) => {
        let classType: any = {},
            typeList = ['Null', 'Undefined', 'Number', 'Boolean', 'String', 'Object', 'Function', 'Array', 'RegExp', 'Date']

        typeList.forEach(item => {
            classType['[object ' + item + ']'] = item.toLowerCase()
        })
        return classType[Object.prototype.toString.call(obj)] || 'object'
    },
    isType: (obj: any, type: string) => {
        return util.getType(obj) === type
    }
}


/**
 * @description: 深克隆
 * @param {obj} 需要克隆的对象
 * @return: 新的对象
 */
export const copy = function (obj: any) {
    if (obj === null || typeof obj !== 'object') {
        return obj
    }

    let target: any = util.isType(obj, 'array') ? [] : {},
        valueType

    for (let i in obj) {
        valueType = util.getType(obj[i])
        if (valueType === 'array' || valueType === 'object') {
            target[i] = copy(obj[i])
        } else {
            target[i] = obj[i]
        }
    }
    return target
}