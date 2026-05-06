const SHEET_NAME = "Workflow";
const WORKFLOW_PIN = "CAMBIA-QUESTO-PIN";

const COLUMN_KEYS = {
  3: "locati",
  4: "locare",
  5: "studentato",
  6: "businessHotel",
  7: "sanitario",
  8: "areeComuni",
  9: "ufficiSfittiDaLocare"
};

const TRANSFORM_COLUMNS = [
  { key: "studentato", title: "Studentato", surfaceClass: "diagram-matrix-surface--yellow" },
  { key: "businessHotel", title: "Business Hotel", surfaceClass: "diagram-matrix-surface--red" },
  { key: "sanitario", title: "Sanitario", surfaceClass: "diagram-matrix-surface--blue" },
  { key: "areeComuni", title: "Aree comuni" },
  { key: "ufficiSfittiDaLocare", title: "Uffici sfitti da locare" }
];

function doGet(e) {
  const action = e.parameter.action || "load";

  if (action === "saveCell") {
    return respond_(saveCell_(e.parameter), e.parameter.callback);
  }

  return respond_(loadWorkflow_(), e.parameter.callback);
}

function doPost(e) {
  const body = JSON.parse(e.postData.contents || "{}");

  if (body.action === "saveCell") {
    return respond_(saveCell_(body), body.callback);
  }

  return respond_(loadWorkflow_(), body.callback);
}

function loadWorkflow_() {
  const sheet = getWorkflowSheet_();

  const values = sheet.getRange(1, 1, 33, 9).getDisplayValues();

  return {
    ok: true,
    data: {
      stripTitle: values[0][0],
      fondo: values.slice(3, 10).map((row) => ({
        label: row[0],
        value: normalizeValue_(row[1])
      })),
      assetRows: values.slice(12, 23).map((row, index) => ({
        sheetRow: index + 13,
        label: row[1],
        locati: normalizeValue_(row[2]),
        locare: normalizeValue_(row[3])
      })),
      transformColumns: TRANSFORM_COLUMNS,
      transformRows: values.slice(24, 33).map((row, index) => ({
        sheetRow: index + 25,
        label: row[1],
        studentato: normalizeValue_(row[4]),
        sanitario: normalizeValue_(row[6]),
        businessHotel: normalizeValue_(row[5]),
        areeComuni: normalizeValue_(row[7]),
        ufficiSfittiDaLocare: normalizeValue_(row[8])
      }))
    }
  };
}

function saveCell_(params) {
  if ((params.pin || "") !== WORKFLOW_PIN) {
    return { ok: false, error: "PIN non valido." };
  }

  const row = Number(params.row);
  const col = Number(params.col);
  const value = String(params.value ?? "").trim() || "-";

  if (!isEditableCell_(row, col)) {
    return { ok: false, error: "Cella non modificabile." };
  }

  const sheet = getWorkflowSheet_();

  sheet.getRange(row, col).setValue(value);

  return {
    ok: true,
    row,
    col,
    key: COLUMN_KEYS[col],
    value
  };
}

function isEditableCell_(row, col) {
  const isAssetCell = row >= 13 && row <= 23 && (col === 3 || col === 4);
  const isTransformCell = row >= 25 && row <= 33 && col >= 5 && col <= 9;

  return isAssetCell || isTransformCell;
}

function normalizeValue_(value) {
  return value === "" ? "-" : value;
}

function getWorkflowSheet_() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const namedSheet = spreadsheet.getSheetByName(SHEET_NAME);

  return namedSheet || spreadsheet.getSheets()[0];
}

function respond_(payload, callback) {
  const json = JSON.stringify(payload);
  const safeCallback = sanitizeCallback_(callback);

  if (safeCallback) {
    return ContentService
      .createTextOutput(`${safeCallback}(${json});`)
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }

  return ContentService
    .createTextOutput(json)
    .setMimeType(ContentService.MimeType.JSON);
}

function sanitizeCallback_(callback) {
  if (!callback) return "";
  return /^[A-Za-z_$][\w$]*(\.[A-Za-z_$][\w$]*)*$/.test(callback) ? callback : "";
}
