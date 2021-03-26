/*
 * @Date: 2021-03-24 16:15:33
 * @LastEditTime: 2021-03-25 16:42:30
 * @Description: getters
 */
const getters = {
    userId: (state: any) => state.user.userInfo.userId,
    userName: (state: any) => state.user.userInfo.userName,
    accessToken: (state: any) => state.user.userInfo.accessToken,
    userRoutes: (state: any) => state.router.userRoutes,
    isCompare: (state: any) => state.router.isCompare
}

export default getters