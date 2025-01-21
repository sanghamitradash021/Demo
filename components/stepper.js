export const StepperModule = (() => {
    const stepper = () => {
        let i = 0;
        const stepss = $(".form-page");
        const next = $(".next-btn");
        const prev = $(".prev-btn");

        console.log("prev ", prev + " next ", next);

        if (i === 0) {
            prev.addClass("Inactive");
            next.addClass("extraPadding");
        }

        $('#myButton').click(function () {
            console.log("i ", i);
            var isValid = false;
            var mainValid = true;

            if (i == 0) {
                function validateForm(key, val) {
                    if (val && validation[key].test(val)) return true;
                    return false;
                }

                const formValues = {
                    fullname: {
                        value: $("#fullname").val(),
                        message: "Fullname should not be empty ",
                    },
                    phone: {
                        value: $("#phone").val(),
                        message: "phone should not be empty",
                    },
                    email: {
                        value: $("#email").val(),
                        message: "Email should not be empty",
                    },
                    dob: {
                        value: $("#dob").val(),
                        message: "dob should not be empty",
                    },
                    age: {
                        value: $("#age").val(),
                        message: "Age Can Not Be Empty"
                    },
                    gender: {
                        value: $("#gender").val(),
                        message: "Gender Can Not Be Empty"
                    },
                }

                console.log("fullname ", $("#fullname").val());
                console.log("phone", $("#phone").val());
                console.log("email ", $("#email").val());
                console.log("dob ", $("#dob").val());
                console.log("age ", $("#age").val());
                console.log("gender ", $("#gender").val());

                

                // Full Name Validation
                $("#fullname").blur(function () {
                    const fullnameRegex = /^[A-Za-z\s]+$/;
                    if (!fullnameRegex.test(this.value)) {
                        $(this).css("borderColor", "red");
                        $("#fullname-error").text("Full name should only contain letters and spaces.");
                    } else {
                        $(this).css("borderColor", "green");
                        $("#fullname-error").text("");
                    }
                });

                // Phone Validation
                $("#phone").blur(function () {
                    const phoneRegex = /^\d{10}$/;
                    if (!phoneRegex.test(this.value)) {
                        $(this).css("borderColor", "red");
                        $("#phone-error").text("Phone number should be exactly 10 digits.");
                    } else {
                        $(this).css("borderColor", "green");
                        $("#phone-error").text("");
                    }
                });

                // Email Validation
                $("#email").blur(function () {
                    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                    if (!emailRegex.test(this.value)) {
                        $(this).css("borderColor", "red");
                        $("#email-error").text("Please enter a valid email address.");
                    } else {
                        $(this).css("borderColor", "green");
                        $("#email-error").text("");
                    }
                });

                // DOB Validation (YYYY-MM-DD)
                $("#dob").blur(function () {
                    const dobRegex = /^\d{4}-\d{2}-\d{2}$/;
                    if (!dobRegex.test(this.value)) {
                        $(this).css("borderColor", "red");
                        $("#dob-error").text("Date of birth must be in the format YYYY-MM-DD.");
                    } else {
                        $(this).css("borderColor", "green");
                        $("#dob-error").text("");
                    }
                });

                // Age Validation (18 to 199)
                $("#age").blur(function () {
                    const ageRegex = /^(?:1[89]|[2-9]\d|1\d{2})$/;
                    if (!ageRegex.test(this.value)) {
                        $(this).css("borderColor", "red");
                        $("#age-error").text("Age must be between 18 and 199.");
                    } else {
                        $(this).css("borderColor", "green");
                        $("#age-error").text("");
                    }
                });

                // Gender Validation (male, female, other)
                $("#gender").blur(function () {
                    const genderRegex = /^(?:male|female|other)$/i;
                    if (!genderRegex.test(this.value)) {
                        $(this).css("borderColor", "red");
                        $("#gender-error").text("Gender must be male, female, or other.");
                    } else {
                        $(this).css("borderColor", "green");
                        $("#gender-error").text("");
                    }
                });

                // Address Validation
                $("#address").blur(function () {
                    const addressValue = this.value.trim();
                    if (addressValue === "") {
                        $(this).css("borderColor", "red");
                        $("#address-error").text("Address cannot be empty.");
                    } else {
                        $(this).css("borderColor", "green");
                        $("#address-error").text("");
                    }
                });

                // City Validation
                $("#city").blur(function () {
                    const cityValue = this.value.trim();
                    if (cityValue === "") {
                        $(this).css("borderColor", "red");
                        $("#city-error").text("City cannot be empty.");
                    } else {
                        $(this).css("borderColor", "green");
                        $("#city-error").text("");
                    }
                });

                // State Validation
                $("#state").blur(function () {
                    const stateValue = this.value.trim();
                    if (stateValue === "") {
                        $(this).css("borderColor", "red");
                        $("#state-error").text("State cannot be empty.");
                    } else {
                        $(this).css("borderColor", "green");
                        $("#state-error").text("");
                    }
                });

                if (mainValid == false) {
                    openToast("Fill All The Fields", "danger");
                } else {
                    i = 1;
                    prev.removeClass("Inactive");
                    next.removeClass("Inactive");

                    stepss.removeClass("active");
                    steppss.eq(i).addClass("active");
                }
            }
        });
    };
    window.stepper = stepper;
    return { stepper };
})();
