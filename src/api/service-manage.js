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

// 获取某个实例的数据
export const getService = (instanceId) => {
  return axios.request({
    url: '/eureka/service/instance',
    params: {
      token: store.state.user.token,
      instanceId: instanceId
    },
    method: 'get'
  })
}

// 注销实例
export const deleteService = (appId, instanceId) => {
  return axios.request({
    url: '/eureka/service/delete',
    params: {
      token: store.state.user.token,
      appId: appId,
      instanceId: instanceId
    },
    method: 'delete'
  })
}

// 暂停应用实例
export const outOfService = (appId, instanceId) => {
  return axios.request({
    url: '/eureka/service/out',
    params: {
      token: store.state.user.token,
      appId: appId,
      instanceId: instanceId
    },
    method: 'put'
  })
}

// 恢复应用实例
export const upService = (appId, instanceId) => {
  return axios.request({
    url: '/eureka/service/up',
    params: {
      token: store.state.user.token,
      appId: appId,
      instanceId: instanceId
    },
    method: 'put'
  })
}
