function getData(id, sheetName) {
  var sheet = SpreadsheetApp.openById(id).getSheetByName(sheetName);
  var rows = sheet.getDataRange().getValues();
  
  //var keys = ["patients_summary",];

  /**感染者数データ整形*/
  formatPatientsSummary(rows);
  
  
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

/**感染者数データ整形*/
function formatPatientsSummary (data){
   /**1列2列以外削除**/
  for(var i=0; i<data.length; i++){
      data[i] = data[i].splice(0,2);
      /**日付切り出し**/
      data[i][0] = formatDate(new Date(data[i][0]), 'yyyy-MM-dd');
  }
  /**3行目まで削除*/
  data.splice(0, 3)[0];
  
  return data;
  
}

/** date: 日付オブジェクト
 format: 書式フォーマット*/
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
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
  //return ContentService.createTextOutput(data);
}
