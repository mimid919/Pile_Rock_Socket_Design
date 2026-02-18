// Get numeric value from an input
export function getInputValue(id) {
  const el = document.getElementById(id);
  if (!el) return null;

  const value = parseFloat(el.value);
  return isNaN(value) ? null : value;
}


// Set value to an input OR table cell (td)
// tableHandler.js
export function setValue(id, value) {
  const el = document.getElementById(id);
  if (!el) {
    console.warn('No element found with id:', id);
    return;
  }

  if (el.tagName === 'INPUT') {
    el.value = value;
  } else {
    el.textContent = value;
  }
}



// Get multiple input values
export function getAllInputValues(ids) {
  const result = {};
  ids.forEach(id => {
    result[id] = getInputValue(id);
  });
  return result;
}

// Set multiple values at once
export function setMultipleValues(values) {
  Object.keys(values).forEach(id => setValue(id, values[id]));
}
