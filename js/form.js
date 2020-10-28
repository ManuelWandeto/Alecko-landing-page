const form = document.getElementById('mc-form');
const phone_input = document.getElementById('mc-phone');
const name_input = document.getElementById('mc-name');
const submit = document.getElementById('submit');
const nameError = document.getElementById('name-error');
const phoneError = document.getElementById('phone-error');

const iti = window.intlTelInput(phone_input, {
    utilsScript: 'https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js',
    autoPlaceholder: "aggressive",
    separateDialCode: true,
    customPlaceholder: (placeholder, selectedCountry) => 'e.g. '+ placeholder,
    geoIpLookup: async (success, failure) => {
        // const data = await fetch('http://ip-api.com/json/').then(res => res.json());
        // const countryCode = data ? data.countryCode : 'KE';
        // success(countryCode);
        success('KE'); //TODO: uncomment above code
    },
    initialCountry: 'auto',
    customContainer: 'country_container',
});

form.addEventListener('submit', (evt) => {
    evt.preventDefault();
    validate()
});

function validateName(name_input) {
    if(name_input.value.trim() === '') {
        name_input.classList.remove('valid');
        name_input.classList.add('error');
        nameError.textContent = 'Name cannot be empty!';
        return false;
    }

    name_input.classList.remove('error');
    name_input.classList.add('valid');
    nameError.textContent = '';
    return true;
}

function validatePhone(phone_input) {
    const phoneErrorMap = ["Invalid number", "Invalid country code", "Too short", "Too long", "Invalid number"];

    if(iti.isValidNumber() != true) {
        phone_input.classList.remove('valid');
        phone_input.classList.add('error');
        const errorCode = iti.getValidationError();
        phoneError.textContent = phoneErrorMap[errorCode];
        return false;
    } else {
        phone_input.classList.remove('error');
        phone_input.classList.add('valid');
        phoneError.textContent = '';
        return true;
    }
}

function validate() {
    const formStatus = {
        name: validateName(name_input),
        phone: validatePhone(phone_input)
    }

    if(formStatus.name && formStatus.phone) {
        SignUp(name_input.value, iti.getNumber());
    }
}

// const mock = (success, timeout) => {
//     return new Promise((resolve, reject) => {
//       setTimeout(() => {
//         if(success) {
//           resolve();
//         } else {
//           reject({message: 'Error'});
//         }
//       }, timeout);
//     });
// }
  
async function SignUp(name, phone) {
    const loader = `<span class="lds-dual-ring"></span>`;
    submit.classList.remove('submit-error');
    submit.classList.add('spin');
    submit.disabled = true;

    const data = {
        name: name,
        phone: phone
    }

    try {
        const response = await fetch('https://us-central1-alecko-8bca5.cloudfunctions.net/app/waitingList', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        if(response.status != 200) {
            throw new Error(`Internal error, server responded with: ${response.status}`);
        }

        submit.textContent = 'Success!';
        form.reset();
    } catch (error) {
        submit.classList.add('submit-error');
        submit.innerHTML = `Try Again! ${loader}`
    } finally {
        submit.classList.remove('spin');
        submit.disabled = false;
    }
    
}

