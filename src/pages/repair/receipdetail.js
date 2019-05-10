import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text, Image, Swiper, SwiperItem} from '@tarojs/components'
import { AtCurtain, AtModal, AtModalHeader, AtModalContent, AtModalAction} from 'taro-ui'
import { getJSON } from '../../utils/request'

import './receipdetail.less'

class Receipdetail extends Component{
	config = {
  	navigationBarTitleText: '详情'
	}

	state = {
		faultList:[
			/*{url:'../../assets/repear/images/detail-left.png'},
			{url:'../../assets/repear/images/detail-left.png'},
			{url:'../../assets/repear/images/detail-left.png'},
			{url:'../../assets/repear/images/detail-left.png'},*/
		],
		isOpened: false,
		data:{},
		bgColor:'',
		currentIndex:0,
		dealModal:false,
		dealModalTitle:'',//一键接单时的title
		finishModel:false,
		orderId:'',//订单号
		
	}

	componentWillMount(){
		/*console.log(0)*/
		// console.log(this.$router.params.id)
		this.setState({
			orderId:this.$router.params.id
		})
		this.getInfo(this.$router.params.id)
	}

	componentWillUnmount(){}

	componentDidMount(){
		setTimeout(()=>{
			this.changebgColor()
		},200)
	}

	componentDidShow(){}

	componentDidHide(){}

	handleChange(index){
		// console.log(9)
		this.setState({
			currentIndex:index
		})
		this.setState({
			isOpened: true
		})
	}

	onClose(){
		this.setState({
			isOpened: false
		})
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

	//获取用户基本信息
	getInfo(id){
		var _this = this
		getJSON(Taro.url.ManageGetInfo,{
			id:id,
			token:'123'
		}).then(res=>{
			if(res.data.ret=='200'){
				let data = res.data.data
				_this.setState({
					data:data,
					faultList:data.thumb
				})
			}
		})
	}

	//点击取消
	finishCancel(){
		this.setState({
			finishModel:false
		})
	}

	//点击确定
	modalConfirm(){
		this.setState({
			dealModal:false
		})
		setTimeout(()=>{
			Taro.navigateTo({
				url:'/pages/repair/receiptlist'
			})
		},200)
	}

	//一键接单
	receipt(){

		var _this = this 
		getJSON(Taro.url.ManageDeal,{
			id:_this.$router.params.id,
			token:'123'
		}).then(res=>{
			if(res.data.ret=='200'){
				_this.setState({
					dealModal:true
				})
				_this.setState({
					dealModalTitle:res.data.data.title
				})
			}
		})
	}

	//点击完工
	finishOrder(){
		this.setState({
			finishModel:true
		})
	}

	//点击确定（完工）
	finishConfirm(){
		var _this = this 

		getJSON(Taro.url.ManageFinish,{
			id:_this.$router.params.id,
			token:'123'
		}).then(res=>{
			if(res.data.ret=='200'){
				_this.setState({
					finishModel:false
				})
				setTimeout(()=>{
					Taro.navigateTo({
						url:'/pages/repair/receiptlist'
					})
				},200)
			}
		})
	}

	render(){
		return (
			<View className='detail-wrap'>
				<View className={'ba-wrap'+' '+this.state.bgColor}>
					{/*头部开始*/}
					<View className='top clearfix'>
						<View className='left fl padleft'>
							<Image className='img' src={require('../../assets/repear/images/detail-left.png')}/>
							<Text className='desc'>订单号</Text>
							<Text className='num ellipsis'>{this.state.orderId}</Text>
						</View>
						<View className='right fr'>

							{
								this.state.data.status == 1 ? 
								<Image className='img' src={require('../../assets/repear/images/miss.png')}/>
								: ''
							}
							{
								this.state.data.status == 1 ? 
								<Text className='status missText'>待处理</Text>
								: ''
							}
							{
								this.state.data.status == 2 ?
								<Image className='img' src={require('../../assets/repear/images/clock.png')}/>
								: ''
							}
							{
								this.state.data.status == 2 ?
								<Text className='status clockText'>正受理</Text>
								: ''
							}
							{
								this.state.data.status == 3 ?
								<Image className='img' src={require('../../assets/repear/images/gou2.png')}/>
								: ''
							}
							{
								this.state.data.status == 3 ?
								<Text className='status completedText'>已处理</Text>
								: ''
							}
						</View>
					</View>
					{/*头部end*/}
					{/*维修内容开始*/}
					<View className='receipt-cont'>
						<View className='item'>
							<View className='left'>维修问题</View>
							<View className='right wx'>
                  {this.state.data.desc}
              </View>
						</View>
						<View className='item'>
							<View className='left'>维修类型</View>
							<View className='right phone'>{this.state.data.type}</View>
						</View>
						<View className='item'>
							<View className='left'>下单时间</View>
							<View className='right time'>{this.state.data.create_time}</View>
						</View>
					</View>
					{/*维修内容end*/}
					{/*用户信息开始*/}
					<View className='user-wrap'>
						<View className='left padleft'><Image className='ico' src={require('../../assets/repear/images/addressg.png')}/></View>
						<View className='right'>
							<View className='top'>
								<Text className='name'>林新生</Text>
								<Text className='phone'>{this.state.data.user_tel}</Text>
							</View>
							<View className='bottom'>{this.state.data.user_address}</View>
						</View>
					</View>
					{/*用户信息end*/}
				</View>
				{/*故障图开始*/}
				<View className='fault-wrap'>
					<Text className='title'>故障图片</Text>
					<View className='pic-wrap'>
						{/*幕帘组件*/}

						{
							this.state.faultList.map((item,index)=>{
								return (
									<View
										className='item'
										key={index}
										onClick={this.handleChange.bind(this,index)}>
										<Image className='pic' src={item}/>
									</View>
								)
							})
						}

						<AtCurtain 
							isOpened={this.state.isOpened}
							onClose = {this.onClose.bind(this)}>
							<Swiper
								indicatorColor='#999'
								indicatorActiveColor='#333'
								
								circular
								indicatorDots
								current={this.state.currentIndex}>
								{
									this.state.faultList.map((item,index)=>{
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
				{/*故障图end*/}
				<View className='btn-wrap'>
					{
						this.state.data.status == 1 ?
						<Text className='btn jiedan' onClick={this.receipt.bind(this)}>一键接单</Text>
						:''
					}
					{
						this.state.data.status == 2 ?
						<Text className='btn wangong' onClick={this.finishOrder.bind(this)}>完工</Text>
						: ''
					}
				</View>

				<View className='jiedan'>
					<AtModal
					  isOpened = {this.state.dealModal}
					  title={this.state.dealModalTitle}
					  confirmText='我知道了'
					  onConfirm={ this.modalConfirm.bind(this) }
					  content='请联系报修人员取的具体问题信息'
					/>
				</View>

				<AtModal
					isOpened = {this.state.finishModel}
					title='温馨提示'
				  cancelText='取消'
				  confirmText='确认'
				  onCancel={ this.finishCancel.bind(this) }
				  onConfirm={ this.finishConfirm.bind(this) }
				  content='您确定提交已处理该报修订单吗？'
				/>

			</View>
		)
	}

}

export default Receipdetail