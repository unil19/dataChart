function dateVisual(container,mode,data,callBack){
	this.container=container;
	this.data=data;
	this.callBack=callBack||null;
	this.init();
	this[mode]();
}
dateVisual.prototype={
	constructor:dateVisual,
	svgNS:"http://www.w3.org/2000/svg",
	corlor:["#CC3333","#279B61","#008AB8","#993333","#A3E496","#95CAE4","#3F5D7D","#FFCC33","#FFFF7A","#CC6699"],
	init:function(){//在容器中创建svg标签
		this.conW=this.container.clientWidth;
		this.conH=this.container.clientHeight;
		this.oSvg=createTag("svg",{"xmlns":this.svgNS,"width":"100%","height":"100%"});
		this.oAxis=createTag("rect",{"x":this.conW*0.1,"y":this.conH*0.1,"width":this.conW*0.8,"height":this.conH*0.8,"stroke":"black",fill:"none"});
		this.container.appendChild(this.oSvg);
		this.oSvg.appendChild(this.oAxis);
	},
	barchart:function(){
		//表格标题
		var oTitle=createTag("text",{"x":this.conW*0.5,"y":this.conH*0.1-5, "stroke":"black","text-anchor":"middle","font-size":"20"});
		oTitle.textContent=this.data.title;
		this.oSvg.appendChild(oTitle);
		//确定坐标
		var dataMax=parseFloat(this.data.dataDetail[0].y);
		for (var i=0;i<this.data.dataDetail.length;i++){
			if(parseFloat(this.data.dataDetail[i].y)>=dataMax){
				dataMax=parseFloat(this.data.dataDetail[i].y);
			};
		};
		for(var j=0;j<6;j++){//6=5+1,可配置，为纵轴分多少格
			var oYaxis=createTag("text",{"x":this.conW*0.05,"y":(this.conH*0.9-2-this.conH*0.8*j/5),"font-size":"12","text-anchor":"middle"});
			var oYaxisline=createTag("line",{"x1":this.conW*0.1,"y1":(this.conH*0.9-2-this.conH*0.8*j/5+1),"x2":this.conW*0.9,"y2":(this.conH*0.9-2-this.conH*0.8*j/5+1),stroke:"#CCC"});
			oYaxis.textContent=dataMax*1.2*j/5+this.data.unit||"";
			this.oSvg.appendChild(oYaxis);
			this.oSvg.appendChild(oYaxisline);
		};
		//加载数据
		var space=this.conW*0.8/(2*this.data.dataDetail.length+1);
		var rate=this.conH*0.8/(dataMax*1.2);
		for(var k=0;k<this.data.dataDetail.length;k++){
			var oG=createTag("g");
			var oXaxis=createTag("text",{"x":space*(2*k+1)+this.conW*0.1+space/2,"y":(this.conH*0.9+17),"font-size":"12","text-anchor":"middle"});
			oXaxis.textContent=this.data.dataDetail[k].x;
			var oBar=createTag("rect",{"width":space,"height":this.data.dataDetail[k].y*rate,"x":space*(2*k+1)+this.conW*0.1,"y":this.conH*0.9-this.data.dataDetail[k].y*rate-1,"fill":this.corlor[k]})
			var oNote=createTag("text",{"x":space*(2*k+1)+this.conW*0.1+space/2,"y":(this.conH*0.9-this.data.dataDetail[k].y*rate-5),"font-size":"12","text-anchor":"middle"});
			oNote.textContent=this.data.dataDetail[k].y+this.data.unit||"";
			oG.appendChild(oXaxis);
			oG.appendChild(oBar);
			oG.appendChild(oNote);
			this.oSvg.appendChild(oG);
		}
	},
	linechart:function(){
		//表格标题
		var oTitle=createTag("text",{"x":this.conW*0.5,"y":this.conH*0.1-5, "stroke":"black","text-anchor":"middle","font-size":"20"});
		oTitle.textContent=this.data.title;
		this.oSvg.appendChild(oTitle);
		//确定坐标轴
		var titles=[],lines=[];
		for(var attr in this.data.dataDetail){
			titles.push(attr);
			lines.push(this.data.dataDetail[attr])
		}
		for(var i=0;i<lines.length-1;i++){
			lines[i].sort(function(a,b){
				return a.x-b.x;
			});
		};
		var xmin=Math.min(parseFloat(lines[0][0].x),parseFloat(lines[1][0].x));
		var xmax=Math.max(parseFloat(lines[0][lines[0].length-1].x),parseFloat(lines[1][lines[0].length-1].x))
		var ymin=parseFloat(lines[0][0].y),ymax=parseFloat(lines[0][0].y);
		for (var m = 0; m < lines.length; m++) {
			for (var n = 0; n < lines[m].length; n++) {
				if(parseFloat(lines[m][n].y)<ymin){
					ymin=parseFloat(lines[m][n].y);
				};
				if(parseFloat(lines[m][n].y)>ymax){
					ymax=parseFloat(lines[m][n].y);
				};
			};
		};
		var xscale=this.conW*0.8/(xmax-xmin);
		var yscale=this.conH*0.8/((ymax-ymin)*1.2);
		for(var j=0;j<6;j++){//6=5+1,可配置，为纵轴分多少格
			var oYaxis=createTag("text",{"x":this.conW*0.05,"y":(this.conH*0.9-2-this.conH*0.8*j/5),"font-size":"12","text-anchor":"middle"});
			var oYaxisline=createTag("line",{"x1":this.conW*0.1,"y1":(this.conH*0.9-2-this.conH*0.8*j/5+1),"x2":this.conW*0.9,"y2":(this.conH*0.9-2-this.conH*0.8*j/5+1),stroke:"#CCC"});
			oYaxis.textContent=((ymax-ymin)*1.2*j/5+ymin).toFixed(2)+this.data.unit||"";//默认保留两位小数
			this.oSvg.appendChild(oYaxis);
			this.oSvg.appendChild(oYaxisline);
		};
		for (var k = 0; k <= (xmax-xmin)/1; k++) {///1为可配置项
			var oXaxis=createTag("text",{"x":xscale*k+this.conW*0.1,"y":(this.conH*0.9+17),"font-size":"12","text-anchor":"middle"});
			var oXaxisline=createTag("line",{"x1":xscale*k+this.conW*0.1,"y1":this.conH*0.1,"x2":xscale*k+this.conW*0.1,"y2":this.conH*0.9,stroke:"#CCC"});
			oXaxis.textContent=xmin+k;//默认保留两位小数
			this.oSvg.appendChild(oXaxis);
			this.oSvg.appendChild(oXaxisline);
		};
		//渲染数据
		for(var p=0;p<lines.length;p++){
			var pointStr="";
			for (var q = 0; q < lines[p].length; q++) {
				if(pointStr==""){
					pointStr=(this.conW*0.1+xscale*(lines[p][q].x-xmin)).toFixed(0)+" "+(this.conH*0.9-yscale*(lines[p][q].y-ymin)).toFixed(0);
				}else{
					pointStr+=" "+(this.conW*0.1+xscale*(lines[p][q].x-xmin)).toFixed(0)+" "+(this.conH*0.9-yscale*(lines[p][q].y-ymin)).toFixed(0);
				}
			};
			var oLine=createTag("polyline",{"points":pointStr,"stroke":this.corlor[p],"fill":"none","stroke-width":"2"})
			var oTitle=createTag("text",{"x":(this.conW*0.1+xscale*(lines[p][lines[p].length-1].x-xmin)).toFixed(0),"y":(this.conH*0.9-yscale*(lines[p][lines[p].length-1].y-ymin)).toFixed(0),"font-size":"16","stroke":this.corlor[p]})
			oTitle.textContent=titles[p];
			this.oSvg.appendChild(oLine);
			this.oSvg.appendChild(oTitle);
		}
	},
	piechart:function(){
		var oTitle=createTag("text",{"x":this.conW*0.5,"y":this.conH*0.1-5, "stroke":"black","text-anchor":"middle","font-size":"20"});
		oTitle.textContent=this.data.title;
		this.oSvg.appendChild(oTitle);
		var total=0;
		var titleArr=[],dataArr=[],angleArr=[];
		for(var i=0;i<this.data.dataDetail.length;i++){
			titleArr.push(this.data.dataDetail[i].x);
			dataArr.push(parseFloat(this.data.dataDetail[i].y));
			total+=parseFloat(this.data.dataDetail[i].y);
		};
		var anglePre=0,angleNow=0;
		var r=Math.min(this.conW,this.conH)*0.25;
		var ox=this.conW*0.5,oy=this.conH*0.5;
		for (var j = 0; j < dataArr.length; j++) {
			angleArr.push(dataArr[j]/total*2*Math.PI);
		};
		for (var k = 0; k < angleArr.length; k++) {
			angleNow+=angleArr[k];
			var oD="M"+ox+" "+oy+" L "+(ox+r*Math.cos(anglePre))+" "+(oy-r*Math.sin(anglePre))+" A "+r+" "+r+" 0 0 0 "+(ox+r*Math.cos(angleNow))+" "+(oy-r*Math.sin(angleNow));
			var oPath=createTag("path",{"d":oD,"fill":this.corlor[k]});
			var oTitle=createTag("text",{"x":(ox+r*1.25*Math.cos((anglePre+angleNow)/2)),"y":(oy-r*1.25*Math.sin((anglePre+angleNow)/2)),"font-size":"16","text-anchor":"middle"})
			oTitle.textContent=titleArr[k]+":"+(angleArr[k]/(2*Math.PI)*100).toFixed(2)+"%";
			this.oSvg.appendChild(oPath)
			this.oSvg.appendChild(oTitle)
			anglePre=angleNow;
		};
	}
}
function $(selector, content) { //封装获取元素的工具函数$
	var firstChar = selector.charAt(0);
	var obj = content || document;
	if (firstChar == "#") {
		return document.getElementById(selector.slice(1));
	}else if (firstChar == ".") {
		var allElement=obj.getElementsByTagName("*");//获取所有元素
		var arr=[]//定义返回数组
		for(var i=0; i<allElement.length;i++){//循环所有元素
			var className=allElement[i].className;
			arrClass=className.split(" ");
			for(var j=0; j<arrClass.length;j++){
				if(arrClass[j]==selector.slice(1)){
					arr.push(allElement[i]);
					break;
				}
			}
		}
		return arr;
	} else {
		return obj.getElementsByTagName(selector);
	};
};
function createTag(tag,objAttr){//创造svg标签的工具函数
	var oTag=document.createElementNS("http://www.w3.org/2000/svg",tag);
	for(var attr in objAttr){
		oTag.setAttribute(attr,objAttr[attr]);
	};
	return oTag;
};