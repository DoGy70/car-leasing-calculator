//all needed elements
const form = document.getElementsByClassName(".form");
const carTypeDropdown = document.getElementById("selectType");
const leasePeriodDropDown = document.getElementById("period");
const valueRange = document.getElementById("value");
const valueInput = document.getElementById("valueInput");
const downPaymentRange = document.getElementById("downPayment");
const downPaymentInput = document.getElementById("downPaymentInput");
const totalLeasingParagraph = document.getElementById("totalLeasing");
const downPaymentParagraph = document.getElementById("downPaymentParagraph");
const monthlyInstallmentParagraph =
  document.getElementById("monthlyInstallment");
const interestRateParagraph = document.getElementById("interestRate");

//utils functions
function convertToCurrency(number) {
  number = number / 100;

  const currency = new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(number);

  return currency;
}

function calculateCarLeasing(carType, leasePeriod, carValue, downPayment) {
  carValue = Number(carValue) * 100;
  downPayment = Number(downPayment);
  leasePeriod = Number(leasePeriod);

  console.log(carValue, downPayment, leasePeriod);

  const yearlyInterestRate = carType === "brand new" ? 2.99 : 3.7;

  const downPaymentSum = carValue * (downPayment / 100);
  const carSumMinusDownPayment = carValue - downPaymentSum;
  const monthlyInstallmentWithoutInterest =
    carSumMinusDownPayment / leasePeriod;
  const monthlyInterestRate = yearlyInterestRate / 12;
  const monthlyInstallment =
    monthlyInstallmentWithoutInterest +
    monthlyInstallmentWithoutInterest * (monthlyInterestRate / 100);

  const totalLeasing = monthlyInstallment * leasePeriod + downPaymentSum;

  console.log("Monthly installment: " + monthlyInstallment / 100);
  totalLeasingParagraph.textContent = `Total Leasing Cost: ${convertToCurrency(
    totalLeasing
  )}`;
  downPaymentParagraph.textContent = `Down Payment: ${convertToCurrency(
    downPaymentSum
  )}`;
  monthlyInstallmentParagraph.textContent = `Monthly Installment ${convertToCurrency(
    monthlyInstallment
  )}`;
  interestRateParagraph.textContent = `Interest Rate: ${yearlyInterestRate.toFixed(
    2
  )}%`;
}

function changeValueOrDownPaymentInput(input, value) {
  input.value = value;
}

function onChangeRange(range, value, input) {
  range.addEventListener("input", (e) => {
    e.preventDefault();
    value = Number(range.value);
    changeValueOrDownPaymentInput(input, value);

    if (range.id === "value") {
      calculateCarLeasing(carType, leasePeriod, value, downPayment);
      return;
    }

    calculateCarLeasing(carType, leasePeriod, carValue, value);
  });
}

//initial render
let carType = carTypeDropdown.options[carTypeDropdown.selectedIndex].value;
let leasePeriod =
  leasePeriodDropDown.options[leasePeriodDropDown.selectedIndex].value;
let carValue = Number(valueRange.value);
let downPayment = Number(downPaymentRange.value);

changeValueOrDownPaymentInput(valueInput, carValue);
changeValueOrDownPaymentInput(downPaymentInput, downPayment);

calculateCarLeasing(carType, leasePeriod, carValue, downPayment);

//onChange on ranges
onChangeRange(valueRange, carValue, valueInput);
onChangeRange(downPaymentRange, downPayment, downPaymentInput);

//onChange on inputs
valueInput.addEventListener("change", (e) => {
  e.preventDefault();

  let newCarValue = Number(valueInput.value);

  if (
    newCarValue < 10000 ||
    newCarValue > 200000 ||
    isNaN(Number(newCarValue)) === true
  ) {
    valueInput.value = carValue;
    return;
  }

  carValue = newCarValue;
  valueRange.value = carValue;
  calculateCarLeasing(carType, leasePeriod, carValue, downPayment);
});

downPaymentInput.addEventListener("change", (e) => {
  e.preventDefault();

  let newDownPayment = Number(downPaymentInput.value);

  if (
    newDownPayment % 5 !== 0 ||
    newDownPayment > 50 ||
    newDownPayment < 10 ||
    isNaN(Number(newDownPayment)) === true
  ) {
    downPaymentInput.value = downPayment;
    return;
  }

  downPayment = newDownPayment;
  downPaymentRange.value = downPayment;
  calculateCarLeasing(carType, leasePeriod, carValue, downPayment);
});

//onChange car type
carTypeDropdown.addEventListener("change", (e) => {
  e.preventDefault();
  carType = carTypeDropdown.options[carTypeDropdown.selectedIndex].value;
  calculateCarLeasing(carType, leasePeriod, carValue, downPayment);
});

//onChange lease period
leasePeriodDropDown.addEventListener("change", (e) => {
  e.preventDefault();
  leasePeriod =
    leasePeriodDropDown.options[leasePeriodDropDown.selectedIndex].value;
  calculateCarLeasing(carType, leasePeriod, carValue, downPayment);
});
