const starpoints = [95, 102, 109, 119, 129, 139, 150, 162, 175, 189, 205, 221, 258, 279, 301, 325, 351, 379]
var level = 2;
var starpointsTotal = 0;

var starpointsFinal = []

for(data of starpoints) {
    starpointsTotal += data
    starpointsFinal.push(`**Level ${level}**  ${data} <:starpoints:992512783100948592> (${starpointsTotal} Total)`)
    level++
}


console.log(starpoints.length)