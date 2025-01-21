export const ValidationModule = (() => {

    const validateForm = (event) => {
        event.preventDefault();

        const validateField = (key, val) => {
            if (val && validation[key].test(val)) return true;
            return false;
        };

        const formValues = {
            fullname: {
                value: $("#fullname").val(),
                message: "Full name should not be empty",
            },
            phone: {
                value: $("#phone").val(),
                message: "Phone number should not be empty",
            },
            email: {
                value: $("#email").val(),
                message: "Enter a valid email id",
            },
            dob: {
                value: $("#dob").val(),
                message: "Date of birth should not be empty",
            },
            age: {
                value: $("#age").val(),
                message: "Age cannot be empty",
            },
            address: {
                value: $("#address").val(),
                message: "Address should not be empty",
            },
            state: {
                value: $("#state").val(),
                message: "State should not be empty",
            },
            city: {
                value: $("#city").val(),
                message: "City should not be empty",
            },
            zip: {
                value: $("#zip").val(),
                message: "Zip code should not be empty",
            }
        };

        var validation = {
            fullname: /^[A-Za-z\s]+$/,
            phone: /^\d{10}$/,
            email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            dob: /^\d{4}-\d{2}-\d{2}$/,
            age: /^(?:1[89]|[2-9]\d|1\d{2})$/,
            address: /^.+$/,
            state: /^.+$/,
            city: /^.+$/,
            zip: /^\d{5}(-\d{4})?$/,  // US zip code validation (5 digits or 9 digits with hyphen)
        };

        $.each(formValues, function (key, val) {
            var isValid = validateField(key, val.value);

            if (!isValid) {
                var targetIds = "#" + String(key) + "-error";
                $(targetIds).text(`${val.message}`);
                setTimeout(() => {
                    $(targetIds).text(""); // Clear the error message after 3 seconds
                }, 3000);
            }
        });

    };

    window.validateForm = validateForm;
    return { validateForm };

})();
