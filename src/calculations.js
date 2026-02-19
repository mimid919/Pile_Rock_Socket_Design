import  { lookup }from'./Parameters.js';

//helper function 
const round = (num, dp = 2) =>
  Math.round(num * 10**dp) / 10**dp;

//Layer base calculation
function calculateLayerBase(water_table, RLto, RLfrom, gamma, strataThickness, LayerBasePrevious) {

  if (water_table < RLto) {
      console.log('step 1 passed');
    return LayerBasePrevious +(gamma * strataThickness);
  }

  if (RLfrom < water_table) {
      console.log('step 2 passed');
    return LayerBasePrevious + ((gamma - 10) * strataThickness);
  }
    console.log('step 3 passed');


  return LayerBasePrevious + (gamma * strataThickness) - (10 * (water_table - RLto));

}



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
  const { soilDepthTo1, soilDepthTo2, soilDepthTo3, soilDepthTo4, soilDepthTo5, soilDepthTo6, rl_borehole, shaft_rl, socket_start,
    rl_pile_top, soilType1, soilType2, soilType3, soilType4, water_table
    } = inputs;

  // All but shaft_rl are inputs
  if (!soilDepthTo1 || !soilDepthTo2 || !soilDepthTo3 || !soilDepthTo4 || !soilDepthTo5 || !soilDepthTo6 
        || !rl_borehole || !rl_pile_top || !socket_start
        || !soilType1 || !soilType2 || !soilType3 || !soilType4 || !soilType5 || !soilType6
     ) { 
        return {
          soilDepthFrom1: '',           
          strataThickness2: '',          
          strataThickness3: '',
          strataThickness4: '',
          strataThickness5: '',
          strataThickness6: '',
          soilRLfrom1: '',
          soilRLto1: '',
          soilRLfrom2: '',
          soilRLto2: '',
          soilRLfrom3: '',
          soilRLto3: '',
          soilRLfrom4: '',
          soilRLto4: '',
          soilRLfrom5: '',
          soilRLto5: '',
          soilRLfrom6: '',
          soilRLto6: '',
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
    const strataThickness5 = round(soilDepthTo5 - soilDepthTo4);
    const strataThickness6 = round(soilDepthTo6 - soilDepthTo5);
    //------------ RL section ----------------//
    const soilRLfrom1 = round(rl_pile_top - soilDepthFrom1);
    const soilRLto1 = round(rl_pile_top - soilDepthTo1);
    const soilRLfrom2 = round(rl_pile_top - soilDepthTo1);
    const soilRLto2 = round(rl_pile_top - soilDepthTo2);
    const soilRLfrom3 = round(rl_pile_top - soilDepthTo2);
    const soilRLto3 = round(rl_pile_top - soilDepthTo3);
    const soilRLfrom4 = round(rl_pile_top - soilDepthTo3);
    const soilRLto4 = round(rl_pile_top - soilDepthTo4);
    const soilRLfrom5 = round(rl_pile_top - soilDepthTo4);
    const soilRLto5 = round(rl_pile_top - soilDepthTo5);
    const soilRLfrom6 = round(rl_pile_top - soilDepthTo5);
    const soilRLto6 = round(rl_pile_top - soilDepthTo6);

    //------------ Drained Soil Parameters section ----------------//
    const F1 = round(await lookup(soilType1, 23));
    const F2 = round(await lookup(soilType2, 23));
    const F3 = round(await lookup(soilType3, 23));
    const F4 = round(await lookup(soilType4, 23));
    const F5 = round(await lookup(soilType5, 23));
    const F6 = round(await lookup(soilType6, 23));

    const phi1 = round(await lookup(soilType1, 8));
    const phi2 = round(await lookup(soilType2, 8));
    const phi3 = round(await lookup(soilType3, 8));
    const phi4 = round(await lookup(soilType4, 8));
    const phi5 = round(await lookup(soilType5, 8));
    const phi6 = round(await lookup(soilType6, 8));

    //------------ Unrained Soil Parameters section ----------------//
    const alpha1 = round(await lookup(soilType1, 24));
    const alpha2 = round(await lookup(soilType2, 24));
    const alpha3 = round(await lookup(soilType3, 24));
    const alpha4 = round(await lookup(soilType4, 24));
    const alpha5 = round(await lookup(soilType5, 24));
    const alpha6 = round(await lookup(soilType6, 24));

    const cu1 = round(await lookup(soilType1, 4));
    const cu2 = round(await lookup(soilType2, 4));
    const cu3 = round(await lookup(soilType3, 4));
    const cu4 = round(await lookup(soilType4, 4));
    const cu5 = round(await lookup(soilType5, 4));
    const cu6 = round(await lookup(soilType6, 4));

    //------------ Gamma section ----------------//
    const gamma1 = round(await lookup(soilType1, 3));
    const gamma2 = round(await lookup(soilType2, 3));
    const gamma3 = round(await lookup(soilType3, 3));
    const gamma4 = round(await lookup(soilType4, 3));
    const gamma5 = round(await lookup(soilType5, 3));
    const gamma6 = round(await lookup(soilType6, 3));

    //------------ Layer base section ----------------//
    const layerBase1 = round(calculateLayerBase(water_table, soilRLto1, soilRLfrom1, gamma1, strataThickness1, 0));
    const layerBase2 = round(calculateLayerBase(water_table, soilRLto2, soilRLfrom2, gamma2, strataThickness2, layerBase1));
    const layerBase3 = round(calculateLayerBase(water_table, soilRLto3, soilRLfrom3, gamma3, strataThickness3, layerBase2));
    const layerBase4 = round(calculateLayerBase(water_table, soilRLto4, soilRLfrom4, gamma4, strataThickness4, layerBase3));
    const layerBase5 = round(calculateLayerBase(water_table, soilRLto5, soilRLfrom5, gamma5, strataThickness5, layerBase4));
    const layerBase6 = round(calculateLayerBase(water_table, soilRLto6, soilRLfrom6, gamma6, strataThickness6, layerBase5));

    // Return all outputs 
    return { 
      soilDepthFrom1,
      strataThickness1,
      strataThickness2, 
      strataThickness3, 
      strataThickness4,
      strataThickness5,
      strataThickness6,
      soilRLfrom1,
      soilRLto1,
      soilRLfrom2,
      soilRLto2,
      soilRLfrom3,
      soilRLto3,
      soilRLfrom4,
      soilRLto4,
      soilRLfrom5,
      soilRLto5,
      soilRLfrom6,
      soilRLto6,
      F1,
      F2,
      F3,
      F4,
      F5,
      F6,
      phi1,
      phi2,
      phi3,
      phi4,
      phi5,
      phi6,
      alpha1,
      alpha2,
      alpha3,
      alpha4,
      alpha5,
      alpha6,
      cu1,
      cu2,
      cu3,
      cu4,
      cu5,
      cu6,
      gamma1,
      gamma2,
      gamma3,
      gamma4,
      gamma5,
      gamma6,
      layerBase1,
      layerBase2,
      layerBase3,
      layerBase4,
      layerBase5,
      layerBase6,
    };
    
}



// Helper: check if all required inputs are filled
export function areInputsFilled(values) {
  return Object.values(values).every(val => val !== null && val !== undefined && val !== '');
}
