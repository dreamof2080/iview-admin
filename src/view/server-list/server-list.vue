<template>
  <div class="grid">
    <Card :bordered="false">
      <p slot="title">Borderless card</p>
      <p>Content of card</p>
      <p>Content of card</p>
      <p>Content of card</p>
    </Card>
  </div>
</template>

<script>
// import InforCard from '_c/info-card'
// import CountTo from '_c/count-to'
// import { getOrgData } from '@/api/data'
export default {
  name: 'server_list_page',
  data () {
    return {
      server_list: []
    }
  },
  computed: {

  },
  methods: {
    // getDepartmentData () {
    //   getOrgData().then(res => {
    //     const { data } = res
    //     this.data = data
    //   })
    // }
  },
  mounted () {
    // this.getDepartmentData()
  }
}
</script>

<style lang="less">
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, 220px);
  gap: 20px 20px;
  & > div {
    width: 220px;
    height: 150px;
  }
}
</style>
