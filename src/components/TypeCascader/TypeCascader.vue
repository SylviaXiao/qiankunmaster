<template>
    <a-cascader :options="options"
                :showSearch="{filter}"
                @change="change"
                :placeholder="placeholder"
                :fieldNames="fieldNames"
                :value="typevalues"
                changeOnSelect/>
</template>

<script>
  import DISTRICTS from '@/tools/citydata'
  import { listChannelTree } from '@/api/common'

  export default {
    name: 'TypeCascader',
    props: {
      form: {
        type: Object
      },
      dataType: String,
      placeholder: String,
      fieldNames: {
        type: Object,
        default: function() {
          return { label: 'name', value: 'id', children: 'children' }
        }
      },
      vDecorator: {
        type: Array,
        default: () => []
      }

    },
    created() {
      this.setOptions()
    },
    data() {
      return {
        options: [],
        typevalues: null
      }
    },
    methods: {
      setOptions() {
        const { dataType } = this
        if (dataType == 'address') {
          this.options = DISTRICTS
        } else if (dataType == 'channel') {
          listChannelTree().then(res => this.options = res.data)
        } else {
          this.options = []
        }
      },
      change(value) {
        const valueStr = value.join(',')
        this.form.setFieldsValue({ [this.dataType]: valueStr })
        this.typevalues = value
      },
      filter(inputValue, path) {
        return path.some(option => (option.value).indexOf(inputValue) > -1)
      }
    }
  }
</script>

<style scoped>

</style>