import axios from '@/libs/api.request'
import store from '@/store'

// 获取服务列表
export const getServiceList = () => {
  return axios.request({
    url: '/eureka/service/list',
    params: {
      token: store.state.user.token
    },
    method: 'get'
  })
}
