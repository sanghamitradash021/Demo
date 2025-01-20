(function() {
    const countryStateCityData = {
      India: {
        Maharashtra: ["Mumbai", "Pune", "Nagpur"],
        Gujarat: ["Ahmedabad", "Surat", "Vadodara"]
      },
      USA: {
        California: ["Los Angeles", "San Francisco", "San Diego"],
        Texas: ["Houston", "Dallas", "Austin"]
      }
    };
  
    let editingRow = null;
  
    function initializeTableFromStorage() {
      const storedData = localStorage.getItem('formSubmissions');
      if (storedData) {
        const submissions = JSON.parse(storedData);
        const table = $("#dataTable");
  
        submissions.forEach(formValues => {
          const newRow = $("<tr></tr>");
          const visibleColumns = ['name', 'phone', 'email', 'country', 'city'];
  
          visibleColumns.forEach(column => {
            const value = formValues[column] || '';
            newRow.append(`<td>${value}</td>`);
          });
  
          newRow.append(`
            <td>
              <button class="edit-button">Edit</button>
              <button class="delete-button">Delete</button>
            </td>
          `);
  
          table.append(newRow);
        });
      }
    }
  
    function populateCountries() {
      const countrySelect = $('#country');
      for (const country in countryStateCityData) {
        $('<option></option>').val(country).text(country).appendTo(countrySelect);
      }
    }
  
    function populateStates() {
      const countrySelect = $('#country').val();
      const stateSelect = $('#state').empty().append('<option value="">Select State</option>');
      const citySelect = $('#city').empty().append('<option value="">Select City</option>');
  
      if (countrySelect) {
        const states = countryStateCityData[countrySelect];
        for (const state in states) {
          $('<option></option>').val(state).text(state).appendTo(stateSelect);
        }
      }
    }
  
    function populateCities() {
      const stateSelect = $('#state').val();
      const citySelect = $('#city').empty().append('<option value="">Select City</option>');
      const countrySelect = $('#country').val();
  
      if (countrySelect && stateSelect) {
        const cities = countryStateCityData[countrySelect][stateSelect];
        cities.forEach(city => {
          $('<option></option>').val(city).text(city).appendTo(citySelect);
        });
      }
    }
  
    function validateStep(currentStep) {
      let isValid = true;
      $(`#step${currentStep} input`).each(function() {
        const input = $(this);
        if (input.val() === "") {
          isValid = false;
          input.addClass("invalid");
        } else {
          input.removeClass("invalid");
        }
      });
      return isValid;
    }
  
    function nextStep(step) {
      if (validateStep(step - 1)) {
        $(".form-step.active").fadeOut(function() {
          $(this).removeClass("active");
          $(`#step${step}`).fadeIn().addClass("active");
        });
        $(".step.active").removeClass("active");
        $(`.step[data-step='${step}']`).addClass("active");
      }
    }
  
    function prevStep(step) {
      $(".form-step.active").fadeOut(function() {
        $(this).removeClass("active");
        $(`#step${step}`).fadeIn().addClass("active");
      });
      $(".step.active").removeClass("active");
      $(`.step[data-step='${step}']`).addClass("active");
    }
  
    function showModal(modalId) {
      const modal = $(`#${modalId}`);
      if (modalId === 'previewModal') {
        const formData = $("#stepperForm").serializeArray();
        let previewHtml = '';
        formData.forEach(({ name, value }) => {
          const formattedName = name.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
          previewHtml += `<p><strong>${formattedName}:</strong> ${value || '-'}</p>`;
        });
        $("#previewContent").html(previewHtml);
      }
      modal.fadeIn().addClass("active");
      $('body').css('overflow', 'hidden');
    }
  
    function hideModal(modalId) {
      $(`#${modalId}`).fadeOut(function() {
        $(this).removeClass("active");
      });
      $('body').css('overflow', '');
    }
  
    function submitData() {
      const formData = getFormData();
      if (editingRow) {
        updateRow(formData);
      } else {
        addRow(formData);
      }
      resetForm();
    }
  
    function addRow(formData) {
      const table = $('#dataTable');
      const newRow = $('<tr></tr>').appendTo(table);
  
      formData.forEach(data => {
        $('<td></td>').text(data).appendTo(newRow);
      });
  
      $('<td></td>').html(`
        <button class="edit-button">Edit</button>
        <button class="delete-button">Delete</button>
      `).appendTo(newRow);
  
      storeDataInLocalStorage(formData);
    }
  
    function editRow(button) {
      editingRow = button.closest('tr');
      const cells = editingRow.find('td');
  
      $('#name').val(cells.eq(0).text());
      $('#phone').val(cells.eq(1).text());
      $('#email').val(cells.eq(2).text());
      $('#country').val(cells.eq(3).text());
      $('#state').val(cells.eq(4).text()).change();
      $('#city').val(cells.eq(5).text());
  
      $('#submitButton').text("Update");
    }
  
    function updateRow(formData) {
      const cells = editingRow.find('td');
  
      formData.forEach((data, index) => {
        cells.eq(index).text(data);
      });
  
      const index = editingRow.index();
      updateDataInLocalStorage(index, formData);
      editingRow = null;
  
      $('#submitButton').text("Submit");
    }
  
    function storeDataInLocalStorage(formData) {
      let storedData = localStorage.getItem('formSubmissions');
      let submissions = storedData ? JSON.parse(storedData) : [];
      submissions.push(formData);
      localStorage.setItem('formSubmissions', JSON.stringify(submissions));
    }
  
    function updateDataInLocalStorage(index, formData) {
      let storedData = localStorage.getItem('formSubmissions');
      let submissions = JSON.parse(storedData);
      submissions[index] = formData;
      localStorage.setItem('formSubmissions', JSON.stringify(submissions));
    }
  
    function showSubmitModal() {
      const modal = $('#submitModal');
      modal.html(`
        <div class="modal-content">
          <h2>Are you sure you want to submit?</h2>
          <div class="modal-buttons">
            <button id="confirmSubmitButton">Yes</button>
            <button onclick="hideModal('submitModal')">No</button>
          </div>
        </div>
      `);
      modal.fadeIn().addClass("active");
      $('body').css('overflow', 'hidden');
  
      $('#confirmSubmitButton').on('click', function() {
        submitData();
        hideModal('submitModal');
      });
    }
  
    function showDeleteModal(button) {
      const modal = $('<div class="modal active"></div>').appendTo('body');
      modal.html(`
        <div class="modal-content">
          <h2>Type DELETE to confirm deletion</h2>
          <input type="text" id="deleteConfirmationInput">
          <div class="modal-buttons">
            <button class="confirm-delete">Confirm</button>
            <button class="cancel-delete">Cancel</button>
          </div>
        </div>
      `);
      modal.data('relatedRow', button.closest('tr'));
    }
  
    function deleteRow(button) {
      const input = $('#deleteConfirmationInput').val();
      if (input === "DELETE") {
        const row = button.closest('.modal').data('relatedRow');
        row.remove();
        hideDeleteModal(button);
      } else {
        alert("Please type 'DELETE' to confirm.");
      }
    }
  
    function hideDeleteModal(button) {
      button.closest('.modal').remove();
    }
  
    function resetForm() {
      $('#stepperForm')[0].reset();
      $('#submitButton').text("Submit");
    }
  
    function getFormData() {
      return [
        $('#name').val(),
        $('#phone').val(),
        $('#email').val(),
        $('#country').val(),
        $('#city').val()
      ];
    }
  
    function getFormFieldNames() {
      return ['name', 'phone', 'email', 'country', 'city'];
    }
  
    $(document).ready(function() {
      initializeTableFromStorage();
      populateCountries();
  
      $('#country').on('change', populateStates);
      $('#state').on('change', populateCities);
      $('#submitButton').on('click', showSubmitModal);
  
      $(document).on('click', '.edit-button', function() {
        editRow($(this));
      });
  
      $(document).on('click', '.delete-button', function() {
        showDeleteModal($(this));
      });
  
      $(document).on('click', '.confirm-delete', function() {
        deleteRow($(this));
      });
  
      $(document).on('click', '.cancel-delete', function() {
        hideDeleteModal($(this));
      });
  
      $(document).on('click', '.modal', function(e) {
        if ($(e.target).hasClass('modal')) {
          hideModal($(this).attr('id'));
        }
      });
    });
  })();
  