
    let currentRow = null; 


const data = {
  "India": {
    "states": {
      "Delhi": ["New Delhi", "Old Delhi"],
      "Kolkata": ["Kolkata", "Howrah"],
      "Mumbai": ["Mumbai", "Thane"]
    }
  },
  "USA": {
    "states": {
      "California": ["Los Angeles", "San Francisco"],
      "Texas": ["Houston", "Austin"],
      "New York": ["New York City", "Buffalo"]
    }
  },
  "UK": {
    "states": {
      "England": ["London", "Manchester"],
      "Scotland": ["Edinburgh", "Glasgow"]
    }
  }
};


// 
function updateStates() {
  const country = document.getElementById("country").value;
  const stateSelect = document.getElementById("state");
  const citySelect = document.getElementById("city");

  // Clear previous state and city options
  stateSelect.innerHTML = '<option value="">Select State</option>';
  citySelect.innerHTML = '<option value="">Select City</option>';

  if (country && data[country]) {
    const states = data[country].states;

    // Populate states based on selected country
    for (const state in states) {
      const option = document.createElement("option");
      option.value = state;
      option.textContent = state;
      stateSelect.appendChild(option);
    }
  }
}


function updateCities() {
  const country = document.getElementById("country").value;
  const state = document.getElementById("state").value;
  const citySelect = document.getElementById("city");

  // Clear previous city options
  citySelect.innerHTML = '<option value="">Select City</option>';

  if (country && state && data[country] && data[country].states[state]) {
    const cities = data[country].states[state];

    // Populate cities based on selected state
    cities.forEach(city => {
      const option = document.createElement("option");
      option.value = city;
      option.textContent = city;
      citySelect.appendChild(option);
    });
  }
}


function saveData(data) {
  let storedData = JSON.parse(localStorage.getItem('formData')) || [];

  storedData.push(data);
  localStorage.setItem('formData', JSON.stringify(storedData));
}


function loadSavedData() {
  const storedData = JSON.parse(localStorage.getItem('formData')) || [];
  const tableBody = document.querySelector("#data-table tbody");
  tableBody.innerHTML = ''; 

  storedData.forEach((data, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${data.fullname}</td>
      <td>${data.phone}</td>
      <td>${data.email}</td>
      <td>${data.gender}</td>
      <td>${data.country}</td>
  
      <td class="action-buttons">
        <button class="edit-btn" onclick="editRow(${index})">Edit</button>
        <button class="delete-btn" onclick="deleteRow(${index})">Delete</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}




function submitForm() {
  const form = document.getElementById("registrationForm");

  if (!validateForm()) {
    return; 
  }

  const formData = {
    fullname: form.fullname.value,
    phone: form.phone.value,
    email: form.email.value,
    age: form.age.value,
    dob: form.dob.value,
    gender: form.gender.value,
    experience: form.experience.value,
    preferredMedium: form.preferredMedium.value,
    preferredDate: form.preferredDate.value,
    address: form.address.value,
    country: form.country.value,
    state: form.state.value,
    city: form.city.value,
  };

  let storedData = JSON.parse(localStorage.getItem('formData')) || [];
  const existingData = storedData.find(data => data.email === formData.email || data.phone === formData.phone);

  if (existingData && currentRow === null) {
    showNotification('The data with this email or phone already exists.');
    return;
  }

  if (document.getElementById('submitBtn').textContent === 'Update') {
    storedData[currentRow] = formData;
    showNotification('Form updated successfully');
    currentRow = null;
  } else {
    if (!existingData) {
      storedData.push(formData);
      showNotification('Form submitted successfully');
    }
  }

  localStorage.setItem('formData', JSON.stringify(storedData));
  resetForm();
  loadSavedData();
}

// Modify editRow to set currentRow and button text
function editRow(index) {
  document.getElementById('submitBtn').textContent = 'Update';
  const storedData = JSON.parse(localStorage.getItem('formData')) || [];
  const data = storedData[index];
  
  document.getElementById("fullname").value = data.fullname;
  document.getElementById("phone").value = data.phone;
  document.getElementById("email").value = data.email;
  document.getElementById("age").value = data.age;
  document.getElementById("country").value = data.country;
  updateStates();
  document.getElementById("state").value = data.state;
  updateCities();
  document.getElementById("city").value = data.city;

  const gender = data.gender;
  if (gender) {
    document.querySelector(`input[name="gender"][value="${gender}"]`).checked = true;
  }

  currentRow = index;
}




let deleteIndex;

function deleteRow(index) {
  deleteIndex = index;
  document.getElementById('confirmDeleteModal').style.display = 'block';
}

function confirmDelete() {
  const userInput = document.getElementById('deleteConfirmationInput').value;
  if (userInput.toLowerCase() === 'delete') {
    let storedData = JSON.parse(localStorage.getItem('formData')) || [];
    storedData.splice(deleteIndex, 1);
    localStorage.setItem('formData', JSON.stringify(storedData));
    loadSavedData();
    showNotification('Data deleted successfully');
  } else {
    alert('Action canceled. You did not type "delete".');
  }
  closeModal();
}

function cancelDelete() {
  closeModal();
}

function closeModal() {
  document.getElementById('confirmDeleteModal').style.display = 'none';
  document.getElementById('deleteConfirmationInput').value = '';
}


 
 function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.style.display = 'block';
    setTimeout(() => {
      notification.style.display = 'none';
    }, 3000);
  }



function resetForm() {
  document.getElementById("registrationForm").reset();
  document.getElementById("submitBtn").innerText = "Submit";
}

document.getElementById('fullname').addEventListener('blur', () => {
        const fullname = document.getElementById("fullname").value;
            const nameErr = document.getElementById("fullname_error");
            if (fullname === "" || /\d/.test(fullname)) {
              nameErr.textContent = "Please enter your name properly.";
              return false;
            }
            nameErr.textContent = "";
            return true;
    });



    document.getElementById('phone').addEventListener('input', () => {
        const phone = document.getElementById("phone").value;
            const phoneErr = document.getElementById("phone_error");
            const phonePattern = /^\d{10}$/;
            if (phone === "" || !phone.match(phonePattern)) {
              phoneErr.textContent = "Please enter a valid 10-digit number.";
              return false;
            }
            phoneErr.textContent = "";
            return true;
    });
    document.getElementById('email').addEventListener('input', () => {
        const email = document.getElementById("email").value;
            const emailErr = document.getElementById("email_error");
            if (email === "" || !email.includes("@") || !email.includes(".")) {
              emailErr.textContent = "Please enter a valid email address.";
              return false;
            }
            emailErr.textContent = "";
            return true;
    });
    document.getElementById('age').addEventListener('input', () => {
        const age = document.getElementById("age").value;
            const ageErr = document.getElementById("age_error");
            if (age === "" || age < 1 || age > 120) {
              ageErr.textContent = "Please enter a valid age.";
              return false;
            }
            ageErr.textContent = "";
            return true;
    });
    // document.getElementById('address').addEventListener('input', () => {
    //     const address = document.getElementById("address").value;
    //         const addrErr = document.getElementById("address_error");
    //         if (address === "") {
    //           addrErr.textContent = "Please fill this required field.";
    //           return false;
    //         }
    //         addrErr.textContent = "";
    //         return true;
    // });
    document.getElementById('country').addEventListener('change', () => {
        const country = document.getElementById("country").value;
            const countryErr = document.getElementById("country_error");
            if (country === "") {
              countryErr.textContent = "Please fill this required field.";
              return false;
            }
            countryErr.textContent = ""
    });
    document.getElementById('state').addEventListener('change', () => {
        const state = document.getElementById("state").value;
            const stateErr = document.getElementById("state_error");
            if (state === "") {
              stateErr.textContent = "Please fill this required field.";
              return false;
            }
            stateErr.textContent = "";
    });
    document.getElementById('city').addEventListener('change', () => {
         const city = document.getElementById("city").value;
            const cityErr = document.getElementById("city_error");
            if (city === "") {
              cityErr.textContent = "Please fill this required field.";}
    });
   


    function validateForm() {
        let isValid = true;

        // Validate Fullname
        const fullname = document.getElementById("fullname").value;
        const fullnameErr = document.getElementById("fullname_error");
        if (fullname === "" || /\d/.test(fullname)) {
            fullnameErr.textContent = "Please enter a valid name.";
            isValid = false;
        } else {
            fullnameErr.textContent = "";
        }

        // Validate Phone
        const phone = document.getElementById("phone").value;
        const phoneErr = document.getElementById("phone_error");
        const phonePattern = /^\d{10}$/;
        if (phone === "" || !phone.match(phonePattern)) {
            phoneErr.textContent = "Please enter a valid 10-digit phone number.";
            isValid = false;
        } else {
            phoneErr.textContent = "";
        }

        // Validate Email
        const email = document.getElementById("email").value;
        const emailErr = document.getElementById("email_error");
        if (email === "" || !email.includes("@") || !email.includes(".")) {
            emailErr.textContent = "Please enter a valid email address.";
            isValid = false;
        } else {
            emailErr.textContent = "";
        }

        // Validate Age
        const age = document.getElementById("age").value;
        const ageErr = document.getElementById("age_error");
        if (age === "" || age < 1 || age > 120) {
            ageErr.textContent = "Please enter a valid age.";
            isValid = false;
        } else {
            ageErr.textContent = "";
        }

        // Validate Address
        // const address = document.getElementById("address").value;
        // const addrErr = document.getElementById("address_error");
        // if (address === "") {
        //     addrErr.textContent = "Please fill this required field.";
        //     isValid = false;
        // } else {
        //     addrErr.textContent = "";
        // }

        // Validate Country
        const country = document.getElementById("country").value;
        const countryErr = document.getElementById("country_error");
        if (country === "") {
            countryErr.textContent = "Please select a country.";
            isValid = false;
        } else {
            countryErr.textContent = "";
        }

        // Validate State
        const state = document.getElementById("state").value;
        const stateErr = document.getElementById("state_error");
        if (state === "") {
            stateErr.textContent = "Please select a state.";
            isValid = false;
        } else {
            stateErr.textContent = "";
        }

        // Validate City
        const city = document.getElementById("city").value;
        const cityErr = document.getElementById("city_error");
        if (city === "") {
            cityErr.textContent = "Please select a city.";
            isValid = false;
        } else {
            cityErr.textContent = "";
        }

        return isValid;
    }

   



window.onload = function() {
  loadSavedData();
};
