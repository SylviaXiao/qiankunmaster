<template>
  <div style="font-size:16px;display:none; ">
    <a-button ref="printBtn" type="primary" v-print="'#printTest'"> 打印 </a-button>
    <div>
      <div ref="printTest" class="block workFlowTable" style="color:#000;font-weight:700;width: 548.1pt;margin: 0 auto;background-color: #fff;" id="printTest">
        <div>
          <table cellspacing="0" cellpadding="0" style="border-collapse: collapse; float: left; margin: 5pt 9pt 0">
            <tr style="height: 23.4pt">
              <td
                colspan="14"
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              padding-left: 0.75pt;
              padding-right: 0.75pt;
              vertical-align: middle;
              width: 528.8pt;
            "
              >
                <p
                  style="
                line-height: 16pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span
                    style="
                  font-family: 微软雅黑;
                  font-size: 16pt;
                  font-weight: bold;
                "
                    >国际标准舞</span
                  ><span
                    style="
                  color: #ff0000;
                  font-family: 微软雅黑;
                  font-size: 16pt;
                  font-weight: bold;
                "
                    >全国社会艺术水平考级</span
                  ><span
                    style="
                  font-family: 微软雅黑;
                  font-size: 16pt;
                  font-weight: bold;
                "
                    >报名及</span
                  ><span
                    style="
                  font-family: 微软雅黑;
                  font-size: 16pt;
                  font-weight: bold;
                "
                    >评分表</span
                  >
                </p>
              </td>
            </tr>
            <tr style="height: 20.25pt">
              <td
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: bottom;
              width: 65.95pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt; font-weight: bold">编号</span>
                </p>
              </td>
              <td
                colspan="4"
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: bottom;
              width: 150.75pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt; font-weight: bold">&#xa0;</span>
                </p>
              </td>
              <td
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: bottom;
              width: 50.85pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span
                    style="
                                   background-color: #ffff00;

                  font-family: 宋体;
                  font-size: 11pt;
                  font-weight: bold;
                "
                    >姓名</span
                  >
                </p>
              </td>
              <td
                colspan="4"
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: bottom;
              width: 72pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt; font-weight: bold">{{ printRecord.cerName }}</span>
                </p>
              </td>
              <td
                colspan="2"
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: bottom;
              width: 35.25pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span
                    style="
                                   background-color: #ffff00;

                  font-family: 宋体;
                  font-size: 11pt;
                  font-weight: bold;
                "
                    >性别</span
                  >
                </p>
              </td>
              <td
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: bottom;
              width: 35.25pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt; font-weight: bold">{{ printRecord.cerSex == 'A' ? '男' : '女' }}</span>
                </p>
              </td>
              <td
                rowspan="6"
                style="
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: middle;
              width: 123.75pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span
                    style="
                                   background-color: #ffff00;

                  font-family: 宋体;
                  font-size: 11pt;
                "
                    >照片</span
                  >
                </p>
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span
                    style="
                                   background-color: #ffff00;

                  font-family: 宋体;
                  font-size: 11pt;
                "
                    >①</span
                  ><span
                    style="
                                   background-color: #ffff00;

                  font-family: 宋体;
                  font-size: 11pt;
                "
                  >
                  </span
                  ><span
                    style="
                                   background-color: #ffff00;

                  font-family: 宋体;
                  font-size: 11pt;
                "
                    >第一次考级的需要贴，之前考过考级中心存过档的不用照片；</span
                  >
                </p>
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span
                    style="
                                   background-color: #ffff00;

                  font-family: 宋体;
                  font-size: 11pt;
                "
                    >②</span
                  ><span
                    style="
                                   background-color: #ffff00;

                  font-family: 宋体;
                  font-size: 11pt;
                "
                  >
                    只要参加考级的都</span
                  ><span
                    style="
                                   background-color: #ffff00;

                  font-family: 宋体;
                  font-size: 11pt;
                "
                    >需要蓝底电子档照片</span
                  >
                </p>
              </td>
            </tr>
            <tr style="height: 18pt">
              <td
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: bottom;
              width: 65.95pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span
                    style="
                                   background-color: #ffff00;

                  font-family: 宋体;
                  font-size: 11pt;
                  font-weight: bold;
                "
                    >出生日期</span
                  >
                </p>
              </td>
              <td
                colspan="4"
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: bottom;
              width: 150.75pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span
                    style="
                                   background-color: #ffff00;

                  font-family: 宋体;
                  font-size: 11pt;
                  font-weight: bold;
                "
                    >{{ printRecord.birthdayArr[0] }}年 </span
                  ><span
                    style="
                                   background-color: #ffff00;

                  font-family: 宋体;
                  font-size: 11pt;
                  font-weight: bold;
                "
                  >
                  </span
                  ><span
                    style="
                                   background-color: #ffff00;

                  font-family: 宋体;
                  font-size: 11pt;
                  font-weight: bold;
                "
                  >
                  </span
                  ><span
                    style="
                                   background-color: #ffff00;

                  font-family: 宋体;
                  font-size: 11pt;
                  font-weight: bold;
                "
                    >{{ printRecord.birthdayArr[1] }}月</span
                  ><span
                    style="
                                   background-color: #ffff00;

                  font-family: 宋体;
                  font-size: 11pt;
                  font-weight: bold;
                "
                  >
                  </span
                  ><span
                    style="
                                   background-color: #ffff00;

                  font-family: 宋体;
                  font-size: 11pt;
                  font-weight: bold;
                "
                  >
                    {{ printRecord.birthdayArr[2] }}日</span
                  >
                </p>
              </td>
              <td
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: bottom;
              width: 50.85pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span
                    style="
                                   background-color: #ffff00;

                  font-family: 宋体;
                  font-size: 11pt;
                  font-weight: bold;
                "
                    >拼音</span
                  >
                </p>
              </td>
              <td
                colspan="7"
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: bottom;
              width: 145.5pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt; font-weight: bold">{{ printRecord.pinYing }}</span>
                </p>
              </td>
            </tr>
            <tr style="height: 18pt">
              <td
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: bottom;
              width: 65.95pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span
                    style="
                                   background-color: #ffff00;

                  font-family: 宋体;
                  font-size: 11pt;
                  font-weight: bold;
                "
                    >身份证号码</span
                  >
                </p>
              </td>
              <td
                colspan="12"
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: bottom;
              width: 343.1pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt; font-weight: bold">{{ printRecord.cerIdCard }}</span>
                </p>
              </td>
            </tr>
            <tr style="height: 20.5pt">
              <td
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: bottom;
              width: 65.95pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span
                    style="
                                   background-color: #ffff00;

                  font-family: 宋体;
                  font-size: 11pt;
                  font-weight: bold;
                "
                    >培训机构</span
                  >
                </p>
              </td>
              <td
                colspan="4"
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: bottom;
              width: 150.75pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span
                    style="
                                   background-color: #ffff00;

                  font-family: 宋体;
                  font-size: 11pt;
                  font-weight: bold;
                "
                    >{{ printRecord.deptName }}</span
                  >
                </p>
              </td>
              <td
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: bottom;
              width: 50.85pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span
                    style="
                                   background-color: #ffff00;

                  font-family: 宋体;
                  font-size: 11pt;
                  font-weight: bold;
                "
                    >民族</span
                  >
                </p>
              </td>
              <td
                colspan="7"
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: bottom;
              width: 145.5pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt; font-weight: bold">{{ printRecord.cerEthnic }}</span>
                </p>
              </td>
            </tr>
            <tr style="height: 20.5pt">
              <td
                rowspan="2"
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: middle;
              width: 65.95pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt; font-weight: bold">通讯地址</span>
                </p>
              </td>
              <td
                colspan="4"
                rowspan="2"
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: top;
              width: 150.75pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: justify;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt; font-weight: bold">&#xa0;</span>
                </p>
              </td>
              <td
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: bottom;
              width: 50.85pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span
                    style="
                                   background-color: #ffff00;

                  font-family: 宋体;
                  font-size: 11pt;
                  font-weight: bold;
                "
                    >手机</span
                  >
                </p>
              </td>
              <td
                colspan="7"
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: bottom;
              width: 145.5pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt; font-weight: bold">{{ printRecord.cerPhone }}</span>
                </p>
              </td>
            </tr>
            <tr style="height: 20.8pt">
              <td
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: bottom;
              width: 50.85pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt; font-weight: bold">邮箱</span
                  ><span style="font-family: 宋体; font-size: 11pt; font-weight: bold">/QQ</span>
                </p>
              </td>
              <td
                colspan="7"
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: bottom;
              width: 145.5pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt; font-weight: bold">&#xa0;</span>
                </p>
              </td>
            </tr>
            <tr style="height: 14.25pt">
              <td
                colspan="2"
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: middle;
              width: 111pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 黑体; font-size: 11pt; font-weight: bold">舞蹈类别</span>
                </p>
              </td>
              <td
                colspan="12"
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: bottom;
              width: 416.3pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 黑体; font-size: 11pt; font-weight: bold">考级的级别</span
                  ><span style="font-family: 黑体; font-size: 11pt">（请在相对应的数字上打圈）</span>
                </p>
              </td>
            </tr>
            <tr style="height: 19.25pt">
              <td
                colspan="2"
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: middle;
              width: 111pt;
            "
              >
                <p
                  style="
                line-height: 19.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 楷体; font-size: 11pt; font-weight: bold">拉丁舞</span>
                </p>
              </td>
              <td
                colspan="12"
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: middle;
              width: 416.3pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt; font-weight: bold">1；</span
                  ><span style="font-family: 宋体; font-size: 11pt; font-weight: bold"> </span
                  ><span style="font-family: 宋体; font-size: 11pt; font-weight: bold">2；</span
                  ><span style="font-family: 宋体; font-size: 11pt; font-weight: bold"> </span
                  ><span style="font-family: 宋体; font-size: 11pt; font-weight: bold">3；</span
                  ><span style="font-family: 宋体; font-size: 11pt; font-weight: bold"> </span
                  ><span style="font-family: 宋体; font-size: 11pt; font-weight: bold">4；</span
                  ><span style="font-family: 宋体; font-size: 11pt; font-weight: bold"> </span
                  ><span style="font-family: 宋体; font-size: 11pt; font-weight: bold">5；</span
                  ><span style="font-family: 宋体; font-size: 11pt; font-weight: bold"> </span
                  ><span style="font-family: 宋体; font-size: 11pt; font-weight: bold">6；</span
                  ><span style="font-family: 宋体; font-size: 11pt; font-weight: bold"> </span
                  ><span style="font-family: 宋体; font-size: 11pt; font-weight: bold">7；</span
                  ><span style="font-family: 宋体; font-size: 11pt; font-weight: bold"> </span
                  ><span style="font-family: 宋体; font-size: 11pt; font-weight: bold">8；</span
                  ><span style="font-family: 宋体; font-size: 11pt; font-weight: bold"> </span
                  ><span style="font-family: 宋体; font-size: 11pt; font-weight: bold">9；</span
                  ><span style="font-family: 宋体; font-size: 11pt; font-weight: bold"> </span
                  ><span style="font-family: 宋体; font-size: 11pt; font-weight: bold">10；</span
                  ><span style="font-family: 宋体; font-size: 11pt; font-weight: bold"> </span
                  ><span style="font-family: 宋体; font-size: 11pt; font-weight: bold">11；</span
                  ><span style="font-family: 宋体; font-size: 11pt; font-weight: bold"> </span
                  ><span style="font-family: 宋体; font-size: 11pt; font-weight: bold">12（表演文凭级）</span>
                </p>
              </td>
            </tr>
            <tr style="height: 18.85pt">
              <td
                colspan="2"
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: middle;
              width: 111pt;
            "
              >
                <p
                  style="
                line-height: 18.85pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 楷体; font-size: 11pt; font-weight: bold">标准舞</span>
                </p>
              </td>
              <td
                colspan="12"
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: middle;
              width: 416.3pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt; font-weight: bold">1；</span
                  ><span style="font-family: 宋体; font-size: 11pt; font-weight: bold"> </span
                  ><span style="font-family: 宋体; font-size: 11pt; font-weight: bold">2；</span
                  ><span style="font-family: 宋体; font-size: 11pt; font-weight: bold"> </span
                  ><span style="font-family: 宋体; font-size: 11pt; font-weight: bold">3；</span
                  ><span style="font-family: 宋体; font-size: 11pt; font-weight: bold"> </span
                  ><span style="font-family: 宋体; font-size: 11pt; font-weight: bold">4；</span
                  ><span style="font-family: 宋体; font-size: 11pt; font-weight: bold"> </span
                  ><span style="font-family: 宋体; font-size: 11pt; font-weight: bold">5；</span
                  ><span style="font-family: 宋体; font-size: 11pt; font-weight: bold"> </span
                  ><span style="font-family: 宋体; font-size: 11pt; font-weight: bold">6；</span
                  ><span style="font-family: 宋体; font-size: 11pt; font-weight: bold"> </span
                  ><span style="font-family: 宋体; font-size: 11pt; font-weight: bold">7；</span
                  ><span style="font-family: 宋体; font-size: 11pt; font-weight: bold"> </span
                  ><span style="font-family: 宋体; font-size: 11pt; font-weight: bold">8；</span
                  ><span style="font-family: 宋体; font-size: 11pt; font-weight: bold"> </span
                  ><span style="font-family: 宋体; font-size: 11pt; font-weight: bold">9；</span
                  ><span style="font-family: 宋体; font-size: 11pt; font-weight: bold"> </span
                  ><span style="font-family: 宋体; font-size: 11pt; font-weight: bold">10；</span
                  ><span style="font-family: 宋体; font-size: 11pt; font-weight: bold"> </span
                  ><span style="font-family: 宋体; font-size: 11pt; font-weight: bold">11；</span
                  ><span style="font-family: 宋体; font-size: 11pt; font-weight: bold"> </span
                  ><span style="font-family: 宋体; font-size: 11pt; font-weight: bold">12（表演文凭级）</span>
                </p>
              </td>
            </tr>
            <tr style="height: 18.85pt">
              <td
                colspan="14"
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: middle;
              width: 528.8pt;
            "
              >
                <p
                  style="
                line-height: 18.85pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 楷体; font-size: 11pt; font-weight: bold">以下由考官填写</span>
                </p>
              </td>
            </tr>
            <tr style="height: 14.25pt">
              <td
                colspan="2"
                style="
              border-bottom-color: #000000;
              border-bottom-style: double;
              border-bottom-width: 2.25pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: bottom;
              width: 111pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt; font-weight: bold">舞蹈 1</span
                  ><span style="font-family: 宋体; font-size: 11pt; font-weight: bold">--R / W</span>
                </p>
              </td>
              <td
                style="
              border-bottom-color: #000000;
              border-bottom-style: double;
              border-bottom-width: 2.25pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: top;
              width: 47.25pt;
            "
              >
                <p
                  style="
                 line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">极</span><span style="font-family: 宋体; font-size: 11pt">好</span>
                </p>
              </td>
              <td
                style="
              border-bottom-color: #000000;
              border-bottom-style: double;
              border-bottom-width: 2.25pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: top;
              width: 47.25pt;
            "
              >
                <p
                  style="
                  line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">很</span><span style="font-family: 宋体; font-size: 11pt">好</span>
                </p>
              </td>
              <td
                colspan="3"
                style="
              border-bottom-color: #000000;
              border-bottom-style: double;
              border-bottom-width: 2.25pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: top;
              width: 47.25pt;
            "
              >
                <p
                  style="
       line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">好</span>
                </p>
              </td>
              <td
                style="
              border-bottom-color: #000000;
              border-bottom-style: double;
              border-bottom-width: 2.25pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.75pt;
              vertical-align: bottom;
              width: 47.25pt;
            "
              >
                <p
                  style="
             line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">可以</span>
                </p>
              </td>
              <td
                colspan="3"
                style="
              border-bottom-color: #000000;
              border-bottom-style: double;
              border-bottom-width: 2.25pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: top;
              width: 47.25pt;
            "
              >
                <p
                  style="
      line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">普通</span>
                </p>
              </td>
              <td
                colspan="2"
                style="
              border-bottom-color: #000000;
              border-bottom-style: double;
              border-bottom-width: 2.25pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: top;
              width: 47.3pt;
            "
              >
                <p
                  style="
                 line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">要努力</span>
                </p>
              </td>
              <td
                style="
              border-bottom-color: #000000;
              border-bottom-style: double;
              border-bottom-width: 2.25pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: bottom;
              width: 123.75pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt; font-weight: bold">评分</span>
                </p>
              </td>
            </tr>
            <tr style="height: 14.25pt">
              <td
                colspan="2"
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: top;
              width: 111pt;
            "
              >
                <p
                  style="
                 line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt; font-style: italic">音乐 </span>
                </p>
              </td>
              <td
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: bottom;
              width: 47.25pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
              <td
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: bottom;
              width: 47.25pt;
            "
              >
                <p
                  style="
              line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
              <td
                colspan="3"
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: bottom;
              width: 47.25pt;
            "
              >
                <p
                  style="
             line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
              <td
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.75pt;
              vertical-align: bottom;
              width: 47.25pt;
            "
              >
                <p
                  style="
                 line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
              <td
                colspan="3"
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: bottom;
              width: 47.25pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
              <td
                colspan="2"
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: bottom;
              width: 47.3pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
              <td
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: bottom;
              width: 123.75pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
            </tr>
            <tr style="height: 14.25pt">
              <td
                colspan="2"
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: top;
              width: 111pt;
            "
              >
                <p
                  style="
                  line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt; font-style: italic">姿势</span>
                </p>
              </td>
              <td
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: top;
              width: 47.25pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
              <td
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: top;
              width: 47.25pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
              <td
                colspan="3"
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: top;
              width: 47.25pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
              <td
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.75pt;
              vertical-align: bottom;
              width: 47.25pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
              <td
                colspan="3"
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: top;
              width: 47.25pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
              <td
                colspan="2"
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: top;
              width: 47.3pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
              <td
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: bottom;
              width: 123.75pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
            </tr>
            <tr style="height: 14.25pt">
              <td
                colspan="2"
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: top;
              width: 111pt;
            "
              >
                <p
                  style="
                 line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt; font-style: italic">动作</span>
                </p>
              </td>
              <td
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: top;
              width: 47.25pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
              <td
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: top;
              width: 47.25pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
              <td
                colspan="3"
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: top;
              width: 47.25pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
              <td
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.75pt;
              vertical-align: bottom;
              width: 47.25pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
              <td
                colspan="3"
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: top;
              width: 47.25pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
              <td
                colspan="2"
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: top;
              width: 47.3pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
              <td
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: bottom;
              width: 123.75pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
            </tr>
            <tr style="height: 14.25pt">
              <td
                colspan="2"
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: top;
              width: 111pt;
            "
              >
                <p
                  style="
            line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt; font-style: italic">表现力</span>
                </p>
              </td>
              <td
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: top;
              width: 47.25pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
              <td
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: top;
              width: 47.25pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
              <td
                colspan="3"
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: top;
              width: 47.25pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
              <td
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.75pt;
              vertical-align: bottom;
              width: 47.25pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
              <td
                colspan="3"
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: top;
              width: 47.25pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
              <td
                colspan="2"
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: top;
              width: 47.3pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
              <td
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: bottom;
              width: 123.75pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
            </tr>
            <tr style="height: 14.25pt">
              <td
                colspan="2"
                style="
              border-bottom-color: #000000;
              border-bottom-style: double;
              border-bottom-width: 2.25pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: top;
              width: 111pt;
            "
              >
                <p
                  style="
               line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt; font-style: italic">配合</span>
                </p>
              </td>
              <td
                style="
              border-bottom-color: #000000;
              border-bottom-style: double;
              border-bottom-width: 2.25pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: top;
              width: 47.25pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
              <td
                style="
              border-bottom-color: #000000;
              border-bottom-style: double;
              border-bottom-width: 2.25pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: top;
              width: 47.25pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
              <td
                colspan="3"
                style="
              border-bottom-color: #000000;
              border-bottom-style: double;
              border-bottom-width: 2.25pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: top;
              width: 47.25pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
              <td
                style="
              border-bottom-color: #000000;
              border-bottom-style: double;
              border-bottom-width: 2.25pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.75pt;
              vertical-align: bottom;
              width: 47.25pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
              <td
                colspan="3"
                style="
              border-bottom-color: #000000;
              border-bottom-style: double;
              border-bottom-width: 2.25pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: top;
              width: 47.25pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
              <td
                colspan="2"
                style="
              border-bottom-color: #000000;
              border-bottom-style: double;
              border-bottom-width: 2.25pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: top;
              width: 47.3pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
              <td
                style="
              border-bottom-color: #000000;
              border-bottom-style: double;
              border-bottom-width: 2.25pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: bottom;
              width: 123.75pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
            </tr>
            <tr style="height: 14.25pt">
              <td
                colspan="2"
                style="
              border-bottom-color: #000000;
              border-bottom-style: double;
              border-bottom-width: 2.25pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: bottom;
              width: 111pt;
            "
              >
                <p
                  style="
                 line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt; font-weight: bold">舞蹈 2</span
                  ><span style="font-family: 宋体; font-size: 11pt; font-weight: bold">--C / T</span>
                </p>
              </td>
              <td
                style="
              border-bottom-color: #000000;
              border-bottom-style: double;
              border-bottom-width: 2.25pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: top;
              width: 47.25pt;
            "
              >
                <p
                  style="
                 line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">极</span><span style="font-family: 宋体; font-size: 11pt">好</span>
                </p>
              </td>
              <td
                style="
              border-bottom-color: #000000;
              border-bottom-style: double;
              border-bottom-width: 2.25pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: top;
              width: 47.25pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">很</span><span style="font-family: 宋体; font-size: 11pt">好</span>
                </p>
              </td>
              <td
                colspan="3"
                style="
              border-bottom-color: #000000;
              border-bottom-style: double;
              border-bottom-width: 2.25pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: top;
              width: 47.25pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">好</span>
                </p>
              </td>
              <td
                style="
              border-bottom-color: #000000;
              border-bottom-style: double;
              border-bottom-width: 2.25pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.75pt;
              vertical-align: bottom;
              width: 47.25pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">可以</span>
                </p>
              </td>
              <td
                colspan="3"
                style="
              border-bottom-color: #000000;
              border-bottom-style: double;
              border-bottom-width: 2.25pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: top;
              width: 47.25pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">普通</span>
                </p>
              </td>
              <td
                colspan="2"
                style="
              border-bottom-color: #000000;
              border-bottom-style: double;
              border-bottom-width: 2.25pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: top;
              width: 47.3pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">要努力</span>
                </p>
              </td>
              <td
                style="
              border-bottom-color: #000000;
              border-bottom-style: double;
              border-bottom-width: 2.25pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: bottom;
              width: 123.75pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
            </tr>
            <tr style="height: 14.25pt">
              <td
                colspan="2"
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: top;
              width: 111pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt; font-style: italic">音乐 </span>
                </p>
              </td>
              <td
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: bottom;
              width: 47.25pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
              <td
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: bottom;
              width: 47.25pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
              <td
                colspan="3"
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: bottom;
              width: 47.25pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
              <td
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.75pt;
              vertical-align: bottom;
              width: 47.25pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
              <td
                colspan="3"
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: bottom;
              width: 47.25pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
              <td
                colspan="2"
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: bottom;
              width: 47.3pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
              <td
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: bottom;
              width: 123.75pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
            </tr>
            <tr style="height: 14.25pt">
              <td
                colspan="2"
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: top;
              width: 111pt;
            "
              >
                <p
                  style="
        line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt; font-style: italic">姿势</span>
                </p>
              </td>
              <td
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: top;
              width: 47.25pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
              <td
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: top;
              width: 47.25pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
              <td
                colspan="3"
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: top;
              width: 47.25pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
              <td
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.75pt;
              vertical-align: bottom;
              width: 47.25pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
              <td
                colspan="3"
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: top;
              width: 47.25pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
              <td
                colspan="2"
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: top;
              width: 47.3pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
              <td
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: bottom;
              width: 123.75pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
            </tr>
            <tr style="height: 14.25pt">
              <td
                colspan="2"
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: top;
              width: 111pt;
            "
              >
                <p
                  style="
               line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt; font-style: italic">动作</span>
                </p>
              </td>
              <td
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: top;
              width: 47.25pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
              <td
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: top;
              width: 47.25pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
              <td
                colspan="3"
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: top;
              width: 47.25pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
              <td
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.75pt;
              vertical-align: bottom;
              width: 47.25pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
              <td
                colspan="3"
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: top;
              width: 47.25pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
              <td
                colspan="2"
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: top;
              width: 47.3pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
              <td
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: bottom;
              width: 123.75pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
            </tr>
            <tr style="height: 14.25pt">
              <td
                colspan="2"
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: top;
              width: 111pt;
            "
              >
                <p
                  style="
                 line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt; font-style: italic">表现力</span>
                </p>
              </td>
              <td
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: top;
              width: 47.25pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
              <td
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: top;
              width: 47.25pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
              <td
                colspan="3"
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: top;
              width: 47.25pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
              <td
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.75pt;
              vertical-align: bottom;
              width: 47.25pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
              <td
                colspan="3"
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: top;
              width: 47.25pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
              <td
                colspan="2"
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: top;
              width: 47.3pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
              <td
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: bottom;
              width: 123.75pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
            </tr>
            <tr style="height: 14.25pt">
              <td
                colspan="2"
                style="
              border-bottom-color: #000000;
              border-bottom-style: double;
              border-bottom-width: 2.25pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: top;
              width: 111pt;
            "
              >
                <p
                  style="
                 line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt; font-style: italic">配合</span>
                </p>
              </td>
              <td
                style="
              border-bottom-color: #000000;
              border-bottom-style: double;
              border-bottom-width: 2.25pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: top;
              width: 47.25pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
              <td
                style="
              border-bottom-color: #000000;
              border-bottom-style: double;
              border-bottom-width: 2.25pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: top;
              width: 47.25pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
              <td
                colspan="3"
                style="
              border-bottom-color: #000000;
              border-bottom-style: double;
              border-bottom-width: 2.25pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: top;
              width: 47.25pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
              <td
                style="
              border-bottom-color: #000000;
              border-bottom-style: double;
              border-bottom-width: 2.25pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.75pt;
              vertical-align: bottom;
              width: 47.25pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
              <td
                colspan="3"
                style="
              border-bottom-color: #000000;
              border-bottom-style: double;
              border-bottom-width: 2.25pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: top;
              width: 47.25pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
              <td
                colspan="2"
                style="
              border-bottom-color: #000000;
              border-bottom-style: double;
              border-bottom-width: 2.25pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: top;
              width: 47.3pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
              <td
                style="
              border-bottom-color: #000000;
              border-bottom-style: double;
              border-bottom-width: 2.25pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: bottom;
              width: 123.75pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
            </tr>
            <tr style="height: 14.25pt">
              <td
                colspan="2"
                style="
              border-bottom-color: #000000;
              border-bottom-style: double;
              border-bottom-width: 2.25pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: bottom;
              width: 111pt;
            "
              >
                <p
                  style="
                  line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt; font-weight: bold">舞蹈 3</span
                  ><span style="font-family: 宋体; font-size: 11pt; font-weight: bold">--J / Q</span>
                </p>
              </td>
              <td
                style="
              border-bottom-color: #000000;
              border-bottom-style: double;
              border-bottom-width: 2.25pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: top;
              width: 47.25pt;
            "
              >
                <p
                  style="
                 line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">极</span><span style="font-family: 宋体; font-size: 11pt">好</span>
                </p>
              </td>
              <td
                style="
              border-bottom-color: #000000;
              border-bottom-style: double;
              border-bottom-width: 2.25pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: top;
              width: 47.25pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">很</span><span style="font-family: 宋体; font-size: 11pt">好</span>
                </p>
              </td>
              <td
                colspan="3"
                style="
              border-bottom-color: #000000;
              border-bottom-style: double;
              border-bottom-width: 2.25pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: top;
              width: 47.25pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">好</span>
                </p>
              </td>
              <td
                style="
              border-bottom-color: #000000;
              border-bottom-style: double;
              border-bottom-width: 2.25pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.75pt;
              vertical-align: bottom;
              width: 47.25pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">可以</span>
                </p>
              </td>
              <td
                colspan="3"
                style="
              border-bottom-color: #000000;
              border-bottom-style: double;
              border-bottom-width: 2.25pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: top;
              width: 47.25pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">普通</span>
                </p>
              </td>
              <td
                colspan="2"
                style="
              border-bottom-color: #000000;
              border-bottom-style: double;
              border-bottom-width: 2.25pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: top;
              width: 47.3pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">要努力</span>
                </p>
              </td>
              <td
                style="
              border-bottom-color: #000000;
              border-bottom-style: double;
              border-bottom-width: 2.25pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: bottom;
              width: 123.75pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
            </tr>
            <tr style="height: 14.25pt">
              <td
                colspan="2"
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: top;
              width: 111pt;
            "
              >
                <p
                  style="
                  line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt; font-style: italic">音乐 </span>
                </p>
              </td>
              <td
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: bottom;
              width: 47.25pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt; font-weight: bold">&#xa0;</span>
                </p>
              </td>
              <td
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: bottom;
              width: 47.25pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt; font-weight: bold">&#xa0;</span>
                </p>
              </td>
              <td
                colspan="3"
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: bottom;
              width: 47.25pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt; font-weight: bold">&#xa0;</span>
                </p>
              </td>
              <td
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.75pt;
              vertical-align: bottom;
              width: 47.25pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
              <td
                colspan="3"
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: bottom;
              width: 47.25pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
              <td
                colspan="2"
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: bottom;
              width: 47.3pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
              <td
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: bottom;
              width: 123.75pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
            </tr>
            <tr style="height: 14.25pt">
              <td
                colspan="2"
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: top;
              width: 111pt;
            "
              >
                <p
                  style="
                  line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt; font-style: italic">姿势</span>
                </p>
              </td>
              <td
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: bottom;
              width: 47.25pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
              <td
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: bottom;
              width: 47.25pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
              <td
                colspan="3"
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: bottom;
              width: 47.25pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
              <td
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.75pt;
              vertical-align: bottom;
              width: 47.25pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
              <td
                colspan="3"
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: bottom;
              width: 47.25pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
              <td
                colspan="2"
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: bottom;
              width: 47.3pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
              <td
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: bottom;
              width: 123.75pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
            </tr>
            <tr style="height: 14.25pt">
              <td
                colspan="2"
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: top;
              width: 111pt;
            "
              >
                <p
                  style="
                 line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt; font-style: italic">动作</span>
                </p>
              </td>
              <td
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: bottom;
              width: 47.25pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
              <td
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: bottom;
              width: 47.25pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
              <td
                colspan="3"
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: bottom;
              width: 47.25pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
              <td
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.75pt;
              vertical-align: bottom;
              width: 47.25pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
              <td
                colspan="3"
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: bottom;
              width: 47.25pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
              <td
                colspan="2"
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: bottom;
              width: 47.3pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
              <td
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: bottom;
              width: 123.75pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
            </tr>
            <tr style="height: 14.25pt">
              <td
                colspan="2"
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: top;
              width: 111pt;
            "
              >
                <p
                  style="
                 line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt; font-style: italic">表现力</span>
                </p>
              </td>
              <td
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: bottom;
              width: 47.25pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
              <td
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: bottom;
              width: 47.25pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
              <td
                colspan="3"
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: bottom;
              width: 47.25pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
              <td
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.75pt;
              vertical-align: bottom;
              width: 47.25pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
              <td
                colspan="3"
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: bottom;
              width: 47.25pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
              <td
                colspan="2"
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: bottom;
              width: 47.3pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
              <td
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: bottom;
              width: 123.75pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
            </tr>
            <tr style="height: 14.25pt">
              <td
                colspan="2"
                style="
              border-bottom-color: #000000;
              border-bottom-style: double;
              border-bottom-width: 2.25pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: top;
              width: 111pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt; font-style: italic">配合</span>
                </p>
              </td>
              <td
                style="
              border-bottom-color: #000000;
              border-bottom-style: double;
              border-bottom-width: 2.25pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: bottom;
              width: 47.25pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
              <td
                style="
              border-bottom-color: #000000;
              border-bottom-style: double;
              border-bottom-width: 2.25pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: bottom;
              width: 47.25pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
              <td
                colspan="3"
                style="
              border-bottom-color: #000000;
              border-bottom-style: double;
              border-bottom-width: 2.25pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: bottom;
              width: 47.25pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
              <td
                style="
              border-bottom-color: #000000;
              border-bottom-style: double;
              border-bottom-width: 2.25pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.75pt;
              vertical-align: bottom;
              width: 47.25pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
              <td
                colspan="3"
                style="
              border-bottom-color: #000000;
              border-bottom-style: double;
              border-bottom-width: 2.25pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: bottom;
              width: 47.25pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
              <td
                colspan="2"
                style="
              border-bottom-color: #000000;
              border-bottom-style: double;
              border-bottom-width: 2.25pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: bottom;
              width: 47.3pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
              <td
                style="
              border-bottom-color: #000000;
              border-bottom-style: double;
              border-bottom-width: 2.25pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: bottom;
              width: 123.75pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
            </tr>
            <tr style="height: 14.25pt">
              <td
                colspan="2"
                style="
              border-bottom-color: #000000;
              border-bottom-style: double;
              border-bottom-width: 2.25pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: bottom;
              width: 111pt;
            "
              >
                <p
                  style="
                 line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt; font-weight: bold">舞蹈 4</span
                  ><span style="font-family: 宋体; font-size: 11pt; font-weight: bold">--S / F</span>
                </p>
              </td>
              <td
                style="
              border-bottom-color: #000000;
              border-bottom-style: double;
              border-bottom-width: 2.25pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: top;
              width: 47.25pt;
            "
              >
                <p
                  style="
                  line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">极</span><span style="font-family: 宋体; font-size: 11pt">好</span>
                </p>
              </td>
              <td
                style="
              border-bottom-color: #000000;
              border-bottom-style: double;
              border-bottom-width: 2.25pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: top;
              width: 47.25pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">很</span><span style="font-family: 宋体; font-size: 11pt">好</span>
                </p>
              </td>
              <td
                colspan="3"
                style="
              border-bottom-color: #000000;
              border-bottom-style: double;
              border-bottom-width: 2.25pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: top;
              width: 47.25pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">好</span>
                </p>
              </td>
              <td
                style="
              border-bottom-color: #000000;
              border-bottom-style: double;
              border-bottom-width: 2.25pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.75pt;
              vertical-align: bottom;
              width: 47.25pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">可以</span>
                </p>
              </td>
              <td
                colspan="3"
                style="
              border-bottom-color: #000000;
              border-bottom-style: double;
              border-bottom-width: 2.25pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: top;
              width: 47.25pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">普通</span>
                </p>
              </td>
              <td
                colspan="2"
                style="
              border-bottom-color: #000000;
              border-bottom-style: double;
              border-bottom-width: 2.25pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: top;
              width: 47.3pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">要努力</span>
                </p>
              </td>
              <td
                style="
              border-bottom-color: #000000;
              border-bottom-style: double;
              border-bottom-width: 2.25pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: bottom;
              width: 123.75pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
            </tr>
            <tr style="height: 14.25pt">
              <td
                colspan="2"
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: top;
              width: 111pt;
            "
              >
                <p
                  style="
                 line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt; font-style: italic">音乐 </span>
                </p>
              </td>
              <td
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: bottom;
              width: 47.25pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt; font-weight: bold">&#xa0;</span>
                </p>
              </td>
              <td
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: bottom;
              width: 47.25pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt; font-weight: bold">&#xa0;</span>
                </p>
              </td>
              <td
                colspan="3"
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: bottom;
              width: 47.25pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt; font-weight: bold">&#xa0;</span>
                </p>
              </td>
              <td
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.75pt;
              vertical-align: bottom;
              width: 47.25pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
              <td
                colspan="3"
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: bottom;
              width: 47.25pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
              <td
                colspan="2"
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: bottom;
              width: 47.3pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
              <td
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: bottom;
              width: 123.75pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
            </tr>
            <tr style="height: 14.25pt">
              <td
                colspan="2"
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: top;
              width: 111pt;
            "
              >
                <p
                  style="
                 line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt; font-style: italic">姿势</span>
                </p>
              </td>
              <td
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: bottom;
              width: 47.25pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
              <td
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: bottom;
              width: 47.25pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
              <td
                colspan="3"
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: bottom;
              width: 47.25pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
              <td
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.75pt;
              vertical-align: bottom;
              width: 47.25pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
              <td
                colspan="3"
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: bottom;
              width: 47.25pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
              <td
                colspan="2"
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: bottom;
              width: 47.3pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
              <td
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: bottom;
              width: 123.75pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
            </tr>
            <tr style="height: 14.25pt">
              <td
                colspan="2"
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: top;
              width: 111pt;
            "
              >
                <p
                  style="
                  line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt; font-style: italic">动作</span>
                </p>
              </td>
              <td
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: bottom;
              width: 47.25pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
              <td
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: bottom;
              width: 47.25pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
              <td
                colspan="3"
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: bottom;
              width: 47.25pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
              <td
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.75pt;
              vertical-align: bottom;
              width: 47.25pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
              <td
                colspan="3"
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: bottom;
              width: 47.25pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
              <td
                colspan="2"
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: bottom;
              width: 47.3pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
              <td
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: bottom;
              width: 123.75pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
            </tr>
            <tr style="height: 14.25pt">
              <td
                colspan="2"
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: top;
              width: 111pt;
            "
              >
                <p
                  style="
                  line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt; font-style: italic">表现力</span>
                </p>
              </td>
              <td
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: bottom;
              width: 47.25pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
              <td
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: bottom;
              width: 47.25pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
              <td
                colspan="3"
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: bottom;
              width: 47.25pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
              <td
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.75pt;
              vertical-align: bottom;
              width: 47.25pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
              <td
                colspan="3"
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: bottom;
              width: 47.25pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
              <td
                colspan="2"
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: bottom;
              width: 47.3pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
              <td
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: bottom;
              width: 123.75pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
            </tr>
            <tr style="height: 11.85pt">
              <td
                colspan="2"
                style="
              border-bottom-color: #000000;
              border-bottom-style: double;
              border-bottom-width: 2.25pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: top;
              width: 111pt;
            "
              >
                <p
                  style="
                  line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt; font-style: italic">配合</span>
                </p>
              </td>
              <td
                style="
              border-bottom-color: #000000;
              border-bottom-style: double;
              border-bottom-width: 2.25pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: bottom;
              width: 47.25pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
              <td
                style="
              border-bottom-color: #000000;
              border-bottom-style: double;
              border-bottom-width: 2.25pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: bottom;
              width: 47.25pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
              <td
                colspan="3"
                style="
              border-bottom-color: #000000;
              border-bottom-style: double;
              border-bottom-width: 2.25pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: bottom;
              width: 47.25pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
              <td
                style="
              border-bottom-color: #000000;
              border-bottom-style: double;
              border-bottom-width: 2.25pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.75pt;
              vertical-align: bottom;
              width: 47.25pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
              <td
                colspan="3"
                style="
              border-bottom-color: #000000;
              border-bottom-style: double;
              border-bottom-width: 2.25pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: bottom;
              width: 47.25pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
              <td
                colspan="2"
                style="
              border-bottom-color: #000000;
              border-bottom-style: double;
              border-bottom-width: 2.25pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: bottom;
              width: 47.3pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
              <td
                style="
              border-bottom-color: #000000;
              border-bottom-style: double;
              border-bottom-width: 2.25pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: bottom;
              width: 123.75pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
            </tr>
            <tr style="height: 14.25pt">
              <td
                colspan="2"
                style="
              border-bottom-color: #000000;
              border-bottom-style: double;
              border-bottom-width: 2.25pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: bottom;
              width: 111pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt; font-weight: bold">舞蹈 5</span
                  ><span style="font-family: 宋体; font-size: 11pt; font-weight: bold">--P / VW</span>
                </p>
              </td>
              <td
                style="
              border-bottom-color: #000000;
              border-bottom-style: double;
              border-bottom-width: 2.25pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: top;
              width: 47.25pt;
            "
              >
                <p
                  style="
                  line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">极</span><span style="font-family: 宋体; font-size: 11pt">好</span>
                </p>
              </td>
              <td
                style="
              border-bottom-color: #000000;
              border-bottom-style: double;
              border-bottom-width: 2.25pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: top;
              width: 47.25pt;
            "
              >
                <p
                  style="
                  line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">很</span><span style="font-family: 宋体; font-size: 11pt">好</span>
                </p>
              </td>
              <td
                colspan="3"
                style="
              border-bottom-color: #000000;
              border-bottom-style: double;
              border-bottom-width: 2.25pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: top;
              width: 47.25pt;
            "
              >
                <p
                  style="
                 line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">好</span>
                </p>
              </td>
              <td
                style="
              border-bottom-color: #000000;
              border-bottom-style: double;
              border-bottom-width: 2.25pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.75pt;
              vertical-align: bottom;
              width: 47.25pt;
            "
              >
                <p
                  style="
                  line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">可以</span>
                </p>
              </td>
              <td
                colspan="3"
                style="
              border-bottom-color: #000000;
              border-bottom-style: double;
              border-bottom-width: 2.25pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: top;
              width: 47.25pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">普通</span>
                </p>
              </td>
              <td
                colspan="2"
                style="
              border-bottom-color: #000000;
              border-bottom-style: double;
              border-bottom-width: 2.25pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: top;
              width: 47.3pt;
            "
              >
                <p
                  style="
                  line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">要努力</span>
                </p>
              </td>
              <td
                style="
              border-bottom-color: #000000;
              border-bottom-style: double;
              border-bottom-width: 2.25pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: bottom;
              width: 123.75pt;
            "
              >
                <p
                  style="
                 line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
            </tr>
            <tr style="height: 14.25pt">
              <td
                colspan="2"
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: top;
              width: 111pt;
            "
              >
                <p
                  style="
                 line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt; font-style: italic">音乐 </span>
                </p>
              </td>
              <td
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: bottom;
              width: 47.25pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt; font-weight: bold">&#xa0;</span>
                </p>
              </td>
              <td
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: bottom;
              width: 47.25pt;
            "
              >
                <p
                  style="
              line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt; font-weight: bold">&#xa0;</span>
                </p>
              </td>
              <td
                colspan="3"
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: bottom;
              width: 47.25pt;
            "
              >
                <p
                  style="
                 line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt; font-weight: bold">&#xa0;</span>
                </p>
              </td>
              <td
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.75pt;
              vertical-align: bottom;
              width: 47.25pt;
            "
              >
                <p
                  style="
          line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
              <td
                colspan="3"
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: bottom;
              width: 47.25pt;
            "
              >
                <p
                  style="
                  line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
              <td
                colspan="2"
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: bottom;
              width: 47.3pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
              <td
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: bottom;
              width: 123.75pt;
            "
              >
                <p
                  style="
               line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
            </tr>
            <tr style="height: 14.25pt">
              <td
                colspan="2"
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: top;
              width: 111pt;
            "
              >
                <p
                  style="
                 line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt; font-style: italic">姿势</span>
                </p>
              </td>
              <td
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: bottom;
              width: 47.25pt;
            "
              >
                <p
                  style="
                  line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
              <td
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: bottom;
              width: 47.25pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
              <td
                colspan="3"
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: bottom;
              width: 47.25pt;
            "
              >
                <p
                  style="
              line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
              <td
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.75pt;
              vertical-align: bottom;
              width: 47.25pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
              <td
                colspan="3"
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: bottom;
              width: 47.25pt;
            "
              >
                <p
                  style="
               line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
              <td
                colspan="2"
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: bottom;
              width: 47.3pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
              <td
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: bottom;
              width: 123.75pt;
            "
              >
                <p
                  style="
               line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
            </tr>
            <tr style="height: 14.25pt">
              <td
                colspan="2"
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: top;
              width: 111pt;
            "
              >
                <p
                  style="
                 line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt; font-style: italic">动作</span>
                </p>
              </td>
              <td
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: bottom;
              width: 47.25pt;
            "
              >
                <p
                  style="
                 line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
              <td
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: bottom;
              width: 47.25pt;
            "
              >
                <p
                  style="
             line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
              <td
                colspan="3"
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: bottom;
              width: 47.25pt;
            "
              >
                <p
                  style="
              line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
              <td
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.75pt;
              vertical-align: bottom;
              width: 47.25pt;
            "
              >
                <p
                  style="
           line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
              <td
                colspan="3"
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: bottom;
              width: 47.25pt;
            "
              >
                <p
                  style="
             line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
              <td
                colspan="2"
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: bottom;
              width: 47.3pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
              <td
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: bottom;
              width: 123.75pt;
            "
              >
                <p
                  style="
                 line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
            </tr>
            <tr style="height: 14.25pt">
              <td
                colspan="2"
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: top;
              width: 111pt;
            "
              >
                <p
                  style="
             line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt; font-style: italic">表现力</span>
                </p>
              </td>
              <td
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: bottom;
              width: 47.25pt;
            "
              >
                <p
                  style="
               line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
              <td
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: bottom;
              width: 47.25pt;
            "
              >
                <p
                  style="
             line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
              <td
                colspan="3"
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: bottom;
              width: 47.25pt;
            "
              >
                <p
                  style="
               line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
              <td
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.75pt;
              vertical-align: bottom;
              width: 47.25pt;
            "
              >
                <p
                  style="
               line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
              <td
                colspan="3"
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: bottom;
              width: 47.25pt;
            "
              >
                <p
                  style="
              line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
              <td
                colspan="2"
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: bottom;
              width: 47.3pt;
            "
              >
                <p
                  style="
         line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
              <td
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: bottom;
              width: 123.75pt;
            "
              >
                <p
                  style="
                 line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
            </tr>
            <tr style="height: 14.25pt">
              <td
                colspan="2"
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: top;
              width: 111pt;
            "
              >
                <p
                  style="
                 line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span
                    style="
                  font-family: 宋体;
                  font-size: 11pt;
                  font-style: italic;
                  font-weight: normal;
                "
                    >配合</span
                  >
                </p>
              </td>
              <td
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: bottom;
              width: 47.25pt;
            "
              >
                <p
                  style="
              line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt; font-weight: bold">&#xa0;</span>
                </p>
              </td>
              <td
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: bottom;
              width: 47.25pt;
            "
              >
                <p
                  style="
           line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt; font-weight: bold">&#xa0;</span>
                </p>
              </td>
              <td
                colspan="3"
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: bottom;
              width: 47.25pt;
            "
              >
                <p
                  style="
              line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt; font-weight: bold">&#xa0;</span>
                </p>
              </td>
              <td
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: bottom;
              width: 47.25pt;
            "
              >
                <p
                  style="
           line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt; font-weight: bold">&#xa0;</span>
                </p>
              </td>
              <td
                colspan="3"
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: bottom;
              width: 47.25pt;
            "
              >
                <p
                  style="
             line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt; font-weight: bold">&#xa0;</span>
                </p>
              </td>
              <td
                colspan="2"
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: bottom;
              width: 47.3pt;
            "
              >
                <p
                  style="
   line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt; font-weight: bold">&#xa0;</span>
                </p>
              </td>
              <td
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: bottom;
              width: 123.75pt;
            "
              >
                <p
                  style="
              line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt; font-weight: bold">&#xa0;</span>
                </p>
              </td>
            </tr>
            <tr style="height: 27.25pt">
              <td
                colspan="2"
                rowspan="2"
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: middle;
              width: 111pt;
            "
              >
                <p
                  style="
                line-height: 10.5pt;
                margin: 0pt;
                orphans: 0;
                text-align: justify;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 10.5pt;font-weight:500;">65分</span><span style="font-family: 宋体; font-size: 10.5pt">： </span
                  ><span style="font-family: 宋体; font-size: 10.5pt">及格</span>
                </p>
                <p
                  style="
                line-height: 10.5pt;
                margin: 0pt;
                orphans: 0;
                text-align: justify;
                widows: 0;
              "
                >
                  <span style="font-family: Verdana; font-size: 10.5pt;font-weight:500;">75-85</span><span style="font-family: 宋体; font-size: 10.5pt">分</span
                  ><span style="font-family: 宋体; font-size: 10.5pt">： </span><span style="font-family: 宋体; font-size: 10.5pt">良好</span>
                </p>
                <p
                  style="
                line-height: 10.5pt;
                margin: 0pt;
                orphans: 0;
                text-align: justify;
                widows: 0;
              "
                >
                  <span style="font-family: Verdana; font-size: 10.5pt;font-weight:500;">86-100</span
                  ><span style="font-family: 宋体; font-size: 10.5pt">分</span><span style="font-family: 宋体; font-size: 10.5pt">： </span
                  ><span style="font-family: 宋体; font-size: 10.5pt">优秀</span>
                </p>
              </td>
              <td
                colspan="7"
                rowspan="2"
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: top;
              width: 215.3pt;
            "
              >
                <p style="line-height: 14.25pt; margin: 0pt; orphans: 0; widows: 0">
                  <span style="font-family: 宋体; font-size: 11pt">【评语】</span>
                </p>
                <p style="line-height: 14.25pt; margin: 0pt; orphans: 0; widows: 0">
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
              <td
                colspan="4"
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.75pt;
              vertical-align: middle;
              width: 74.25pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: justify;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt; font-weight: bold">总成绩</span>
                </p>
              </td>
              <td
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: bottom;
              width: 123.75pt;
            "
              >
                <p
                  style="
                line-height: 14.25pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                >
                  <span style="font-family: 宋体; font-size: 11pt">&#xa0;</span>
                </p>
              </td>
            </tr>
            <tr style="height: 41.25pt">
              <td
                colspan="4"
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.75pt;
              vertical-align: top;
              width: 74.25pt;
            "
              >
                <p style="line-height: 14.25pt; margin: 0pt; orphans: 0; widows: 0">
                  <span style="font-family: 宋体; font-size: 11pt; font-weight: bold">考官名字</span>
                </p>
              </td>
              <td
                style="
              border-bottom-color: #000000;
              border-bottom-style: solid;
              border-bottom-width: 0.75pt;
              border-left-color: #000000;
              border-left-style: solid;
              border-left-width: 0.75pt;
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              padding-left: 0.38pt;
              padding-right: 0.38pt;
              vertical-align: top;
              width: 123.75pt;
            "
              >
                <p style="line-height: 14.25pt; margin: 0pt; orphans: 0; widows: 0">
                  <span style="font-family: 宋体; font-size: 11pt; font-weight: bold">考官签名</span>
                </p>
                <p style="line-height: 14.25pt; margin: 0pt; orphans: 0; widows: 0">
                  <span style="font-family: 宋体; font-size: 11pt; font-weight: bold">&#xa0;</span>
                </p>
              </td>
            </tr>
            <tr style="height: 0pt">
              <td style="width: 60.45pt; border: none"></td>
              <td style="width: 52.05pt; border: none"></td>
              <td style="width: 48.75pt; border: none"></td>
              <td style="width: 48.75pt; border: none"></td>
              <td style="width: 2.7pt; border: none"></td>
              <td style="width: 45.35pt; border: none"></td>
              <td style="width: 0.7pt; border: none"></td>
              <td style="width: 48.75pt; border: none"></td>
              <td style="width: 21.8pt; border: none"></td>
              <td style="width: 2.25pt; border: none"></td>
              <td style="width: 24.7pt; border: none"></td>
              <td style="width: 12.05pt; border: none"></td>
              <td style="width: 36.75pt; border: none"></td>
              <td style="width: 125.25pt; border: none"></td>
            </tr>
          </table>

          <p
            style="
          margin: 0pt;
          orphans: 0;
          text-align: justify;
          text-indent: 250pt;
          widows: 0;
        "
          >
            <span style="font-family: 宋体; font-size: 10.5pt; font-weight: bold">填表日期：        年    月    日</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'LatinDance',
  props: {
    printRecord: {
      type: Object,
      default: {}
    },
    printInfo: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {}
  },
  components: {},

  created() {
    this.selecePeople = null
  },

  computed: {},
  methods: {
    print() {
      this.$refs.printBtn.$el.click()
    }
  },
  watch: {}
}
</script>
<style scoped media="print" lang="less"></style>
