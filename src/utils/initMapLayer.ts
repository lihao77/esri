import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import ImageryLayer from '@arcgis/core/layers/ImageryLayer';
import ImageryTileLayer from '@arcgis/core/layers/ImageryTileLayer';
import MapImageLayer from '@arcgis/core/layers/MapImageLayer';
import VectorTileLayer from '@arcgis/core/layers/VectorTileLayer';
import WebTileLayer from '@arcgis/core/layers/WebTileLayer';
import WMSLayer from '@arcgis/core/layers/WMSLayer';
import WMTSLayer from '@arcgis/core/layers/WMTSLayer';
const mapLayer = {
    'FeatureLayer': function(url:string){
      return new FeatureLayer({
        url: url
      })},

    'ImageryLayer': function(url:string){
      return new ImageryLayer({
        url: url})},

    'ImageryTileLayer': function(url:string){
      return new ImageryTileLayer({
        url: url})},

    'MapImageLayer': function(url:string){
      return new MapImageLayer({
        url: url})},

    'VectorTileLayer': function(url:string){
      return new VectorTileLayer({
        url: url})},

    'WMSLayer': function(url:string){
      return new WMSLayer({
        url: url})},

    'WMTSLayer': function(url:string){
      return new WMTSLayer({
        url: url})},
  }