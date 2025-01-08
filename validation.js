// Validate Fullname
if (fullname === "") {
    alert("Fullname is required.");
    return false;
}

// Validate Age
if (age < 1 || age > 120) {
    alert("Please enter a valid age between 1 and 120.");
    return false;
}

// Validate Phone Number (must be 10 digits)
const phonePattern = /^\d{10}$/;
if (!phone.match(phonePattern)) {
    alert("Phone number should be 10 digits.");
    return false;
}

// Validate Email
const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
if (!email.match(emailPattern)) {
    alert("Please enter a valid email.");
    return false;
}

// Validate Date of Birth (should not be empty)
if (!dob) {
    alert("Date of birth is required.");
    return false;
}

// Validate Address
if (address === "") {
    alert("Address is required.");
    return false;
}

// Validate Gender (at least one gender must be selected)
if (!gender) {
    alert("Please select a gender.");
    return false;
}

// Validate Experience (at least one experience level must be selected)
if (!experience) {
    alert("Please select your experience level.");
    return false;
}

// Validate Preferred Medium
if (preferredMedium === "") {
    alert("Please select your preferred medium.");
    return false;
}

// If all validations pass, allow form submission
alert("Form submitted successfully!");
return true;

