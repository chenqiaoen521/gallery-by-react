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

var GalleryByReactApp = React.createClass({
	render:function(){
		return (
				<section className = "stage">
                	<section className="img-sec">

                	</section>
                	<nav className="controller-nav">
                	</nav>
                </section>
			);
	}
});

