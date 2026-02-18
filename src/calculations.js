
//----------------------------------------- INITIAL TABLE -----------------------------------------------
export function initialInputsTable(inputs) {
  const { rl_pile_top, soil_ignore, critical_ratio, pile_diameter, socket_start } = inputs;

  if (!areInputsFilled(inputs)) {
    return {
      shaft_rl: '',           // empty string instead of null
      critical_length: '',
      actual_socket: ''
    };
  }

  const shaft_rl = rl_pile_top - soil_ignore;
  const critical_length = (critical_ratio * pile_diameter) / 1000;
  let actual_socket = -1;
  if ((rl_pile_top - 0.5 ) >  socket_start) {
    actual_socket = socket_start;
  } else {
    actual_socket = rl_pile_top - 0.5;
  }

  return { shaft_rl, critical_length, actual_socket };
}

//----------------------------------------- SOIL TABLE - STRATA THICKNESS -----------------------------------------------
export function soilStrataThickness(inputs){
    const { soilDepthTo1, soilDepthTo2, soilDepthTo3, soilDepthTo4,  } = inputs;

  if (!areInputsFilled(inputs)) {
    return {
      strataThickness2: '',           // empty string instead of null
      strataThickness3: '',
      strataThickness4: ''
    };
  }

    const strataThickness2 = soilDepthTo2 - soilDepthTo1;
    const strataThickness3 = soilDepthTo3 - soilDepthTo2;
    const strataThickness4 = soilDepthTo4 - soilDepthTo3;

    return { strataThickness2, strataThickness3, strataThickness4 };
    
}



// Helper: check if all required inputs are filled
export function areInputsFilled(values) {
  return Object.values(values).every(val => val !== null && val !== undefined && val !== '');
}
