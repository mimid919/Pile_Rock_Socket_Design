import  { lookup }from'./Parameters.js';

// Test cases for soil table drained soil parameters F
let searchValue = "UF-";
let columnToReturn = 23; // Column W
let result = lookup(searchValue, columnToReturn);
console.log("Result:", result, "expected = 0"); 

searchValue = "Q-1B";
columnToReturn = 23; // Column W
result = lookup(searchValue, columnToReturn);
console.log("Result:", result,"expected = 0");

searchValue = "RS-1A";
columnToReturn = 23; // Column W
result = lookup(searchValue, columnToReturn);
console.log("Result:", result, "expected = 0"); 

searchValue = "RS-1B";
columnToReturn = 23; // Column 
result = lookup(searchValue, columnToReturn);
console.log("Result :", result, "expected = 0"); 


// Test cases for soil table drained soil parameters phi
searchValue = "UF-";
columnToReturn = 8; // Column H
result = lookup(searchValue, columnToReturn);
console.log("Result :", result, "expected = 25");


searchValue = "Q-1B";
columnToReturn = 8; // Column H
result = lookup(searchValue, columnToReturn);
console.log("Result:", result,"expected = 25");

searchValue = "RS-1A";
columnToReturn = 8; // Column H
result = lookup(searchValue, columnToReturn);
console.log("Result :", result, "expected = 25"); 


searchValue = "RS-1B";
columnToReturn = 8; // Column H
result = lookup(searchValue, columnToReturn);
console.log("Result :", result, "expected = 25");

// Test cases for soil table undrained soil parameters alpha
 searchValue = "UF-";
 columnToReturn = 24; // Column W
result = lookup(searchValue, columnToReturn);
console.log("Result:", result, "expected = 0"); 

searchValue = "Q-1B";
columnToReturn = 24; // Column W
result = lookup(searchValue, columnToReturn);
console.log("Result:", result,"expected = 0.66");

searchValue = "RS-1A";
columnToReturn = 24; // Column W
result = lookup(searchValue, columnToReturn);
console.log("Result:", result, "expected = 0.66"); 

searchValue = "RS-1B";
columnToReturn = 24; // Column W
result = lookup(searchValue, columnToReturn);
console.log("Result :", result, "expected = 0.36"); 

// Test cases for soil table undrained soil parameters cu
 searchValue = "UF-";
 columnToReturn = 4; // Column W
result = lookup(searchValue, columnToReturn);
console.log("Result:", result, "expected = 25"); 

searchValue = "Q-1B";
columnToReturn = 4; // Column W
result = lookup(searchValue, columnToReturn);
console.log("Result:", result,"expected = 50");

searchValue = "RS-1A";
columnToReturn = 4; // Column W
result = lookup(searchValue, columnToReturn);
console.log("Result:", result, "expected = 50"); 

searchValue = "RS-1B";
columnToReturn = 4; // Column W
result = lookup(searchValue, columnToReturn);
console.log("Result :", result, "expected = 100"); 
