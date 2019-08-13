<template>
  <div>
<!--    服务器显示列表-->
    <div class="grid">
      <Card :bordered="false" v-for="(item,k) in server_list" :key="k" class="grid-card">
        <p slot="title" class="grid-card-title">{{item.ip}}</p>
        <Row class="grid-card-row">
          <i-Col span="12" class="grid-card-row-col"><p>Name</p></i-Col>
          <i-Col span="12">{{item.name}}</i-Col>
        </Row>
        <Row class="grid-card-row">
          <i-Col span="12" class="grid-card-row-col"><p>UseFor</p></i-Col>
          <i-Col span="12">{{item.useFor}}</i-Col>
        </Row>
        <Row class="grid-card-row">
          <i-Col span="12" class="grid-card-row-col"><p>Docker</p></i-Col>
          <i-Col span="12">
            <p v-if="!item.isDocker">NO</p>
            <ButtonGroup  v-if="item.isDocker" class="grid-card-row-col-button">
              <Button type="info" size="small" @click="handleDockerImageClick(item.ip)">Images</Button>
              <Button type="success" size="small" @click="handleDockerContainerClick(item.ip)">Containers</Button>
            </ButtonGroup>
          </i-Col>
        </Row>
        <Row class="grid-card-row">
          <i-Col span="12" class="grid-card-row-col"><p>Average Warning</p></i-Col>
          <i-Col span="12">{{item.average}}s</i-Col>
        </Row>
        <Row class="grid-card-row">
          <i-Col span="12" class="grid-card-row-col"><p>Managers</p></i-Col>
          <i-Col span="12">{{item.managers}}</i-Col>
        </Row>
      </Card>
    </div>
<!--    抽屉显示容器信息或镜像信息-->
    <Drawer :title="drawer.title" width="840" :draggable="true"  v-model="drawer.flag" class="drawer">
      <Spin fix v-if="drawer.spinShow">
        <Icon type="ios-loading" size=18 class="spin-icon-load"></Icon>
        <div>Loading</div>
      </Spin>
      <div class="drawer-header">
        <Row class="drawer-header-row">
          <i-Col span="6" class="drawer-header-row-name">Total</i-Col>
          <i-Col span="12">{{drawer.type==='container'?containers.total:images.total}}</i-Col>
          <i-Col span="6" v-if="drawer.type==='image'"><Button type="info" size="small" @click="handleShowPull">pull image</Button></i-Col>
        </Row>
        <Row v-if="drawer.type==='container'" class="drawer-header-row">
          <i-Col span="8" class="drawer-header-row-name">Running</i-Col>
          <i-Col span="8" class="drawer-header-row-name">Exited</i-Col>
          <i-Col span="8" class="drawer-header-row-name">Paused</i-Col>
        </Row>
        <Row v-if="drawer.type==='container'" class="drawer-header-row">
          <i-Col span="8">{{containers.running}}</i-Col>
          <i-Col span="8">{{containers.exited}}</i-Col>
          <i-Col span="8">{{containers.paused}}</i-Col>
        </Row>
        <Row v-if="drawer.type==='image'">
          <i-Col span="8"><Input v-model="searchText" size="small" search placeholder="Enter repository..." /></i-Col>
        </Row>
      </div>

      <div class="drawer-details">
        <!--          镜像信息-->
        <Card class="drawer-details-card" v-for="(item,k) in images.list" :key="k" :name="item.id"  v-if="drawer.type === 'image' && item.repoTags.toLocaleString().indexOf(searchText)>-1">
          <Row class="drawer-details-card-row">
            <i-Col span="4">id</i-Col>
            <i-Col span="18">{{item.id}}</i-Col>
          </Row>
          <Row class="drawer-details-card-row">
            <i-Col span="4">parentId</i-Col>
            <i-Col span="18">{{item.parentId}}</i-Col>
          </Row>
          <Row class="drawer-details-card-row">
            <i-Col span="4">created</i-Col>
            <i-Col span="18">{{item.created}}</i-Col>
          </Row>
          <Row class="drawer-details-card-row">
            <i-Col span="4">repoTags</i-Col>
            <i-Col span="18">
              <div v-for="(repo, index) in item.repoTags" :key="index" class="drawer-details-card-row-repo">
                {{repo}}
                <ButtonGroup>
                  <Button size="small" type="warning" ghost @click="handleImageRemove(repo)">remove</Button>
                  <Button size="small" type="success" ghost @click="handleImageTag(item.id, repo)">tag</Button>
                  <Button size="small" type="primary" ghost @click="handleImagePush(repo)">push</Button>
                  <Button size="small" type="info" ghost @click="handleShowContainerCreate(repo)">create container</Button>
                </ButtonGroup>
              </div>
            </i-Col>
          </Row>
          <Row class="drawer-details-card-row">
            <i-Col span="4">size</i-Col>
            <i-Col span="18">{{(item.size/1024/1024).toFixed(2)}}MB</i-Col>
          </Row>
          <Row class="drawer-details-card-row">
            <i-Col span="4">action</i-Col>
            <i-Col span="18">
              <ButtonGroup>
                <Button size="small" type="error" @click="handleImageRemove(item.id)">remove</Button>
              </ButtonGroup>
            </i-Col>
          </Row>
        </Card>
        <!--          容器信息-->
        <Collapse v-if="drawer.type==='container'" accordion>
          <Panel v-for="(item,k) in containers.list" :key="k" :name="item.id">
            {{item.names[0].substring(1)}}
            <Tag v-if="item.state==='running'" color="blue">Running</Tag>
            <Tag v-if="item.state==='exited'" color="red">Exited</Tag>
            <Tag v-if="item.state==='paused'" color="orange">Paused</Tag>
            <Card slot="content" class="drawer-details-card">
              <Row class="drawer-details-card-row">
                <i-Col span="4">id</i-Col>
                <i-Col span="18">{{item.id.substring(0,12)}}</i-Col>
              </Row>
              <Row class="drawer-details-card-row">
                <i-Col span="4">image</i-Col>
                <i-Col span="18">{{item.image}}</i-Col>
              </Row>
              <Row class="drawer-details-card-row">
                <i-Col span="4">created</i-Col>
                <i-Col span="18">{{item.created}}</i-Col>
              </Row>
              <Row class="drawer-details-card-row">
                <i-Col span="4">state</i-Col>
                <i-Col span="18">{{item.state}}</i-Col>
              </Row>
              <Row class="drawer-details-card-row">
                <i-Col span="4">ports</i-Col>
                <i-Col span="18"><p v-for="(port, index) in item.ports" :key="index">{{port.IP}}:{{port.PublicPort}} -> {{port.PrivatePort}} / {{port.Type}}</p></i-Col>
              </Row>
              <Row class="drawer-details-card-row">
                <i-Col span="4">command</i-Col>
                <i-Col span="18">{{item.command}}</i-Col>
              </Row>
              <Row class="drawer-details-card-row">
                <i-Col span="4">status</i-Col>
                <i-Col span="18">{{item.status}}</i-Col>
              </Row>
              <Row class="drawer-details-card-row">
                <i-Col span="4">action</i-Col>
                <i-Col span="18">
                  <ButtonGroup>
                    <Button size="small" type="primary" @click="handleContainerStart(item.id, item.state)">start</Button>
                    <Button size="small" type="info" @click="handleContainerStop(item.id, item.state)">stop</Button>
                    <Button size="small" type="success" @click="handleContainerRestart(item.id)">restart</Button>
                    <Button size="small" type="error" @click="handleContainerRemove(item.id)">remove</Button>
                    <Button size="small" type="dashed" @click="handleShowLog(item.id)">show log</Button>
                  </ButtonGroup>
                </i-Col>
              </Row>
            </Card>
          </Panel>
        </Collapse>
      </div>
    </Drawer>

<!--    显示日志对话框-->
    <Modal
      v-model="logModel.flag"
      title="选择开始日期和行数"
      @on-ok="handleLogModal">
      <Row class="modal-row">
        <i-Col span="6">
          日期
        </i-Col>
        <i-Col span="18">
          <DatePicker type="datetime" format="yyyy-MM-dd HH:mm:ss" value="yyyy-MM-dd HH:mm:ss" size="small" placeholder="Select date" style="width: 200px" @on-change="setDateTime"></DatePicker>
        </i-Col>
      </Row>
      <Row>
        <i-Col span="6">
          显示行数
        </i-Col>
        <i-Col span="18">
          <Input type="number" v-model="logModel.tail" size="small" placeholder="Enter something..." style="width: 200px"/>
        </i-Col>
      </Row>
    </Modal>

<!--    日志显示-->
    <Modal
      v-model="logDetail.flag"
      title="日志信息"
      fullscreen
      footer-hide>
      <pre class="logDetail-pre">{{logDetail.log}}</pre>
    </Modal>

    <!--    拉取镜像-->
    <Modal
      width="400"
      v-model="pull.flag"
      title="pull image"
      @on-ok="handleImagePull">
      <Row class="modal-row">
        <i-Col span="6">
          image name
        </i-Col>
        <i-Col span="18">
          <Input type="text" v-model="pull.name" size="small" placeholder="please enter image name" style="width: 250px"/>
        </i-Col>
      </Row>
      <Row>
        <i-Col span="6">
          local registry
        </i-Col>
        <i-Col span="18">
          <Select v-model="pull.isLocal" size="small" style="width:100px">
            <Option :value="0" :key="0">NO</Option>
            <Option :value="1" :key="1">YES</Option>
          </Select>
        </i-Col>
      </Row>
    </Modal>

    <!--    创建容器-->
    <Modal
      width="500"
      v-model="createContainer.flag"
      title="create container"
      @on-ok="handleContainerCreate">
      <Row class="modal-row">
        <i-Col span="6">
          Container Name
        </i-Col>
        <i-Col span="18">
          <Input type="text" v-model="createContainer.name" size="small" placeholder="please enter container name" style="width: 300px"/>
        </i-Col>
      </Row>
      <Row class="modal-row">
        <i-Col span="6">
          Port Bindings
        </i-Col>
        <i-Col span="18">
          <Input type="textarea" :rows="4" v-model="createContainer.ports" size="small" placeholder="{5001:8066,5002:8067,...}" style="width: 300px"/>
        </i-Col>
      </Row>
      <Row>
        <i-Col span="6">
          Volume Bindings
        </i-Col>
        <i-Col span="18">
          <Input type="textarea" :rows="4" v-model="createContainer.volumes" size="small" placeholder="{'/bestlink/tomcat8/logs':'/oa/tomcat/logs','/bestlink/tomcat8/webapps':'/oa/tomcat/webapps',...}" style="width: 300px"/>
        </i-Col>
      </Row>
    </Modal>
  </div>
</template>

<script>
import {
  getServerList,
  getContainerList,
  startContainer,
  stopContainer,
  restartContainer,
  removeContainer,
  getContainerLog,
  getImageList,
  removeImage,
  tagImage,
  pushImage,
  pullImage,
  createContainer } from '@/api/data'
export default {
  name: 'server_list_page',
  data () {
    return {
      // 服务器信息列表
      server_list: [],
      drawer: {
        ip: '',
        spinShow: false,
        title: '',
        flag: false,
        // container|image
        type: ''
      },
      // 某个服务器对应的镜像信息
      images: {},
      // 某个服务器对应的容器信息
      containers: {},
      // 显示日志对话模态框
      logModel: {
        flag: false,
        id: '',
        dateTime: '',
        tail: 0
      },
      // 日志
      logDetail: {
        flag: false,
        log: ''
      },
      // 临时信息记录
      tempValue: '',
      // 拉取镜像
      pull: {
        flag: false,
        name: '',
        isLocal: 0
      },
      // 创建容器
      createContainer: {
        flag: false,
        // 容器ID或repo:tag
        id: '',
        // 容器名称
        name: '',
        // 端口映射
        ports: '',
        // 挂载映射
        volumes: ''
      },
      // 镜像搜索
      searchText: ''
    }
  },
  computed: {

  },
  methods: {
    // 获取服务器列表信息
    getServerData () {
      getServerList().then(res => {
        const { data } = res.data
        this.server_list = data
      }).catch(data => {
        this.$Notice.error({
          title: 'error',
          desc: data
        })
      })
    },
    // 显示服务器的docker的镜像信息
    handleDockerImageClick (ip) {
      this.drawer.spinShow = true
      getImageList(ip).then(res => {
        const { data } = res.data
        this.images = data
        this.drawer.ip = ip
        this.drawer.title = 'Images: ' + ip
        this.drawer.flag = true
        this.drawer.type = 'image'
        this.drawer.spinShow = false
      }).catch(data => {
        this.$Notice.error({
          title: 'error',
          desc: data
        })
        this.drawer.spinShow = false
      })
    },
    // 显示服务器的docker的容器信息
    handleDockerContainerClick (ip) {
      this.drawer.spinShow = true
      getContainerList(ip).then(res => {
        const { data } = res.data
        this.containers = data
        this.drawer.ip = ip
        this.drawer.title = 'Containers: ' + ip
        this.drawer.flag = true
        this.drawer.type = 'container'
        this.drawer.spinShow = false
      }).catch(data => {
        this.$Notice.error({
          title: 'error',
          desc: data
        })
        this.drawer.spinShow = false
      })
    },
    // 启动容器
    handleContainerStart (id, state) {
      if (state === 'running') {
        this.$Notice.warning({
          title: 'warning',
          desc: 'container is running！'
        })
      } else {
        this.drawer.spinShow = true
        startContainer(this.drawer.ip, id).then(res => {
          if (res.data.ok) {
            this.$Notice.success({
              title: 'success',
              desc: 'start container success！'
            })
            // 刷新drawer
            this.handleDockerContainerClick(this.drawer.ip)
          } else {
            this.$Notice.error({
              title: 'error',
              desc: res.data.msg
            })
            this.drawer.spinShow = false
          }
        }).catch(data => {
          this.$Notice.error({
            title: 'error',
            desc: data
          })
          this.drawer.spinShow = false
        })
      }
    },
    // 停止容器
    handleContainerStop (id, state) {
      if (state === 'exited') {
        this.$Notice.warning({
          title: 'warning',
          desc: 'container had exited！'
        })
      } else {
        this.drawer.spinShow = true
        stopContainer(this.drawer.ip, id).then(res => {
          if (res.data.ok) {
            this.$Notice.success({
              title: 'success',
              desc: 'container has stopped！'
            })
            // 刷新drawer
            this.handleDockerContainerClick(this.drawer.ip)
          } else {
            this.$Notice.error({
              title: 'error',
              desc: res.data.msg
            })
            this.drawer.spinShow = false
          }
        }).catch(data => {
          this.$Notice.error({
            title: 'error',
            desc: data
          })
          this.drawer.spinShow = false
        })
      }
    },
    // 重启容器
    handleContainerRestart (id) {
      this.drawer.spinShow = true
      restartContainer(this.drawer.ip, id).then(res => {
        if (res.data.ok) {
          this.$Notice.success({
            title: 'success',
            desc: 'container restart success！'
          })
          // 刷新drawer
          this.handleDockerContainerClick(this.drawer.ip)
        } else {
          this.$Notice.error({
            title: 'error',
            desc: res.data.msg
          })
          this.drawer.spinShow = false
        }
      }).catch(data => {
        this.$Notice.error({
          title: 'error',
          desc: data
        })
        this.drawer.spinShow = false
      })
    },
    // 删除容器
    handleContainerRemove (id) {
      this.$Modal.confirm({
        title: 'warning',
        content: '<p>Are you sure remove this container？</p><p>this cannot redo！</p>',
        onOk: () => {
          this.drawer.spinShow = true
          removeContainer(this.drawer.ip, id).then(res => {
            if (res.data.ok) {
              this.$Notice.success({
                title: 'success',
                desc: 'container remove success！'
              })
              // 刷新drawer
              this.handleDockerContainerClick(this.drawer.ip)
            } else {
              this.$Notice.error({
                title: 'error',
                desc: res.data.msg
              })
              this.drawer.spinShow = false
            }
          }).catch(data => {
            this.$Notice.error({
              title: 'error',
              desc: data
            })
            this.drawer.spinShow = false
          })
        }
      })
    },
    // 删除镜像
    handleImageRemove (id) {
      this.$Modal.confirm({
        title: 'warning',
        content: '<p>Are you sure remove this image？</p><p>this cannot redo！</p>',
        onOk: () => {
          this.drawer.spinShow = true
          removeImage(this.drawer.ip, id).then(res => {
            if (res.data.ok) {
              this.$Notice.success({
                title: 'success',
                desc: 'image remove success！'
              })
              // 刷新drawer
              this.handleDockerImageClick(this.drawer.ip)
            } else {
              this.$Notice.error({
                title: 'error',
                desc: res.data.msg
              })
              this.drawer.spinShow = false
            }
          }).catch(data => {
            this.$Notice.error({
              title: 'error',
              desc: data
            })
            this.drawer.spinShow = false
          })
        }
      })
    },
    // 创建镜像的tag
    handleImageTag (id, repository) {
      this.tempValue = ''
      this.$Modal.confirm({
        title: 'Please enter your tag',
        onOk: () => {
          this.drawer.spinShow = true
          this.tempValue = this.tempValue ? this.tempValue : 'latest'
          tagImage(this.drawer.ip, id, repository, this.tempValue).then(res => {
            if (res.data.ok) {
              this.$Notice.success({
                title: 'success',
                desc: 'create tag success！'
              })
              // 刷新drawer
              this.handleDockerImageClick(this.drawer.ip)
            } else {
              this.$Notice.error({
                title: 'error',
                desc: res.data.msg
              })
              this.drawer.spinShow = false
            }
          }).catch(data => {
            this.$Notice.error({
              title: 'error',
              desc: data
            })
            this.drawer.spinShow = false
          })
        },
        render: (h) => {
          return h('Input', {
            props: {
              value: this.tempValue,
              autofocus: true,
              placeholder: 'if tag is null, then default value is latest'
            },
            on: {
              input: (val) => {
                this.tempValue = val
              }
            }
          })
        }
      })
    },
    // push镜像
    handleImagePush (id) {
      this.$Modal.confirm({
        title: 'warning',
        content: '<p>Are you sure push this image？</p>',
        onOk: () => {
          this.drawer.spinShow = true
          pushImage(this.drawer.ip, id).then(res => {
            if (res.data.ok) {
              this.$Notice.success({
                title: 'success',
                desc: 'push image success！'
              })
              this.drawer.spinShow = false
            } else {
              this.$Notice.error({
                title: 'error',
                desc: res.data.msg
              })
              this.drawer.spinShow = false
            }
          }).catch(data => {
            this.$Notice.error({
              title: 'error',
              desc: data
            })
            this.drawer.spinShow = false
          })
        }
      })
    },
    // 显示日志
    handleShowLog (id) {
      this.logModel.flag = true
      this.logModel.id = id
    },
    // 日志选择日期时间时触发设置logModel.dateTime字段
    setDateTime (date) {
      this.logModel.dateTime = date
    },
    // 获取日志信息
    handleLogModal () {
      if (this.logModel.dateTime && this.logModel.tail) {
        getContainerLog(this.drawer.ip, this.logModel.id, this.logModel.dateTime, this.logModel.tail).then(res => {
          if (res.data.ok) {
            this.logDetail.flag = true
            this.logDetail.log = res.data.data
          } else {
            this.$Notice.error({
              title: 'error',
              desc: res.data.msg
            })
          }
        }).catch(data => {
          this.$Notice.error({
            title: 'error',
            desc: data
          })
        })
      } else {
        this.$Message.warning('please write all data!')
      }
    },
    // 显示拉取镜像的模态框
    handleShowPull () {
      this.pull.flag = true
    },
    // 拉取镜像
    handleImagePull () {
      this.drawer.spinShow = true
      pullImage(this.drawer.ip, this.pull.name, this.pull.isLocal).then(res => {
        if (res.data.ok) {
          this.$Notice.success({
            title: 'success',
            desc: 'pull image success！'
          })
          // 刷新drawer
          this.handleDockerImageClick(this.drawer.ip)
        } else {
          this.$Notice.error({
            title: 'error',
            desc: res.data.msg
          })
          this.drawer.spinShow = false
        }
      }).catch(data => {
        this.$Notice.error({
          title: 'error',
          desc: data
        })
        this.drawer.spinShow = false
      })
    },
    // 创建容器模态框
    handleShowContainerCreate (id) {
      this.createContainer.id = id
      this.createContainer.flag = true
    },
    // 创建容器
    handleContainerCreate () {
      this.drawer.spinShow = true
      createContainer(this.drawer.ip, this.createContainer.id, this.createContainer.name, this.createContainer.ports, this.createContainer.volumes).then(res => {
        if (res.data.ok) {
          this.$Notice.success({
            title: 'success',
            desc: 'create container success！'
          })
          this.drawer.spinShow = false
        } else {
          this.$Notice.error({
            title: 'error',
            desc: res.data.msg
          })
          this.drawer.spinShow = false
        }
      }).catch(data => {
        this.$Notice.error({
          title: 'error',
          desc: data
        })
        this.drawer.spinShow = false
      })
    }
  },
  mounted () {
    this.getServerData()
  }
}
</script>

<style lang="less">
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, 300px);
  gap: 20px 20px;
  &-card {
    width: 300px;
    height: 200px;
    background-color: #ddd;
    &-title {
      text-align: center;
    }
    &-row {
      font-size: 13px;
      margin-bottom: 5px;
      &-col {
        p {
          color: #776d6c;
        }
      }
    }
  }
}
.drawer {
  &-header {
    margin-bottom: 50px;
    font-size: 13px;
    color: #5d6c7b;
    &-row {
      padding-bottom: 10px;
      margin-bottom: 5px;
      border-bottom: 1px dashed #ecf8ff;
      &-name {
        color: #7f838a;
      }
    }
  }
  &-details {
    font-size: 13px;
    &-card {
      font-size: 13px;
      margin-bottom: 5px;
      &-row{
        margin-bottom: 5px;
        color: #6c6d8e;
        &-repo {
          margin-bottom: 3px;
        }
      }
    }
  }
}
.modal-row {
  margin-bottom: 5px;
}
.spin-icon-load{
  animation: ani-demo-spin 1s linear infinite;
}

</style>
