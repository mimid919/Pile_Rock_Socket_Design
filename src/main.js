import { initialInputsTable, soilTable } from './calculations.js';
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
  };

  const rowAmount = Number(document.getElementById('rowAmount')?.value) || 0;


  const derivedsoilTable = await soilTable(soilInputs, rowAmount  );

  setMultipleValues({...derivedsoilTable});

}

function updateSoilTableRows() {
  const rowAmount = Number(document.getElementById('rowAmount').value);
  const table = document.getElementById('soilTable');
  const rows = table.querySelectorAll('tbody tr');

  rows.forEach((row, index) => {
    if (index < rowAmount) {
      row.style.display = ''; // show
    } else {
      row.style.display = 'none'; // hide
    }
  });
}
// Call whenever rowAmount changes
document.getElementById('rowAmount').addEventListener('change', () => {
  updateSoilTableRows();
  updateSoilTable(); // optional: recalc only for visible layers
});


updateSoilTableRows(); // Initial call to set correct rows on page load




// Attach listeners to all inputs
document.addEventListener('DOMContentLoaded', async () => {
  inputIds.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;

    el.addEventListener('input', async () => {
      updateInitialTable();
      await updateSoilTable();
    });
  });

  // Initial call to populate _values and derived calculations
  updateInitialTable();
  await updateSoilTable();
});
