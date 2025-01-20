// const StepperModule = (function() {
//     let steps;
//     let pages;
//     let stepConnectorProgress;

//     function init() {
//         steps = document.querySelectorAll(".step");
//         pages = document.querySelectorAll(".form-page");
//         stepConnectorProgress = document.querySelector(".step-connector-progress");
//         initializeStepperEvents();
//     }

//     function initializeStepperEvents() {
//         steps.forEach((step, index) => {
//             step.addEventListener("click", () => handleStepClick(index));
//         });
//     }

//     function handleStepClick(index) {
//         const stepIndex = index + 1;
//         let canNavigate = true;

//         for (let i = 1; i < stepIndex; i++) {
//             if (!FormModule.validatePage(i)) {
//                 alert(`Please complete page ${i} before proceeding.`);
//                 canNavigate = false;
//                 break;
//             }
//         }

//         if (canNavigate) {
//             navigateToStep(stepIndex);
//         }
//     }

//     function navigateToStep(stepIndex) {
//         pages.forEach(page => page.classList.remove("active"));
//         document.getElementById(`page${stepIndex}`).classList.add("active");

//         steps.forEach(s => s.classList.remove("active"));
//         steps[stepIndex - 1].classList.add("active");

//         updateStepperProgress(stepIndex);
//     }

//     function updateStepperProgress(currentStep) {
//         const progress = ((currentStep - 1) / 2) * 100;
//         stepConnectorProgress.style.width = `${progress}%`;
//     }

//     return {
//         init,
//         navigateToStep,
//         updateStepperProgress
//     };
// })();
const StepperModule = (function() {
    let steps;
    let pages;
    let stepConnectorProgress;

    function init() {
        steps = document.querySelectorAll(".step");
        pages = document.querySelectorAll(".form-page");
        stepConnectorProgress = document.querySelector(".step-connector-progress");
        initializeStepperEvents();
    }

    function initializeStepperEvents() {
        steps.forEach((step, index) => {
            step.addEventListener("click", () => handleStepClick(index));
        });
    }

    function handleStepClick(index) {
        const stepIndex = index + 1;
        
        // Validate all previous pages before allowing navigation
        if (validatePreviousPages(stepIndex)) {
            navigateToStep(stepIndex);
        } else {
            navigateToFirstInvalidPage(stepIndex);
        }
    }

    function validatePreviousPages(targetStep) {
        for (let i = 1; i < targetStep; i++) {
            const pageElement = document.getElementById(`page${i}`);
            const validationResult = ValidationModule.validatePageInputs(pageElement);
            
            if (!validationResult.isValid) {
                return false;
            }
        }
        return true;
    }

    function navigateToFirstInvalidPage(targetStep) {
        for (let i = 1; i < targetStep; i++) {
            const pageElement = document.getElementById(`page${i}`);
            const validationResult = ValidationModule.validatePageInputs(pageElement);
            
            if (!validationResult.isValid) {
                // Display errors for the invalid page
                Object.entries(validationResult.errors).forEach(([fieldId, errors]) => {
                    const errorElement = document.getElementById(`${fieldId}Error`);
                    const inputElement = document.getElementById(fieldId);
                    
                    if (errorElement) {
                        errorElement.textContent = errors.join(", ");
                    }
                    if (inputElement) {
                        inputElement.style.borderColor = "red";
                    }
                });

                // Navigate to the first invalid page
                navigateToStep(i);
                return;
            }
        }
    }

    function navigateToStep(stepIndex) {
        // Remove active class from all pages and add to target page
        pages.forEach(page => page.classList.remove("active"));
        const targetPage = document.getElementById(`page${stepIndex}`);
        if (targetPage) {
            targetPage.classList.add("active");
        }

        // Update step indicators
        steps.forEach((step, index) => {
            step.classList.toggle("active", index < stepIndex);
            step.classList.toggle("completed", index < stepIndex - 1);
        });

        // Update progress bar
        updateStepperProgress(stepIndex);

        // Dispatch custom event for step change
        document.dispatchEvent(new CustomEvent('stepChange', { 
            detail: { currentStep: stepIndex }
        }));
    }

    function updateStepperProgress(currentStep) {
        const totalSteps = steps.length;
        const progress = ((currentStep - 1) / (totalSteps - 1)) * 100;
        stepConnectorProgress.style.width = `${progress}%`;
    }

    return {
        init,
        navigateToStep,
        updateStepperProgress,
        validatePreviousPages
    };
})();