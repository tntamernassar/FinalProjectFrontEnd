let ControlPanel = {

    init: ()=>{
        if (UserManager.logged_in()){
            let username = document.getElementById("username_label");

            let user = UserManager.getuser();
            let name = user["first_name"] + " " + user["last_name"];
            username.innerHTML = name;
        } else {
          Utils.redirect("../Login/Login.html")
        }

    }

}