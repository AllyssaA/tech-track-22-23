const data = [
	"robert",
	"vincent",
	"lAuRa",
	"Cas",
	"wIMER",
	"rOOs"
];

function convertArrayStringsToCapitalized() {
	/* Write your functionality here and log the result */
// data.map.toUpperCase() + data.slice(1);
  
  const changeData = data.map(data => data.charAt(0).toUpperCase() + data.slice(1).toLowerCase());
console.log(changeData)
}

convertArrayStringsToCapitalized()

