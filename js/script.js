//////////////// SELECT ELEMENTS //////////////////

const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const otherJobInput = document.getElementById('other-job-role');
const jobTitleDropdown = document.getElementById('title');
const designSelect = document.getElementById('design');
const colorSelect = document.getElementById('color');
const colorOptions = document.querySelectorAll('#color option');
const activitySection = document.getElementById('activities');
const activityCheckboxes = activitySection.querySelectorAll('input[type="checkbox"]');
const totalCostDisplay = document.querySelector('.activities-cost');
const paymentMethodSelect = document.getElementById('payment');
const creditCardSection = document.getElementById('credit-card');
const ccNumber = document.getElementById('cc-num');
const zipCode = document.getElementById('zip');
const cvvCode = document.getElementById('cvv');
const formElement = document.querySelector('form');


//////////////// HELPER FUNCTIONS //////////////////

// Show/Hide other job role input
function toggleOtherJobInput(e) {
  otherJobInput.style.display = e.target.value === 'other' ? 'block' : 'none';
}

// Show color options for the selected design
function updateColorOptions(e) {
  const selectedTheme = e.target.value;
  colorSelect.disabled = false;

  let firstMatchIndex = 0;
  colorOptions.forEach((option, index) => {
    const isMatch = option.dataset.theme === selectedTheme;
    option.hidden = !isMatch;
    if (isMatch && firstMatchIndex === 0) firstMatchIndex = index;
  });

  colorSelect.selectedIndex = firstMatchIndex;
}

// Toggle conflicting activity checkboxes and update total
function handleActivitySelection(e) {
  if (e.target.tagName === 'INPUT' && e.target.type === 'checkbox') {
    const currentTime = e.target.dataset.dayAndTime;
    const isChecked = e.target.checked;

    activityCheckboxes.forEach(box => {
      if (box !== e.target && box.dataset.dayAndTime === currentTime) {
        box.disabled = isChecked;
        box.parentElement.classList.toggle('disabled', isChecked);
      }
    });

    updateTotalCost();
  }
}

// Calculate and update total activity cost
function updateTotalCost() {
  let total = 0;
  activityCheckboxes.forEach(checkbox => {
    if (checkbox.checked) {
      total += parseInt(checkbox.dataset.cost);
    }
  });
  totalCostDisplay.textContent = `Total: $${total}`;
}

// Display relevant payment method section
function displayPaymentSection(e) {
  document.querySelectorAll('.payment-methods > div:nth-child(n+3)').forEach(div => {
    div.style.display = 'none';
  });

  const selected = e.target.value;
  const methodSection = document.getElementById(selected);
  if (methodSection) {
    methodSection.style.display = '';
  }
}

// Add or remove validation styles
function applyValidationStyle(isValid, inputElement) {
  const parent = inputElement.parentElement;
  const hint = parent.querySelector('.hint');

  parent.classList.remove('valid', 'not-valid');
  parent.classList.add(isValid ? 'valid' : 'not-valid');
  if (hint) {
    hint.style.display = isValid ? 'none' : 'block';
  }
}

// Validate input based on regex
function validateInput(input, regex) {
  const valid = regex.test(input.value);
  applyValidationStyle(valid, input);
  return valid;
}

// Handle credit card length-specific validation
function validateCreditCardLength(input, min, max) {
  const len = input.value.length;
  const valid = /^\d{13,16}$/.test(input.value);
  let message = '';

  if (!valid) {
    if (len < min) {
      message = `Must be at least ${min} digits.`;
    } else if (len > max) {
      message = `Must be no more than ${max} digits.`;
    } else {
      message = 'Credit card number must be digits only.';
    }
  }

  const hint = input.parentElement.querySelector('.hint');
  if (hint) hint.textContent = message;
  applyValidationStyle(valid, input);
}


//////////////// FORM VALIDATION //////////////////

function validateForm(e) {
  const isNameValid = validateInput(nameInput, /\S+/);
  const isEmailValid = validateInput(emailInput, /^[^@]+@[^@.]+\.[a-z]+$/i);
  const isActivitySelected = [...activityCheckboxes].some(cb => cb.checked);
  applyValidationStyle(isActivitySelected, activitySection);

  const selectedPayment = paymentMethodSelect.value;
  let isPaymentValid = true;

  if (selectedPayment === 'credit-card') {
    const validCard = validateInput(ccNumber, /^\d{13,16}$/);
    const validZip = validateInput(zipCode, /^\d{5}$/);
    const validCVV = validateInput(cvvCode, /^\d{3}$/);
    isPaymentValid = validCard && validZip && validCVV;
  }

  if (!(isNameValid && isEmailValid && isActivitySelected && isPaymentValid)) {
    e.preventDefault();
  }
}


//////////////// EVENT LISTENERS //////////////////

// Page load setup
window.addEventListener('DOMContentLoaded', () => {
  nameInput.focus();
  otherJobInput.style.display = 'none';
  colorSelect.disabled = true;
  paymentMethodSelect.value = 'credit-card';
  displayPaymentSection({ target: paymentMethodSelect });
});

// Field events
jobTitleDropdown.addEventListener('change', toggleOtherJobInput);
designSelect.addEventListener('change', updateColorOptions);
activitySection.addEventListener('change', handleActivitySelection);
paymentMethodSelect.addEventListener('change', displayPaymentSection);
ccNumber.addEventListener('input', () => validateCreditCardLength(ccNumber, 13, 16));

// Accessibility for checkboxes
activityCheckboxes.forEach(checkbox => {
  checkbox.addEventListener('focus', e => e.target.parentElement.classList.add('focus'));
  checkbox.addEventListener('blur', e => e.target.parentElement.classList.remove('focus'));
});

// Form submission
formElement.addEventListener('submit', validateForm);
