<!-- 使用说明 -->
<!-- {
  school_id:'分馆'
  orgUserId:'操作用户',
  stuNo:'学号',
  name:'学员姓名',
  stuName: '学员姓名',
  userName:'员工姓名',
  ip: 'ip地址'
  userNo:'员工编号'
  deptName:'部门名称'
  stuPhone:'正式学员电话',
  phone:'意向学员电话',
  cardName:'卡种名称',
  teacher: '上课导师',
  assistant: '助教',
  master: '顾问',
  adviser: '顾问',
  classId: '班级名称',
  className: '班级名称',
  classTypeId: '班型名称',
  classTypeSingleId: '班型名称',
  roomId: '教室名称',
  userStatus: '跟进状态',
  danceId: '选择舞种',
  cardTypeId: '选择类型',
  cDate: '跟进时间',
  aDate: '再次跟进时间',
  logDate: '办卡时间',
  userState: '在职状态',
  cardStatus: '卡状态'
  userOfficial: '正式状态'
  hasAssignment: '资源状态'
  cerIdCard: '身份证号码'
  cerName: '姓名'
  cerRank: '级别'
  state:'确认状态'
  professional:'专业'
  payoff:'是否缴清',
  goodsTypeId:'物品类型',
} -->
<template>
  <div class="search-com-wrapper">
    <a-row v-if="showSearchTag">
      <a-col :span="24">
        <a-form :form="form">
          <div class="form-wrapper">
            <div class="search-header">
              <a-row v-if="showSearchTag.title">
                <a-col :span="18">
                  <a-row>
                    <a-col v-for="(item, index) in inputShowTags" :key="index" :lg="8" :md="12" :sm="24" v-if="isShowTitleCol(item.key)">
                      <a-form-item v-bind="formItemLayout" :label="item.label">
                        <a-input :placeholder="item.placeholder" v-decorator="[item.key]" />
                      </a-form-item>
                    </a-col>
                    <a-col :lg="8" :md="12" :sm="24" v-if="showSearchTag.title.cardName">
                      <a-form-item v-bind="formItemLayout" label="卡种名称">
                        <span @click="getCard()">
                          <a-input style="cursor: pointer;color: #000;" disabled placeholder="请选择卡种" v-decorator="['cardName']">
                            <a-icon slot="addonAfter" type="search" />
                          </a-input>
                        </span>
                      </a-form-item>
                    </a-col>
                    <a-col :lg="8" :md="12" :sm="24" v-if="showSearchTag.title.teacher">
                      <a-form-item v-bind="formItemLayout" label="上课导师">
                        <span @click="getUser('teacher')">
                          <a-input style="cursor: pointer;color: #000;" disabled placeholder="请选择导师" v-decorator="['teacher']">
                            <a-icon slot="addonAfter" type="search" />
                          </a-input>
                        </span>
                      </a-form-item>
                    </a-col>

                    <a-col :lg="8" :md="12" :sm="24" v-if="showSearchTag.title.assistant">
                      <a-form-item v-bind="formItemLayout" label="助教">
                        <span>
                          <a-input @change="assistantChange" style="cursor: pointer;color: #000;" placeholder="请选择助教" v-decorator="['assistant']">
                            <a-icon slot="addonAfter" type="search" @click="getUser('assistant')" />
                          </a-input>
                        </span>
                      </a-form-item>
                    </a-col>
                    <a-col :lg="8" :md="12" :sm="24" v-if="showSearchTag.title.userId">
                      <a-form-item v-bind="formItemLayout" label="选择员工">
                        <span @click="getUser()">
                          <a-input style="cursor: pointer;color: #000;" disabled placeholder="请选择员工" v-decorator="['user']">
                            <a-icon slot="addonAfter" type="search" />
                          </a-input>
                        </span>
                      </a-form-item>
                    </a-col>
                    <a-col :lg="8" :md="12" :sm="24" v-if="showSearchTag.title.master">
                      <a-form-item v-bind="formItemLayout" label="顾问">
                        <span @click="getUser('master')">
                          <a-input style="cursor: pointer;color: #000;" disabled placeholder="请选择导师" v-decorator="['master']">
                            <a-icon slot="addonAfter" type="search" />
                          </a-input>
                        </span>
                      </a-form-item>
                    </a-col>
                    <a-col :lg="8" :md="12" :sm="24" v-if="showSearchTag.title.adviser">
                      <a-form-item v-bind="formItemLayout" label="顾问">
                        <span @click="getUser('master')">
                          <a-input style="cursor: pointer;color: #000;" disabled placeholder="请选择顾问" v-decorator="['master']">
                            <a-icon slot="addonAfter" type="search" />
                          </a-input>
                        </span>
                      </a-form-item>
                    </a-col>
                    <a-col :lg="8" :md="12" :sm="24" v-if="showSearchTag.title.userStatus">
                      <a-form-item v-bind="formItemLayout" label="跟进状态">
                        <a-select :allowClear="true" v-decorator="['userStatus']" placeholder="请选择状态">
                          <a-select-option :allowClear="true" value="Y">正常</a-select-option>
                          <a-select-option :allowClear="true" value="N">作废</a-select-option>
                        </a-select>
                      </a-form-item>
                    </a-col>
                    <a-col :lg="8" :md="12" :sm="24" v-if="showSearchTag.title.hasAssignment">
                      <a-form-item v-bind="formItemLayout" label="资源状态">
                        <a-select :allowClear="true" v-decorator="['hasAssignment']" placeholder="请选择状态">
                          <a-select-option :allowClear="true" value="Y">已分配</a-select-option>
                          <a-select-option :allowClear="true" value="N">未分配</a-select-option>
                        </a-select>
                      </a-form-item>
                    </a-col>
                    <a-col :lg="8" :md="12" :sm="24" v-if="showSearchTag.title.cardStatus">
                      <a-form-item v-bind="formItemLayout" label="卡状态">
                        <a-select :allowClear="true" v-decorator="['status']" placeholder="请选择状态">

                          <a-select-option :allowClear="true" value="A">未使用</a-select-option>
                          <a-select-option :allowClear="true" value="B">使用中</a-select-option>
                          <a-select-option :allowClear="true" value="C">停课</a-select-option>
                          <a-select-option :allowClear="true" value="D">退卡</a-select-option>
                          <a-select-option :allowClear="true" value="E">结业</a-select-option>
                          <a-select-option :allowClear="true" value="F">撤销</a-select-option>
                          <a-select-option :allowClear="true" value="G">结转</a-select-option>
                        </a-select>
                      </a-form-item>
                    </a-col>
                    <a-col :lg="8" :md="12" :sm="24" v-if="showSearchTag.title.school_id && schoolList.length > 0 && !hasSchool">
                      <a-form-item v-bind="formItemLayout" label="选择分馆">
                        <a-tree-select
                          v-decorator="['school_id']"
                          :allowClear="true"
                          :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
                          :treeData="schoolList"
                          treeDefaultExpandAll
                        >
                        </a-tree-select>
                      </a-form-item>
                    </a-col>
                    <a-col :lg="8" :md="12" :sm="24" v-if="showSearchTag.title.danceId && danceIdArr.length > 0">
                      <a-form-item v-bind="formItemLayout" label="选择舞种">
                        <a-select :allowClear="true" v-decorator="['danceId']" placeholder="请选择舞种">
                          <a-select-option :allowClear="true" v-for="(item, index) in danceIdArr" :key="index" :value="item.id">{{
                            item.name
                          }}</a-select-option>
                        </a-select>
                      </a-form-item>
                    </a-col>
                    <a-col :lg="8" :md="12" :sm="24" v-if="showSearchTag.title.goodsTypeId && goodsTypeList.length > 0">
                      <a-form-item v-bind="formItemLayout" label="类型">
                        <a-select :allowClear="true" v-decorator="[`goodsTypeId`, { rules: [{ required: false, message: '请选择' }] }]" placeholder="请选择">
                          <a-select-option v-for="(item, index) in goodsTypeList" :key="index" :value="item.goodsTypeId">{{
                            item.goodsTypeName
                          }}</a-select-option>
                        </a-select>
                      </a-form-item>
                    </a-col>
                    <a-col :lg="8" :md="12" :sm="24" v-if="showSearchTag.title.cardTypeId && cardTypeIdArr.length > 0">
                      <a-form-item v-bind="formItemLayout" label="选择类型">
                        <a-select :allowClear="true" v-decorator="['cardTypeId']" placeholder="请选择类型">
                          <a-select-option :allowClear="true" v-for="(item, index) in cardTypeIdArr" :key="index" :value="item.id">{{
                            item.name
                          }}</a-select-option>
                        </a-select>
                      </a-form-item>
                    </a-col>
                    <a-col :lg="8" :md="12" :sm="24" v-if="showSearchTag.title.cDate">
                      <a-form-item label="录入时间" v-bind="formItemLayout">
                        <a-range-picker v-decorator="['cDate']" style="width: 100%;" />
                      </a-form-item>
                    </a-col>
                    <a-col :lg="8" :md="12" :sm="24" v-if="showSearchTag.title.aDate">
                      <a-form-item label="再次跟进时间" v-bind="formItemLayout">
                        <a-range-picker v-decorator="['aDate']" style="width: 100%;" />
                      </a-form-item>
                    </a-col>
                    <a-col :lg="8" :md="12" :sm="24" v-if="showSearchTag.title.logDate">
                      <a-form-item label="办卡时间" v-bind="formItemLayout">
                        <a-range-picker v-decorator="['logDate']" style="width: 100%;" />
                      </a-form-item>
                    </a-col>
                    <a-col :lg="8" :md="12" :sm="24" v-if="showSearchTag.title.date">
                      <a-form-item label="选择时间" v-bind="formItemLayout">
                        <a-range-picker format="YYYY-MM-DD" v-decorator="['date']" style="width: 100%;" />
                      </a-form-item>
                    </a-col>
                    <a-col :lg="8" :md="12" :sm="24" v-if="showSearchTag.title.logTime">
                      <a-form-item label="登录时间" v-bind="formItemLayout">
                        <a-range-picker format="YYYY-MM-DD HH:mm:ss" @ok="onOk" showTime v-decorator="['logTime']" style="width: 100%;" />
                      </a-form-item>
                    </a-col>
                    <a-col :lg="8" :md="12" :sm="24" v-if="showSearchTag.title.payoff">
                      <a-form-item label="是否缴清" v-bind="formItemLayout">
                        <a-select :allowClear="true" v-decorator="['payoff']" placeholder="请选择状态">
                          <a-select-option :allowClear="true" value="Y">已缴清</a-select-option>
                          <a-select-option :allowClear="true" value="N">未缴清</a-select-option>
                        </a-select>
                      </a-form-item>
                    </a-col>
                    <a-col :lg="8" :md="12" :sm="24" v-if="showSearchTag.title.userState">
                      <a-form-item label="在职状态" v-bind="formItemLayout">
                        <a-select :allowClear="true" v-decorator="['userState']" placeholder="请选择状态">
                          <a-select-option :allowClear="true" value="Y">在职</a-select-option>
                          <a-select-option :allowClear="true" value="N">离职</a-select-option>
                        </a-select>
                      </a-form-item>
                    </a-col>
                    <a-col :lg="8" :md="12" :sm="24" v-if="showSearchTag.title.state">
                      <a-form-item label="确认状态" v-bind="formItemLayout">
                        <a-select :allowClear="true" v-decorator="['state']" placeholder="请选择状态">
                          <a-select-option :allowClear="true" value="Y">已确认</a-select-option>
                          <a-select-option :allowClear="true" value="N">未确认</a-select-option>
                        </a-select>
                      </a-form-item>
                    </a-col>
                    <a-col :lg="8" :md="12" :sm="24" v-if="showSearchTag.title.userOfficial">
                      <a-form-item label="正式状态" v-bind="formItemLayout">
                        <a-select :allowClear="true" v-decorator="['userOfficial']" placeholder="请选择状态">
                          <a-select-option :allowClear="true" value="A">全职</a-select-option>
                          <a-select-option :allowClear="true" value="B">试用</a-select-option>
                          <a-select-option :allowClear="true" value="C">兼职</a-select-option>
                        </a-select>
                      </a-form-item>
                    </a-col>
                    <a-col :lg="8" :md="12" :sm="24" v-if="showSearchTag.title.roomId && roomIdArr.length > 0">
                      <a-form-item v-bind="formItemLayout" label="教室名称">
                        <a-select :allowClear="true" v-decorator="['roomId']" placeholder="请选择教室">
                          <a-select-option :allowClear="true" v-for="(item, index) in roomIdArr" :key="index" :value="item.id">{{
                            item.roomName
                          }}</a-select-option>
                        </a-select>
                      </a-form-item>
                    </a-col>
                    <a-col :lg="8" :md="12" :sm="24" v-if="showSearchTag.title.classTypeSingleId && classTypeSingleIdArr.length > 0">
                      <a-form-item v-bind="formItemLayout" label="班级类型">
                        <a-select :allowClear="true" v-decorator="['classTypeSingleId']" placeholder="请选择班级类型">
                          <a-select-option :allowClear="true" v-for="(item, index) in classTypeSingleIdArr" :key="index" :value="item.id">{{
                            item.name
                          }}</a-select-option>
                        </a-select>
                      </a-form-item>
                    </a-col>
                    <a-col :lg="8" :md="12" :sm="24" v-if="showSearchTag.title.classTypeId && classTypeIdArr.length > 0">
                      <a-form-item v-bind="formItemLayout" label="班型选择">
                        <a-cascader
                          :options="classTypeIdArr"
                          placeholder="请选择班型"
                          :fieldNames="{ label: 'name', value: 'id', children: 'children' }"
                          changeOnSelect
                          v-decorator="['classTypeId', { rules: [{ required: false, message: '请选择类型班型' }] }]"
                        />
                      </a-form-item>
                    </a-col>
                  </a-row>
                </a-col>
                <a-col class="submit-btn" :lg="6" :md="12" :sm="24">
                  <a-button type="primary" @click="searchParms">查询</a-button>
                  <a-button :style="{ marginLeft: '10px' }" @click="reset">重置</a-button>
                  <span v-if="showSearchTag.body" class="arrow-wrapper" @click="showBody">
                    <a-icon class="rotateIcon" :class="{ rotate: isShow }" type="left" /> 折叠
                  </span>
                  <span else="showSearchTag.body" class="arrow-wrapper"> </span>
                </a-col>
              </a-row>
            </div>
            <transition name="slide21-down">
              <div class="search-body" v-if="showSearchTag.body && isShow">
                <a-row>
                  <a-col :span="18">
                    <a-row>
                      <a-col v-for="(item, index) in inputShowTags" :key="index" :lg="8" :md="12" :sm="24" v-if="isShowBodyCol(item.key)">
                        <a-form-item v-bind="formItemLayout" :label="item.label">
                          <a-input :placeholder="item.placeholder" v-decorator="[item.key]" />
                        </a-form-item>
                      </a-col>
                      <a-col :lg="8" :md="12" :sm="24" v-if="showSearchTag.body.cardName">
                        <a-form-item v-bind="formItemLayout" label="卡种名称">
                          <span @click="getCard()">
                            <a-input style="cursor: pointer;color: #000;" disabled placeholder="请选择卡种" v-decorator="['cardName']">
                              <a-icon slot="addonAfter" type="search" />
                            </a-input>
                          </span>
                        </a-form-item>
                      </a-col>
                      <a-col :lg="8" :md="12" :sm="24" v-if="showSearchTag.body.teacher">
                        <a-form-item v-bind="formItemLayout" label="上课导师">
                          <span @click="getUser('teacher')">
                            <a-input style="cursor: pointer;color: #000;" disabled placeholder="请选择导师" v-decorator="['teacher']">
                              <a-icon slot="addonAfter" type="search" />
                            </a-input>
                          </span>
                        </a-form-item>
                      </a-col>
                      <a-col :lg="8" :md="12" :sm="24" v-if="showSearchTag.body.userId">
                        <a-form-item v-bind="formItemLayout" label="选择员工">
                          <span @click="getUser()">
                            <a-input style="cursor: pointer;color: #000;" disabled placeholder="请选择员工" v-decorator="['user']">
                              <a-icon slot="addonAfter" type="search" />
                            </a-input>
                          </span>
                        </a-form-item>
                      </a-col>
                      <a-col :lg="8" :md="12" :sm="24" v-if="showSearchTag.body.master">
                        <a-form-item v-bind="formItemLayout" label="顾问">
                          <span @click="getUser('master')">
                            <a-input style="cursor: pointer;color: #000;" disabled placeholder="请选择导师" v-decorator="['master']">
                              <a-icon slot="addonAfter" type="search" />
                            </a-input>
                          </span>
                        </a-form-item>
                      </a-col>
                      <a-col :lg="8" :md="12" :sm="24" v-if="showSearchTag.body.adviser">
                        <a-form-item v-bind="formItemLayout" label="顾问">
                          <span @click="getUser('master')">
                            <a-input style="cursor: pointer;color: #000;" disabled placeholder="请选择顾问" v-decorator="['master']">
                              <a-icon slot="addonAfter" type="search" />
                            </a-input>
                          </span>
                        </a-form-item>
                      </a-col>
                      <a-col :lg="8" :md="12" :sm="24" v-if="showSearchTag.body.assistant">
                        <a-form-item v-bind="formItemLayout" label="助教">
                          <span @click="getUser('assistant')">
                            <a-input @change="assistantChange" style="cursor: pointer;color: #000;" placeholder="请选择助教" v-decorator="['assistant']">
                              <a-icon slot="addonAfter" type="search" />
                            </a-input>
                          </span>
                        </a-form-item>
                      </a-col>
                      <a-col :lg="8" :md="12" :sm="24" v-if="showSearchTag.body.cDate">
                        <a-form-item label="录入时间" v-bind="formItemLayout">
                          <a-range-picker v-decorator="['cDate']" style="width: 100%;" />
                        </a-form-item>
                      </a-col>
                      <a-col :lg="8" :md="12" :sm="24" v-if="showSearchTag.body.aDate">
                        <a-form-item label="再次跟进时间" v-bind="formItemLayout">
                          <a-range-picker v-decorator="['aDate']" style="width: 100%;" />
                        </a-form-item>
                      </a-col>
                      <a-col :lg="8" :md="12" :sm="24" v-if="showSearchTag.body.logDate">
                        <a-form-item label="办卡时间" v-bind="formItemLayout">
                          <a-range-picker v-decorator="['logDate']" style="width: 100%;" />
                        </a-form-item>
                      </a-col>
                      <a-col :lg="8" :md="12" :sm="24" v-if="showSearchTag.body.date">
                        <a-form-item label="选择日期" v-bind="formItemLayout">
                          <a-range-picker v-decorator="['date']" style="width: 100%;" />
                        </a-form-item>
                      </a-col>
                      <a-col :lg="8" :md="12" :sm="24" v-if="showSearchTag.body.logTime">
                        <a-form-item label="登录时间" v-bind="formItemLayout">
                          <a-range-picker format="YYYY-MM-DD HH:mm:ss" @ok="onOk" showTime v-decorator="['logTime']" style="width: 100%;" />
                        </a-form-item>
                      </a-col>
                      <a-col :lg="8" :md="12" :sm="24" v-if="showSearchTag.body.roomId && roomIdArr.length > 0">
                        <a-form-item v-bind="formItemLayout" label="教室名称">
                          <a-select v-decorator="['roomId']" placeholder="请选择教室">
                            <a-select-option :allowClear="true" v-for="(item, index) in roomIdArr" :key="index" :value="item.id">{{
                              item.roomName
                            }}</a-select-option>
                          </a-select>
                        </a-form-item>
                      </a-col>
                      <a-col :lg="8" :md="12" :sm="24" v-if="showSearchTag.body.userStatus">
                        <a-form-item v-bind="formItemLayout" label="跟进状态">
                          <a-select v-decorator="['userStatus']" placeholder="请选择状态">
                            <a-select-option :allowClear="true" value="Y">正常</a-select-option>
                            <a-select-option :allowClear="true" value="N">作废</a-select-option>
                          </a-select>
                        </a-form-item>
                      </a-col>
                      <a-col :lg="8" :md="12" :sm="24" v-if="showSearchTag.body.userState">
                        <a-form-item label="在职状态" v-bind="formItemLayout">
                          <a-select v-decorator="['userState']" placeholder="请选择状态">
                            <a-select-option :allowClear="true" value="Y">在职</a-select-option>
                            <a-select-option :allowClear="true" value="N">离职</a-select-option>
                          </a-select>
                        </a-form-item>
                      </a-col>
                      <a-col :lg="8" :md="12" :sm="24" v-if="showSearchTag.body.state">
                        <a-form-item label="确认状态" v-bind="formItemLayout">
                          <a-select :allowClear="true" v-decorator="['state']" placeholder="请选择状态">
                            <a-select-option :allowClear="true" value="Y">已确认</a-select-option>
                            <a-select-option :allowClear="true" value="N">未确认</a-select-option>
                          </a-select>
                        </a-form-item>
                      </a-col>
                      <a-col :lg="8" :md="12" :sm="24" v-if="showSearchTag.body.payoff">
                        <a-form-item label="是否缴清" v-bind="formItemLayout">
                          <a-select :allowClear="true" v-decorator="['payoff']" placeholder="请选择状态">
                            <a-select-option :allowClear="true" value="Y">已缴清</a-select-option>
                            <a-select-option :allowClear="true" value="N">未缴清</a-select-option>
                          </a-select>
                        </a-form-item>
                      </a-col>
                      <a-col :lg="8" :md="12" :sm="24" v-if="showSearchTag.body.hasAssignment">
                        <a-form-item v-bind="formItemLayout" label="资源状态">
                          <a-select :allowClear="true" v-decorator="['hasAssignment']" placeholder="请选择状态">
                            <a-select-option :allowClear="true" value="Y">已分配</a-select-option>
                            <a-select-option :allowClear="true" value="N">未分配</a-select-option>
                          </a-select>
                        </a-form-item>
                      </a-col>
                      <a-col :lg="8" :md="12" :sm="24" v-if="showSearchTag.body.userOfficial">
                        <a-form-item label="状态" v-bind="formItemLayout">
                          <a-select v-decorator="['userOfficial']" placeholder="请选择状态">
                            <a-select-option :allowClear="true" value="A">全职</a-select-option>
                            <a-select-option :allowClear="true" value="B">试用</a-select-option>
                            <a-select-option :allowClear="true" value="C">兼职</a-select-option>
                          </a-select>
                        </a-form-item>
                      </a-col>
                      <a-col :lg="8" :md="12" :sm="24" v-if="showSearchTag.body.cardStatus">
                        <a-form-item v-bind="formItemLayout" label="卡状态">
                          <a-select :allowClear="true" v-decorator="['status']" placeholder="请选择状态">
                            <a-select-option :allowClear="true" value="A">未使用</a-select-option>
                            <a-select-option :allowClear="true" value="B">使用中</a-select-option>
                            <a-select-option :allowClear="true" value="C">停课</a-select-option>
                            <a-select-option :allowClear="true" value="D">退卡</a-select-option>
                            <a-select-option :allowClear="true" value="E">结业</a-select-option>
                            <a-select-option :allowClear="true" value="F">撤销</a-select-option>
                            <a-select-option :allowClear="true" value="G">结转</a-select-option>
                          </a-select>
                        </a-form-item>
                      </a-col>
                      <a-col :lg="8" :md="12" :sm="24" v-if="showSearchTag.body.school_id && schoolList.length > 0 && !hasSchool">
                        <a-form-item v-bind="formItemLayout" label="选择分馆">
                          <a-tree-select
                            v-decorator="['school_id']"
                            :allowClear="true"
                            :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
                            :treeData="schoolList"
                            treeDefaultExpandAll
                          >
                          </a-tree-select>
                        </a-form-item>
                      </a-col>
                      <a-col :lg="8" :md="12" :sm="24" v-if="showSearchTag.body.classTypeSingleId && classTypeSingleIdArr.length > 0">
                        <a-form-item v-bind="formItemLayout" label="班级类型">
                          <a-select :allowClear="true" v-decorator="['classTypeSingleId']" placeholder="请选择班级类型">
                            <a-select-option :allowClear="true" v-for="(item, index) in classTypeSingleIdArr" :key="index" :value="item.id">{{
                              item.name
                            }}</a-select-option>
                          </a-select>
                        </a-form-item>
                      </a-col>
                      <a-col :lg="8" :md="12" :sm="24" v-if="showSearchTag.body.classTypeId && classTypeIdArr.length > 0">
                        <a-form-item v-bind="formItemLayout" label="班型选择">
                          <a-cascader
                            :options="classTypeIdArr"
                            placeholder="请选择班型"
                            :fieldNames="{ label: 'name', value: 'id', children: 'children' }"
                            changeOnSelect
                            v-decorator="['classTypeId', { rules: [{ required: false, message: '请选择类型班型' }] }]"
                          />
                        </a-form-item>
                      </a-col>
                    </a-row>
                  </a-col>
                  <a-col :span="5"></a-col>
                  <a-col :span="1"></a-col>
                </a-row>
              </div>
            </transition>
          </div>
        </a-form>
      </a-col>
    </a-row>
    <!-- imodal -->
    <i-modal ref="modal" :multiple="false" :userType="userType" @ok="imodalOk" @close="imodalClose" @getBackData="getUserBack"> </i-modal>
    <!-- card-modal -->
    <card-modal ref="cardModal" :classType="classType" @ok="cardModalOk" @close="cardModalClose" @getBackData="getBackData"> </card-modal>
  </div>
</template>
<script>
import { IModal, CardModal } from '@/components'
import { filterEmptyObject } from '@/utils/util'
import { danceList, cardTypeList, classList, roomList, getSchoolList } from '@/api/education/card'
import { treeEduClassType, listEduType } from '@/api/common'
import { listGoodsTypeCo } from '@/api/inventory/inventoryApi'
import { defaultLayout, timeLayout, inputShowTags } from './searchCom.js'
export default {
  props: {
    showSearchTag: {
      type: Object,
      default: null
    },
    classType: {
      type: String, // A:常规班；B:私教班，C: 非常规班，D：非私教班，E：非 常规班和私教班
      default: null
    }
  },
  components: {
    CardModal,
    IModal
  },
  watch: {
    showSearchTag(nv) {
      // 如果传值有danceId
      if (nv.title.danceId || (nv.body && nv.body.danceId)) {
        this.loadDanceId()
      }
      // 如果传值有cardTypeId
      if (nv.title.cardTypeId || (nv.body && nv.body.cardTypeId)) {
        this.loadCardTypeId()
      }
      // 如果传值有roomId
      if (nv.title.roomId || (nv.body && nv.body.roomId)) {
        this.loadRoomId()
      }
      // 如果传值有classTypeId
      if (nv.title.classTypeId || (nv.body && nv.body.classTypeId)) {
        this.loadclassTypeId()
      }
      // 如果传值有classTypeSingleId
      if (nv.title.classTypeSingleId || (nv.body && nv.body.classTypeSingleId)) {
        this.loadclassTypeSingleId()
      }
      // 如果传值有classTypeId
      if (nv.title.school_id || (nv.body && nv.body.school_id)) {
        this.this.loadSchoolId()
      }
      // 如果传值有classTypeId
      if (nv.title.goodsTypeId || (nv.body && nv.body.goodsTypeId)) {
        this.this.loadGoodsTypeId()
      }
    }
  },
  mounted() {
    // 如果传值有danceId
    if (this.showSearchTag.title.danceId || (this.showSearchTag.body && this.showSearchTag.body.danceId)) {
      this.loadDanceId()
    }
    // 如果传值有CardTypeId
    if (this.showSearchTag.title.cardTypeId || (this.showSearchTag.body && this.showSearchTag.body.cardTypeId)) {
      this.loadCardTypeId()
    }
    // 如果传值有roomId
    if (this.showSearchTag.title.roomId || (this.showSearchTag.body && this.showSearchTag.body.roomId)) {
      this.loadRoomId()
    }
    // 如果传值有classTypeId
    if (this.showSearchTag.title.classTypeId || (this.showSearchTag.body && this.showSearchTag.body.classTypeId)) {
      this.loadclassTypeId()
    }
    // 如果传值有classTypeSingleId
    if (this.showSearchTag.title.classTypeSingleId || (this.showSearchTag.body && this.showSearchTag.body.classTypeSingleId)) {
      this.loadclassTypeSingleId()
    }
    // 如果传值有school_id
    if (this.showSearchTag.title.school_id || (this.showSearchTag.body && this.showSearchTag.body.school_id)) {
      this.loadSchoolId()
    }
    // 如果传值有goodsTypeId
    if (this.showSearchTag.title.goodsTypeId || (this.showSearchTag.body && this.showSearchTag.body.goodsTypeId)) {
      this.loadGoodsTypeId()
    }
  },
  data() {
    return {
      inputShowTags,
      isShow: false,
      formItemLayout: defaultLayout,
      timeLayout,
      //验证
      validNum: new RegExp(/^[1-9]\d{10}$/, 'g'),
      //imdal
      userType: 'all',
      queryParam: {},
      //舞种列表
      danceIdArr: [],
      //卡种列表
      cardTypeIdArr: [],
      //班级列表
      roomIdArr: [],
      //班型列表
      classTypeIdArr: [],
      //分馆列表及其他
      hasSchool: false,
      //分馆id
      schoolList: [],
      //物品类型id
      goodsTypeList: []
    }
  },
  beforeCreate() {
    this.form = this.$form.createForm(this)
  },
  methods: {
    isShowTitleCol(key) {
      return this.showSearchTag.title && this.showSearchTag.title[key]
    },
    isShowBodyCol(key) {
      return this.showSearchTag.body && this.showSearchTag.body[key]
    },
    //手动改助教,清空query里的值
    assistantChange() {
      if (this.queryParam.assistantId) {
        this.queryParam.assistantId = ''
      }
    },
    //物品类型 goodsTypeId
    loadGoodsTypeId() {
      listGoodsTypeCo().then(res => {
        if (res.code === 200 && res.data) {
          this.goodsTypeList = res.data
        }
      })
    },
    //班级名称 roomId
    loadRoomId() {
      roomList().then(res => {
        if (res.code === 200 && res.data) {
          this.roomIdArr = res.data
        }
      })
    },
    //舞种相关danceId
    loadDanceId() {
      danceList().then(res => {
        if (res.code === 200 && res.data) {
          this.danceIdArr = res.data
        }
      })
    },
    //卡种类型相关cardTypeId
    loadCardTypeId() {
      cardTypeList().then(res => {
        if (res.code === 200 && res.data) {
          this.cardTypeIdArr = res.data
        }
      })
    },
    //卡种类型相关classTypeSingleId
    loadclassTypeSingleId() {
      listEduType().then(res => {
        if (res.code === 200 && res.data) {
          this.classTypeSingleIdArr = res.data
        }
      })
    },
    // 班型loadclassTypeId相关
    loadclassTypeId() {
      let params = {
        type: this.classType
      }
      treeEduClassType(params).then(res => {
        if (res.code === 200 && res.data) {
          this.$tools.transNullToArr(res.data)
          console.log(res.data)
          this.classTypeIdArr = res.data
        }
      })
    },
    //分馆loadSchoolId相关
    loadSchoolId() {
      this.hasSchool = !!this.$store.getters.userInfo.schools
      //请求接口
      getSchoolList().then(res => {
        if (res.code === 200 && res.data) {
          console.log(res.data)
          this.schoolList = this._handleData(res.data)
        }
      })
    },
    selectCardTypeId(v) {
      this.queryParam.cardTypeId = v
    },
    //imodal
    getUser(type) {
      this.userType = type
      this.$refs.modal.open()
    },
    imodalOk() {},
    imodalClose() {},
    getUserBack(data, type) {
      if (type === 'all') {
        this.$nextTick(() => {
          this.form.setFieldsValue({ user: data.name })
          this.queryParam.userId = data.id
        })
      } else {
        this.$nextTick(() => {
          this.form.setFieldsValue({ [type]: data.name })
          this.queryParam[`${type}Id`] = data.id
        })
      }
    },
    // cardmodal
    getCard() {
      this.$refs.cardModal.open()
    },
    cardModalOk() {},
    cardModalClose() {},
    getBackData(value) {
      this.$nextTick(() => {
        this.queryParam.deptCardId = value.id
        this.form.setFieldsValue({ ['cardName']: value.cardName })
      })
    },
    showBody() {
      this.isShow = !this.isShow
    },
    searchParms() {
      this.validateData().then(formData => {
        let temResult = {}
        let changeResult = {
          classTypeId: formData.classTypeId ? (formData.classTypeId = formData.classTypeId.join(',')) : '',
          assistantName: this.queryParam.assistantId ? '' : formData.assistant,
          cStartDate: formData.cDate && formData.cDate.length > 0 ? this.$tools.tailor.getDate(formData.cDate[0]) : null,
          cEndDate: formData.cDate && formData.cDate.length > 0 ? this.$tools.tailor.getDate(formData.cDate[1]) : null,
          aStartDate: formData.aDate && formData.aDate.length > 0 ? this.$tools.tailor.getDate(formData.aDate[0]) : null,
          aEndDate: formData.aDate && formData.aDate.length > 0 ? this.$tools.tailor.getDate(formData.aDate[1]) : null,
          cardStartDate: formData.logDate && formData.logDate.length > 0 ? this.$tools.tailor.getDate(formData.logDate[0]) : null,
          cardEndDate: formData.logDate && formData.logDate.length > 0 ? this.$tools.tailor.getDate(formData.logDate[1]) : null,
          cLoginDate: formData.logTime && formData.logTime.length > 0 ? this.$tools.tailor.getDateTime(formData.logTime[0]) : null,
          eLoginDate: formData.logTime && formData.logTime.length > 0 ? this.$tools.tailor.getDateTime(formData.logTime[1]) : null,
          startDate: formData.date && formData.date.length > 0 ? this.$tools.tailor.getDate(formData.date[0]) : null,
          endDate: formData.date && formData.date.length > 0 ? this.$tools.tailor.getDate(formData.date[1]) : null
        }
        // 添加卡种,顾问,教师
        temResult = Object.assign(formData, changeResult, this.queryParam)
        // 去空函数
        let result = filterEmptyObject(temResult)

        const filterArr = ['cDate', 'aDate', 'logDate', 'date', 'logTime']
        filterArr.forEach(item => {
          delete result[item]
        })

        //如果有classTypeSingleId
        if (result.classTypeSingleId) {
          result.classTypeId = result.classTypeSingleId
          delete result['classTypeSingleId']
        }

        console.log(result)
        this.$emit('searchSubmit', result)
      })
    },

    //重置
    reset() {
      //其他值重置
      this.queryParam = {}
      //表单重置
      this.form.resetFields()
      this.$emit('searchSubmit', {})
    },

    // 验证
    validateData() {
      return this.form.validateFields()
    },

    // 空函数
    onOk() {}
  }
}
</script>

<style lang="less">
@import '~@/assets/style/index';

.search-com-wrapper {
  :global {
    .ant-form-item {
      /*padding: 2px 0;*/
      margin-bottom: 0;
    }
    .ant-input-disabled {
      background-color: #f5f5f5;
      opacity: 1;
      cursor: pointer;
      color: rgba(0, 0, 0, 0.25);
    }
  }

  .form-wrapper {
    position: relative;
    box-sizing: border-box;
    border-radius: 3px;
    transition: all 0.3s linear;

    .search-header {
      position: relative;
      z-index: 100;
      background: #fff;

      .arrow-wrapper {
        position: relative;
        cursor: pointer;
        left: 5px;
        height: 49px;
        line-height: 49px;
      }
    }

    .search-body {
      position: relative;
      background: #fff;
      z-index: 50;
    }

    .rotateIcon {
      transition: all 0.3s linear;
      transform: rotate(0deg);

      &.rotate {
        transform: rotate(-90deg);
      }
    }

    .submit-btn {
      position: relative;
      top: -2px;
    }

    .empty {
      width: 100%;
      .center();
    }
  }
}
</style>
