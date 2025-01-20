const form = document.getElementById("stepperForm");
const pages = document.querySelectorAll(".form-page");
const steps = document.querySelectorAll(".step");
const submitBtn = document.getElementById("submitBtn");
const editIndex = document.getElementById("editIndex");
const stepConnectorProgress = document.querySelector(
    ".step-connector-progress"
);
let formData = [];

document.addEventListener("DOMContentLoaded", function () {
    const savedData = localStorage.getItem("formData");
    if (savedData) {
        formData = JSON.parse(savedData);
        updateTable();
    }
});

document.getElementById("dob").addEventListener("change", function () {
    const dob = new Date(this.value);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        age--;
    }

    document.getElementById("age").value = age;
});

function validatePage(pageNumber) {
    const currentPageElement = document.getElementById(`page${pageNumber}`);
    const inputs = currentPageElement.querySelectorAll(
        "input[required], select[required]"
    );
    let isValid = true;

    inputs.forEach((input) => {
        if (!input.value) {
            isValid = false;
        }
    });

    return isValid;
}

steps.forEach((step, index) => {
    step.addEventListener("click", () => {
        const stepIndex = index + 1;
        let canNavigate = true;

        for (let i = 1; i < stepIndex; i++) {
            if (!validatePage(i)) {
                alert(`Please complete page ${i} before proceeding.`);
                canNavigate = false;
                break;
            }
        }

        if (canNavigate) {
            pages.forEach((page) => page.classList.remove("active"));
            document.getElementById(`page${stepIndex}`).classList.add("active");

            steps.forEach((s) => s.classList.remove("active"));
            step.classList.add("active");

            updateStepperProgress(stepIndex);
        }
    });
});



function nextPage(currentPage) {
    // Validate current page fields using custom validation logic
    const currentPageElement = document.getElementById(`page${currentPage}`);
    const nextPageElement = document.getElementById(`page${currentPage + 1}`);

    const inputs = currentPageElement.querySelectorAll(
        "input[required], select[required]"
    );
    let isValid = true;

    // Clear existing error messages
    inputs.forEach((input) => {
        const errorField = document.getElementById(`${input.id}Error`);
        if (errorField) {
            errorField.textContent = ""; // Clear error messages
        }
        input.style.borderColor = "#ddd"; // Reset border color
    });

    // Validate each field
    inputs.forEach((input) => {
        const fieldName = input.id; // Field ID corresponds to validation rules
        const fieldValue = input.value;

        // Validate the field using the custom validation function
        const validationResult = validateField(fieldName, fieldValue);
        if (!validationResult.isValid) {
            isValid = false;

            // Display error messages and highlight invalid fields
            const errorField = document.getElementById(`${fieldName}Error`);
            if (errorField) {
                errorField.textContent = validationResult.errors.join(", ");
            }
            input.style.borderColor = "red";
        }
    });

    // If validation fails, display an alert and exit
    if (!isValid) {
        alert("Please fix the highlighted errors before proceeding.");
        return;
    }
    
    currentPageElement.classList.add("slide-out");
    setTimeout(() => {
        currentPageElement.classList.remove("active", "slide-out");
        nextPageElement.classList.add("active", "slide-in");
        setTimeout(() => {
            nextPageElement.classList.remove("slide-in");
        }, 300);
    }, 300);

    // If moving to preview page, populate preview data
    if (currentPage === 2) {
        populatePreview();
    }

    // Hide current page and show the next page
    currentPageElement.classList.remove("active");
    document.getElementById(`page${currentPage + 1}`).classList.add("active");

    // Update stepper
    steps[currentPage - 1].classList.remove("active");
    steps[currentPage].classList.add("active");
}

function prevPage(currentPage) {
    // Validate current page fields before navigating
    const currentPageElement = document.getElementById(`page${currentPage}`);
    const inputs = currentPageElement.querySelectorAll(
        "input[required], select[required]"
    );
    let isValid = true;
    
    const prevPageElement = document.getElementById(`page${currentPage - 1}`);

    // Clear existing error messages
    inputs.forEach((input) => {
        const errorField = document.getElementById(`${input.id}Error`);
        if (errorField) {
            errorField.textContent = ""; // Clear error messages
        }
        input.style.borderColor = "#ddd"; // Reset border color
    });

    // Validate each field dynamically
    inputs.forEach((input) => {
        const fieldName = input.id; // Field ID corresponds to validation rules
        const fieldValue = input.value;

        // Validate the field using the custom validation function
        const validationResult = validateField(fieldName, fieldValue);
        if (!validationResult.isValid) {
            isValid = false;

            // Display error messages and highlight invalid fields
            const errorField = document.getElementById(`${fieldName}Error`);
            if (errorField) {
                errorField.textContent = validationResult.errors.join(", ");
            }
            input.style.borderColor = "red";
        }
    });

    currentPageElement.classList.add('slide-out');
   

    // Prevent navigation if validation fails
    if (!isValid) {
        alert("Please fix the highlighted errors before going back.");
        return;
    }

    // If validation is successful, hide current page and show previous page
    currentPageElement.classList.remove("active");
    document.getElementById(`page${currentPage - 1}`).classList.add("active");

    // Update stepper
    steps[currentPage - 1].classList.remove("active");
    steps[currentPage - 2].classList.add("active");
}

function updateStepperProgress(currentStep) {
    const progress = ((currentStep - 1) / 2) * 100;
    stepConnectorProgress.style.width = `${progress}%`;
}

function populatePreview() {
    const previewData = document.getElementById("previewData");
    const data = getFormData();

    previewData.innerHTML = "";
    for (const [key, value] of Object.entries(data)) {
        previewData.innerHTML += `<p><strong>${key}:</strong> ${value}</p>`;
    }
}



function getFormData() {
    return {
        fullName: document.getElementById("fullName").value,
        phone: document.getElementById("phone").value,
        email: document.getElementById("email").value,
        dob: document.getElementById("dob").value,
        age: document.getElementById("age").value,
        gender: document.getElementById("gender").value,
        address: document.getElementById("address").value,
        country: document.getElementById("country").value,
        state: document.getElementById("state").value,
        city: document.getElementById("city").value,
        zip: document.getElementById("zip").value,
    };
}
function updateTable() {
    const tableBody = document.getElementById("dataTableBody");
    tableBody.innerHTML = "";

    formData.forEach((data, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
                    <td>${data["fullName"]}</td>
                    <td>${data["phone"]}</td>
                    <td>${data["email"]}</td>
                    <td>${data["state"]}</td>
                    <td class="action-buttons">
                        <button class="edit" onclick="editEntry(${index})">
                            <i class="fas fa-edit"></i>
                            Edit
                        </button>
                        <button class="delete" onclick="deleteEntry(${index})">
                            <i class="fas fa-trash"></i>
                            Delete
                        </button>
                    </td>
                `;
        // tableBody.appendChild(row);
        tableBody.insertBefore(row, tableBody.firstChild);
    });

    localStorage.setItem("formData", JSON.stringify(formData));
}

function editEntry(index) {
    const data = formData[index];

    document.getElementById("fullName").value = data["fullName"];
    document.getElementById("phone").value = data["phone"];
    document.getElementById("email").value = data["email"];
    document.getElementById("dob").value = data["dob"];
    document.getElementById("age").value = data["age"];
    document.getElementById("gender").value = data["gender"];
    document.getElementById("address").value = data["address"];
    document.getElementById("country").value = data["country"];
    document.getElementById("state").value = data["state"];
    document.getElementById("city").value = data["city"];
    document.getElementById("zip").value = data["zip"];

    editIndex.value = index;
    submitBtn.textContent = "Update";

    document
        .querySelectorAll(".form-page")
        .forEach((page) => page.classList.remove("active"));
    document.getElementById("page1").classList.add("active");

    document
        .querySelectorAll(".step")
        .forEach((step) => step.classList.remove("active"));
    document.querySelector(".step").classList.add("active");

    updateStepperProgress(1);
}

function deleteEntry(index) {
    if (confirm("Are you sure you want to delete this entry?")) {
        formData.splice(index, 1);
        updateTable();
    }
}

// form.addEventListener("submit", function (e) {
//     e.preventDefault();
//     const data = getFormData();

//     if (editIndex.value !== "") {
//         formData[editIndex.value] = data;
//         editIndex.value = "";
//         submitBtn.textContent = "Submit";
//     } else {
//         formData.push(data);
//     }

//     updateTable();
//     form.reset();

//     document
//         .querySelectorAll(".form-page")
//         .forEach((page) => page.classList.remove("active"));
//     document.getElementById("page1").classList.add("active");

//     document
//         .querySelectorAll(".step")
//         .forEach((step) => step.classList.remove("active"));
//     document.querySelector(".step").classList.add("active");

//     updateStepperProgress(1);
// });

const validationRules = {
    fullName: {
        required: true,
        error: { message: "Full name is required." },
        regexValidation: {
            regex: /^[A-Za-z\s]+$/, // Only letters and spaces
            errorMessage: "Full name can only contain letters and spaces.",
        },
        customValidation: {
            validate: (value) => {
                console.log("Input value:", value); // Log the raw input value
                const trimmedValue = value.trim();
                console.log("Trimmed value:", trimmedValue); // Log the trimmed value
                const words = trimmedValue.split(/\s+/); // Split by one or more spaces
                console.log("Words array:", words); // Log the array of words
                console.log("Word count:", words.length); // Log the word count
                return words.length >= 2; // Ensure at least two words
            }, // Full name must contain at least two words
            errorMessage: "Full name must contain at least two words.",
        },
    },
    phone: {
        required: true,
        error: { message: "Phone number is required." },
        regexValidation: {
            regex: /^\d{10}$/, // Exactly 10 digits
            errorMessage: "Phone number must be exactly 10 digits.",
        },
        customValidation: {
            validate: (value) => !/[^\d]/.test(value), // Custom: Ensure no non-numeric characters
            errorMessage: "Phone number must only contain digits.",
        },
    },
    email: {
        required: true,
        error: { message: "Email is required." },
        regexValidation: {
            regex: /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/, // Email regex
            errorMessage: "Invalid email address format.",
        },
        customValidation: {
            validate: (value) => value.includes("@") && value.includes("."), // Ensure @ and . are present
            errorMessage: "Email must include '@' and '.' symbols.",
        },
    },
    zip: {
        required: true,
        error: { message: "ZIP code is required." },
        regexValidation: {
            regex: /^\d{6}$/, // Valid 5-digit ZIP code
            errorMessage: "ZIP code must be exactly 5 digits.",
        },
        customValidation: {
            validate: (value) => value >= 100000 && value <= 999999, // Ensure ZIP is in range
            errorMessage: "ZIP code must be a valid 5-digit number.",
        },
    },
};

// Validate a single field
function validateField(fieldName, value) {
    const rules = validationRules[fieldName];
    const errors = [];

    if (!rules) {
        return { isValid: true, errors: [] }; // No rules defined for the field
    }

    // Required validation
    if (rules.required && (!value || value.trim() === "")) {
        errors.push(rules.error.message);
    }

    // Regex validation
    if (rules.regexValidation && !rules.regexValidation.regex.test(value)) {
        errors.push(rules.regexValidation.errorMessage);
    }

    console.log("value :: ", value, "  validationRules:;  ", fieldName);
    // Custom validation logic
    console.log("nn: ", rules.customValidation.validate(value));
    if (rules.customValidation && !rules.customValidation.validate(value)) {
        errors.push(rules.customValidation.errorMessage);
    }

    return errors.length === 0
        ? { isValid: true, errors: [] }
        : { isValid: false, errors };
}

// Validate the entire form
function validateForm(formData) {
    const errors = {};
    let isValid = true;

    for (const fieldName in validationRules) {
        const validationResult = validateField(fieldName, formData[fieldName]);
        console.log(fieldName, validationResult);
        if (!validationResult.isValid) {
            errors[fieldName] = validationResult.errors;
            isValid = false;
            return isValid
                ? { isValid: true, errors: {} }
                : { isValid: false, errors };
        }
    }

    return isValid ? { isValid: true, errors: {} } : { isValid: false, errors };
}


// Replace the existing form submit event listener with this corrected version
form.addEventListener("submit", function (e) {
    e.preventDefault();

    const data = getFormData();
    
    // Validate that at least one required field has a value
    const hasValue = Object.values(data).some(value => value.trim() !== '');
    if (!hasValue) {
        // alert("Please fill in at least one field before submitting.");
        return;
    }

    // Perform form validation
    const formValidation = validateForm(data);
    if (!formValidation.isValid) {
        // Handle validation errors
        for (const field in formValidation.errors) {
            const errorMessages = formValidation.errors[field];
            const errorField = document.getElementById(field);

            // Set the error message and highlight the field
            const errorElement = document.getElementById(`${field}Error`);
            if (errorElement) {
                errorElement.textContent = errorMessages.join(", ");
            }
            if (errorField) {
                errorField.style.borderColor = "red";
            }

            // Find the page where the field is located
            const pageWithError = Array.from(pages).findIndex((page) => 
                page.contains(errorField)
            ) + 1;

            // Navigate to the page with the error
            if (pageWithError > 0) {
                document.querySelectorAll(".form-page").forEach((page) => 
                    page.classList.remove("active")
                );
                document.getElementById(`page${pageWithError}`).classList.add("active");

                steps.forEach((step) => step.classList.remove("active"));
                steps[pageWithError - 1].classList.add("active");
            }
        }
        return;
    }

    // Handle form submission
    if (editIndex.value !== "") {
        // Update existing entry
        formData[editIndex.value] = data;
        editIndex.value = "";
        submitBtn.textContent = "Submit";
    } else {
        // Add new entry
        formData.unshift(data);
    }

    // Update table and reset form
    updateTable();
    form.reset();

    // Reset form view to first page
    document.querySelectorAll(".form-page").forEach((page) => 
        page.classList.remove("active")
    );
    document.getElementById("page1").classList.add("active");

    // Reset stepper to first step
    document.querySelectorAll(".step").forEach((step) => 
        step.classList.remove("active")
    );
    document.querySelector(".step").classList.add("active");

    // Reset step connector progress
    updateStepperProgress(1);
});
