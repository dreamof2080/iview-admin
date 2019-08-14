<template>
  <div>eureka服务管理</div>
</template>

<script>
import { getServiceList } from '@/api/eureka'
export default {
  name: 'eureka_page',
  data () {
    return {}
  },
  computed: {},
  methods: {
    // 获取服务列表
    getServiceData () {
      getServiceList().then(res => {
        console.log(res)
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

<style scoped>

</style>
