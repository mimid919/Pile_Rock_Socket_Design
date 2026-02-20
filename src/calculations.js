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

//Critical length calculation
function calculateCriticalLength(rl_pile_top, RLto, critical_length, strataThickness, prevSum) {
    let result;

    if ((rl_pile_top - RLto) < critical_length) {
        // Excel: IF($L$6-RLto < $L$11, strataThickness, ...)
        result = round(strataThickness);
        console.log(`Critical length for RLto ${RLto} is strataThickness: ${result}`);
    } else {
        // Excel: ELSE part: $L$11 - SUM(previous Q values)
        result = round(critical_length - prevSum);
        console.log(`Returning ${critical_length} - ${prevSum} = ${result}`);
    }

    return result;
}

//Layer base capped calculation
function calculateLayerBaseCappedValue(water_table, RLto, criticalLengthPrev, gamma, criticalLength, RLfrom) {
    let result;

    if (water_table < RLto) {
        // First inner IF
        result = criticalLengthPrev + (gamma * criticalLength);
    } else {
        // Second inner IF
        if (RLfrom < water_table) {
            result = criticalLengthPrev + ((gamma - 10) * criticalLength);
        } else {
            result = criticalLengthPrev + (gamma * criticalLength) - (10 * (water_table - RLto));
        }
    }

    return result;
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
export async function soilTable(inputs, rowAmount = 6) {

  const { rl_borehole, shaft_rl, socket_start, rl_pile_top, water_table, critical_ratio, critical_length } = inputs;
 
  // Collect soil depths and types dynamically
  const soilDepthTos = [];
  const soilTypes = [];
  for (let i = 1; i <= rowAmount; i++) {
    soilDepthTos.push(Number(inputs[`soilDepthTo${i}`]) || 0);
    soilTypes.push(inputs[`soilType${i}`] || '');
  }

  // Check required inputs for active layers
  const requiredInputsFilled = soilDepthTos.slice(0, rowAmount).every(d => d) &&
                               soilTypes.slice(0, rowAmount).every(t => t) &&
                               rl_borehole && rl_pile_top && socket_start;

  if (!requiredInputsFilled) {
    const emptyResult = { soilDepthFrom1: '' };
    const keys = ['strataThickness','soilRLfrom','soilRLto','F','phi','alpha','cu','gamma','layerBase'];
    keys.forEach(key => {
      for (let i = 1; i <= rowAmount; i++) {
        emptyResult[`${key}${i}`] = '';
      }
    });
    return emptyResult;
  }

  // Calculate soilDepthFrom1
  let soilDepthFrom1 = shaft_rl > socket_start ? rl_borehole - shaft_rl : 0;

  // Arrays to store results
  const strataThickness = [];
  const soilRLfrom = [];
  const soilRLto = [];
  const F = [];
  const phi = [];
  const alpha = [];
  const cu = [];
  const gamma = [];
  const layerBase = [];
  const criticalLength = [];
  const layerBaseCapped = [];
  // const midLayer = [];

  //Loop through rows 1 - rowAmount to calculate values
  for (let i = 0; i < rowAmount; i++) {
    // Strata thickness
    strataThickness[i] = round(i === 0 ? soilDepthTos[i] - soilDepthFrom1 : soilDepthTos[i] - soilDepthTos[i-1]);

    // RL from/to
    soilRLfrom[i] = round(i === 0 ? rl_pile_top - soilDepthFrom1 : rl_pile_top - soilDepthTos[i-1]);
    soilRLto[i] = round(rl_pile_top - soilDepthTos[i]);

    // Lookup soil properties
    F[i] = round(await lookup(soilTypes[i], 23));
    phi[i] = round(await lookup(soilTypes[i], 8));
    alpha[i] = round(await lookup(soilTypes[i], 24));
    cu[i] = round(await lookup(soilTypes[i], 4));
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

    // Critical length
  const prevSum = i === 0 ? 0 : criticalLength.slice(0, i).reduce((acc, val) => acc + val, 0);
  criticalLength[i] = calculateCriticalLength(
    rl_pile_top,
    soilRLto[i],
    critical_length,
    strataThickness[i],
    prevSum // only sum of previous critical lengths
  );

    //Layer base capped
    layerBaseCapped[i] = round(
      calculateLayerBaseCappedValue(
        water_table,
        soilRLto[i],
        i === 0 ? 0 : layerBaseCapped[i-1],
        gamma[i],
        criticalLength[i],
        soilRLfrom[i]
      )
    );
  

  }

  // Convert arrays to object with numbered keys for backward compatibility
  const result = { soilDepthFrom1 };
  const keys = {strataThickness, soilRLfrom, soilRLto, F, phi, alpha, cu, gamma, layerBase, criticalLength, layerBaseCapped};
  Object.entries(keys).forEach(([key, arr]) => {
    for (let i = 0; i < rowAmount; i++) {
      result[`${key}${i+1}`] = arr[i];
    }
  });

  return result;
}



// Helper: check if all required inputs are filled
export function areInputsFilled(values) {
  return Object.values(values).every(val => val !== null && val !== undefined && val !== '');
}
