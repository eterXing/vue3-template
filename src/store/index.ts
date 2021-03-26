/*
 * @Date: 2021-03-23 11:29:42
 * @LastEditTime: 2021-03-24 17:52:58
 * @Description: vuex
 */
import { createStore } from "vuex"
import getters from './getters'

const modules = import.meta.glob('./modules/*.vuex.ts')

let moduleList: any = {}

for (const path in modules) {
    await modules[path]().then(async (mod) => {
        let nameList: any = path.match(/modules\/(\S*).vuex.ts$/)

        moduleList[nameList[1]] = mod.default
    })
}

export default createStore({
    modules: moduleList,
    getters
})