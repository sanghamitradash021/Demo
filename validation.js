// Sample data for countries, states, and cities
const data = {
  India: {
    Odisha: ["Bhubaneswar", "Cuttack", "Berhampur"],
    Maharashtra: ["Mumbai", "Pune", "Nagpur"],
  },
  USA: {
    California: ["Los Angeles", "San Francisco", "San Diego"],
    NewYork: ["New York City", "Buffalo", "Albany"],
  },
  UK: {
    London: ["London", "Manchester", "Bristol"],
    Scotland: ["Edinburgh", "Glasgow", "Aberdeen"],
  },
};

// Populate the state dropdown based on the selected country
function Statesnames() {
  const country = document.getElementById("country").value;
  const stateDropdown = document.getElementById("state");
  const cityDropdown = document.getElementById("city");

  // Clear existing options
  stateDropdown.innerHTML = '<option value="">Select State</option>';
  cityDropdown.innerHTML = '<option value="">Select City</option>';

  if (country) {
    // Populate states based on the selected country
    const states = Object.keys(data[country]);
    states.forEach((state) => {
      const option = document.createElement("option");
      option.value = state;
      option.textContent = state;
      stateDropdown.appendChild(option);
    });
  }
}

// Populate the city dropdown based on the selected state
function Citiesnames() {
  const country = document.getElementById("country").value;
  const state = document.getElementById("state").value;
  const cityDropdown = document.getElementById("city");

  // Clear existing options
  cityDropdown.innerHTML = '<option value="">Select City</option>';

  if (country && state) {
    // Populate cities based on the selected state
    const cities = data[country][state];
    cities.forEach((city) => {
      const option = document.createElement("option");
      option.value = city;
      option.textContent = city;
      cityDropdown.appendChild(option);
    });
  }
}

//validations for forms

function validateForm(event) {
  event.preventDefault();

  const fullname = document.getElementById("fullname").value;
  // const addr = document.getElementById("address").value;
  const age = document.getElementById("age").value;
  const phone = document.getElementById("phone").value;
  const email = document.getElementById("email").value;
  const dob = document.getElementById("dob").value;
  const address = document.getElementById("address").value;
  const  pincode = document.getElementById("pincode").value;
  const gender = document.getElementById("male").checked;
  const gender1 = document.getElementById("female").checked;
  const gender2 = document.getElementById("other").checked;
  const country = document.getElementsByClassName("countryz").value;
  const state = document.getElementsByClassName("statez").value;
  const city = document.getElementsByClassName("cityz").value;

  const nameErr = document.getElementById("fullname_error");
  const ageErr = document.getElementById("age_error");
  const phoneErr = document.getElementById("phone_error");
  const emailErr = document.getElementById("email_error");
  const dobErr = document.getElementById("dob_error");
  const addrErr = document.getElementById("address_error");
  const pincodeErr = document.getElementById("pincode_error");
  const genderErr = document.getElementById("gender_error");
  const countryErr = document.getElementById("c_error");
  const stateErr = document.getElementById("state_error");
  const cityErr = document.getElementById("city_error");




  // console.log("iiitttt");

  nameErr.textContent = "";
  // addrErr.textContent = "";
  ageErr.textContent = "";
  phoneErr.textContent = "";
  emailErr.textContent = "";
  dobErr.textContent = "";
  addrErr.textContent = "";
  pincodeErr.textContent = "";
  genderErr.textContent = "";
  countryErr.textContent = "";
  stateErr.textContent = ""; 
  cityErr.textContent = "";

  let isValid = true;

  if (fullname === "" || /\d/.test(fullname)) {
    console.log("iii");

    nameErr.textContent = "Please enter your name properly.";
    isValid = false;
  }

  // if (addr === "") {
  //     addrErr.textContent = "Please enter your address.";
  //     isValid = false;
  // }
  if (age === "" || age < 1 || age > 120) {
    ageErr.textContent = "Please enter your valid age";
    isValid = false;
  }
  const phonePattern = /^\d{10}$/;
  if (phone === "" || !phone.match(phonePattern)) {
    phoneErr.textContent = "Please enter your valid 10-digit number.";
    isValid = false;
  }

  if (email === "" || !email.includes("@") || !email.includes(".")) {
    emailErr.textContent = "Please enter a valid email address.";
    isValid = false;
  }

  if(dob===""){
    dobErr.textContent = "please fill this required field";
    isValid = false;
  }

  if(address===""){
    addrErr.textContent = "please fill this required field";
    isValid = false;
  }

  if(pincode===""){
    pincodeErr.textContent = "please fill this required field";
    isValid = false;
  }

  if(!gender && !gender1 && !gender2){
    genderErr.textContent = "please fill this required field";
    isValid = false;

  }

  if(!country && !state && !city){
    countryErr.textContent = "this field cannot remain empty";
    // stateErr.textContent = "this field cannot remain empty";
    // cityErr.textContent = "this field cannot remain empty";
    isValid=false;

  }



  


  if (isValid) {
    alert("Form submitted successfully!");
    return true;
  } else {
    return false;
  }
}

function resetErrors() {
  document.getElementById("fullname_error").textContent = "";
  // document.getElementById("address-error").textContent = "";

  document.getElementById("age_error").textContent = "";
  document.getElementById("phone-error").textContent = "";
  ocument.getElementById("email-error").textContent = "";
}
