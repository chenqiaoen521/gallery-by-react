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
//图片的描述和图片
var ImageFigure = React.createClass({
	render:function(){
		return (
				<figure className="img-figure">
						<img src={this.props.data.imageURL} 
						alt={this.props.data.title}
						/>
						<figcaption>
							<h2  className="img-title">{this.props.data.title}</h2>
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
		hPosRange:{//水平方向的取值范围
			leftSecX:[0,0],
			rightSecX:[0,0],
			y:[0,0]
		},
		vPosRange:{//垂直方向的取值范围
			x:[0,0],
			topY:[0,0]
		}
	},
	//组件加载以后，为每张图片计算器位置的范围
	componentDidMount:function(){
		//舞台大小 舞台一半的大小
		var stageDom = React.findDOMNode(this.refs.stage),
		stageW = stageDom.scrollWidth,
		stageH = stageDom.scrollHeight,
		halfStageW = Math.ceil(stageW/2),
		halfStageH = Math.ceil(stageH/2);
		//拿到一个imageFigure的大小
		var  imgFigureDom = React.findDOMNode(this.refs.imgFigure0),
		imgW = imgFigureDom.scrollWidth,
		imgH = imgFigureDom.scrollHeight,
		halfImgW = Math.ceil(imgW  / 2),
		halfImgH = Math.ceil(imgH / 2);
	},
	render:function(){
		var controllerUnits = [],
		imgFigures = [];
		imageDatas.forEach(function(value,index){
			imgFigures.push(<ImageFigure data={value} ref={'imgFigure'+index}/>);
		});

		return (
				<section className = "stage" ref="stage">
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

