import axios from '@/libs/api.request'
import store from '@/store'

// 获取服务器列表信息
export const getServerList = () => {
  return axios.request({
    url: '/linux/group',
    params: {
      token: store.state.user.token
    },
    method: 'get'
  })
}

// 获取服务器的docker信息
export const getContainerList = (ip) => {
  return axios.request({
    url: '/docker/container/list/' + ip,
    params: {
      token: store.state.user.token
    },
    method: 'get'
  })
}

// 启动某个容器
export const startContainer = (ip, id) => {
  return axios.request({
    url: '/docker/container/start/' + ip + '/' + id,
    params: {
      token: store.state.user.token
    },
    method: 'post'
  })
}

// 停止某个容器
export const stopContainer = (ip, id) => {
  return axios.request({
    url: '/docker/container/stop/' + ip + '/' + id,
    params: {
      token: store.state.user.token
    },
    method: 'post'
  })
}

// 重启某个容器
export const restartContainer = (ip, id) => {
  return axios.request({
    url: '/docker/container/restart/' + ip + '/' + id,
    params: {
      token: store.state.user.token
    },
    method: 'post'
  })
}

// 删除某个容器
export const removeContainer = (ip, id) => {
  return axios.request({
    url: '/docker/container/remove/' + ip + '/' + id,
    params: {
      token: store.state.user.token
    },
    method: 'delete'
  })
}

// 获取镜像列表
export const getImageList = (ip) => {
  return axios.request({
    url: '/docker/image/list/' + ip,
    params: {
      token: store.state.user.token
    },
    method: 'get'
  })
}

// 删除某个镜像
export const removeImage = (ip, id) => {
  return axios.request({
    url: '/docker/image/remove/' + ip,
    params: {
      token: store.state.user.token,
      id: id
    },
    method: 'delete'
  })
}

// 创建镜像的tag
export const tagImage = (ip, id, repository, tag) => {
  return axios.request({
    url: '/docker/image/tag/' + ip,
    params: {
      token: store.state.user.token,
      id: id,
      repository: repository,
      tag: tag
    },
    method: 'put'
  })
}

// push image
export const pushImage = (ip, repository) => {
  return axios.request({
    url: '/docker/image/push/' + ip,
    params: {
      token: store.state.user.token,
      repository: repository
    },
    method: 'post'
  })
}

// pull image
export const pullImage = (ip, imageName, isLocal) => {
  return axios.request({
    url: '/docker/image/pull/' + ip,
    params: {
      token: store.state.user.token,
      name: imageName,
      isLocal: isLocal
    },
    method: 'post'
  })
}

// 创建容器
export const createContainer = (ip, id, containerName, ports, volumes) => {
  return axios.request({
    url: '/docker/image/createContainer/' + ip,
    params: {
      token: store.state.user.token,
      id: id,
      name: containerName,
      ports: ports,
      volumes: volumes
    },
    method: 'put'
  })
}

// 获取容器日志数据
export const getContainerLog = (ip, id, startDateTime, tail) => {
  return axios.request({
    url: '/docker/container/log/' + ip + '/' + id + '/' + startDateTime + '/' + tail,
    params: {
      token: store.state.user.token
    },
    method: 'get'
  })
}

export const getTableData = () => {
  return axios.request({
    url: 'get_table_data',
    method: 'get'
  })
}

export const getDragList = () => {
  return axios.request({
    url: 'get_drag_list',
    method: 'get'
  })
}

export const errorReq = () => {
  return axios.request({
    url: 'error_url',
    method: 'post'
  })
}

export const saveErrorLogger = info => {
  return axios.request({
    url: 'save_error_logger',
    data: info,
    method: 'post'
  })
}

export const uploadImg = formData => {
  return axios.request({
    url: 'image/upload',
    data: formData
  })
}

export const getOrgData = () => {
  return axios.request({
    url: 'get_org_data',
    method: 'get'
  })
}

export const getTreeSelectData = () => {
  return axios.request({
    url: 'get_tree_select_data',
    method: 'get'
  })
}
