<!--
 * @Date: 2021-03-25 17:07:47
 * @LastEditTime: 2021-03-29 11:02:32
 * @Description: 顶部
-->
<template>
  <div>
    <!-- 侧边栏展开收起 -->
    <div class="telescopic" @click="$emit('update:isCollapse', !isCollapse)">
      <i :class="{'left': isCollapse, 'right': !isCollapse, 'el-icon-s-fold': true}"></i>
    </div>
    <!-- 面包屑 -->
    <div class="bread">
      <el-breadcrumb>
        <transition-group name="breadcrumb">
          <el-breadcrumb-item v-for="item in breadList" :key="item.path">{{item.name}}</el-breadcrumb-item>
        </transition-group>
      </el-breadcrumb>
    </div>
    <!-- 用户信息 -->
    <div class="me">
      <el-dropdown trigger="hover">
        <div class="user">
          <div class="photo">
            <el-avatar :size='30' icon="el-icon-user-solid" src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png" fit='fill'></el-avatar>
          </div>
          <span class="last">
            {{userName}}
          </span>
        </div>
        <template #dropdown>
          <el-dropdown-menu class="me_icon">
            <el-dropdown-item @click="logout">
              <span>退出登录</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script lang='ts'>
import { ref, defineComponent, watch, inject } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
export default defineComponent({
    props: { isCollapse: Boolean },
    emits: ['update:isCollapse'],
    setup: () => {
        const $store = useStore(),
            $router = useRouter(),
            $confirm: any = inject('$confirm')

        const logout = () => {
                $confirm('确认要退出登录吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                })
                    .then(() => {
                        $store.dispatch('user/delUserInfo')
                        $store.dispatch('router/delRouterInfo')
                        $router.push('/login')
                    })
                    .catch(() => {})
            },
            userName = $store.getters.userName

        return { userName, logout, ...breadController() }
    },
})

// 面包屑路由相关
function breadController() {
    const $route: any = useRoute()
    let breadList: any = ref([]) // 方便重新赋值

    watch(
        () => $route,
        (val) => {
            breadList.value = [...val.matched.filter((item: { name: string; path: string }) => item.name && item.name !== 'layout')]
        },
        { deep: true, immediate: true }
    )

    return { breadList }
}
</script>

<style scoped lang='scss'>
@import '@/assets/css/theme.scss';
.nav_bar {
    background-color: $color;
    color: #fff;
    padding-left: 20px;
    .telescopic {
        display: inline-block;
        font-size: 20px;
        i {
            transition: transform 0.5s;
        }
        .right {
            transform: rotateY(0);
        }
        .left {
            transform: rotateY(180deg);
        }
    }
    .bread {
        margin-left: 10px;
        display: inline-block;
        ::v-deep(.el-breadcrumb) {
            .el-breadcrumb__inner {
                font-size: 16px;
                color: rgba(255, 255, 255, 0.6) !important;
            }
            .el-breadcrumb__item:last-child .el-breadcrumb__inner {
                color: #fff !important;
            }
            .breadcrumb-enter-active,
            .breadcrumb-leave-active {
                transition: all 0.5s;
            }

            .breadcrumb-enter,
            .breadcrumb-leave-active {
                opacity: 0;
                transform: translateX(20px);
            }

            .breadcrumb-move {
                transition: all 0.5s;
            }

            .breadcrumb-leave-active {
                position: absolute;
            }
        }
    }
    .me {
        cursor: pointer;
        float: right;
        margin-right: 20px;
        .user {
            color: #fff;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .photo {
            margin-right: 5px;
            .el-avatar {
                vertical-align: middle;
            }
        }
    }
}
</style>