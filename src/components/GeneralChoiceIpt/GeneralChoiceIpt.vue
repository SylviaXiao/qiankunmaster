<template>
  <div class="general-choice-input-wrapper">
    <div class="general-choice-input show-disabled" v-if="!multiple">
      <a-input disabled :value="localIptValue">
        <a-icon slot="addonAfter" type="search" v-if="!disabled" @click="openModalByFields()"/>
      </a-input>
      <div class="icon-close" v-if="closable&&!!localIptValue&&!disabled" @click="closeGeneralIpt(inputValues)">
        <a-icon type="close-circle" theme="twoTone" twoToneColor="#d4d4d4"/>
      </div>
    </div>
    <div class="general-choice-multiple" v-else>
      <div class="multiple-input-group-wrapper">
        <span class="multiple-input-group">
          <span class="multiple-tags" ref="tagsGroup">
            <a-tag :closable="closable" :ref="`tags${tagIdx}`"
                   v-for="(tag,tagIdx) in inputValues" :key="tagIdx"
                   @close="closeMultipleTag">{{tag}}</a-tag>
          </span>
        </span>
        <span class="multiple-input-group-addon">
          <a-icon slot="addonAfter" type="search" @click="openModalByFields()"/>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
  const testArr = [
    '啊啊啊',
    '啊啊',
    '333',
    '4444'
  ]
  export default {
    name: 'GeneralChoiceIpt',
    props: {
      //是否开启多选
      multiple: { type: Boolean, default: false },
      inputValues: { type: String | Array, default: '' || [] },
      closable: { type: Boolean, default: false },
      disabled: { type: Boolean, default: false }
    },
    data() {
      return { localIptValue: '' }
    },
    watch: {
      inputValues(nv, ov) {
        this.localIptValue = nv
      }
    },
    created() {
      this.localIptValue = this.inputValues
    },
    methods: {
      /*
      * 方法说明
      * @methods openModalByFields
      * @params {String} fields 根据不同的fields打开modal的类型
      * */
      openModalByFields(fields) {
        this.$emit('search')
      },
      /*
      * 方法说明
      * @methods closeMultipleTag
      * 关闭多选里面的tag的回调
      * */
      closeMultipleTag(e) {
        this.$emit('close', e)
      },
      /*
      * 方法说明
      * @methods closeMultipleTag
      * @params {String} value 关闭时的值
      * */
      closeGeneralIpt(value) {
        this.$emit('close', value)
        this.localIptValue = null
      }

    }


  }
</script>

<style scoped lang=less>
  .general-choice-input-wrapper {
    .general-choice-input {
      position: relative;

      &:hover {
        .icon-close {
          opacity: 1;
        }
      }

      .icon-close {
        opacity: 0;
        transition: opacity ease 0.4s;
        position: absolute;
        right: 45px;
        top: 6px;
        z-index: 1;
        cursor: pointer;
      }

      input {
        color: #000 !important;
        cursor: pointer !important;
      }
    }

    .general-choice-multiple {
      .multiple-input-group-wrapper {
        line-height: 1.5;
        color: rgba(0, 0, 0, 0.65);
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        margin: 0;
        padding: 0;
        list-style: none;
        position: relative;
        display: table;
        border-collapse: separate;
        border-spacing: 0;
        width: 100%;


        .multiple-input-group {
          /*height: 32px;*/
          line-height: 1.5;
          background-image: none;
          border: 1px solid #d9d9d9;
          border-radius: 4px;
          position: relative;
          transition: all 0.3s;
          float: left;
          margin: 0;
          width: 100%;
          margin-bottom: 0;
          padding: 4px 11px;
          display: table-cell;

          &:first-child {
            border-bottom-right-radius: 0;
            border-top-right-radius: 0;
          }

          .multiple-tags {
            width: 100%;
            overflow-y: auto;
            display: flex;
            flex-flow: wrap;

            .ant-tag {
              /*margin-bottom: 5px;*/
            }
          }


        }

        .multiple-input-group-addon {
          display: table-cell;
          box-sizing: border-box;
          padding: 0 11px;
          line-height: 1;
          color: rgba(0, 0, 0, 0.65);
          text-align: center;
          background-color: #fafafa;
          border: 1px solid #d9d9d9;
          border-radius: 4px;
          position: relative;
          -webkit-transition: all 0.3s;
          transition: all 0.3s;
          width: 1px;
          vertical-align: middle;
          border-left: 0;

          &:last-child {
            border-bottom-left-radius: 0;
            border-top-left-radius: 0;
          }
        }
      }


    }
  }

</style>
