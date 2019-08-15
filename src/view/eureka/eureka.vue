<template>
  <div>
    <div class="header">
      <Row type="flex" justify="space-between" class="code-row-bg">
        <i-Col span="4"><span class="header-col-title">TOTAL</span><span class="header-col-value">{{total}}</span></i-Col>
        <i-Col span="4"><span class="header-col-title">UP</span><span class="header-col-value">{{applications.up}}</span></i-Col>
        <i-Col span="4"><span class="header-col-title header-col-title-warn">DOWN</span><span class="header-col-value header-col-value-warn">{{applications.down}}</span></i-Col>
        <i-Col span="4"><span class="header-col-title header-col-title-warn">OUT_OF_SERVICE</span><span class="header-col-value header-col-value-warn">{{applications.out}}</span></i-Col>
        <i-Col span="4"><Button size="small" icon="md-sync" shape="circle" type="info" @click="getServiceData">REFRESH</Button></i-Col>
      </Row>
    </div>
    <div class="container">
      <Collapse accordion>
        <Panel v-for="(item,k) in applications.apps" :key="k" :name="item.name">
          {{item.name}}
          <Tag v-if="item.up > 0" color="blue">UP({{item.up}})</Tag>
          <Tag v-if="item.down > 0" color="red">DOWN({{item.down}})</Tag>
          <Tag v-if="item.out > 0" color="red">OUT_OF_SERVICE({{item.out}})</Tag>
          <div slot="content">
            <Card v-for="(instance,index) in item.instances" :key="index" class="container-collapse-card">
              <div slot="title" class="container-collapse-card-title">
                {{instance.instanceId}}
                <Tag v-if="instance.status==='UP'" color="blue">UP</Tag>
                <Tag v-if="instance.status==='DOWN'" color="red">DOWN</Tag>
                <Tag v-if="instance.status==='OUT_OF_SERVICE'" color="red">OUT_OF_SERVICE</Tag>
              </div>
              <Row class="container-collapse-card-row">
                <i-Col span="4">hostName</i-Col>
                <i-Col span="18">{{instance.hostName}}</i-Col>
              </Row>
              <Row class="container-collapse-card-row">
                <i-Col span="4">ipAddr</i-Col>
                <i-Col span="18">{{instance.ipAddr}}</i-Col>
              </Row>
              <Row class="container-collapse-card-row">
                <i-Col span="4">port</i-Col>
                <i-Col span="18">{{instance.port}}</i-Col>
              </Row>
              <Row class="container-collapse-card-row">
                <i-Col span="4">status</i-Col>
                <i-Col span="18">{{instance.status}}</i-Col>
              </Row>
              <Row class="container-collapse-card-row">
                <i-Col span="4">action</i-Col>
                <i-Col span="18">
                  <ButtonGroup size="small">
                    <Button type="error" @click="handleServiceDelete(instance.app, instance.instanceId, k, index)">DELETE</Button>
                    <Button type="warning" @click="handleServiceOut(instance.app, instance.instanceId, k, index)">OUT OF SERVICE</Button>
                    <Button type="success" @click="handleServiceUp(instance.app, instance.instanceId, k, index)">UP SERVICE</Button>
                  </ButtonGroup>
                </i-Col>
              </Row>
            </Card>
          </div>
        </Panel>
      </Collapse>
    </div>
  </div>
</template>

<script>
import {
  getServiceList,
  getService,
  deleteService,
  outOfService,
  upService } from '@/api/eureka'
export default {
  name: 'eureka_page',
  data () {
    return {
      applications: {
        up: 0,
        down: 0,
        out: 0,
        apps: [
          {
            name: '',
            up: 0,
            down: 0,
            out: 0,
            instances: []
          }
        ]
      }
    }
  },
  computed: {
    total () {
      return this.applications.down + this.applications.up + this.applications.out
    }
  },
  methods: {
    // 获取服务列表
    getServiceData () {
      getServiceList().then(res => {
        this.applications = res.data.data
        this.$Notice.success({
          title: 'success',
          desc: 'get eureka data success！'
        })
      }).catch(data => {
        this.$Notice.error({
          title: 'error',
          desc: data
        })
      })
    },
    // 注销实例
    handleServiceDelete (appId, instanceId, k, index) {
      deleteService(appId, instanceId).then(res => {
        if (res.data.ok) {
          this.$Notice.success({
            title: 'success',
            desc: 'delete service success, please refresh later！'
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
    // 暂停应用实例
    handleServiceOut (appId, instanceId, k, index) {
      outOfService(appId, instanceId).then(res => {
        if (res.data.ok) {
          // 刷新当前实例的信息
          this.handleInstanceRefresh(instanceId, k, index)
          this.$Notice.success({
            title: 'success',
            desc: 'out of service success！'
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
    // 恢复应用实例
    handleServiceUp (appId, instanceId, k, index) {
      upService(appId, instanceId).then(res => {
        if (res.data.ok) {
          // 刷新当前实例的信息
          this.handleInstanceRefresh(instanceId, k, index)
          this.$Notice.success({
            title: 'success',
            desc: 'up service success, please refresh later！'
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
    /**
     * 刷新某个实例的信息
     * @param instanceId 实例的ID
     * @param k apps的索引
     * @param index instance的索引
     */
    handleInstanceRefresh (instanceId, k, index) {
      getService(instanceId).then(res => {
        if (res.data.ok) {
          const data = Object.assign({}, this.applications)
          data.apps[k].instances[index] = res.data.data
          // 重新计算instances的UP、DOWN、OUT_OF_SERVICE的数量
          const instance_status__count = data.apps[k].instances.reduce((temp, item) => {
            switch (item.status) {
              case 'UP':
                temp.up++
                break
              case 'DOWN':
                temp.down++
                break
              case 'OUT_OF_SERVICE':
                temp.out++
                break
            }
            return temp
          }, {
            up: 0,
            down: 0,
            out: 0
          })
          data.apps[k] = Object.assign(data.apps[k], instance_status__count)
          // 重新计算applications的UP、DOWN、OUT_OF_SERVICE的数量
          const app_status_count = data.apps.reduce((temp, item) => {
            temp.up += item.up
            temp.down += item.down
            temp.out += item.out
            return temp
          }, {
            up: 0,
            down: 0,
            out: 0
          })
          this.applications = Object.assign(data, app_status_count)
        } else {
          this.$Notice.error({
            title: 'error',
            desc: 'refresh instance info error'
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
    this.getServiceData()
  }
}
</script>

<style lang="less" scoped>
.header {
  width: 80%;
  margin: 10px auto;
  &-col {
    &-title {
      font-size: 14px;
      color: #795548;
      font-weight: bold;
      &-warn {
        color: #F44336;
      }
    }
    &-value {
      margin-left:20px;
      font-size: 14px;
      color: #795548;
      &-warn {
        color: #F44336;
      }
    }
  }
}
.container {
  margin-top: 20px;
  &-collapse {
    &-card {
      margin-bottom: 10px;
      &-title {
        font-weight: bold;
      }
      &-row {
        font-size: 13px;
        margin-bottom: 5px;
      }
    }
  }
}
</style>
