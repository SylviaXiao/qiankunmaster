<template>
  <div class='student-wrapper'>
    <a-card :bordered='false' :style="{ margin: '20px 0' }">
      <search-com-pro :style="{ padding: '10px 0' }" @searchSubmit='searchSubmit' :searchParams='searchParams' />
    </a-card>
    <a-card :bordered='false'>
      <a-tabs default-active-key="1">
        <a-tab-pane tab="渠道业绩金额"  key="1">
          <div class='mt10 mb10'>
            <a-button type='primary' icon='download' @click.native='downloadStu(1)'> 导出</a-button>
          </div>
          <s-table
            ref='table1'
            bordered
            :columns='columns'
            :data='loadData'
            rowKey='id'
          >
          <span slot='deptName' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.deptName}}
            </div>
          </span>
            <span slot='positionName' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{text}}
            </div>
          </span>
            <span slot='totalPrice' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.totalPrice}}
            </div>
          </span>
            <span slot='refundPrice' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.refundPrice}}
            </div>
          </span>
            <span slot='validPrice' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.validPrice}}
            </div>
          </span>
            <!--        渠道业绩金额-->
            <span slot='offLinePrice' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.offLinePrice}}
            </div>
          </span>
            <span slot='onLinePrice' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.onLinePrice}}
            </div>
          </span>
            <span slot='personalNetwork' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.personalNetwork}}
            </div>
          </span>
            <span slot='memberIntroduction' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.memberIntroduction}}
            </div>
          </span>
            <span slot='membership' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.membership}}
            </div>
          </span>
            <span slot='otherSourcePrice' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.otherSourcePrice}}
            </div>
          </span>
            <!--        班型业绩金额-->
            <span slot='eduTypeCoaching' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.eduTypeCoaching}}
            </div>
          </span>
            <span slot='eduTypeRegular' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.eduTypeRegular}}
            </div>
          </span>
            <span slot='eduTypeChildren' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.eduTypeChildren}}
            </div>
          </span>
            <span slot='eduTypePrivate' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.eduTypePrivate}}
            </div>
          </span>
            <span slot='otherEduTypePrice' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.otherEduTypePrice}}
            </div>
          </span>
            <!--        会员续卡业绩金额（续卡卡种班型）-->
            <span slot='renewCardeduTypeCoaching' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.renewCardeduTypeCoaching}}
            </div>
          </span>
            <span slot='renewCardeduTypeRegular' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.renewCardeduTypeRegular}}
            </div>
          </span>
            <span slot='renewCardeduTypeChildren' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.renewCardeduTypeChildren}}
            </div>
          </span>
            <span slot='renewCardeduTypePrivate' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.renewCardeduTypePrivate}}
            </div>
          </span>
            <span slot='otherRenewCardeduTypPrice' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.otherRenewCardeduTypPrice}}
            </div>
          </span>
            <!--        资源分析-->
            <span slot='totalStuUserCount' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.totalStuUserCount}}
            </div>
          </span>
            <span slot='totalStuInfoCount' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.totalStuInfoCount}}
            </div>
          </span>
            <span slot='totalSingleRate' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.totalSingleRate}}
            </div>
          </span>
            <span slot='totalSourceValue' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.totalSourceValue}}
            </div>
          </span>
            <!--        常规班（资源班型）-->
            <span slot='regularStuUserCount' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.regularStuUserCount}}
            </div>
          </span>
            <span slot='regularStuInfoCount' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.regularStuInfoCount}}
            </div>
          </span>
            <span slot='regularSingleRate' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.regularSingleRate}}
            </div>
          </span>
            <span slot='regularSourceValue' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.regularSourceValue}}
            </div>
          </span>
            <!--        教练班（资源班型）-->
            <span slot='coachingStuUserCount' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.coachingStuUserCount}}
            </div>
          </span>
            <span slot='coachingStuInfoCount' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.coachingStuInfoCount}}
            </div>
          </span>
            <span slot='coachingSingleRate' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.coachingSingleRate}}
            </div>
          </span>
            <span slot='coachingSourceValue' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.coachingSourceValue}}
            </div>
          </span>
            <!-- 未定班型（资源班型）-->
            <span slot='unfixedStuUserCount' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.unfixedStuUserCount}}
            </div>
          </span>
            <span slot='unfixedStuInfoCount' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.unfixedStuInfoCount}}
            </div>
          </span>
            <span slot='unfixedSingleRate' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.unfixedSingleRate}}
            </div>
          </span>
            <span slot='unfixedSourceValue' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.unfixedSourceValue}}
            </div>
          </span>
            <!-- 集训班（资源班型）-->
            <span slot='intensiveStuUserCount' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.intensiveStuUserCount}}
            </div>
          </span>
            <span slot='intensiveStuInfoCount' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.intensiveStuInfoCount}}
            </div>
          </span>
            <span slot='intensiveSingleRate' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.intensiveSingleRate}}
            </div>
          </span>
            <span slot='intensiveSourceValue' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.intensiveSourceValue}}
            </div>
          </span>
          </s-table>
        </a-tab-pane>
        <a-tab-pane tab="班型业绩金额"  key="2">
          <div class='mt10 mb10'>
            <a-button type='primary' icon='download' @click.native='downloadStu(2)'> 导出</a-button>
          </div>
          <s-table
            ref='table2'
            bordered
            :columns='columns2'
            :data='loadData2'
            rowKey='id'
          >
          <span slot='deptName' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.deptName}}
            </div>
          </span>
            <span slot='positionName' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{text}}
            </div>
          </span>
            <span slot='totalPrice' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.totalPrice}}
            </div>
          </span>
            <span slot='refundPrice' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.refundPrice}}
            </div>
          </span>
            <span slot='validPrice' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.validPrice}}
            </div>
          </span>
            <!--        渠道业绩金额-->
            <span slot='offLinePrice' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.offLinePrice}}
            </div>
          </span>
            <span slot='onLinePrice' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.onLinePrice}}
            </div>
          </span>
            <span slot='personalNetwork' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.personalNetwork}}
            </div>
          </span>
            <span slot='memberIntroduction' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.memberIntroduction}}
            </div>
          </span>
            <span slot='membership' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.membership}}
            </div>
          </span>
            <span slot='otherSourcePrice' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.otherSourcePrice}}
            </div>
          </span>
            <!--        班型业绩金额-->
            <span slot='eduTypeCoaching' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.eduTypeCoaching}}
            </div>
          </span>
            <span slot='eduTypeRegular' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.eduTypeRegular}}
            </div>
          </span>
            <span slot='eduTypeChildren' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.eduTypeChildren}}
            </div>
          </span>
            <span slot='eduTypePrivate' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.eduTypePrivate}}
            </div>
          </span>
            <span slot='otherEduTypePrice' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.otherEduTypePrice}}
            </div>
          </span>
            <!--        会员续卡业绩金额（续卡卡种班型）-->
            <span slot='renewCardeduTypeCoaching' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.renewCardeduTypeCoaching}}
            </div>
          </span>
            <span slot='renewCardeduTypeRegular' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.renewCardeduTypeRegular}}
            </div>
          </span>
            <span slot='renewCardeduTypeChildren' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.renewCardeduTypeChildren}}
            </div>
          </span>
            <span slot='renewCardeduTypePrivate' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.renewCardeduTypePrivate}}
            </div>
          </span>
            <span slot='otherRenewCardeduTypPrice' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.otherRenewCardeduTypPrice}}
            </div>
          </span>
            <!--        资源分析-->
            <span slot='totalStuUserCount' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.totalStuUserCount}}
            </div>
          </span>
            <span slot='totalStuInfoCount' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.totalStuInfoCount}}
            </div>
          </span>
            <span slot='totalSingleRate' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.totalSingleRate}}
            </div>
          </span>
            <span slot='totalSourceValue' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.totalSourceValue}}
            </div>
          </span>
            <!--        常规班（资源班型）-->
            <span slot='regularStuUserCount' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.regularStuUserCount}}
            </div>
          </span>
            <span slot='regularStuInfoCount' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.regularStuInfoCount}}
            </div>
          </span>
            <span slot='regularSingleRate' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.regularSingleRate}}
            </div>
          </span>
            <span slot='regularSourceValue' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.regularSourceValue}}
            </div>
          </span>
            <!--        教练班（资源班型）-->
            <span slot='coachingStuUserCount' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.coachingStuUserCount}}
            </div>
          </span>
            <span slot='coachingStuInfoCount' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.coachingStuInfoCount}}
            </div>
          </span>
            <span slot='coachingSingleRate' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.coachingSingleRate}}
            </div>
          </span>
            <span slot='coachingSourceValue' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.coachingSourceValue}}
            </div>
          </span>
            <!-- 未定班型（资源班型）-->
            <span slot='unfixedStuUserCount' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.unfixedStuUserCount}}
            </div>
          </span>
            <span slot='unfixedStuInfoCount' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.unfixedStuInfoCount}}
            </div>
          </span>
            <span slot='unfixedSingleRate' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.unfixedSingleRate}}
            </div>
          </span>
            <span slot='unfixedSourceValue' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.unfixedSourceValue}}
            </div>
          </span>
            <!-- 集训班（资源班型）-->
            <span slot='intensiveStuUserCount' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.intensiveStuUserCount}}
            </div>
          </span>
            <span slot='intensiveStuInfoCount' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.intensiveStuInfoCount}}
            </div>
          </span>
            <span slot='intensiveSingleRate' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.intensiveSingleRate}}
            </div>
          </span>
            <span slot='intensiveSourceValue' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.intensiveSourceValue}}
            </div>
          </span>
          </s-table>
        </a-tab-pane>
        <a-tab-pane tab="会员续卡业绩金额"  key="3">
          <div class='mt10 mb10'>
            <a-button type='primary' icon='download' @click.native='downloadStu(3)'> 导出</a-button>
          </div>
          <s-table
            ref='table3'
            bordered
            :columns='columns3'
            :data='loadData3'
            rowKey='id'
          >
          <span slot='deptName' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.deptName}}
            </div>
          </span>
            <span slot='positionName' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{text}}
            </div>
          </span>
            <span slot='totalPrice' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.totalPrice}}
            </div>
          </span>
            <span slot='refundPrice' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.refundPrice}}
            </div>
          </span>
            <span slot='validPrice' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.validPrice}}
            </div>
          </span>
            <!--        渠道业绩金额-->
            <span slot='offLinePrice' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.offLinePrice}}
            </div>
          </span>
            <span slot='onLinePrice' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.onLinePrice}}
            </div>
          </span>
            <span slot='personalNetwork' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.personalNetwork}}
            </div>
          </span>
            <span slot='memberIntroduction' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.memberIntroduction}}
            </div>
          </span>
            <span slot='membership' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.membership}}
            </div>
          </span>
            <span slot='otherSourcePrice' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.otherSourcePrice}}
            </div>
          </span>
            <!--        班型业绩金额-->
            <span slot='eduTypeCoaching' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.eduTypeCoaching}}
            </div>
          </span>
            <span slot='eduTypeRegular' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.eduTypeRegular}}
            </div>
          </span>
            <span slot='eduTypeChildren' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.eduTypeChildren}}
            </div>
          </span>
            <span slot='eduTypePrivate' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.eduTypePrivate}}
            </div>
          </span>
            <span slot='otherEduTypePrice' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.otherEduTypePrice}}
            </div>
          </span>
            <!--        会员续卡业绩金额（续卡卡种班型）-->
            <span slot='renewCardeduTypeCoaching' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.renewCardeduTypeCoaching}}
            </div>
          </span>
            <span slot='renewCardeduTypeRegular' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.renewCardeduTypeRegular}}
            </div>
          </span>
            <span slot='renewCardeduTypeChildren' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.renewCardeduTypeChildren}}
            </div>
          </span>
            <span slot='renewCardeduTypePrivate' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.renewCardeduTypePrivate}}
            </div>
          </span>
            <span slot='otherRenewCardeduTypPrice' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.otherRenewCardeduTypPrice}}
            </div>
          </span>
            <!--        资源分析-->
            <span slot='totalStuUserCount' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.totalStuUserCount}}
            </div>
          </span>
            <span slot='totalStuInfoCount' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.totalStuInfoCount}}
            </div>
          </span>
            <span slot='totalSingleRate' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.totalSingleRate}}
            </div>
          </span>
            <span slot='totalSourceValue' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.totalSourceValue}}
            </div>
          </span>
            <!--        常规班（资源班型）-->
            <span slot='regularStuUserCount' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.regularStuUserCount}}
            </div>
          </span>
            <span slot='regularStuInfoCount' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.regularStuInfoCount}}
            </div>
          </span>
            <span slot='regularSingleRate' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.regularSingleRate}}
            </div>
          </span>
            <span slot='regularSourceValue' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.regularSourceValue}}
            </div>
          </span>
            <!--        教练班（资源班型）-->
            <span slot='coachingStuUserCount' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.coachingStuUserCount}}
            </div>
          </span>
            <span slot='coachingStuInfoCount' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.coachingStuInfoCount}}
            </div>
          </span>
            <span slot='coachingSingleRate' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.coachingSingleRate}}
            </div>
          </span>
            <span slot='coachingSourceValue' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.coachingSourceValue}}
            </div>
          </span>
            <!-- 未定班型（资源班型）-->
            <span slot='unfixedStuUserCount' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.unfixedStuUserCount}}
            </div>
          </span>
            <span slot='unfixedStuInfoCount' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.unfixedStuInfoCount}}
            </div>
          </span>
            <span slot='unfixedSingleRate' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.unfixedSingleRate}}
            </div>
          </span>
            <span slot='unfixedSourceValue' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.unfixedSourceValue}}
            </div>
          </span>
            <!-- 集训班（资源班型）-->
            <span slot='intensiveStuUserCount' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.intensiveStuUserCount}}
            </div>
          </span>
            <span slot='intensiveStuInfoCount' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.intensiveStuInfoCount}}
            </div>
          </span>
            <span slot='intensiveSingleRate' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.intensiveSingleRate}}
            </div>
          </span>
            <span slot='intensiveSourceValue' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.intensiveSourceValue}}
            </div>
          </span>
          </s-table>
        </a-tab-pane>
        <a-tab-pane tab="资源分析"  key="4">
          <div class='mt10 mb10'>
            <a-button type='primary' icon='download' @click.native='downloadStu(4)'> 导出</a-button>
          </div>
          <s-table
            ref='table4'
            bordered
            :columns='columns4'
            :data='loadData4'
            :scroll='{ x: 1600 }'
            rowKey='id'
          >
          <span slot='deptName' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.deptName}}
            </div>
          </span>
            <span slot='positionName' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{text}}
            </div>
          </span>
            <span slot='totalPrice' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.totalPrice}}
            </div>
          </span>
            <span slot='refundPrice' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.refundPrice}}
            </div>
          </span>
            <span slot='validPrice' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.validPrice}}
            </div>
          </span>
            <!--        渠道业绩金额-->
            <span slot='offLinePrice' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.offLinePrice}}
            </div>
          </span>
            <span slot='onLinePrice' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.onLinePrice}}
            </div>
          </span>
            <span slot='personalNetwork' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.personalNetwork}}
            </div>
          </span>
            <span slot='memberIntroduction' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.memberIntroduction}}
            </div>
          </span>
            <span slot='membership' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.membership}}
            </div>
          </span>
            <span slot='otherSourcePrice' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.otherSourcePrice}}
            </div>
          </span>
            <!--        班型业绩金额-->
            <span slot='eduTypeCoaching' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.eduTypeCoaching}}
            </div>
          </span>
            <span slot='eduTypeRegular' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.eduTypeRegular}}
            </div>
          </span>
            <span slot='eduTypeChildren' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.eduTypeChildren}}
            </div>
          </span>
            <span slot='eduTypePrivate' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.eduTypePrivate}}
            </div>
          </span>
            <span slot='otherEduTypePrice' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.otherEduTypePrice}}
            </div>
          </span>
            <!--        会员续卡业绩金额（续卡卡种班型）-->
            <span slot='renewCardeduTypeCoaching' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.renewCardeduTypeCoaching}}
            </div>
          </span>
            <span slot='renewCardeduTypeRegular' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.renewCardeduTypeRegular}}
            </div>
          </span>
            <span slot='renewCardeduTypeChildren' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.renewCardeduTypeChildren}}
            </div>
          </span>
            <span slot='renewCardeduTypePrivate' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.renewCardeduTypePrivate}}
            </div>
          </span>
            <span slot='otherRenewCardeduTypPrice' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.otherRenewCardeduTypPrice}}
            </div>
          </span>
            <!--        资源分析-->
            <span slot='totalStuUserCount' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.totalStuUserCount}}
            </div>
          </span>
            <span slot='totalStuInfoCount' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.totalStuInfoCount}}
            </div>
          </span>
            <span slot='totalSingleRate' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.totalSingleRate}}
            </div>
          </span>
            <span slot='totalSourceValue' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.totalSourceValue}}
            </div>
          </span>
            <!--        常规班（资源班型）-->
            <span slot='regularStuUserCount' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.regularStuUserCount}}
            </div>
          </span>
            <span slot='regularStuInfoCount' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.regularStuInfoCount}}
            </div>
          </span>
            <span slot='regularSingleRate' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.regularSingleRate}}
            </div>
          </span>
            <span slot='regularSourceValue' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.regularSourceValue}}
            </div>
          </span>
            <!--        教练班（资源班型）-->
            <span slot='coachingStuUserCount' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.coachingStuUserCount}}
            </div>
          </span>
            <span slot='coachingStuInfoCount' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.coachingStuInfoCount}}
            </div>
          </span>
            <span slot='coachingSingleRate' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.coachingSingleRate}}
            </div>
          </span>
            <span slot='coachingSourceValue' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.coachingSourceValue}}
            </div>
          </span>
            <!-- 未定班型（资源班型）-->
            <span slot='unfixedStuUserCount' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.unfixedStuUserCount}}
            </div>
          </span>
            <span slot='unfixedStuInfoCount' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.unfixedStuInfoCount}}
            </div>
          </span>
            <span slot='unfixedSingleRate' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.unfixedSingleRate}}
            </div>
          </span>
            <span slot='unfixedSourceValue' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.unfixedSourceValue}}
            </div>
          </span>
            <!-- 集训班（资源班型）-->
            <span slot='intensiveStuUserCount' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.intensiveStuUserCount}}
            </div>
          </span>
            <span slot='intensiveStuInfoCount' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.intensiveStuInfoCount}}
            </div>
          </span>
            <span slot='intensiveSingleRate' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.intensiveSingleRate}}
            </div>
          </span>
            <span slot='intensiveSourceValue' slot-scope="text, record">
            <div  v-for='(item,index) in record.adviserDeptMapList' :key='index' style='padding:5px 0;'>
              {{item.intensiveSourceValue}}
            </div>
          </span>
          </s-table>
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </div>
</template>

<script>
import moment from 'moment'
import ReportTable from '@/components/ReportsTable/ReportsTable.vue'
import { listOrgDeptByUser } from '@/api/education/card'
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { STable } from '@/components'
import { SearchComPro } from '@/components'
import { classPlanPage, pageAdviserData ,pageChannelData,pageEduTypeData,pageMemberData,pageResourcesData} from '@/api/finance/finance'

const date = new Date()
const defaultStart = moment(date)
  .date(1)
  .format('YYYY-MM-DD')
const defaultEnd = moment(date).format('YYYY-MM-DD')
const customHeaderCell1 = column => {
  return {
    style: {
      background: '#f7fbff'
    }
  }
}
const customHeaderCell2 = column => {
  return {
    style: {
      background: '#fafafa'
    }
  }
}
const defaultSchoolId = ['0c18166a-679b-414e-ac2e-c05ba7a2f4c4', '8f63afe7-09ca-4d11-ac51-1187e4381e63', '407913a7-76ff-40ce-967f-0ce0bf0bcdd3', '8109e909-8c8e-463a-9e10-a0804bc59b79', '150d8748-87ab-4935-8f6f-7233d1294413', '4c58a4b3-157b-493f-8b72-707196a26453', 'e07cad7c-7415-421c-a77e-48146d33a3bc', '0c185455-7ae8-4207-a517-91a2f5f26030', '88c5e24d-15c1-4e7c-adfb-f5e291562c33', '5aa46e02-28b9-4e31-936f-60721e07696d', '2d30de5a-9e47-4669-a9e9-534085ab6353', '7b0f4b73-83d9-4d46-adb0-78138e7ed633', '080aabad-e46b-479e-b130-169e970427e0', '66298d15-894b-4e48-9551-5d3795470304', '4e94a672-0bbd-48cd-ab50-8db3a4f4a57f',  'b337887b-ce9d-49e6-89c5-4f822c94d457', '5c3f5874-f9aa-437a-b1cc-9c5cf6339c3f', '50232e74-16d1-438d-9c09-bc7454b13fe0', '999e8fb9-6c98-4cc5-bab3-2a2937a36836', 'd923d38e-1699-4137-8f2a-315dcf2fa017', '5c0f0a94-346f-4e82-8848-f8882a7ac0ae', '7aa9901b-6d7f-44a3-8640-e0935516514c', '1207948e-746c-4dc3-9dd8-ab9c4493b49e', '47a6e64a-c166-4bb6-874c-f7e5c91666d7', 'c066c789-e642-45c8-9486-d7e684d44dca', '457cadbe-f9a8-4d18-87b4-85051f99898b', '6209c9c1-9b8f-42f2-9214-a7db8d5ece5a', 'b29cfda3-9609-4939-a8c4-4fe240f54f91']
export default {
  name: 'adviserDataTable',
  data() {
    const columns = [
      {
        title: '序号',
        dataIndex: 'sort',
        width: 50,
        align: 'center',
        ellipsis: true,
        customRender: (text, record, index) => {
          let start = this.limit * (this.page - 1)
          return <span>{start + index + 1}</span>
        },
        fixed: 'left'
      },
      {
        title: '顾问名称',
        dataIndex: 'adviserName',
        align: 'center',
        width: 120,
        fixed: 'left'
      },
      {
        title: '分馆',
        dataIndex: 'deptName',
        align: 'center',
        width: 150,
        fixed: 'left',
        scopedSlots: { customRender: 'deptName' },
      },
      {
        title: '职位',
        dataIndex: 'positionName',
        align: 'center',
        width: 100,
        fixed: 'left',
        scopedSlots: { customRender: 'positionName' },
      },
      {
        title: '在职状态',
        dataIndex: 'userState',
        align: 'center',
        width: 120,
        customRender: (text, record, index) => {
          return text==='Y'?'在职':text==='N'?'离职':''
        },
        fixed: 'left'
      },
      {
        title: '总业绩',
        dataIndex: 'totalPrice',
        align: 'center',
        width: 100,
        fixed: 'left',
        scopedSlots: { customRender: 'totalPrice' },
      },
      {
        title: '退费',
        dataIndex: 'refundPrice',
        align: 'center',
        width: 100,
        fixed: 'left',
        scopedSlots: { customRender: 'refundPrice' },
      },
      {
        title: '有效业绩',
        dataIndex: 'validPrice',
        align: 'center',
        width: 100,
        fixed: 'left',
        scopedSlots: { customRender: 'validPrice' },
      },
      {
        dataIndex: 'achievement',
        title: '渠道业绩金额',
        ellipsis: true,
        align: 'center',
        children: [
          {
            dataIndex: 'offLinePrice',
            title: '客服业绩（不含网课）',
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell1,
            scopedSlots: { customRender: 'offLinePrice' }
          },
          {
            dataIndex: 'onLinePrice',
            title: '客服业绩（网课）',
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell1,
            scopedSlots: { customRender: 'onLinePrice' }
          },
          {
            dataIndex: 'personalNetwork',
            title: '个人网络',
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell1,
            scopedSlots: { customRender: 'personalNetwork' }
          },
          {
            dataIndex: 'memberIntroduction',
            title: '会员介绍',
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell1,
            scopedSlots: { customRender: 'memberIntroduction' }
          },
          {
            dataIndex: 'membership',
            title: '会员续卡',
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell1,
            scopedSlots: { customRender: 'membership' }
          },
          {
            dataIndex: 'otherSourcePrice',
            title: '其他',
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell1,
            scopedSlots: { customRender: 'otherSourcePrice' }
          }
        ]
      },
    ]
    const columns2 = [
      {
        title: '序号',
        dataIndex: 'sort',
        width: 50,
        align: 'center',
        ellipsis: true,
        customRender: (text, record, index) => {
          let start = this.limit * (this.page - 1)
          return <span>{start + index + 1}</span>
        },
        fixed: 'left'
      },
      {
        title: '顾问名称',
        dataIndex: 'adviserName',
        align: 'center',
        width: 120,
        fixed: 'left'
      },
      {
        title: '分馆',
        dataIndex: 'deptName',
        align: 'center',
        width: 150,
        fixed: 'left',
        scopedSlots: { customRender: 'deptName' },
      },
      {
        title: '职位',
        dataIndex: 'positionName',
        align: 'center',
        width: 100,
        fixed: 'left',
        scopedSlots: { customRender: 'positionName' },
      },
      {
        title: '在职状态',
        dataIndex: 'userState',
        align: 'center',
        width: 120,
        customRender: (text, record, index) => {
          return text==='Y'?'在职':text==='N'?'离职':''
        },
        fixed: 'left'
      },
      {
        title: '总业绩',
        dataIndex: 'totalPrice',
        align: 'center',
        width: 100,
        fixed: 'left',
        scopedSlots: { customRender: 'totalPrice' },
      },
      {
        title: '退费',
        dataIndex: 'refundPrice',
        align: 'center',
        width: 100,
        fixed: 'left',
        scopedSlots: { customRender: 'refundPrice' },
      },
      {
        title: '有效业绩',
        dataIndex: 'validPrice',
        align: 'center',
        width: 100,
        fixed: 'left',
        scopedSlots: { customRender: 'validPrice' },
      },
      {
        dataIndex: 'coachClassStatics',
        title: '班型业绩金额',
        ellipsis: true,
        align: 'center',
        children: [
          {
            dataIndex: 'eduTypeCoaching',
            title: '教练班',
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell2,
            scopedSlots: { customRender: 'eduTypeCoaching' }
          },
          {
            dataIndex: 'eduTypeRegular',
            title: '常规班',
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell2,
            scopedSlots: { customRender: 'eduTypeRegular' }
          },
          {
            dataIndex: 'eduTypeChildren',
            title: '少儿班',
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell2,
            scopedSlots: { customRender: 'eduTypeChildren' }
          },
          {
            dataIndex: 'eduTypePrivate',
            title: '私教',
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell2,
            scopedSlots: { customRender: 'eduTypePrivate' }
          },
          {
            dataIndex: 'otherEduTypePrice',
            title: '其他',
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell2,
            scopedSlots: { customRender: 'otherEduTypePrice' }
          }
        ]
      },
    ]
    const columns3 = [
      {
        title: '序号',
        dataIndex: 'sort',
        width: 50,
        align: 'center',
        ellipsis: true,
        customRender: (text, record, index) => {
          let start = this.limit * (this.page - 1)
          return <span>{start + index + 1}</span>
        },
        fixed: 'left'
      },
      {
        title: '顾问名称',
        dataIndex: 'adviserName',
        align: 'center',
        width: 120,
        fixed: 'left'
      },
      {
        title: '分馆',
        dataIndex: 'deptName',
        align: 'center',
        width: 150,
        fixed: 'left',
        scopedSlots: { customRender: 'deptName' },
      },
      {
        title: '职位',
        dataIndex: 'positionName',
        align: 'center',
        width: 100,
        fixed: 'left',
        scopedSlots: { customRender: 'positionName' },
      },
      {
        title: '在职状态',
        dataIndex: 'userState',
        align: 'center',
        width: 120,
        customRender: (text, record, index) => {
          return text==='Y'?'在职':text==='N'?'离职':''
        },
        fixed: 'left'
      },
      {
        title: '总业绩',
        dataIndex: 'totalPrice',
        align: 'center',
        width: 100,
        fixed: 'left',
        scopedSlots: { customRender: 'totalPrice' },
      },
      {
        title: '退费',
        dataIndex: 'refundPrice',
        align: 'center',
        width: 100,
        fixed: 'left',
        scopedSlots: { customRender: 'refundPrice' },
      },
      {
        title: '有效业绩',
        dataIndex: 'validPrice',
        align: 'center',
        width: 100,
        fixed: 'left',
        scopedSlots: { customRender: 'validPrice' },
      },
      {
        dataIndex: 'sourceStatics',
        title: '会员续卡业绩金额（续卡卡种班型）',
        ellipsis: true,
        align: 'center',
        children: [
          {
            dataIndex: 'renewCardeduTypeCoaching',
            title: '教练班',
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell1,
            scopedSlots: { customRender: 'renewCardeduTypeCoaching' }
          },
          {
            dataIndex: 'renewCardeduTypeRegular',
            title: '常规班',
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell1,
            scopedSlots: { customRender: 'renewCardeduTypeRegular' }
          },
          {
            dataIndex: 'renewCardeduTypeChildren',
            title: '少儿班',
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell1,
            scopedSlots: { customRender: 'renewCardeduTypeChildren' }
          },
          {
            dataIndex: 'renewCardeduTypePrivate',
            title: '私教',
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell1,
            scopedSlots: { customRender: 'renewCardeduTypePrivate' }
          },
          {
            dataIndex: 'otherRenewCardeduTypPrice',
            title: '其他',
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell1,
            scopedSlots: { customRender: 'otherRenewCardeduTypPrice' }
          }
        ]
      },
    ]
    const columns4 = [
      {
        title: '序号',
        dataIndex: 'sort',
        width: 50,
        align: 'center',
        ellipsis: true,
        customRender: (text, record, index) => {
          let start = this.limit * (this.page - 1)
          return <span>{start + index + 1}</span>
        },
        fixed: 'left'
      },
      {
        title: '顾问名称',
        dataIndex: 'adviserName',
        align: 'center',
        width: 120,
        fixed: 'left'
      },
      {
        title: '分馆',
        dataIndex: 'deptName',
        align: 'center',
        width: 150,
        fixed: 'left',
        scopedSlots: { customRender: 'deptName' },
      },
      {
        title: '职位',
        dataIndex: 'positionName',
        align: 'center',
        width: 100,
        fixed: 'left',
        scopedSlots: { customRender: 'positionName' },
      },
      {
        title: '在职状态',
        dataIndex: 'userState',
        align: 'center',
        width: 120,
        customRender: (text, record, index) => {
          return text==='Y'?'在职':text==='N'?'离职':''
        },
        fixed: 'left'
      },
      {
        title: '总业绩',
        dataIndex: 'totalPrice',
        align: 'center',
        width: 100,
        fixed: 'left',
        scopedSlots: { customRender: 'totalPrice' },
      },
      {
        title: '退费',
        dataIndex: 'refundPrice',
        align: 'center',
        width: 100,
        fixed: 'left',
        scopedSlots: { customRender: 'refundPrice' },
      },
      {
        title: '有效业绩',
        dataIndex: 'validPrice',
        align: 'center',
        width: 100,
        fixed: 'left',
        scopedSlots: { customRender: 'validPrice' },
      },
      {
        dataIndex: 'cardTypeStatics5',
        title: '资源分析',
        ellipsis: true,
        align: 'center',
        children: [
          {
            dataIndex: 'totalStuUserCount',
            title: '资源数（不含网课）',
            width: 140,
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell2,
            scopedSlots: { customRender: 'totalStuUserCount' }
          },
          {
            dataIndex: 'totalStuInfoCount',
            title: '成单数',
            ellipsis: true,
            width: 100,
            align: 'center',
            customHeaderCell: customHeaderCell2,
            scopedSlots: { customRender: 'totalStuInfoCount' }
          },
          {
            dataIndex: 'totalSingleRate',
            title: '成单率',
            width: 100,
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell2,
            scopedSlots: { customRender: 'totalSingleRate' }
          },
          {
            dataIndex: 'totalSourceValue',
            title: '资源价值',
            width: 100,
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell2,
            scopedSlots: { customRender: 'totalSourceValue' }
          }
        ]
      },
      {
        dataIndex: 'cardTypeStatics',
        title: '常规班（资源班型）',
        ellipsis: true,
        align: 'center',
        children: [
          {
            dataIndex: 'regularStuUserCount',
            title: '资源数（不含网课）',
            width: 140,
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell1,
            scopedSlots: { customRender: 'regularStuUserCount' }
          },
          {
            dataIndex: 'regularStuInfoCount',
            title: '成单数',
            ellipsis: true,
            width: 100,
            align: 'center',
            customHeaderCell: customHeaderCell1,
            scopedSlots: { customRender: 'regularStuInfoCount' }
          },
          {
            dataIndex: 'regularSingleRate',
            title: '成单率',
            width: 100,
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell1,
            scopedSlots: { customRender: 'regularSingleRate' }
          },
          {
            dataIndex: 'regularSourceValue',
            title: '资源价值',
            width: 100,
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell1,
            scopedSlots: { customRender: 'regularSourceValue' }
          }
        ]
      },
      {
        dataIndex: 'cardTypeStatics3',
        title: '教练班（资源班型）',
        ellipsis: true,
        align: 'center',
        children: [
          {
            dataIndex: 'coachingStuUserCount',
            title: '资源数（不含网课）',
            width: 140,
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell2,
            scopedSlots: { customRender: 'coachingStuUserCount' }
          },
          {
            dataIndex: 'coachingStuInfoCount',
            title: '成单数',
            ellipsis: true,
            width: 100,
            align: 'center',
            customHeaderCell: customHeaderCell2,
            scopedSlots: { customRender: 'coachingStuInfoCount' }
          },
          {
            dataIndex: 'coachingSingleRate',
            title: '成单率',
            width: 100,
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell2,
            scopedSlots: { customRender: 'coachingSingleRate' }
          },
          {
            dataIndex: 'coachingSourceValue',
            title: '资源价值',
            width: 100,
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell2,
            scopedSlots: { customRender: 'coachingSourceValue' }
          }
        ]
      },
      {
        dataIndex: 'cardTypeStatics2',
        title: '未定班型（资源班型）',
        ellipsis: true,
        align: 'center',
        children: [
          {
            dataIndex: 'unfixedStuUserCount',
            title: '资源数（不含网课）',
            width: 140,
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell1,
            scopedSlots: { customRender: 'unfixedStuUserCount' }
          },
          {
            dataIndex: 'unfixedStuInfoCount',
            title: '成单数',
            ellipsis: true,
            width: 100,
            align: 'center',
            customHeaderCell: customHeaderCell1,
            scopedSlots: { customRender: 'unfixedStuInfoCount' }
          },
          {
            dataIndex: 'unfixedSingleRate',
            title: '成单率',
            width: 100,
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell1,
            scopedSlots: { customRender: 'unfixedSingleRate' }
          },
          {
            dataIndex: 'unfixedSourceValue',
            title: '资源价值',
            width: 100,
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell1,
            scopedSlots: { customRender: 'unfixedSourceValue' }
          }
        ]
      },
      {
        dataIndex: 'cardTypeStatics1',
        title: '集训班（资源班型）',
        ellipsis: true,
        align: 'center',
        children: [
          {
            dataIndex: 'intensiveStuUserCount',
            title: '资源数（不含网课）',
            width: 140,
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell2,
            scopedSlots: { customRender: 'intensiveStuUserCount' }
          },
          {
            dataIndex: 'intensiveStuInfoCount',
            title: '成单数',
            ellipsis: true,
            width: 100,
            align: 'center',
            customHeaderCell: customHeaderCell2,
            scopedSlots: { customRender: 'intensiveStuInfoCount' }
          },
          {
            dataIndex: 'intensiveSingleRate',
            title: '成单率',
            width: 100,
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell2,
            scopedSlots: { customRender: 'intensiveSingleRate' }
          },
          {
            dataIndex: 'intensiveSourceValue',
            title: '资源价值',
            width: 100,
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell2,
            scopedSlots: { customRender: 'intensiveSourceValue' }
          }
        ]
      }
    ]
    return {
      spinning: false,
      columns,
      columns2,
      columns3,
      columns4,
      limit: 0,
      page: 0,
      //表内容
      loadData: parameter => {
        this.limit = parameter.limit
        this.page = parameter.page
        return pageChannelData(Object.assign(parameter, this.queryParams)).then(res => {
          return res
        })
      },
      loadData2: parameter => {
        this.limit = parameter.limit
        this.page = parameter.page
        return pageEduTypeData(Object.assign(parameter, this.queryParams)).then(res => {
          return res
        })
      },
      loadData3: parameter => {
        this.limit = parameter.limit
        this.page = parameter.page
        return pageMemberData(Object.assign(parameter, this.queryParams)).then(res => {
          return res
        })
      },
      loadData4: parameter => {
        this.limit = parameter.limit
        this.page = parameter.page
        return pageResourcesData(Object.assign(parameter, this.queryParams)).then(res => {
          return res
        })
      },
      //搜索项
      searchParams: [
        {
          type: 'treeSelect',
          isShow: !!!this.$store.getters.school_id,
          key: 'schoolIds',
          label: '分馆',
          placeholder: '请选择分馆',
          expandAll: true,
          mutiple: true,
          treeCheckable: true,
          selectFather: true,
          show: true,
          defaultVal: !!!this.$store.getters.school_id?defaultSchoolId:[this.$store.getters.school_id],
          treeOps: {
            api: listOrgDeptByUser,
            label: 'deptName',
            value: 'id',
            children: 'children'
          }
        },
        {
          type: 'date',
          key: 'Date',
          label: '时间日期',
          show: true,
          placeholder: '请选择时间日期',
          format: 'YYYY-MM-DD',
          defaultVal: [moment(defaultStart, 'YYYY-MM-DD'), moment(defaultEnd, 'YYYY-MM-DD')],
          isDate: true
        },
        {
          type: 'date',
          key: 'IntoDate',
          label: '入职时间',
          show: true,
          placeholder: '请选择入职时间',
          format: 'YYYY-MM-DD',
          isDate: true
        },
        {
          type: 'select', // 静态select框
          key: 'targ',
          label: '是否含退费',
          show: true,
          placeholder: '请选择是否含退费',
          initialValue:'Y',
          staticArr: [
            {
              string: '包含',
              value: 'Y'
            },
            {
              string: '不含',
              value: 'N'
            }
          ]
        },
        {
          type: 'select',
          key: 'positionType',
          label: '职位',
          show: true,
          placeholder: '请选择',
          initialValue: '',
          staticArr: [
            {
              string: '全部',
              value: ''
            },
            {
              string: '顾问',
              value: 0
            },
            {
              string: '主管',
              value: 1
            }
          ]
        },
        {
          type: 'select',
          key: 'jobType',
          label: '在职类型',
          show: true,
          placeholder: '请选择',
          initialValue: '',
          staticArr: [
            {
              string: '全部',
              value: ''
            },
            {
              string: '在职',
              value: 'Y'
            },
            {
              string: '离职',
              value: 'N'
            }
          ]
        }
      ],
      queryParams: {
        startDate: defaultStart,
        endDate: defaultEnd,
        schoolIds: !!!this.$store.getters.school_id?defaultSchoolId.join(','):this.$store.getters.school_id,
        targ:true
      },
      //表格是否加载
      rpSpinning: false
    }
  },
  components: {
    ReportTable,
    STable,

    SearchComPro
  },
  created() {
  },
  methods: {
    //导出
    downloadStu(num) {
      let exportUrl = '/finance/adviserData/downChannelData'
      if(num ===1)exportUrl = '/finance/adviserData/downChannelData'
      if(num ===2)exportUrl = '/finance/adviserData/downEduTypeData'
      if(num ===3)exportUrl = '/finance/adviserData/downMemberData'
      if(num ===4)exportUrl = '/finance/adviserData/downResourcesData'
      const queryParam = this.queryParams
      const token = Vue.ls.get(ACCESS_TOKEN)
      let fields = [{ name: 'auth_token', value: token }]
      for (let k in queryParam) {
        if (k !== 'page' && k !== 'limit' && queryParam[k]) fields.push({ name: k, value: queryParam[k] })
      }
      fields.push({ name: 'page', value: 0 })
      fields.push({ name: 'limit', value: 0 })
      if(this.$store.getters.school_id){
        fields.push({ name: 'school_id', value: this.$store.getters.school_id })
      }
      const form = document.createElement('form')
      form.action = `${process.env.VUE_APP_URL}${exportUrl}`
      form.method = 'POST'
      form.target = 'downloadFrame'
      for (let i = 0; i < fields.length; i++) {
        const field = fields[i]
        const f = document.createElement('input')
        f.type = 'hidden'
        f.name = field.name
        f.value = field.value
        form.appendChild(f)
      }
      document.body.appendChild(form)
      form.submit()
      this.$message.success('正在下载...')
      document.body.removeChild(form)
    },
    searchSubmit(data, reset) {
      this.queryParams = data
      this.queryParams.targ =data.targ === 'N'?false:true
      if (reset === 'isReset') {
        this.queryParams.startDate = defaultStart
        this.queryParams.endDate = defaultEnd
        this.queryParams.schoolIds =!!!this.$store.getters.school_id? defaultSchoolId.join(','):this.$store.getters.school_id
      }
      this._refreshTable()
    },
    _refreshTable() {
      if (this.$refs.table1) this.$refs.table1.refresh()
      if (this.$refs.table2) this.$refs.table2.refresh()
      if (this.$refs.table3) this.$refs.table3.refresh()
      if (this.$refs.table4) this.$refs.table4.refresh()
    }
  }
}
</script>

<style scoped lang='less'></style>
