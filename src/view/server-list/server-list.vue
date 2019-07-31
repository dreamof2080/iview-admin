<template>
  <div>
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
              <Button type="info" size="small" @click="handleDockerTagClick(item.ip)">Images</Button>
              <Button type="success" size="small" @click="handleDockerTagClick(item.ip)">Containers</Button>
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

    <Drawer :title="drawer.title" width="640" :draggable="true"  v-model="drawer.flag" class="drawer">
      <div class="drawer-header">
        <Row class="drawer-header-row">
          <i-Col span="6" class="drawer-header-row-name">Total</i-Col>
          <i-Col span="18">{{dockerInfo.containers}}</i-Col>
        </Row>
        <Row class="drawer-header-row">
          <i-Col span="8" class="drawer-header-row-name">Running</i-Col>
          <i-Col span="8" class="drawer-header-row-name">Stopped</i-Col>
          <i-Col span="8" class="drawer-header-row-name">Paused</i-Col>
        </Row>
        <Row class="drawer-header-row">
          <i-Col span="8">{{dockerInfo.containersRunning}}</i-Col>
          <i-Col span="8">{{dockerInfo.containersStopped}}</i-Col>
          <i-Col span="8">{{dockerInfo.containersPaused}}</i-Col>
        </Row>
      </div>

      <div class="drawer-details">
        <Collapse accordion>
          <Panel v-for="(item,k) in dockerInfo.containerList" :key="k" :name="item.id">
            {{item.names[0].substring(1)}}
            <Card slot="content" class="drawer-details-card">
              <Row class="drawer-details-card-row">
                <i-Col span="4">id</i-Col>
                <i-Col span="18">{{item.id}}</i-Col>
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
                    <Button size="small" type="dashed">show log</Button>
                  </ButtonGroup>
                </i-Col>
              </Row>
            </Card>
          </Panel>
        </Collapse>
      </div>
    </Drawer>

    <Modal
      v-model="removeModal.flag"
      title="please confirm"
      @on-ok="removeContainerOK(removeModal.containerId)">
      <p>Are you sure doing this？this cannot redo！</p>
    </Modal>
  </div>
</template>

<script>
import { getServerList, getDockerInfo, startContainer, stopContainer, restartContainer, removeContainer } from '@/api/data'
export default {
  name: 'server_list_page',
  data () {
    return {
      // 服务器信息列表
      server_list: [],
      drawer: {
        ip: '',
        title: '',
        flag: false
      },
      // 某个服务器对应的docker信息
      dockerInfo: {},
      // 删除容器模态提示框
      removeModal: {
        flag: false,
        containerId: ''
      }
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
    // 显示服务器的docker信息
    handleDockerTagClick (ip) {
      getDockerInfo(ip).then(res => {
        const { data } = res.data
        this.dockerInfo = data
        this.drawer.ip = ip
        this.drawer.title = 'Containers: ' + ip
        this.drawer.flag = true
      }).catch(data => {
        this.$Notice.error({
          title: 'error',
          desc: data
        })
      })
    },
    // 启动某个容器
    handleContainerStart (id, state) {
      if (state === 'running') {
        this.$Notice.warning({
          title: 'warning',
          desc: 'container is running！'
        })
      } else {
        startContainer(this.drawer.ip, id).then(res => {
          if (res.data.ok) {
            this.$Notice.success({
              title: 'success',
              desc: 'start container success！'
            })
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
      }
    },
    // 停止某个容器
    handleContainerStop (id, state) {
      if (state === 'exited') {
        this.$Notice.warning({
          title: 'warning',
          desc: 'container had exited！'
        })
      } else {
        stopContainer(this.drawer.ip, id).then(res => {
          if (res.data.ok) {
            this.$Notice.success({
              title: 'success',
              desc: 'container has stopped！'
            })
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
      }
    },
    // 重启某个容器
    handleContainerRestart (id) {
      restartContainer(this.drawer.ip, id).then(res => {
        if (res.data.ok) {
          this.$Notice.success({
            title: 'success',
            desc: 'container restart success！'
          })
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
    },
    // 删除某个容器
    handleContainerRemove (id) {
      this.removeModal.flag = true
      this.removeModal.containerId = id
    },
    // 删除某个容器模态框点击确定
    removeContainerOK (id) {
      removeContainer(this.drawer.ip, id).then(res => {
        if (res.data.ok) {
          this.$Notice.success({
            title: 'success',
            desc: 'container restart success！'
          })
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
      &-row{
        margin-bottom: 5px;
        color: #6c6d8e;
      }
    }
  }
}
</style>
