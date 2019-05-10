import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text, Image, Swiper, SwiperItem} from '@tarojs/components'
import { AtCurtain,AtRate} from 'taro-ui'
import { getJSON } from '../../utils/request'

import './detail.less'

class Detail extends Component {
	config = {
  	navigationBarTitleText: '详情'
	}

	state = {
		data:{},
		bgColor:'',
		orderId:'',
		isOpened:false,
		currentIndex:0,
		padBottom:'',
		evalMargin:''
	}

	componentWillMount(){
		/*console.log(0)
		console.log(this.$router.params)*/
		this.setState({
			orderId:this.$router.params.id
		})
		this.getInfo(this.$router.params.id)
	}

	componentDidMount(){
		/*await setTimeout(()=>{
			this.changebgColor()
		},200)*/
	}

	componentWillUnmount(){
	}

	componentDidShow(){

	}

	componentDidHide(){}

	onShareAppMessage(){
  	return{
			title:Taro.getStorageSync('title'),
			imageUrl:Taro.getStorageSync('imageUrl')
		}
  }

	//控制背景颜色
	changebgColor(){
		var _this = this
		if(_this.state.data.status == 1){
			_this.setState({
				bgColor:'missbg'
			})
		}else if(_this.state.data.status == 2){
			_this.setState({
				bgColor:'clockbg'
			})
		}else if(_this.state.data.status == 3){
			_this.setState({
				bgColor:'completedbg'
			})
		}
	}

	//控制tel-wrap是否需要padding-bottom
	paddingBot(){
		if(this.state.data.status == 3 && this.state.data.star !=0){
			this.setState({
				padBottom:'padbottom',
				evalMargin:'evalmargin'
			})
		}
	}

	//用户获取报修详情
	getInfo(id){
		var _this = this
		var token = Taro.getStorageSync('_token_')

		getJSON(Taro.url.UserGetInfoById,{
			id:id,
			token:token
		}).then(res=>{
			if(res.data.ret=='200'){
				// console.log(res.data.data.worker_all_tel)
				let data = res.data.data
				_this.setState({
					data:data
				})
				setTimeout(()=>{
					_this.changebgColor()
					_this.paddingBot()
				},200)
				
			}
		})
	}

	tellPhone(phoneNum){
		Taro.makePhoneCall({
			phoneNumber:phoneNum
		})
	}

	onClose(){
		this.setState({
			isOpened: false
		})
	}

	handleChange(index){
		// console.log(9)
		this.setState({
			currentIndex:index
		})
		this.setState({
			isOpened: true
		})
	}

	//取消报修
	cancelOrder(){
		var _this = this
		var token = Taro.getStorageSync('_token_')
		
		getJSON(Taro.url.UserCancelOrder,{
			id:_this.$router.params.id,
			token:token
		}).then(res=>{
			if(res.data.ret=='200'){
				Taro.showToast({
					icon:'none',
					title:'取消成功',
					duration:1000
				})
				setTimeout(()=>{
					Taro.redirectTo({
						url:'/pages/repair/list'
					})
				},500)
			}
		})
	}

	goEval(){
		//去评价
		// console.log(0)
		Taro.navigateTo({
			url:'/pages/repair/eval?id='+this.$router.params.id
		})
	}

	render(){
		return(
			<View className='detail-wrap'>
				
				<View className={'tit-wrap clearfix'+' '+this.state.bgColor}>
					<View className='left fl'>
						<Image className='img' src={require('../../assets/repear/images/detail-left.png')}/>
						<Text className='desc'>维修编号</Text>
						<Text className='num ellipsis'>{this.state.data.order_no}</Text>
					</View>
					<View className='right fr'>
						{
							this.state.data.status == 1 ? 
							<Image className='img' src={require('../../assets/repear/images/miss.png')}/>
							: ''
						}
						{
							this.state.data.status == 1 ? 
							<Text className='status misorder'>未接单</Text>
							: ''
						}
						{
							this.state.data.status == 2 ?
							<Image className='img' src={require('../../assets/repear/images/clock.png')}/>
							: ''
						}
						{
							this.state.data.status == 2 ?
							<Text className='status handel'>正处理</Text>
							: ''
						}
						{
							this.state.data.status == 3 ?
							<Image className='img' src={require('../../assets/repear/images/gou2.png')}/>
							: ''
						}
						{
							this.state.data.status == 3 ?
							<Text className='status completed'>已处理</Text>
							: ''
						}	
					</View>
				</View>

				<View className='content'>
					<View className='item'>
						<Text className='left'>故障描述</Text>
						<Text className='right'>{this.state.data.desc}</Text>
					</View>
					<View className='item'>
						<Text className='left'>故障类型</Text>
						<Text className='right sta'>{this.state.data.type}</Text>
					</View>
					<View className='item'>
						<Text className='left'>下单时间</Text>
						<Text className='right'>{this.state.data.create_time}</Text>
					</View>
					<View className='item'>
						{
							this.state.data.thumb.length != 0 ?
							<Text className='left'>故障图片</Text>
							: ''
						}
						<View className='right'>
							{
								this.state.data.thumb.map((item,index)=>{
									return (
										<Image onClick={this.handleChange.bind(this,index)} className='img' src={item} key={index}/>
									)
								})
								
							}

							
							<AtCurtain 
								isOpened={this.state.isOpened}
								onClose = {this.onClose.bind(this)}>
								<Swiper
									className='swiper-wrap'
									indicatorColor='#999'
									indicatorActiveColor='#333'
									circular
									indicatorDots
									current={this.state.currentIndex}>
									{
										this.state.data.thumb.map((item,index)=>{
											return (
												<SwiperItem key={index}>
													 <Image className='pic' src={item}/>
												</SwiperItem>
											)
										})
									}

								</Swiper>
							</AtCurtain>
		

						</View>
					</View>
				</View>

				{
					this.state.data.status != 1 ?
					<View className='fuwu'>
						<View className='clearfix'>
							<Text className='tit fl'>服务人员</Text>
							{
								this.state.data.status == 3 && this.state.data.star != 0? 
								<View className='fr fr-wrap'>
									<Text className='pjtext'>本单评价</Text>
									<AtRate size='10' value={this.state.data.star} />
								</View>
								: ''
							}
						</View>
						<View className={'tel-wrap clearfix' + ' '+padBottom} >
							<View className='left fl'>
								<Image className='tel' src={require('../../assets/repear/images/phone.png')}/>
							</View>
							<View className='center fl'>
								<View className='headpic'>
									{
										this.state.data.worker_thumb != '' ?
										<Image className='telpic' src={this.state.data.worker_thumb}/>
										:
										<Image className='telpic' src={require('../../assets/repear/images/wxg.jpg')}/>
									}
								</View>
								<Text className='name ellipsis'>{this.state.data.worker_name}</Text>
								<Text className='tel'>{this.state.data.worker_tel}</Text>
							</View>
							{
								this.state.data.status != 1 ?
								<View 
									className='right fr lan'
									onClick={this.tellPhone.bind(this,this.state.data.worker_all_tel)}>联系TA</View>
								: ''
							}
							{
								this.state.data.status == 3 && this.state.data.star != 0?
								<View className='eval-wrap'>
									<View className='cont'>
										<View className='item'>
											<View className='left'>{this.state.data.cate_name}</View>
											<View className='rt sta'>处理完成</View>
										</View>
										<View className='item'>
											<View className='left'>处理描述</View>
											<View className='rt'>{this.state.data.finish_desc}</View>
										</View>
										<View className='item'>
											<View className='left'>服务评价</View>
											<View className='rt'>{this.state.data.comment}</View>
										</View>
									</View> 
								</View>
								: ''
							}

						</View>
						{
							this.state.data.status == 3 && this.state.data.star == 0? 
							<View className={'eval-btn'+' '+evalMargin} onClick={this.status.goEval}>评价</View>
							: ''
						}
					</View>
					: ''
				}
				
				{
					this.state.data.worker_id == 0 && this.state.data.can_edit?
					<View className='quxiao' onClick={this.cancelOrder.bind(this)}>取消报修</View>
					:''
				}

			</View>
		)
	}

}

export default Detail