<template>
  <div style="width:100%;overflow-x:auto;">
    <div class="wc-wrapper">
      <div class="checkUsedRoom" ref="elementBtn">
          <div class="flex">
            <div >颜色选择：</div>
            <div class='changeColor' v-for="(item,index) in classTypeColorList" :key='index' :style="item.bgColor"  @click='colorIndex=index'>
            </div>
            <div class="ml20">样式：
              <a-select default-value="A" style="width: 120px"  v-model="type" @change="typeChange">
                <a-select-option value="A">
                  全舞种
                </a-select-option>
                <a-select-option value="B">
                  单舞种
                </a-select-option>
              </a-select>
            </div>

          </div>
        <a-button @click="generateImages">下载课表 <a-icon type="download" /></a-button>
      </div>
      <div class="course-container" :style="classTypeColorList[colorIndex].bgColor" >
        <div class='course-containerBg'>
          <div class='course-header'>
            <div class='imgBg' :style='classTypeColorList[colorIndex].imgColor'>
              <img src="~@/assets/logoClass.png" class="icon" style='width:65%;' />
            </div>
            <div style='font-weight: 700;font-size:60px;color:#000;padding: 20px 0 0 0;line-height: 1;'>
              {{schoolName}}
            </div>
            <div style='text-align: right;padding: 0 241px 10px 0;font-weight: 700;font-size: 25px;color: #000;'>
              ({{classType}})
            </div>
          </div>
          <a-row :gutter="16" type="flex" justify="space-between" align="top" class="course-week">
            <a-col :lg="3" :md="3" :sm="3" v-for="(item, index) in weekOptions" :key="index">
              <div class="course-week-title">{{ item.weekStr }}</div>
            </a-col>
          </a-row>
          <div class="week-list">
            <a-spin :spinning="dataLoading">
              <div  class="course-item" >
                <div v-show="type==='B'" class="danceNameTitle" :style="classTypeColorList[colorIndex].weekColorEven">舞种</div>
                <div  v-for="(item, index) in weekCourseList[0].data" :key="index" class='course-item-list'>
                  <div class="wc-class">
                    <div class='wc-class-week'  :style="index%2===0?classTypeColorList[colorIndex].weekColorOdd:classTypeColorList[colorIndex].weekColorEven">
                      <div class='wc-class-date'>{{item.time}}</div>
                      <div>{{weekOptions[item.week-1]}}</div>
                    </div>
                  </div>
                </div>
              </div >
              <div  v-for="(col, colIndex) in weekCourseList" :key="colIndex" :style="type==='B'?`height:${col.data[0].data.length*146}px;`:''">
                <div  class="course-item">
                    <div class="danceName" v-show="type==='B'"><div :style="classTypeColorList[colorIndex].bgTitleColor" >{{col.danceName}}</div></div>
                    <div  v-for="(item, index) in col.data" :key="index" class='course-item-list'>
                      <div class="wc-class">
                        <div class="wc-class-list" :style="classTypeColorList[colorIndex].classColor" v-for="(val, classIndex) in item.data " :key="classIndex">
                          <div class="wc-roomName" :style="classTypeColorList[colorIndex].roomNameColor" ><span v-if='val.danceName' class="mr10">{{ `${val.danceName}` }}</span> <span v-if='val.teacherName'>{{val.teacherName}}</span></div>
                          <div class="wc-className"  v-if='val.startTime'>{{ `${val.startTime}-${val.endTime}` }}</div>
                          <div class="wc-className"  v-if='val.className'>{{ `${val.className}` }}</div>
                          <div class="wc-roomName"  v-if='val.roomName'>{{ `${val.roomName}` }}</div>
                          <div class="wc-className"  v-if='val.classDiff' >
                            <a-rate style='font-size: 15px;color:#000;' :default-value="val.classDiff" allow-half disabled :count='val.classDiff'/>
                          </div>
                        </div>
                      </div>
                    </div>
                </div>
              </div>
            </a-spin>
          </div>
        </div>
      </div>
    </div>
    <!-- 要生成的图片的内容区域 -->
    <div class="content" style='display: none;'></div>
  </div>
</template>
<script>
import { weekSchedule } from '@/api/education'
import html2canvas from 'html2canvas'
const weekOptions = ['星期一','星期二','星期三','星期四','星期五','星期六','星期日']
const classTypeColorList = [
  //红1
  {
    bgTitleColor:'background: linear-gradient(to bottom, #fec9eb, #f87879);',
    bgColor:'background: linear-gradient(to bottom, #fd9caf, #ff72ac);',
    weekColorOdd:'background: #feeef1;box-shadow: 0 0 2px 5px #f7aeb5;',
    weekColorEven:'background: #fecaed;box-shadow: 0 0 2px 5px #f7aeb5;',
    classColor:'box-shadow: 0 0 5px 5px #fbf0f4;',
    roomNameColor:'color:#dc56b7;',
    imgColor:'background:#fb068f;'
  },
  //绿2
  {
    bgTitleColor:'background: linear-gradient(to bottom, #abecd7,#25bd91);',
    bgColor:'background: linear-gradient(to bottom, #9af9da,#25bd91);',
    weekColorOdd:'background:  #abecd7;box-shadow: 0 0 2px 5px #53b495;',
    weekColorEven:'background: #24bd8b;box-shadow: 0 0 2px 5px #53b495;',
    classColor:'box-shadow: 0 0 5px 5px #75e0be;',
    roomNameColor:'color:#19a97b;',
    imgColor:'background:#25bd91;'
  },
  //红橙3
  {
    bgTitleColor:'background: linear-gradient(to bottom, #ffa3a3,#983131);',
    bgColor:'background: linear-gradient(to bottom, #ff5d5d,#983131);',
    weekColorOdd:'background:  #ffa3a3;box-shadow: 0 0 2px 5px #e06161;',
    weekColorEven:'background: #ea6060;box-shadow: 0 0 2px 5px #e06161;',
    classColor:'box-shadow: 0 0 5px 5px #ffc5c5;',
    roomNameColor:'color:#ef4343;',
    imgColor:'background:#c54646;'
  },
  //紫4
  {
    bgTitleColor:'background: linear-gradient(to bottom, #d3b0e9,#9a47b5);',
    bgColor:'background: linear-gradient(to bottom, #ce9de0,#9a47b5);',
    weekColorOdd:'background:  #d3b0e9;box-shadow: 0 0 2px 5px #d37de5;',
    weekColorEven:'background: #d084df;box-shadow: 0 0 2px 5px #d37de5;',
    classColor:'box-shadow: 0 0 5px 5px #e7bced;',
    roomNameColor:'color:#b36be5;',
    imgColor:'background:#b55bd3;'
  },
  //黄5
  {
    bgTitleColor:'background: linear-gradient(to bottom, #fdffba,#ede07d);',
    bgColor:'background: linear-gradient(to bottom, #fff28f,#ede07d);',
    weekColorOdd:'background:  #fdffba;box-shadow: 0 0 2px 5px #f2f071;',
    weekColorEven:'background: #fff28f;box-shadow: 0 0 2px 5px #f2f071;',
    classColor:'box-shadow: 0 0 5px 5px #faffd9;',
    roomNameColor:'color:#000;',
    imgColor:'background:#ffe417;'
  },
  //蓝6
  {
    bgTitleColor:'background: linear-gradient(to bottom, #b9d7f5,#57a7f7);',
    bgColor:'background: linear-gradient(to bottom, #abcdef,#57a7f7);',
    weekColorOdd:'background:  #b9d7f5;box-shadow: 0 0 2px 5px #94caff;',
    weekColorEven:'background: #88baec;box-shadow: 0 0 2px 5px #94caff;',
    classColor:'box-shadow: 0 0 5px 5px #ddeeff;',
    roomNameColor:'color:#000;',
    imgColor:'background:#57a7f7;'
  },
  //橙7
  {
    bgTitleColor:'background: linear-gradient(to bottom, #edcabb,#e7855d);',
    bgColor:'background: linear-gradient(to bottom, #edb29a,#e7855d);',
    weekColorOdd:'background:  #edcabb;box-shadow: 0 0 2px 5px #efa384;',
    weekColorEven:'background: #e97e53;box-shadow: 0 0 2px 5px #efa384;',
    classColor:'box-shadow: 0 0 5px 5px #ecd6cd;',
    roomNameColor:'color:#f24600;',
    imgColor:'background:#e7855d;'
  },
  //清绿8
  {
    bgTitleColor:'background: linear-gradient(to bottom, #c6d7c6,#648065);',
    bgColor:'background: linear-gradient(to bottom, #a5b8a5,#648065);',
    weekColorOdd:'background:  #c6d7c6;box-shadow: 0 0 2px 5px #9aab9a;',
    weekColorEven:'background: #92a792;box-shadow: 0 0 2px 5px #9aab9a;',
    classColor:'box-shadow: 0 0 5px 5px #d2e0d2;',
    roomNameColor:'color:#4b664b;',
    imgColor:'background:#648065;'
  },
  //棕9
  {
    bgTitleColor:'background: linear-gradient(to bottom, #c4b4b4,#705d5d);',
    bgColor:'background: linear-gradient(to bottom, #ab9e9e,#705d5d);',
    weekColorOdd:'background:  #c4b4b4;box-shadow: 0 0 2px 5px #a89b9b;',
    weekColorEven:'background: #a58b8b;box-shadow: 0 0 2px 5px #a89b9b;',
    classColor:'box-shadow: 0 0 5px 5px #d4cbcb;',
    roomNameColor:'color:#735a5a;',
    imgColor:'background:#705d5d;'
  }
]
export default {
  name: 'WeekCourse',
  props: {
  },
  data() {
    return {
      colorIndex:0,
      classTypeColorList,
      weekOptions,
      weekCourseList: {},
      dataLoading: false,
      info:{},
      schoolName:'',
      classType:'',
      type:'A'
    }
  },
  created() {
  },
  methods: {
    generateImages () {
      html2canvas(document.querySelector('.course-container')).then(canvas => {
        const imgUrl = canvas.toDataURL('image/jpeg')
        const image = document.createElement('img')
        image.src = imgUrl
        // 将生成的图片放到 类名为 content 的元素中
        document.querySelector('.content').appendChild(image)
        const a = document.createElement('a')
        a.href = imgUrl
        // a.download 后面的内容为自定义图片的名称
        a.download = 'study_download'
        a.click()
      })
    },
    open(data){
      this.info=data
      console.log(111,data)
      this.classType=data.classType.map(item=>item.name).join(',')
      this.schoolName=data.school.name
      this.listClassWeekPlan(data)
    },
    typeChange(){
      this.listClassWeekPlan(this.info)
    },
    listClassWeekPlan(data) {
      let params = {
        day:data.day,
        school_id:data.school.id,
        classTypeId:data.classType.map(item=>item.id).join(','),
        type:this.type,
        danceId:data.danceId
      }
      this.dataLoading = true
      weekSchedule(params)
        .then(res => {
          res.data.forEach(item=>{
            let length = 0
            console.log(item.data)
            item.data.forEach(col=>{
              if(Array.isArray(col.data)&&col.data.length>length)length=col.data.length
            })
            item.data.forEach(col=>{
              if(Array.isArray(col.data)&&col.data.length<length){
                let length1 = length-col.data.length
                for(let i = 1; i<=length1;i++){
                  col.data.push({
                  })
                }
              }
            })
          })
          this.weekCourseList = res.data
        })
        .finally(() => {
          this.dataLoading = false
        })
    },
  }
}
</script>

<style scoped lang="less">
.wc-wrapper {
  min-width: 1250px;
  .room-search {
  }

  .course-container {
    text-align: center;
    padding: 20px;
    .course-containerBg{
      padding: 23px 0 0 0;
      overflow: hidden;
      border-radius: 16px;
      .course-header{
        background: #fff;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
      }
    }
    .week-list {
    }
    .course-week {
      margin-bottom: 12px;
      .course-week-title {
        text-align: center;
      }
    }

    .course-item {
      display: flex;
      justify-content: space-between;
      height: 100%;
      .danceNameTitle{
        width: 100px;
        font-size: 20px;
        font-weight: 600;
        color: #000;
        line-height: 70px;
      }
      .danceName{
        width: 100px;
        background: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
        >div{
          writing-mode: vertical-lr;
          height: 97%;
          padding: 0 15px;
          font-size: 25px;
          color: #000;
          font-weight: 700;
          font-family: monospace;
          border-radius: 19px;
          letter-spacing: 5px;
        }
      }
      .course-item-list{
        width: 14%;
      }
      .wc-class{
        position: relative;
      }
      .wc-class-list {
        margin-bottom: 6px;
        background: #fff;
        height: 140px;
      }
      .wc-class-week{
        font-size: 22px;
        color: #000;
        font-weight: 700;
        padding: 6px 0;
        margin-bottom: 6px;
      }
      .wc-class-date{
        color: #000;
        width: 100%;
        font-size: 16px;
      }
      .wc-roomName {
        font-size: 15px;
        font-weight: 700;
      }
      .wc-className{
        color: #000;
        font-size: 15px;
      }
    }
  }
}
.content {
  img {
    width: 202px;
    height: 102px;
    border-radius: 10px;
  }
}
.card {
  width: 200px;
  height: 100px;
  border: 1px solid skyblue;
  border-radius: 10px;
  background-color: #ccc;
  margin-bottom: 10px;
  div {
    display: flex;
    justify-content: space-between;
    padding: 5px 20px;
  }
}
.checkUsedRoom{
  display: flex;
  justify-content: space-between;
  padding: 10px 30px 30px;

}
.changeColor{
  width: 20px;
  height: 20px;
}
.imgBg{
  padding: 10px 0;
  width: 300px;
  background: rgb(238, 238, 238);
  text-align: center;
  transform: translate(-50%, -23px);
  margin: 0 50%;
}
</style>
