import React from 'react';
import ReactDOM from 'react-dom';

require('../styles/main.css');

//读取json
var imageDatas = require('../data/imageDatas.json');
//转换图片路径
imageDatas = (function genImageURL(imageDatasArr){
	for(var i=0 ,j =imageDatasArr.length;i<j;i++){
		var singleImageData = imageDatasArr[i];
		singleImageData.imageURL = require('../images/'+ singleImageData.fileName);
		imageDatasArr[i] =singleImageData;
	}
	return imageDatasArr;
})(imageDatas);
/*得到两者之间的随机数*/
function getRangeRandom(low,high){
	return Math.ceil(Math.random() * ( high - low ) + low);
}
/*限制图片的随机旋转角度*/
function get30DegRandom(){
	return Math.ceil(Math.random() > 0.5 ? ( Math.random() * 30 ) : - ( Math.random() * 30 )) ;
}

//控制组件
var ControllerUnit = React.createClass({
	handleClick:function(e){
		e.preventDefault();
		e.stopPropagation();
		if(this.props.arrange.isCenter){
			this.props.inverse();
		}else{
			this.props.center();
		}
	},
	render:function(){
		var imgIcon = "controller-unit";
		imgIcon +=  this.props.arrange.isInverse ? ' inverse':'';
		imgIcon +=  this.props.arrange.isCenter ? ' is-center':'';
		return (
			<span className={imgIcon} onClick={this.handleClick}>
			</span>	
			);
	}
});
//图片的描述和图片 组件
var ImageFigure = React.createClass({
	/**
	 * [点击图片效果]
	 * 
	 */
	handleClick:function(e){
		e.stopPropagation();
		e.preventDefault();
		if(this.props.arrange.isCenter){
			this.props.inverse();
		}else{
			this.props.center();
		}
	},
	render:function(){
		var styleObj = {};
		//如果props 属性中指定了这张图片的位置，则使用
		if(this.props.arrange.pos){
			styleObj = this.props.arrange.pos;	
		}
		//如果图片的旋转角度有值，且值不为零，添加旋转角度
		if(this.props.arrange.rotate){
			(['MozTransform','MsTransform','WebkitTransform','transform']).forEach(function(value){
				styleObj[value] = 'rotate('+this.props.arrange.rotate+'deg)';
			}.bind(this));
		}
		if(this.props.arrange.isCenter){
				styleObj['zIndex'] = 11;
		}
		var imgFigureClassName = "img-figure";
		imgFigureClassName +=  this.props.arrange.isInverse ? ' is-inverse':'';
		return (
				<figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick}>
						<img src={this.props.info.imageURL} 
						alt={this.props.info.title}
						/>
						<figcaption>
							<h2  className="img-title">{this.props.info.title}</h2>
							<div className="img-back" onClick={this.handleClick}>
								<p>
									{this.props.info.desc}
								</p>
							</div>
						</figcaption>
				</figure>
				
			);
		}
});

var GalleryByReactApp = React.createClass({
	Constant:{
		centerPos:{//中心图片
			left:0,
			right:0
		},
		vPosRange:{//垂直方向的取值范围
			leftSecX:[0,0],
			rightSecX:[0,0],
			y:[0,0]
		},
		hPosRange:{//水平方向的取值范围
			x:[0,0],
			topY:[0,0]
		}
	},
	/**
	 * [翻转图片]
	 * @param index 输入当前被执行inverse操作的图片对应的图片信息数组的index值
	 * @return {Function} 这是一个闭包函数，其内return一个真正待被执行的函数
	 */
	inverse:function(index){
		return function(){
			var imgsArrangeArr = this.state.imgsArrangeArr;
			imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;
			this.setState({imgsArrangeArr:imgsArrangeArr});
		}.bind(this);
	},
	/**
	 * 利用rearrange函数 居中对应index的图片
	 * @param index 需要被居中的图片对应的图片信息数组的index值
	 * @return {Function} [description]
	 */
	center:function(index){
		return function (){
			this.rearrange(index);
		}.bind(this);
	},
	/*
	 *保存图片css状态
	 */
	getInitialState:function(){
		return {
			imgsArrangeArr:[
				/**
				 * { 
				 * 	 pos :{
				 * 	 	left:0,
				 * 	 	top:0
				 * 	 },
				 * 	 rotate:0,//旋转角度
				 * 	 isInverse:false,//正反面
				 * 	 isCenter:false //是否是中心图片
				 * }
				 */
			]
		};
	} ,
	//组件加载以后，为每张图片计算器位置的范围
	componentDidMount:function(){
		//舞台大小 舞台一半的大小
		var stageDom = this.refs.stage,
		stageW = stageDom.scrollWidth,
		stageH = stageDom.scrollHeight,
		halfStageW = Math.ceil(stageW/2),
		halfStageH = Math.ceil(stageH/2);
		//拿到一个imageFigure的大小
		var imgFigureDom = ReactDOM.findDOMNode(this.refs.imgFigure0),
		imgW = imgFigureDom.scrollWidth,
		imgH = imgFigureDom.scrollHeight,
		halfImgW = Math.ceil(imgW / 2),
		halfImgH = Math.ceil(imgH / 2);
		//计算中心图片的位置点
		this.Constant.centerPos = {
			left:halfStageW - halfImgW,
			top:halfStageH - halfImgH
		};
		//计算左侧 右侧 取值范围
		this.Constant.vPosRange.leftSecX[0] = -halfImgW;
		this.Constant.vPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
 		this.Constant.vPosRange.rightSecX[0] = halfStageW + halfImgW;
 		this.Constant.vPosRange.rightSecX[1] = stageW - halfImgW;
 		this.Constant.vPosRange.y[0] = -halfImgH;
 		this.Constant.vPosRange.y[1] = stageH - halfImgH;
 		//计算上侧取值范围
 		this.Constant.hPosRange.topY[0] = -halfImgH;
 		this.Constant.hPosRange.topY[1] = halfStageH -halfImgH * 3;
 		this.Constant.hPosRange.x[0] = halfStageW - imgW;
 		this.Constant.hPosRange.x[1] = halfStageW;
 		this.rearrange(0);
 		 	},
 		 	/**
 		 	 * [rearrange description]
 		 	 * @param  {[type]} centerIndex [居中img的索引]  
 		 	 * 重新布局图片
 		 	 */
 	rearrange:function(centerIndex){
 		var imgsArrangeArr = this.state.imgsArrangeArr,
 		Constant = this.Constant,
 		centerPos = Constant.centerPos,
 		hPosRange = Constant.hPosRange,
 		vPosRange = Constant.vPosRange,
 		vPosRangeLeftSecX = vPosRange.leftSecX,
 		vPosRangeRightSecX = vPosRange.rightSecX,
 		vPosRangeY = vPosRange.y,
 		hPosRangeTopY = hPosRange.topY,
 		hPosRangeX = hPosRange.x,
 		imgsArrangeTopArr = [],
 		topImgNum = Math.ceil(Math.random() * 2),
 		topImgSpliceIndex = 0,
 		imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex,1);
 		//首先居中centerIndex的图片,居中的centerIndex的图片不需要旋转,是否居中
 		imgsArrangeCenterArr[0] = {
 			pos:centerPos,
 			rotate:0,
 			isCenter:true
 		}
 		imgsArrangeCenterArr[0]['isCenter'] = true ;
 		//取出要布局上侧的图片的状态信息
 		topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum));
 		imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex,topImgNum);
 		//布局位于上侧的图片
 		imgsArrangeTopArr.forEach(function(value,index){
 			imgsArrangeTopArr[index] = {
 				pos:{
 					top:getRangeRandom(hPosRangeTopY[0],hPosRangeTopY[1]),
 					left:getRangeRandom(hPosRangeX[0],hPosRangeX[1])
 				},
 				rotate:get30DegRandom(),
 				isCenter:false
 			}
 		});
 		var vPosRangeLorX;
 		//布局左右侧的图片位置
 		for(var i =0,j=imgsArrangeArr.length,k=j/2;i<j;i++){
 			var vPosRangeLorX = null;
 			if(i<k){//前半部分布局左边
 				vPosRangeLorX = vPosRangeLeftSecX;
 			}else{//后半部分布局右边
 				vPosRangeLorX = vPosRangeRightSecX;
 			}
 			imgsArrangeArr[i] = {
 				pos:{
					top:getRangeRandom(vPosRangeY[0],vPosRangeY[1]),
 					left:getRangeRandom(vPosRangeLorX[0],vPosRangeLorX[1])
 				},
 				rotate:get30DegRandom(),
 				isCenter:false
 			}
 		}
 		//图片位置生成完了合并回来
 		if(imgsArrangeTopArr.length>0){
			imgsArrangeTopArr.forEach(function(value,index){
				if(imgsArrangeTopArr && imgsArrangeTopArr[index]){
					imgsArrangeArr.splice(topImgSpliceIndex,0,imgsArrangeTopArr[index]);
				}
			});
 		}
 		
 		//把中心区域的图片合并到数组中
 		imgsArrangeArr.splice(centerIndex,0,imgsArrangeCenterArr[0]);
 		this.setState({
 			imgsArrangeArr:imgsArrangeArr
 		});
 	},
	render:function(){
		var controllerUnits = [],
		imgFigures = [];
		imageDatas.forEach(function(value,index){
			if(!this.state.imgsArrangeArr[index]){
				this.state.imgsArrangeArr[index] = {
					pos:{
						left:0,
						top:0
					},
					rotate:0,
					isInverse:false,
					isCenter:false
				}
			};
			imgFigures.push(<ImageFigure info={value} key={index} ref={'imgFigure'+index} arrange={this.state.imgsArrangeArr[index]}
							inverse={this.inverse(index)}	center={this.center(index)}	/>);
			controllerUnits.push(<ControllerUnit key={index} center={this.center(index)} inverse={this.inverse(index)} arrange={this.state.imgsArrangeArr[index]}/>);
		}.bind(this));
		return (
				<section className="stage" ref="stage">
                	<section className="img-sec">
						{imgFigures}
                	</section>
                	<nav className="controller-nav">
                		{controllerUnits}
                	</nav>
                </section>
			);
		}
});
ReactDOM.render(
  <GalleryByReactApp />,
  document.getElementById('app')
);

