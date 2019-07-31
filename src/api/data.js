import axios from '@/libs/api.request'

// 获取服务器列表信息
export const getServerList = () => {
  return axios.request({
    url: '/linux/group',
    method: 'get'
  })
}

// 获取服务器的docker信息
export const getDockerInfo = (ip) => {
  return axios.request({
    url: '/docker/container/list/' + ip,
    method: 'get'
  })
}

// 启动某个容器
export const startContainer = (ip, id) => {
  return axios.request({
    url: '/docker/container/start/' + ip + '/' + id,
    method: 'post'
  })
}

// 停止某个容器
export const stopContainer = (ip, id) => {
  return axios.request({
    url: '/docker/container/stop/' + ip + '/' + id,
    method: 'post'
  })
}

// 重启某个容器
export const restartContainer = (ip, id) => {
  return axios.request({
    url: '/docker/container/restart/' + ip + '/' + id,
    method: 'post'
  })
}

// 删除某个容器
export const removeContainer = (ip, id) => {
  return axios.request({
    url: '/docker/container/remove/' + ip + '/' + id,
    method: 'delete'
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
