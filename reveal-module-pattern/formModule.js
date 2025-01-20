const FormModule = (function() {
    let form;
    let submitBtn;
    let editIndex;

    const state = {
        formData: []
    };

    function init() {
        form = document.getElementById("stepperForm");
        submitBtn = document.getElementById("submitBtn");
        editIndex = document.getElementById("editIndex");
        // console.log("this function has been called")S
        initializeFormEvents();
    }

    function initializeFormEvents() {
        form.addEventListener("submit", handleFormSubmit);
    }

    function validatePage(pageNumber) {
        const currentPageElement = document.getElementById(`page${pageNumber}`);
        const inputs = currentPageElement.querySelectorAll("input[required], select[required]");
        return Array.from(inputs).every(input => input.value.trim() !== "");
    }
    
     //ading new fun
    function handleFormSubmit(e) {
        e.preventDefault();

        const data = FormDataModule.getFormData();
        const formValidation = ValidationModule.validateForm(data);

        if (!formValidation.isValid) {
            handleValidationErrors(formValidation.errors);
            return;
        }

        // Check if we're editing or adding new data
        if (editIndex.value !== "") {
            FormDataModule.updateData(parseInt(editIndex.value), data);
            editIndex.value = "";
            submitBtn.textContent = "Submit";
        } else {
            FormDataModule.addData(data);
        }

        resetForm();
    }
    // function handleValidationErrors(errors) {
    //     for (const field in errors) {
    //         displayFieldError(field, errors[field]);
    //         navigateToFieldPage(field);
    //     }
    // }


    function nextPage(currentPage) {
        if (!validatePageWithErrors(currentPage)) return;

        const currentPageElement = document.getElementById(`page${currentPage}`);
        const nextPageElement = document.getElementById(`page${currentPage + 1}`);

        animatePageTransition(currentPageElement, nextPageElement);

        if (currentPage === 2) {
            populatePreview();
        }

        StepperModule.navigateToStep(currentPage + 1);
    }

    function prevPage(currentPage) {
        if (!validatePageWithErrors(currentPage)) return;
        
        const currentPageElement = document.getElementById(`page${currentPage}`);
        const prevPageElement = document.getElementById(`page${currentPage - 1}`);

        animatePageTransition(currentPageElement, prevPageElement, true);
        StepperModule.navigateToStep(currentPage - 1);
    }

    function validatePageWithErrors(pageNumber) {
        const currentPageElement = document.getElementById(`page${pageNumber}`);
        const inputs = currentPageElement.querySelectorAll("input[required], select[required]");
        let isValid = true;

        inputs.forEach(input => {
            const validationResult = ValidationModule.validateField(input.id, input.value);
            if (!validationResult.isValid) {
                isValid = false;
                displayFieldError(input.id, validationResult.errors);
            } else {
                clearFieldError(input.id);
            }
        });

        return isValid;
    }

    function displayFieldError(fieldId, errors) {
        const errorField = document.getElementById(`${fieldId}Error`);
        const input = document.getElementById(fieldId);
        if (errorField) {
            errorField.textContent = errors.join(", ");
        }
        if (input) {
            input.style.borderColor = "red";
        }
    }

    function clearFieldError(fieldId) {
        const errorField = document.getElementById(`${fieldId}Error`);
        const input = document.getElementById(fieldId);
        if (errorField) {
            errorField.textContent = "";
        }
        if (input) {
            input.style.borderColor = "#ddd";
        }
    }

    function animatePageTransition(currentPage, nextPage, isPrev = false) {
        currentPage.classList.add(isPrev ? 'slide-prev-out' : 'slide-out');
        setTimeout(() => {
            currentPage.classList.remove('active', 'slide-out', 'slide-prev-out');
            nextPage.classList.add('active', isPrev ? 'slide-prev-in' : 'slide-in');
            setTimeout(() => {
                nextPage.classList.remove('slide-in', 'slide-prev-in');
            }, 300);
        }, 300);
    }

    function populatePreview() {
        const previewData = document.getElementById("previewData");
        const data = FormDataModule.getFormData();
        
        previewData.innerHTML = Object.entries(data)
            .map(([key, value]) => `<p><strong>${key}:</strong> ${value}</p>`)
            .join("");
    }

    function handleFormSubmit(e) {
        e.preventDefault();

        const data = FormDataModule.getFormData();
        const formValidation = ValidationModule.validateForm(data);

        if (!formValidation.isValid) {
            handleValidationErrors(formValidation.errors);
            return;
        }

        if (editIndex.value !== "") {
            FormDataModule.formData[editIndex.value] = data;
            editIndex.value = "";
            submitBtn.textContent = "Submit";
        } else {
            FormDataModule.formData.unshift(data);
        }

        FormDataModule.updateTable();
        resetForm();
    }

    function handleValidationErrors(errors) {
        for (const field in errors) {
            displayFieldError(field, errors[field]);
            navigateToFieldPage(field);
        }
    }

    function navigateToFieldPage(fieldId) {
        const field = document.getElementById(fieldId);
        const page = Array.from(document.querySelectorAll('.form-page')).find(page => page.contains(field));
        if (page) {
            const pageNumber = parseInt(page.id.replace('page', ''));
            StepperModule.navigateToStep(pageNumber);
        }
    }

    function resetForm() {
        form.reset();
        StepperModule.navigateToStep(1);
        clearAllErrors();
    }
    function clearAllErrors() {
        const errorFields = document.querySelectorAll('.error-message');
        errorFields.forEach(field => field.textContent = '');
        const inputs = document.querySelectorAll('input, select');
        inputs.forEach(input => input.style.borderColor = '#ddd');
    }

    function editEntry(index) {
        const data = FormDataModule.formData[index];
        Object.entries(data).forEach(([key, value]) => {
            const element = document.getElementById(key);
            if (element) element.value = value;
        });

        editIndex.value = index;
        submitBtn.textContent = "Update";
        StepperModule.navigateToStep(1);
    }

    function deleteEntry(index) {
        if (confirm("Are you sure you want to delete this entry?")) {
            FormDataModule.formData.splice(index, 1);
            FormDataModule.updateTable();
        }
    }

    return {
        init,
        validatePage,
        nextPage,
        prevPage,
        editEntry,
        deleteEntry
    };
})();








// const FormModule = (function() {
//     let form;
//     let submitBtn;
//     let editIndex;
//     let steps;
//     let pages;

//     function init() {
//         form = document.getElementById("stepperForm");
//         submitBtn = document.getElementById("submitBtn");
//         editIndex = document.getElementById("editIndex");
//         steps = document.querySelectorAll(".step");
//         pages = document.querySelectorAll(".form-page");
//         initializeFormEvents();
//     }

//     // function initializeFormEvents() {
//     //     form.addEventListener("submit", function(e) {
//     //         e.preventDefault();
            
//     //         const data = FormDataModule.getFormData();
            
//     //         // Validate that at least one required field has a value
//     //         const hasValue = Object.values(data).some(value => 
//     //             value && value.toString().trim() !== ''
//     //         );
            
//     //         if (!hasValue) {
//     //             return;
//     //         }

//     //         // Perform form validation
//     //         const formValidation = ValidationModule.validateForm(data);
//     //         if (!formValidation.isValid) {
//     //             handleValidationErrors(formValidation.errors);
//     //             return;
//     //         }

//     //         handleSuccessfulSubmission(data);
//     //     });
//     // }
//     function initializeFormEvents() {
//         if (form) {
//             form.addEventListener("submit", handleFormSubmit);
//         }
//     }

//     function handleFormSubmit(e) {
//         e.preventDefault();
//         console.log("Form submitted"); // Debug log

//         const data = FormDataModule.getFormData();
//         console.log("Form data:", data); // Debug log
        
//         // Validate that required fields have values
//         const formValidation = ValidationModule.validateForm(data);
//         if (!formValidation.isValid) {
//             console.log("Validation failed:", formValidation.errors); // Debug log
//             handleValidationErrors(formValidation.errors);
//             return;
//         }

//         // If editing existing entry
//         if (editIndex.value !== "") {
//             console.log("Updating entry at index:", editIndex.value); // Debug log
//             FormDataModule.formData[parseInt(editIndex.value)] = data;
//             editIndex.value = "";
//             submitBtn.textContent = "Submit";
//         } else {
//             // Add new entry
//             console.log("Adding new entry"); // Debug log
//             FormDataModule.formData.unshift(data);
//         }

//         FormDataModule.updateTable();
//         resetForm();

//         // Navigate to first page
//         StepperModule.navigateToStep(1);
//     }

//     // Add the missing validatePageWithErrors function
//     function validatePageWithErrors(pageNumber) {
//         const currentPageElement = document.getElementById(`page${pageNumber}`);
//         const inputs = currentPageElement.querySelectorAll("input[required], select[required]");
//         let isValid = true;

//         inputs.forEach(input => {
//             const validationResult = ValidationModule.validateField(input.id, input.value);
//             if (!validationResult.isValid) {
//                 isValid = false;
//                 displayFieldError(input.id, validationResult.errors);
//             } else {
//                 clearFieldError(input.id);
//             }
//         });

//         return isValid;
//     }

//     function clearFieldError(fieldId) {
//         const errorField = document.getElementById(`${fieldId}Error`);
//         const input = document.getElementById(fieldId);
//         if (errorField) {
//             errorField.textContent = "";
//         }
//         if (input) {
//             input.style.borderColor = "#ddd";
//         }
//     }

//     function handleValidationErrors(errors) {
//         let firstErrorPage = null;

//         for (const field in errors) {
//             const errorField = document.getElementById(field);
//             displayFieldError(field, errors[field]);

//             // Find the page containing the first error
//             if (!firstErrorPage && errorField) {
//                 const page = Array.from(pages).find(page => page.contains(errorField));
//                 if (page) {
//                     firstErrorPage = parseInt(page.id.replace('page', ''));
//                 }
//             }
//         }

//         // Navigate to the first page with an error
//         if (firstErrorPage) {
//             navigateToPage(firstErrorPage);
//         }
//     }

//     function handleSuccessfulSubmission(data) {
//         if (editIndex.value !== "") {
//             FormDataModule.formData[editIndex.value] = data;
//             editIndex.value = "";
//             submitBtn.textContent = "Submit";
//         } else {
//             FormDataModule.formData.unshift(data);
//         }

//         FormDataModule.updateTable();
//         resetForm();
//     }

//     function displayFieldError(fieldId, errors) {
//         const errorField = document.getElementById(`${fieldId}Error`);
//         const input = document.getElementById(fieldId);
        
//         if (errorField) {
//             errorField.textContent = Array.isArray(errors) ? errors.join(", ") : errors;
//         }
//         if (input) {
//             input.style.borderColor = "red";
//         }
//     }

//     function navigateToPage(pageNumber) {
//         pages.forEach(page => page.classList.remove("active"));
//         document.getElementById(`page${pageNumber}`).classList.add("active");

//         steps.forEach(step => step.classList.remove("active"));
//         steps[pageNumber - 1].classList.add("active");

//         StepperModule.updateStepperProgress(pageNumber);
//     }

//     function resetForm() {
//         form.reset();
//         navigateToPage(1);
//         clearAllErrors();
//     }

//     function clearAllErrors() {
//         const errorFields = document.querySelectorAll("[id$='Error']");
//         const inputs = document.querySelectorAll("input, select");

//         errorFields.forEach(field => field.textContent = "");
//         inputs.forEach(input => input.style.borderColor = "#ddd");
//     }

//     function validatePage(pageNumber) {
//         const currentPageElement = document.getElementById(`page${pageNumber}`);
//         const inputs = currentPageElement.querySelectorAll("input[required], select[required]");
//         return Array.from(inputs).every(input => input.value.trim() !== "");
//     }

//     function nextPage(currentPage) {
//         if (!validatePageWithErrors(currentPage)) return;
//         const currentPageElement = document.getElementById(`page${currentPage}`);
//         const nextPageElement = document.getElementById(`page${currentPage + 1}`);
//         animatePageTransition(currentPageElement, nextPageElement);
//         if (currentPage === 2) {
//             populatePreview();
//         }
//         StepperModule.navigateToStep(currentPage + 1);
//     }

//     function prevPage(currentPage) {
//         if (!validatePageWithErrors(currentPage)) return;
//         const currentPageElement = document.getElementById(`page${currentPage}`);
//         const prevPageElement = document.getElementById(`page${currentPage - 1}`);
//         animatePageTransition(currentPageElement, prevPageElement, true);
//         StepperModule.navigateToStep(currentPage - 1);
//     }

//     // Add the missing animatePageTransition function
//     function animatePageTransition(currentPage, nextPage, isPrev = false) {
//         currentPage.classList.add(isPrev ? 'slide-prev-out' : 'slide-out');
//         setTimeout(() => {
//             currentPage.classList.remove('active', 'slide-out', 'slide-prev-out');
//             nextPage.classList.add('active', isPrev ? 'slide-prev-in' : 'slide-in');
//             setTimeout(() => {
//                 nextPage.classList.remove('slide-in', 'slide-prev-in');
//             }, 300);
//         }, 300);
//     }

//     function populatePreview() {
//         const previewData = document.getElementById("previewData");
//         const data = FormDataModule.getFormData();
        
//         if (previewData) {
//             previewData.innerHTML = Object.entries(data)
//                 .map(([key, value]) => `<p><strong>${key}:</strong> ${value}</p>`)
//                 .join("");
//         }
//     }

//     function editEntry(index) {
//         const data = FormDataModule.formData[index];
//         for (const [key, value] of Object.entries(data)) {
//             const element = document.getElementById(key);
//             if (element) {
//                 element.value = value;
//             }
//         }

//         editIndex.value = index;
//         submitBtn.textContent = "Update";
//         StepperModule.navigateToStep(1);
//     }

//     function deleteEntry(index) {
//         if (confirm("Are you sure you want to delete this entry?")) {
//             FormDataModule.formData.splice(index, 1);
//             FormDataModule.updateTable();
//         }
//     }

//     return {
//         init,
//         validatePage,
//         nextPage,
//         prevPage,
//         editEntry,
//         deleteEntry
//     };
// })();