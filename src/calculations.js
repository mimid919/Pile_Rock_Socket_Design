import  { lookup }from'./Parameters.js';

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
export async function soilTable(inputs){
  const { soilDepthTo1, soilDepthTo2, soilDepthTo3, soilDepthTo4, rl_borehole, shaft_rl, socket_start,
    rl_pile_top, soilType1, soilType2, soilType3, soilType4
    } = inputs;

  // All but shaft_rl are inputs
  if (!soilDepthTo1 || !soilDepthTo2 || !soilDepthTo3 || !soilDepthTo4 || !rl_borehole || !rl_pile_top || !socket_start
     || !soilType1 || !soilType2 || !soilType3 || !soilType4
  ) { 
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
    console.log('entered soilTable calc');

    const strataThickness1 = round(soilDepthTo1 - soilDepthFrom1);
    const strataThickness2 = round(soilDepthTo2 - soilDepthTo1);
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

    //------------ Drained Soil Parameters section ----------------//
    const F1 = round(await lookup(soilType1, 23));
    const F2 = round(await lookup(soilType2, 23));
    const F3 = round(await lookup(soilType3, 23));
    const F4 = round(await lookup(soilType4, 23));

    const phi1 = round(await lookup(soilType1, 8));
    const phi2 = round(await lookup(soilType2, 8));
    const phi3 = round(await lookup(soilType3, 8));
    const phi4 = round(await lookup(soilType4, 8));

    //------------ Unrained Soil Parameters section ----------------//
    const alpha1 = round(await lookup(soilType1, 24));
    const alpha2 = round(await lookup(soilType2, 24));
    const alpha3 = round(await lookup(soilType3, 24));
    const alpha4 = round(await lookup(soilType4, 24));

    const cu1 = round(await lookup(soilType1, 4));
    const cu2 = round(await lookup(soilType2, 4));
    const cu3 = round(await lookup(soilType3, 4));
    const cu4 = round(await lookup(soilType4, 4));

    //------------ Gamma section ----------------//
    const gamma1 = round(await lookup(soilType1, 3));
    const gamma2 = round(await lookup(soilType2, 3));
    const gamma3 = round(await lookup(soilType3, 3));
    const gamma4 = round(await lookup(soilType4, 3));

    //------------ Unrained Soil Parameters section ----------------//

    // Return all outputs 
    return { 
      soilDepthFrom1,
      strataThickness1,
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
      soilRLto4,
      F1,
      F2,
      F3,
      F4,
      phi1,
      phi2,
      phi3,
      phi4,
      alpha1,
      alpha2,
      alpha3,
      alpha4,
      cu1,
      cu2,
      cu3,
      cu4,
      gamma1,
      gamma2,
      gamma3,
      gamma4,
    };
    
}



// Helper: check if all required inputs are filled
export function areInputsFilled(values) {
  return Object.values(values).every(val => val !== null && val !== undefined && val !== '');
}
