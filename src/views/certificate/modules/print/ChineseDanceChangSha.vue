<template>
  <div style=" display:none; ">
    <a-button ref="printBtn" type="primary" v-print="'#printTest'"> 打印 </a-button>
    <div>
      <div ref="printTest" class="" style="width: 501.1pt;margin: 0 auto;background-color: #fff;font-weight: 700;color:#000;" id="printTest">
        <div v-for="(item, index) in list" :key="index">
          <div v-if="item.type == 'table'" style="position:relative;">
            <div
              v-if="!cerRank.des5"
              style="width:84.6pt;border:1px solid #000; position:absolute;right:0;top:0; margin: 0pt 9pt 0;height: 133px;font-weight: 500;"
            >
              <p style="line-height: 18pt; margin: 0pt; text-align: center">
                <span style="font-family: 微软雅黑; font-size: 15pt">照</span>
              </p>
              <p style="line-height: 18pt; margin: 0pt; text-align: center">
                <span style="font-family: 微软雅黑; font-size: 15pt">片</span>
              </p>
              <p style="line-height: 18pt; margin: 0pt; text-align: center">
                <span style="font-family: 微软雅黑; font-size: 15pt">粘</span>
              </p>
              <p style="line-height: 18pt; margin: 0pt; text-align: center">
                <span style="font-family: 微软雅黑; font-size: 15pt">贴</span>
              </p>
              <p style="line-height: 18pt; margin: 0pt; text-align: center">
                <span style="font-family: 微软雅黑; font-size: 15pt">处</span>
              </p>
            </div>
            <p style="line-height: 11pt; margin: 0pt; text-align: center">
              <span style="font-family: 黑体; font-size: 15pt">&#xa0;</span>
            </p>
            <p style="line-height: 18pt; margin: 0pt; text-align: center">
              <span style="font-family: 黑体; font-size: 15pt">&#xa0;</span>
            </p>
            <p style="line-height: 18pt; margin: 0pt; text-align: center;">
              <span style="font-family: 黑体; font-size: 15pt"> </span><span style="font-family: 黑体; font-size: 15pt"> </span
              ><span style="font-family: 黑体; font-size: 15pt">中国舞蹈家协会中国舞等级考试</span>
            </p>
            <p style="line-height: 18pt; margin: 0pt; text-align: center">
              <span style="font-family: 隶书; font-size: 15pt"> </span><span style="font-family: 隶书; font-size: 15pt"> </span
              ><span style="font-family: 隶书; font-size: 15pt">学 生 成 绩 评 定</span
              ><span style="font-family: 隶书; font-size: 15pt">（{{ cerRank.rank }}）</span>
            </p>
            <p
              style="
          line-height: 16pt;
          margin: 0pt;
          orphans: 0;
          text-align: justify;
          widows: 0;
        "
            >
              <span style="font-family: 宋体; font-size: 12pt; font-weight: bold">&#xa0;</span>
            </p>
            <p
              style="
          line-height: 16pt;
          margin: 0pt;
          orphans: 0;
          text-align: justify;
          widows: 0;
        "
            >
              <span style="padding:0 5px;"></span>
              <span style="font-family: 宋体;font-size: 12pt;text-decoration: underline;">&nbsp;&nbsp;&nbsp;</span>
              <span style="font-family: 宋体; font-size: 12pt; font-weight: bold">组</span>
              <span style="font-family: 宋体;font-size: 12pt;text-decoration: underline;">&nbsp;&nbsp;&nbsp; </span>
              <span style="font-family: 宋体; font-size: 12pt; font-weight: bold;padding-right: 12pt;">号</span>
              <span style="font-family: 宋体; font-size: 12pt; font-weight: bold;padding-right: 36pt;">级别：</span>
              <span style="font-family: 宋体; font-size: 12pt; font-weight: bold;padding-right:80pt;">教师：</span>
              <span v-if="!cerRank.des5" style="font-family: 宋体; font-size: 12pt; font-weight: bold;padding-right: 5pt;">考题</span>
              <span v-if="!cerRank.des5" style="font-family: 宋体; font-size: 12pt; font-weight: bold;padding-right: 5pt;">：</span>
              <span v-if="!cerRank.des5" style="font-family: 'Times New Roman';font-size: 12pt;font-weight: bold;">A&nbsp;&nbsp;&nbsp;&nbsp;B</span>
            </p>
            <table cellspacing="0" cellpadding="0" style="border-collapse: collapse; margin-left: 0pt; width: 501.1pt;text-align:center;">
              <tr>
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
              padding-left: 5.03pt;
              padding-right: 5.03pt;
              vertical-align: top;
              width: 52.1pt;
            "
                >
                  <p style="margin: 0pt; orphans: 0; text-align: center; widows: 0;line-height:35pt;">
                    <span style="font-family: 宋体; font-size: 14pt">姓名</span>
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
              padding-left: 5.03pt;
              padding-right: 5.03pt;
              vertical-align: top;
              width: 78.95pt;
            "
                >
                  <p style="margin: 0pt; orphans: 0; text-align: center; widows: 0">
                    <span style="font-family: '宋体'; font-size: 14pt;line-height:35pt;font-weight:500;">{{ printRecord.cerName }}</span>
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
              padding-left: 5.03pt;
              padding-right: 5.03pt;
              vertical-align: top;
              width: 21pt;
            "
                >
                  <p style="margin: 0pt; orphans: 0; text-align: center; widows: 0">
                    <span style="font-family: 宋体; font-size: 12pt">性别</span>
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
              padding-left: 5.03pt;
              padding-right: 5.03pt;
              vertical-align: top;
              width: 66.45pt;
            "
                >
                  <p style="margin: 0pt; orphans: 0; text-align: center; widows: 0">
                    <span style="font-family: '宋体'; font-size: 14pt;font-weight:500;line-height:35pt;">{{ printRecord.cerSex == 'A' ? '男' : '女' }}</span>
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
              padding-left: 5.03pt;
              padding-right: 5.03pt;
              vertical-align: top;
              width: 34.1pt;
            "
                >
                  <p style="margin: 0pt; orphans: 0; text-align: center; widows: 0">
                    <span style="font-family: 宋体; font-size: 12pt">出生</span>
                  </p>
                  <p style="margin: 0pt; orphans: 0; text-align: center; widows: 0">
                    <span style="font-family: 宋体; font-size: 12pt">年月</span>
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
              padding-left: 0;
              padding-right: 0;
              vertical-align: top;
              width: 60.95pt;
            "
                >
                  <p style="margin: 0pt; orphans: 0; text-align: center; widows: 0">
                    <span style="font-family: 宋体;font-size: 11pt;font-weight:500;line-height:35pt;">{{ printRecord.birthday }}</span>
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
              padding-left: 5.03pt;
              padding-right: 5.03pt;
              vertical-align: top;
              width: 41pt;
            "
                >
                  <p style="margin: 0pt; orphans: 0; text-align: center; widows: 0">
                    <span style="font-family: 宋体; font-size: 12pt">考试</span>
                  </p>
                  <p style="margin: 0pt; orphans: 0; text-align: center; widows: 0">
                    <span style="font-family: 宋体; font-size: 12pt">地区</span>
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
              padding-left: 5.03pt;
              padding-right: 5.03pt;
              vertical-align: top;
              width: 59.4pt;
            "
                >
                  <p style="margin: 0pt; orphans: 0; text-align: center; widows: 0">
                    <span style="font-family: '宋体'; font-size: 14pt;font-weight:500;line-height:35pt;">{{ printInfo.cerAreaName }}</span>
                  </p>
                </td>
              </tr>
              <tr style="height: 28.15pt">
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
              padding-left: 5.03pt;
              padding-right: 5.03pt;
              vertical-align: top;
              width: 52.1pt;
            "
                >
                  <p style="margin: 0pt; orphans: 0; text-align: justify; widows: 0">
                    <span style="font-family: 'Times New Roman'; font-size: 14pt">&#xa0;</span>
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
              padding-left: 5.03pt;
              padding-right: 5.03pt;
              vertical-align: middle;
              
            "
                  :style="cerRank.des5 ? 'width: 101.09pt;' : 'width: 78.95pt;'"
                >
                  <p style="margin: 0pt; orphans: 0; text-align: center; widows: 0">
                    <span style="font-family: 宋体; font-size: 14pt">{{ cerRank.des1 }}</span>
                  </p>
                </td>
                <td
                  :colspan="cerRank.des5 ? '2' : '3'"
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
              padding-left: 5.03pt;
              padding-right: 5.03pt;
              vertical-align: middle;
             
            "
                  :style="cerRank.des5 ? 'width: 101.09pt;' : 'width: 98.25pt;'"
                >
                  <p style="margin: 0pt; orphans: 0; text-align: center; widows: 0">
                    <span style="font-family: 宋体; font-size: 14pt"> {{ cerRank.des2 }}</span>
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
              padding-left: 5.03pt;
              padding-right: 5.03pt;
              vertical-align: middle;
             
            "
                  :style="cerRank.des5 ? 'width: 101.09pt;' : ' width: 105.85pt;'"
                >
                  <p style="margin: 0pt; orphans: 0; text-align: center; widows: 0">
                    <span style="font-family: 宋体; font-size: 14pt">{{ cerRank.des3 }}</span>
                  </p>
                </td>
                <td
                  :colspan="cerRank.des5 ? '2' : '3'"
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
              padding-left: 5.03pt;
              padding-right: 5.03pt;
              vertical-align: middle;
             
            "
                  :style="cerRank.des5 ? 'width: 101.09pt;' : ' width: 111.2pt;'"
                >
                  <p style="margin: 0pt; orphans: 0; text-align: center; widows: 0">
                    <span style="font-family: 宋体; font-size: 14pt">{{ cerRank.des4 }}</span>
                  </p>
                </td>
                <td
                  :colspan="cerRank.des5 ? '2' : '3'"
                  v-if="cerRank.des5"
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
              padding-left: 5.03pt;
              padding-right: 5.03pt;
              vertical-align: middle;
              
            "
                  :style="cerRank.des5 ? 'width: 101.09pt;' : 'width: 111.2pt;'"
                >
                  <p style="margin: 0pt; orphans: 0; text-align: center; widows: 0">
                    <span style="font-family: 宋体; font-size: 14pt">{{ cerRank.des5 }}</span>
                  </p>
                </td>
              </tr>
              <tr style="height: 24.35pt">
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
              padding-left: 5.03pt;
              padding-right: 5.03pt;
              vertical-align: middle;
              width: 52.1pt;
            "
                >
                  <p
                    style="
                line-height: 24pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                  >
                    <span style="font-family: 宋体; font-size: 14pt">优</span>
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
              padding-left: 5.03pt;
              padding-right: 5.03pt;
              vertical-align: top;
 
            "
                  :style="cerRank.des5 ? 'width: 101.09pt;' : 'width: 78.95pt;'"
                >
                  <p
                    style="
                line-height: 24pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                  >
                    <span style="font-family: 'Times New Roman'; font-size: 14pt">&#xa0;</span>
                  </p>
                </td>
                <td
                  :colspan="cerRank.des5 ? '2' : '3'"
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
              padding-left: 5.03pt;
              padding-right: 5.03pt;
              vertical-align: top;
              "
                  :style="cerRank.des5 ? 'width: 101.09pt;' : 'width: 98.25pt;'"
                >
                  <p
                    style="
                line-height: 24pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                  >
                    <span style="font-family: 'Times New Roman'; font-size: 14pt">&#xa0;</span>
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
              padding-left: 5.03pt;
              padding-right: 5.03pt;
              vertical-align: top;
                        "
                  :style="cerRank.des5 ? 'width: 101.09pt;' : ' width: 105.85pt;'"
                >
                  <p
                    style="
                line-height: 24pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                  >
                    <span style="font-family: 'Times New Roman'; font-size: 14pt">&#xa0;</span>
                  </p>
                </td>
                <td
                  :colspan="cerRank.des5 ? '2' : '3'"
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
              padding-left: 5.03pt;
              padding-right: 5.03pt;
              vertical-align: top;
             "
                  :style="cerRank.des5 ? 'width: 101.09pt;' : ' width: 111.2pt;'"
                >
                  <p
                    style="
                line-height: 24pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                  >
                    <span style="font-family: 'Times New Roman'; font-size: 14pt">&#xa0;</span>
                  </p>
                </td>
                <td
                  :colspan="cerRank.des5 ? '2' : '3'"
                  v-if="cerRank.des5"
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
              padding-left: 5.03pt;
              padding-right: 5.03pt;
              vertical-align: middle;
              
            "
                  :style="cerRank.des5 ? 'width: 101.09pt;' : 'width: 111.2pt;'"
                >
                  <p style="margin: 0pt; orphans: 0; text-align: center; widows: 0">
                    <span style="font-family: 宋体; font-size: 14pt"></span>
                  </p>
                </td>
              </tr>
              <tr>
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
              padding-left: 5.03pt;
              padding-right: 5.03pt;
              vertical-align: middle;
              width: 52.1pt;
            "
                >
                  <p
                    style="
                line-height: 24pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                  >
                    <span style="font-family: 宋体; font-size: 14pt">良</span>
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
              padding-left: 5.03pt;
              padding-right: 5.03pt;
              vertical-align: top;
         
            "
                  :style="cerRank.des5 ? 'width: 101.09pt;' : 'width: 78.95pt;'"
                >
                  <p
                    style="
                line-height: 24pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                  >
                    <span style="font-family: 'Times New Roman'; font-size: 14pt">&#xa0;</span>
                  </p>
                </td>
                <td
                  :colspan="cerRank.des5 ? '2' : '3'"
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
              padding-left: 5.03pt;
              padding-right: 5.03pt;
              vertical-align: top;
              "
                  :style="cerRank.des5 ? 'width: 101.09pt;' : 'width: 98.25pt;'"
                >
                  <p
                    style="
                line-height: 24pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                  >
                    <span style="font-family: 'Times New Roman'; font-size: 14pt">&#xa0;</span>
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
              padding-left: 5.03pt;
              padding-right: 5.03pt;
              vertical-align: top;
                        "
                  :style="cerRank.des5 ? 'width: 101.09pt;' : ' width: 105.85pt;'"
                >
                  <p
                    style="
                line-height: 24pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                  >
                    <span style="font-family: 'Times New Roman'; font-size: 14pt">&#xa0;</span>
                  </p>
                </td>
                <td
                  :colspan="cerRank.des5 ? '2' : '3'"
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
              padding-left: 5.03pt;
              padding-right: 5.03pt;
              vertical-align: top;
             "
                  :style="cerRank.des5 ? 'width: 101.09pt;' : ' width: 111.2pt;'"
                >
                  <p
                    style="
                line-height: 24pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                  >
                    <span style="font-family: 'Times New Roman'; font-size: 14pt">&#xa0;</span>
                  </p>
                </td>
                <td
                  :colspan="cerRank.des5 ? '2' : '3'"
                  v-if="cerRank.des5"
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
              padding-left: 5.03pt;
              padding-right: 5.03pt;
              vertical-align: middle;
              
            "
                  :style="cerRank.des5 ? 'width: 101.09pt;' : 'width: 111.2pt;'"
                >
                  <p style="margin: 0pt; orphans: 0; text-align: center; widows: 0">
                    <span style="font-family: 宋体; font-size: 14pt"></span>
                  </p>
                </td>
              </tr>
              <tr>
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
              padding-left: 5.03pt;
              padding-right: 5.03pt;
              vertical-align: middle;
              width: 52.1pt;
            "
                >
                  <p
                    style="
                line-height: 24pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                  >
                    <span style="font-family: 宋体; font-size: 14pt">合格</span>
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
              padding-left: 5.03pt;
              padding-right: 5.03pt;
              vertical-align: top;

            "
                  :style="cerRank.des5 ? 'width: 101.09pt;' : 'width: 78.95pt;'"
                >
                  <p
                    style="
                line-height: 24pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                  >
                    <span style="font-family: 'Times New Roman'; font-size: 14pt">&#xa0;</span>
                  </p>
                </td>
                <td
                  :colspan="cerRank.des5 ? '2' : '3'"
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
              padding-left: 5.03pt;
              padding-right: 5.03pt;
              vertical-align: top;
              "
                  :style="cerRank.des5 ? 'width: 101.09pt;' : 'width: 98.25pt;'"
                >
                  <p
                    style="
                line-height: 24pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                  >
                    <span style="font-family: 'Times New Roman'; font-size: 14pt">&#xa0;</span>
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
              padding-left: 5.03pt;
              padding-right: 5.03pt;
              vertical-align: top;
                        "
                  :style="cerRank.des5 ? 'width: 101.09pt;' : ' width: 105.85pt;'"
                >
                  <p
                    style="
                line-height: 24pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                  >
                    <span style="font-family: 'Times New Roman'; font-size: 14pt">&#xa0;</span>
                  </p>
                </td>
                <td
                  :colspan="cerRank.des5 ? '2' : '3'"
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
              padding-left: 5.03pt;
              padding-right: 5.03pt;
              vertical-align: top;
             "
                  :style="cerRank.des5 ? 'width: 101.09pt;' : ' width: 111.2pt;'"
                >
                  <p
                    style="
                line-height: 24pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                  >
                    <span style="font-family: 'Times New Roman'; font-size: 14pt">&#xa0;</span>
                  </p>
                </td>
                <td
                  :colspan="cerRank.des5 ? '2' : '3'"
                  v-if="cerRank.des5"
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
              padding-left: 5.03pt;
              padding-right: 5.03pt;
              vertical-align: middle;
              
            "
                  :style="cerRank.des5 ? 'width: 101.09pt;' : 'width: 111.2pt;'"
                >
                  <p style="margin: 0pt; orphans: 0; text-align: center; widows: 0">
                    <span style="font-family: 宋体; font-size: 14pt"></span>
                  </p>
                </td>
              </tr>
              <tr style="height: 21.45pt">
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
              padding-left: 5.03pt;
              padding-right: 5.03pt;
              vertical-align: middle;
              width: 52.1pt;
            "
                >
                  <p
                    style="
                line-height: 24pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                  >
                    <span style="font-family: 宋体; font-size: 14pt">不合格</span>
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
              padding-left: 5.03pt;
              padding-right: 5.03pt;
              vertical-align: top;
       
            "
                  :style="cerRank.des5 ? 'width: 101.09pt;' : 'width: 78.95pt;'"
                >
                  <p
                    style="
                line-height: 24pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                  >
                    <span style="font-family: 'Times New Roman'; font-size: 14pt">&#xa0;</span>
                  </p>
                </td>
                <td
                  :colspan="cerRank.des5 ? '2' : '3'"
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
              padding-left: 5.03pt;
              padding-right: 5.03pt;
              vertical-align: top;
              "
                  :style="cerRank.des5 ? 'width: 101.09pt;' : 'width: 98.25pt;'"
                >
                  <p
                    style="
                line-height: 24pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                  >
                    <span style="font-family: 'Times New Roman'; font-size: 14pt">&#xa0;</span>
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
              padding-left: 5.03pt;
              padding-right: 5.03pt;
              vertical-align: top;
                        "
                  :style="cerRank.des5 ? 'width: 101.09pt;' : ' width: 105.85pt;'"
                >
                  <p
                    style="
                line-height: 24pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                  >
                    <span style="font-family: 'Times New Roman'; font-size: 14pt">&#xa0;</span>
                  </p>
                </td>
                <td
                  :colspan="cerRank.des5 ? '2' : '3'"
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
              padding-left: 5.03pt;
              padding-right: 5.03pt;
              vertical-align: top;
             "
                  :style="cerRank.des5 ? 'width: 101.09pt;' : ' width: 111.2pt;'"
                >
                  <p
                    style="
                line-height: 24pt;
                margin: 0pt;
                orphans: 0;
                text-align: center;
                widows: 0;
              "
                  >
                    <span style="font-family: 'Times New Roman'; font-size: 14pt">&#xa0;</span>
                  </p>
                </td>
                <td
                  :colspan="cerRank.des5 ? '2' : '3'"
                  v-if="cerRank.des5"
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
              padding-left: 5.03pt;
              padding-right: 5.03pt;
              vertical-align: middle;
              
            "
                  :style="cerRank.des5 ? 'width: 101.09pt;' : 'width: 111.2pt;'"
                >
                  <p style="margin: 0pt; orphans: 0; text-align: center; widows: 0">
                    <span style="font-family: 宋体; font-size: 14pt"></span>
                  </p>
                </td>
              </tr>
              <tr style="height: 7.5pt">
                <td
                  colspan="2"
                  style="
              border-right-color: #000000;
              border-right-style: solid;
              border-right-width: 0.75pt;
              border-top-color: #000000;
              border-top-style: solid;
              border-top-width: 0.75pt;
              padding-left: 5.4pt;
              padding-right: 5.03pt;
              vertical-align: middle;
              width: 141.85pt;
            "
                >
                  <p style="margin: 0pt; orphans: 0; text-align: center; widows: 0">
                    <span style="font-family: 宋体; font-size: 12pt">&#xa0;</span>
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
              padding-left: 5.03pt;
              padding-right: 5.03pt;
              vertical-align: middle;
              width: 70.55pt;
            "
                >
                  <p style="margin: 0pt; orphans: 0; text-align: center; widows: 0">
                    <span style="font-family: 宋体; font-size: 12pt; font-weight: bold">优</span>
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
              padding-left: 5.03pt;
              padding-right: 5.03pt;
              vertical-align: middle;
              width: 79.2pt;
            "
                >
                  <p style="margin: 0pt; orphans: 0; text-align: center; widows: 0">
                    <span style="font-family: 宋体; font-size: 12pt; font-weight: bold">良</span>
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
              padding-left: 5.03pt;
              padding-right: 5.03pt;
              vertical-align: middle;
              width: 79.2pt;
            "
                >
                  <p style="margin: 0pt; orphans: 0; text-align: center; widows: 0">
                    <span style="font-family: 宋体; font-size: 12pt; font-weight: bold">合格</span>
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
              padding-left: 5.03pt;
              padding-right: 5.03pt;
              vertical-align: middle;
              width: 75.55pt;
            "
                >
                  <p style="margin: 0pt; orphans: 0; text-align: center; widows: 0">
                    <span style="font-family: 宋体; font-size: 12pt; font-weight: bold">不合格</span>
                  </p>
                </td>
              </tr>
              <tr style="height: 0pt">
                <td style="width: 62.9pt; border: none"></td>
                <td style="width: 89.75pt; border: none"></td>
                <td style="width: 31.8pt; border: none"></td>
                <td style="width: 49.55pt; border: none"></td>
                <td style="width: 27.7pt; border: none"></td>
                <td style="width: 44.9pt; border: none"></td>
                <td style="width: 17.4pt; border: none"></td>
                <td style="width: 54.35pt; border: none"></td>
                <td style="width: 35.65pt; border: none"></td>
                <td style="width: 16.15pt; border: none"></td>
                <td style="width: 70.2pt; border: none"></td>
              </tr>
            </table>

            <p style="margin: 0pt; orphans: 0; widows: 0">
              <span style="font-family: 宋体; font-size: 14pt">考试官签字：</span>
            </p>
            <p
              style="
          margin: 11pt 5.25pt 0pt 0pt;
          orphans: 0;
          text-align: justify;
          widows: 0;
          font-family: 宋体; font-size: 14pt;
        "
            >
              <span style="padding-left: 80pt;"> </span>
              <span style=" text-decoration: underline"> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
              <span style="padding-left:112px;">年</span>
              <span style="padding-left:50px;">月</span>
              <span style="padding-left:50px;">日</span>
            </p>
            <p
              style="
          margin: 12pt 7pt 0pt 0pt;
          orphans: 0;
          text-align: right;
          widows: 0;
        "
            >
              <span style="font-family: 宋体; font-size: 14pt;line-height:1;">中国舞蹈家协会中国舞考级委员会</span>
            </p>
          </div>
          <p
            v-else
            style="
          margin: 8pt 14pt 8pt 0pt;
          orphans: 0;
          text-align: justify;
          widows: 0;
        "
          >
            <span style="border-bottom: 2px dotted #000; padding-left: 290px;"></span>
            <span style="font-family: 宋体; font-size: 14pt">（裁剪线）</span>
            <span style="border-bottom: 2px dotted #000; padding-left: 260px;"></span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
const rankList = [
  {
    rank: '1-3级',
    des1: '身体直立',
    des2: '节奏、节拍感',
    des3: '身体协调能力',
    des4: '舞蹈情绪'
  },
  {
    rank: '4-6级',
    des1: '软开度',
    des2: '节奏感',
    des3: '协调性',
    des4: '风格',
    des5: '舞蹈情绪'
  },
  {
    rank: '7-10级',
    des1: '开绷直',
    des2: '手的舞姿',
    des3: '韵律',
    des4: '风格',
    des5: '表现力'
  }
]
export default {
  name: 'ChineseDanceChangSha',
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
    return {
      list: [{ type: 'table' }, { type: 'line' }, { type: 'table' }],

      cerRank: rankList[0]
    }
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
  watch: {
    printRecord: {
      handler: function(val) {
        if (val) {
          let cerRank = parseInt(val.cerRank)
          this.cerRank = cerRank < 4 ? rankList[0] : cerRank < 7 ? rankList[1] : rankList[2]
          console.log(666, this.cerRank)
        }
      },
      immediate: true,
      deep: true
    }
  }
}
</script>
<style scoped media="print" lang="less"></style>
