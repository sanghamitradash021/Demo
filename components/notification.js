export const notificationModule=(()=>{

    const openToast=((message,character)=>{
        const toast=$('#show-time');

        if(character=="safe"){
            toast.css("background-color","green")
        }else if(character=="danger"){
            toast.css("background-color","red")
        }
        toast.text("");
        toast.removeClass("hide");

        setTimeout(()=>{
            return toast.addClass("hide");
        },3000)

        toast.text(message);

    })

    window.openToast=openToast;

    return {
        openToast
    }
})();