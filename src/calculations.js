import  { lookup }from'./Parameters.js';

//helper function 
const round = (num, dp = 2) =>
  Math.round(num * 10**dp) / 10**dp;

//Layer base calculation
function calculateLayerBase(water_table, RLto, RLfrom, gamma, strataThickness, LayerBasePrevious) {

  if (water_table < RLto) {
    return LayerBasePrevious +(gamma * strataThickness);
  }

  if (RLfrom < water_table) {
    return LayerBasePrevious + ((gamma - 10) * strataThickness);
  }

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
  console.log('soilTable() entered');
  const { soilDepthTo1, soilDepthTo2, soilDepthTo3, soilDepthTo4, soilDepthTo5, soilDepthTo6, rl_borehole, shaft_rl, socket_start,
    rl_pile_top, soilType1, soilType2, soilType3, soilType4, soilType5, soilType6, water_table
    } = inputs;

  // All but shaft_rl are inputs
  if (!soilDepthTo1 || !soilDepthTo2 || !soilDepthTo3 || !soilDepthTo4 || !soilDepthTo5 || !soilDepthTo6 
      || !rl_borehole || !rl_pile_top || !socket_start
      || !soilType1 || !soilType2 || !soilType3 || !soilType4 || !soilType5 || !soilType6
  ) { 
      const emptyResult = { soilDepthFrom1: '' };
      ['strataThickness','soilRLfrom','soilRLto','F','phi','alpha','cu','gamma','layerBase'].forEach(key => {
          for(let i=1; i<=6; i++){
              emptyResult[`${key}${i}`] = '';
          }
      });
      return emptyResult;
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

    //Automatation loop
    const soilDepthTos = [soilDepthTo1, soilDepthTo2, soilDepthTo3, soilDepthTo4, soilDepthTo5, soilDepthTo6];
    const soilTypes = [soilType1, soilType2, soilType3, soilType4, soilType5, soilType6];

    const strataThickness = [];
    const soilRLfrom = [];
    const soilRLto = [];
    const F = [];
    const phi = [];
    const alpha = [];
    const cu = [];
    const gamma = [];
    const layerBase = [];

    for (let i = 0; i < soilDepthTos.length; i++) {
      // Strata thickness
      strataThickness[i] = round(i === 0 ? soilDepthTos[i] - soilDepthFrom1 : soilDepthTos[i] - soilDepthTos[i-1]);

      // RL from/to
      soilRLfrom[i] = round(i === 0 ? rl_pile_top - soilDepthFrom1 : rl_pile_top - soilDepthTos[i-1]);
      soilRLto[i] = round(rl_pile_top - soilDepthTos[i]);

      // Drained soil parameters
      F[i] = round(await lookup(soilTypes[i], 23));
      phi[i] = round(await lookup(soilTypes[i], 8));

      // Unrained soil parameters
      alpha[i] = round(await lookup(soilTypes[i], 24));
      cu[i] = round(await lookup(soilTypes[i], 4));

      // Gamma
      gamma[i] = round(await lookup(soilTypes[i], 3));

      // Layer base
      layerBase[i] = round(
        calculateLayerBase(
          water_table,
          soilRLto[i],
          soilRLfrom[i],
          gamma[i],
          strataThickness[i],
          i === 0 ? 0 : layerBase[i-1]
        )
      );
    }    
    // Return all outputs 
    console.log('soilTable() completed calculations');
    return {
      soilDepthFrom1,
      strataThickness1: strataThickness[0],
      strataThickness2: strataThickness[1],
      strataThickness3: strataThickness[2],
      strataThickness4: strataThickness[3],
      strataThickness5: strataThickness[4],
      strataThickness6: strataThickness[5],

      soilRLfrom1: soilRLfrom[0],
      soilRLfrom2: soilRLfrom[1],
      soilRLfrom3: soilRLfrom[2],
      soilRLfrom4: soilRLfrom[3],
      soilRLfrom5: soilRLfrom[4],
      soilRLfrom6: soilRLfrom[5],

      soilRLto1: soilRLto[0],
      soilRLto2: soilRLto[1],
      soilRLto3: soilRLto[2],
      soilRLto4: soilRLto[3],
      soilRLto5: soilRLto[4],
      soilRLto6: soilRLto[5],

      F1: F[0],
      F2: F[1],
      F3: F[2],
      F4: F[3],
      F5: F[4],
      F6: F[5],

      phi1: phi[0],
      phi2: phi[1],
      phi3: phi[2],
      phi4: phi[3],
      phi5: phi[4],
      phi6: phi[5],

      alpha1: alpha[0],
      alpha2: alpha[1],
      alpha3: alpha[2],
      alpha4: alpha[3],
      alpha5: alpha[4],
      alpha6: alpha[5],

      cu1: cu[0],
      cu2: cu[1],
      cu3: cu[2],
      cu4: cu[3],
      cu5: cu[4],
      cu6: cu[5],

      gamma1: gamma[0],
      gamma2: gamma[1],
      gamma3: gamma[2],
      gamma4: gamma[3],
      gamma5: gamma[4],
      gamma6: gamma[5],

      layerBase1: layerBase[0],
      layerBase2: layerBase[1],
      layerBase3: layerBase[2],
      layerBase4: layerBase[3],
      layerBase5: layerBase[4],
      layerBase6: layerBase[5],
    };

    
}



// Helper: check if all required inputs are filled
export function areInputsFilled(values) {
  return Object.values(values).every(val => val !== null && val !== undefined && val !== '');
}
