/*
    Signup Form Script
    This script will load the state select list and validate the form before submission
*/
'use strict';

$(document).ready(function () {
    var idx;
    var option;
    var other;
    var signupForm = document.getElementById('signup');
    var states = signupForm.elements['state'];
    for(idx = 0; idx < usStates.length; ++idx) {
        option = document.createElement('option');
        option.innerHTML = usStates[idx].name;
        option.value = usStates[idx].code;
        states.appendChild(option);
    }
    
    $('#occupation').change(function () {
        var occupation = signupForm.elements['occupation'];
        var otherInput = document.getElementById('occupationOther');
        if(occupation.value === "other") {
            otherInput.style.display = 'block';
            other = true;
        } else {
            otherInput.style.display = 'none';
            other = false;
        }
    });


    $('#cancelButton').click(function () {
            $('#confirm-exit-modal').modal();
    });

    $('#confirm-exit-button').click(function () {
            window.location = 'http://google.com';
    });

    $('#signup').submit(function (evt) {
        evt.returnValue = validateForm(this);
        if (!evt.returnValue && evt.preventDefault) {
            evt.preventDefault();
        }
        return evt.returnValue;
        try {
            var validation = validateForm(this);
        } catch (exception) {
            console.log(exception);
            validation = false;
        }

        if (!validation && evt.preventDefault) {
            evt.preventDefault();
        }

        evt.returnValue = validation;
        return validation;


        function validateForm(form) {
            var fieldsRequired = ['firstName', 'lastName', 'address1', 'city'
            , 'state', 'zip', 'birthdate', 'occupation'];
            var formValid = true;
            for (idx = 0; idx < fieldsRequired.length; ++idx) {
                formValid &= validateSimpleField(form.elements[fieldsRequired[idx]], form);
            }
            return formValid;
        }

        function validateOccupation(occupation, occupationOther) {
            var valid = occupation.value.trim().length > 0;
            if ("other" === occupation.value) {
                valid &= occupationOther.value.trim().length > 0;
                markInvalid(occupationOther, valid);
            }
            markInvalid(occupation, valid);
            return valid;
        } //factored validation of Occupation special case to make style better

        function validateBirthdate(birthdate, valid) {
            var dob = birthdate.value;
            var curDate = new Date();
            dob = new Date(dob);
            var yearsDiff = curDate.getFullYear() - dob.getUTCFullYear();
            var monthsDiff = curDate.getMonth() - dob.getUTCMonth();
            var daysDiff = curDate.getDate() - dob.getUTCDate();
            if(monthsDiff < 0 || (0 === monthsDiff && daysDiff < 0)) {
                yearsDiff--;
            }
            if(yearsDiff < 13) {
                valid = false;
                $('#birthdateMessage').html("You must be 13 years or older to submit" +
                    " information to this site.");
            }
            return valid;
        } // factored validation of birthdate code to make style better

        function validateSimpleField(field, form) {
            var value = field.value.trim();
            var valid;
            if(field.name === "zip") { // validates zip special case
                valid = (new RegExp(('^\\d{5}$')).test(field.value));
            } else if(field.name === "occupation") {
                valid = validateOccupation(field, form.elements['occupationOther']);
            } else if(field.name === "birthdate" && field.value.length > 0) {
                valid = true;
                valid = validateBirthdate(field,valid);
            }
            else {
                valid = value.length > 0;
            }
            markInvalid(field, valid);
            return valid;
        }

        function markInvalid(field, valid) {
            if(valid) {
                field.className = 'form-control';
                field.style.border = '1px';
                field.style.borderStyle = 'solid';
                field.style.borderColor = '#CCC';
            } else {
                field.className = 'form-control invalid-field';
                field.style.border = '1px';
                field.style.borderStyle = 'solid';
                field.style.borderColor = '#FF0000';
            }
        }
    });
});

