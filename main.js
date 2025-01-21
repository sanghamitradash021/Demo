import {notificationModuleModule} from "./components/notification.js"
    import { ValidationModule } from "./components/validation.js";
    import { TableModule } from "./components/table.js";
    import { StepperModule } from "./components/stepper.js";

    const App=(()=>{
        const init=()=>{
            StepperModule.stepper();
        }

        return {init};
    })();


    $(document).ready(()=>{App.init()});