/**グローバル変数(main_summaryで使用)*/
var numInspections = 0;
var numPatients = 0;
var numOutHospital = 0;
/**死者数と重篤者は変わったらここ書き換え*/
const numDeath = 0;
const numSerious = 0;

///**時間更新*/
//function updateTime(activeSheet){
//  if(activeSheet === '電話相談件数(contacts)'){
//    const contactsDate = new Date();
//    return contactsDate;
//  }
//  else if(activeSheet === '陽性患者属性(patients)'){
//    const patientsDate = new Date();
//    return patientsDate;
//  }
//  else if(activeSheet === '陽性患者数(patients_summary)'){
//    const patientsSummaryDate = new Date();
//    return patientsSummaryDate;
//  }
//  else{
//    const patientsSummaryDate = new Date();
//    return patientsSummaryDate;
//    

function getData(id, sheetName) {
  const sheet = SpreadsheetApp.openById(id).getSheetByName(sheetName);
  let rows = sheet.getDataRange().getValues();
  var activeSheet = SpreadsheetApp.getActiveSheet();
//  const contactsDate
//  const patientsDate
//  const patientsSummaryDate
//  const inspectionSummaryDate
//  
  if (sheetName === '電話相談件数(contacts)') {
    /** 電話相談件数データ整形 */
    formatContacts(rows)
    /** 電話相談件数数オブジェクト雛形 */
    const ContactsObject = { date:"" , data: rows }
    return ContactsObject
  } 
  else if (sheetName === '陽性患者属性(patients)') {
    /** 陽性患者属性データ整形 */
    formatPatients(rows)
    /** object作成用key作成 */
    const key = ['リリース日', '居住地', '年代', '性別', '退院']
    /** object作成 */
    rows = ArrayToObject(rows, key)
    /** 陽性患者属性オブジェクト雛形 */
    const PatientsObject = { date: '', data: rows }
    return PatientsObject
  }
  else if (sheetName === '陽性患者数(patients_summary)') {
    /** 感染者数データ整形 */
    formatPatientsSummary(rows)
    /** 感染者数オブジェクト雛形 */
    const PatientsSummaryObject = { date: '', data: rows }
    return PatientsSummaryObject
  }
  else {
    /** 検査実施数データ整形 */
    formatInspectionsSummary(rows)
    /** 検査実施数オブジェクト雛形 */
    const InspectionsSummaryObject = { date: '', data: rows }
    return InspectionsSummaryObject
  }

  /** object作成 */
  function ArrayToObject(array, keys) {
    return array.map(function(row) {
      const obj = {}
      row.map(function(item, index) {
        obj[keys[index]] = item
      })
      return obj
    })
  }
}

/** 電話相談件数データ整形 */
function formatContacts(data) {
  /** 1列2列取得**/
  for (let i = 0; i < data.length; i++) {
    data[i] = data[i].splice(0, 2)
    /** 日付切り出し**/
    data[i][0] = formatDate(convertToDate(data[i][0]), 'yyyy-MM-dd')
  }
  /** 4行目まで削除 */
  data.splice(0, 4)[0]
  /** 空文字null代入 */
  data.map(function(str) {
    str.map(function(str, index, array) {
      array[index] = checkNul(str)
    })
  })

  return data
}

/** 陽性患者属性データ整形 */
function formatPatients(data) {
  /** 2345列取得**/
  for (let i = 0; i < data.length; i++) {
    data[i] = data[i].splice(1, 5)
    /** 日付切り出し**/
    data[i][0] = formatDate(convertToDate(data[i][0]), 'yyyy-MM-dd')
    data[i][4] = formatDate(convertToDate(data[i][4]), 'yyyy-MM-dd')
  }
  /** 3行目まで削除 */
  data.splice(0, 3)[0]
  /** 空文字null代入 */
  data.map(function(str) {
    str.map(function(str, index, array) {
      array[index] = checkNul(str)
    })
  })
  /** 退院者数合計(77行目で2345列取得してることに注意)*/
  numOutHospital = notNullLength(data, 4);
  return data
}

/** 感染者数データ整形 */
function formatPatientsSummary(data) {
  /** 1列2列取得**/
  for (let i = 0; i < data.length; i++) {
    data[i] = data[i].splice(0, 2)
    /** 日付切り出し**/
    data[i][0] = formatDate(convertToDate(data[i][0]), 'yyyy-MM-dd')
  }
  /** 3行目まで削除 */
  data.splice(0, 3)[0]
  /** 空文字null代入 */
  data.map(function(str) {
    str.map(function(str, index, array) {
      array[index] = checkNul(str)
    })
  })
  /** 感染者数合計 */
  numPatients = sumColumn(data, 1);

  return data
}

/** 検査実施数データ整形 */
function formatInspectionsSummary(data) {
  /** 1列2列3列取得**/
  for (let i = 0; i < data.length; i++) {
    data[i] = data[i].splice(0, 3)
    /** 日付切り出し**/
    data[i][0] = formatDate(data[i][0], 'yyyy-MM-dd')
  }
  /** 4行目まで削除 */
  data.splice(0, 4)[0]
  /** 空文字null代入 */
  data.map(function(str) {
    str.map(function(str, index, array) {
      array[index] = checkNul(str)
    })
  })
  /**検査実施数合計*/
  numInspections = sumColumn(data, 1) + sumColumn(data, 2);

  return data
}

/**colの合計をreturn*/
function sumColumn(data, col){
  var sum = 0;
  for (let row = 0; row < data.length; row++) {
    sum += data[row][col];
  }
  return sum;
}
/**nullを含まない配列の要素数*/
function notNullLength(data, col){
  var sum = 0;
  for (let row = 0; row < data.length; row++) {
    if (checkNul(data[row][col])){
      sum++;
    }
  }
  return sum;
}
/** date型空文字判定 */
function convertToDate(val) {
  if (val) {
    return new Date(val)
  }
  return null
}

/** 空文字判定 */
function checkNul(val) {
  if (val) {
    return val
  } else if (val === 0) {
    return val
  }
  return null
}

/** objの型とtypeが一致した場合はtrue */
function typeEquals(type, obj) {
  const clas = Object.prototype.toString.call(obj).slice(8, -1)
  return clas === type
}

/** date: 日付オブジェクト
 format: 書式フォーマット */
function formatDate(date, format) {
  /** 書式デフォ設定 */
  if (!format) {
    format = 'yyyy-MM-dd'
  }
  /** 型判定 */
  if (!typeEquals('Date', date)) {
    return null
  }
  format = format.replace(/yyyy/g, date.getFullYear())
  format = format.replace(/MM/g, ('0' + (date.getMonth() + 1)).slice(-2))
  format = format.replace(/dd/g, ('0' + date.getDate()).slice(-2))
  format = format.replace(/HH/g, ('0' + date.getHours()).slice(-2))
  format = format.replace(/mm/g, ('0' + date.getMinutes()).slice(-2))
  format = format.replace(/ss/g, ('0' + date.getSeconds()).slice(-2))
  format = format.replace(/SSS/g, ('00' + date.getMilliseconds()).slice(-3))
  return format
}

function mainSummaryObj(){
  const mainSummaryObject = {"attr": "検査実施人数",
        "value": numInspections,
        "children": [
            {
                "attr": "陽性患者数",
                "value": numPatients,
                "children": [
                    {
                        "attr": "入院中",
                        "value": numPatients - numOutHospital,
                        "children": [
                            {
                                "attr": "軽症・中等症",
                                "value": numPatients - numOutHospital - numSerious
                            },
                            {
                                "attr": "重症",
                                "value": numSerious
                            }
                        ]
                    },
                    {
                        "attr": "退院",
                        "value": numOutHospital
                    },
                    {
                        "attr": "死亡",
                        "value": numDeath
                    }
                ]
            }
        ]
                            };
  return mainSummaryObject;

}

function doGet(request) {
  const contacts = getData(
    '1vakG9kP7HlhKnj_pFY7lidhaeoeRSe8TcAeNfV55nkw',
    '電話相談件数(contacts)'
  )
  const patients = getData(
    '1vakG9kP7HlhKnj_pFY7lidhaeoeRSe8TcAeNfV55nkw',
    '陽性患者属性(patients)'
  )
  /**jsonの関係上スネークケースを使用*/
  const patients_sumary = getData(
    '1vakG9kP7HlhKnj_pFY7lidhaeoeRSe8TcAeNfV55nkw',
    '陽性患者数(patients_summary)'
  )
  const inspections_summary = getData(
    '1vakG9kP7HlhKnj_pFY7lidhaeoeRSe8TcAeNfV55nkw',
    '検査実施数(inspections_summary)'
  )
  const main_summary = mainSummaryObj();
  const lastUpdate = "";
  const data = { contacts, patients, patients_sumary, inspections_summary,lastUpdate, main_summary }
  return ContentService.createTextOutput(
    JSON.stringify(data, null, 2)
  ).setMimeType(ContentService.MimeType.JSON)
  // return ContentService.createTextOutput(data2);
}
