let currentRow = null;

const data = {
  India: {
    states: {
      Delhi: ["New Delhi", "Old Delhi"],
      Kolkata: ["Kolkata", "Howrah"],
      Mumbai: ["Mumbai", "Thane"],
    },
  },
  USA: {
    states: {
      California: ["Los Angeles", "San Francisco"],
      Texas: ["Houston", "Austin"],
      "New York": ["New York City", "Buffalo"],
    },
  },
  UK: {
    states: {
      England: ["London", "Manchester"],
      Scotland: ["Edinburgh", "Glasgow"],
    },
  },
};

function updateStates() {
  const country = $("#country").val();
  const stateSelect = $("#state");
  const citySelect = $("#city");

  stateSelect.html('<option value="">Select State</option>');
  citySelect.html('<option value="">Select City</option>');

  if (country && data[country]) {
    const states = data[country].states;

    $.each(states, (state) => {
      stateSelect.append($("<option>").val(state).text(state));
    });
  }
}

function updateCities() {
  const country = $("#country").val();
  const state = $("#state").val();
  const citySelect = $("#city");

  citySelect.html('<option value="">Select City</option>');

  if (country && state && data[country] && data[country].states[state]) {
    const cities = data[country].states[state];

    $.each(cities, (index, city) => {
      citySelect.append($("<option>").val(city).text(city));
    });
  }
}

function saveData(data) {
  let storedData = JSON.parse(localStorage.getItem("formData")) || [];
  storedData.push(data);
  localStorage.setItem("formData", JSON.stringify(storedData));
}

function loadSavedData() {
  const storedData = JSON.parse(localStorage.getItem("formData")) || [];
  const tableBody = $("#data-table tbody");
  tableBody.html("");

  $.each(storedData, (index, data) => {
    const row = $("<tr>").html(`
      <td>${data.fullname}</td>
      <td>${data.phone}</td>
      <td>${data.email}</td>
      <td>${data.gender}</td>
      <td>${data.country}</td>
      <td class="action-buttons">
        <button class="edit-btn" onclick="editRow(${index})">Edit</button>
        <button class="delete-btn" onclick="deleteRow(${index})">Delete</button>
      </td>
    `);
    tableBody.append(row);
  });
}

function submitForm() {
  const form = $("#registrationForm");

  if (!validateForm()) {
    return;
  }

  const formData = {
    fullname: form.find("#fullname").val(),
    phone: form.find("#phone").val(),
    email: form.find("#email").val(),
    age: form.find("#age").val(),
    dob: form.find("#dob").val(),
    gender: form.find("#gender").val(),
    experience: form.find("input[name='experience']:checked").val(),
    preferredMedium: form.find("input[name='preferredMedium']:checked").val(),
    preferredDate: form.find("#preferredDate").val(),
    address: form.find("#address").val(),
    country: form.find("#country").val(),
    state: form.find("#state").val(),
    city: form.find("#city").val(),
  };

  let storedData = JSON.parse(localStorage.getItem("formData")) || [];
  const existingData = storedData.find(
    (data) => data.email === formData.email || data.phone === formData.phone
  );

  if (existingData && currentRow === null) {
    showNotification("The data with this email or phone already exists.");
    return;
  }

  if ($("#submitBtn").text() === "Update") {
    storedData[currentRow] = formData;
    showNotification("Form updated successfully");
    currentRow = null;
  } else {
    if (!existingData) {
      storedData.push(formData);
      showNotification("Form submitted successfully");
    }
  }

  localStorage.setItem("formData", JSON.stringify(storedData));
  resetForm();
  loadSavedData();
}

function editRow(index) {
  $("#submitBtn").text("Update");
  const storedData = JSON.parse(localStorage.getItem("formData")) || [];
  const data = storedData[index];

  $("#fullname").val(data.fullname);
  $("#phone").val(data.phone);
  $("#email").val(data.email);
  $("#address").val(data.address);
  $("#age").val(data.age);
  $("#country").val(data.country);
  updateStates();
  $("#state").val(data.state);
  updateCities();
  $("#city").val(data.city);

  $("input[name='experience'][value='" + data.experience + "']").prop("checked", true);
  $("input[name='gender'][value='" + data.gender + "']").prop("checked", true);

  currentRow = index;
}

let deleteIndex;

function deleteRow(index) {
  deleteIndex = index;
  $("#confirmDeleteModal").show();
}

function confirmDelete() {
  const userInput = $("#deleteConfirmationInput").val();
  if (userInput.toLowerCase() === "delete") {
    let storedData = JSON.parse(localStorage.getItem("formData")) || [];
    storedData.splice(deleteIndex, 1);
    localStorage.setItem("formData", JSON.stringify(storedData));
    loadSavedData();
    showNotification("Data deleted successfully");
  } else {
    alert('Action canceled. You did not type "delete".');
  }
  closeModal();
}

function cancelDelete() {
  closeModal();
}

function closeModal() {
  $("#confirmDeleteModal").hide();
  $("#deleteConfirmationInput").val("");
}

function showNotification(message) {
  const notification = $("#notification");
  notification.text(message).show();
  setTimeout(() => {
    notification.hide();
  }, 3000);
}

function resetForm() {
  $("#registrationForm")[0].reset();
  $("#submitBtn").text("Submit");
}

$("#fullname").blur(() => {
  const fullname = $("#fullname").val();
  const nameErr = $("#fullname_error");
  if (fullname === "" || /\d/.test(fullname)) {
    nameErr.text("Please enter your name properly.");
    return false;
  }
  nameErr.text("");
  return true;
});

$("#phone").on("input", () => {
  const phone = $("#phone").val();
  const phoneErr = $("#phone_error");
  const phonePattern = /^\d{10}$/;
  if (phone === "" || !phone.match(phonePattern)) {
    phoneErr.text("Please enter a valid 10-digit number.");
    return false;
  }
  phoneErr.text("");
  return true;
});

$("#email").on("input", () => {
  const email = $("#email").val();
  const emailErr = $("#email_error");
  if (email === "" || !email.includes("@") || !email.includes(".")) {
    emailErr.text("Please enter a valid email address.");
    return false;
  }
  emailErr.text("");
  return true;
});

$("#age").on("input", () => {
  const age = $("#age").val();
  const ageErr = $("#age_error");
  if (age === "" || age < 1 || age > 120) {
    ageErr.text("Please enter a valid age.");
    return false;
  }
  ageErr.text("");
  return true;
});

$("#country").change(() => {
  const country = $("#country").val();
  const countryErr = $("#country_error");
  if (country === "") {
    countryErr.text("Please fill this required field.");
    return false;
  }
  countryErr.text("");
});

$("#state").change(() => {
  const state = $("#state").val();
  const stateErr = $("#state_error");
  if (state === "") {
    stateErr.text("Please fill this required field.");
    return false;
  }
  stateErr.text("");
});

$("#city").change(() => {
  const city = $("#city").val();
  const cityErr = $("#city_error");
  if (city === "") {
    cityErr.text("Please fill this required field.");
  }
});

function validateForm() {
  let isValid = true;

  // Validate Fullname
  const fullname = $("#fullname").val();
  const fullnameErr = $("#fullname_error");
  if (fullname === "" || /\d/.test(fullname)) {
    fullnameErr.text("Please enter a valid name.");
    isValid = false;
  } else {
    fullnameErr.text("");
  }

  // Validate Phone
  const phone = $("#phone").val();
  const phoneErr = $("#phone_error");
  const phonePattern = /^\d{10}$/;
  if (phone === "" || !phone.match(phonePattern)) {
    phoneErr.text("Please enter a valid 10-digit phone number.");
    isValid = false;
  } else {
    phoneErr.text("");
  }

  // Validate Email
  const email = $("#email").val();
  const emailErr = $("#email_error");
  if (email === "" || !email.includes("@") || !email.includes(".")) {
    emailErr.text("Please enter a valid email address.");
    isValid = false;
  } else {
    emailErr.text("");
  }

  // Validate Age
  const age = $("#age").val();
  const ageErr = $("#age_error");
  if (age === "" || age < 1 || age > 120) {
    ageErr.text("Please enter a valid age.");
    isValid = false;
  } else {
    ageErr.text("");
  }

  // Validate Country
  const country = $("#country").val();
  const countryErr = $("#country_error");
  if (country === "") {
    countryErr.text("Please select a country.");
    isValid = false;
  } else {
    countryErr.text("");
  }

  // Validate State
  const state = $("#state").val();
  const stateErr = $("#state_error");
  if (state === "") {
    stateErr.text("Please select a state.");
    isValid = false;
  } else {
    stateErr.text("");
  }

  // Validate City
  const city = $("#city").val();
  const cityErr = $("#city_error");
  if (city === "") {
    cityErr.text("Please select a city.");
    isValid = false;
  } else {
    cityErr.text("");
  }

  return isValid;
}

$(document).ready(() => {
  loadSavedData();
});
