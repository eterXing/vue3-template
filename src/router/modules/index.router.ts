/*
 * @Date: 2021-03-25 09:21:31
 * @LastEditTime: 2021-03-26 17:52:51
 * @Description: 权限路由
 */
interface RouterRow {
    path: string
    name: string
    isOnce?: Boolean
    hidden?: Boolean
    meta?: any
    component: () => {}
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
        name: 'Index',
        meta: {},
        hidden: false,
        isOnce: true,
        component: () => import('@/views/Index.vue'),
        children: []
    }
]

export default index