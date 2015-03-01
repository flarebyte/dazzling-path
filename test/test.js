/*global describe, it */
'use strict';
var assert = require('assert');
var dazzlingPath = require('../');
var S = require('string');
var assert = require('chai').assert;
var expect = require('chai').expect;

var FIXTURES = {
				"xy": "12 15",
			  "xy.1": "5.1 7.2",
			  "xy.2": "5.12 7.27",
				"xy.3": "5.343 56.418",
				"2d": "56 15.1 12.22 45.144",
				"3d": "46 12.1 10.22 35.144 16 17.1"
			    };


var path = function(dpath){
	 var d = S(dpath).template(FIXTURES,'{', '}').s;
	 return dazzlingPath.toPathObj(d);
};


describe('dazzling-path node module', function () {
  
  it('must convert path string to object', function () {
   var seq= dazzlingPath.toPathObj("M 10 23 l 11 24 Z");
   assert.lengthOf(seq, 3, 'The path object should be an array of 3 items');
   assert.equal(seq[0].code,'M','instruction should be move to');
   assert.equal(seq[1].code,'l','instruction should be move to');
   assert.equal(seq[2].code,'Z','instruction should be close to');
  });

  it('must convert path object to path string', function () {
   var d = 'M 5.343 56.418 L 12 15 C 46 12.1 10.22 35.144 16 17.1 Z';
   var obj = path(d);
   var actual= dazzlingPath.toPathString(obj);
   expect(actual,'svg path').to.equal(d);
  });

  it('must round coordinates', function () {
    var rounded0= dazzlingPath.round(path('M {xy.3} Z'),0);
    var rounded1= dazzlingPath.round(path('M {xy.3} Z'),1);
    var rounded2= dazzlingPath.round(path('M {xy.3} Z'),2);
    var rounded3= dazzlingPath.round(path('M {xy.3} Z'),3);
    var rounded3D= dazzlingPath.round(path('M {xy.3} C {3d} Z'),1);
    expect(rounded0[0].x,'round 0').to.equal(5);
    expect(rounded1[0].x,'round 1').to.equal(5.3);
    expect(rounded1[0].y,'round 1').to.equal(56.4);
    expect(rounded2[0].x,'round 2').to.equal(5.34);
    expect(rounded3[0].x,'round 3').to.equal(5.343);
    expect(rounded3D[1].x1,'3D x1').to.equal(46);
    expect(rounded3D[1].y1,'3D y1').to.equal(12.1);
    expect(rounded3D[1].x2,'3D x2').to.equal(10.2);
    expect(rounded3D[1].y2,'3D y2').to.equal(35.1);
  });

  it('must detect absolute only coordinates ', function () {
    var testAbs= dazzlingPath.isAbsolute(path('M {xy.3} Z'));
    var testRel= dazzlingPath.isAbsolute(path('M {xy} l {xy} Z'));
    expect(testAbs,'only absolute instructions').to.equal(true);
    expect(testRel,'mixed absolute and relative instructions').to.equal(false);
  });

  it('must converts path to an array of vectors', function () {
    var vectors= dazzlingPath.toVectors(path('M {xy.3} L {xy} C {3d} Z'));
    expect(vectors).to.have.length(3);
    expect(vectors[0].x,'Move to x').to.equal(5.343);
    expect(vectors[0].y,'Move to y').to.equal(56.418);
    expect(vectors[1].x,'Line to x').to.equal(12);
    expect(vectors[1].y,'Line to y').to.equal(15);
    expect(vectors[2].x,'Curve to x').to.equal(16);
    expect(vectors[2].y,'Curve to y').to.equal(17.1);
  });

  it('must converts path to a polygon', function () {
    var polygon= dazzlingPath.toPolygon(path('M {xy.3} L {xy} C {3d} Z'));
    var points = polygon.points;
    expect(points).to.have.length(3);
    expect(points[0].x,'Move to x').to.equal(5.343);
    expect(points[0].y,'Move to y').to.equal(56.418);
    expect(points[1].x,'Line to x').to.equal(12);
    expect(points[1].y,'Line to y').to.equal(15);
    expect(points[2].x,'Curve to x').to.equal(16);
    expect(points[2].y,'Curve to y').to.equal(17.1);
  });

  it('must convert all path segments to lines', function () {
    var before = path('M {xy.3} L {xy} C {3d} Z');
    var after = dazzlingPath.toLines(before);
    expect(after).to.have.length(4);
    expect(after[0],'Move').to.equal(before[0]);
    expect(after[1],'Line').to.equal(before[1]);
    expect(after[3],'Close to').to.equal(before[3]);
    expect(after[2].code,'Line code').to.equal('L');
    expect(after[2].x,'Line to x').to.equal(16);
    expect(after[2].y,'Line to y').to.equal(17.1);
  });
  it('must calculate the polygon area of rectangle', function () {
    var rect = path('M 0 0 L 0 10 L 20 10 L 20 0 Z');
    var area= dazzlingPath.toPolygonArea(rect);
    expect(area,'calculation of area').to.equal(200);
  });

});
