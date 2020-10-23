const form = document.getElementById('mc-form');
const phone_input = document.getElementById('mc-phone');
const name_input = document.getElementById('mc-name');
const submit = document.getElementById('submit');
const message = document.querySelector('.subscribe-message');

let formStatus = {
    name: false,
    phone: false
}

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

name_input.addEventListener('keyup', () => {
    if(name_input.value === '') {
        name_input.classList.remove('valid');
        name_input.classList.add('error');
        formStatus.name = false;
    } else {
        name_input.classList.remove('error');
        name_input.classList.add('valid');
        formStatus.name = true;
    }
});

phone_input.addEventListener('keyup', () => {
    if(iti.isValidNumber() != true) {
        phone_input.classList.remove('valid');
        phone_input.classList.add('error');
        formStatus.phone = false;
    } else {
        phone_input.classList.remove('error');
        phone_input.classList.add('valid');
        formStatus.phone = true;
    }
});

form.addEventListener('submit', (evt) => {
    evt.preventDefault();
    validate()
})
let typewriter = new Typewriter(message);

function validate() {
    if(formStatus.name && formStatus.phone) {
        submitUser({
            name: name_input.value,
            phone: iti.getNumber()
        });
    } else {
        typewriter.typeString('Invalid values, please revise!')
            .pauseFor(3000)
            .deleteAll()
            .start();
    }
}

async function submitUser(data) {
    try {
        typewriter.deleteAll()
            .typeString('Signing up...')
            .start();
            
        const response = await fetch('https://us-central1-alecko-8bca5.cloudfunctions.net/app/waitingList', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        if(response.status != 200) {
            throw new Error();
        }
        typewriter.deleteAll().typeString('Signed up! thank you :)').start();
        
    } catch (error) {
        typewriter.deleteAll()
        .typeString('Server error while signing up, please contact me: 0717171647')
        .start();
    } finally {
        typewriter
        .pauseFor(5000)
        .deleteAll()
        .stop()
    }
}
