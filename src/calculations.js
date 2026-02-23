import  { lookup }from'./Parameters.js';

//helper function 
const round = (num, dp = 2) =>
  Math.round(num * 10**dp) / 10**dp;

//SOIL Layer base calculation
function calculateLayerBase(water_table, RLto, RLfrom, gamma, strataThickness, LayerBasePrevious) {

  if (water_table < RLto) {
    return LayerBasePrevious +(gamma * strataThickness);
  }

  if (RLfrom < water_table) {
    return LayerBasePrevious + ((gamma - 10) * strataThickness);
  }

  return LayerBasePrevious + (gamma * strataThickness) - (10 * (water_table - RLto));

}

//SOIL Critical length calculation
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

//SOIL Layer base capped calculation
function calculateLayerBaseCapped(water_table, RLto, criticalLengthPrev, gamma, criticalLength, RLfrom) {
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

//SOIL Mid layer capped calculation
function calculateMidLayer(critical_ratio, soilDepthFrom, layerBaseCappedPrev, layerBaseCapped) {
    let result;

    if (critical_ratio < soilDepthFrom){
      result = layerBaseCapped;
    } else {
      result = layerBaseCappedPrev + ((layerBaseCapped - layerBaseCappedPrev) / 2);
    }

    return result;

}

// SOIL ult shaft adhesion calculation
function calculateSoilAdhesion(ID, alpha, cu, F, midLayer) {
  let result;

  if (ID == 1){
    result = Math.min(60, alpha * cu);
  } else if (ID == 2){
    result = Math.min(100, F * midLayer);
  } else {
    result = 0;
  }

  return result;
}

//SOIL ult shaft riction calculation
function calculateSoilFriction(pile_diameter, strataThickness, soilAdhesion) {
  return Math.PI * pile_diameter / 1000 * strataThickness * soilAdhesion;
}

//ROCK socket length calculation
function calculateRockSocketLength(rockStrataThickness, rockRLfrom, rockRLto, Lmax, prevSum) {
  if ((rockRLfrom - rockRLto) <= Lmax) {
    return rockStrataThickness;
  } else { 
    return Math.min(Lmax -prevSum, rockStrataThickness);
  }
}

//ROCK adhesion settlement calculation
function calculateRockAdhesionSettlement(pile_diameter, rockTult, LmaxORLcompression) {
  return (Math.PI * pile_diameter / 1000 * rockTult * LmaxORLcompression);
}

//ROCK required socket length calculation
function calculateRequiredRockSocketLength(rockStrataThickness, rockRLfrom, rockRLto, ULS, prevSum) {
  if ((rockRLfrom - rockRLto) <= ULS) {
    return rockStrataThickness;
  } else { 
    return Math.min(ULS -prevSum, rockStrataThickness);
  }
}

//ROCL


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

//----------------------------------------- SOIL TABLE  -----------------------------------------------
export async function soilTable(inputs, soilRowAmount = 4) {

//------------------------------------- Inputs handling -------------------------------------------------
  const { rl_borehole, shaft_rl, socket_start, rl_pile_top, water_table, critical_ratio, 
    critical_length, pile_diameter } = inputs;
 
  // Collect soil depths and types dynamically
  const soilDepthTos = [];
  const soilTypes = [];
  const ID = [];
  for (let i = 1; i <= soilRowAmount; i++) {
    soilDepthTos.push(Number(inputs[`soilDepthTo${i}`]) || 0);
    soilTypes.push(inputs[`soilType${i}`] || '');
    ID.push(Number(inputs[`ID${i}`]) || 0);
  }

  // Check required inputs for active layers
  const requiredInputsFilled = soilDepthTos.slice(0, soilRowAmount).every(d => d) &&
                               soilTypes.slice(0, soilRowAmount).every(t => t) &&
                               ID.slice(0, soilRowAmount).every(id => id !== null && id !== undefined) && 
                               rl_borehole && shaft_rl  && socket_start &&
                               rl_pile_top && water_table && critical_ratio && 
                               critical_length && pile_diameter;

  if (!requiredInputsFilled) {
    const emptyResult = { soilDepthFrom1: '' };
    const keys = ['strataThickness','soilRLfrom','soilRLto','F','phi','alpha','cu','gamma','layerBase', 
                  'criticalLength', 'layerBaseCapped', 'midLayer', 'soilAdhesion', 'soilFriction'];
    keys.forEach(key => {
      for (let i = 1; i <= soilRowAmount; i++) {
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
  const midLayer = [];
  const soilAdhesion = [];
  const soilFriction = [];
  let soilTotal = 0;

//------------------------------------- Inputs handling -------------------------------------------------

  //Loop through rows 1 - soilRowAmount to calculate values
  for (let i = 0; i < soilRowAmount; i++) {
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
      calculateLayerBaseCapped(
        water_table,
        soilRLto[i],
        i === 0 ? 0 : layerBaseCapped[i-1],
        gamma[i],
        criticalLength[i],
        soilRLfrom[i]
      )
    );

    //Mid layer capped
    midLayer[i] = round(
      calculateMidLayer(
        critical_ratio,
        i === 0 ? soilDepthFrom1 : soilDepthTos[i - 1], // soilDepthFrom for current layer
        i === 0 ? 0 : layerBaseCapped[i-1],
        layerBaseCapped[i]
      )
    );

    //Soil adhesion
    soilAdhesion[i] = round(
      calculateSoilAdhesion(
        ID[i], // ID
        alpha[i],
        cu[i],
        F[i],
        midLayer[i]
      )
    );

    //Soil friction
    soilFriction[i] = round(
      calculateSoilFriction(
        pile_diameter,
        strataThickness[i], // soilDepthFrom for current layer
        soilAdhesion[i],
      )
    );
    
    //Calculate soil total
    soilTotal = soilTotal + soilFriction[i];

  }

  // Convert arrays to object with numbered keys for backward compatibility
  const result = { soilDepthFrom1, soilTotal };
  const keys = {strataThickness, soilRLfrom, soilRLto, F, phi, alpha, cu, gamma, layerBase, 
    criticalLength, layerBaseCapped, midLayer, soilAdhesion, soilFriction};
  Object.entries(keys).forEach(([key, arr]) => {
    for (let i = 0; i < soilRowAmount; i++) {
      result[`${key}${i+1}`] = arr[i];
    }
  });

  return result;
}

//----------------------------------------- ROCK TABLE  -----------------------------------------------
export async function rockTable(inputs, rockRowAmount = 3) {
//------------------------------------- Inputs handling -------------------------------------------------
// Declare individual inputs
  const { rl_borehole, soilRLto, Lmax_input, ULS, pile_diameter, actual_socket} = inputs;
  console.log(`actual socket input: ${actual_socket}`);
 
  // Declare group inputs 
  const rockDepthTos = [];
  const rockClasses = [];
  for (let i = 1; i <= rockRowAmount; i++) {
    rockDepthTos.push(Number(inputs[`rockDepthTo${i}`]) || 0);
    rockClasses.push(inputs[`rockClass${i}`] || '');
  }

  // If required inputs are filled in return empty box
  const requiredInputsFilled = rockDepthTos.slice(0, rockRowAmount).every(d => d) &&
                                rockClasses.slice(0, rockRowAmount).every(d => d)&&
                                 rl_borehole && soilRLto && pile_diameter;
  if (!requiredInputsFilled) {
    const emptyResult = { rockDepthFrom1: '' }; // outputs
    const keys = ['rockStrataThickness', 'rockRLfrom','rockRLto', 'Er', 'rockQbUlt', 'rockQbe', 'rockTult', 'C', 'rockPhi', 'rockV',
      'Lmax', 'rockAdhesionSettlement', 'Lcompression', 'rockAdhesion', 'rockLayer'
    ];
    keys.forEach(key => {
      for (let i = 1; i <= rockRowAmount; i++) {
        emptyResult[`${key}${i}`] = '';
      }
    });
    return emptyResult;
  }

  // Calculate rockDepthFrom1
  let rockDepthFrom1 = rl_borehole - soilRLto;

//------------------------------------- Inputs handling END -------------------------------------------------

  // Initialise outputs arrays to store results
  const rockStrataThickness = [];
  const rockRLfrom = [];
  const rockRLto = [];
  const Er = [];
  const rockQbUlt = [];
  const rockQbe = [];
  const rockTult = [];
  const C = [];
  const rockPhi = [];
  const rockV = [];
  const Lmax = [];
  const rockAdhesionSettlement = [];
  const Lcompression = [];
  const rockAdhesion = [];
  const rockLayer = [];
  const foundingRL = actual_socket - ULS;

  //Loop through rows 1 - rockRowAmount to calculate values
  for (let i = 0; i < rockRowAmount; i++) {
    // Strata thickness
    rockStrataThickness[i] = round(i === 0 ? rockDepthTos[i] - rockDepthFrom1 : rockDepthTos[i] - rockDepthTos[i-1]);

    // RL from/to
    rockRLfrom[i] = round(i === 0 ? rl_borehole - rockDepthFrom1 : rl_borehole - rockDepthTos[i-1]);
    rockRLto[i] = round(rl_borehole - rockDepthTos[i]);

    // Lookup rock properties
    Er[i] = round(await lookup(rockClasses[i], 16));
    rockQbUlt[i] = round(await lookup(rockClasses[i], 17));
    rockQbe[i] = round(await lookup(rockClasses[i], 18));
    rockTult[i] = round(await lookup(rockClasses[i], 19));
    C[i] = round(await lookup(rockClasses[i], 5));
    rockPhi[i] = round(await lookup(rockClasses[i], 6));
    rockV[i] = round(await lookup(rockClasses[i], 15));

    //Lmax
    Lmax[i] = round(calculateRockSocketLength(
      rockStrataThickness[i],
      rockRLfrom[0], // always use rockRLfrom1 for Lmax calculation as per Excel],
      rockRLto[i],
      Lmax_input,
      i == 0 ? 0 : Lmax.slice(0, i).reduce((acc, val) => acc + val, 0)
    ));

    //Rock adhesion settlement
    rockAdhesionSettlement[i] = round(calculateRockAdhesionSettlement(
      pile_diameter,
      rockTult[i],
      Lmax[i]
    ));

    //Lcompression
    Lcompression[i] = round(calculateRequiredRockSocketLength(
      rockStrataThickness[i],
      rockRLfrom[0], // always use rockRLfrom1 for required socket length calculation as per Excel
      rockRLto[i],
      ULS,
      i == 0 ? 0 : Lcompression.slice(0, i).reduce((acc, val) => acc + val, 0)
    ));

    //Rock adhesion
    rockAdhesion[i] = round(calculateRockAdhesionSettlement(
      pile_diameter,
      rockTult[i],
      Lcompression[i]
    ));

    //Rock layer
    if ((foundingRL <= rockRLfrom[i]) && (foundingRL > rockRLto[i])) {
      rockLayer[i] = 'Bearing layer';
    }else {
      rockLayer[i] = '';
    }
    console.log(`Founding RL: ${foundingRL}, rockRLfrom: ${rockRLfrom[i]}, rockRLto: ${rockRLto[i]}, rockLayer: ${rockLayer[i]}`);

  }

  // Calculate totals

  const ErTotal = Er.slice(0, rockRowAmount).reduce((acc, val) => acc + val, 0)
  const tultTotal = rockTult.slice(0, rockRowAmount).reduce((acc, val) => acc + val, 0);
  const CTotal = C.slice(0, rockRowAmount).reduce((acc, val) => acc + val, 0);
  const phiTotal = rockPhi.slice(0, rockRowAmount).reduce((acc, val) => acc + val, 0);
  const VTotal = rockV.slice(0, rockRowAmount).reduce((acc, val) => acc + val, 0);
  const LmaxTotal = Lmax.slice(0, rockRowAmount).reduce((acc, val) => acc + val, 0);
  const rockAdhesionSettlementTotal = rockAdhesionSettlement.slice(0, rockRowAmount).reduce((acc, val) => acc + val, 0);
  const LcompressionTotal = Lcompression.slice(0, rockRowAmount).reduce((acc, val) => acc + val, 0);
  const rockAdhesionTotal = Math.trunc(rockAdhesion.slice(0, rockRowAmount).reduce((acc, val) => acc + val, 0));

  // Convert arrays to object with numbered keys for backward compatibility e
  const result = { rockDepthFrom1, ErTotal, tultTotal, CTotal, phiTotal, VTotal, LmaxTotal, rockAdhesionSettlementTotal, LcompressionTotal, rockAdhesionTotal };
  const keys = {rockStrataThickness, rockRLfrom, rockRLto, Er, rockQbUlt, 
    rockQbe, rockTult, C, rockPhi, rockV, Lmax, rockAdhesionSettlement, Lcompression, rockAdhesion, rockLayer};
  Object.entries(keys).forEach(([key, arr]) => {
    for (let i = 0; i < rockRowAmount; i++) {
      result[`${key}${i+1}`] = arr[i];
    }
  });

  return result;

}

// Helper: check if all required inputs are filled
export function areInputsFilled(values) {
  return Object.values(values).every(val => val !== null && val !== undefined && val !== '');
}
