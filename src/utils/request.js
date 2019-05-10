import Taro from '@tarojs/taro'

export function getJSON(url,data){
	Taro.showLoading();
	return Taro.request({url:url,data:data,method:'GET'}).then(result => {
		Taro.hideLoading();
		// console.log(result)
		if(result.data.ret != '200'){
			Taro.showToast({
				icon:'none',
				title:result.data.msg,
				duration:1000
			})
			if(result.data.ret == '999'){
				Taro.removeStorageSync('_token_')
				
				Taro.redirectTo({
          url:'/pages/user/user'
        })
			}
		}
		return result;
	})
}

export function postJSON(url,data){
	Taro.showLoading();
	return Taro.request({
		header:{
			'content-type': 'application/json'
		},
		url:url,
		data:data,
		method:'POST'
	}).then(result => {
		Taro.hideLoading();

		if(result.data.ret != '200'){
			Taro.showToast({
				title:result.data.msg,
				duration:1000
			})
			if(result.data.ret == '999'){
				Taro.navigateTo({
          url:'/pages/user/user'
        })
			}
		}
		
		return result;
	})
}

export async function getList(){
	let result = await getJSON(Taro.url.GetTypeList)
	// console.log(0)
	return result
	
}