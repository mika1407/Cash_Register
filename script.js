let price = 19.5;
let cid = [
  ['PENNY', 1.01],
  ['NICKEL', 2.05],
  ['DIME', 3.1],
  ['QUARTER', 4.25],
  ['ONE', 90],
  ['FIVE', 55],
  ['TEN', 20],
  ['TWENTY', 60],
  ['ONE HUNDRED', 100]
];


const cashInput = document.getElementById("cash");
const purchaseBtn = document.getElementById("purchase-btn");
const changeDueElement = document.getElementById("change-due");

// Valuuttojen arvot senteissä / desimaaleina virheiden välttämiseksi
const currencyUnitValues = {
  "PENNY": 0.01,
  "NICKEL": 0.05,
  "DIME": 0.1,
  "QUARTER": 0.25,
  "ONE": 1.0,
  "FIVE": 5.0,
  "TEN": 10.0,
  "TWENTY": 20.0,
  "ONE HUNDRED": 100.0
};

const checkCashRegister = () => {
  const cashValue = parseFloat(cashInput.value);
  
  // 1. Jos käteinen on vähemmän kuin hinta
  if (cashValue < price) {
    alert("Customer does not have enough money to purchase the item");
    return;
  }

  // 2. Jos maksettu tasan
  if (cashValue === price) {
    changeDueElement.textContent = "No change due - customer paid with exact cash";
    return;
  }

  let changeDue = Math.round((cashValue - price) * 100);
  let totalCid = Math.round(cid.reduce((acc, curr) => acc + curr[1], 0) * 100);

  // 3. Jos kassassa ei ole tarpeeksi rahaa yhteensä
  if (totalCid < changeDue) {
    changeDueElement.textContent = "Status: INSUFFICIENT_FUNDS";
    return;
  }

  let changeArray = [];
  let cidCopy = cid.map(arr => [arr[0], Math.round(arr[1] * 100)]);
  
  // Käydään valuutat läpi suurimmasta pienimpään
  for (let i = cidCopy.length - 1; i >= 0; i--) {
    let currName = cidCopy[i][0];
    let currVal = Math.round(currencyUnitValues[currName] * 100);
    let currAvailable = cidCopy[i][1];
    let amountToReturn = 0;

    while (changeDue >= currVal && currAvailable > 0) {
      changeDue -= currVal;
      currAvailable -= currVal;
      amountToReturn += currVal;
    }

    if (amountToReturn > 0) {
      changeArray.push([currName, amountToReturn / 100]);
    }
  }

  // Jos vaihtorahaa ei saada annettua kokonaan
  if (changeDue > 0) {
    changeDueElement.textContent = "Status: INSUFFICIENT_FUNDS";
    return;
  }

  // Tarkistetaan onko kassa tyhjemmäksi (CLOSED) vai jääkö rahaa (OPEN)
  let initialTotalCid = Math.round(cid.reduce((acc, curr) => acc + curr[1], 0) * 100);
  let exactChangeGiven = Math.round(changeArray.reduce((acc, curr) => acc + curr[1], 0) * 100);

  if (initialTotalCid === exactChangeGiven) {
    let resultString = "Status: CLOSED";
    changeArray.forEach(item => {
      resultString += ` ${item[0]}: $${item[1]}`;
    });
    changeDueElement.textContent = resultString;
  } else {
    let resultString = "Status: OPEN";
    changeArray.forEach(item => {
      resultString += ` ${item[0]}: $${item[1]}`;
    });
    changeDueElement.textContent = resultString;
  }
};

purchaseBtn.addEventListener("click", checkCashRegister);
cashInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    checkCashRegister();
  }
});