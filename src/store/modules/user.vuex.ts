/*
 * @Date: 2021-03-24 16:18:52
 * @LastEditTime: 2021-03-25 18:23:11
 * @Description: 用户相关信息
 */
const user = {
    namespaced: true,
    state: {
        userInfo: {}
    },
    mutations: {
        SET_USERINFO(state: { userInfo: any }, data: any) {
            state.userInfo = data
            localStorage.setItem('userInfo', JSON.stringify(data))
        },
        GET_USERINFO(state: { userInfo: any }) {
            let userInfo = localStorage.getItem('userInfo')

            state.userInfo = userInfo ? JSON.parse(userInfo) : {}
        },
        DEL_USERINFO(state: { userInfo: any }) {
            state.userInfo = {}
            localStorage.removeItem('userInfo')
        }
    },
    actions: {
        setUserInfo(context: any, data: any) {
            context.commit('SET_USERINFO', data)
        },
        getUserInfo(context: any) {
            context.commit('GET_USERINFO')
        },
        delUserInfo(context: any) {
            context.commit('DEL_USERINFO')
        }
    }
}

export default user