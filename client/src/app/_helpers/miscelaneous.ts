import { BusinessException } from "../_models/business";

/** Regresa el mensaje apropiado de error. */
export function getHttpErrorMessage(error: any, defaultMsg: string = "Hubo un error ejecutando la acción."): string {
  let errorStr = "";
  let businessEx: BusinessException = Object.assign(new BusinessException(), error.error);
  if((businessEx?.statusCode ?? 0) > 299 ){
    return businessEx.message;
  }
  else if (isString(error.error)) {
    errorStr = error.error;
  } else {
    errorStr = error.message;
  }
  return errorStr || defaultMsg;
}

/** Regresa si un objeto es de tipo string o no.*/
export function isString(str: any): boolean {
    return  typeof str === "string" || str instanceof String;
}

/** Remueve los acentos normalizandolos. */
export function removeDiacritics(word: string): string {
  if(word == null || word == "") return "";
  return word.normalize("NFD")?.replace(/[\u0300-\u036f]/g, "");
}

export function base64ToFile(base64data: string): File {
  let content = decodeURIComponent(escape(window.atob(base64data)));
  let fileName = "AvancePresupuestal-" + getCurrentDate("yyyyMMddThhmmss") + ".csv";
  const codeUnits = Uint16Array.from(
    { length: content.length },
    ( _, index) => content.charCodeAt(index)
  );
  const charCodes = new Uint8Array(codeUnits.buffer);
  const type = 'text/csv';
  const blob = new Blob([charCodes], { type });
  return new File([blob], fileName, { lastModified: new Date().getTime(), type });
}

/** Regresa la fecha actual en el formato deseado */
export function getCurrentDate(format: string): string {
  let today = new Date();
  let dd = String(today.getDate()).padStart(2, '0');
  let MM = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  let yyyy = today.getFullYear().toString();
  let hh = today.getHours().toString().padStart(2, '0');
  let mm = today.getMinutes().toString().padStart(2, '0');
  let ss = today.getSeconds().toString().padStart(2, '0');
  let res = format.replace("dd",dd);
  res = res.replace("MM",MM);
  res = res.replace("yyyy",yyyy);
  res = res.replace("hh",hh);
  res = res.replace("mm",mm);
  res = res.replace("ss",ss);
  return res;
}
