//@ts-nocheck
const prepareTable = (key = "") => {
  const charset = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
  ];

  const removeDuplicates = (key) => {
    const uniqueChars = [];
    for (const char of key.toUpperCase().replace(/J/gi, "I")) {
      if (!uniqueChars.includes(char)) {
        uniqueChars.push(char);
      }
    }
    return uniqueChars.join("");
  };

  key = removeDuplicates(key);

  const table = [
    ...key.toUpperCase().split(""),
    ...charset.filter((ch) => !key.toUpperCase().includes(ch)),
  ];
  const tableDimension = Math.sqrt(table.length);

  return { table, tableDimension };
};

const prepareInput = (input) => {
  input = input.toUpperCase();
  const split = input.match(/.{1,2}/g);
  const data = split?.map((duo) => (duo.length > 1 ? duo : `${duo}X`)) ?? [];

  return data;
};

const prepareIndexes = (pair, table, tableDimension) => {
  const index1 = table.indexOf(pair[0]);
  const index2 = table.indexOf(pair[1]);

  const col = [index1 % tableDimension, index2 % tableDimension];
  const row = [
    Math.floor(index1 / tableDimension),
    Math.floor(index2 / tableDimension),
  ];
  const isSameRow = row[0] === row[1];
  const isSameCol = col[0] === col[1];

  return { index1, index2, isSameRow, isSameCol, row, col };
};

export const encrypt = (input, direction = 1, key = "") => {
  const output = [];
  const { table, tableDimension } = prepareTable(key);
  const data = prepareInput(input);

  for (const pair of data) {
    const { index1, index2, isSameRow, isSameCol, row, col } = prepareIndexes(
      pair,
      table,
      tableDimension
    );
    const A = [col[0], row[0]];
    const B = [col[1], row[1]];

    const width = Math.abs(B[0] - A[0]);
    const height = Math.abs(B[1] - A[1]);

    let changed1, changed2;

    const shifter = 1 * direction;
    if (isSameRow) {
      //index 1
      if (col[0] === 0) {
        changed1 = direction >= 1 ? index1 + 1 : index1 + tableDimension - 1;
      } else if (col[0] === tableDimension - 1) {
        changed1 = direction >= 1 ? index1 - (tableDimension - 1) : index1 - 1;
      } else {
        changed1 = index1 + shifter;
      }
      //index 2
      if (col[1] === 0) {
        changed2 = direction >= 1 ? index2 + 1 : index2 + tableDimension - 1;
      } else if (col[1] === tableDimension - 1) {
        changed2 = direction >= 1 ? index2 - (tableDimension - 1) : index2 - 1;
      } else {
        changed2 = index2 + shifter;
      }
    } else if (isSameCol) {
      //index 1
      if (row[0] === 0) {
        changed1 =
          direction >= 1
            ? index1 + tableDimension * (tableDimension - 1)
            : index1 + tableDimension;
      } else if (row[0] === tableDimension - 1) {
        changed1 =
          direction >= 1
            ? index1 - tableDimension
            : index1 - tableDimension * (tableDimension - 1);
      } else {
        changed1 = index1 - tableDimension * shifter;
      }
      //index 2
      if (row[1] === 0) {
        changed2 =
          direction >= 1
            ? index2 + tableDimension * (tableDimension - 1)
            : index2 + tableDimension;
      } else if (row[1] === tableDimension - 1) {
        changed2 =
          direction >= 1
            ? index2 - tableDimension
            : index2 - tableDimension * (tableDimension - 1);
      } else {
        changed2 = index2 - tableDimension * shifter;
      }
    } else {
      if (A[0] < B[0]) {
        // Left to right
        if (direction > 0) {
          if (A[1] > B[1]) {
            changed1 = index1 - tableDimension * height;
            changed2 = index2 + tableDimension * height;
          } else {
            changed1 = index1 + width;
            changed2 = index2 - width;
          }
        } else {
          if (A[1] > B[1]) {
            changed1 = index1 + width;
            changed2 = index2 - width;
          } else {
            changed1 = index1 + tableDimension * height;
            changed2 = index2 - tableDimension * height;
          }
        }
      } else {
        // Right to left
        if (direction > 0) {
          if (A[1] > B[1]) {
            changed1 = index1 - width;
            changed2 = index2 + width;
          } else {
            changed1 = index1 + tableDimension * height;
            changed2 = index2 - tableDimension * height;
          }
        } else {
          if (A[1] > B[1]) {
            changed1 = index1 - tableDimension * height;
            changed2 = index2 + tableDimension * height;
          } else {
            changed1 = index1 - width;
            changed2 = index2 + width;
          }
        }
      }
    }

    output.push([table[changed1], table[changed2]].join(""));
  }
  return output.join("");
};
