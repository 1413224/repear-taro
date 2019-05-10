import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text, Image, Input, Textarea } from '@tarojs/components'
import { AtTextarea, AtImagePicker,AtActionSheet,AtActionSheetItem,AtForm,AtButton  } from 'taro-ui'
// import "~taro-ui/dist/style/components/action-sheet.scss";
import { getJSON } from '../../utils/request'
import './addrepair.less'

class Addrepair extends Component{
	config = {
		navigationBarTitleText: '我要报修'
	}

	state = {
		value:'',//控制文本框的输入文字
		files:[
			/*{url: 'https://storage.360buyimg.com/mtd/home/111543234387022.jpg',},
			{url: 'https://storage.360buyimg.com/mtd/home/221543234387016.jpg',},
			{url: 'https://storage.360buyimg.com/mtd/home/331543234387025.jpg',},*/
		],
		isopenSheet:false,
		typeList:[],
		curType:'',
		curTypeText:'',
    allFiles:[],
    imgfiles:[],
    
    mask:''
	}

  imglist=[]
  imgFilesList=[]//保存正式地址

	componentWillMount(){
		this.getTypeList()
	}

	componentWillUnmount(){}

	componentDidShow(){}

	componentDidHide(){}

  onShareAppMessage(){
    return{
      title:Taro.getStorageSync('title'),
      imageUrl:Taro.getStorageSync('imageUrl')
    }
  }

	showType(){
		this.setState({
	  		isopenSheet:true,
        mask:'maskhid'
	  	})
	}

  closeSheet(){
    this.setState({
      isopenSheet:false,
      mask:''
    })
  }

  cancelSheet(){
    this.setState({
      isopenSheet:false,
      mask:''
    })
  }

	handleChange(event){
  	this.setState({
  		value:event.target.value,
      isopenSheet:false,
      mask:''
  	})
  }

  fileChange(files,operationType,index){
  	console.log(files)
  	var _this = this
  	var token = Taro.getStorageSync('_token_')

  	if(operationType == 'remove'){
  		_this.setState({
				files,
        isopenSheet:false,
        mask:''
			})
  		return false
  	}

  	Taro.showLoading({
  		title:'正在上传'
  	});

  	Taro.uploadFile({
  		url:Taro.url.UserUploadThumb,
  		filePath:files[files.length-1].url,
  		name:'file',
  		header:'multipart/form-data',
  		success(res){
  			
  			var data = JSON.parse(res.data)
  			// console.log(data)
  			if(data.ret == '200'){
  				Taro.showLoading({
	  				title:'上传成功'
	  			});

  				var files = _this.state.files
  				if(files == null){
  						files = []
  				}
          //这里返回来数组(循环)
  				files.push({
  					'url': data.data.url
  				})

	  			_this.setState({
	  				files:files,
            isopenSheet:false,
            mask:''
	  			})

	  			Taro.hideLoading()

  			}
  			else{
  				Taro.showLoading({
						title:'上传失败'
					})
					setTimeout(()=>{
						Taro.hideLoading()
					},1000)
  			}
  			
  		}
  	})

  	
  }

  imgFail(mes){
  	console.log(mes)
  }

  imageClick(index,file){
  	console.log(index, file)
  }

  //获取报修类型数据
  getTypeList(){
  	var _this = this
		var token = Taro.getStorageSync('_token_')
  	getJSON(Taro.url.UserGetTypeList,{
  		token:token
  	}).then(res=>{
  		if(res.data.ret=='200'){
  			// console.log(res.data.data)
  			let data = res.data.data
  			_this.setState({
  				typeList:data,
  				curType:0,
  				curTypeText:data[0]
  			})

  		}
  	})
  }

  //更改报修类型
  changeType(item,index){
  	// console.log(item + index)
  	this.setState({
  		curType:index,
  		curTypeText:item,
  		isopenSheet:false,
      mask:''
  	})
  }

  //提交报修
  addRepair(){
  	var _this = this 
		var token = Taro.getStorageSync('_token_')
    // console.log(_this.imglist)
    // return false;
    if(_this.state.curTypeText=="请选择报修类型"){
      Taro.showToast({
        icon:'none',
        title:"请选择报修类型",
        duration:1000
      })
      return false;
    }
  	getJSON(Taro.url.UserAdd,{
  		type:_this.state.curTypeText,
  		desc:_this.state.value,
      // thumb:JSON.stringify(_this.state.files),imglist
  		thumb:JSON.stringify(_this.imgFilesList),
  		token:token,
      formIds:JSON.stringify(Taro.getStorageSync('_formIds_'))
  	}).then(res=>{
  		if(res.data.ret=='200'){
  			Taro.showToast({
					title:'已成功提交报修信息',
					duration:1000
				})
        Taro.removeStorageSync('_formIds_')
				setTimeout(()=>{
					Taro.redirectTo({
						url:'/pages/repair/list'
					})
				},500)
  		}
  	})
  }

  async collectFormIds(formId){
    let formIds = Taro.getStorageSync('_formIds_')
    let _this = this
    if(!formIds){
      formIds = []
    }
    let data = {
      formId : formId
    }
    formIds.push(data)
    Taro.setStorage({
      key:'_formIds_',
      data:formIds
    })
    await _this.addRepair()
  }

  onSubmit(e){
    let formId = e.detail.formId;
    this.collectFormIds(formId);
  }

  test(){
    var _this = this
    // var imgarr = []
    // console.log(this.imglist)

    Taro.chooseImage({
      count:5,
      sizeType:['original'],
      sourceType:['album'],
      success:function(res){
        var tempFilePaths = res.tempFilePaths
        // console.log(tempFilePaths)
        tempFilePaths.map((item,index)=>{
          _this.imglist.push(item)
        })
        // console.log(_this.imglist)
        // 请求接口
      
        for(let i=0;i<_this.imglist.length;i++){

          if(_this.imglist.length>1){
            Taro.showLoading({
              title:'正在上传第'+ (i+1) +'张图片'
            });
          }
          // console.log(i)
          Taro.uploadFile({
            url:Taro.url.UserUploadThumb,
            filePath:_this.imglist[i],
            name:'file',
            header:'multipart/form-data',
            success(res){
              
              var data = JSON.parse(res.data)
              // console.log(data)

              if(data.ret == '200'){
                _this.imgFilesList.push(data.data.url)
                // console.log(_this.imgFilesList)

                if(i==_this.imglist.length-1){
                  Taro.showLoading({
                    title:'上传成功'
                  });
                  /*_this.imgFilesList[i] = (function(i){
                    // return data.data.url
                    console.log(i)
                  })(i)*/

                  _this.setState({
                    imgfiles:_this.imglist,
                    isopenSheet:false,
                    mask:''
                  })
                }
                
                Taro.hideLoading()

              }
              else{
                Taro.showLoading({
                  title:'上传失败'
                })
                setTimeout(()=>{
                  Taro.hideLoading()
                },1000)
              }
              
            }
          })
          // getJSON(Taro.url.UserUploadThumb,{
          //   filePath:_this.imglist[i],
          //   header:'multipart/form-data',
          //   name:'file'
          // }).then((res)=>{
          //   if(res.data.ret=='200'){
          //     console.log('成功')
          //   }
          // })
        }
        

      },
      fail:function(err){
        console.log(err)
      }
    })
  }

  removeImg(curItem){
    console.log(curItem)
    var _this = this
    var newarr = _this.imglist.slice(0)

    for(let i=0;i<newarr.length;i++){
      if(newarr[i]==curItem){
        newarr.splice(i,1);
        i--;
      }
    }
    _this.imglist = newarr

    _this.setState({
      imgfiles:_this.imglist
    })
    console.log(_this.imglist)

    // return newarr;
    /*_this.imglist.map((item,index)=>{
      if(curItem != item){
        return item
      }
    })*/

    
  }


	render(){
		return(
			<View className='repair-wrap'>
				<View className='top'>
					<Text className='tit'>请选择故障的类型</Text>
					<Text className='req'>必填</Text>
					<View className='repair-type' onClick={this.showType.bind(this)}>
						<Text className='repair-phone'>{this.state.curTypeText}</Text>
						<Image className='fr ico' src={require('../../assets/repear/images/bluemore.png')}/>
					</View>
				</View>
				{/*内容开始*/}
				<View className='content'>
					<View className='tit'>
						<Text className='guzhang'>故障描述</Text>
						<Text className='req'>必填</Text>
					</View>
					<View className={'cont'+' '+mask}>
						<AtTextarea
			        value={this.state.value}
			        onChange={this.handleChange.bind(this)}
			        maxLength={200}
			        placeholder='请输入...'
			        height='200'
			      />
					</View>
					<View className='picwrap'>
						<View className='tit'>
							<Text className='guzhang'>故障图片</Text>
							<Text className='req'>请拍照清晰，方便报修人员查看</Text>
						</View>
						<View className='loadpic clearfix'>
							
                
              {/*    <AtImagePicker                
                          multiple
                          files={this.state.files}               
                          onFail={this.imgFail.bind(this)}
                          onImageClick={this.imageClick.bind(this)}
                          onChange={this.fileChange.bind(this)}/>
                */}
              
              

                {
              this.state.imgfiles.map((item,index)=>{
                return(
                  <View className='img-wrap fl'>
                    <Image className='item-img' src={item}/>
                    <View className='close-ico' onClick={this.removeImg.bind(this,item)}>x</View>
                  </View>
                )
              })
             }
              
              {/*<View className='img-wrap fl'>
                <Image className='item-img' src={require('../../assets/repear/images/bluejia.png')}/>
                <View className='close-ico'>x</View>
              </View>*/}
             
            <View className='chooseImg fl' onClick={this.test.bind(this)}>
              <Image className='jia' src={require('../../assets/repear/images/bluejia.png')}/>
             </View>


						</View>
					</View>
				</View>
				{/*内容end*/}
      {/*onClick={this.addRepair.bind(this)}*/}
				<View className='ids-wrap'>
					<Image className='gou' src={require('../../assets/repear/images/gou.png')}/>
          <AtForm className='pribtn' onSubmit={this.onSubmit.bind(this)}>
            <AtButton formType='submit'>提交</AtButton>
          </AtForm>
				</View>

				<AtActionSheet
					isOpened={this.state.isopenSheet}
					cancelText='取消'
          onClose={this.closeSheet.bind(this)}
          onCancel={this.cancelSheet.bind(this)}
					>
					{
						this.state.typeList.map((item,index)=>{
							return(
								<AtActionSheetItem 
									key={index}
									onClick={this.changeType.bind(this,item,index)}>
									{item}
								</AtActionSheetItem>
							)
						})
					}
				</AtActionSheet>

        

			</View>
		)
	}

}

export default Addrepair