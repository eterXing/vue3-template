/*
 * @Date: 2021-03-24 18:17:03
 * @LastEditTime: 2021-03-26 17:56:26
 * @Description: 路由拦截
 */
import store from '@/store/index'

const modules = import.meta.glob('../modules/*.router.ts')
let asyncRouterList: any[] = []

for (const path in modules) {
    await modules[path]().then(async (mod) => {
        asyncRouterList = asyncRouterList.concat(mod.default)
    })
}

const layout = {
    path: "/",
    name: "layout",
    component: () => import('@/views/layout/Index.vue')
}

const permissionsGuard = function (instance: any) {
    return (to: any, form: any, next: any) => {
        if (to.meta.ignoreAuth) { // 免权限页面
            next()
        } else if (!store.getters.isCompare) {  // 判断是否已经加载异步路由
            // 先获取相关信息
            store.commit('router/GET_RESOURCE_LIST')
            store.commit('user/GET_USERINFO')

            // 未登录则走登录流程
            if (!store.getters.accessToken) {
                const redirectPath = to.path ? `/login?redirect=${to.path}` : '/login'
                next(redirectPath)
                return
            }

            store.dispatch('router/getRouterList', asyncRouterList).then(res => {
                instance.addRoute(layout)
                res.forEach((item: any) => {
                    instance.addRoute('layout', item)
                })
                next({ ...to, replace: true })
            })
        } else if (store.getters.accessToken) {
            next()
        } else {
            const redirectPath = to.path ? `/login?redirect=${to.path}` : '/login'
            next(redirectPath)
        }
    }
}

export default function createGuard(instance: any) {
    instance.beforeEach(permissionsGuard(instance))
}
