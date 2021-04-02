/*
 * @Date: 2021-03-25 10:48:43
 * @LastEditTime: 2021-03-29 11:44:34
 * @Description: 动态路由
 */
import { copy } from '@/utils/index'

const router = {
    namespaced: true,
    state: {
        resourceList: [], // 后台返回角色路由权限
        routerList: [], // 动态匹配之后的权限路由
        userRoutes: [],// 角色侧边栏
        isCompare: false // 是否已经匹配过路由
    },
    mutations: {
        SET_RESOURCE_LIST(state: any, data: any) {
            state.resourceList = data
            localStorage.setItem('resourceList', JSON.stringify(data))
        },
        GET_RESOURCE_LIST(state: any, data: any) {
            let resourceList = localStorage.getItem('resourceList')

            state.resourceList = resourceList ? JSON.parse(resourceList) : []
        },
        SET_ROUTER_List(state: any, data: any) {
            state.routerList = data
        },
        SET_USER_ROUTES(state: any, data: any) {
            let navRouter = delNavRouter(copy(data))

            // 如果没有子节点就删除
            // navRouter = navRouter.filter(item => {
            //     return item.children.length
            // })
            state.userRoutes = navRouter
        },
        SET_COMPARE(state: any, data: any) {
            state.isCompare = data
        },
        DEL_ROUTER_INFO(state: any) {
            state.resourceList = []
            state.routerList = []
            state.userRoutes = []
            state.isCompare = false
            localStorage.removeItem('resourceList')
        }
    },
    actions: {
        // 获取router列表
        getRouterList(context: any, asyncRouterMap: any) {
            let accessedRouters = []

            if (context.state.resourceList && asyncRouterMap.length) {
                let routerList = addRoutePath(asyncRouterMap), // 资源拼接字段
                    resourceList = openRouters(context.state.resourceList) // 资源展开

                accessedRouters = filterResourceList(routerList, resourceList)

                console.log(77, accessedRouters)
                context.commit('SET_ROUTER_List', accessedRouters)
                context.commit('SET_USER_ROUTES', accessedRouters)
                context.commit('SET_COMPARE', true)
                return accessedRouters
            }
        },
        setResourceList(context: { commit: (arg0: string, arg1: any) => void }, data: any) {
            context.commit('SET_RESOURCE_LIST', data)
        },
        getResourceList(context: any) {
            context.commit('GET_RESOURCE_LIST')
        },
        delRouterInfo(context: any) {
            context.commit('DEL_ROUTER_INFO')
        }
    }
}

/**
 * 拼接路径
 * @param {前端路由数据} routerList
 * @param {需要拼接的字段} parentPath
 * @return {添加route全路径字段}
 */
function addRoutePath(routerList: any[], parentPath = ''): any[] {
    return routerList.reduce((arr, { path, isOnce, component, meta, hidden, children = [] }) => {
        let parentRoute = ''

        if (path && children && children.length) { // 如果有父元素的话，需要拼接路径
            parentRoute = parentPath ? parentPath + path + '/' : path === '/' ? '/' : path + '/'
        }
        return arr.concat([{ path, isOnce, component, meta, hidden, route: parentPath + path, children: addRoutePath(children, parentRoute) }], [])
    }, [])
}

/**
 * 展开树结构
 * @param {前端路由数据} routerList
 * @return {router展开数据}
 */
function openRouters(routerList: any[]): any[] {
    return routerList.reduce((arr, { icon, resourceName, route, sortNo, type, children = [] }) => {
        let thisChild = children.length && children[0].type ? children : [] // 如果是功能权限，需要添加到children

        if (type) {
            return arr
        }
        return arr.concat([{ icon, resourceName, route, sortNo, type, children: thisChild }], openRouters(children), [])
    }, [])
}

// 服务器资源过滤
function filterResourceList(routerList: any[], resourceList: any[]) {
    return routerList.reduce((arr, { path, isOnce, component, hidden, route, children = [] }) => {
        let status = false, data: any = {}

        status = resourceList.some((item: { route?: any }) => {
            if (item.route === route) {
                data = item
                return true
            }
        })

        if (status) {
            let index

            // 需要排序
            arr.some((item: { sortNo: number }, idx: any) => {
                if (item.sortNo > data.sortNo) {
                    index = idx
                    return true
                }
            })
            if (index) { // 插入
                arr.splice(index, 0, {
                    path, isOnce, component, hidden, route,
                    icon: data.icon,
                    resourceName: data.resourceName,
                    name: data.resourceName,
                    sortNo: data.sortNo,
                    meta: data.children ? data.children : [],
                    children: filterResourceList(children, resourceList)
                })
            } else { // 行末添加
                arr.push({
                    path, isOnce, component, hidden, route,
                    icon: data.icon,
                    resourceName: data.resourceName,
                    name: data.resourceName,
                    sortNo: data.sortNo,
                    meta: data.children ? data.children : [],
                    children: filterResourceList(children, resourceList)
                })
            }
        }
        return arr
    }, [])
}

// 过滤忽略路由
function delNavRouter(data: any[]) {
    return data.filter(item => {
        let status = Boolean(item.hidden)

        if (!status && item.children && item.children.length) {
            item.children = delNavRouter(item.children)
        }
        return !status
    })
}
export default router