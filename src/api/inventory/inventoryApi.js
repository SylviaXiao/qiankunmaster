import { axios } from '@/utils/request'
import QS from 'qs'

const api = {
  pageGoods:'/store/goods/pageGoods', //查询列表
  pageGoodsLog:'/store/goods/pageGoodsLog', //查看出入库记录
  removeGoods:'/store/goods/removeGoods', //删除
  saveGoods:'/store/goods/saveGoods', //保存
  changeStoGoods:'/store/goods/changeStoGoods', //启用禁用

  getStoreLog:'/store/info/getStoreLog', //查看出入库详情
  pageStore:'/store/info/pageStore', //查询列表
  pageStoreLog:'/store/info/pageStoreLog', //查看出入库记录
  removeStore:'/store/info/removeStore', //删除
  saveStore:'/store/info/saveStore', //保存

  listStore:'/store/common/listStore', // 查询仓库
  pageInventory:'/store/inventory/pageInventory', //库存列表
  listGoodsTypeCo:'/store/common/listGoodsType', //查询类型
  pageStoreGoods:'/store/common/pageStoreGoods', //查询物品通用接口

  getStoGoodsType:"/store/goodstype/getStoGoodsType", //查询物品类型详情
  listGoodsType:"/store/goodstype/listGoodsType", //查询库存分页列表
  saveGoodsType:"/store/goodstype/saveGoodsType", //保存物品类型
  removeGoodsType:"/store/goodstype/removeGoodsType", //删除物品类型
  saveInventory:'/store/inventory/saveInventory', //入库保存
  pageStoreGoodsLog:'/store/inventory/pageStoreLog', //库存记录
  consumingGoods:'/store/inventory/consumingGoods'//出库保存
}



  //get
  export function pageGoods(params) {
    return axios({
      url: api.pageGoods,
      method: 'get',
      params: params
    })
  }

  //get
  export function pageGoodsLog(params) {
    return axios({
      url: api.pageGoodsLog,
      method: 'get',
      params: params
    })
  }

  // delete
  export function removeGoods(params) {
    return axios({
      url: `${api.removeGoods}/${params}`,
      method: 'delete'
    })
  }

  //post
  export function saveGoods(params) {
    return axios({
      url: api.saveGoods,
      method: 'post',
      data: QS.stringify(params)
    })
  }

  //post
  export function changeStoGoods(params) {
    return axios({
      url: api.changeStoGoods,
      method: 'post',
      data: QS.stringify(params)
    })
  }





  //get
  export function getStoreLog(params) {
    return axios({
      url: api.getStoreLog,
      method: 'get',
      params: params
    })
  }

  //get
  export function pageStore(params) {
    return axios({
      url: api.pageStore,
      method: 'get',
      params: params
    })
  }

  //get
  export function pageStoreLog(params) {
    return axios({
      url: api.pageStoreLog,
      method: 'get',
      params: params
    })
  }

  // delete
  export function removeStore(params) {
    return axios({
      url: `${api.removeStore}/${params}`,
      method: 'delete'
    })
  }

  //post
  export function saveStore(params) {
    return axios({
      url: api.saveStore,
      method: 'post',
      data: QS.stringify(params)
    })
  }




  //get
  export function pageInventory(params) {
    return axios({
      url: api.pageInventory,
      method: 'get',
      params: params
    })
  }

  //get
  export function listStore(params) {
    return axios({
      url: api.listStore,
      method: 'get',
      params: params
    })
  }
  //get
  export function listGoodsTypeCo(params) {
    return axios({
      url: api.listGoodsTypeCo,
      method: 'get',
      params: params
    })
  }
  //get
  export function pageStoreGoods(params) {
    return axios({
      url: api.pageStoreGoods,
      method: 'get',
      params: params
    })
  }





  //get
  export function getStoGoodsType(params) {
    return axios({
      url: api.getStoGoodsType,
      method: 'get',
      params: params
    })
  }

  //get
  export function listGoodsType(params) {
    return axios({
      url: api.listGoodsType,
      method: 'get',
      params: params
    })
  }

  //post
  export function saveGoodsType(params) {
    return axios({
      url: api.saveGoodsType,
      method: 'post',
      data: QS.stringify(params)
    })
  }

  // delete
  export function removeGoodsType(params) {
    return axios({
      url: `${api.removeGoodsType}/${params}`,
      method: 'delete'
    })
  }

  //post
  export function saveInventory(params) {
    return axios({
      url: api.saveInventory,
      method: 'post',
      data: QS.stringify(params)
    })
  }

  //get
  export function pageStoreGoodsLog(params) {
    return axios({
      url: api.pageStoreGoodsLog,
      method: 'get',
      params: params
    })
  }

  //post
  export function consumingGoods(params) {
    return axios({
      url: api.consumingGoods,
      method: 'post',
      data: QS.stringify(params)
    })
  }
