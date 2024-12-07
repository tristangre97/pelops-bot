const functionList = [
    {
      name: "getUnitData",
      description: "Get stats for a unit",
      parameters: {
        type: "object",
        properties: {
          unit: {
            type: "string",
            description: "The unit the user wants to see the stats for.",
          },
          level: {
            type: "number",
            description: "The level of the unit.",
          }
        },
        required: ["unit", "level"],
      },
    },
];


exports.functionList = functionList;
