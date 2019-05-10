import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text, Image, Swiper, SwiperItem} from '@tarojs/components'
import { AtRate,AtTextarea} from 'taro-ui'
import { getJSON } from '../../utils/request'

import './eval.less'

class Eval extends Component{
	config = {
  		navigationBarTitleText: '评价'
	}

	state = {
		value:2,
		content:''
	}

	componentWillMount(){}

	componentDidMount(){}

	onShareAppMessage(){
  	return{
			title:Taro.getStorageSync('title'),
			imageUrl:Taro.getStorageSync('imageUrl')
		}
  }

	handleChange(value){
		this.setState({
			value
		})
	}

	contentChange(event){
		this.setState({
			content:event.target.value
		})
	}

	onEval(){
		// console.log(0000)
		var _this = this
		var token = Taro.getStorageSync('_token_')
		getJSON(Taro.url.UserComment,{
			id:_this.$router.params.id,
			token:token,
			star:_this.state.value,
			comment:_this.state.content
		}).then((res)=>{
			if(res.data.ret=='200'){
				setTimeout(()=>{
					Taro.redirectTo({
						url:'/pages/repair/list'
					})
				},1000)
			}
		})
	}

	render(){
		return(
			<View>
				<View className='rte-wrap'>
					<AtRate 
						size='20' 
						margin='20'
						value={this.state.value} 
						onChange={this.handleChange} />
						<View className='tit'>服务很到位，给个好评吧</View>
				</View>
				<View className='content'>
					<AtTextarea
		        value={this.state.content}
		        onChange={this.contentChange.bind(this)}
		        maxLength={200}
		        placeholder='写下您对我的评价，是对我们的认可'
		      />
				</View>
				<View className='btn-wrap' onClick={this.onEval.bind(this)}>评价</View>
			</View>
		)
	}

}

export default Eval