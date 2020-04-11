
function getData(id, sheetName) {
  var sheet = SpreadsheetApp.openById(id).getSheetByName(sheetName);
  var rows = sheet.getDataRange().getValues();
  
  if(sheetName === "電話相談件数(contacts)"){
    /**電話相談件数データ整形*/
    formatContacts(rows);   
    /**電話相談件数数オブジェクト雛形*/
    var ContactsObject = {"date": "", "data": rows};
    return ContactsObject;
  } 
  else if( sheetName === "陽性患者属性(patients)"){
    /**陽性患者属性データ整形*/
    formatPatients(rows);
    /**object作成用key作成*/
    const key = ["リリース日", "居住地", "年代", "性別", "退院"];
    /**object作成*/
    rows = ArrayToObject(rows, key);
    /**陽性患者属性オブジェクト雛形*/
    var PatientsObject =  {"date": "", "data": rows};
    return PatientsObject;
  }
  else if( sheetName === "陽性患者数(patients_summary)"){
    /**感染者数データ整形*/
    formatPatientsSummary(rows);
    /**感染者数オブジェクト雛形*/
    var PatientsSummaryObject = {"date": "", "data": rows};
    return PatientsSummaryObject;
  }
  else{
     /**検査実施数データ整形*/
    formatInspectionsSummary(rows);
    /**検査実施数オブジェクト雛形*/
    var InspectionsSummaryObject = {"date": "", "data": rows};
    return InspectionsSummaryObject;
  }
  
  /**object作成*/
  function ArrayToObject(array, keys){
  return array.map(function(row) {
    var obj = {}
    row.map(function(item, index) {
      obj[keys[index]] = item;
    });    
    return obj;
  });  
  }    
}

/**電話相談件数データ整形*/
function formatContacts (data){
  /**1列2列取得**/
  for(var i=0; i<data.length; i++){
    data[i] = data[i].splice(0,2);
    /**日付切り出し**/
    data[i][0] = formatDate(convertToDate(data[i][0]), 'yyyy-MM-dd');
  }
  /**4行目まで削除*/
  data.splice(0, 4)[0];
   /**空文字null代入*/
  data.map(function(str){
  str.map(function(str, index, array){
    array[index] = checkNul(str);
  });
  });
  
  return data;  
}

/**陽性患者属性データ整形*/
function formatPatients (data){
  /**2345列取得**/
  for(var i=0; i<data.length; i++){
    data[i] = data[i].splice(1,5);
    /**日付切り出し**/
    data[i][0] = formatDate(convertToDate(data[i][0]), 'yyyy-MM-dd');
    data[i][4] = formatDate(convertToDate(data[i][4]), 'yyyy-MM-dd');
   
  }
  /**3行目まで削除*/
  data.splice(0, 3)[0];
  /**空文字null代入*/
  data.map(function(str){
  str.map(function(str, index, array){
    array[index] = checkNul(str);
  });
    
});
  return data;  
}

/**感染者数データ整形*/
function formatPatientsSummary (data){
  /**1列2列取得**/
  for(var i=0; i<data.length; i++){
    data[i] = data[i].splice(0,2);
    /**日付切り出し**/
    data[i][0] = formatDate(convertToDate(data[i][0]), 'yyyy-MM-dd');
  }
  /**3行目まで削除*/
  data.splice(0, 3)[0];
   /**空文字null代入*/
  data.map(function(str){
  str.map(function(str, index, array){
    array[index] = checkNul(str);
  });
  });
  
  return data;  
}

/**検査実施数データ整形*/
function formatInspectionsSummary (data){
  /**1列2列3列取得**/
  for(var i=0; i<data.length; i++){
    data[i] = data[i].splice(0,3);
    /**日付切り出し**/
    data[i][0] = formatDate(data[i][0], 'yyyy-MM-dd');
  }
  /**4行目まで削除*/
  data.splice(0, 4)[0];
   /**空文字null代入*/
  data.map(function(str){
  str.map(function(str, index, array){
    array[index] = checkNul(str);
  });
  });
  
  return data;  
}

/**date型空文字判定*/
function convertToDate(val) {
  if(val){
   return new Date(val);
  }
return null;
}

/**空文字判定*/
function checkNul(val) {
  if(val){
   return val;
  }else if(val === 0){
    return val;
  }
return null;
}

/**objの型とtypeが一致した場合はtrue*/
function typeEquals(type, obj) {
  var clas = Object.prototype.toString.call(obj).slice(8, -1);
  return clas === type;
}


/** date: 日付オブジェクト
 format: 書式フォーマット*/
function formatDate (date, format) {
  /**書式デフォ設定*/
  if(!(format)){
    format = 'yyyy-MM-dd';
  }
  /**型判定*/
  if(!(typeEquals('Date', date))){
    return null;
  }
  
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
  var contacts = getData('1vakG9kP7HlhKnj_pFY7lidhaeoeRSe8TcAeNfV55nkw', '電話相談件数(contacts)');
  var patients = getData('1vakG9kP7HlhKnj_pFY7lidhaeoeRSe8TcAeNfV55nkw', '陽性患者属性(patients)');
  var patients_summary = getData('1vakG9kP7HlhKnj_pFY7lidhaeoeRSe8TcAeNfV55nkw', '陽性患者数(patients_summary)');
  var inspections_summary = getData('1vakG9kP7HlhKnj_pFY7lidhaeoeRSe8TcAeNfV55nkw', '検査実施数(inspections_summary)');
  var data = {contacts, patients, patients_summary, inspections_summary};
  return ContentService.createTextOutput(JSON.stringify(data, null, 2)).setMimeType(ContentService.MimeType.JSON);
  //return ContentService.createTextOutput(data2);
}


