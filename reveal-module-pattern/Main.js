// document.addEventListener('DOMContentLoaded', function() {
//     StepperModule.init();
//     FormDataModule.init();
//     FormModule.init();
// });

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    FormDataModule.init();
    StepperModule.init();
    FormModule.init();

    // Add global error handling
    window.addEventListener('error', function(e) {
        console.error('Global error:', e.error);
        // You could add user-friendly error handling here
    });

    // Add form data persistence handling
    window.addEventListener('beforeunload', function() {
        FormDataModule.saveData();
    });
})