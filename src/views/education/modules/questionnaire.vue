<template>
  <div class="operating-record-wrapper">
    <h3>1.学舞目的</h3>
    <p>{{questionInfo.dancePurpose}}</p>
    <h3>2.报名时的职业</h3>
    <p>{{questionInfo.oneJob}}{{questionInfo.twoJob?'/'+questionInfo.twoJob:''}}</p>
    <h3>3.请问在什么情景下，您有了强烈的想法想要去报班学舞蹈？</h3>
    <p>{{questionInfo.question3}}</p>
    <h3>4.请问您期望通过学舞蹈改变自己目前的什么现状（工作、生活、个人）？</h3>
    <p>{{questionInfo.question4}}</p>
    <h3>5.请问您选择舞蹈培训机构的时候，最关注哪些方面？</h3>
    <p>{{questionInfo.question5}}</p>
    <h3>6.请问您报班前最大的顾虑是什么？什么原因打消了您的顾虑？</h3>
    <p>{{questionInfo.question6}}</p>
    <h3>7.请问您最后选择单色的核心原因是什么？</h3>
    <p>{{questionInfo.question7}}</p>
  </div>
</template>
<script>
export default {
  name: 'operatingRecord',
  props: {
    loadData: {
      type: Function
    },
    stuId: {
      type: String,
      default: ''
    }
  },
  components: {

  },
  watch: {
    stuId(nv) {
      if (nv) {
        // 拿到studentId以后请求数据渲染列表
        this.getTable()
      }
    }
  },
  data() {
    return {
      questionInfo:{}
    }
  },
  created() {
    this.getTable()
  },
  methods: {
    downloadAttach(data) {
      const { logId } = data
      this.$refs.download.open(logId)
    },
    getTable() {
      this.loadData().then(res => {
        if(res.data){
          this.questionInfo = res.data
          if(this.questionInfo.dancePurpose)this.questionInfo.dancePurpose=res.data.dancePurpose.replace('@_','')
        }else{
          this.questionInfo={}
        }

      })
    },
    refresh(){
      this.getTable()
    },
  }
}
</script>

<style scoped>
p{
  padding: 18px 0 ;
  text-indent: 1em;
}
</style>
