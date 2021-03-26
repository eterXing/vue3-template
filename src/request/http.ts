/*
 * @Date: 2021-03-24 11:27:47
 * @LastEditTime: 2021-03-24 15:45:23
 * @Description: axios封装
 */
import axios from 'Axios'
import env from '@/config/env'

interface ApiInterface {
    url: string
    method?: string
    apiName?: string
    hideMessage?: string
    notDebounce?: string
}

let apiList: [ApiInterface] = [
    {
        url: "gateway/office/api/manage/getTokenByLocalOriginUserId",
        apiName: 'newsGetToken'
    }
]

class HttpInstance {
    private instance: any
    private apiList: [ApiInterface]
    private sourcesList: any
    private messageStatus: Boolean
    private CancelToken: any
    private App: any
    [x: string]: any
    constructor(app: any, list: [ApiInterface], baseUrl: string) {
        this.apiList = list // 接口列表
        this.App = app // vue实例
        this.sourcesList = []
        this.messageStatus = true
        this.instance = axios.create({
            baseURL: baseUrl,
            withCredentials: true
        })

        this.CancelToken = axios.CancelToken

        // request拦截器，携带token
        this.instance.interceptors.request.use(this.requestGuard.bind(this), this.rejectConfig)
        // response 拦截器
        this.instance.interceptors.response.use(this.responseGuard.bind(this), this.rejectConfig)

        list.forEach(item => {
            let name: string = this.getApiName(item)

            this[name] = function (val = {}, options = {}) {
                return this.sendMsg(item, val, options)
            }
        })
    }

    // 请求拦截
    requestGuard(config: any) {
        // 判断是否需要进行防抖操作
        let notDebounce

        this.apiList.some((item: ApiInterface) => {
            if (config.url.indexOf(item.url) !== -1) {
                notDebounce = item.notDebounce
                return true
            }
        })
        // 判断是否需要防止重复请求
        if (!notDebounce) {
            this.removeSource(config) //更新请求
            config.cancelToken = new this.CancelToken((c: any) => {
                this.sourcesList.push({ url: config.url, cancel: c })
            })
        }
        return config
    }
    // 响应拦截
    responseGuard(response: any) {
        let hideMessage,
            responseUrl = response.config.url.split(env.baseUrl)[1]

        this.apiList.some((item: ApiInterface) => {
            if (item.url === responseUrl) {
                hideMessage = item.hideMessage
                return true
            }
        })

        if ((response.status === 200 && response.data.code === 2000) || hideMessage) {
            return response
        } else {
            if (this.messageStatus) {
                this.messageStatus = false
                if (response.data.errorMsg || response.data.msg || response.msg) {
                    this.App.config.globalProperties.$message.error(response.data.errorMsg || response.data.msg || response.msg)
                }

                setTimeout(() => {
                    this.messageStatus = true
                }, 1000)
            }
            return Promise.reject(response)
        }
    }
    // 接口请求错误reject
    rejectConfig(err: any) {
        return Promise.reject(err)
    }
    // 移除已请求接口(防抖处理)
    removeSource(config: any) {
        // 当多次请求相同时，取消之前的请求
        this.sourcesList.some((item: ApiInterface, index: number) => {
            if (item.url === config.url) {
                this.sourcesList.splice(index, 1)
                return true
            }
        })
    }
    // 获取接口名字
    getApiName(item: ApiInterface): string {
        let apiName = '',
            arr = item.url.split('/')

        if (item.url) {
            apiName = item.apiName ? item.apiName : arr[arr.length - 1]
        } else {
            throw new Error('api对象必须要有url')
        }
        return apiName
    }
    //接口调用
    sendMsg(item: ApiInterface, value: {}, options: {}) {
        let config = this.getConfig(item, value, options)

        return this.instance(config).then((res: any) => {
            return res
        }).catch((err: { message: string }) => {
            if (err.message !== 'cancel') {
                if (this.messageStatus) {
                    this.messageStatus = false
                    this.App.config.globalProperties.$message.warning('系统服务出现异常，请稍后重试')

                    setTimeout(() => {
                        this.messageStatus = true
                    }, 1000)
                }
            }
            return Promise.reject(err)
        })
    }
    // 获取参数
    getConfig = function (item: ApiInterface, value: {}, options: { [x: string]: any }) {
        let method = item.method ? item.method : 'post',
            config: any = {}

        config.method = method
        config.url = item.url
        // 请求参数位置不用
        if (method === 'post') {
            config.data = value
        } else {
            config.params = value
        }

        Object.keys(options).forEach(key => {
            config[key] = options[key]
        })
        return config
    }
}

export default {
    install: (app: any) => {
        app.config.globalProperties.$http = new HttpInstance(app, apiList, env.baseUrl)
    }
}