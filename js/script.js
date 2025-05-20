//////////////// SELECT ELEMENTS ////////////////

const nameField = document.getElementById('name');
const emailField = document.getElementById('email');
const otherJobRoleField = document.getElementById('other-job-role');
const titleSelect = document.getElementById('title');
const tShirtDesignSelect = document.getElementById('design');
const tShirtColorSelect = document.getElementById('color');
const tShirtColorSelectOptions = document.querySelectorAll('#color > option');
const activityArea = document.getElementById('activities');
const activitiesBox = document.getElementById('activities-box');
const activityAreaCheckBoxes = document.querySelectorAll('#activities-box input[type="checkbox"]');
const paymentSelect = document.getElementById('payment');
const ccNum = document.getElementById('cc-num');
const ccZip = document.getElementById('zip');
const ccCVV = document.getElementById('cvv')
const form = document.querySelector('form');


//////////////// HELPER FUNCTIONS ////////////////

// show other job field when other is selected for job role
const showOtherJobRoleField = ({target: { value }}) => otherJobRoleField.style.display = (value === 'other') ? 'block' : 'none';

//show t shirt color options when design is picked
const showTShirtColorOptions = ({ target: { value } }) => { 
    let indexOfFirstSelectableOption;
    // remove disabled attribute from t shirt color select
    tShirtColorSelect.removeAttribute('disabled');
    // for each of the t shirt color options
    tShirtColorSelectOptions.forEach((option, index) => {
        // by default hide all options
        option.setAttribute('hidden', ''); 
        // if theme of design is available for the color
        if (value === option.dataset.theme) {
            // remove hidden attribute
            option.removeAttribute('hidden'); 
            // record first option that 
           if (typeof indexOfFirstSelectableOption === 'undefined') { indexOfFirstSelectableOption = index; }
        }
    });
    // set selected option as the first option available
    tShirtColorSelect.selectedIndex = indexOfFirstSelectableOption;
};

const setAcivityPrice = () => {
     // reset price
     let price = 0;
     // gather all clicked activities
     let checkedCourses = document.querySelectorAll('#activities-box input:checked');
     // total all clicked activities
     checkedCourses.forEach(course => { price += +course.dataset.cost });
     // set total on page
     document.querySelector('.activities-cost').textContent = `Total: $${price}`;
}

const activityCheck = (event) => {
    // when an input is clicked in the activity area
    if (event.target.tagName === 'INPUT') {
        // check if it has a data dayAndTime value
        if (event.target.dataset.dayAndTime) {
            // gather all activities with similar dayAndTime values
            let allSimilarAcivities = document.querySelectorAll(`input[data-day-and-time="${event.target.dataset.dayAndTime}"]`);
            // loop through all and disable the conflicting activities
            allSimilarAcivities.forEach(activity => {
                if (activity.name !== event.target.name) {
                    activity.parentNode.classList.toggle('disabled');
                    activity.toggleAttribute('disabled');
                }
            });
        }
        // set price of activites area
       setAcivityPrice();
    }
};

const paymentToggle = ({ target: { value } }) => { 
    // set all payment options to display none by default
    document.querySelectorAll('.payment-methods > div:nth-child(n+3)').forEach(child => child.style.display = 'none');
    // remove style attribute for selected payment option
    document.getElementById(value).removeAttribute('style');
};

const setValidOrNotValid = (error, elem) => {
    // remove not-valid class by default
    elem.parentNode.classList.remove('not-valid');
    // if error set hint to block display otherwise set to none
    document.querySelector(`#${elem.id} ~ .hint`).style.display = (!error) ? 'block' : 'none';
    // if error add not-valid class otherwise add valid class
    elem.parentNode.classList.add(`${((!error) ? 'not-valid' : 'valid')}`);
};

const checkFieldValidation = (elem, regex) => {
    // test regular expression against value of elem
    let isValid = new RegExp(regex).test(elem.value);
    // send response to set appropriate error classes
    setValidOrNotValid(isValid, elem);
    // return the validation value
    return isValid;
};

const formValidation = (event) => {
    const getSelectedActivityCount = document.querySelectorAll('#activities-box input:checked').length;
    const getSelectedPaymentOption = paymentSelect.options[paymentSelect.selectedIndex].text;
    // check name isnt empty or white space
    checkFieldValidation(nameField, /^(.|\s)*\S(.|\s)*/);
    // check format of email field
    checkFieldValidation(emailField, /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/);
    // set error classes for activities depending upon what is selected
    setValidOrNotValid(((getSelectedActivityCount === 0) ? false : true), activitiesBox)
    // if credit card is selected check cc num, zip, cvv
    if (getSelectedPaymentOption === 'Credit Card') {
        checkFieldValidation(ccNum, /^\b\d{13,16}\b/);
        checkFieldValidation(ccZip, /^\b\d{5}\b/);
        checkFieldValidation(ccCVV, /^\b\d{3}\b/);
    }
    // stop form submission if any errors are present
    let notValidAndVisible = [...document.querySelectorAll('.not-valid')].filter(el => el.getBoundingClientRect().height > 0);
    if (notValidAndVisible.length > 0 ) { 
        event.preventDefault(); 
    }
};

const checkLength = (elem, min, max, charType) => {
    let msg;
    let length = elem.value.length;
    let isValid = checkFieldValidation(ccNum, /^\b\d{13,16}\b/);
    // if less than 13 digits and not a number
    if( length < min && !isValid ) { 
        msg = `The value entered is less than ${min} ${charType} long.`; 
    // if more than 16 digits and not a number
    } else if ( length > max & !isValid ) {
        msg = `The value entered is more than ${max} ${charType} long.`; 
    // else is correct length but not a number
    } else if (!isValid) {
        msg = 'Credit card number must only contain 13-16 digits.'
    }
    // set hint value
    document.querySelector(`#${elem.id} ~ .hint`).textContent = msg;
    // set appropriate classes if valid or not
    setValidOrNotValid(isValid, elem);
};


//////////////// EVENT LISTENERS ////////////////

// listen for change on title to check if other field can be displayed
titleSelect.addEventListener('change', showOtherJobRoleField);
// listen for change on t shirt designs to determine which options to show
tShirtDesignSelect.addEventListener('change', showTShirtColorOptions);
// check duplicate acitivites selected and set price
activityArea.addEventListener('click', activityCheck);
// set blur and focus events 
activityAreaCheckBoxes.forEach(checkbox => {
    ['blur', 'focus'].forEach(event => { 
        checkbox.addEventListener(event, ({ target }) => target.parentNode.classList.toggle('focus'));
    });
});
// listen for change on payment options to determine which to display
paymentSelect.addEventListener('change', paymentToggle);
// key up event for credit card field for dynamic real time messaging
ccNum.addEventListener('keyup', ({target : elem}) => checkLength(elem, 13, 16, 'digits'));
// validate form when submit
form.addEventListener('submit', formValidation);


//////////////// RANDOM ITEMS ////////////////

// focus on name field when script loads
nameField.focus();
// hide other job role field on load
otherJobRoleField.style.display = 'none';
// disable color select
tShirtColorSelect.setAttribute('disabled', '');
// select credit card option by default and fire off change event to trigger paymentToggle
document.querySelector('option[value="credit-card"]').setAttribute('selected', '');
paymentSelect.dispatchEvent(new Event('change'));