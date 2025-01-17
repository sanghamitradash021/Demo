
            const form = document.getElementById('stepperForm');
            const pages = document.querySelectorAll('.form-page');
            const steps = document.querySelectorAll('.step');
            const submitBtn = document.getElementById('submitBtn');
            const editIndex = document.getElementById('editIndex');
            let formData = [];

        // Load data from localStorage on page load
        document.addEventListener('DOMContentLoaded', function() {
            
            const savedData = localStorage.getItem('formData');
            if (savedData) {
                formData = JSON.parse(savedData);
                updateTable();
            }
        });

        // Calculate age automatically when DOB changes
        document.getElementById('dob').addEventListener('change', function() {
            const dob = new Date(this.value);
            const today = new Date();
            let age = today.getFullYear() - dob.getFullYear();
            const monthDiff = today.getMonth() - dob.getMonth();
            
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
                age--;
            }
            
            document.getElementById('age').value = age;
        });
        function validatePage(pageNumber) {
            const currentPageElement = document.getElementById(`page${pageNumber}`);
            const inputs = currentPageElement.querySelectorAll('input[required], select[required]');
            let isValid = true;

            inputs.forEach((input) => {
                if (!input.value) {
                    isValid = false;
                    input.style.borderColor = 'red';
                } else {
                    input.style.borderColor = '#ddd';
                }
            });

            return isValid;
        }
        steps.forEach((step, index) => {
            step.addEventListener('click', () => {
                const stepIndex = index + 1; // Steps are zero-indexed
                let canNavigate = true;

                for (let i = 1; i < stepIndex; i++) {
                    if (!validatePage(i)) {
                        alert(`Please complete page ${i} before proceeding.`);
                        canNavigate = false;
                        break;
                    }
                }

                if (canNavigate) {
                    pages.forEach((page) => page.classList.remove('active'));
                    document.getElementById(`page${stepIndex}`).classList.add('active');

                    steps.forEach((s) => s.classList.remove('active'));
                    step.classList.add('active');
                }
            });
        });

        function nextPage(currentPage) {
            // Validate current page fields
            const currentPageElement = document.getElementById(`page${currentPage}`);
            const inputs = currentPageElement.querySelectorAll('input[required], select[required]');
            let isValid = true;

            inputs.forEach(input => {
                if (!input.value) {
                    isValid = false;
                    input.style.borderColor = 'red';
                } else {
                    input.style.borderColor = '#ddd';
                }
            });

            if (!isValid) {
                alert('Please fill in all required fields');
                return;
            }

            // If moving to preview page, populate preview data
            if (currentPage === 2) {
                populatePreview();
            }

            // Hide current page and show next page
            currentPageElement.classList.remove('active');
            document.getElementById(`page${currentPage + 1}`).classList.add('active');

            // Update stepper
            steps[currentPage - 1].classList.remove('active');
            steps[currentPage].classList.add('active');
        }

        function prevPage(currentPage) {
            // Hide current page and show previous page
            document.getElementById(`page${currentPage}`).classList.remove('active');
            document.getElementById(`page${currentPage - 1}`).classList.add('active');

            // Update stepper
            steps[currentPage - 1].classList.remove('active');
            steps[currentPage - 2].classList.add('active');
        }

        function populatePreview() {
            const previewData = document.getElementById('previewData');
            const data = getFormData();
            
            previewData.innerHTML = '';
            for (const [key, value] of Object.entries(data)) {
                previewData.innerHTML += `<p><strong>${key}:</strong> ${value}</p>`;
            }
        }

        function getFormData() {
            return {
                'Full Name': document.getElementById('fullName').value,
                'Phone': document.getElementById('phone').value,
                'Email': document.getElementById('email').value,
                'Date of Birth': document.getElementById('dob').value,
                'Age': document.getElementById('age').value,
                'Gender': document.getElementById('gender').value,
                'Address': document.getElementById('address').value,
                'Country': document.getElementById('country').value,
                'State': document.getElementById('state').value,
                'City': document.getElementById('city').value,
                'ZIP Code': document.getElementById('zip').value
            };
        }

        function updateTable() {
            const tableBody = document.getElementById('dataTableBody');
            tableBody.innerHTML = '';
            
            formData.forEach((data, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${data['Full Name']}</td>
                    <td>${data['Phone']}</td>
                    <td>${data['Email']}</td>
                    <td>${data['State']}</td>
                    <td class="action-buttons">
                        <button class="edit" onclick="editEntry(${index})">Edit</button>
                        <button class="delete" onclick="deleteEntry(${index})">Delete</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });

            // Save to localStorage
            localStorage.setItem('formData', JSON.stringify(formData));
        }

        function editEntry(index) {
            const data = formData[index];
            
            // Populate form fields
            document.getElementById('fullName').value = data['Full Name'];
            document.getElementById('phone').value = data['Phone'];
            document.getElementById('email').value = data['Email'];
            document.getElementById('dob').value = data['Date of Birth'];
            document.getElementById('age').value = data['Age'];
            document.getElementById('gender').value = data['Gender'];
            document.getElementById('address').value = data['Address'];
            document.getElementById('country').value = data['Country'];
            document.getElementById('state').value = data['State'];
            document.getElementById('city').value = data['City'];
            document.getElementById('zip').value = data['ZIP Code'];
            
            // Set edit index and change submit button text
            editIndex.value = index;
            submitBtn.textContent = 'Update';
            
            // Show first page
            document.querySelectorAll('.form-page').forEach(page => page.classList.remove('active'));
            document.getElementById('page1').classList.add('active');
            
            // Update stepper
            document.querySelectorAll('.step').forEach(step => step.classList.remove('active'));
            document.querySelector('.step').classList.add('active');
        }

        function deleteEntry(index) {
            if (confirm('Are you sure you want to delete this entry?')) {
                formData.splice(index, 1);
                updateTable();
            }
        }

        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const data = getFormData();
            
            if (editIndex.value !== '') {
                // Update existing entry
                formData[editIndex.value] = data;
                editIndex.value = '';
                submitBtn.textContent = 'Submit';
            } else {
                // Add new entry
                formData.push(data);
            }
            
            updateTable();
            form.reset();
            
            // Return to first page
            document.querySelectorAll('.form-page').forEach(page => page.classList.remove('active'));
            document.getElementById('page1').classList.add('active');
            
            // Update stepper
            document.querySelectorAll('.step').forEach(step => step.classList.remove('active'));
            document.querySelector('.step').classList.add('active');
        });
    