<!--
 * @Date: 2021-03-23 15:46:14
 * @LastEditTime: 2021-03-26 10:30:59
 * @Description: 登录页
-->
<template>
  <div class="login">
    <div class="box">
      <h3 class="title">vue3-admin</h3>
      <div class="content">
        <el-form :model="formData" :rules="rules" ref="ruleForm" label-width="0" class="form" size="medium">
          <el-form-item label="" prop="account">
            <el-input v-model="formData.account" placeholder="请输入账号" prefix-icon="el-icon-user"></el-input>
          </el-form-item>
          <el-form-item label="" prop="password">
            <el-input v-model="formData.password" placeholder="请输入密码" prefix-icon="el-icon-lock" show-password></el-input>
          </el-form-item>
        </el-form>
        <div class="check">
          <el-checkbox v-model="rememberPwd">记住密码</el-checkbox>
        </div>
        <el-button type="primary" size="medium" @click="submit">登录</el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, reactive, inject, defineComponent } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

interface Carousel {
    validate: (data: any) => {}
}

export default defineComponent({
    setup: () => {
        const $http: any = inject('$http')
        const $store: any = useStore()
        const $router: any = useRouter()

        let formData = reactive({ account: '', password: '' }),
            rememberPwd = ref(true),
            ruleForm: any = ref(null)

        const rules = {
            account: { required: true, message: '请输入账号', trigger: 'blur' },
            password: { required: true, message: '请输入密码', trigger: 'blur' },
        }

        const submit = () => {
            ;(ruleForm.value as Carousel).validate((valid: Boolean) => {
                if (valid) {
                    $http.newsGetToken({ originUserId: '114768653327773602' }).then((res: any) => {
                        $store.dispatch('user/setUserInfo', {
                            userId: res.data.data.userId,
                            userName: res.data.data.userName,
                            accessToken: res.data.data.accessToken,
                        })
                        $store.dispatch('router/setResourceList', [
                            {
                                icon: 'el-icon-s-help',
                                resourceName: '首页',
                                route: '/home',
                                type: 0,
                                sortNo: 0,
                                children: [],
                            },
                            {
                                icon: 'el-icon-menu',
                                resourceName: '表格',
                                route: '/index',
                                type: 0,
                                sortNo: 1,
                                children: [],
                            },
                        ])
                        $router.push('/')
                    })
                }
            })
        }
        return { formData, rules, rememberPwd, ruleForm, submit }
    },
})
</script>

<style scoped lang="scss">
.login {
    position: relative;
    width: 100vw;
    height: 100vh;
    background-image: url('@/assets/images/login_bg.png');
    background-repeat: no-repeat;
    background-size: 100%;
    .box {
        position: absolute;
        top: 50%;
        right: 10%;
        transform: translateY(-50%);
        border-radius: 5px;
        box-sizing: padding-box;
        width: 400px;
        height: 400px;
        padding: 80px 35px 40px 35px;
        background-image: url('@/assets/images/login_box.png');
        background-repeat: no-repeat;
        background-size: 100%;
        .title {
            font-size: 26px;
            font-weight: 600;
            color: #333;
            text-align: center;
        }
        .content {
            padding: 60px 20px 20px 20px;
            .check {
                text-align: right;
            }
            .el-button {
                margin-top: 20px;
                width: 100%;
            }
        }
    }
}
</style>
