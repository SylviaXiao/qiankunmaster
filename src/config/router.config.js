// eslint-disable-next-line
import { UserLayout, BasicLayout, RouteView, BlankLayout, PageView } from '@/layouts'
import { bxAnaalyse } from '@/core/icons'
import { truncate } from 'lodash'

/**
 * 基础路由
 * @type { *[] }
 */
export const asyncRouterMap = [
  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: { title: '首页' },
    redirect: '/home',

    children: [
      //homePage
      {
        path: '/home',
        name: 'home',
        component: RouteView,
        meta: { title: '首页', icon: 'home', hidden: true },
        redirect: '/homepage',
        hideChildrenInMenu: true,
        children: [
          {
            path: '/homepage',
            name: 'homepage',
            component: () => import('@/views/HomePage'),
            meta: { title: '首页', keepAlive: true, hidden: true }
          },
          {
            path: '/user/center',
            name: 'center',
            component: () => import('@/views/user/userCenter'),
            meta: { title: '个人中心', keepAlive: true, hidden: true }
          }
        ]
      },
      {
        path: '/qiankun',
        name: 'qiankun',
        component: RouteView,
        meta: { title: '微应用', icon: 'book' },
        redirect: '/qiankun/qiankun',
        children: [
          {
            path: '/qiankun/workflow',
            name: 'qiankunqiankun',
            component: RouteView,
            meta: { title: '微应用', icon: 'caret-down' },
            children: [
              {
                path: `/vueApp1/test`,
                name: 'qiankunbase1',
                component: RouteView,
                meta: { title: '子应用1', keepAlive: true, isMircro: true }
              },
              {
                path: `/vueApp1/approvalList`,
                name: 'approvalList',
                component: RouteView,
                meta: { title: '流程配置', keepAlive: true, isMircro: true }
              },
              {
                path: `/erp/qiankun/vue`,
                name: 'qiankunbase2',
                component: RouteView,
                meta: { title: '子应用2', keepAlive: true, isMircro: true }
              }
            ]
          }
        ]
      },
      {
        path: '/myVerify',
        name: 'myVerify',
        component: RouteView,
        meta: { title: '审批', icon: 'book' },
        redirect: '/myVerify/verify',
        children: [
          {
            path: '/myVerify/refundManage',
            name: 'refundManage',
            component: RouteView,
            meta: { title: '退费', icon: 'caret-down', keepAlive: true },
            children: [
              {
                path: '/myVerify/refund',
                name: 'verify',
                component: () => import('@/views/myVerify/refund'),
                meta: { title: '待上传', keepAlive: true }
              }
            ]
          }
        ]
      },
      //intentionStu
      {
        path: '/intentionStu',
        name: 'intentionStu',
        component: RouteView,
        meta: {
          title: '资源',
          icon: 'solution',
          permission: ['student:user', 'system:stusource', 'system:channel', 'system:stu-tag', 'system:age-bracket']
        },
        children: [
          {
            path: '/intentionStu/recruitManage',
            name: 'recruitManage',
            component: RouteView,
            meta: { title: '招生管理', icon: 'caret-down', keepAlive: true },
            children: [
              {
                path: '/intentionStu/foreground',
                name: 'foreground',
                component: () => import('@/views/intentionStu/foreground'),
                meta: { title: '意向学员(前台)', keepAlive: true, permission: ['student:user:school'] }
              },
              {
                path: '/intentionStu/service',
                name: 'service',
                component: () => import('@/views/intentionStu/service'),
                meta: { title: '意向学员(客服)', keepAlive: true, permission: ['student:user:service'] }
              },
              {
                path: '/intentionStu/adviser',
                name: 'adviser',
                component: () => import('@/views/intentionStu/adviser'),
                meta: { title: '意向学员(顾问)', keepAlive: true, permission: ['student:user:master'] }
              },
              {
                path: '/intentionStu/invalid',
                name: 'invalid',
                component: () => import('@/views/intentionStu/invalid'),
                meta: { title: '无效资源', keepAlive: true, permission: ['student:user:void'] }
              },
              {
                path: '/intentionStu/recourceFeedback',
                name: 'recourceFeedback',
                component: () => import('@/views/intentionStu/recourceFeedback'),
                meta: { title: '资源反馈看板', keepAlive: true, permission: ['student:user:feedbacklist'] }
              },
              {
                path: '/intentionStu/:roleName/resourceInfo/:id/:stuId',
                name: 'resourceInfo',
                component: () => import('@/views/intentionStu/modules/resourceInfo'),
                meta: {
                  title: '资源详情',
                  keepAlive: false,
                  permission: ['student:user:school', 'student:user:service', 'student:user:master'],
                  hidden: true
                }
              },
              {
                path: '/intentionStu/resourceDeleteLog',
                name: 'resourceDeleteLog',
                component: () => import('@/views/intentionStu/resourceDeleteLog'),
                meta: { title: '资源删除记录', keepAlive: true, permission: ['student:user:dellog'] }
              }
            ]
          },
          {
            path: '/intentionStu/targetManage',
            name: 'targetManage',
            component: RouteView,
            meta: { title: '目标管理', icon: 'caret-down', keepAlive: true },
            children: [
              {
                path: '/intentionStu/fluxDataManage',
                name: 'fluxDataManage',
                component: () => import('@/views/intentionStu/fluxDataManage'),
                meta: { title: '每日引流数据管理', keepAlive: true, permission: ['analysis:newmedia', 'analysis:business'] }
              },
              {
                path: '/intentionStu/resourceManage',
                name: 'resourceManage',
                component: () => import('@/views/intentionStu/resourceManage'),
                meta: { title: '资源目标管理', keepAlive: true, permission: ['analysis:networktarget'] }
              }
            ]
          },
          {
            path: '/intentionStu/rescueSysManage',
            name: 'rescueSysManage',
            component: RouteView,
            meta: { title: '配置管理', icon: 'caret-down', keepAlive: true },
            children: [
              {
                path: '/system/stusource',
                name: 'stusource',
                component: () => import('@/views/system/stusource'),
                meta: { title: '招生来源管理', keepAlive: true, permission: ['system:stusource:view'] }
              },
              {
                path: '/system/channel',
                name: 'channel',
                component: () => import('@/views/system/channel'),
                meta: { title: '渠道管理(客服)', keepAlive: true, permission: ['system:channel'] }
              },
              {
                path: '/system/stuAge',
                name: 'stuAge',
                component: () => import('@/views/system/stuAge'),
                meta: { title: '客户年龄段配置表', keepAlive: true, permission: ['system:age-bracket:view'] }
              },
              {
                path: '/system/stuTag',
                name: 'stuTag',
                component: () => import('@/views/system/stuTag'),
                meta: { title: '客户标签配置表 ', keepAlive: true, permission: ['system:stu-tag:view'] }
              }
            ]
          }
        ]
      },
      //reception
      {
        path: '/reception',
        name: 'reception',
        component: RouteView,
        meta: {
          title: '前台',
          icon: 'tablet',
          permission: ['student:info', 'student:card', 'education', 'cer:grading', 'finance', 'organize']
        },
        children: [
          {
            path: '/reception/studentManage',
            name: 'studentManage',
            component: RouteView,
            meta: { title: '学员管理', icon: 'caret-down', keepAlive: true, permission: ['student', 'education'] },
            children: [
              {
                path: '/reception/stuApply',
                name: 'stuApply',
                component: RouteView,
                redirect: '/reception/stuApplyForm',
                meta: { title: '学员报名', keepAlive: true, hidden: true, permission: ['student:info:join'] }
              },
              {
                path: '/reception/stuApplyForm',
                name: 'stuApplyForm',
                component: () => import('@/views/reception/stuApply'),
                meta: { title: '学员报名', keepAlive: true, permission: ['student:info:join'] }
              },
              {
                path: '/reception/carryOver',
                name: 'carryOver',
                component: () => import('@/views/reception/carryOver'),
                meta: { title: '结转', keepAlive: false, permission: ['student:info:cardchange'] }
              },
              {
                path: '/reception/previousStuForm',
                name: 'previousStuForm',
                component: () => import('@/views/reception/previousStu'),
                meta: {
                  title: '旧系统学员录入',
                  keepAlive: false,
                  permission: ['student:info:period'],
                  hidden: true
                }
              },
              {
                path: '/reception/stuApplyResult/:stuInfo',
                name: 'stuApplyResult',
                component: () => import('@/views/reception/result'),
                meta: { title: '结果页', keepAlive: false, permission: ['student:info'], hidden: true }
              },
              {
                path: '/reception/studentList',
                name: 'studentList',
                component: () => import('@/views/reception/student'),
                meta: { title: '学员管理', keepAlive: true, permission: ['student:info:view'] }
              },
              {
                path: '/reception/studentInfo/:id/:tabKey?',
                name: 'studentInfo',
                component: () => import('@/views/reception/studentInfo'),
                meta: {
                  title: '学员详情',
                  keepAlive: true,
                  permission: ['student:info:view'],
                  hidden: true
                }
              },
              {
                path: '/reception/stuCardsList',
                name: 'stuCardsList',
                component: () => import('@/views/reception/stuCards'),
                meta: {
                  title: '学员卡管理',
                  keepAlive: true,
                  permission: ['student:card:view']
                }
              },
              {
                path: '/reception/stuPayment/:stuCardsId',
                name: 'stuPayment',
                component: () => import('@/views/reception/stuPayment'),
                meta: { title: '学员缴费', keepAlive: false, permission: ['student:info:paid'], hidden: true }
              },
              {
                path: '/reception/stuCardOnLine',
                name: 'stuCardOnLine',
                component: () => import('@/views/reception/stuCardOnLine'),
                meta: { title: '邀请码管理', keepAlive: true, permission: ['education:class-url:view'] }
              },
              {
                path: '/reception/stuRecord',
                name: 'stuRecord',
                component: () => import('@/views/reception/stuRecord'),
                meta: { title: '学员档案查询', keepAlive: true, permission: ['student:info:retrieval'] }
              }
            ]
          },
          {
            path: '/reception/classManage',
            name: 'classManage',
            component: RouteView,
            meta: { title: '班级管理', icon: 'caret-down', keepAlive: true, permission: ['education'] },
            children: [
              {
                path: '/reception/course',
                name: 'course',
                component: () => import('@/views/reception/course'),
                meta: { title: '排课管理', keepAlive: true, permission: ['education:plan:view'] }
              },
              {
                path: '/reception/room',
                name: 'room',
                component: () => import('@/views/education/room'),
                meta: { title: '教室管理', keepAlive: true, permission: ['education:room'] }
              },
              {
                path: '/reception/classList',
                name: 'classList',
                component: () => import('@/views/education/class'),
                meta: {
                  title: '成人班级管理',
                  keepAlive: true,
                  permission: ['education:class:view']
                }
              },
              {
                path: '/reception/childrenClassList',
                name: 'childrenClassList',
                component: () => import('@/views/education/childrenClass'),
                meta: {
                  title: '少儿班级管理',
                  keepAlive: true,
                  permission: ['education:class:view','education:pageChildClass:view']
                }
              },
              {
                path: '/reception/class/addClass',
                name: 'addClass',
                component: () => import('@/views/education/class/addClass'),
                meta: {
                  title: '新增班级',
                  keepAlive: false,
                  permission: ['education:class:save'],
                  hidden: true
                }
              },
              {
                path: '/reception/class/editClass/:classid',
                name: 'editClass',
                component: () => import('@/views/education/class/editClass'),
                meta: {
                  title: '编辑班级',
                  keepAlive: false,
                  permission: ['education:class:save'],
                  hidden: true
                }
              },
              {
                path: '/reception/class/registerTest/:classId',
                name: 'registerTest',
                component: () => import('@/views/education/class/registerTest'),
                meta: { title: '班级报考', keepAlive: true, permission: ['cer:grading:view'], hidden: true }
              },
              {
                path: '/reception/class/classInfo/:classid',
                name: 'classInfo',
                component: () => import('@/views/education/class/classInfo'),
                meta: {
                  title: '班级详情',
                  keepAlive: true,
                  permission: ['education:class:view'],
                  hidden: true
                }
              },
              {
                path: '/reception/classOnLine/classInfo/:classid',
                name: 'normalClassOnlineInfo',
                component: () => import('@/views/education/classOnLine/classInfo'),
                meta: {
                  title: '班级详情',
                  keepAlive: true,
                  permission: ['education:class:view'],
                  hidden: true
                }
              },
              {
                path: '/reception/personalList',
                name: 'personalList',
                component: () => import('@/views/reception/personal'),
                meta: {
                  title: '私教和商演管理',
                  keepAlive: true,
                  permission: ['education:class:personal']
                }
              },
              {
                path: '/reception/personal/classInfo/:classid',
                name: 'personalClassInfo',
                component: () => import('@/views/reception/personal/classInfo'),
                meta: {
                  title: '私教和商演详情',
                  keepAlive: true,
                  permission: ['education:class:personal:view'],
                  hidden: true
                }
              },
              {
                path: '/reception/masterClassList',
                name: 'masterClassList',
                component: () => import('@/views/reception/masterClass'),
                meta: {
                  title: '大师课班级管理',
                  keepAlive: true,
                  permission: ['education:masterclass:view']
                }
              },
              {
                path: '/reception/masterClassList/classInfo/:classid',
                name: 'masterClassInfo',
                component: () => import('@/views/reception/masterClassInfo'),
                meta: {
                  title: '大师课班级详情',
                  keepAlive: true,
                  permission: ['education:masterclass:view'],
                  hidden: true
                }
              }
            ]
          },
          {
            path: '/reception/ahc-sign-Manage',
            name: 'ahc-sign-Manage',
            component: RouteView,
            meta: {
              title: '绩效/签到管理',
              icon: 'caret-down',
              keepAlive: true,
              permission: ['finance', 'salary', 'education']
            },
            children: [
              {
                path: '/reception/ahievement',
                name: 'ahievement',
                component: () => import('@/views/reception/ahievement'),
                meta: { title: '绩效管理', keepAlive: true, permission: ['finance:achievement'] }
              },
              {
                path: '/reception/finaAuditionDeduct',
                name: 'finaAuditionDeduct',
                component: () => import('@/views/reception/finaAuditionDeduct'),
                meta: {
                  title: '导师绩效/试课/考勤',
                  keepAlive: true,
                  permission: ['finance:finteacher', 'student:auditionlog:view', 'salary:deduct:view']
                }
              },
              {
                path: '/reception/classSign',
                name: 'classSign',
                component: () => import('@/views/reception/classSign'),
                meta: { title: '导师/助教签到查询', keepAlive: true, permission: ['education:signinlog:view'] }
              },
              {
                path: '/reception/transferCardManagement',
                name: 'transferCardManagement',
                component: () => import('@/views/reception/transferCardManagement'),
                meta: { title: '转卡顾问绩效管理', keepAlive: true, permission: ['finance:achievementchange'] }
              }
            ]
          },
          {
            path: '/reception/signManage',
            name: 'signManage',
            component: RouteView,
            meta: { title: '员工签到', icon: 'caret-down', keepAlive: true, permission: ['education'] },
            children: [
              {
                path: '/reception/userSign',
                name: 'userSign',
                component: () => import('@/views/reception/userSign'),
                meta: { title: '员工签到', keepAlive: true, permission: ['education:organizesigninlog:view'] }
              },
              {
                path: '/reception/employeeAttendance',
                name: 'employeeAttendance',
                component: () => import('@/views/reception/employeeAttendance'),
                meta: { title: '员工考勤明细表', keepAlive: true, permission: ['education:organizesigninlog:view'] }
              },
              {
                path: '/reception/branchRestDay',
                name: 'branchRestDay',
                component: () => import('@/views/reception/branchRestDay'),
                meta: {
                  title: '设置分馆休息日',
                  keepAlive: true,
                  hidden: true,
                  permission: ['education:organizedeptrestday:save']
                }
              }
            ]
          },
          {
            path: '/reception/cardManage',
            name: 'cardManage',
            component: RouteView,
            meta: { title: '卡种管理', icon: 'caret-down', keepAlive: true, permission: ['education'] },
            children: [
              {
                path: '/reception/schoolCard',
                name: 'schoolCard',
                component: () => import('@/views/education/schoolCard'),
                meta: { title: '卡种管理(分馆)', keepAlive: true, permission: ['education:deptcard'] }
              }
            ]
          },
          {
            path: '/reception/studentTransport',
            name: 'studentTransport',
            component: RouteView,
            meta: {
              title: '学员输送',
              icon: 'caret-down',
              keepAlive: true,
              permission: ['student:out:view', 'student:in:view']
            },
            children: [
              {
                path: '/reception/studentOutput',
                name: 'studentOutput',
                component: () => import('@/views/reception/studentOutput'),
                meta: { title: '学员输出', keepAlive: true, permission: ['student:out:view'] }
              },
              {
                path: '/reception/studentInput',
                name: 'studentInput',
                component: () => import('@/views/reception/studentInput'),
                meta: { title: '学员接收', keepAlive: true, permission: ['student:in:view'] }
              }
            ]
          },
          {
            path: '/reception/branchTargetManage',
            name: 'receptionBranchTargetManage',
            component: RouteView,
            meta: {
              title: '分馆目标管理',
              icon: 'caret-down',
              keepAlive: true,
              permission: ['finance:target:dancestat','education:coachplan:view','student:card:expireContinuationCard','finance:target:view','finance:target-perdevnum:view', 'finance:audition-report:view', 'finance:dept-visit:view','finance:totaltask-target:view','finance:storeadrank:view','finance:classPlan:view','finance:adviserData:view']
            },
            children: [
              {
                path: '/reception/branchTargetManage',
                name: 'branchTargetManage',
                component: () => import('@/views/reception/branchTargetManage/branchTargetManage'),
                meta: { title: '分馆目标管理', keepAlive: true, permission: ['finance:target:view','finance:target-perdevnum:view'] }
              },
              {
                path: '/reception/branchAnualReport',
                name: 'branchAnualReport',
                component: () => import('@/views/reception/branchAnualReport/branchAnualReport'),
                meta: { title: '分馆经营报表', keepAlive: true, permission: ['finance:target:stat','finance:target:dancestat'] }
              },
              {
                path: '/reception/totalContinuedDetails',
                name: 'totalContinuedDetails',
                component: () => import('@/views/reception/branchAnualReport/totalContinuedDetails'),
                meta: { title: '总续费明细）', hidden: true, keepAlive: true, permission: ['finance:target:dancestat'] }
              },
              {
                path: '/reception/totalRefundDetails',
                name: 'totalRefundDetails',
                component: () => import('@/views/reception/branchAnualReport/totalRefundDetails'),
                meta: { title: '总退费明细）', hidden: true, keepAlive: true, permission: ['finance:target:dancestat'] }
              },
              {
                path: '/reception/auditionRegisterReport',
                name: 'auditionRegisterReport',
                component: () => import('@/views/reception/auditionRegisterReport/index'),
                meta: { title: '试课报名登记表', keepAlive: true, permission: ['finance:audition-report:view', 'finance:priedureport:view'] }
              },
              {
                path: '/reception/auditionRegisterReportDetails',
                name: 'auditionRegisterReportDetails',
                component: () => import('@/views/reception/auditionRegisterReport/auditionRegisterReportDetails'),
                meta: { title: '试课报名登记表详情', keepAlive: true, hidden: true, permission: ['finance:audition-report:view'] }
              },
              {
                path: '/reception/personalAuditionRegisterReportDetails/:detailType',
                name: 'personalAuditionRegisterReportDetails',
                component: () => import('@/views/reception/auditionRegisterReport/personalAuditionRegisterReportDetails'),
                meta: { title: '私教199试课报名登记表详情（含缴费）', keepAlive: true, hidden: true, permission: ['finance:priedureport:view'] }
              },
              {
                path: '/reception/personalAuditionRegisterReportDetailsTotal/:detailType',
                name: 'personalAuditionRegisterReportDetailsTotal',
                component: () => import('@/views/reception/auditionRegisterReport/personalAuditionRegisterReportDetailsTotal'),
                meta: { title: '私教199试课报名登记表详情', keepAlive: true, hidden: true, permission: ['finance:priedureport:view'] }
              },
              {
                path: '/reception/personalAuditionRegisterReportDetailsNoFinance/:detailType',
                name: 'personalAuditionRegisterReportDetailsNoFinance',
                component: () => import('@/views/reception/auditionRegisterReport/personalAuditionRegisterReportDetailsNoFinance'),
                meta: { title: '私教199试课报名登记表详情（不含缴费）', keepAlive: true, hidden: true, permission: ['finance:priedureport:view'] }
              },
              {
                path: '/reception/visitInput',
                name: 'visitInput',
                component: () => import('@/views/reception/visitInput'),
                meta: { title: '来访人数录入', keepAlive: true, permission: ['finance:dept-visit:view'] }
              },
              {
                path: '/reception/achievementOrder',
                name: 'achievementOrder',
                component: () => import('@/views/reception/achievementOrder/achievementOrder'),
                meta: { title: '店面业绩排名', keepAlive: true, permission: ['finance:storeadrank:view'] }
              },
              {
                path: '/reception/totalTaskInput',
                name: 'totalTaskInput',
                component: () => import('@/views/reception/achievementOrder/totalTaskInput'),
                meta: { title: '总任务目标录入', keepAlive: true, permission: ['finance:totaltask-target:view'] }
              },
              {
                path: '/reception/adviserDataTable',
                name: 'adviserDataTable',
                component: () => import('@/views/reception/adviserDataTable'),
                meta: { title: '顾问数据统计', keepAlive: true, permission: ['finance:adviserData:view'] }
              },
              {
                path: '/reception/classPlanTable',
                name: 'classPlanTable',
                component: () => import('@/views/reception/classPlanTable/classPlanTable'),
                meta: { title: '开班计划表', keepAlive: true, permission: ['finance:classPlan:view'] }
              },
              {
                path: '/reception/refundCardStat',
                name: 'refundCardStat',
                component: () => import('@/views/reception/refundCardStat'),
                meta: { title: '退卡统计表', keepAlive: true, permission: ['finance:refundcard:view'] }
              },
              {
                path: '/reception/continuedCardEnd',
                name: 'continuedCardEnd',
                component: () => import('@/views/reception/continuedCardEnd/continuedCardEnd'),
                meta: { title: '到期续卡统计', keepAlive: true, permission: ['student:card:expireContinuationCard'] }
              },
              {
                path: '/reception/continuedCardEndDetails',
                name: 'continuedCardEndDetails',
                component: () => import('@/views/reception/continuedCardEnd/details'),
                meta: { title: '详情', keepAlive: true,hidden:true, permission: ['student:card:expireContinuationCard'] }
              },
              {
                path: '/reception/coachClassPlan',
                name: 'coachClassPlan',
                component: () => import('@/views/reception/coachClassPlan/coachClassPlan'),
                meta: { title: '教练班开班计划表', keepAlive: true, permission: ['education:coachplan:view'] }
              },
              {
                path: '/reception/coachClassPlanDetails',
                name: 'coachClassPlanDetails',
                component: () => import('@/views/reception/coachClassPlan/details'),
                meta: { title: '详情', keepAlive: true,hidden:true, permission: ['education:coachplan:view'] }
              },
            ]
          }
        ]
      },
      //education
      {
        path: '/education',
        name: 'education',
        component: RouteView,
        meta: { title: '教务', icon: 'pushpin', permission: ['education', 'salary', 'student:cardnextlog'] },
        children: [
          {
            path: '/education/educationConfig',
            name: 'educationConfig',
            component: RouteView,
            meta: { title: '基础配置维护', icon: 'caret-down', keepAlive: true, permission: ['education'] },
            children: [
              {
                path: '/education/card',
                name: 'card',
                component: () => import('@/views/education/card'),
                meta: { title: '卡种管理(总部)', keepAlive: true, permission: ['education:card'] }
              },
              {
                path: '/education/classType',
                name: 'educationClassType',
                component: () => import('@/views/education/classType'),
                meta: { title: '班型管理', keepAlive: true, permission: ['education:classtype'] }
              },
              {
                path: '/education/type',
                name: 'educationType',
                component: () => import('@/views/education/type'),
                meta: { title: '班级类型管理', keepAlive: true, permission: ['education:type'] }
              },
              {
                path: '/education/dance',
                name: 'educationDance',
                component: () => import('@/views/education/dance'),
                meta: { title: '舞种管理', keepAlive: true, permission: ['education:dance'] }
              },
              {
                path: '/education/continueCardRules',
                name: 'educationContinueCardRuleCcarbankManaged',
                component: () => import('@/views/education/continueCardRules'),
                meta: { title: '续卡规则配置表', keepAlive: true, permission: ['education:renewal:view'] }
              }
            ]
          },
          {
            path: '/classOnLine',
            name: 'classOnLineManeger',
            component: RouteView,
            meta: { title: '线上课管理', icon: 'caret-down', permission: ['education:class-online', 'education:class-url'] },
            children: [
              {
                path: '/education/classOnLineList',
                name: 'classOnLineList',
                component: () => import('@/views/education/classOnLine'),
                meta: {
                  title: '线上班级管理',
                  keepAlive: true,
                  permission: ['education:class-online:view']
                }
              },
              {
                path: '/education/classOnLine/addClass',
                name: 'addClassOnLine',
                component: () => import('@/views/education/classOnLine/addClass'),
                meta: {
                  title: '新增班级',
                  keepAlive: true,
                  permission: ['education:class-online:save'],
                  hidden: true
                }
              },
              {
                path: '/education/classOnLine/editClass/:classid',
                name: 'editClassOnLine',
                component: () => import('@/views/education/classOnLine/editClass'),
                meta: {
                  title: '编辑班级',
                  keepAlive: true,
                  permission: ['education:class-online:save'],
                  hidden: true
                }
              },
              {
                path: '/education/classOnLine/classInfo/:classid',
                name: 'classOnlineInfo',
                component: () => import('@/views/education/classOnLine/classInfo'),
                meta: {
                  title: '班级详情',
                  keepAlive: false,
                  permission: ['education:class-online:view'],
                  hidden: true
                }
              },
              {
                path: '/education/classOnLineUrl',
                name: 'classOnLineUrl',
                component: () => import('@/views/education/classOnLineUrl'),
                meta: { title: '邀请码管理', keepAlive: true, permission: ['education:class-url:import'] }
              },
              {
                path: '/education/classOnLineCancel',
                name: 'classOnLineCancel',
                component: () => import('@/views/education/classOnLineCancel'),
                meta: { title: '邀请码作废', keepAlive: true, permission: ['education:class-url:import'] }
              }
            ]
          },
          {
            path: '/education/teacher',
            name: 'teacher',
            component: RouteView,
            meta: { title: '导师管理', icon: 'caret-down', keepAlive: true, permission: ['salary'] },
            children: [
              {
                path: '/education/teacherContract',
                name: 'teacherContract',
                component: () => import('@/views/education/teacherContract'),
                meta: { title: '合同管理', keepAlive: true, permission: ['salary:template:view'] }
              },
              {
                path: '/education/teacherSalary',
                name: 'teacherSalary',
                component: () => import('@/views/education/teacherSalary'),
                meta: { title: '薪酬管理', keepAlive: true, permission: ['salary:template:view'] }
              },
              {
                path: '/education/teacherDemand',
                name: 'teacherDemand',
                component: () => import('@/views/education/teacherDemand'),
                meta: { title: '导师缺口管理', keepAlive: true, permission: ['salary:teacher-demand:view'] }
              },
              {
                path: '/education/teacherInterview',
                name: 'teacherInterview',
                component: () => import('@/views/education/teacherInterview'),
                meta: { title: '面试登记管理', keepAlive: true, permission: ['salary:interview-log:view'] }
              },
              {
                path: '/education/socialcontract',
                name: 'socialcontract',
                component: () => import('@/views/education/socialcontract'),
                meta: { title: '社保/合同待办', keepAlive: true, permission: ['salary:socialSecurity:view'] }
              }
            ]
          },
          {
            path: '/education/continuationCard',
            name: 'continuationCard',
            component: RouteView,
            meta: { title: '续卡管理', icon: 'caret-down', keepAlive: true, permission: ['student:cardnextlog'] },
            children: [
              {
                path: '/education/continuationCardManage',
                name: 'continuationCardManage ',
                component: () => import('@/views/education/continuationCardManage'),
                meta: { title: '续卡管理', keepAlive: true, permission: ['student:cardnextlog'] }
              }
            ]
          },
          {
            path: '/education/classPerformanceManage',
            name: 'classPerformanceManage',
            component: RouteView,
            meta: {
              title: '班级绩效',
              icon: 'caret-down',
              keepAlive: truncate
              // permission: ['education:achclass', 'education:report']
            },
            children: [
              {
                path: '/education/performanceManagement',
                name: 'performanceManagement',
                component: () => import('@/views/education/performanceManagement'),
                meta: { title: '教练班绩效管理', keepAlive: true, permission: ['education:achclass'] }
              },
              {
                path: '/education/performanceScore/:id/:className/:type',
                name: 'performanceScore',
                component: () => import('@/views/education/performanceScore'),
                meta: { title: '教练班绩效评分', keepAlive: false, hidden: true, permission: ['education:achclass'] }
              },
              {
                path: '/system/teachingRatings',
                name: 'teachingRatings',
                component: () => import('@/views/system/teachingRatings'),
                meta: { title: '教练班评分配置', keepAlive: true, permission: ['education:scoreitem'] }
              },
              {
                path: '/education/referenceEntry',
                name: 'referenceEntry',
                component: () => import('@/views/education/referenceEntry'),
                meta: { title: '参考值录入', keepAlive: true, permission: ['education:referenceValue:view'] }
              },
              {
                path: '/education/childrenPerformanceReportNew',
                name: 'childrenPerformanceReportNew',
                component: () => import('@/views/education/childrenPerformanceReportNew'),
                meta: { title: '少儿绩效报表', keepAlive: true, permission: ['education:children-report:view'] }
              },
              {
                path: '/education/childrenPerformanceReportDetailNew/:id/:title/:type',
                name: 'childrenPerformanceReportDetailNew',
                component: () => import('@/views/education/childrenPerformanceReportDetailNew'),
                meta: { title: '少儿绩效报表详情', keepAlive: false, hidden: true, permission: ['education:children-report:viewgrade'] }
              },
              {
                path: '/education/childrenPerformanceReport',
                name: 'childrenPerformanceReport',
                component: () => import('@/views/education/childrenPerformanceReport'),
                meta: { title: '少儿绩效报表（旧）', keepAlive: true, permission: ['education:children:view'] }
              },
              {
                path: '/system/childrenPerformanceRatings',
                name: 'childrenPerformanceRatings',
                component: () => import('@/views/system/childrenPerformanceRatings'),
                meta: { title: '少儿绩效配置', keepAlive: true, permission: ['education:children:gradepoint:view'] }
              },
              {
                path: '/education/privatePerformanceReport',
                name: 'privatePerformanceReport',
                component: () => import('@/views/education/privatePerformanceReport'),
                meta: { title: '私教绩效报表', keepAlive: false, permission: ['education:report:view'] }
              },
              {
                path: '/education/performanceScoreConfig',
                name: 'performanceScoreConfig',
                component: () => import('@/views/education/performanceScoreConfig'),
                meta: {
                  title: '私教评分配置',
                  keepAlive: true,
                  permission: ['education:item:view', 'education:achieveitem:view']
                }
              },
              {
                path: '/education/childrenPerformanceReportDetail/:id/:title',
                name: 'childrenPerformanceReportDetail',
                component: () => import('@/views/education/childrenPerformanceReportDetail'),
                meta: { title: '少儿绩效报表详情', keepAlive: true, hidden: true, permission: ['education:children:detail'] }
              }
            ]
          },
          {
            path: '/organize/allocation',
            name: 'allocation',
            component: RouteView,
            meta: {
              title: '人员区域设置',
              icon: 'caret-down',
              keepAlive: true,
              permission: ['organize:allocation:education','organize:tas-allocation:education:view']
            },
            children: [
              {
                path: '/organize/allocationEducation',
                name: 'allocationEducation',
                component: () => import('@/views/organize/allocationEducation'),
                meta: { title: '教研区域舞种配置', keepAlive: true, permission: ['organize:allocation:education'] }
              },
              {
                path: '/organize/teacherAreaSetting',
                name: 'teacherAreaSetting',
                component: () => import('@/views/organize/teacherAreaSetting'),
                meta: { title: '教研区域配置', keepAlive: true, permission: ['organize:tas-allocation:education:view'] }
              }
            ]
          }
        ]
      },
      //finance
      {
        path: '/finance',
        name: 'finance',
        component: RouteView,
        meta: {
          title: '财务',
          icon: 'money-collect',
          permission: ['finance', 'organize:allocation', 'organize:receiptbank']
        },
        children: [
          {
            path: '/finance/finaceManage',
            name: 'finaceManage',
            redirect: '/finance/detailed',
            component: RouteView,
            meta: { title: '财务管理', icon: 'caret-down', permission: ['finance'] },
            children: [
              {
                path: '/finance/detailed/:stuInfo?',
                name: 'detailed',
                component: () => import('@/views/finance/detailed'),
                meta: { title: '收入明细', keepAlive: true, permission: ['finance:info:income'] }
              },
              {
                path: '/finance/payDetailed/:stuInfo?',
                name: 'payDetailed',
                component: () => import('@/views/finance/payDetailed'),
                meta: { title: '支出明细', keepAlive: true, permission: ['finance:info:expend'] }
              },
              {
                path: '/finance/checkPayment',
                name: 'checkPayment',
                component: () => import('@/views/finance/checkPayment'),
                meta: { title: '对私汇总确认', keepAlive: true, permission: ['finance:info:private:view'] }
              },
              {
                path: '/finance/checkSumIncome',
                name: 'checkSumIncome',
                component: () => import('@/views/finance/checkSumIncome'),
                meta: { title: '对公汇总核对', keepAlive: true, permission: ['finance:info:public:approve:view'] }
              },
              {
                path: '/finance/storeRevenue',
                name: 'storeRevenue',
                component: () => import('@/views/finance/storeRevenue'),
                meta: { title: '店面收入管理', keepAlive: true, permission: ['finance:shop'] }
              },
              {
                path: '/finance/wageItemSetting',
                name: 'wageItemSetting',
                component: () => import('@/views/finance/wageItemSetting'),
                meta: { title: '工资项配置', keepAlive: true, permission: ['finance:config'] }
              },
              {
                path: '/finance/typeInData',
                name: 'typeInData',
                component: () => import('@/views/finance/typeInData'),
                meta: { title: '员工数据录入', keepAlive: true, permission: ['finance:employeeRecord'] }
              }
            ]
          },
          {
            path: '/finance/invoice',
            name: 'invoice',
            redirect: '/finance/makeInvoiceManagement',
            component: RouteView,
            meta: { title: '发票管理', icon: 'caret-down', permission: ['finance:invoice:view'] },
            children: [
              {
                path: '/finance/makeInvoiceManagement',
                name: 'makeInvoiceManagement',
                component: () => import('@/views/finance/makeInvoiceManagement'),
                meta: { title: '发票开票管理', keepAlive: true, permission: ['finance:invoice:view'] }
              },
              {
                path: '/finance/cancellationInvoiceManagement',
                name: 'cancellationInvoiceManagement',
                component: () => import('@/views/finance/cancellationInvoiceManagement'),
                meta: { title: '发票作废管理', keepAlive: true, permission: ['finance:invoice:view'] }
              }
            ]
          },
          {
            path: '/finance/setting',
            name: 'financesSetting',
            redirect: '/finance/setting',
            component: RouteView,
            meta: { title: '财务配置', icon: 'caret-down', permission: ['system', 'organize:allocation'] },
            children: [
              {
                path: '/system/dictPay',
                name: 'dictPay',
                component: () => import('@/views/system/dictPay'),
                meta: { title: '支付方式管理', keepAlive: true, permission: ['system:dict:view'] }
              },
              {
                path: '/organize/allocationFinance',
                name: 'allocationFinance',
                component: () => import('@/views/organize/allocationFinance'),
                meta: { title: '财务对公分馆配置', keepAlive: true, permission: ['organize:allocation:finance'] }
              }
            ]
          },
          {
            path: '/system/bankManage',
            name: 'bankManage',
            meta: { title: '报销账户管理', icon: 'caret-down', permission: ['organize:receiptbank'] },
            component: { render: h => h('router-view') },
            children: [
              {
                path: '/system/bankManage/bankAccount',
                name: 'bankAccount',
                component: () => import('@/views/system/bankManage'),
                meta: { title: '报销账户列表', keepAlive: false, permission: ['organize:receiptbank:view'] }
              }
            ]
          },
          {
            path: '/organize/financeAnalysis',
            name: 'financeAnalysis',
            meta: { title: '财务分析', icon: 'caret-down', permission: ['finance:analysis'] },
            component: { render: h => h('router-view') },
            children: [
              {
                path: '/organize/financeAnalysis/carryOverDetail',
                name: 'carryOverDetail',
                component: () => import('@/views/organize/carryOverDetail/carryOverDetail'),
                meta: { title: '结转记录明细', keepAlive: true, permission: ['finance:analysis:cardchange'] }
              }
            ]
          },
          {
            path: '/organize/inputSourceManage',
            name: 'inputSourceManageDict',
            meta: { title: '收入渠道管理', icon: 'caret-down', permission: ['finance:online:view','finance:onlineInfo:view','finance:listOnline:view'] },
            component: { render: h => h('router-view') },
            children: [
              {
                path: '/organize/inputSourceManage/inputSourceManage',
                name: 'inputSourceManage',
                component: () => import('@/views/organize/inputSourceManage/inputSourceManage'),
                meta: { title: '收入渠道管理', keepAlive: true, permission: ['finance:online:view'] }
              },
              {
                path: '/organize/inputSourceManage/receiptOnlineDetails',
                name: 'receiptOnlineDetails',
                component: () => import('@/views/organize/inputSourceManage/receiptOnlineDetails'),
                meta: { title: '线上收款（明细）', keepAlive: true, permission: ['finance:onlineInfo:view'] }
              },
              {
                path: '/organize/inputSourceManage/receiptOnlineTotal',
                name: 'receiptOnlineTotal',
                component: () => import('@/views/organize/inputSourceManage/receiptOnlineTotal'),
                meta: { title: '线上收款（汇总）', keepAlive: true, permission: ['finance:listOnline:view'] }
              },
              {
                path: '/organize/inputSourceManage/receiptOnlineTotalDetails/:startDate/:endDate/:id',
                name: 'receiptOnlineTotalDetails',
                component: () => import('@/views/organize/inputSourceManage/receiptOnlineTotalDetails'),
                meta: { title: '详情）', hidden: true, keepAlive: true, permission: ['finance:listOnline:view'] }
              },
              {
                path: '/organize/inputSourceManage/OnlineClassDetails/:startDate/:endDate/:id',
                name: 'OnlineClassDetails',
                component: () => import('@/views/organize/inputSourceManage/OnlineClassDetails'),
                meta: { title: '详情）', hidden: true, keepAlive: true, permission: ['finance:listOnline:view'] }
              }
            ]
          }
        ]
      },
      {
        path: '/disburse',
        name: 'disburse',
        component: RouteView,
        meta: { title: '财政', icon: 'transaction', permission: ['finance'] },
        children: [
          {
            path: '/disburse/disburseManage',
            name: 'disburseManage',
            redirect: '/disburse/spendManagement',
            component: RouteView,
            meta: { title: '财政支出', icon: 'caret-down', permission: ['finance'] },
            children: [
              {
                path: '/disburse/spendManagement',
                name: 'spendManagement',
                component: () => import('@/views/disburse/spendManagement'),
                meta: { title: '财务收入明细', keepAlive: true, permission: ['finance:spending:view'] }
              },
              {
                path: '/disburse/fiscalCharges',
                name: 'fiscalCharges',
                component: () => import('@/views/disburse/fiscalCharges'),
                meta: { title: '财务支出明细', keepAlive: true, permission: ['finance:spending:payment-view'] }

              },
              {
                path: '/disburse/paidManagement',
                name: 'paidManagement',
                component: () => import('@/views/disburse/paidManagement'),
                meta: { title: '财政付款明细', keepAlive: true, permission: ['finance:spending-pay:view'] }
              },
              {
                path: '/disburse/feeManagement',
                name: 'feeManagement',
                component: () => import('@/views/disburse/feeManagement'),
                meta: { title: '财政费用明细', keepAlive: true, permission: ['finance:spending-detail:view'] }
              },
              {
                path: '/disburse/branchManagement',
                name: 'branchManagement',
                component: () => import('@/views/disburse/branchManagement'),
                meta: { title: '分馆支出管理', keepAlive: true, permission: ['finance:spending-dept'] }
              },
              {
                path: '/disburse/splitTwice',
                name: 'splitTwice',
                component: () => import('@/views/disburse/splitTwice/splitTwice'),
                meta: { title: '总部成本分摊', keepAlive: true, permission: ['finance:secspl:view','finance:secsplinfo:view','finance:fee:view'] }
              },
              {
                path: '/disburse/borrowingDetail',
                name: 'borrowingDetail',
                component: () => import('@/views/disburse/borrowingDetail'),
                meta: { title: '员工借还款管理', keepAlive: true, permission: ['finance:borrow'] }
              },
              {
                path: '/disburse/detailsTransactions',
                name: 'detailsTransactions',
                component: () => import('@/views/disburse/detailsTransactions'),
                meta: { title: '账户借还款管理', keepAlive: true, permission: ['finance:fund', 'finance:fund-into'] }
              },
              {
                path: '/disburse/bankStatement',
                name: 'bankStatement',
                component: () => import('@/views/disburse/bankStatement'),
                meta: { title: '银行收支明细', keepAlive: true, permission: ['finance:spendingbank'] }
              }
            ]
          },
          {
            path: '/disburse/setting',
            name: 'disburseSetting',
            redirect: '/disburse/setting',
            component: RouteView,
            meta: { title: '财政配置', icon: 'caret-down', permission: ['system'] },
            children: [
              {
                path: '/disburse/costName',
                name: 'costName',
                component: () => import('@/views/disburse/costName'),
                meta: { title: '费用名称', keepAlive: true, permission: ['system:feename'] }
              },
              {
                path: '/disburse/bankManage',
                name: 'disburseBankManage',
                component: () => import('@/views/disburse/bankManage'),
                meta: { title: '银行管理', keepAlive: true, permission: ['system:bank'] }
              },
              {
                path: '/disburse/costType',
                name: 'costType',
                component: () => import('@/views/disburse/costType'),
                meta: { title: '费用类型', keepAlive: true, permission: ['system:feeitem'] }
              },
              {
                path: '/disburse/paymentTerm',
                name: 'paymentTerm',
                component: () => import('@/views/disburse/paymentTerm'),
                meta: { title: '收支项', keepAlive: true, permission: ['system:incomeitem'] }
              },
              {
                path: '/disburse/branchConfig',
                name: 'branchConfig',
                component: () => import('@/views/disburse/branchConfig'),
                meta: { title: '分馆/公司配置', keepAlive: true, permission: ['finance:company:view'] }
              }
            ]
          }
        ]
      },
      //certificate
      {
        path: '/certificate',
        name: 'certificate',
        component: RouteView,
        meta: { title: '考级', icon: 'project', permission: ['cer'] },
        children: [
          {
            path: '/certificate/certificateManage',
            name: 'certificateManage',
            redirect: '/certificate/grading',
            component: RouteView,
            meta: { title: '考级管理', icon: 'caret-down' },
            children: [
              {
                path: '/certificate/grading',
                name: 'grading',
                component: () => import('@/views/certificate/grading'),
                meta: { title: '考级信息', keepAlive: true, permission: ['cer:site'] }
              },
              {
                path: '/certificate/gradingInfo/:id',
                name: 'gradingInfo',
                component: () => import('@/views/certificate/gradingInfo'),
                meta: {
                  title: '详情',
                  keepAlive: false,
                  permission: ['cer:grading'],
                  hidden: true
                }
              }
            ]
          },
          {
            path: '/certificate/certificateSetting',
            name: 'certificateSetting',
            redirect: '/certificate/testAddress',
            component: RouteView,
            meta: { title: '考级配置', icon: 'caret-down' },
            children: [
              {
                path: '/certificate/certDept',
                name: 'certDept',
                component: () => import('@/views/certificate/certDept'),
                meta: { title: '考级地区配置 ', keepAlive: true, permission: ['cer:area'] }
              },
              {
                path: '/certificate/testAddress',
                name: 'testAddress',
                component: () => import('@/views/certificate/testAddress'),
                meta: { title: ' 承办单位', keepAlive: true, permission: ['cer:organizer'] }
              }
            ]
          }
        ]
      },

      //stat
      {
        path: '/stat',
        name: 'reports',
        component: RouteView,
        meta: {
          title: '统计',
          icon: 'bar-chart',
          permission: ['finance:stat', 'service:stat', 'school:stat', 'edu:stat', 'media:stat']
        },
        children: [
          {
            path: '/stat/statiscalStatement',
            name: 'reports-statiscalStatement',
            component: RouteView,
            meta: { title: '统计报表', icon: 'caret-down', permission: ['finance:stat'] },
            children: [
              {
                path: '/stat/statiscalStatement/deptFinance',
                name: 'deptFinance',
                component: () => import('@/views/stat/statistic/deptFinance/deptFinance'),
                meta: { title: '部门财报', keepAlive: true, permission: ['finance:salarycheck:view'] }
              },
              {
                path: '/stat/statiscalStatement/deptFinanceDetails/:type',
                name: 'deptFinanceDetails',
                component: () => import('@/views/stat/statistic/deptFinance/deptFinanceDetails'),
                meta: { title: '部门财报', hidden: true, keepAlive: true, permission: ['finance:salarycheck:view'] }
              },
              {
                path: '/stat/statiscalStatement/servicerPerformanceDetails/:type',
                name: 'servicerPerformanceDetails',
                component: () => import('@/views/stat/statistic/deptFinance/servicerPerformanceDetails'),
                meta: { title: '部门财报', hidden: true, keepAlive: true, permission: ['finance:salarycheck:view'] }
              },
              {
                path: '/stat/statiscalStatement/deptFinanceSecondDetails/:type',
                name: 'deptFinanceSecondDetails',
                component: () => import('@/views/stat/statistic/deptFinance/deptFinanceSecondDetails'),
                meta: { title: '部门财报', hidden: true, keepAlive: true, permission: ['finance:salarycheck:view'] }
              },

              {
                path: '/stat/statiscalStatement/deptFinanceCostTypeTotal',
                name: 'deptFinanceCostTypeTotal',
                component: () => import('@/views/stat/statistic/deptFinance/costTypeTotal'),
                meta: { title: '部门财报', hidden: true, keepAlive: true, permission: ['finance:salarycheck:view'] }
              },
              {
                path: '/stat/statiscalStatement/deptFinanceCostTypeTotalDetails',
                name: 'deptFinanceCostTypeTotalDetails',
                component: () => import('@/views/stat/statistic/deptFinance/costTypeTotalDetails'),
                meta: { title: '部门财报', hidden: true, keepAlive: true, permission: ['finance:salarycheck:view'] }
              },
              {
                path: '/stat/statiscalStatement/counselorAchievement',
                name: 'counselorAchievement',
                component: () => import('@/views/stat/statistic/counselorAchievement/counselorAchievement'),
                meta: { title: '顾问业绩验算表', keepAlive: true, permission: ['finance:advisercheck:view'] }
              },
              {
                path: '/stat/statiscalStatement/counselorAchievementDetails/:type/:startDate/:endDate/:startSection/:endSection/:rate/:performanceType',
                name: 'counselorAchievementDetails',
                component: () => import('@/views/stat/statistic/counselorAchievement/details'),
                meta: { title: '详情', hidden: true, keepAlive: true, permission: ['finance:advisercheck:view'] }
              },
              {
                path: '/stat/statiscalStatement/validcounselorAchievement',
                name: 'validcounselorAchievement',
                component: () => import('@/views/stat/statistic/validcounselorAchievement/validcounselorAchievement'),
                meta: { title: '有效顾问业绩表', keepAlive: true, permission: ['finance:adviserefficient:view'] }
              },
              {
                path: '/stat/statiscalStatement/validcounselorAchievementDetails/:type/:startDate/:endDate/:id',
                name: 'validcounselorAchievementDetails',
                component: () => import('@/views/stat/statistic/validcounselorAchievement/details'),
                meta: { title: '详情', hidden: true, keepAlive: true, permission: ['finance:adviserefficient:view'] }
              },
              {
                path: '/stat/statiscalStatement/teacherClass',
                name: 'teacherClass',
                component: () => import('@/views/stat/statistic/teacherClass/teacherClass'),
                meta: { title: '导师课时统计(店面)', keepAlive: true, permission: ['finance:teachersalary:view'] }
              },
              {
                path: '/stat/statiscalStatement/teacherClassDetails/:type/:startDate/:endDate',
                name: 'teacherClassDetails',
                component: () => import('@/views/stat/statistic/teacherClass/details'),
                meta: { title: '详情', hidden: true, keepAlive: true, permission: ['finance:teachersalary:view'] }
              },
              {
                path: '/stat/statiscalStatement/branchClassTable',
                name: 'branchClassTable',
                component: () => import('@/views/stat/statistic/branchClassTable/branchClassTable'),
                meta: { title: '分馆排课课时统计表', keepAlive: true, permission: ['finance:classSign:view'] }
              },
              {
                path: '/stat/statiscalStatement/branchClassTableDetails/:type/:startDate/:endDate',
                name: 'branchClassTableDetails',
                component: () => import('@/views/stat/statistic/branchClassTable/details'),
                meta: { title: '详情', hidden: true, keepAlive: true, permission: ['finance:classSign:view'] }
              },
              {
                path: '/stat/statiscalStatement/teacherAchievement',
                name: 'teacherAchievement',
                component: () => import('@/views/stat/statistic/teacherAchievement/teacherAchievement'),
                meta: { title: '导师业绩验算表', keepAlive: true, permission: ['finance:teachercheck:view'] }
              },
              {
                path: '/stat/statiscalStatement/teacherAchievementDetails/:type/:startDate/:endDate/:itemType/:targ',
                name: 'teacherAchievementDetails',
                component: () => import('@/views/stat/statistic/teacherAchievement/details'),
                meta: { title: '详情', hidden: true, keepAlive: true, permission: ['finance:teachercheck:view'] }
              }
            ]
          },
          {
            path: '/stat/profitcard',
            name: 'reports-profitcard',
            component: RouteView,
            meta: { title: '财务统计', icon: 'caret-down', permission: ['finance:stat'] },
            children: [
              {
                path: '/stat/profitcard/classUseStatistic',
                name: 'classUseStatistic',
                component: () => import('@/views/stat/finance/classUseStatistic/classUseStatistic'),
                meta: { title: '教室使用统计', keepAlive: true, permission: ['finance:stat:roomUseShoolStat'] }
              },
              {
                path: '/stat/profitcard/classUseStatisticDetailsClass/:startDate/:endDate/:id',
                name: 'classUseStatisticDetailsClass',
                component: () => import('@/views/stat/finance/classUseStatistic/detailsClass'),
                meta: { title: '详情', hidden: true, keepAlive: true, permission: ['finance:stat:roomUseShoolStat'] }
              },
              {
                path: '/stat/profitcard/classUseStatisticDetails/:startDate/:endDate/:id',
                name: 'classUseStatisticDetails',
                component: () => import('@/views/stat/finance/classUseStatistic/details'),
                meta: { title: '详情', hidden: true, keepAlive: true, permission: ['finance:stat:roomUseShoolStat'] }
              },
              {
                path: '/stat/profitcard/classPeopleStatistic',
                name: 'classPeopleStatistic',
                component: () => import('@/views/stat/finance/classPeopleStatistic'),
                meta: { title: '班级人数统计', keepAlive: true, permission: ['finance:stat:classStat'] }
              },
              {
                path: '/stat/profitcard/masterClassManage',
                name: 'masterClassManage',
                component: () => import('@/views/stat/finance/masterClassManage/masterClassManage'),
                meta: { title: '导师上课管理', keepAlive: true, permission: ['finance:stat:teacherSign'] }
              },
              {
                path: '/stat/profitcard/masterClassManage/:startDate/:endDate/:id',
                name: 'masterClassManageDetails',
                component: () => import('@/views/stat/finance/masterClassManage/details'),
                meta: { title: '详情', hidden: true, keepAlive: true, permission: ['finance:stat:teacherSign'] }
              },
              {
                path: '/stat/profitcard/balanceConsumpution',
                name: 'balanceConsumpution',
                component: () => import('@/views/stat/finance/balanceConsumpution/balanceConsumpution'),
                meta: { title: '消耗余额表', keepAlive: true, permission: ['finance:studentCard:balance:view'] }
              },
              {
                path: '/stat/profitcard/balanceConsumputionDetail/:type/:startDate/:endDate/:id/:beginRemainAmount',
                name: 'balanceConsumputionDetail',
                component: () => import('@/views/stat/finance/balanceConsumpution/details'),
                meta: { title: '详情', hidden: true, keepAlive: true, permission: ['finance:studentCard:balance:view'] }
              },

              {
                path: '/stat/profitcard/incomeSource',
                name: 'incomeSource',
                component: () => import('@/views/stat/finance/incomeSource'),
                meta: { title: '收入来源统计', keepAlive: true, permission: ['finance:stat:source:income'] }
              },
              {
                path: '/stat/profitcard/branchClassType',
                name: 'branchClassType',
                component: () => import('@/views/stat/finance/branchClassType'),
                meta: { title: '分馆班型收入统计', keepAlive: true, permission: ['finance:stat:eduTypIncome:school'] }
              },
              {
                path: '/stat/profitcard/finPayType',
                name: 'finPayType',
                component: () => import('@/views/stat/finance/finPayType'),
                meta: { title: '收入汇总统计', keepAlive: true, permission: ['finance:stat:paytype'] }
              },
              {
                path: '/stat/profitcard/finPayTypePublicSchool',
                name: 'finPayTypePublicSchool',
                component: () => import('@/views/stat/finance/finPayTypePublicSchool'),
                meta: { title: '对公收入汇总(分馆)', keepAlive: true, permission: ['finance:stat:paytype-school:public'] }
              },
              {
                path: '/stat/profitcard/finPayTypePrivate',
                name: 'finPayTypePrivate',
                component: () => import('@/views/stat/finance/finPayTypePrivate'),
                meta: { title: '对私收入汇总', keepAlive: true, permission: ['finance:stat:paytype-school:private'] }
              },
              {
                path: '/stat/profitcard/finAchievement',
                name: 'finAchievement',
                component: () => import('@/views/stat/finance/finAchievement'),
                meta: { title: '分馆业绩统计', keepAlive: true, permission: ['finance:stat:achievement'] }
              },
              {
                path: '/stat/profitcard/finAchievementGroup',
                name: 'finAchievementGroup',
                component: () => import('@/views/stat/finance/finAchievementGroup'),
                meta: { title: '分馆业绩减半统计', keepAlive: true, permission: ['finance:stat:achievement'] }
              },
              {
                path: '/stat/finance/finOrgUser',
                name: 'finOrgUser',
                component: () => import('@/views/stat/finance/finOrgUser'),
                meta: { title: '员工统计', keepAlive: true, permission: ['finance:stat:orguser'] }
              },
              {
                path: '/stat/finance/finOrgUserSalarySchool',
                name: 'finOrgUserSalarySchool',
                component: () => import('@/views/stat/finance/finOrgUserSalarySchool'),
                meta: { title: '员工工资统计', keepAlive: true, permission: ['finance:stat:salary:school'] }
              },
              {
                path: '/stat/finance/balanceSheet',
                name: 'balanceSheet',
                component: () => import('@/views/stat/finance/balanceSheet/index.vue'),
                meta: { title: '资产负债表', keepAlive: true, permission: ['finance:liabilities:view'] }
              },
              {
                path: '/stat/profitcard/finProfit',
                name: 'finProfit',
                component: () => import('@/views/stat/finance/finProfit'),
                meta: { title: '资产负债表(旧)', keepAlive: true, permission: ['finance:stat:profitcard'] }
              },
              {
                path: '/stat/profitcard/finConsum',
                name: 'finConsum',
                component: () => import('@/views/stat/finance/finConsum'),
                meta: { title: '资产消耗表', keepAlive: true, permission: ['finance:stat:consum'] }
              },
              {
                path: '/stat/profitcard/finRefund',
                name: 'finRefund',
                component: () => import('@/views/stat/finance/finRefund'),
                meta: { title: '退费统计', keepAlive: true, permission: ['finance:stat:refund'] }
              },
              {
                path: '/stat/finance/finRefundPublicDetail ',
                name: 'finRefundPublicDetail',
                component: () => import('@/views/stat/finance/finRefundPublicDetail'),
                meta: { title: '区域对公退费明细', keepAlive: true, permission: ['finance:stat:refund-public'] }
              },
              {
                path: '/stat/profitcard/finRefundCompare',
                name: 'finRefundCompare',
                component: () => import('@/views/stat/finance/finRefundCompare'),
                meta: { title: '退费统计(对比)', keepAlive: true, permission: ['finance:stat:refund'] }
              },
              {
                path: '/stat/profitcard/finRefundInfo',
                name: 'finRefundInfo',
                component: () => import('@/views/stat/finance/finRefundInfo'),
                meta: { title: '退费异常统计', keepAlive: true, permission: ['finance:stat:refund'] }
              },
              {
                path: '/stat/profitcard/refundStatisticTable',
                name: 'refundStatisticTable',
                component: () => import('@/views/stat/finance/refundStatisticTable'),
                meta: { title: '退费审核量统计', keepAlive: true, permission: ['finance:stat:refundAuditStat'] }
              }
            ]
          },
          {
            path: '/stat/service',
            name: 'reports-service',
            component: RouteView,
            meta: { title: '客服统计', icon: 'caret-down', permission: ['service:stat'] },
            children: [
              {
                path: '/stat/service/resourceAnalysis',
                name: 'resourceAnalysis',
                component: () => import('@/views/stat/service/resourceAnalysis'),
                meta: { title: '资源分析表', keepAlive: true, permission: ['student:user-resource-analysis:view'] }
              },
              {
                path: '/stat/service/serviceAchievement',
                name: 'serviceAchievement',
                component: () => import('@/views/stat/service/serviceAchievement'),
                meta: { title: '客服业绩统计', keepAlive: true, permission: ['service:stat:achievement'] }
              },
              {
                path: '/stat/service/serviceAchievementDiff',
                name: 'serviceAchievementDiff',
                component: () => import('@/views/stat/service/serviceAchievementDiff'),
                meta: { title: '客服业绩异常统计', keepAlive: true, permission: ['service:stat:achievement-diff'] }
              },
              {
                path: '/stat/service/serviceStuUserDay',
                name: 'serviceStuUserDay',
                component: () => import('@/views/stat/service/serviceStuUserDay'),
                meta: { title: '每日资源统计', keepAlive: true, permission: ['service:stat:stuuser:day'] }
              },
              {
                path: '/stat/service/serviceStuUserChannel',
                name: 'serviceStuUserChannel',
                component: () => import('@/views/stat/service/serviceStuUserChannel'),
                meta: { title: '(总)渠道来源统计', keepAlive: true, permission: ['service:stat:stuuser:channel'] }
              },
              {
                path: '/stat/service/serviceStuUserSchool',
                name: 'serviceStuUserSchool',
                component: () => import('@/views/stat/service/serviceStuUserSchool'),
                meta: { title: '(总)分馆资源月统计', keepAlive: true, permission: ['service:stat:stuuser:school'] }
              },
              {
                path: '/stat/service/serviceStuUserArea',
                name: 'serviceStuUserArea',
                component: () => import('@/views/stat/service/serviceStuUserArea'),
                meta: {
                  title: '(总)地区资源月统计',
                  keepAlive: true,
                  permission: ['service:stat:stuuser:area']
                }
              },
              {
                path: '/stat/service/serviceDance',
                name: 'serviceDance',
                component: () => import('@/views/stat/service/serviceDance'),
                meta: { title: '舞种班别统计', keepAlive: true, permission: ['service:stat:dance'] }
              },
              {
                path: '/stat/service/serviceStuUserDayPersonal',
                name: 'serviceStuUserDayPersonal',
                component: () => import('@/views/stat/service/serviceStuUserDayPersonal'),
                meta: {
                  title: '(个人)每日资源统计',
                  keepAlive: true,
                  permission: ['service:stat:stuuser:day-personal']
                }
              },
              {
                path: '/stat/service/serviceStuUserChannelPersonal',
                name: 'serviceStuUserChannelPersonal',
                component: () => import('@/views/stat/service/serviceStuUserChannelPersonal'),
                meta: {
                  title: '(个人)渠道来源统计',
                  keepAlive: true,
                  permission: ['service:stat:stuuser:channel-personal']
                }
              },
              {
                path: '/stat/service/serviceStuUserSchoolPersonal',
                name: 'serviceStuUserSchoolPersonal',
                component: () => import('@/views/stat/service/serviceStuUserSchoolPersonal'),
                meta: {
                  title: '(个人)分馆资源月统计',
                  keepAlive: true,
                  permission: ['service:stat:stuuser:school-personal']
                }
              },
              {
                path: '/stat/service/serviceStuUserAchievement',
                name: 'serviceStuUserAchievement',
                component: () => import('@/views/stat/service/serviceStuUserAchievement'),
                meta: {
                  title: '推广组分析表',
                  keepAlive: true,
                  permission: ['service:stat:stuuser:stuUser_achievement']
                }
              },
              {
                path: '/stat/service/serviceChannelEdutype',
                name: 'serviceChannelEdutype',
                component: () => import('@/views/stat/service/serviceChannelEdutype'),
                meta: {
                  title: '渠道资源班型统计',
                  keepAlive: true,
                  permission: ['service:stat:stuuer:channelEdutype']
                }
              },
              {
                path: '/stat/service/stuUserDanceEduType',
                name: 'stuUserDanceEduType',
                component: () => import('@/views/stat/service/stuUserDanceEduType'),
                meta: {
                  title: '舞种资源班型报表',
                  keepAlive: true,
                  permission: ['service:stat:stuuer:danceEdutype']
                }
              },
              {
                path: '/stat/service/stuUserDeptEduType',
                name: 'stuUserDeptEduType',
                component: () => import('@/views/stat/service/stuUserDeptEduType'),
                meta: {
                  title: '分馆渠道资源班型统计',
                  keepAlive: true,
                  permission: ['service:stat:stuuer:deptEdutype']
                }
              },
              {
                path: '/stat/service/stuUserDeptEduTypeTotal',
                name: 'stuUserDeptEduTypeTotal',
                component: () => import('@/views/stat/service/stuUserDeptEduTypeTotal'),
                meta: {
                  title: '渠道资源班型汇总表',
                  keepAlive: true,
                  permission: ['service:stat:stuuer:EdutypeChannel']
                }
              }
            ]
          },
          {
            path: '/stat/school',
            name: 'reports-school',
            component: RouteView,
            meta: { title: '分馆统计', icon: 'caret-down', permission: ['school:stat'] },
            children: [
              {
                path: '/stat/school/schoolFinance',
                name: 'schoolFinance',
                component: () => import('@/views/stat/school/schoolFinance'),
                meta: { title: '分馆业绩统计', keepAlive: true, permission: ['school:stat:achievement'] }
              },
              {
                path: '/stat/school/schoolAchievementAdviser',
                name: 'schoolAchievementAdviser',
                component: () => import('@/views/stat/school/schoolAchievementAdviser'),
                meta: {
                  title: '顾问业绩统计',
                  keepAlive: true,
                  permission: ['school:stat:achievement-adviser']
                }
              },
              {
                path: '/stat/school/schoolAchievementService',
                name: 'schoolAchievementService',
                component: () => import('@/views/stat/school/schoolAchievementService'),
                meta: {
                  title: '客服业绩统计',
                  keepAlive: true,
                  permission: ['school:stat:achievement:service']
                }
              },
              {
                path: '/stat/school/schoolStuUser',
                name: 'schoolStuUser',
                component: () => import('@/views/stat/school/schoolStuUser'),
                meta: { title: '(总)分馆金额月统计', keepAlive: true, permission: ['school:stat:stuuser'] }
              },
              {
                path: '/stat/school/schoolSignAssistant',
                name: 'schoolSignAssistant',
                component: () => import('@/views/stat/school/schoolSignAssistant'),
                meta: { title: '助教签到统计', keepAlive: true, permission: ['school:stat:sign:assistant'] }
              },
              {
                path: '/stat/school/schoolSalaryTeachers',
                name: 'schoolSalaryTeachers',
                component: () => import('@/views/stat/school/schoolSalaryTeachers'),
                meta: { title: '导师课酬统计', keepAlive: true, permission: ['school:stat:salary:teacher'] }
              },
              {
                path: '/stat/school/schoolSignOrgUser',
                name: 'schoolSignOrgUser',
                component: () => import('@/views/stat/school/schoolSignOrgUser'),
                meta: { title: '员工签到统计', keepAlive: true, permission: ['school:stat:sign:orguser'] }
              },
              {
                path: '/stat/school/studentAuditionlogSchool',
                name: 'studentAuditionlogSchool',
                component: () => import('@/views/stat/school/studentAuditionlogSchool'),
                meta: { title: '试课统计(舞种)', keepAlive: true, permission: ['school:stat:audition:dance'] }
              },
              {
                path: '/stat/school/schoolAuditionClassStatistics',
                name: 'schoolAuditionClassStatistics',
                component: () => import('@/views/stat/school/schoolAuditionClassStatistics'),
                meta: { title: '分馆试课统计表(班级)', keepAlive: true, permission: ['school:stat:audition:class'] }
              },
              {
                path: '/stat/school/cardActivationStatistics',
                name: 'cardActivationStatistics',
                component: () => import('@/views/stat/school/cardActivationStatistics'),
                meta: { title: '结业卡激活统计', keepAlive: true, permission: ['school:stat:card:active'] }
              },
              {
                path: '/stat/school/monthStuuserSchool',
                name: 'monthStuuserSchool',
                component: () => import('@/views/stat/school/monthStuuserSchool'),
                meta: { title: '分馆资源月统计', keepAlive: true, permission: ['school:stat:month:school'] }
              },
              {
                path: '/stat/school/monthStuuserArea',
                name: 'monthStuuserArea',
                component: () => import('@/views/stat/school/monthStuuserArea'),
                meta: { title: '地区资源月统计', keepAlive: true, permission: ['school:stat:month:area'] }
              },
              {
                path: '/stat/school/monthStuuserDance',
                name: 'monthStuuserDance',
                component: () => import('@/views/stat/school/monthStuuserDance'),
                meta: { title: '舞种班别资源月统计', keepAlive: true, permission: ['school:stat:month:dance'] }
              },
              {
                path: '/stat/school/privateClassStatistics',
                name: 'privateClassStatistics',
                component: () => import('@/views/stat/school/privateClassStatistics/index'),
                meta: { title: '私教课耗统计', keepAlive: true, permission: ['school:stat:area:class'] }
              },
              {
                path: '/stat/school/privateClassStatisticsDetail',
                name: 'privateClassStatisticsDetail',
                component: () => import('@/views/stat/school/privateClassStatistics/details'),
                meta: { title: '详情', keepAlive: true, hidden: true, permission: ['school:stat:area:class'] }
              }
            ]
          },
          {
            path: '/stat/education',
            name: 'reports-education',
            component: RouteView,
            meta: { title: '教务统计', icon: 'caret-down', permission: ['edu:stat'] },
            children: [
              {
                path: '/stat/education/eduCoachClassRenewStat',
                name: 'eduCoachClassRenewStat',
                component: () => import('@/views/stat/education/eduCoachClassRenewStat'),
                meta: { title: '教练班续卡统计', keepAlive: true, permission: ['education:coachClassRenewal:view'] }
              },
              {
                path: '/stat/education/eduTeacherPrivateEducationStatistic',
                name: 'eduTeacherPrivateEducationStatistic',
                component: () => import('@/views/stat/education/eduTeacherPrivateEducationStatistic'),
                meta: { title: '各地私教教务统计表', keepAlive: true, permission: ['edu:stat:area:private'] }
              },
              {
                path: '/stat/education/eduTeacherPrivateEducationCardDetails/:type/:dance/:startDate/:endDate/:deptId',
                name: 'eduTeacherPrivateEducationCardDetails',
                component: () => import('@/views/stat/education/eduTeacherPrivateEducationCardDetails'),
                meta: {
                  title: '详情',
                  hidden: true,
                  keepAlive: true,
                  permission: ['edu:stat:area:private']
                }
              },
              {
                path: '/stat/education/eduClassPlan',
                name: 'eduClassPlan',
                component: () => import('@/views/stat/education/eduClassPlan'),
                meta: { title: '班级排课课时统计', keepAlive: true, permission: ['edu:stat:class:plan'] }
              },
              {
                path: '/stat/education/eduClassSignInfo',
                name: 'eduClassSignInfo',
                component: () => import('@/views/stat/education/eduClassSignInfo'),
                meta: { title: '班级签到统计', keepAlive: true, permission: ['edu:stat:class:signinfo'] }
              },
              {
                path: '/stat/education/eduClassAchievement',
                name: 'eduClassAchievement',
                component: () => import('@/views/stat/education/eduClassAchievement'),
                meta: { title: '班级绩效统计', keepAlive: true, permission: ['edu:stat:class:achievement'] }
              },
              {
                path: '/stat/education/eduStudentCardRefund',
                name: 'eduStudentCardRefund',
                component: () => import('@/views/stat/education/eduStudentCardRefund'),
                meta: { title: '学员退卡金额统计', keepAlive: true, permission: ['edu:stat:student:card:refund'] }
              },
              {
                path: '/stat/education/eduSalarySalTemplate',
                name: 'eduSalarySalTemplate',
                component: () => import('@/views/stat/education/eduSalarySalTemplate'),
                meta: { title: '导师薪酬库汇总', keepAlive: true, permission: ['edu:stat:salary:saltemplate'] }
              },
              {
                path: '/stat/education/eduSalaryTeachers',
                name: 'eduSalaryTeachers',
                component: () => import('@/views/stat/education/eduSalaryTeachers'),
                meta: { title: '导师工资汇总', keepAlive: true, permission: ['edu:stat:salary:teachers'] }
              },
              {
                path: '/stat/education/eduSalaryTeachersSchool',
                name: 'eduSalaryTeachersSchool',
                component: () => import('@/views/stat/education/eduSalaryTeachersSchool'),
                meta: { title: '分馆课酬统计', keepAlive: true, permission: ['edu:stat:salary:teachers'] }
              },
              {
                path: '/stat/education/eduTeacherSignStatistic',
                name: 'eduTeacherSignStatistic',
                component: () => import('@/views/stat/education/eduTeacherSignStatistic'),
                meta: { title: '导师签到统计', keepAlive: true, permission: ['edu:stat:teacher:sign'] }
              },
              {
                path: '/stat/education/eduTeacherNoSign',
                name: 'eduTeacherNoSign',
                component: () => import('@/views/stat/education/eduTeacherNoSign'),
                meta: { title: '导师未签到统计', keepAlive: true, permission: ['edu:stat:teacher:nosign'] }
              },
              {
                path: '/stat/education/eduTeacherDemand',
                name: 'eduTeacherDemand',
                component: () => import('@/views/stat/education/eduTeacherDemand'),
                meta: { title: '导师招聘统计', keepAlive: true, permission: ['edu:stat:teacher:demand'] }
              },
              {
                path: '/stat/education/eduClassUrl',
                name: 'eduClassUrl',
                component: () => import('@/views/stat/education/eduClassUrl'),
                meta: { title: '上课码统计', keepAlive: true, permission: ['edu:stat:class:url'] }
              }
            ]
          },
          {
            path: '/stat/newmedia',
            name: 'reports-media',
            component: RouteView,
            meta: { title: '新媒体统计', icon: 'caret-down', permission: ['media'] },
            children: [
              {
                path: '/stat/newmedia/mediaAchievement',
                name: 'mediaAchievement',
                component: () => import('@/views/stat/newmedia/mediaAchievement'),
                meta: { title: '新媒体业绩统计', keepAlive: true, permission: ['media:stat:achievement'] }
              },
              {
                path: '/stat/newmedia/newMediaResources',
                name: 'newMediaResources',
                component: () => import('@/views/stat/newmedia/newMediaResources'),
                meta: { title: '每日资源统计(新媒体)', keepAlive: true, permission: ['media:stat:resources'] }
              }
            ]
          },
          {
            path: '/stat/financialStatistics',
            name: 'reports-financialStatistics',
            component: RouteView,
            meta: { title: '财政统计', icon: 'caret-down', permission: ['stat:financial'] },
            children: [
              {
                path: '/stat/financialStatistics/businussCate/businussCate',
                name: 'businussCate',
                component: () => import('@/views/stat/financialStatistics/businussCate/businussCate'),
                meta: {
                  title: '经营归类分摊表',
                  keepAlive: true,
                  permission: ['stat:financial:capital_view']
                }
              },
              {
                path: '/stat/financialStatistics/businussCate/businussCateDetail/:type/:level/:startDate/:endDate',
                name: 'businussCateDetail',
                component: () => import('@/views/stat/financialStatistics/businussCate/details'),
                meta: {
                  title: '详情',
                  hidden: true,
                  keepAlive: true,
                  permission: ['stat:financial:capital_view']
                }
              },
              {
                path: '/stat/financialStatistics/dailyStatementOfCapital/dailyStatementOfCapital',
                name: 'dailyStatementOfCapital',
                component: () => import('@/views/stat/financialStatistics/dailyStatementOfCapital/dailyStatementOfCapital'),
                meta: {
                  title: '经营归类流水表',
                  keepAlive: true,
                  permission: ['stat:financial:capital_flow_view']
                }
              },
              {
                path: '/stat/financialStatistics/dailyStatementOfCapital/dailyStatementOfCapitalDetail/:type/:level/:startDate/:endDate',
                name: 'dailyStatementOfCapitalDetail',
                component: () => import('@/views/stat/financialStatistics/dailyStatementOfCapital/details'),
                meta: {
                  title: '详情',
                  hidden: true,
                  keepAlive: true,
                  permission: ['stat:financial:capital_flow_view']
                }
              },
              {
                path: '/stat/financialStatistics/financeExpenseFlowStatisticsSplit/financeExpenseFlowStatisticsSplit',
                name: 'financeExpenseFlowStatisticsSplit',
                component: () => import('@/views/stat/financialStatistics/financeExpenseFlowStatisticsSplit/financeExpenseFlowStatisticsSplit'),
                meta: {
                  title: '财务归类分摊表',
                  keepAlive: true,
                  permission: ['stat:financial:fin_capital_view']
                }
              },
              {
                path: '/stat/financialStatistics/financeExpenseFlowStatistics/financeExpenseFlowStatisticsSplitDetail/:type/:level/:startDate/:endDate',
                name: 'financeExpenseFlowStatisticsSplitDetail',
                component: () => import('@/views/stat/financialStatistics/financeExpenseFlowStatisticsSplit/details'),
                meta: {
                  title: '详情',
                  hidden: true,
                  keepAlive: true,
                  permission: ['stat:financial:fin_capital_view']
                }
              },
              {
                path: '/stat/financialStatistics/financeExpenseFlowStatistics/financeExpenseFlowStatistics',
                name: 'financeExpenseFlowStatistics',
                component: () => import('@/views/stat/financialStatistics/financeExpenseFlowStatistics/financeExpenseFlowStatistics'),
                meta: {
                  title: '财务归类流水表',
                  keepAlive: true,
                  permission: ['stat:financial:fin_capital_flow_view']
                }
              },
              {
                path: '/stat/financialStatistics/financeExpenseFlowStatistics/financeExpenseFlowStatisticsDetail/:type/:level/:startDate/:endDate',
                name: 'financeExpenseFlowStatisticsDetail',
                component: () => import('@/views/stat/financialStatistics/financeExpenseFlowStatistics/details'),
                meta: {
                  title: '详情',
                  hidden: true,
                  keepAlive: true,
                  permission: ['stat:financial:fin_capital_flow_view']
                }
              },
              {
                path: '/stat/financialStatistics/costExpenseFlowStatisticsSplit/costExpenseFlowStatisticsSplit',
                name: 'costExpenseSplitStatistics',
                component: () => import('@/views/stat/financialStatistics/costExpenseFlowStatisticsSplit/costExpenseFlowStatisticsSplit'),
                meta: {
                  title: '成本归类分摊表',
                  keepAlive: true,
                  permission: ['stat:financial:cost_capital_view']
                }
              },
              {
                path: '/stat/financialStatistics/costExpenseFlowStatisticsSplit/costExpenseFlowStatisticsSplitDetail/:type/:level/:startDate/:endDate',
                name: 'costExpenseFlowStatisticsSplitDetail',
                component: () => import('@/views/stat/financialStatistics/costExpenseFlowStatisticsSplit/details'),
                meta: {
                  title: '详情',
                  hidden: true,
                  keepAlive: true,
                  permission: ['stat:financial:cost_capital_view']
                }
              },
              {
                path: '/stat/financialStatistics/costExpenseFlowStatistics/costExpenseFlowStatistics',
                name: 'costExpenseFlowStatistics',
                component: () => import('@/views/stat/financialStatistics/costExpenseFlowStatistics/costExpenseFlowStatistics'),
                meta: {
                  title: '成本归类流水表',
                  keepAlive: true,
                  permission: ['stat:financial:cost_capital_flow_view']
                }
              },
              {
                path: '/stat/financialStatistics/costExpenseFlowStatistics/costExpenseFlowStatisticsDetail/:type/:level/:startDate/:endDate',
                name: 'costExpenseFlowStatisticsDetail',
                component: () => import('@/views/stat/financialStatistics/costExpenseFlowStatistics/details'),
                meta: {
                  title: '详情',
                  hidden: true,
                  keepAlive: true,
                  permission: ['stat:financial:cost_capital_flow_view']
                }
              }
              // {
              //   path: '/stat/financialStatistics/cashJournal/cashJournal',
              //   name: 'cashJournal',
              //   component: () => import('@/views/stat/financialStatistics/cashJournal/cashJournal'),
              //   meta: { title: '经营费用流水统计表', keepAlive: true, permission: ['finance:operating-expense-flow:view'] }
              // },
              // {
              //   path: '/stat/financialStatistics/cashJournal/cashJournalDetail/:type/:startDate/:endDate',
              //   name: 'cashJournalDetail',
              //   component: () => import('@/views/stat/financialStatistics/cashJournal/details'),
              //   meta: { title: '详情', hidden: true, keepAlive: true, permission: ['finance:operating-expense-flow:view'] }
              // },
              // {
              //   path: '/stat/financialStatistics/financeIncome/financeIncome',
              //   name: 'financeIncomeTable',
              //   component: () => import('@/views/stat/financialStatistics/financeIncome/financeIncome'),
              //   meta: { title: '财务收支统计表', keepAlive: true, permission: ['finance:financial-expense-flow:view'] }
              // },
              // {
              //   path: '/stat/financialStatistics/financeIncome/financeIncomeDetail/:type/:startDate/:endDate',
              //   name: 'financeIncomeDetail',
              //   component: () => import('@/views/stat/financialStatistics/financeIncome/details'),
              //   meta: { title: '详情', hidden: true, keepAlive: true, permission: ['finance:financial-expense-flow:view'] }
              // },
              // {
              //   path: '/stat/financialStatistics/deptFeePre/deptFeePre',
              //   name: 'deptFeePre',
              //   component: () => import('@/views/stat/financialStatistics/deptFeePre/deptFeePre'),
              //   meta: { title: '部门费用统计表调整前', keepAlive: true, permission: ['finance:dept-expense-flow:view'] }
              // },
              // {
              //   path: '/stat/financialStatistics/deptFeePre/deptFeePreDetail/:type/:startDate/:endDate',
              //   name: 'deptFeePreDetail',
              //   component: () => import('@/views/stat/financialStatistics/deptFeePre/details'),
              //   meta: { title: '详情', hidden: true, keepAlive: true, permission: ['finance:dept-expense-flow:view'] }
              // }
              // {
              //   path: '/stat/financialStatistics/apportionPre',
              //   name: 'apportionPre',
              //   component: () => import('@/views/stat/financialStatistics/apportionPre'),
              //   meta: { title: '费用流水分摊前', keepAlive: true, permission: ['financialStatistics:stat:apportionPre'] }
              // },
              // {
              //   path: '/stat/financialStatistics/apportionNext',
              //   name: 'apportionNext',
              //   component: () => import('@/views/stat/financialStatistics/apportionNext'),
              //   meta: { title: '费用流水分摊后', keepAlive: true, permission: ['financialStatistics:stat:apportionNext'] }
              // }
            ]
          },
          {
            path: '/stat/businessSummary',
            name: 'reports-businessSummary',
            component: RouteView,
            meta: { title: '业务汇总统计', icon: 'caret-down', permission: ['student:stat'] },
            children: [
              {
                path: '/stat/businessSummary/studentStatistic/studentStatistic',
                name: 'studentStatistic',
                component: () => import('@/views/stat/businessSummary/studentStatistic/studentStatistic'),
                meta: {
                  title: '学员统计',
                  keepAlive: true,
                  permission: ['student:stat:collect']
                }
              },
              {
                path: '/stat/businessSummary/studentStatistic/studentStatisticDetail',
                name: 'studentStatisticDetail',
                component: () => import('@/views/stat/businessSummary/studentStatistic/details'),
                meta: {
                  title: '详情',
                  hidden: true,
                  keepAlive: true,
                  permission: ['student:stat:collect']
                }
              },
              {
                path: '/stat/businessSummary/cardStatistic/cardStatistic',
                name: 'cardStatistic',
                component: () => import('@/views/stat/businessSummary/cardStatistic/cardStatistic'),
                meta: {
                  title: '卡种统计',
                  keepAlive: true,
                  permission: ['student:stat:card_collect']
                }
              },
              {
                path: '/stat/businessSummary/cardStatistic/cardStatisticDetail',
                name: 'cardStatisticDetail',
                component: () => import('@/views/stat/businessSummary/cardStatistic/details'),
                meta: {
                  title: '详情',
                  hidden: true,
                  keepAlive: true,
                  permission: ['student:stat:card_collect']
                }
              },
              {
                path: '/stat/businessSummary/incomeStatistic/incomeStatistic',
                name: 'incomeStatistic',
                component: () => import('@/views/stat/businessSummary/incomeStatistic/incomeStatistic'),
                meta: {
                  title: '收入统计',
                  keepAlive: true,
                  permission: ['student:stat:stuincome']
                }
              },
              {
                path: '/stat/businessSummary/incomeStatistic/incomeStatisticDetail',
                name: 'incomeStatisticDetail',
                component: () => import('@/views/stat/businessSummary/incomeStatistic/details'),
                meta: {
                  title: '详情',
                  hidden: true,
                  keepAlive: true,
                  permission: ['student:stat:stuincome']
                }
              },
              {
                path: '/stat/businessSummary/refundStatistic/refundStatistic',
                name: 'refundStatistic',
                component: () => import('@/views/stat/businessSummary/refundStatistic/refundStatistic'),
                meta: {
                  title: '退费统计',
                  keepAlive: true,
                  permission: ['student:stat:refund']
                }
              },
              {
                path: '/stat/businessSummary/refundStatistic/refundStatisticDetail',
                name: 'refundStatisticDetail',
                component: () => import('@/views/stat/businessSummary/refundStatistic/details'),
                meta: {
                  title: '详情',
                  hidden: true,
                  keepAlive: true,
                  permission: ['student:stat:refund']
                }
              },
              {
                path: '/stat/businessSummary/achievementReport/achievementReport',
                name: 'achievementReport',
                component: () => import('@/views/stat/businessSummary/achievementReport/achievementReport'),
                meta: {
                  title: '业绩统计',
                  keepAlive: true,
                  permission: ['student:stat:achievement']
                }
              },
              {
                path: '/stat/businessSummary/achievementReport/achievementReportDetail',
                name: 'achievementReportDetail',
                component: () => import('@/views/stat/businessSummary/achievementReport/details'),
                meta: {
                  title: '详情',
                  hidden: true,
                  keepAlive: true,
                  permission: ['student:stat:achievement']
                }
              }
            ]
          }
        ]
      },
      //system
      {
        path: '/system',
        name: 'system',
        component: RouteView,
        meta: { title: '系统', icon: 'setting', permission: ['system', 'test', 'organize'] },
        children: [
          {
            path: '/organize/deptManage',
            name: 'deptManage',
            component: RouteView,
            meta: { title: '组织架构管理', icon: 'caret-down', keepAlive: true },
            children: [
              {
                path: '/organize/dept',
                name: 'dept',
                component: () => import('@/views/organize/dept'),
                meta: { title: '组织管理', keepAlive: true, permission: ['organize:dept'] }
              },
              {
                path: '/organize/user',
                name: 'user',
                component: () => import('@/views/organize/user'),
                meta: { title: '员工管理', keepAlive: true, permission: ['organize:user'] }
              },
              {
                path: '/organize/position',
                name: 'position',
                component: () => import('@/views/organize/position'),
                meta: { title: '职位管理', keepAlive: true, permission: ['organize:position'] }
              },
              {
                path: '/organize/menu',
                name: 'menu',
                component: () => import('@/views/organize/menu'),
                meta: { title: '权限管理', keepAlive: true, permission: ['organize:menu'] }
              },
              {
                path: '/organize/role',
                name: 'role',
                component: () => import('@/views/organize/role'),
                meta: { title: '角色管理', keepAlive: true, permission: ['organize:role'] }
              }
            ]
          },
          {
            path: '/system/systemManage',
            name: 'systemManage',
            meta: { title: '系统管理', icon: 'caret-down', permission: ['system', 'test'] },
            component: { render: h => h('router-view') },
            children: [
              {
                path: '/system/loginLog',
                name: 'loginLog',
                component: () => import('@/views/system/loginLog'),
                meta: { title: '登录日志管理', keepAlive: true, permission: ['system:loginLog'] }
              },
              {
                path: '/system/testPage',
                name: 'testPage',
                component: () => import('@/views/system/testPage'),
                meta: { title: '系统配置', keepAlive: true, permission: ['test:test:test'] }
              },
              {
                path: '/system/valConfig',
                name: 'valConfig ',
                component: () => import('@/views/system/valConfig'),
                meta: { title: '系统变量', keepAlive: true, permission: ['sys:valconf:view'] }
              }
            ]
          },
          {
            path: '/system/workFlow',
            name: 'workFlow',
            meta: { title: '工作流管理', icon: 'caret-down', permission: ['workflow'] },
            component: { render: h => h('router-view') },
            children: [
              {
                path: '/system/workFlow/workFlowStep',
                name: 'workFlowStep',
                component: () => import('@/views/system/workFlowStep'),
                meta: { title: '工作流定义', keepAlive: false, permission: ['workflow:info'] }
              },
              {
                path: '/system/workFlow/workFlowRole',
                name: 'workFlowRole',
                component: () => import('@/views/system/workFlowRole'),
                meta: { title: '审批角色管理', keepAlive: false, permission: ['workflow:owner'] }
              }
            ]
          }
        ]
      },
      {
        path: '/dataBoard',
        name: 'dataBoard',
        component: RouteView,
        meta: { title: '数据', icon: 'area-chart', permission: ['databoard'] },
        children: [
          {
            path: '/reception/Refund',
            name: 'Refund',
            component: RouteView,
            redirect: '/dataBoard/finRefund',
            meta: { title: '数据看板', keepAlive: true, icon: 'caret-down', permission: ['databoard'] },
            hideChildrenInMenu: true,
            children: [
              {
                path: '/dataBoard/finRefund',
                name: 'dataBoardFinRefund',
                component: () => import('@/views/dataBoard/finRefund'),
                meta: {
                  title: '事件分析',
                  keepAlive: false,
                  permission: ['databoard:base']
                }
              },
              {
                path: '/dataBoard/operationData',
                name: 'operationData',
                component: () => import('@/views/dataBoard/operationData'),
                meta: { title: '运营部数据看板', keepAlive: true, permission: ['databoard:operation'] }
              }
            ]
          },
          {
            path: '/dataBoard/businessChannel',
            name: 'dataBoardBusinessChannel',
            meta: { title: '网络部数据看板', icon: 'caret-down', permission: ['databoard:network'] },
            component: { render: h => h('router-view') },
            children: [
              {
                path: '/dataBoard/businessChannel',
                name: 'businessChannel',
                component: () => import('@/views/dataBoard/businessChannel'),
                meta: { title: '基础数据看板', keepAlive: true, permission: ['databoard:draining_resources:view'] }
              },
              {
                path: '/dataBoard/businessTarget',
                name: 'businessTarget',
                component: () => import('@/views/dataBoard/businessTarget'),
                meta: { title: '目标数据看板', keepAlive: true, permission: ['databoard:network'] }
              },
              {
                path: '/dataBoard/resourcesEnroll',
                name: 'resourcesEnroll',
                component: () => import('@/views/dataBoard/resourcesEnroll'),
                meta: { title: '渠道资源报名转化周期表', keepAlive: true, permission: ['databoard:networkacce:enrollreport'] }
              },
              {
                path: '/dataBoard/channelDepositConversion',
                name: 'channelDepositConversion',
                component: () => import('@/views/dataBoard/channelDepositConversion'),
                meta: { title: '渠道定金转化周期表', keepAlive: true, permission: ['databoard:networkacce:depositreport'] }
              },
            ]
          }
        ]
      }
    ]
  },
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

export const constantRouterMap = [
  {
    path: '/user',
    component: UserLayout,
    redirect: '/user/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Login')
      },
      {
        path: 'forgetPsw',
        name: 'forgetPsw',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/ForgetPsw')
      },
      {
        path: 'certficateApply/:id/:deptId',
        name: 'certficateApply',
        component: () => import(/* webpackChunkName: "user" */ '@/views/certificate/certficateApply')
      },
      {
        path: 'studentRecordApply/:id',
        name: 'studentRecordApply',
        component: () => import(/* webpackChunkName: "user" */ '@/views/reception/studentRecordApply')
      },
      {
        path: 'studentRecordApplyResult',
        name: 'studentRecordApplyResult',
        component: () => import(/* webpackChunkName: "user" */ '@/views/reception/studentRecordApplyResult')
      }
    ]
  },
  {
    path: '/user',
    component: BasicLayout,
    redirect: '/user/center',
    children: [
      {
        path: '/user/info',
        name: 'userInfo',
        component: () => import('@/views/user/userInfo'),
        meta: { title: '用户信息', keepAlive: true }
      }
    ]
  },
  {
    path: '/class',
    component: BasicLayout,
    children: [
      {
        path: '/class/phoock',
        name: 'phoock',
        component: () => import('@/views/test/test.vue'),
        meta: { title: '测试专用', keepAlive: true }
      }
    ]
  },
  {
    path: '/test',
    component: BasicLayout,
    children: [
      {
        path: '/test/css',
        name: 'css',
        component: () => import('@/views/test/css.vue'),
        meta: { title: 'css', keepAlive: true }
      }
    ]
  },
  {
    path: '/404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404')
  },
  {
    path: '/dataBoard/tableDetail/:id/:loadTableData/:sceneData/:dimensionValue/:startDate/:endDate/:dimension/:indicator/:module/:perm',
    //  path: '/dataBoard/tableDetail/:data',
    //  name: 'tableDetail',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/dataBoard/tableDetail')
    //  meta: { title: '表格明细', keepAlive: true, permission: ['student:info:period'], hidden: false }
  }
]

/**
 * 动态路由
 * @type { *[] }
 */

const constantRouterComponents = {
  // 基础页面 layout 必须引入
  BasicLayout: BasicLayout,
  BlankLayout: BlankLayout,
  RouteView: RouteView,
  PageView: PageView
}

const notFoundRouter = {
  path: '*',
  redirect: '/404',
  hidden: true
}

const basicRouter = [
  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: { title: '首页' },
    children: [
      //homepage
      {
        path: '/',
        name: 'homepage',
        component: RouteView,
        meta: { title: '首页', icon: 'dashboard' },
        redirect: '/',
        hideChildrenInMenu: true,
        children: [
          {
            path: '/',
            name: 'home',
            component: () => import('@/views/HomePage'),
            meta: { title: '首页', keepAlive: true, hidden: true }
          },
          {
            path: '/user/center',
            name: 'center',
            component: () => import('@/views/user/userCenter'),
            meta: { title: '个人中心', keepAlive: true, hidden: true }
          }
        ]
      }
    ]
  }
]
export const generatorDynamicRouter = () => {
  return new Promise((resolve, reject) => {
    // getMenu().then(res => {
    //   const result = res.data
    //   const routers = generator(result)
    //   // console.log('generator', routers)
    //   routers.push(notFoundRouter)
    //   routers.forEach(item => {
    //     basicRouter[0].children.push(item)
    //   })
    //   // console.log(basicRouter)
    //   resolve(basicRouter)
    // }).catch(err => {
    //   reject(err)
    // })
    //
    // const routers = rewriteRouter(menu)
    // console.log('generator', routers)
  })
}

// export const rewriteRouter = (routerMap, parent) => {
//   if (!routerMap || routerMap.length == 0) {
//     return []
//   }
//
//   return routerMap.map((item, idx) => {
//     let components, hideChildrenInMenu = false
//     const currentRouter = {
//       path: item.path,
//       name: idx,
//       meta: { title: item.name, keepAlive: true, icon: item.icon || 'setting', permission: [item.perm] }
//     }
//   })
//
//
// }

export const generator = (routerMap, parent) => {
  // console.log(routerMap)
  if (routerMap == null) {
    return []
  }
  return routerMap.map(item => {
    let components,
      hideChildrenInMenu = false
    const currentRouter = {
      path: item.path,
      name: item.id,
      meta: { title: item.menuName, keepAlive: true, icon: item.icon || 'setting', permission: [item.perm] }
    }
    if (item.menuType == 'A') {
      components = RouteView
    } else if (item.menuType == 'B' && item.children && item.children.length > 0) {
      components = RouteView
      hideChildrenInMenu = true
      currentRouter.path = `${item.path}Management`
      currentRouter.redirect = item.path
    } else if (item.menuType == 'D') {
      currentRouter.meta.hidden = true
      const idx = item.path.indexOf(':')
      let str = item.path
      idx > 0 ? (str = item.path.substring(0, idx - 1)) : ''
      // components = () => import(`@/views${str}`)
      components = resolve => require([`@/views${str}`], resolve)
    } else {
      // components = () => import(`@/views${item.path}`)
      components = resolve => require([`@/views${item.path}`], resolve)
    }
    currentRouter.component = components
    currentRouter.hideChildrenInMenu = hideChildrenInMenu
    if (item.children && item.children.length > 0) {
      currentRouter.children = generator(item.children, currentRouter)
    }
    return currentRouter
  })
}
