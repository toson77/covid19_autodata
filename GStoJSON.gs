function getData(id, sheetName) {
  var sheet = SpreadsheetApp.openById(id).getSheetByName(sheetName);
  var rows = sheet.getDataRange().getValues();
  //var keys = rows.splice(0, 1)[0];
  // 3行目の1次配列
//  var keys = rows [2];
//  keys = keys.splice(0, 2);
  

  
  //1列2列以外削除
  for(var i=0; i<rows.length; i++){
      rows[i] = rows[i].splice(0,2);
      //日付切り出し
      //rows[i][0] = rows[i][0].substr(0, 10);
      rows[i][0] = formatDate(new Date(rows[i][0]), 'yyyy-MM-dd');
  }
  //3行目まで削除
  rows.splice(0, 3)[0];
  
//  return rows.map(function(row) {
//    var obj = {}
//    row.map(function(item, index) {
//      obj[keys[index]] = item;
//    });
//    
//    return obj;
//  });
  return rows;
}

// date: 日付オブジェクト
// format: 書式フォーマット
function formatDate (date, format) {
  
  format = format.replace(/yyyy/g, date.getFullYear());
  format = format.replace(/MM/g, ('0' + (date.getMonth() + 1)).slice(-2));
  format = format.replace(/dd/g, ('0' + date.getDate()).slice(-2));
  format = format.replace(/HH/g, ('0' + date.getHours()).slice(-2));
  format = format.replace(/mm/g, ('0' + date.getMinutes()).slice(-2));
  format = format.replace(/ss/g, ('0' + date.getSeconds()).slice(-2));
  format = format.replace(/SSS/g, ('00' + date.getMilliseconds()).slice(-3));
  return format;
};



function doGet(request) {
  var func = 'jsondata';
  var data = getData('1vakG9kP7HlhKnj_pFY7lidhaeoeRSe8TcAeNfV55nkw', '陽性患者数(patients_summary)');
  //return ContentService.createTextOutput(func + '(' + JSON.stringify(data, null, 2) + ')')
  //.setMimeType(ContentService.MimeType.JAVASCRIPT);
  return ContentService.createTextOutput(JSON.stringify(data));
  //return ContentService.createTextOutput(data);
}
