Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzMDMzYWFiYy03NmQ2LTQ1Y2ItOTIxMC00YTlhNWJiOTczYTEiLCJpZCI6MjI5OTIwLCJpYXQiOjE3MzUxNDI5ODN9.5JsxkFNj9aTyDXASAq5If6K6oQmBRtw4-xzKA0-ksec";

const viewer = new Cesium.Viewer("cesiumContainer", {
    timeline: false,
    animation: false,
    baseLayerPicker: false,
    geocoder: false,
    homeButton: false,
    sceneModePicker: false,
    navigationHelpButton: false,
    fullscreenButton: true,
    infoBox: false,
    selectionIndicator: false,
    globe: false
});

viewer.scene.skyBox.show = false;
viewer.scene.sun.show = false;
viewer.scene.moon.show = false;
viewer.scene.backgroundColor = Cesium.Color.fromCssColorString("#bcdcff");

viewer.clock.currentTime = Cesium.JulianDate.fromDate(
    new Date("2025-06-21T12:00:00Z")
);

let googleTileset;

try {
    googleTileset = await Cesium.createGooglePhotorealistic3DTileset();

    googleTileset.customShader = new Cesium.CustomShader({
        mode: Cesium.CustomShaderMode.MODIFY_MATERIAL,
        lightingModel: Cesium.LightingModel.UNLIT,
        fragmentShaderText: `
            void fragmentMain(FragmentInput fsInput, inout czm_modelMaterial material) {
                material.diffuse = clamp(material.diffuse * 1.5, 0.0, 1.0);
            }
        `
    });

    viewer.scene.primitives.add(googleTileset);
} catch (error) {
    console.error("Errore nel caricamento del tileset Google:", error);
}

// =========================
// COSTANTI
// =========================

const POSTI_AUTO_LOCATA_MQ = 4.827;
const POSTI_AUTO_SFITTA_LOCABILE_MQ = 7.592;
const POSTI_AUTO_TOTAL_MQ = POSTI_AUTO_LOCATA_MQ + POSTI_AUTO_SFITTA_LOCABILE_MQ;
const SFITTA_NON_LOCABILE_TOTAL_MQ = 48.338;
const DIAGRAM_LOT_IDS = ["lotto_2", "lotto_3"];
const DIAGRAM_DATA = {
    stripTitle: "Fondo / Club Deal acquisisce intero asset",
    fondo: [
        { label: "Valore presunto:", value: "90 mln" },
        { label: "Sounding di mercato:", value: "Settembre 2026" },
        { label: "Mq totali:", value: "136.136" },
        { label: "Costo stimato di trasformazione:", value: "" },
        { label: "Costo stimato totale investimento:", value: "" },
        { label: "MOIC:", value: "" },
        { label: "IRR:", value: "" }
    ],
    assetRows: [
        {
            label: "Euro locazione annuo",
            locati: "&euro; 3.770.600",
            locare: "-"
        },
        {
            label: "Euro locazione annuo presunto",
            locati: "-",
            locare: "&euro; 633.343"
        },
        {
            label: "Mq",
            locati: "39.040",
            locare: "13.115"
        },
        {
            label: "&euro;/mq annuo",
            locati: "97",
            locare: "48"
        },
        {
            label: "Resa",
            locati: "9%",
            locare: "9%"
        },
        {
            label: "Valore presunto",
            locati: "&euro; 41.895.556",
            locare: "&euro; 7.037.144"
        },
        {
            label: "&euro;/mq",
            locati: "1.073",
            locare: "537"
        },
        {
            label: "Conduttore 1",
            locati: "Unicredit - Lotto 1",
            locare: "-"
        },
        {
            label: "Conduttore 2",
            locati: "Agenzia Entrate - Torre Servizi",
            locare: "-"
        },
        {
            label: "Conduttore 3",
            locati: "Asilo - Lotto 5",
            locare: "-"
        },
        {
            label: "Conduttore 4",
            locati: "-",
            locare: "-"
        }
    ],
    transformColumns: [
        { key: "studentato", title: "Studentato" },
        { key: "sanitario", title: "Sanitario" },
        { key: "businessHotel", title: "Business Hotel" },
        { key: "areeComuni", title: "Aree comuni" },
        { key: "ufficiSfittiDaLocare", title: "Uffici sfitti da locare" }
    ],
    transformRows: [
        { label: "N. camere", studentato: "-", sanitario: "-", businessHotel: "-", areeComuni: "-", ufficiSfittiDaLocare: "-" },
        { label: "Mq", studentato: "-", sanitario: "-", businessHotel: "-", areeComuni: "-", ufficiSfittiDaLocare: "-" },
        { label: "Hard cost", studentato: "-", sanitario: "-", businessHotel: "-", areeComuni: "-", ufficiSfittiDaLocare: "-" },
        { label: "Soft cost", studentato: "-", sanitario: "-", businessHotel: "-", areeComuni: "-", ufficiSfittiDaLocare: "-" },
        { label: "Valore presunto", studentato: "-", sanitario: "-", businessHotel: "-", areeComuni: "-", ufficiSfittiDaLocare: "-" },
        { label: "Gestore", studentato: "-", sanitario: "-", businessHotel: "-", areeComuni: "-", ufficiSfittiDaLocare: "-" },
        { label: "Euro locazione annuo", studentato: "-", sanitario: "-", businessHotel: "-", areeComuni: "-", ufficiSfittiDaLocare: "-" },
        { label: "Resa annua", studentato: "-", sanitario: "-", businessHotel: "-", areeComuni: "-", ufficiSfittiDaLocare: "-" },
        { label: "Sviluppatore", studentato: "-", sanitario: "-", businessHotel: "-", areeComuni: "-", ufficiSfittiDaLocare: "-" }
    ]
};

// =========================
// CAMERA ORBITALE
// =========================

const defaultTargetLon = 7.668758713914815;
const defaultTargetLat = 45.04017277072142;
const defaultTargetHeight = 313.8442567745517;
const defaultOrbitHeading = Cesium.Math.toRadians(55);
const defaultOrbitPitch = Cesium.Math.toRadians(-35);
const defaultOrbitRange = 420;
const diagramOrbitHeading = Cesium.Math.toRadians(55);
const diagramOrbitPitch = Cesium.Math.toRadians(-32);
const diagramOrbitFallbackRange = 480;

let orbitTarget = Cesium.Cartesian3.fromDegrees(
    defaultTargetLon,
    defaultTargetLat,
    defaultTargetHeight
);

let orbitHeading = defaultOrbitHeading;
let orbitPitch = defaultOrbitPitch;
let orbitRange = defaultOrbitRange;

const minPitch = Cesium.Math.toRadians(-80);
const maxPitch = Cesium.Math.toRadians(-10);
const minRange = 180;
const maxRange = 900;

function updateOrbitCamera() {
    viewer.camera.lookAt(
        orbitTarget,
        new Cesium.HeadingPitchRange(orbitHeading, orbitPitch, orbitRange)
    );

    if (shouldUseDiagramCameraOffset() && diagramCameraOffsetProgress > 0) {
        viewer.camera.moveRight(
            getDiagramCameraOffsetDistance() * diagramCameraOffsetProgress
        );
    }
}

function cloneCartesian3(position) {
    if (!position) return null;
    return new Cesium.Cartesian3(position.x, position.y, position.z);
}

function easeInOutCubic(t) {
    return t < 0.5
        ? 4 * t * t * t
        : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function lerpNumber(start, end, t) {
    return start + (end - start) * t;
}

function lerpAngle(start, end, t) {
    const shortestDelta = Cesium.Math.negativePiToPi(end - start);
    return start + shortestDelta * t;
}

function getCurrentOrbitState() {
    return {
        target: cloneCartesian3(orbitTarget),
        heading: orbitHeading,
        pitch: orbitPitch,
        range: orbitRange
    };
}

function applyOrbitState(state) {
    if (!state?.target) return;

    orbitTarget = cloneCartesian3(state.target);
    orbitHeading = state.heading;
    orbitPitch = state.pitch;
    orbitRange = state.range;

    updateOrbitCamera();
}

updateOrbitCamera();

const controller = viewer.scene.screenSpaceCameraController;
controller.enableInputs = false;
controller.enableTranslate = false;
controller.enableZoom = false;
controller.enableTilt = false;
controller.enableRotate = false;
controller.enableLook = false;

let isPointerDown = false;
let startX = 0;
let startY = 0;

const activePointers = new Map();
let isPinching = false;
let lastPinchDistance = 0;

function getPointerDistance() {
    if (activePointers.size < 2) return 0;
    const points = Array.from(activePointers.values());
    const dx = points[0].x - points[1].x;
    const dy = points[0].y - points[1].y;
    return Math.hypot(dx, dy);
}

function beginOrbitDrag(x, y) {
    isPointerDown = true;
    startX = x;
    startY = y;
}

function syncSinglePointerAfterGesture() {
    if (activePointers.size === 1 && !isPinching) {
        const remainingPointer = Array.from(activePointers.values())[0];
        beginOrbitDrag(remainingPointer.x, remainingPointer.y);
        return;
    }

    isPointerDown = false;
}

const canvas = viewer.scene.canvas;
canvas.style.touchAction = "none";

canvas.addEventListener("pointerdown", (event) => {
    const isPrimaryMouseButton = event.pointerType !== "touch" ? event.button === 0 : true;
    if (!isPrimaryMouseButton) return;

    activePointers.set(event.pointerId, {
        x: event.clientX,
        y: event.clientY
    });

    if (activePointers.size === 2) {
        isPinching = true;
        isPointerDown = false;
        lastPinchDistance = getPointerDistance();
    } else if (activePointers.size === 1) {
        beginOrbitDrag(event.clientX, event.clientY);
    }

    canvas.setPointerCapture(event.pointerId);
    event.preventDefault();
});

canvas.addEventListener("pointermove", (event) => {
    if (activePointers.has(event.pointerId)) {
        activePointers.set(event.pointerId, {
            x: event.clientX,
            y: event.clientY
        });
    }

    if (isPinching && activePointers.size >= 2) {
        const currentDistance = getPointerDistance();
        const pinchDelta = currentDistance - lastPinchDistance;

        if (Math.abs(pinchDelta) > 2) {
            const pinchSensitivity = 1.5;
            orbitRange -= pinchDelta * pinchSensitivity;
            orbitRange = Cesium.Math.clamp(orbitRange, minRange, maxRange);
            updateOrbitCamera();
            lastPinchDistance = currentDistance;
        }

        event.preventDefault();
        return;
    }

    if (!isPointerDown || activePointers.size !== 1) return;

    const deltaX = event.clientX - startX;
    const deltaY = event.clientY - startY;

    startX = event.clientX;
    startY = event.clientY;

    const sensitivity = 0.003;

    orbitHeading += deltaX * sensitivity;
    orbitPitch -= deltaY * sensitivity;
    orbitPitch = Cesium.Math.clamp(orbitPitch, minPitch, maxPitch);

    updateOrbitCamera();
    event.preventDefault();
});

canvas.addEventListener("pointerup", (event) => {
    activePointers.delete(event.pointerId);

    if (activePointers.size < 2) {
        isPinching = false;
        lastPinchDistance = 0;
    }

    syncSinglePointerAfterGesture();
    event.preventDefault();
});

canvas.addEventListener("pointercancel", (event) => {
    activePointers.delete(event.pointerId);

    if (activePointers.size < 2) {
        isPinching = false;
        lastPinchDistance = 0;
    }

    syncSinglePointerAfterGesture();
});

canvas.addEventListener("lostpointercapture", (event) => {
    activePointers.delete(event.pointerId);

    if (activePointers.size < 2) {
        isPinching = false;
        lastPinchDistance = 0;
    }

    syncSinglePointerAfterGesture();
});

canvas.addEventListener("wheel", (event) => {
    event.preventDefault();

    const zoomStep = 25;

    if (event.deltaY > 0) {
        orbitRange += zoomStep;
    } else {
        orbitRange -= zoomStep;
    }

    orbitRange = Cesium.Math.clamp(orbitRange, minRange, maxRange);
    updateOrbitCamera();
}, { passive: false });

// =========================
// DEBUG PUNTI / PREVIEW
// =========================

/*
const lottoPoints = [];
let lottoPointEntities = [];
let lottoPolygonEntity = null;
let lottoPolylineEntity = null;

function addPointMarker(position) {
    const point = viewer.entities.add({
        position,
        point: {
            pixelSize: 10,
            color: Cesium.Color.YELLOW,
            outlineColor: Cesium.Color.BLACK,
            outlineWidth: 2
        }
    });

    lottoPointEntities.push(point);
}

function createLivePreview() {
    if (!lottoPolylineEntity) {
        lottoPolylineEntity = viewer.entities.add({
            polyline: {
                positions: new Cesium.CallbackProperty(() => lottoPoints, false),
                width: 3,
                material: Cesium.Color.YELLOW
            }
        });
    }

    if (!lottoPolygonEntity) {
        lottoPolygonEntity = viewer.entities.add({
            polygon: {
                hierarchy: new Cesium.CallbackProperty(() => {
                    if (lottoPoints.length < 3) return null;
                    return new Cesium.PolygonHierarchy(lottoPoints);
                }, false),
                material: Cesium.Color.RED.withAlpha(0.35),
                outline: false
            }
        });
    }
}
*/

// =========================
// UI / INFO PANEL
// =========================

const infoPanel = document.getElementById("infoPanel");
const closePanel = document.getElementById("closePanel");
const infoEyebrow = document.getElementById("infoEyebrow");
const lotTitle = document.getElementById("lotTitle");
const infoPanelBody = document.getElementById("infoPanelBody");

const categoryMeta = {
    rosso: {
        title: "Locati",
        eyebrow: "Categoria",
        empty: "Nessun lotto locato disponibile."
    },
    azzurro: {
        title: "Sfitta locabile",
        eyebrow: "Categoria",
        empty: "Nessun lotto sfitta locabile disponibile."
    },
    verde: {
        title: "Sfitta non locabile",
        eyebrow: "Categoria",
        empty: "Nessun lotto in questa categoria."
    }
};

const categoryFilterExcludedIds = {
    azzurro: new Set(["lotto_2", "lotto_3"])
};

var currentLayoutMode = "default";
let savedStandardOrbitState = null;
let layoutSyncFrame = 0;
let layoutSyncTimeout = 0;
let orbitAnimationFrame = 0;
var diagramCameraOffsetProgress = 0;
const diagramTargetScreenX = 1 / 4;

function isDiagramMode() {
    return currentLayoutMode === "diagram";
}

function scheduleViewerLayoutSync() {
    if (layoutSyncFrame) {
        cancelAnimationFrame(layoutSyncFrame);
    }
    if (layoutSyncTimeout) {
        clearTimeout(layoutSyncTimeout);
    }

    layoutSyncFrame = requestAnimationFrame(() => {
        layoutSyncFrame = 0;
        viewer.resize();
        updateOrbitCamera();
    });

    layoutSyncTimeout = window.setTimeout(() => {
        layoutSyncTimeout = 0;
        viewer.resize();
        updateOrbitCamera();
    }, 380);
}

function stopOrbitAnimation() {
    if (!orbitAnimationFrame) return;
    cancelAnimationFrame(orbitAnimationFrame);
    orbitAnimationFrame = 0;
}

function animateOrbitToState(state, duration = 1150, endOffsetProgress = diagramCameraOffsetProgress) {
    if (!state?.target) return;

    stopOrbitAnimation();

    const startState = getCurrentOrbitState();
    const targetState = {
        target: cloneCartesian3(state.target),
        heading: state.heading,
        pitch: state.pitch,
        range: state.range
    };
    const startOffsetProgress = diagramCameraOffsetProgress;
    const targetOffsetProgress = endOffsetProgress;

    const startTime = performance.now();

    const step = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = easeInOutCubic(progress);

        orbitTarget = Cesium.Cartesian3.lerp(
            startState.target,
            targetState.target,
            eased,
            new Cesium.Cartesian3()
        );
        orbitHeading = lerpAngle(startState.heading, targetState.heading, eased);
        orbitPitch = lerpAngle(startState.pitch, targetState.pitch, eased);
        orbitRange = lerpNumber(startState.range, targetState.range, eased);
        diagramCameraOffsetProgress = lerpNumber(
            startOffsetProgress,
            targetOffsetProgress,
            eased
        );

        updateOrbitCamera();

        if (progress < 1) {
            orbitAnimationFrame = requestAnimationFrame(step);
            return;
        }

        orbitAnimationFrame = 0;
        diagramCameraOffsetProgress = targetOffsetProgress;
        applyOrbitState(targetState);
    };

    orbitAnimationFrame = requestAnimationFrame(step);
}

function shouldUseDiagramCameraOffset() {
    return typeof window !== "undefined" && window.innerWidth > 920;
}

function getHorizontalFovRadians() {
    const frustum = viewer.camera.frustum;
    const verticalFov = typeof frustum.fovy === "number" ? frustum.fovy : frustum.fov;
    const aspectRatio =
        typeof frustum.aspectRatio === "number" && frustum.aspectRatio > 0
            ? frustum.aspectRatio
            : ((canvas.clientWidth || window.innerWidth || 1) / (canvas.clientHeight || window.innerHeight || 1));

    return 2 * Math.atan(Math.tan(verticalFov / 2) * aspectRatio);
}

function getDiagramCameraTarget() {
    const baseTarget = getCenterFromEntities(getLotsByIds(DIAGRAM_LOT_IDS));
    return baseTarget ? cloneCartesian3(baseTarget) : cloneCartesian3(orbitTarget);
}

function getDiagramCameraOffsetDistance() {
    const desiredNdcX = ((diagramTargetScreenX - 0.5) / 0.5);
    const halfHorizontalFov = getHorizontalFovRadians() / 2;
    const targetAngle = Math.atan(Math.tan(halfHorizontalFov) * Math.abs(desiredNdcX));

    return getDiagramCameraRange() * Math.tan(targetAngle);
}

function getDiagramCameraRange() {
    const diagramSphere = getBoundingSphereFromEntities(getLotsByIds(DIAGRAM_LOT_IDS));
    if (!diagramSphere) return diagramOrbitFallbackRange;

    return Cesium.Math.clamp(diagramSphere.radius * 5.4, 420, 680);
}

function focusDiagramCamera() {
    const targetState = {
        target: getDiagramCameraTarget(),
        heading: diagramOrbitHeading,
        pitch: diagramOrbitPitch,
        range: getDiagramCameraRange()
    };

    animateOrbitToState(
        targetState,
        1250,
        shouldUseDiagramCameraOffset() ? 1 : 0
    );
    scheduleViewerLayoutSync();
}

function exitDiagramMode() {
    if (!isDiagramMode()) return;

    currentLayoutMode = "default";
    document.body.classList.remove("diagram-mode");

    if (savedStandardOrbitState) {
        animateOrbitToState(savedStandardOrbitState, 1050, 0);
        savedStandardOrbitState = null;
    }

    scheduleViewerLayoutSync();
}

function ensureStandardLayout() {
    if (isDiagramMode()) {
        exitDiagramMode();
    }
}

function getProp(entity, key) {
    if (!entity?.properties?.[key]) return "-";
    const value = entity.properties[key];
    return value.getValue ? value.getValue(Cesium.JulianDate.now()) : value;
}

function formatValue(value) {
    return value === undefined || value === null || value === "" ? "-" : value;
}

function toNumberOrZero(value) {
    const num = Number(value);
    return Number.isFinite(num) ? num : 0;
}

function formatMqValue(value) {
    const num = toNumberOrZero(value);
    if (Number.isInteger(num)) {
        return num.toLocaleString("it-IT");
    }
    return num.toFixed(3);
}

function formatMqTotal(value) {
    return toNumberOrZero(value).toFixed(3);
}

function parseEuroValue(value) {
    if (value === undefined || value === null) return 0;

    const cleaned = String(value)
        .replace(/€/g, "")
        .replace(/\s/g, "")
        .replace(/\./g, "")
        .replace(/,/g, ".");

    const num = Number(cleaned);
    return Number.isFinite(num) ? num : 0;
}

function formatDisplayedMq(entity) {
    const mqDisplay = getProp(entity, "mqDisplay");
    if (mqDisplay !== "-") {
        return mqDisplay;
    }
    return formatMqValue(getProp(entity, "mq"));
}

function closeInfoPanel() {
    if (isDiagramMode()) return;
    infoPanel.classList.add("hidden");
}

function openInfoPanel() {
    infoPanel.classList.remove("hidden");
}

closePanel.addEventListener("click", closeInfoPanel);

function getAllLotti() {
    return viewer.entities.values.filter(entity =>
        entity.polygon && entity.properties && entity.properties.categoria
    );
}

function getLottiByCategory(categoryName) {
    return getAllLotti().filter(entity => getProp(entity, "categoria") === categoryName);
}

function getFilteredLottiByCategory(categoryName) {
    const excludedIds = categoryFilterExcludedIds[categoryName];

    return getLottiByCategory(categoryName).filter(entity => {
        return !excludedIds || !excludedIds.has(entity.id);
    });
}

function isSfittoNoExtraInfo(stato) {
    return (
        stato === "SFITTA LOCABILE" ||
        stato === "SFITTA NON LOCABILE" ||
        stato === "AREA COMUNE"
    );
}

function isLocata(stato) {
    return stato === "LOCATA" || stato === "LOCATO";
}

function getSfittaNonLocabileBreakdownItems() {
    const azzurri = getLottiByCategory("azzurro")
        .map(entity => {
            const value = toNumberOrZero(getProp(entity, "sfittaNonLocabile"));
            return { entity, value };
        })
        .filter(item => item.value > 0);

    const areaComuni = viewer.entities.values
        .filter(entity => entity.id === "lotto Aree_Comuni")
        .map(entity => {
            const value = toNumberOrZero(getProp(entity, "mq"));
            return { entity, value };
        });

    return [...azzurri, ...areaComuni];
}

function getSfittaNonLocabileBreakdownLabel(entity) {
    const id = entity.id;

    if (id === "lotto_Torre_Servizi.1") return "Torre servizi";
    if (id === "lotto_5.1") return "Posti auto";
    if (id === "lotto_1.1") return "Lotto 1";
    if (id === "lotto_4.1") return "Lotto 4";
    if (id === "lotto Aree_Comuni") return "Aree Comuni";

    return entity.name || "Lotto";
}

function renderSingleLotInfo(entity) {
    infoEyebrow.textContent = "Dettaglio lotto";
    lotTitle.textContent = entity.name || "Lotto";

    const stato = formatValue(getProp(entity, "stato"));
    const mq = formatDisplayedMq(entity);
    const reddito = formatValue(getProp(entity, "reddito"));
    const scadenzaContratto = formatValue(getProp(entity, "scadenzaContratto"));
    const destinazioneUso = formatValue(getProp(entity, "destinazioneUso"));
    const categoriaConduttore = formatValue(getProp(entity, "categoriaConduttore"));

    const hideExtraInfo = isSfittoNoExtraInfo(stato);
    const showCategoriaConduttore = isLocata(stato);
    const showMqSfittaNonLocabile = stato === "SFITTA LOCABILE";
    const mqSfittaNonLocabile = formatMqValue(getProp(entity, "sfittaNonLocabile"));

    infoPanelBody.innerHTML = `
        <div class="info-grid">
            <div class="info-row">
                <span>Stato</span>
                <strong>${stato}</strong>
            </div>
            <div class="info-row">
                <span>MQ</span>
                <strong>${mq}</strong>
            </div>

            ${showMqSfittaNonLocabile ? `
                <div class="info-row">
                    <span>MQ sfitta non locabile</span>
                    <strong>${mqSfittaNonLocabile}</strong>
                </div>
            ` : ""}

            ${!hideExtraInfo ? `
                <div class="info-row">
                    <span>Reddito annuo</span>
                    <strong>${reddito}</strong>
                </div>
                <div class="info-row">
                    <span>Scadenza contratto</span>
                    <strong>${scadenzaContratto}</strong>
                </div>
                <div class="info-row">
                    <span>Destinazione d’uso</span>
                    <strong>${destinazioneUso}</strong>
                </div>
            ` : ""}

            ${showCategoriaConduttore ? `
                <div class="info-row">
                    <span>Categoria conduttore</span>
                    <strong>${categoriaConduttore}</strong>
                </div>
            ` : ""}
        </div>
    `;

    openInfoPanel();
}

function renderCategoryInfo(categoryName) {
    ensureStandardLayout();

    const items = getFilteredLottiByCategory(categoryName);
    const meta = categoryMeta[categoryName];

    infoEyebrow.textContent = meta?.eyebrow || "Categoria";
    lotTitle.textContent = meta?.title || categoryName;

    if (!items.length) {
        infoPanelBody.innerHTML = `
            <p class="info-empty">${meta?.empty || "Nessun elemento disponibile."}</p>
        `;
        openInfoPanel();
        return;
    }

    const baseTotalMq = items.reduce((sum, entity) => {
        return sum + toNumberOrZero(getProp(entity, "mq"));
    }, 0);

    const totalReddito = items.reduce((sum, entity) => {
        return sum + parseEuroValue(getProp(entity, "reddito"));
    }, 0);

    const isLocabileCategory = categoryName === "azzurro";
    const isLocatiCategory = categoryName === "rosso";

    const totalMq = isLocatiCategory
        ? baseTotalMq + POSTI_AUTO_LOCATA_MQ
        : baseTotalMq;

    const totalMqFormatted = formatMqTotal(totalMq);
    const totalRedditoFormatted = `€ ${totalReddito.toLocaleString("it-IT")}`;

    const cards = items.map(entity => {
        const stato = formatValue(getProp(entity, "stato"));
        const mq = formatDisplayedMq(entity);
        const reddito = formatValue(getProp(entity, "reddito"));
        const scadenzaContratto = formatValue(getProp(entity, "scadenzaContratto"));
        const destinazioneUso = formatValue(getProp(entity, "destinazioneUso"));
        const categoriaConduttore = formatValue(getProp(entity, "categoriaConduttore"));

        const hideExtraInfo = isSfittoNoExtraInfo(stato);
        const showCategoriaConduttore = isLocata(stato);

        return `
            <div class="lot-card">
                <div class="lot-card-title">${entity.name || "Lotto"}</div>
                <div class="lot-card-grid">
                    <div class="info-row">
                        <span>Stato</span>
                        <strong>${stato}</strong>
                    </div>
                    <div class="info-row">
                        <span>MQ</span>
                        <strong>${mq}</strong>
                    </div>

                    ${stato === "SFITTA LOCABILE" ? `
                        <div class="info-row">
                            <span>MQ sfitta non locabile</span>
                            <strong>${formatMqValue(getProp(entity, "sfittaNonLocabile"))}</strong>
                        </div>
                    ` : ""}

                    ${!hideExtraInfo ? `
                        <div class="info-row">
                            <span>Reddito annuo</span>
                            <strong>${reddito}</strong>
                        </div>
                        <div class="info-row">
                            <span>Scadenza contratto</span>
                            <strong>${scadenzaContratto}</strong>
                        </div>
                        <div class="info-row">
                            <span>Destinazione d’uso</span>
                            <strong>${destinazioneUso}</strong>
                        </div>
                    ` : ""}

                    ${showCategoriaConduttore ? `
                        <div class="info-row">
                            <span>Categoria conduttore</span>
                            <strong>${categoriaConduttore}</strong>
                        </div>
                    ` : ""}
                </div>
            </div>
        `;
    }).join("");

    infoPanelBody.innerHTML = `
        <div class="category-summary">
            <div class="summary-card">
                <span>Numero lotti</span>
                <strong>${items.length}</strong>
            </div>
            <div class="summary-card">
                <span>MQ totali</span>
                <strong>${totalMqFormatted}</strong>
            </div>
            ${isLocatiCategory ? `
                <div class="summary-card">
                    <span>Reddito annuo totale</span>
                    <strong>${totalRedditoFormatted}</strong>
                </div>
            ` : ""}
            ${isLocabileCategory ? `
                <div class="summary-card">
                    <span>MQ sfitta non locabile</span>
                    <strong>${formatMqTotal(SFITTA_NON_LOCABILE_TOTAL_MQ)}</strong>
                </div>
            ` : ""}
        </div>

        ${isLocatiCategory ? `
            <div class="lot-card-list">
                <div class="lot-card">
                    <div class="lot-card-title">Posti auto</div>
                    <div class="lot-card-grid">
                        <div class="info-row">
                            <span>MQ locati</span>
                            <strong>${formatMqTotal(POSTI_AUTO_LOCATA_MQ)}</strong>
                        </div>
                    </div>
                </div>
            </div>
        ` : ""}

        <div class="lot-card-list">
            ${cards}
        </div>
    `;

    openInfoPanel();
}

function renderTotalSurfaceInfo() {
    ensureStandardLayout();

    infoEyebrow.textContent = "Categoria";
    lotTitle.textContent = "Superficie totale";

    infoPanelBody.innerHTML = `
        <div class="category-summary">
            <div class="summary-card">
                <span>MQ totali</span>
                <strong>136.136</strong>
            </div>
        </div>
    `;

    openInfoPanel();
}

function renderNonLocabileTotalInfo() {
    ensureStandardLayout();

    infoEyebrow.textContent = "Categoria";
    lotTitle.textContent = "Sfitta non locabile";

    const breakdownCards = getSfittaNonLocabileBreakdownItems()
        .map(({ entity, value }) => `
            <div class="lot-card">
                <div class="lot-card-title">${getSfittaNonLocabileBreakdownLabel(entity)}</div>
                <div class="lot-card-grid">
                    <div class="info-row">
                        <span>MQ sfitta non locabile</span>
                        <strong>${formatMqValue(value)}</strong>
                    </div>
                </div>
            </div>
        `)
        .join("");

    infoPanelBody.innerHTML = `
        <div class="category-summary">
            <div class="summary-card">
                <span>MQ totali</span>
                <strong>${formatMqTotal(SFITTA_NON_LOCABILE_TOTAL_MQ)}</strong>
            </div>
        </div>

        <div class="lot-card-list">
            ${breakdownCards}
        </div>
    `;

    openInfoPanel();
}

function renderPostiAutoInfo() {
    ensureStandardLayout();

    infoEyebrow.textContent = "Categoria";
    lotTitle.textContent = "Posti auto";

    infoPanelBody.innerHTML = `
        <div class="category-summary">
            <div class="summary-card">
                <span>MQ totali</span>
                <strong>${formatMqTotal(POSTI_AUTO_TOTAL_MQ)}</strong>
            </div>
        </div>

        <div class="lot-card-list">
            <div class="lot-card">
                <div class="lot-card-grid">
                    <div class="info-row">
                        <span>Locata</span>
                        <strong>${formatMqTotal(POSTI_AUTO_LOCATA_MQ)}</strong>
                    </div>
                    <div class="info-row">
                        <span>Sfitta locabile</span>
                        <strong>${formatMqTotal(POSTI_AUTO_SFITTA_LOCABILE_MQ)}</strong>
                    </div>
                </div>
            </div>
        </div>
    `;

    openInfoPanel();
}

function renderDiagramInfoLegacy() {
    const items = getLotsByIds(DIAGRAM_LOT_IDS);
    const totalMq = items.reduce((sum, entity) => {
        return sum + toNumberOrZero(getProp(entity, "mq"));
    }, 0);

    const focusNames = items.map(entity => entity.name || "Lotto").join(" + ");
    const lotCards = items.map(entity => `
        <div class="lot-card">
            <div class="lot-card-title">${entity.name || "Lotto"}</div>
            <div class="lot-card-grid">
                <div class="info-row">
                    <span>Stato</span>
                    <strong>${formatValue(getProp(entity, "stato"))}</strong>
                </div>
                <div class="info-row">
                    <span>MQ</span>
                    <strong>${formatDisplayedMq(entity)}</strong>
                </div>
                <div class="info-row">
                    <span>Destinazione dâ€™uso</span>
                    <strong>${formatValue(getProp(entity, "destinazioneUso"))}</strong>
                </div>
            </div>
        </div>
    `).join("");

    infoEyebrow.textContent = "Modalita";
    lotTitle.textContent = "Diagramma";

    infoPanelBody.innerHTML = `
        <div class="category-summary">
            <div class="summary-card">
                <span>Lotti attivi</span>
                <strong>${items.length}</strong>
            </div>
            <div class="summary-card">
                <span>MQ in focus</span>
                <strong>${formatMqTotal(totalMq)}</strong>
            </div>
        </div>

        <div class="diagram-panel-shell">
            <div class="diagram-hero">
                <div class="diagram-placeholder">
                    <div class="diagram-placeholder-header">
                        <span class="diagram-kicker">Diagramma personalizzato</span>
                        <strong>Area pronta per il contenuto custom</strong>
                    </div>

                    <p class="diagram-placeholder-copy">
                        Questo spazio ospitera il diagramma definitivo mantenendo lo stesso linguaggio visivo dell'info panel.
                    </p>

                    <div class="diagram-placeholder-lines" aria-hidden="true">
                        <div class="diagram-placeholder-line long"></div>
                        <div class="diagram-placeholder-line medium"></div>
                        <div class="diagram-placeholder-line long"></div>
                        <div class="diagram-placeholder-line short"></div>
                    </div>
                </div>

                <div class="diagram-side">
                    <div class="summary-card">
                        <span>Focus corrente</span>
                        <strong>${focusNames}</strong>
                    </div>

                    <div class="lot-card">
                        <div class="lot-card-title">Stato modalita</div>
                        <div class="lot-card-grid">
                            <div class="info-row">
                                <span>Layout</span>
                                <strong>Scena 1/3 + panel 2/3</strong>
                            </div>
                            <div class="info-row">
                                <span>Legenda</span>
                                <strong>Nascosta</strong>
                            </div>
                        </div>
                    </div>

                    <div class="diagram-chip-row">
                        ${items.map(entity => `<span class="diagram-chip">${entity.name || "Lotto"}</span>`).join("")}
                    </div>
                </div>
            </div>

            <div class="lot-card-list">
                ${lotCards}
            </div>
        </div>
    `;

    openInfoPanel();
}

function renderDiagramInfo() {
    infoEyebrow.textContent = "";
    lotTitle.textContent = "";

    const assetRows = DIAGRAM_DATA.assetRows;
    const transformColumns = DIAGRAM_DATA.transformColumns;
    const transformRows = DIAGRAM_DATA.transformRows;

    const diagramMeta = DIAGRAM_DATA.fondo.map((item) => `
        <div class="diagram-meta-pill">
            <span class="diagram-meta-pill-label">${item.label}</span>
            <strong class="diagram-meta-pill-value${item.value ? "" : " is-empty"}">${item.value || "&nbsp;"}</strong>
        </div>
    `).join("");

    const assetRowsHtml = assetRows.map((row, index) => {
        const dividerClass = index === 0 ? "" : " diagram-matrix-divider";
        const gridRow = index + 2;

        return `
            <div class="diagram-label${dividerClass}" style="grid-column: 1; grid-row: ${gridRow};">${row.label}</div>
            <div class="diagram-matrix-value${dividerClass}" style="grid-column: 2; grid-row: ${gridRow};">${row.locati}</div>
            <div class="diagram-matrix-value${dividerClass}" style="grid-column: 3; grid-row: ${gridRow};">${row.locare}</div>
        `;
    }).join("");

    const transformRowsHtml = transformRows.map((row, index) => {
        const dividerClass = index === 0 ? "" : " diagram-matrix-divider";
        const gridRow = index + 2;
        const valueCells = transformColumns.map((column, columnIndex) => `
            <div class="diagram-matrix-value${dividerClass}" style="grid-column: ${columnIndex + 2}; grid-row: ${gridRow};">${row[column.key]}</div>
        `).join("");

        return `
            <div class="diagram-label${dividerClass}" style="grid-column: 1; grid-row: ${gridRow};">${row.label}</div>
            ${valueCells}
        `;
    }).join("");

    const transformTitlesHtml = transformColumns.map((column, index) => `
        <div class="diagram-matrix-title" style="grid-column: ${index + 2}; grid-row: 1;">${column.title}</div>
    `).join("");

    infoPanelBody.innerHTML = `
        <div class="diagram-board">
            <section class="diagram-strip">
                <div class="diagram-strip-title">${DIAGRAM_DATA.stripTitle}</div>
                <div class="diagram-strip-meta">
                    ${diagramMeta}
                </div>
            </section>

            <section class="diagram-section">
                <div class="diagram-section-scroll">
                    <div class="diagram-matrix diagram-matrix-dual">
                        <div class="diagram-matrix-surface" style="grid-column: 2; grid-row: 1 / span ${assetRows.length + 1};"></div>
                        <div class="diagram-matrix-surface" style="grid-column: 3; grid-row: 1 / span ${assetRows.length + 1};"></div>

                        <div class="diagram-matrix-title" style="grid-column: 2; grid-row: 1;">Asset locati</div>
                        <div class="diagram-matrix-title" style="grid-column: 3; grid-row: 1;">Asset da locare</div>

                        ${assetRowsHtml}
                    </div>
                </div>
            </section>

            <section class="diagram-section diagram-section-transform">
                <div class="diagram-section-heading">Asset da trasformare</div>

                <div class="diagram-section-scroll">
                    <div class="diagram-matrix diagram-matrix-transform">
                        <div class="diagram-matrix-surface" style="grid-column: 2 / span ${transformColumns.length}; grid-row: 1 / span ${transformRows.length + 1};"></div>

                        ${transformTitlesHtml}

                        ${transformRowsHtml}
                    </div>
                </div>
            </section>
        </div>
    `;

    openInfoPanel();
}

function activateDiagramFilter(button) {
    setActiveFilter(button);

    if (!isDiagramMode()) {
        savedStandardOrbitState = getCurrentOrbitState();
    }

    currentLayoutMode = "diagram";
    document.body.classList.add("diagram-mode");

    showOnlyLotsByIds(DIAGRAM_LOT_IDS);
    renderDiagramInfo();
    focusDiagramCamera();
}

function getLotsByIds(ids) {
    return viewer.entities.values.filter(entity => ids.includes(entity.id));
}

function showOnlyLotsByIds(ids) {
    getAllLotti().forEach(entity => {
        entity.show = ids.includes(entity.id);
    });

    refreshLotLabelsVisibility();
    applyLotLabelResponsiveStyles();
}

function renderLotsGroupInfo(ids, title, eyebrow = "Categoria") {
    const items = getLotsByIds(ids);

    infoEyebrow.textContent = eyebrow;
    lotTitle.textContent = title;

    if (!items.length) {
        infoPanelBody.innerHTML = `
            <p class="info-empty">Nessun lotto disponibile.</p>
        `;
        openInfoPanel();
        return;
    }

    const totalMq = items.reduce((sum, entity) => {
        return sum + toNumberOrZero(getProp(entity, "mq"));
    }, 0);

    const cards = items.map(entity => {
        const stato = formatValue(getProp(entity, "stato"));
        const mq = formatDisplayedMq(entity);
        const reddito = formatValue(getProp(entity, "reddito"));
        const scadenzaContratto = formatValue(getProp(entity, "scadenzaContratto"));
        const destinazioneUso = formatValue(getProp(entity, "destinazioneUso"));
        const categoriaConduttore = formatValue(getProp(entity, "categoriaConduttore"));

        const hideExtraInfo = isSfittoNoExtraInfo(stato);
        const showCategoriaConduttore = isLocata(stato);

        return `
            <div class="lot-card">
                <div class="lot-card-title">${entity.name || "Lotto"}</div>
                <div class="lot-card-grid">
                    <div class="info-row">
                        <span>Stato</span>
                        <strong>${stato}</strong>
                    </div>
                    <div class="info-row">
                        <span>MQ</span>
                        <strong>${mq}</strong>
                    </div>

                    ${stato === "SFITTA LOCABILE" ? `
                        <div class="info-row">
                            <span>MQ sfitta non locabile</span>
                            <strong>${formatMqValue(getProp(entity, "sfittaNonLocabile"))}</strong>
                        </div>
                    ` : ""}

                    ${!hideExtraInfo ? `
                        <div class="info-row">
                            <span>Reddito annuo</span>
                            <strong>${reddito}</strong>
                        </div>
                        <div class="info-row">
                            <span>Scadenza contratto</span>
                            <strong>${scadenzaContratto}</strong>
                        </div>
                        <div class="info-row">
                            <span>Destinazione d’uso</span>
                            <strong>${destinazioneUso}</strong>
                        </div>
                    ` : ""}

                    ${showCategoriaConduttore ? `
                        <div class="info-row">
                            <span>Categoria conduttore</span>
                            <strong>${categoriaConduttore}</strong>
                        </div>
                    ` : ""}
                </div>
            </div>
        `;
    }).join("");

    infoPanelBody.innerHTML = `
        <div class="category-summary">
            <div class="summary-card">
                <span>Numero lotti</span>
                <strong>${items.length}</strong>
            </div>
            <div class="summary-card">
                <span>MQ totali</span>
                <strong>${formatMqTotal(totalMq)}</strong>
            </div>
        </div>

        <div class="lot-card-list">
            ${cards}
        </div>
    `;

    openInfoPanel();
}

function showTransformabileLots() {
    ensureStandardLayout();
    showOnlyLotsByIds(["lotto_2", "lotto_3"]);
}

function renderTransformabileInfo() {
    ensureStandardLayout();
    renderLotsGroupInfo(
        ["lotto_2", "lotto_3"],
        "Sfitta C.T. trasformabile"
    );
}

function showAllLotti() {
    ensureStandardLayout();

    getAllLotti().forEach(entity => {
        entity.show = true;
    });

    refreshLotLabelsVisibility();
}

function hideAllLotti() {
    ensureStandardLayout();

    getAllLotti().forEach(entity => {
        entity.show = false;
    });

    refreshLotLabelsVisibility();
}

function showOnlyCategory(categoryName) {
    ensureStandardLayout();

    const visibleIds = new Set(
        getFilteredLottiByCategory(categoryName).map(entity => entity.id)
    );

    getAllLotti().forEach(entity => {
        entity.show = visibleIds.has(entity.id);
    });

    refreshLotLabelsVisibility();
}

function setActiveFilter(clickedButton) {
    const buttons = document.querySelectorAll("#filterBar button");
    buttons.forEach(button => button.classList.remove("active"));
    clickedButton.classList.add("active");
}

function setFilterAndShowCategory(button, categoryName) {
    setActiveFilter(button);
    ensureStandardLayout();
    showOnlyCategory(categoryName);
    renderCategoryInfo(categoryName);
}

window.showAllLotti = showAllLotti;
window.hideAllLotti = hideAllLotti;
window.showOnlyCategory = showOnlyCategory;
window.setActiveFilter = setActiveFilter;
window.setFilterAndShowCategory = setFilterAndShowCategory;
window.closeInfoPanel = closeInfoPanel;
window.renderTotalSurfaceInfo = renderTotalSurfaceInfo;
window.renderNonLocabileTotalInfo = renderNonLocabileTotalInfo;
window.renderPostiAutoInfo = renderPostiAutoInfo;
window.showTransformabileLots = showTransformabileLots;
window.renderTransformabileInfo = renderTransformabileInfo;
window.activateDiagramFilter = activateDiagramFilter;

// =========================
// BLINK POLIGONO
// =========================

function blinkPolygon(entity) {
    if (!entity || !entity.polygon) return;
    if (entity._isBlinking) return;

    entity._isBlinking = true;

    const polygon = entity.polygon;
    const now = Cesium.JulianDate.now();

    let baseColor = Cesium.Color.RED.withAlpha(0.35);

    if (polygon.material instanceof Cesium.ColorMaterialProperty) {
        const c = polygon.material.color?.getValue(now);
        if (c) baseColor = Cesium.Color.clone(c);
    } else if (polygon.material && polygon.material.red !== undefined) {
        baseColor = Cesium.Color.clone(polygon.material);
    }

    const highlightColor = new Cesium.Color(
        Cesium.Math.lerp(baseColor.red, 1.0, 0.20),
        Cesium.Math.lerp(baseColor.green, 1.0, 0.20),
        Cesium.Math.lerp(baseColor.blue, 1.0, 0.28),
        baseColor.alpha
    );

    const originalMaterial = polygon.material;
    const highlightMaterial = new Cesium.ColorMaterialProperty(highlightColor);

    polygon.material = highlightMaterial;

    setTimeout(() => {
        polygon.material = originalMaterial;
        entity._isBlinking = false;
    }, 420);
}

// =========================
// LABEL LOTTI
// =========================

const lotLabelEntities = [];

function getEntityHierarchy(entity) {
    const hierarchyProperty = entity?.polygon?.hierarchy;
    if (!hierarchyProperty) return null;

    return hierarchyProperty.getValue
        ? hierarchyProperty.getValue(Cesium.JulianDate.now())
        : hierarchyProperty;
}

function isTabletLandscapeViewport() {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
        return false;
    }

    return window.matchMedia("(orientation: landscape) and (min-width: 1024px) and (max-width: 1400px) and (max-height: 950px)").matches;
}

function getLotLabelAppearance() {
    if (isTabletLandscapeViewport()) {
      return {
        font: "900 25px Inter, system-ui, sans-serif",
        outlineWidth: 1,
        backgroundPadding: new Cesium.Cartesian2(0, 0),
        scaleByDistance: new Cesium.NearFarScalar(180.0, 1.15, 2200.0, 0.92)
      };
    }

    return {
        font: "700 25px Inter, system-ui, sans-serif",
        outlineWidth: 1,
        backgroundPadding: new Cesium.Cartesian2(0, 0),
        scaleByDistance: new Cesium.NearFarScalar(180.0, 1.15, 2200.0, 0.92)
    };
}

function applyLotLabelResponsiveStyles() {
    const appearance = getLotLabelAppearance();

    lotLabelEntities.forEach((labelEntity) => {
        if (!labelEntity?.label) return;
        labelEntity.label.font = appearance.font;
        labelEntity.label.fillColor = Cesium.Color.fromCssColorString("#F6F3EE");
        labelEntity.label.outlineColor = Cesium.Color.fromCssColorString("rgba(0, 0, 0, 0.45)");
        labelEntity.label.outlineWidth = 1;
        labelEntity.label.style = Cesium.LabelStyle.FILL_AND_OUTLINE;
        labelEntity.label.showBackground = false;
        labelEntity.label.backgroundPadding = appearance.backgroundPadding;
        labelEntity.label.scaleByDistance = appearance.scaleByDistance;
    });
}

function getEntityPositions(entities) {
    return entities.flatMap(entity => getEntityHierarchy(entity)?.positions || []);
}

function getBoundingSphereFromEntities(entities) {
    const positions = getEntityPositions(entities);
    if (!positions.length) return null;

    return Cesium.BoundingSphere.fromPoints(positions);
}

function getCenterFromEntities(entities) {
    const positions = getEntityPositions(entities);

    if (!positions.length) return null;

    let lonSum = 0;
    let latSum = 0;
    let maxHeight = 0;

    positions.forEach((position) => {
        const cartographic = Cesium.Cartographic.fromCartesian(position);
        lonSum += cartographic.longitude;
        latSum += cartographic.latitude;
        maxHeight = Math.max(maxHeight, cartographic.height || 0);
    });

    const averageLon = lonSum / positions.length;
    const averageLat = latSum / positions.length;

    const extrudedHeights = entities.map(entity => {
        const extrudedHeightProperty = entity.polygon?.extrudedHeight;
        return extrudedHeightProperty?.getValue
            ? extrudedHeightProperty.getValue(Cesium.JulianDate.now())
            : extrudedHeightProperty;
    });

    const labelHeight = Math.max(maxHeight, ...extrudedHeights.filter(value => typeof value === "number"), 0) + 10;

    return Cesium.Cartesian3.fromRadians(averageLon, averageLat, labelHeight);
}

function buildLotLabelEntity(name, entities) {
    const labelPosition = getCenterFromEntities(entities);
    if (!labelPosition) return null;

    const primaryEntity = entities[0];
    const appearance = getLotLabelAppearance();

    const labelEntity = viewer.entities.add({
        id: `label_${primaryEntity.id}`,
        name,
        position: labelPosition,
        properties: {
            isLotLabel: true,
            linkedEntityId: primaryEntity.id
        },
        label: {
            text: name,
            font: appearance.font,
	    fillColor: Cesium.Color.fromCssColorString("#F6F3EE"),
            outlineColor: Cesium.Color.fromCssColorString("rgba(0, 0, 0, 0.45)"),
            outlineWidth: 1,
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            showBackground: false,
        /*  backgroundColor: Cesium.Color.fromCssColorString("rgba(11, 13, 16, 0.56)"), */
            backgroundPadding: appearance.backgroundPadding,
            horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
            verticalOrigin: Cesium.VerticalOrigin.CENTER,
            heightReference: Cesium.HeightReference.NONE,
            disableDepthTestDistance: Number.POSITIVE_INFINITY,
            distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 2200.0),
            scaleByDistance: appearance.scaleByDistance
        }
    });

    labelEntity._linkedEntities = entities;
    return labelEntity;
}

function addLabelsToAllLotti() {
    const groups = new Map();

    getAllLotti().forEach((entity) => {
        if (!entity?.name) return;

        if (entity.name === "Aree Comuni" && entity.id !== "lotto Aree_Comuni.1") {
            return;
        }

        if (!groups.has(entity.name)) {
            groups.set(entity.name, []);
        }
        groups.get(entity.name).push(entity);
    });

    groups.forEach((entities, name) => {
        const labelEntity = buildLotLabelEntity(name, entities);
        if (labelEntity) {
            lotLabelEntities.push(labelEntity);
        }
    });

    refreshLotLabelsVisibility();
}

function refreshLotLabelsVisibility() {
    lotLabelEntities.forEach((labelEntity) => {
        const linkedEntities = labelEntity._linkedEntities || [];
        labelEntity.show = linkedEntities.some(entity => entity.show !== false);
    });
}

// =========================
// LOTTI
// =========================

viewer.entities.add({
    id: "lotto_1",
    name: "Lotto 1",
    polygon: {
        hierarchy: Cesium.Cartesian3.fromDegreesArrayHeights([
            7.669682920358961, 45.039864034064706, 315,
            7.670000833548219, 45.03980590485238, 315,
            7.670318938597312, 45.04063164834883, 315,
            7.669580569333144, 45.04074560278736, 315,
            7.669460577623632, 45.04043366688667, 315,
            7.669617531803644, 45.040410790073125, 315,
            7.669591698240941, 45.040317694959754, 315,
            7.669717303334757, 45.04029692975781, 315,
            7.669737123179801, 45.0403448466232, 315,
            7.66977546708585, 45.04032429662781, 315,
            7.6697919583854155, 45.04031379481244, 315,
            7.669808213247382, 45.04028869786576, 315,
            7.669828550989401, 45.040261026534615, 315,
            7.6698247541066005, 45.040208677119324, 315
        ]),
        material: new Cesium.ColorMaterialProperty(
            Cesium.Color.RED.withAlpha(0.28)
        ),
        perPositionHeight: true,
        extrudedHeight: 285,
        outline: false
    },
    properties: {
        stato: "LOCATA",
        mq: 16.962,
        reddito: "€ 2.162.600",
        scadenzaContratto: "2039",
        destinazioneUso: "Uffici e filiale",
        categoriaConduttore: "Istituto credito",
        categoria: "rosso"
    }
});

viewer.entities.add({
    id: "lotto_1.1",
    name: "Lotto 1",
    polygon: {
        hierarchy: Cesium.Cartesian3.fromDegreesArrayHeights([
            7.669548504656439, 45.04074503375611, 315,
            7.669413289773711, 45.040442194161066, 315,
            7.668329340959576, 45.04061898148147, 315,
            7.668422288662742, 45.04088506252012, 315
        ]),
        material: new Cesium.ColorMaterialProperty(
            Cesium.Color.BLUE.withAlpha(0.28)
        ),
        perPositionHeight: true,
        extrudedHeight: 285,
        outline: false
    },
    properties: {
        stato: "SFITTA LOCABILE",
        mq: 8.725,
        reddito: "€ 0",
        scadenzaContratto: "-",
        destinazioneUso: "Uffici",
        sfittaNonLocabile: 2.417,
        categoria: "azzurro"
    }
});

viewer.entities.add({
    id: "lotto_2",
    name: "Lotto 2",
    polygon: {
        hierarchy: Cesium.Cartesian3.fromDegreesArrayHeights([
            7.66845928906384, 45.039829188714585, 315,
            7.668773145129371, 45.039759873324016, 315,
            7.66879254054785, 45.03975473447619, 315,
            7.669055063249236, 45.04049111485038, 315,
            7.668707964637738, 45.04056153957924, 315
        ]),
        material: new Cesium.ColorMaterialProperty(
            Cesium.Color.BLUE.withAlpha(0.28)
        ),
        perPositionHeight: true,
        extrudedHeight: 285,
        outline: false
    },
    properties: {
        stato: "SFITTA LOCABILE",
        mq: 11.905,
        reddito: "€ 0",
        scadenzaContratto: "-",
        destinazioneUso: "Uffici",
        sfittaNonLocabile: 0,
        categoria: "azzurro"
    }
});

viewer.entities.add({
    id: "lotto_3",
    name: "Lotto 3",
    polygon: {
        hierarchy: Cesium.Cartesian3.fromDegreesArrayHeights([
            7.669947429953458, 45.039528616641526, 315,
            7.669840795164153, 45.03925606377818, 315,
            7.668359320781613, 45.039560608104615, 315,
            7.66845928906384, 45.039829188714585, 315
        ]),
        material: new Cesium.ColorMaterialProperty(
            Cesium.Color.BLUE.withAlpha(0.28)
        ),
        perPositionHeight: true,
        extrudedHeight: 285,
        outline: false
    },
    properties: {
        stato: "SFITTA LOCABILE",
        mq: 16.146,
        reddito: "€ 0",
        scadenzaContratto: "-",
        destinazioneUso: "Uffici",
        sfittaNonLocabile: 0,
        categoria: "azzurro"
    }
});

viewer.entities.add({
    id: "lotto_4",
    name: "Lotto 4",
    polygon: {
        hierarchy: Cesium.Cartesian3.fromDegreesArrayHeights([
            7.668193338622921, 45.03957203815933, 303,
            7.668319410277379, 45.039862657536965, 303,
            7.667238746525035, 45.04008282320991, 303,
            7.667147630732319, 45.039788979930826, 303
        ]),
        material: new Cesium.ColorMaterialProperty(
            Cesium.Color.RED.withAlpha(0.28)
        ),
        perPositionHeight: true,
        extrudedHeight: 285,
        outline: false
    },
    properties: {
        stato: "LOCATA",
        mq: 8.909,
        reddito: "€ 1.136.000",
        scadenzaContratto: "2029-2035-2036",
        destinazioneUso: "Uffici",
        categoriaConduttore: "Assicurazioni, Ingegneria, IT, Selezione personale, Spedizioni",
        categoria: "rosso"
    }
});

viewer.entities.add({
    id: "lotto_4.1",
    name: "Lotto 4",
    polygon: {
        hierarchy: Cesium.Cartesian3.fromDegreesArrayHeights([
            7.668193338622921, 45.03957203815933, 315,
            7.668319410277379, 45.039862657536965, 315,
            7.667238746525035, 45.04008282320991, 315,
            7.667147630732319, 45.039788979930826, 315
        ]),
        material: new Cesium.ColorMaterialProperty(
            Cesium.Color.BLUE.withAlpha(0.28)
        ),
        perPositionHeight: true,
        extrudedHeight: 305,
        outline: false
    },
    properties: {
        stato: "SFITTA LOCABILE",
        mq: 3.490,
        reddito: "€ 0",
        scadenzaContratto: "-",
        destinazioneUso: "Uffici",
        sfittaNonLocabile: 2.283,
        categoria: "azzurro"
    }
});

viewer.entities.add({
    id: "lotto_Torre_Servizi",
    name: "Torre Servizi",
    polygon: {
        hierarchy: Cesium.Cartesian3.fromDegreesArrayHeights([
            7.6667666337555405, 45.039872252356474, 301,
            7.667117747366818, 45.03980055206348, 301,
            7.667230356821148, 45.04013912251528, 301,
            7.666873624678989, 45.040186298611495, 301
        ]),
        material: new Cesium.ColorMaterialProperty(
            Cesium.Color.RED.withAlpha(0.28)
        ),
        perPositionHeight: true,
        extrudedHeight: 285,
        outline: false
    },
    properties: {
        stato: "LOCATA",
        mq: 4.220,
        reddito: "€ 56.000",
        scadenzaContratto: "2027",
        destinazioneUso: "Uffici",
        categoriaConduttore: "Pubblica amministrazione",
        categoria: "rosso"
    }
});

viewer.entities.add({
    id: "lotto_Torre_Servizi.1",
    name: "Torre Servizi",
    polygon: {
        hierarchy: Cesium.Cartesian3.fromDegreesArrayHeights([
            7.6667666337555405, 45.039872252356474, 315,
            7.667117747366818, 45.03980055206348, 315,
            7.667230356821148, 45.04013912251528, 315,
            7.666873624678989, 45.040186298611495, 315
        ]),
        material: new Cesium.ColorMaterialProperty(
            Cesium.Color.BLUE.withAlpha(0.28)
        ),
        perPositionHeight: true,
        extrudedHeight: 303,
        outline: false
    },
    properties: {
        stato: "SFITTA LOCABILE",
        mq: 0.463,
        mqDisplay: "463",
        reddito: "-",
        scadenzaContratto: "-",
        destinazioneUso: "-",
        categoriaConduttore: "-",
        sfittaNonLocabile: 5.905,
        categoria: "azzurro"
    }
});

viewer.entities.add({
    id: "lotto_5",
    name: "Lotto 5",
    polygon: {
        hierarchy: Cesium.Cartesian3.fromDegreesArrayHeights([
            7.66756336997034, 45.04075698687579, 298,
            7.667849571783879, 45.04098722761579, 298,
            7.668385809028656, 45.04092950765938, 298,
            7.668300890461347, 45.040629359424464, 298
        ]),
        material: new Cesium.ColorMaterialProperty(
            Cesium.Color.RED.withAlpha(0.28)
        ),
        perPositionHeight: true,
        extrudedHeight: 285,
        outline: false
    },
    properties: {
        stato: "LOCATA",
        mq: 4.122,
        reddito: "€ 416.000",
        scadenzaContratto: "2026-2034",
        destinazioneUso: "Uffici ",
        categoriaConduttore: "Ente ricerca - società consulenza",
        categoria: "rosso"
    }
});

viewer.entities.add({
    id: "lotto_5.1",
    name: "Lotto 5",
    polygon: {
        hierarchy: Cesium.Cartesian3.fromDegreesArrayHeights([
            7.667752770843643, 45.04073459307708, 307,
            7.667849571783879, 45.04098722761579, 307,
            7.668385809028656, 45.04092950765938, 307,
            7.668300890461347, 45.040629359424464, 307
        ]),
        material: new Cesium.ColorMaterialProperty(
            Cesium.Color.BLUE.withAlpha(0.28)
        ),
        perPositionHeight: true,
        extrudedHeight: 300,
        outline: false
    },
    properties: {
        stato: "SFITTA LOCABILE",
        mq: 0.437,
        mqDisplay: "437",
        reddito: "-",
        scadenzaContratto: "-",
        destinazioneUso: "-",
        categoriaConduttore: "-",
        sfittaNonLocabile: 1.299,
        categoria: "azzurro"
    }
});

viewer.entities.add({
    id: "lotto Aree_Comuni",
    name: "Aree Comuni",
    polygon: {
        hierarchy: Cesium.Cartesian3.fromDegreesArrayHeights([
            7.6688211483942945, 45.03976315514184, 290,
            7.669076553890747, 45.040470736428304, 290,
            7.669580136299902, 45.0403963894802, 290,
            7.669543108972239, 45.04030644133368, 290,
            7.669715188392664, 45.04027533400087, 290,
            7.669786743003697, 45.04025963526682, 290,
            7.669792882731748, 45.04023352805794, 290,
            7.669799947522851, 45.04020972627815, 290,
            7.669791332399112, 45.04017214077779, 290,
            7.66965966142522, 45.03983936590053, 290,
            7.669766038495928, 45.03982095058333, 290,
            7.669860378126822, 45.03980217575174, 290,
            7.669990285142993, 45.03978841241423, 290,
            7.669907803502163, 45.039542686742706, 290
        ]),
        material: new Cesium.ColorMaterialProperty(
            Cesium.Color.GREEN.withAlpha(0.28)
        ),
        perPositionHeight: true,
        extrudedHeight: 300,
        outline: false
    },
    properties: {
        stato: "AREA COMUNE",
        mq: 36.434,
        sfittaNonLocabile: 36.434,
        categoria: "verde"
    }
});

viewer.entities.add({
    id: "lotto Aree_Comuni.1",
    name: "Aree Comuni",
    polygon: {
        hierarchy: Cesium.Cartesian3.fromDegreesArrayHeights([
            7.668656437813153, 45.04055075868196, 290,
            7.6684071625062185, 45.03988208751545, 290,
            7.667287094746827, 45.04010677247889, 290,
            7.6673022786546134, 45.04015136060794, 290,
            7.666916255414347, 45.0402116383147, 290,
            7.667556230769474, 45.040728826059706, 290
        ]),
        material: new Cesium.ColorMaterialProperty(
            Cesium.Color.GREEN.withAlpha(0.28)
        ),
        perPositionHeight: true,
        extrudedHeight: 300,
        outline: false
    },
    properties: {
        stato: "AREA COMUNE",
        mq: 36.434,
        sfittaNonLocabile: 36.434,
        categoria: "verde"
    }
});

addLabelsToAllLotti();
window.addEventListener("resize", () => {
    applyLotLabelResponsiveStyles();

    if (isDiagramMode()) {
        scheduleViewerLayoutSync();
    }
});

// =========================
// CLICK LOTTI
// =========================

const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

handler.setInputAction((movement) => {
    const pickedObject = viewer.scene.pick(movement.position);

    if (
        Cesium.defined(pickedObject) &&
        Cesium.defined(pickedObject.id) &&
        Cesium.defined(pickedObject.id.properties)
    ) {
        let entity = pickedObject.id;

        if (!entity.polygon && getProp(entity, "isLotLabel")) {
            const linkedEntityId = getProp(entity, "linkedEntityId");
            const linkedEntity = viewer.entities.getById(linkedEntityId);
            if (linkedEntity) {
                entity = linkedEntity;
            }
        }

        if (entity.polygon) {
            blinkPolygon(entity);

            if (!isDiagramMode()) {
                renderSingleLotInfo(entity);
            }
        }
    }
}, Cesium.ScreenSpaceEventType.LEFT_CLICK);

// =========================
// CLICK DESTRO DEBUG PUNTI
// =========================

const drawHandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

drawHandler.setInputAction((movement) => {
    const pickedPosition = viewer.scene.pickPosition(movement.position);

    if (!Cesium.defined(pickedPosition)) return;

    lottoPoints.push(pickedPosition);
    addPointMarker(pickedPosition);
    createLivePreview();

    const cartographic = Cesium.Cartographic.fromCartesian(pickedPosition);
    const lon = Cesium.Math.toDegrees(cartographic.longitude);
    const lat = Cesium.Math.toDegrees(cartographic.latitude);
    const height = cartographic.height;

    console.log("Punto aggiunto:");
    console.log("Lon:", lon);
    console.log("Lat:", lat);
    console.log("Height:", height);
}, Cesium.ScreenSpaceEventType.RIGHT_CLICK);

// stato iniziale
hideAllLotti();
