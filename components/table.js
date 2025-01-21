export const TableModule = (() =>{

    class data {
        constructor(id, name, branch, email, birthday, password) {
             this.id=id;
             this.fullname = fullname;
             this.phone = phone;
             this.email = email;
             this.state = state;
            
            }
    }
    const form = $('.form-container');
    const tablez = $('.data-table');
    const table = table.find('tbody');
    const dataArray = JSON.parse(localStorage.getItem('dataArray')) || [];
    let idno = dataArray.length ? dataArray[dataArray.length - 1].id : -1;
    let toEdit = null;
    const tr = [];
    let submit = true;

    const loadTableData = () => {
        dataArray.forEach(data => {
            const row = createRow(data);
            table.append(row);
        });
    };

    const createRow = (data) => {
        const trElement = $("<tr></tr>");
        const td1 = $("<td></td>").text(data.fullname);
        const td2 = $("<td></td>").text(data.phone);
        const td3 = $("<td></td>").text(data.email);
        const td4 = $("<td></td>").text(data.state);
        const td5 = $("<td></td>");

        const editButton = $('<button></button>').addClass('button').text("Edit").click(() => editRow(trElement[0], data.id));
        const deleteButton = $('<button></button>').addClass('button').addClass('delete').text("Delete").click(() => deleteRow(trElement[0]));

        td5.append(editButton).append(deleteButton);

        trElement.append(td1, td2, td3, td4, td5);

        return trElement;
    };

    const saveToLocalStorage = () => {
        localStorage.setItem('dataArray', JSON.stringify(dataArray));
    };

    form.submit((event) => {
        event.preventDefault();

        const fullname = $("#fullname").val();
        const phone = $("#phone").val();
        const email = $("#email").val();
        const state = $("#state").val();
    

        console.log("fullname ", fullname, " phone ", phone, " email ", email, " state ", state);

        let existingEmail = dataArray.find((data) => {
            return data.email == email;
        });


        if (existingEmail) {
            openToast("Email Already Exist", "danger");
        } else if (fullname && phone && email && state) {
            var message = "Form Created Successfully";
            if (submit) {
                openToast(message, "safe");
                idno += 1;

                const tempObj = new data(idno, fullname, phone, email, state);
                dataArray.push(tempObj);
                saveToLocalStorage();

                const row = createRow(tempObj);
                table.append(row);
            } else {
                let currObj = dataArray[toEdit];

                $(tr[toEdit][0].cells[0]).text(fullname);
                $(tr[toEdit][0].cells[1]).text(phone);
                $(tr[toEdit][0].cells[2]).text(email);
                $(tr[toEdit][0].cells[3]).text(state);

                $('#submitButton').text('Submit');
                submit = true;

                openToast("Form Edited Successfully", "safe");
            }
        } else {
            message = "Add Required Fields before submitting";
            openToast(message, "danger");
        }

        form.trigger("reset");
    });
    const editRow = (row, id) => {
        let toFindEmail = row.cells[1].innerText;

        const findobj = dataArray.find((e) => {
            return e.email == toFindEmail;
        });

        toEdit = findobj.id;
        submit = false;
        $('#submitButton').text('Edit');
        $('#first_name').val($(row.cells[0]).text());
        $('#phone').val($(row.cells[1]).text());
        $('#email').val($(row.cells[2]).text());
        $('#state').val($(row.cells[3]).text());
    };

    const deleteRow = (row) => {
        openModal(row);
    };

    const openModal = (row) => {
        const modal = $(".modal");

        modal.removeClass("hide");

        const yesBtn = $('#yes');
        const noBtn = $('#no');
        $('#modalInput').text(null);

        yesBtn.click(() => {
            const pass = $('#modalInput').val();
            let FindEmail = $(row.cells[1]).text();

            const searchobj = Array.find((e) => {
                return e.email == FindEmail;
            });

            if (pass == searchobj.password) {
                row.remove();
                modal.addClass("hide");

                const toDelIndex = dataArray.findIndex((data) =>data.email == FindEmail);
            
                if (toDelIndex !== -1) {
                    dataArray.splice(toDelIndex, 1);
                }
                
                saveToLocalStorage(); 

                openToast("Record Deleted Successfully", "safe");
            } else {
                openToast("Enter The Password Correctly", "danger");
            }
        });

        noBtn.click(() => {
            modal.addClass("hide");
        });
    };

    

    window.editRow = editRow;
    window.openModal = openModal;
    window.deleteRow = deleteRow;

    $(document).ready(loadTableData);

    return { editRow, openModal, deleteRow };


    })();
