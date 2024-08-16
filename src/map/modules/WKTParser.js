class WKTParser {
    // 将 WKT 字符串转换为 GeoJSON 格式
    static wktToJson(wkt) {
      const type = wkt.slice(0, wkt.indexOf('(')).trim().toUpperCase();
      const coordinatesStr = wkt.slice(wkt.indexOf('(') + 1, wkt.lastIndexOf(')')).trim();
      const coordinates = WKTParser.parseCoordinates(type, coordinatesStr);
      
      return {
        type,
        coordinates,
      };
    }
  
    // 解析坐标
    static parseCoordinates(type, coordinatesStr) {
      // 将字符串转换为数字数组
      const coordPairs = coordinatesStr.split(',').map(pair => {
        return pair.trim().split(/\s+/).map(Number);
      });
      
      if (type === 'POINT') {
        return coordPairs[0];
      }
      
      if (type === 'LINESTRING' || type === 'MULTIPOINT') {
        return coordPairs;
      }
      
      if (type === 'POLYGON' || type === 'MULTILINESTRING') {
        return [coordPairs];
      }
      
      if (type === 'MULTIPOLYGON') {
        return [[coordPairs]];
      }
      
      throw new Error('Unsupported WKT type');
    }
  
    // 将 GeoJSON 格式的 JSON 对象转换为 WKT 字符串
    static jsonToWkt(json) {
      const { type, coordinates } = json;
      let coordinatesStr;
  
      if (type === 'POINT') {
        coordinatesStr = coordinates.join(' ');
      } else if (type === 'LINESTRING' || type === 'MULTIPOINT') {
        coordinatesStr = coordinates.map(pair => pair.join(' ')).join(', ');
      } else if (type === 'POLYGON' || type === 'MULTILINESTRING') {
        coordinatesStr = coordinates[0].map(pair => pair.join(' ')).join(', ');
      } else if (type === 'MULTIPOLYGON') {
        coordinatesStr = coordinates[0][0].map(pair => pair.join(' ')).join(', ');
      } else {
        throw new Error('Unsupported GeoJSON type');
      }
  
      return `${type.toUpperCase()}(${coordinatesStr})`;
    }
  }
  
  export default WKTParser;
  