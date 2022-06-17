

let Login = {

    validate_email: (email) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            ) && email.endsWith("@intel.com");
    },

    request_log_in: ()=>{
        let input = document.getElementById("input");
        let firstname=document.getElementById("fname");
        let lastname=document.getElementById("lname");
        let next_button = document.getElementById("next");
        let email = input.value;
        let fname=firstname.value;
        let lname=lastname.value;
        if (Login.validate_email(email)){
            firstname.remove();
            lastname.remove();
            NetworkAdapter.send({action: "request_login", email: email,firstname:fname,lastname:lname}, (response)=>{
                if (response["success"]){
                    input.value = "";
                    input.placeholder = "Confirmation";
                    input.style.width = "200px";
                    next_button.onclick = ()=>{
                        let confirmation = input.value;
                        NetworkAdapter.send({action: "confirmation", confirmation:confirmation, email: email}, (response)=>{
                            if (response["success"]){
                                let user = response["user"];
                                UserManager.login(user);
                                window.location = "../DashBoard/Dashboard.html"
                            }else{
                                alert("Wrong confirmation");
                                input.value = "";
                            }
                        });
                    };
                }else{
                    alert("Please try again");
                }
            });
        }else{
            alert("Please enter valid email address");
        }
    },

    init: ()=>{
        NetworkAdapter.init(null, null);
    }
}