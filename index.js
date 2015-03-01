'use strict';

var _ = require('lodash');
var S = require('string');
var parsePath = require('svg-path-parser');
var Polygon = require('polygon');

var toPathObj = function(pathStr) {
   return parsePath(pathStr);
};

var toPathObjItem = function(code, numbers){
	 var d = 'M 0 0 '+ code + ' ' + numbers.join(' ');
	 return toPathObj(d)[1];
};

var roundValue = function(value,precision) {
	if (precision>0) {
		return S(value).toFloat(precision);
	} else {
		return S(value).toInt(precision);
	}
};

var hasXY= function(params) {
	return _.has(params,'x') && _.has(params,'y');
};
var hasX1Y1= function(params) {
	return _.has(params,'x1') && _.has(params,'y1');
};
var hasX2Y2= function(params) {
	return _.has(params,'x2') && _.has(params,'y2');
};
var hasX3Y3= function(params) {
	return _.has(params,'x3') && _.has(params,'y3');
};

var isParamsAbsolute = function(params) {
	var isAbs= S(params.code).isUpper();
	return isAbs;
};

var isCurve = function(params) {
	var code= params.code.toUpperCase();
	return code === 'C' || code === 'Q';
};

var toVector= function(params) {
	if (!hasXY(params)) {return null;}
	
	return {x: params.x, y: params.y};
};

var roundParams= function(params,precision) {
	var rounded = _.cloneDeep(params);
	if (hasXY(params)) {
		rounded.x = roundValue(params.x,precision);
		rounded.y = roundValue(params.y,precision);
	}
	if (hasX1Y1(params)) {
		rounded.x1 = roundValue(params.x1,precision);
		rounded.y1 = roundValue(params.y1,precision);
	}
	if (hasX2Y2(params)) {
		rounded.x2 = roundValue(params.x2,precision);
		rounded.y2 = roundValue(params.y2,precision);
	}
	if (hasX3Y3(params)) {
		rounded.x3 = roundValue(params.x3,precision);
		rounded.y3 = roundValue(params.y3,precision);
	}
	return rounded;
};

var toPath= function(params) {
	if (!_.has(params,'code')) {return null;}
	var p = null;
	switch (params.code) {
		case 'M': p = 'M ' + [params.x,params.y].join(' '); break;
		case 'L': p = 'L ' + [params.x,params.y].join(' '); break;
		case 'l': p = 'l ' + [params.x,params.y].join(' '); break;
		case 'C': p = 'C ' + [params.x1,params.y1,params.x2,params.y2,params.x,params.y].join(' '); break;
		case 'c': p = 'c ' + [params.x1,params.y1,params.x2,params.y2,params.x,params.y].join(' '); break;
		case 'Z': p = 'Z'; break;
		case 'z': p = 'z'; break;
	}
	return p;
};

var curveToLine =function(params) {
	if (isCurve(params)) {
		var code = isParamsAbsolute(params) ? 'L' : 'l';
		return toPathObjItem(code,[params.x,params.y]);
		
	} else {
		return params;
	}
};

var round = function (pathObj, precision) {
  var rounded= _.map(pathObj, function(params) { return roundParams(params, precision); });
  return rounded;
};

var isAbsolute = function(pathObj) {
  return _.every(pathObj,isParamsAbsolute);
};

var toVectors= function(pathObj) {
	var vects= _.map(pathObj, function(params) { return toVector(params); });
	return _.compact(vects);
};

var toPathString = function (pathObj) {
  var seq = _.map(pathObj, function(params) { return toPath(params); });
  var pathStr = _.compact(seq).join(' ');
  return pathStr;
};


var toPolygon= function(pathObj) {
	var vects= toVectors(pathObj);
	return new Polygon(vects);
};

var toLines = function (pathObj) {
  var lines= _.map(pathObj, function(params) { return curveToLine(params); });
  return lines;
};


var toPolygonArea= function (pathObj) {
  var polygon= toPolygon(pathObj);
  var area= polygon.area();
  if (area)
  	{return area;}
  else
  	{return 0;}
};

module.exports = {
	"toPathObj": toPathObj,
	"toPathString": toPathString,
	"round": round,
	"isAbsolute": isAbsolute,
	"toVectors": toVectors,
	"toPolygon": toPolygon,
	"toLines": toLines,
	"toPolygonArea": toPolygonArea
};
