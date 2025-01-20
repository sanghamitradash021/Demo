const FormDataModule = (function() {
    let formData = [];

    function init() {
        loadSavedData();
        initializeAgeCalculation();
    }

    function loadSavedData() {
        const savedData = localStorage.getItem("formData");
        if (savedData) {
            formData = JSON.parse(savedData);
            updateTable();
        }
    }

    function initializeAgeCalculation() {
        document.getElementById("dob").addEventListener("change", calculateAge);
    }

    function calculateAge() {
        const dob = new Date(this.value);
        const today = new Date();
        let age = today.getFullYear() - dob.getFullYear();
        const monthDiff = today.getMonth() - dob.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
            age--;
        }

        document.getElementById("age").value = age;
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


    function addData(data) {
        formData.unshift(data);
        updateTable();
        saveToLocalStorage();
    }

    function updateData(index, data) {
        formData[index] = data;
        updateTable();
        saveToLocalStorage();
    }
    function deleteData(index) {
        formData.splice(index, 1);
        updateTable();
        saveToLocalStorage();
    }

    function saveToLocalStorage() {
        localStorage.setItem("formData", JSON.stringify(formData));
    }

    function updateTable() {
        const tableBody = document.getElementById("dataTableBody");
        tableBody.innerHTML = "";

        formData.forEach((data, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${data.fullName}</td>
                <td>${data.phone}</td>
                <td>${data.email}</td>
                <td>${data.state}</td>
                <td class="action-buttons">
                    <button class="edit" onclick="FormModule.editEntry(${index})">
                        <i class="fas fa-edit"></i>
                        Edit
                    </button>
                    <button class="delete" onclick="FormModule.deleteEntry(${index})">
                        <i class="fas fa-trash"></i>
                        Delete
                    </button>
                </td>
            `;
            tableBody.insertBefore(row, tableBody.firstChild);
        });

        // localStorage.setItem("formData", JSON.stringify(formData));
    }

    return {
        init,
        getFormData,
        addData,
        updateData,
        deleteData,
        updateTable,
        // formData
    };
})();

// const FormDataModule = (function() {
//     let formData = [];
//     const STORAGE_KEY = 'formData';
//     const REQUIRED_FIELDS = ['fullName', 'phone', 'email', 'zip'];

//     function init() {
//         loadSavedData();
//         initializeAgeCalculation();
//         initializeFieldValidation();
//         setupAutosave();
//     }

//     function loadSavedData() {
//         try {
//             const savedData = localStorage.getItem(STORAGE_KEY);
//             if (savedData) {
//                 formData = JSON.parse(savedData);
//                 updateTable();
//             }
//         } catch (error) {
//             console.error('Error loading saved data:', error);
//             formData = [];
//         }
//     }

//     function saveData() {
//         try {
//             localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
//         } catch (error) {
//             console.error('Error saving data:', error);
//         }
//     }

//     function setupAutosave() {
//         let autosaveTimer;
//         const form = document.getElementById('stepperForm');

//         form.addEventListener('input', () => {
//             clearTimeout(autosaveTimer);
//             autosaveTimer = setTimeout(saveData, 1000);
//         });
//     }

//     function initializeAgeCalculation() {
//         const dobInput = document.getElementById("dob");
//         if (dobInput) {
//             dobInput.addEventListener("change", calculateAge);
//             // Set max date to today
//             dobInput.max = new Date().toISOString().split('T')[0];
//         }
//     }

//     function initializeFieldValidation() {
//         const form = document.getElementById('stepperForm');
//         const fields = form.querySelectorAll('input, select');

//         fields.forEach(field => {
//             field.addEventListener('blur', function() {
//                 if (REQUIRED_FIELDS.includes(this.id)) {
//                     const validationResult = ValidationModule.validateField(this.id, this.value);
//                     updateFieldValidationUI(this.id, validationResult);
//                 }
//             });

//             // Add input event listener for real-time validation
//             field.addEventListener('input', function() {
//                 clearFieldError(this.id);
//             });
//         });
//     }

//     function updateFieldValidationUI(fieldId, validationResult) {
//         const errorElement = document.getElementById(`${fieldId}Error`);
//         const field = document.getElementById(fieldId);

//         if (!validationResult.isValid) {
//             field.classList.add('error');
//             if (errorElement) {
//                 errorElement.textContent = validationResult.errors.join(', ');
//             }
//         } else {
//             field.classList.remove('error');
//             if (errorElement) {
//                 errorElement.textContent = '';
//             }
//         }
//     }

//     function clearFieldError(fieldId) {
//         const errorElement = document.getElementById(`${fieldId}Error`);
//         const field = document.getElementById(fieldId);

//         if (field) {
//             field.classList.remove('error');
//         }
//         if (errorElement) {
//             errorElement.textContent = '';
//         }
//     }

//     function calculateAge() {
//         const dob = new Date(this.value);
//         const today = new Date();
//         let age = today.getFullYear() - dob.getFullYear();
//         const monthDiff = today.getMonth() - dob.getMonth();

//         if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
//             age--;
//         }

//         const ageInput = document.getElementById("age");
//         if (ageInput) {
//             ageInput.value = age;
//             // Trigger validation if age is a required field
//             const event = new Event('blur');
//             ageInput.dispatchEvent(event);
//         }
//     }

//     function getFormData() {
//         const formElements = {
//             fullName: document.getElementById("fullName"),
//             phone: document.getElementById("phone"),
//             email: document.getElementById("email"),
//             dob: document.getElementById("dob"),
//             age: document.getElementById("age"),
//             gender: document.getElementById("gender"),
//             address: document.getElementById("address"),
//             country: document.getElementById("country"),
//             state: document.getElementById("state"),
//             city: document.getElementById("city"),
//             zip: document.getElementById("zip")
//         };

//         const data = {};
//         for (const [key, element] of Object.entries(formElements)) {
//             if (element) {
//                 data[key] = element.value.trim();
//             }
//         }

//         return data;
//     }

//     function updateTable() {
//         // const tableBody = document.getElementById("dataTableBody");
//         // if (!tableBody) return;
//         const tableBody = document.getElementById("dataTableBody");
//         if (!tableBody) {
//             console.error("Table body element not found");
//             return;
//         }

//         console.log("Updating table with data:", formData);

//         tableBody.innerHTML = "";

//         formData.forEach((data, index) => {
//             const row = document.createElement("tr");
//             row.innerHTML = `
//                 <td>${escapeHtml(data.fullName)}</td>
//                 <td>${escapeHtml(data.phone)}</td>
//                 <td>${escapeHtml(data.email)}</td>
//                 <td>${escapeHtml(data.state)}</td>
//                 <td class="action-buttons">
//                     <button class="edit" onclick="FormModule.editEntry(${index})">
//                         <i class="fas fa-edit"></i>
//                         Edit
//                     </button>
//                     <button class="delete" onclick="FormModule.deleteEntry(${index})">
//                         <i class="fas fa-trash"></i>
//                         Delete
//                     </button>
//                 </td>
//             `;
//             tableBody.appendChild(row);
//         });

//         saveData();
//     }

//     function escapeHtml(unsafe) {
//         return unsafe
//             .replace(/&/g, "&amp;")
//             .replace(/</g, "&lt;")
//             .replace(/>/g, "&gt;")
//             .replace(/"/g, "&quot;")
//             .replace(/'/g, "&#039;");
//     }

//     return {
//         init,
//         getFormData,
//         updateTable,
//         saveData,
//         formData
//     };
// })();