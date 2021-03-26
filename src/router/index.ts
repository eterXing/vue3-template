/*
 * @Date: 2021-03-23 10:35:32
 * @LastEditTime: 2021-03-24 18:38:25
 * @Description: 路由
 */

import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router"
import basics from './basics'
import createGuard from './guard/index'


function routerInstance(basics: Array<RouteRecordRaw>) {
    let routeInstance = createRouter({
        history: createWebHashHistory(),
        routes: basics
    })
    createGuard(routeInstance) //路由拦截
    return routeInstance
}

export default routerInstance(basics)