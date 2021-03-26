/*
 * @Date: 2021-03-24 18:06:47
 * @LastEditTime: 2021-03-25 11:52:21
 * @Description: 基础路由
 */
import { RouteRecordRaw } from "vue-router"

const constantRouterMap: Array<RouteRecordRaw> = [
    {
        path: "/login",
        name: "Login",
        meta: {
            ignoreAuth: true
        },
        component: () => import('@/views/login.vue')
    }
]

export default constantRouterMap