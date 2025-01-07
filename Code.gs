function sortSheet1() {
  var sheetData =
    SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Sheet1");
  // Define where the data starts (adjust to match your data start row)
  var startRow = 4; // Data starts from row 7
  var startColumn = 1; // Data starts from column A
  var numColumns = 5; // Total number of columns

  // Check if there's existing data in the table
  var lastRow = sheetData.getLastRow();
  var existingDataRows = lastRow >= startRow ? lastRow - startRow + 1 : 0;

  // Get existing data
  var data =
    existingDataRows > 0
      ? sheetData
          .getRange(startRow, startColumn, existingDataRows, numColumns)
          .getValues()
      : [];

  // Sort the data alphabetically by the first column (Last Name)
  data.sort((a, b) => a[0].localeCompare(b[0]));

  // Write the sorted data back to the sheet
  sheetData
    .getRange(startRow, startColumn, data.length, numColumns)
    .setValues(data);
}

function addAndSortSheet1() {
  var sheetData =
    SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Sheet1");

  var sheetInput = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  // Finalize input by forcing the sheet to update
  SpreadsheetApp.flush();

  // Define the input range (adjust as needed)
  var inputs = sheetInput.getRange("D12:G12").getValues()[0]; // Adjust range for input columns (excluding E)

  // Automatically set the current date in column E
  var currentDate = new Date();
  inputs.push(currentDate); // Add the current date to the end of the inputs array (for column E)

  // Check if any input cell is empty (excluding the auto-filled date)
  if (inputs.slice(0, 4).some((cell) => cell === "")) {
    SpreadsheetApp.getUi().alert(
      "Complete all fields. Make sure cells are unselected."
    );
    return;
  }
  const color = inputs[2].toLowerCase();

  // check if K6 is either green yellow or red
  if (!["green", "yellow", "red"].includes(color)) {
    SpreadsheetApp.getUi().alert(
      "Please enter either Green, Yellow or Red in the color column"
    );
    return;
  }

  const response = SpreadsheetApp.getUi().alert(
    `I, ${inputs[3]}, certify that "${inputs[0]} ${
      inputs[1]
    }" has met the requirements for a ${inputs[2].toUpperCase()} band.`,
    SpreadsheetApp.getUi().ButtonSet.YES_NO
  );

  // Handle the user's response
  if (response == SpreadsheetApp.getUi().Button.NO) {
    // If the user clicks "No"
    return;
  }

  switch (color) {
    case "green":
      inputs[2] = "g";
      break;
    case "yellow":
      inputs[2] = "y";
      break;
    case "red":
      inputs[2] = "r";
      break;
  }

  // Define where the data starts (adjust to match your data start row)
  var startRow = 4; // Data starts from row 7
  var startColumn = 1; // Data starts from column A
  var numColumns = 5; // Total number of columns

  // Check if there's existing data in the table
  var lastRow = sheetData.getLastRow();
  var existingDataRows = lastRow >= startRow ? lastRow - startRow + 1 : 0;

  // Get existing data
  var data =
    existingDataRows > 0
      ? sheetData
          .getRange(startRow, startColumn, existingDataRows, numColumns)
          .getValues()
      : [];

  // Check if the first name and last name already exist in the data
  const normalizedInputs =
    String(inputs[0])
      .replace(/[^a-zA-Z0-9]/g, "")
      .toLowerCase() +
    String(inputs[1])
      .replace(/[^a-zA-Z0-9]/g, "")
      .toLowerCase();

  // Loop through the existing data to check for a match
  for (let i = 0; i < data.length; i++) {
    // Make sure to convert the values in columns C and D to strings
    const normalizedRow =
      String(data[i][0])
        .replace(/[^a-zA-Z0-9]/g, "")
        .toLowerCase() +
      String(data[i][1])
        .replace(/[^a-zA-Z0-9]/g, "")
        .toLowerCase();

    if (normalizedRow === normalizedInputs) {
      // If a match is found, pull data from columns C and D (assuming they are columns 3 and 4 in the range)
      const columnC = data[i][2]; // Column C data (adjusted for index)
      const columnD = data[i][3]; // Column D data (adjusted for index)

      // Alert the user with the data from columns C and D
      SpreadsheetApp.getUi().alert(
        `${inputs[0]} ${
          inputs[1]
        } already exists as a ${columnC.toUpperCase()} band. Tested By: ${columnD}. Row #: ${
          startRow + i
        }`
      );
      return; // Stop execution if a match is found
    }
  }

  // Add the new row to the data array
  data.push(inputs);

  // Sort the data alphabetically by the first column (Last Name)
  data.sort((a, b) => a[0].localeCompare(b[0]));

  // Write the sorted data back to the sheet
  sheetData
    .getRange(startRow, startColumn, data.length, numColumns)
    .setValues(data);

  // Clear the input cells (excluding D2)
  sheetInput.getRange("D12:G12").clearContent(); // Clear columns I through L
}
