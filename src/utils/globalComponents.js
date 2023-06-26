import Modal from '@/components/Modal'
import PermBox from '@/components/PermBox'
import ReportsIframe from '@/components/ReportsIframe/ReportsIframe'
function plugins(Vue) {
  Vue.component('FModal', Modal)
  Vue.component('PermBox', PermBox)
  Vue.component('FFrame', ReportsIframe)
}
export default plugins
