<template>
  <div style="font-size:16px; display:none; ">
    <a-button ref="printBtn" type="primary" v-print="'#printTest'"> 打印 </a-button>
    <div>
      <div
        ref="printTest"
        class="block workFlowTable"
        style="letter-spacing: -1px;color:#000;width: 663px;margin: 0 auto;background-color: #fff;"
        id="printTest"
      >
        <div>
          <img
            src="~@/assets/cert/001.png"
            height="104"
            alt="1"
            style="
          margin-left: 90pt;
          margin-top: 21.15pt;
          position: absolute;
          z-index: 1;
        "
          />
          <p style="margin: 0pt;orphans: 0;text-align: center;widows: 0;padding:20pt 0 10px;">
            <img src="~@/assets/cert/002.png" width="247" height="69" alt="1" style="margin: 9px 0 0;" />
          </p>
          <p style="margin: 0 0 15px 0; orphans: 0; text-align: center; widows: 0;font-family: 黑体;font-weight: 700;letter-spacing: 1pt;">
            <span style="font-size: 16pt;">《中国舞蹈考级》</span>
            <span style="font-size: 15pt;">学生报名表</span>
          </p>
          <p
            style="
          line-height: 20pt;
          margin: 0pt;
          orphans: 0;
          text-align: justify;
          widows: 0;
        "
          >
            <span style="font-family: 楷体; font-size: 12pt; letter-spacing: 1pt">考级机构全称：</span
            ><span style="font-family: 楷体; font-size: 14pt; letter-spacing: 1pt"> </span>
          </p>
          <p
            style="
          line-height: 20pt;
          margin: 0pt;
          orphans: 0;
          text-align: justify;
          widows: 0;
        "
          >
            <span style="font-family: 楷体; font-size: 12pt">授课教师：          教师注册号：             资格证书编号：</span
            ><span style="font-family: 楷体; font-size: 14pt; font-weight: 700"> </span
            ><span style="font-family: 楷体; font-size: 14pt; font-weight: 700"> </span>
          </p>
          <div style="text-align: center">
            <table cellspacing="0" cellpadding="0" style="border-collapse: collapse; margin: 0 auto">
              <tr style="height: 31.2pt">
                <td
                  colspan="8"
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
                width: 180.1pt;
              "
                >
                  <p
                    style="
                  font-size: 12pt;
                  line-height: 200%;
                  margin: 0pt;
                  orphans: 0;
                  text-align: justify;
                  widows: 0;
                "
                  >
                    <span style="font-family: 楷体; font-size: 10.5pt">※</span
                    ><span style="font-family: 楷体; font-size: 12pt">姓名：{{ printRecord.cerName }}</span>
                  </p>
                </td>
                <td
                  colspan="13"
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
                width: 192.4pt;
              "
                >
                  <p
                    style="
                  font-size: 12pt;
                  line-height: 200%;
                  margin: 0pt;
                  orphans: 0;
                  text-align: justify;
                  widows: 0;
                "
                  >
                    <span style="font-family: 楷体; font-size: 10.5pt">※</span
                    ><span style="font-family: 楷体; font-size: 12pt">姓名拼音：{{ printRecord.pinYing }}</span>
                  </p>
                </td>
                <td
                  rowspan="5"
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
                width: 92.05pt;
              "
                >
                  <img v-if="photoImg" :src="photoImg" alt="1" style="max-width: 92.05pt;" />
                  <span v-else>
                    <p
                      style="
                  font-size: 10.5pt;
                  line-height: 293%;
                  margin: 0pt;
                  orphans: 0;
                  text-align: justify;
                  widows: 0;letter-spacing: 1px;
                "
                    >
                      <span style="font-family: 楷体; font-size: 10.5pt">另外一张照片分级别装进信封袋,便于证书的制作。</span>
                    </p>
                    <p
                      style="
                  font-size: 10.5pt;
                  line-height: 200%;
                  margin: 0pt;
                  orphans: 0;
                  text-align: justify;
                  text-indent: 5.25pt;
                  widows: 0;
                "
                    >
                      <span style="font-family: 楷体; font-size: 10.5pt">（二寸彩照）</span>
                    </p>
                  </span>
                </td>
              </tr>
              <tr style="height: 18.75pt">
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
                padding-left: 5.03pt;
                padding-right: 5.03pt;
                vertical-align: middle;
                width: 80.1pt;
              "
                >
                  <p
                    style="
                  font-size: 12pt;
                  line-height: 200%;
                  margin: 0pt;
                  orphans: 0;
                  text-align: justify;
                  widows: 0;
                "
                  >
                    <span style="font-family: 楷体; font-size: 10.5pt">※</span
                    ><span style="font-family: 楷体; font-size: 12pt">民族：{{ printRecord.cerEthnic }}</span>
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
                padding-left: 5.03pt;
                padding-right: 5.03pt;
                vertical-align: middle;
                width: 89.2pt;
              "
                >
                  <p
                    style="
                  font-size: 12pt;
                  line-height: 200%;
                  margin: 0pt;
                  orphans: 0;
                  text-align: justify;
                  widows: 0;
                "
                  >
                    <span style="font-family: 楷体; font-size: 10.5pt">※</span><span style="font-family: 楷体; font-size: 12pt">出生年月日</span>
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
                padding-left: 5.03pt;
                padding-right: 5.03pt;
                vertical-align: middle;
                width: 56.7pt;
              "
                >
                  <p style="margin: 0pt; orphans: 0; text-align: center; widows: 0">
                    <span style="font-family: 楷体; font-size: 12pt">年</span>
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
                width: 23pt;
              "
                >
                  <p style="margin: 0pt; orphans: 0; text-align: center; widows: 0">
                    <span style="font-family: 楷体; font-size: 12pt">月</span>
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
                width: 23.3pt;
              "
                >
                  <p style="margin: 0pt; orphans: 0; text-align: center; widows: 0">
                    <span style="font-family: 楷体; font-size: 12pt">日</span>
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
                padding-left: 5.03pt;
                padding-right: 5.03pt;
                vertical-align: middle;
                width: 57pt;
              "
                >
                  <p
                    style="
                  font-size: 12pt;
                  line-height: 200%;
                  margin: 0pt;
                  orphans: 0;
                  text-align: justify;
                  widows: 0;
                "
                  >
                    <span style="font-family: 楷体; font-size: 10.5pt">※</span
                    ><span style="font-family: 楷体; font-size: 12pt">性别：{{ printRecord.cerSex == 'A' ? '男' : '女' }}</span>
                  </p>
                </td>
              </tr>
              <tr style="height: 17.65pt">
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
                width: 6.1pt;
              "
                >
                  <p style="margin: 0pt; orphans: 0; text-align: justify; widows: 0">
                    <span style="font-family: 楷体; font-size: 12pt">{{ printRecord.birthday[0] }}</span>
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
                width: 5.9pt;
              "
                >
                  <p style="margin: 0pt; orphans: 0; text-align: justify; widows: 0">
                    <span style="font-family: 楷体; font-size: 12pt">{{ printRecord.birthday[1] }}</span>
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
                width: 6.1pt;
              "
                >
                  <p style="margin: 0pt; orphans: 0; text-align: justify; widows: 0">
                    <span style="font-family: 楷体; font-size: 12pt">{{ printRecord.birthday[2] }}</span>
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
                width: 6.2pt;
              "
                >
                  <p style="margin: 0pt; orphans: 0; text-align: justify; widows: 0">
                    <span style="font-family: 楷体; font-size: 12pt">{{ printRecord.birthday[3] }}</span>
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
                width: 6.1pt;
              "
                >
                  <p style="margin: 0pt; orphans: 0; text-align: justify; widows: 0">
                    <span style="font-family: 楷体; font-size: 12pt">{{ printRecord.birthday[5] }}</span>
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
                width: 6.1pt;
              "
                >
                  <p style="margin: 0pt; orphans: 0; text-align: justify; widows: 0">
                    <span style="font-family: 楷体; font-size: 12pt">{{ printRecord.birthday[6] }}</span>
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
                width: 6.1pt;
              "
                >
                  <p style="margin: 0pt; orphans: 0; text-align: justify; widows: 0">
                    <span style="font-family: 楷体; font-size: 12pt">{{ printRecord.birthday[8] }}</span>
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
                width: 6.4pt;
              "
                >
                  <p style="margin: 0pt; orphans: 0; text-align: justify; widows: 0">
                    <span style="font-family: 楷体; font-size: 12pt">{{ printRecord.birthday[9] }}</span>
                  </p>
                </td>
              </tr>
              <tr style="height: 36.85pt">
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
                width: 80.1pt;
              "
                >
                  <p
                    style="
                  font-size: 12pt;
                  line-height: 200%;
                  margin: 0pt;
                  orphans: 0;
                  text-align: justify;
                  widows: 0;
                "
                  >
                    <span style="font-family: 楷体; font-size: 10.5pt">※</span><span style="font-family: 楷体; font-size: 12pt">身份证号码</span>
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
                width: 5.7pt;
              "
                >
                  <p
                    style="
                  font-size: 10.5pt;
                  line-height: 200%;
                  margin: 0pt;
                  orphans: 0;
                  text-align: justify;
                  widows: 0;
                "
                  >
                    <span style="font-family: 楷体; font-size: 10.5pt">{{ printRecord.cerIdCard[0] || '' }}</span>
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
                width: 5.9pt;
              "
                >
                  <p
                    style="
                  font-size: 10.5pt;
                  line-height: 200%;
                  margin: 0pt;
                  orphans: 0;
                  text-align: justify;
                  widows: 0;
                "
                  >
                    <span style="font-family: 楷体; font-size: 10.5pt">{{ printRecord.cerIdCard[1] || '' }}</span>
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
                width: 5.9pt;
              "
                >
                  <p
                    style="
                  font-size: 10.5pt;
                  line-height: 200%;
                  margin: 0pt;
                  orphans: 0;
                  text-align: justify;
                  widows: 0;
                "
                  >
                    <span style="font-family: 楷体; font-size: 10.5pt">{{ printRecord.cerIdCard[2] || '' }}</span>
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
                width: 5.9pt;
              "
                >
                  <p
                    style="
                  font-size: 10.5pt;
                  line-height: 200%;
                  margin: 0pt;
                  orphans: 0;
                  text-align: justify;
                  widows: 0;
                "
                  >
                    <span style="font-family: 楷体; font-size: 10.5pt">{{ printRecord.cerIdCard[3] || '' }}</span>
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
                width: 5.9pt;
              "
                >
                  <p
                    style="
                  font-size: 10.5pt;
                  line-height: 200%;
                  margin: 0pt;
                  orphans: 0;
                  text-align: justify;
                  widows: 0;
                "
                  >
                    <span style="font-family: 楷体; font-size: 10.5pt">{{ printRecord.cerIdCard[4] || '' }}</span>
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
                width: 5.9pt;
              "
                >
                  <p
                    style="
                  font-size: 10.5pt;
                  line-height: 200%;
                  margin: 0pt;
                  orphans: 0;
                  text-align: justify;
                  widows: 0;
                "
                  >
                    <span style="font-family: 楷体; font-size: 10.5pt">{{ printRecord.cerIdCard[5] || '' }}</span>
                  </p>
                </td>
                <td
                  style="
                background-color: #d7d7d7;
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
                width: 6.1pt;
                -webkit-print-color-adjust:exact;
-moz-print-color-adjust:exact;
-ms-print-color-adjust:exact;
print-color-adjust:exact;
              "
                >
                  <p
                    style="
                  font-size: 10.5pt;
                  line-height: 200%;
                  margin: 0pt;
                  orphans: 0;
                  text-align: justify;
                  widows: 0;
                "
                  >
                    <span style="font-family: 楷体; font-size: 10.5pt">{{ printRecord.cerIdCard[6] || '' }}</span>
                  </p>
                </td>
                <td
                  style="-webkit-print-color-adjust:exact;
-moz-print-color-adjust:exact;
-ms-print-color-adjust:exact;
print-color-adjust:exact;
                background-color: #d7d7d7;
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
                width: 5.9pt;
              "
                >
                  <p
                    style="
                  font-size: 10.5pt;
                  line-height: 200%;
                  margin: 0pt;
                  orphans: 0;
                  text-align: justify;
                  widows: 0;
                "
                  >
                    <span style="font-family: 楷体; font-size: 10.5pt">{{ printRecord.cerIdCard[7] || '' }}</span>
                  </p>
                </td>
                <td
                  style="-webkit-print-color-adjust:exact;
-moz-print-color-adjust:exact;
-ms-print-color-adjust:exact;
print-color-adjust:exact;
                background-color: #d7d7d7;
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
                width: 6.1pt;
              "
                >
                  <p
                    style="
                  font-size: 10.5pt;
                  line-height: 200%;
                  margin: 0pt;
                  orphans: 0;
                  text-align: justify;
                  widows: 0;
                "
                  >
                    <span style="font-family: 楷体; font-size: 10.5pt">{{ printRecord.cerIdCard[8] || '' }}</span>
                  </p>
                </td>
                <td
                  style="-webkit-print-color-adjust:exact;
-moz-print-color-adjust:exact;
-ms-print-color-adjust:exact;
print-color-adjust:exact;
                background-color: #d7d7d7;
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
                width: 6.2pt;
              "
                >
                  <p
                    style="
                  font-size: 10.5pt;
                  line-height: 200%;
                  margin: 0pt;
                  orphans: 0;
                  text-align: justify;
                  widows: 0;
                "
                  >
                    <span style="font-family: 楷体; font-size: 10.5pt">{{ printRecord.cerIdCard[9] || '' }}</span>
                  </p>
                </td>
                <td
                  style="-webkit-print-color-adjust:exact;
-moz-print-color-adjust:exact;
-ms-print-color-adjust:exact;
print-color-adjust:exact;
                background-color: #d7d7d7;
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
                width: 6.1pt;
              "
                >
                  <p
                    style="
                  font-size: 10.5pt;
                  line-height: 200%;
                  margin: 0pt;
                  orphans: 0;
                  text-align: justify;
                  widows: 0;
                "
                  >
                    <span style="font-family: 楷体; font-size: 10.5pt">{{ printRecord.cerIdCard[10] || '' }}</span>
                  </p>
                </td>
                <td
                  style="-webkit-print-color-adjust:exact;
-moz-print-color-adjust:exact;
-ms-print-color-adjust:exact;
print-color-adjust:exact;
                background-color: #d7d7d7;
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
                width: 6.1pt;
              "
                >
                  <p
                    style="
                  font-size: 10.5pt;
                  line-height: 200%;
                  margin: 0pt;
                  orphans: 0;
                  text-align: justify;
                  widows: 0;
                "
                  >
                    <span style="font-family: 楷体; font-size: 10.5pt">{{ printRecord.cerIdCard[11] || '' }}</span>
                  </p>
                </td>
                <td
                  colspan="2"
                  style="-webkit-print-color-adjust:exact;
-moz-print-color-adjust:exact;
-ms-print-color-adjust:exact;
print-color-adjust:exact;
                background-color: #d7d7d7;
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
                width: 6.1pt;
              "
                >
                  <p
                    style="
                  font-size: 10.5pt;
                  line-height: 200%;
                  margin: 0pt;
                  orphans: 0;
                  text-align: justify;
                  widows: 0;
                "
                  >
                    <span style="font-family: 楷体; font-size: 10.5pt">{{ printRecord.cerIdCard[12] || '' }}</span>
                  </p>
                </td>
                <td
                  style="-webkit-print-color-adjust:exact;
-moz-print-color-adjust:exact;
-ms-print-color-adjust:exact;
print-color-adjust:exact;
                background-color: #d7d7d7;
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
                width: 6.4pt;
              "
                >
                  <p
                    style="
                  font-size: 10.5pt;
                  line-height: 200%;
                  margin: 0pt;
                  orphans: 0;
                  text-align: justify;
                  widows: 0;
                "
                  >
                    <span style="font-family: 楷体; font-size: 10.5pt">{{ printRecord.cerIdCard[13] || '' }}</span>
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
                width: 5.9pt;
              "
                >
                  <p
                    style="
                  font-size: 10.5pt;
                  line-height: 200%;
                  margin: 0pt;
                  orphans: 0;
                  text-align: justify;
                  widows: 0;
                "
                  >
                    <span style="font-family: 楷体; font-size: 10.5pt">{{ printRecord.cerIdCard[14] || '' }}</span>
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
                width: 5.9pt;
              "
                >
                  <p
                    style="
                  font-size: 10.5pt;
                  line-height: 200%;
                  margin: 0pt;
                  orphans: 0;
                  text-align: justify;
                  widows: 0;
                "
                  >
                    <span style="font-family: 楷体; font-size: 10.5pt">{{ printRecord.cerIdCard[15] || '' }}</span>
                  </p>
                </td>
                <td
                  style="-webkit-print-color-adjust:exact;
-moz-print-color-adjust:exact;
-ms-print-color-adjust:exact;
print-color-adjust:exact;
                background-color: #d7d7d7;
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
                width: 5.9pt;
              "
                >
                  <p
                    style="
                  font-size: 10.5pt;
                  line-height: 200%;
                  margin: 0pt;
                  orphans: 0;
                  text-align: justify;
                  widows: 0;
                "
                  >
                    <span style="font-family: 楷体; font-size: 10.5pt">{{ printRecord.cerIdCard[16] || '' }}</span>
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
                width: 6.9pt;
              "
                >
                  <p
                    style="
                  font-size: 10.5pt;
                  line-height: 200%;
                  margin: 0pt;
                  orphans: 0;
                  text-align: justify;
                  widows: 0;
                "
                  >
                    <span style="font-family: 楷体; font-size: 10.5pt">{{ printRecord.cerIdCard[17] || '' }}</span>
                  </p>
                </td>
              </tr>
              <tr style="height: 36.85pt">
                <td
                  colspan="8"
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
                width: 180.1pt;
              "
                >
                  <p
                    style="
                  font-size: 12pt;
                  line-height: 200%;
                  margin: 0pt;
                  orphans: 0;
                  text-align: justify;
                  widows: 0;
                "
                  >
                    <span style="font-family: 楷体; font-size: 10.5pt">※</span
                    ><span style="font-family: 楷体; font-size: 12pt">已通过级别：{{ printRecord.cerCertificate }}</span>
                  </p>
                </td>
                <td
                  colspan="13"
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
                width: 192.4pt;
              "
                >
                  <p
                    style="
                  font-size: 12pt;
                  line-height: 200%;
                  margin: 0pt;
                  orphans: 0;
                  text-align: justify;
                  widows: 0;
                "
                  >
                    <span style="font-family: 楷体; font-size: 10.5pt">※</span
                    ><span style="font-family: 楷体; font-size: 12pt">报考级别：{{ printRecord.cerRank }}</span>
                  </p>
                </td>
              </tr>
              <tr style="height: 36.85pt">
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
                padding-left: 5.03pt;
                padding-right: 5.03pt;
                vertical-align: top;
                width: 178.7pt;
              "
                >
                  <p
                    style="
                  font-size: 12pt;
                  line-height: 36.85pt;
                  margin: 0pt;
                  orphans: 0;
                  widows: 0;
                  text-align:left;
                "
                  >
                    <span style="font-family: 楷体; font-size: 12pt">授课教师</span><span style="font-family: 楷体; font-size: 12pt">电话：</span>
                  </p>
                </td>
                <td
                  colspan="8"
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
                width: 98.75pt;
              "
                >
                  <p
                    style="
                  font-size: 12pt;
                  line-height: 36.85pt;
                  margin: 0pt;
                  orphans: 0;
                  widows: 0;
                  text-align:left;
                "
                  >
                    <span style="font-family: 楷体; font-size: 12pt">成绩：</span>
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
                padding-left: 5.03pt;
                padding-right: 5.03pt;
                vertical-align: top;
                width: 187.1pt;
              "
                >
                  <p
                    style="
                  font-size: 12pt;
                  line-height: 36.85pt;
                  margin: 0pt;
                  orphans: 0;
                  widows: 0;
                  text-align:left;
                "
                  >
                    <span style="font-family: 楷体; font-size: 12pt">考官签名：</span>
                  </p>
                </td>
              </tr>
              <tr style="height: 0pt">
                <td style="width: 90.9pt; border: none"></td>
                <td style="width: 16.5pt; border: none"></td>
                <td style="width: 16.7pt; border: none"></td>
                <td style="width: 16.7pt; border: none"></td>
                <td style="width: 16.7pt; border: none"></td>
                <td style="width: 16.7pt; border: none"></td>
                <td style="width: 15.3pt; border: none"></td>
                <td style="width: 1.4pt; border: none"></td>
                <td style="width: 16.9pt; border: none"></td>
                <td style="width: 16.7pt; border: none"></td>
                <td style="width: 16.9pt; border: none"></td>
                <td style="width: 17pt; border: none"></td>
                <td style="width: 16.9pt; border: none"></td>
                <td style="width: 16.9pt; border: none"></td>
                <td style="width: 6.85pt; border: none"></td>
                <td style="width: 10.05pt; border: none"></td>
                <td style="width: 17.2pt; border: none"></td>
                <td style="width: 16.7pt; border: none"></td>
                <td style="width: 16.7pt; border: none"></td>
                <td style="width: 16.7pt; border: none"></td>
                <td style="width: 17.7pt; border: none"></td>
                <td style="width: 102.85pt; border: none"></td>
              </tr>
            </table>
          </div>
          <p style="margin: 0pt; orphans: 0; text-align: justify; widows: 0">
            <span style="color: #ff0000; font-family: 楷体; font-size: 12pt">填写须知：</span>
          </p>

          <div style="margin: 0pt; orphans: 0; text-align: justify; widows: 0; font-family: 楷体; font-size: 12pt ;  text-indent: 1em;">
            <p style="margin: 0pt;">
              1、※为必填项。
            </p>
            <p style="margin: 0pt;">
              2、报名表由家长填写，请用正楷字填写，作为制作证书的依据。
            </p>
            <p style="margin: 0pt;">
              3、请考生准备两张二寸彩照，户口复印件。
            </p>
          </div>
          <div style="position:relative;margin: 10px 0 0 0;color: #a4a4a4; font-family: 宋体; font-size: 20pt;letter-spacing: 0px;height:380pt">
            <!-- <img v-if="bookImg" :src="bookImg" alt="1" style="height: 184pt;position:absolute;top:2px;left:50%;transform:translate(-50%,0);" />
            <img v-if="cerImg" :src="cerImg" alt="1" style="height: 184pt;position:absolute;top:190pt;left:50%;transform:translate(-50%,0);" />
            <p style="margin: 48pt 0 0 0; orphans: 0; text-align: center; widows: 0">
              <span style="font-family: 'Times New Roman';">1</span><span>、</span><span>户口复印件粘贴处</span>
            </p>
            <p style="margin: 0pt; orphans: 0; widows: 0">
              <span>（请将考生户口复印件或身份证复印件裁剪到合适大小粘贴到此处）</span>
            </p>
            <p style="margin: 0pt; orphans: 0; widows: 0">
              <span>&#xa0;</span>
            </p>
            <p style="margin: 0pt; orphans: 0; text-indent: 21pt; widows: 0">
              <span style="font-family: 'Times New Roman';">&#xa0;</span>
            </p>
            <p style="margin: 0pt; orphans: 0; text-indent: 21pt; widows: 0">
              <span
                style="
            color: #a4a4a4;
            font-family: 'Times New Roman';
            font-size: 20pt;
          "
                >&#xa0;</span
              >
            </p>
            <p style="margin: 0pt; orphans: 0;  widows: 0;text-align:center;">
              <span> </span><span style="font-family: 'Times New Roman';">2</span><span>、已通过级别证书粘贴处</span>
            </p>
            <p style="margin: 0pt; orphans: 0; widows: 0">
              <span>（请报考</span><span style=" font-family: 'Times New Roman';">2-10</span><span>级的考生，将前一级别证书复印件粘贴在报名表反面）</span>
            </p>
            <p style="margin: 0pt; orphans: 0; widows: 0">
              <span style="font-family: 'Times New Roman';">&#xa0;</span>
            </p>
            <p style="margin: 0pt; orphans: 0; text-align: justify; widows: 0">
              <span style="font-family: 'Times New Roman'; font-size: 12pt">&#xa0;</span>
            </p> -->
          </div>

          <div style="border:1px dotted #000;margin:0pt 0 0 0;padding: 10pt;color: #a4a4a4; font-family: 宋体; font-size: 20pt;letter-spacing: 0px;">
            <p style="margin:14pt 0 0 0; orphans: 0; text-align: left;">
              <span>1、户口或身份证</span>
            </p>
            <div style="height:234pt;position:relative;">
              <img
                v-if="bookImg"
                :src="bookImg"
                alt="1"
                style="max-width:100%;max-height:230pt;position:absolute;top:5pt;left:50%;transform:translate(-50%,0);"
              />
            </div>
            <p style="margin: 24pt 0 0 0; orphans: 0; text-align: left;">
              <span>1、上一级级别证书粘粘处</span>
            </p>
            <div style="height:365pt;width:100%;position:relative;">
              <img
                v-if="cerImg"
                :src="cerImg"
                alt="1"
                style="max-height: 361pt;max-width:100%;position:absolute;top:5pt;left:50%;transform:translate(-50%,0);"
              />
            </div>
          </div>
        </div>
        <div></div>
      </div>
    </div>
  </div>
</template>
<script>
import { previewFile } from '@/api/file'
export default {
  name: 'ChineseDance',
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
      bookImg: '',
      photoImg: '',
      cerImg: ''
    }
  },
  components: {},

  created() {},

  computed: {},
  methods: {
    print() {
      let { bookList, photoList, cerList } = this.printRecord
      this.getImg(bookList).then(res => {
        if (res) {
          this.bookImg = res
        } else {
          this.bookImg = ''
        }
        this.getImg(photoList).then(res => {
          if (res) {
            this.photoImg = res
          } else {
            this.photoImg = ''
          }
          this.getImg(cerList).then(res => {
            if (res) {
              this.cerImg = res
            } else {
              this.cerImg = ''
            }
            this.$refs.printBtn.$el.click()
          })
        })
      })
    },
    getImg(list) {
      return new Promise(async (resolve, reject) => {
        if (Array.isArray(list) && list.length > 0) {
          let url = await this.initImage(list[0].id)
          resolve(url)
        } else {
          resolve('')
        }
      })
    },
    initImage(fileId) {
      return previewFile({ fileId }).then(res => {
        if (res.code == 200) {
          return Promise.resolve(res.data)
        }
      })
    }
  },
  watch: {}
}
</script>
<style scoped media="print" lang="less"></style>
