/*
 * @Date: 2021-03-25 09:21:31
 * @LastEditTime: 2021-03-29 11:45:18
 * @Description: 权限路由
 */
import StaticHome from '@/views/StaticHome.vue'
interface RouterRow {
    path: string
    name: string
    isOnce?: Boolean
    hidden?: Boolean
    meta?: any
    component: any
    children?: any[]
}

const index: RouterRow[] = [
    {
        path: "/home",
        name: "Home",
        isOnce: true,
        hidden: false,
        meta: {},
        component: () => import('@/views/Home.vue'),
        children: []
    },
    {
        path: '/index',
        name: '一级菜单',
        meta: {},
        hidden: false,
        component: StaticHome,
        children: [{
            path: 'child',
            name: '二级菜单',
            meta: {},
            hidden: false,
            component: () => import('@/views/Index.vue'),
        }]
    }
]

export default index