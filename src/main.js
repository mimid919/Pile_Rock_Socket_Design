import { initialInputsTable, soilTable, rockTable } from './calculations.js';
import { setMultipleValues } from './tableHandler.js';

// All inputs you want to update to using "_value" and add event listeners
const inputIds = [
  'rl_borehole',
  'rl_pile_top',
  'soil_ignore',
  'water_table',
  'socket_ignore',
  'critical_ratio',
  'pile_diameter',
  'socket_start',
  'uls',
  'sls',
  'settlement',
  'soilDepthTo1',
  'soilDepthTo2',
  'soilDepthTo3',
  'soilDepthTo4',
  'soilDepthTo5',
  'soilDepthTo6',
  'soilType1',
  'soilType2',
  'soilType3',
  'soilType4',
  'soilType5',
  'soilType6',
  'ID1',
  'ID2',
  'ID3',
  'ID4',
  'ID5',
  'ID6',
  'ID7',
  'ID8',
  'ID9',
  'ID10',
  'Lmax',
  'ULS',
  'rockDepthTo1',
  'rockDepthTo2',
  'rockDepthTo3',
  'rockDepthTo4',
  'rockDepthTo5',
  'rockDepthTo6',
  'rockDepthTo7',
  'rockDepthTo8',
  'rockDepthTo9',
  'rockDepthTo10',
  'rockClass1',
  'rockClass2',
  'rockClass3',
  'rockClass4',
  'rockClass5',
  'rockClass6',
  'rockClass7',
  'rockClass8',
  'rockClass9',
  'rockClass10',
];

// Generic function to update _value spans for any input
function updateValueSpans(inputId) {
  const inputEl = document.getElementById(inputId);
  if (!inputEl) return;

  const valueCells = document.querySelectorAll(`.${inputId}_value`);
  valueCells.forEach(cell => (cell.textContent = inputEl.value));
}



//---------------------------- INITIAL TABLE -----------------------
function updateInitialTable() {
  inputIds.forEach(updateValueSpans);

  const initialInputs = {
    rl_pile_top: Number(document.getElementById('rl_pile_top')?.value) || 0,
    soil_ignore: Number(document.getElementById('soil_ignore')?.value) || 0,
    critical_ratio: Number(document.getElementById('critical_ratio')?.value) || 0,
    pile_diameter: Number(document.getElementById('pile_diameter')?.value) || 0,
    socket_start: Number(document.getElementById('socket_start')?.value) || 0,
  };

  const derivedInitial = initialInputsTable(initialInputs);

  // 4️⃣ Update DOM or table with derived values
  setMultipleValues({...derivedInitial,});

}

//---------------------------- SOIL TABLE ---------------------------
async function updateSoilTable() {
  inputIds.forEach(updateValueSpans);


  const soilInputs = {
    soilDepthTo1: Number(document.getElementById('soilDepthTo1')?.value) || 0,
    soilDepthTo2: Number(document.getElementById('soilDepthTo2')?.value) || 0,
    soilDepthTo3: Number(document.getElementById('soilDepthTo3')?.value) || 0,
    soilDepthTo4: Number(document.getElementById('soilDepthTo4')?.value) || 0,
    soilDepthTo5: Number(document.getElementById('soilDepthTo5')?.value) || 0,
    soilDepthTo6: Number(document.getElementById('soilDepthTo6')?.value) || 0,
    
    rl_borehole: Number(document.getElementById('rl_borehole')?.value) || 0,
    shaft_rl: Number(document.getElementById('shaft_rl')?.textContent) || 0,
    socket_start: Number(document.getElementById('socket_start')?.value) || 0,
    rl_pile_top: Number(document.getElementById('rl_pile_top')?.value) || 0,
    soilType1: document.getElementById('soilType1')?.value || '',
    soilType2: document.getElementById('soilType2')?.value || '',
    soilType3: document.getElementById('soilType3')?.value || '',
    soilType4: document.getElementById('soilType4')?.value || '',
    soilType5: document.getElementById('soilType5')?.value || '',
    soilType6: document.getElementById('soilType6')?.value || '',
    water_table: Number(document.getElementById('water_table')?.value) || 0,
    critical_ratio: Number(document.getElementById('critical_ratio')?.value) || 0,
    critical_length: Number(document.getElementById('critical_length')?.textContent) || 0,
    ID1: Number(document.getElementById('ID1')?.value) || 0,
    ID2: Number(document.getElementById('ID2')?.value) || 0,
    ID3: Number(document.getElementById('ID3')?.value) || 0,
    ID4: Number(document.getElementById('ID4')?.value) || 0,
    ID5: Number(document.getElementById('ID5')?.value) || 0,
    ID6: Number(document.getElementById('ID6')?.value) || 0,
    pile_diameter: Number(document.getElementById('pile_diameter')?.value) || 0,
  };

  const soilRowAmount = Number(document.getElementById('soilRowAmount')?.value) || 0;


  const derivedsoilTable = await soilTable(soilInputs, soilRowAmount  );

  setMultipleValues({...derivedsoilTable});

}

//---------------------------- ROCK TABLE ---------------------------
async function updateRockTable() {
  inputIds.forEach(updateValueSpans);

  //Calculating rockDepthFrom1 requires soilRLto of the last soil layer, so we need to get that first before calling rockTable
  const soilRowAmount = Number(document.getElementById('soilRowAmount')?.value) || 0;


  const rockInputs = { 
    rl_borehole: Number(document.getElementById('rl_borehole')?.value) || 0,
    // For caclulating rockDepthFrom1
    soilRLto: Number(document.getElementById(`soilRLto${soilRowAmount}`)?.textContent) || 0,

    rockDepthTo1: Number(document.getElementById('rockDepthTo1')?.value) || 0,
    rockDepthTo2: Number(document.getElementById('rockDepthTo2')?.value) || 0,
    rockDepthTo3: Number(document.getElementById('rockDepthTo3')?.value) || 0,
    rockDepthTo4: Number(document.getElementById('rockDepthTo4')?.value) || 0,
    rockDepthTo5: Number(document.getElementById('rockDepthTo5')?.value) || 0,
    rockDepthTo6: Number(document.getElementById('rockDepthTo6')?.value) || 0,
    rockDepthTo7: Number(document.getElementById('rockDepthTo7')?.value) || 0,
    rockDepthTo8: Number(document.getElementById('rockDepthTo8')?.value) || 0,
    rockDepthTo9: Number(document.getElementById('rockDepthTo9')?.value) || 0,
    rockDepthTo10: Number(document.getElementById('rockDepthTo10')?.value) || 0,

    rockClass1: document.getElementById('rockClass1')?.value || '',
    rockClass2: document.getElementById('rockClass2')?.value || '',
    rockClass3: document.getElementById('rockClass3')?.value || '',
    rockClass4: document.getElementById('rockClass4')?.value || '',
    rockClass5: document.getElementById('rockClass5')?.value || '',
    rockClass6: document.getElementById('rockClass6')?.value || '',
    rockClass7: document.getElementById('rockClass7')?.value || '',
    rockClass8: document.getElementById('rockClass8')?.value || '',
    rockClass9: document.getElementById('rockClass9')?.value || '',
    rockClass10: document.getElementById('rockClass10')?.value || '',

    Lmax_input: Number(document.getElementById('Lmax')?.value) || 0,

    ULS: Number(document.getElementById('ULS')?.value) || 0,

    pile_diameter : Number(document.getElementById('pile_diameter')?.value) || 0,

    actual_socket: Number(document.getElementById('actual_socket')?.textContent) || 0,
    
    
  };

  const rockRowAmount = Number(document.getElementById('rockRowAmount')?.value) || 0;


  const derivedRockTable = await rockTable(rockInputs, rockRowAmount);

  setMultipleValues({...derivedRockTable});

}


// Update soil table rows based on soilRowAmount
async function updateSoilTableRows() {
  const soilRowAmount = Number(document.getElementById('soilRowAmount').value);
  const table = document.getElementById('soilTable');
  const rows = table.querySelectorAll('tbody tr');

  rows.forEach((row, index) => {
    if (index < soilRowAmount) {
      row.style.display = ''; // show
    } else {
      row.style.display = 'none'; // hide
    }
  });
}

// Call whenever soilRowAmount changes
document.getElementById('soilRowAmount').addEventListener('change', () => {
  updateSoilTableRows();
  updateSoilTable(); // optional: recalc only for visible layers
});

// Update rock table rows based on soilRowAmount
function updateRockTableRows() {
  const soilRowAmount = Number(document.getElementById('rockRowAmount').value);
  const table = document.getElementById('rockTable');
  const rows = table.querySelectorAll('tbody tr');

  rows.forEach((row, index) => {
    if (index < soilRowAmount) {
      row.style.display = ''; // show
    } else {
      row.style.display = 'none'; // hide
    }
  });
}

// Call whenever soilRowAmount changes
document.getElementById('rockRowAmount').addEventListener('change', () => {
  updateRockTableRows();
  updateRockTable(); // optional: recalc only for visible layers
});


updateSoilTableRows(); // Initial call to set correct rows on page load
updateRockTableRows(); // Initial call to set correct rows on page load




// Attach listeners to all inputs
document.addEventListener('DOMContentLoaded', async () => {
  inputIds.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;

    el.addEventListener('input', async () => {
      updateInitialTable();
      await updateSoilTable();
      await updateRockTable();
    });
  });

  // Initial call to populate _values and derived calculations
  updateInitialTable();
  await updateSoilTable();
  await updateRockTable();});
