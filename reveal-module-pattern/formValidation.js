// const ValidationModule = (function() {
//     const validationRules = {
//         fullName: {
//             required: true,
//             error: { message: "Full name is required." },
//             regexValidation: {
//                 regex: /^[A-Za-z\s]+$/,
//                 errorMessage: "Full name can only contain letters and spaces.",
//             },
//             customValidation: {
//                 validate: (value) => value.trim().split(/\s+/).length >= 2,
//                 errorMessage: "Full name must contain at least two words.",
//             },
//         },
//         phone: {
//             required: true,
//             error: { message: "Phone number is required." },
//             regexValidation: {
//                 regex: /^\d{10}$/,
//                 errorMessage: "Phone number must be exactly 10 digits.",
//             },
//             customValidation: {
//                 validate: (value) => !/[^\d]/.test(value),
//                 errorMessage: "Phone number must only contain digits.",
//             },
//         },
//         email: {
//             required: true,
//             error: { message: "Email is required." },
//             regexValidation: {
//                 regex: /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/,
//                 errorMessage: "Invalid email address format.",
//             },
//             customValidation: {
//                 validate: (value) => value.includes("@") && value.includes("."),
//                 errorMessage: "Email must include '@' and '.' symbols.",
//             },
//         },
//         zip: {
//             required: true,
//             error: { message: "ZIP code is required." },
//             regexValidation: {
//                 regex: /^\d{6}$/,
//                 errorMessage: "ZIP code must be exactly 6 digits.",
//             },
//             customValidation: {
//                 validate: (value) => value >= 100000 && value <= 999999,
//                 errorMessage: "ZIP code must be a valid 6-digit number.",
//             },
//         },
//     };

//     function validateField(fieldName, value) {
//         const rules = validationRules[fieldName];
//         const errors = [];

//         if (!rules) return { isValid: true, errors: [] };

//         if (rules.required && (!value || value.trim() === "")) {
//             errors.push(rules.error.message);
//         }

//         if (rules.regexValidation && !rules.regexValidation.regex.test(value)) {
//             errors.push(rules.regexValidation.errorMessage);
//         }

//         if (rules.customValidation && !rules.customValidation.validate(value)) {
//             errors.push(rules.customValidation.errorMessage);
//         }

//         return errors.length === 0 ? { isValid: true, errors: [] } : { isValid: false, errors };
//     }

//     function validateForm(formData) {
//         const errors = {};
//         let isValid = true;

//         for (const fieldName in validationRules) {
//             const validationResult = validateField(fieldName, formData[fieldName]);
//             if (!validationResult.isValid) {
//                 errors[fieldName] = validationResult.errors;
//                 isValid = false;
//             }
//         }

//         return isValid ? { isValid: true, errors: {} } : { isValid: false, errors };
//     }

//     return {
//         validateField,
//         validateForm
//     };
// })();

const ValidationModule = (function() {
    const validationRules = {
        fullName: {
            required: true,
            error: { message: "Full name is required." },
            regexValidation: {
                regex: /^[A-Za-z\s]+$/,
                errorMessage: "Full name can only contain letters and spaces.",
            },
            customValidation: {
                validate: (value) => value.trim().split(/\s+/).length >= 2,
                errorMessage: "Full name must contain at least two words.",
            },
        },
        phone: {
            required: true,
            error: { message: "Phone number is required." },
            regexValidation: {
                regex: /^\d{10}$/,
                errorMessage: "Phone number must be exactly 10 digits.",
            },
            customValidation: {
                validate: (value) => !/[^\d]/.test(value),
                errorMessage: "Phone number must only contain digits.",
            },
        },
        email: {
            required: true,
            error: { message: "Email is required." },
            regexValidation: {
                regex: /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/,
                errorMessage: "Invalid email address format.",
            },
            customValidation: {
                validate: (value) => value.includes("@") && value.includes("."),
                errorMessage: "Email must include '@' and '.' symbols.",
            },
        },
        zip: {
            required: true,
            error: { message: "ZIP code is required." },
            regexValidation: {
                regex: /^\d{6}$/,
                errorMessage: "ZIP code must be exactly 6 digits.",
            },
            customValidation: {
                validate: (value) => value >= 100000 && value <= 999999,
                errorMessage: "ZIP code must be a valid 6-digit number.",
            },
        },
    };

    function validateField(fieldName, value) {
        const rules = validationRules[fieldName];
        const errors = [];

        if (!rules) return { isValid: true, errors: [] };

        // Trim the value if it's a string
        const trimmedValue = typeof value === 'string' ? value.trim() : value;

        // Required field validation
        if (rules.required && (!trimmedValue || trimmedValue === "")) {
            errors.push(rules.error.message);
            return { isValid: false, errors }; // Return early if required field is empty
        }

        // Skip other validations if field is empty and not required
        if (!trimmedValue && !rules.required) {
            return { isValid: true, errors: [] };
        }

        // Regex validation
        if (rules.regexValidation && !rules.regexValidation.regex.test(trimmedValue)) {
            errors.push(rules.regexValidation.errorMessage);
        }

        // Custom validation
        if (rules.customValidation && !rules.customValidation.validate(trimmedValue)) {
            errors.push(rules.customValidation.errorMessage);
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    function validateForm(formData) {
        const errors = {};
        let isValid = true;
        let firstErrorField = null;

        for (const fieldName in validationRules) {
            const validationResult = validateField(fieldName, formData[fieldName]);
            
            if (!validationResult.isValid) {
                errors[fieldName] = validationResult.errors;
                isValid = false;
                
                // Store the first field that has an error
                if (!firstErrorField) {
                    firstErrorField = fieldName;
                }
            }
        }

        return {
            isValid,
            errors,
            firstErrorField
        };
    }

    // Add utility function to check if a page has valid inputs
    function validatePageInputs(pageElement) {
        const inputs = pageElement.querySelectorAll("input[required], select[required]");
        const pageErrors = {};
        let isValid = true;

        inputs.forEach(input => {
            const validationResult = validateField(input.id, input.value);
            if (!validationResult.isValid) {
                pageErrors[input.id] = validationResult.errors;
                isValid = false;
            }
        });

        return {
            isValid,
            errors: pageErrors
        };
    }

    return {
        validateField,
        validateForm,
        validatePageInputs
    };
})();