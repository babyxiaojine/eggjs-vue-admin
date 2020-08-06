import store from '@/store/index'

/**
 * @returns {Boolean}
 */
function queryAllShop() {
  // return new Promise((resolve, reject) => {
  //   if (store.getters.userLevel2.length > 0) {
  //     resolve(store.getters.userLevel2)
  //   } else {
  //     store
  //       .dispatch('user/getUserLevel2')
  //       .then(res => {
  //         resolve(res)
  //       })
  //       .catch(() => {
  //         reject()
  //       })
  //   }
  // })
}

export {  
    queryAllShop
}
