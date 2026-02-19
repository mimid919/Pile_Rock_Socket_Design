import { initialInputsTable, soilTable } from './calculations.js';
import { setMultipleValues } from './tableHandler.js';

// All inputs you want to watch
const inputIds = [
  'rl_borehole',
  'rl_pile_top',
  'soil_ignore',
  'critical_ratio',
  'pile_diameter',
  'socket_start',
  'soilDepthTo1',
  'soilDepthTo2',
  'soilDepthTo3',
  'soilDepthTo4'
];

// Generic function to update _value spans for any input
function updateValueSpans(inputId) {
  const inputEl = document.getElementById(inputId);
  if (!inputEl) return;

  const valueCells = document.querySelectorAll(`.${inputId}_value`);
  valueCells.forEach(cell => (cell.textContent = inputEl.value));
}



// Main update function — updates _values and runs calculations
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

function updateSoilTable() {
  inputIds.forEach(updateValueSpans);


  const soilInputs = {
    soilDepthTo1: Number(document.getElementById('soilDepthTo1')?.value) || 0,
    soilDepthTo2: Number(document.getElementById('soilDepthTo2')?.value) || 0,
    soilDepthTo3: Number(document.getElementById('soilDepthTo3')?.value) || 0,
    soilDepthTo4: Number(document.getElementById('soilDepthTo4')?.value) || 0,
    rl_borehole: Number(document.getElementById('rl_borehole')?.value) || 0,
    shaft_rl: Number(document.getElementById('shaft_rl')?.textContent) || 0,
    socket_start: Number(document.getElementById('socket_start')?.value) || 0,
    rl_pile_top: Number(document.getElementById('rl_pile_top')?.value) || 0,
  };


  const derivedsoilTable = soilTable(soilInputs);

  // 4️⃣ Update DOM or table with derived values
  setMultipleValues({...derivedsoilTable});

}


// Attach listeners to all inputs
document.addEventListener('DOMContentLoaded', () => {
  inputIds.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;

    el.addEventListener('input', () => {
      updateInitialTable();
      updateSoilTable();
    });
  });

  // Initial call to populate _values and derived calculations
  updateInitialTable();
  updateSoilTable();
});
