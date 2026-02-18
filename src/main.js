import { initialInputsTable, soilStrataThickness } from './calculations.js';
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
function updateTable() {
  // 1️⃣ Update all _value spans
  inputIds.forEach(updateValueSpans);

  const initialInputs = {
    rl_pile_top: document.getElementById('rl_pile_top')?.value,
    soil_ignore: document.getElementById('soil_ignore')?.value,
    critical_ratio: document.getElementById('critical_ratio')?.value,
    pile_diameter: document.getElementById('pile_diameter')?.value,
    socket_start: document.getElementById('socket_start')?.value,
  };

  const soilStrataInputs = {
    soilDepthTo1: document.getElementById('soilDepthTo1')?.value,
    soilDepthTo2: document.getElementById('soilDepthTo2')?.value,
    soilDepthTo3: document.getElementById('soilDepthTo3')?.value,
    soilDepthTo4: document.getElementById('soilDepthTo4')?.value,
  };


  const derivedInitial = initialInputsTable(initialInputs);
  const derivedSoilStrataThickness = soilStrataThickness(soilStrataInputs);

  // 4️⃣ Update DOM or table with derived values
  setMultipleValues({...derivedInitial, ...derivedSoilStrataThickness});

}

// Attach listeners to all inputs
document.addEventListener('DOMContentLoaded', () => {
  inputIds.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;

    el.addEventListener('input', updateTable);
  });

  // Initial call to populate _values and derived calculations
  updateTable();
});
