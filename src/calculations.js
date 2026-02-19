//helper function 
const round = (num, dp = 2) =>
  Math.round(num * 10**dp) / 10**dp;


//----------------------------------------- INITIAL TABLE -----------------------------------------------
export function initialInputsTable(inputs) {
  const { rl_pile_top, soil_ignore, critical_ratio, pile_diameter, socket_start, } = inputs;


  if (!areInputsFilled(inputs)) {
    return {
      shaft_rl: '',           // empty string instead of null
      critical_length: '',
      actual_socket: '',
      
    };
  }

  const shaft_rl = round(rl_pile_top - soil_ignore);
  const critical_length = round((critical_ratio * pile_diameter) / 1000);
  let actual_socket = -1;
  if ((rl_pile_top - 0.5 ) >  socket_start) {
    actual_socket = socket_start;
  } else {
    actual_socket = round(rl_pile_top - 0.5);
  }

  return { shaft_rl, critical_length, actual_socket };
}

//----------------------------------------- SOIL TABLE - STRATA THICKNESS -----------------------------------------------
export function soilTable(inputs){
  const { soilDepthTo1, soilDepthTo2, soilDepthTo3, soilDepthTo4, rl_borehole, shaft_rl, socket_start,
    rl_pile_top
    } = inputs;

  // All but shaft_rl are inputs
  if (!soilDepthTo1 || !soilDepthTo2 || !soilDepthTo3 || !soilDepthTo4 || !rl_borehole || !rl_pile_top || !socket_start) { 
    return {
      soilDepthFrom1: '',           
      strataThickness2: '',          
      strataThickness3: '',
      strataThickness4: '',
      soilRLfrom1: '',
      soilRLto1: '',
      soilRLfrom2: '',
      soilRLto2: '',
      soilRLfrom3: '',
      soilRLto3: '',
      soilRLfrom4: '',
      soilRLto4: '',
    };
  }

  //------------ STRATA THICKNESS section ----------------//

    // Different section, special case for depth from 1, as it is calculated from initial inputs table
    let soilDepthFrom1 ;
    if (shaft_rl > socket_start){
      soilDepthFrom1 = rl_borehole - shaft_rl;
      // console.log('returning l5- L9');
    } else {
      soilDepthFrom1 = '0.0';
    }

    const strataThickness2 = round(soilDepthTo2 - soilDepthFrom1);
    const strataThickness3 = round(soilDepthTo3 - soilDepthTo2);
    const strataThickness4 = round(soilDepthTo4 - soilDepthTo3);

    //------------ RL section ----------------//
    const soilRLfrom1 = round(rl_pile_top - soilDepthFrom1);
    const soilRLto1 = round(rl_pile_top - soilDepthTo1);
    const soilRLfrom2 = round(rl_pile_top - soilDepthTo1);
    const soilRLto2 = round(rl_pile_top - soilDepthTo2);
    const soilRLfrom3 = round(rl_pile_top - soilDepthTo2);
    const soilRLto3 = round(rl_pile_top - soilDepthTo3);
    const soilRLfrom4 = round(rl_pile_top - soilDepthTo3);
    const soilRLto4 = round(rl_pile_top - soilDepthTo4);



    // Return all outputs 
    return { 
      soilDepthFrom1,
      strataThickness2, 
      strataThickness3, 
      strataThickness4,
      soilRLfrom1,
      soilRLto1,
      soilRLfrom2,
      soilRLto2,
      soilRLfrom3,
      soilRLto3,
      soilRLfrom4,
      soilRLto4
    };
    
}



// Helper: check if all required inputs are filled
export function areInputsFilled(values) {
  return Object.values(values).every(val => val !== null && val !== undefined && val !== '');
}
