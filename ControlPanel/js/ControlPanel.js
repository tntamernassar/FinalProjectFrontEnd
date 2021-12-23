let ControlPanel = {
    init: ()=>{
        let username=document.getElementById("username");

        let user=UserManager.getuser();
        let name = user["first_name"]+" "+user["last_name"];
        username.innerHTML=name;

    }

}