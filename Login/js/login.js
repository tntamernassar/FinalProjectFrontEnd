

let Login = {

    validate_email: (email) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    },

    request_log_in: ()=>{
        let input = document.getElementById("input");
        let next_button = document.getElementById("next");
        let email = input.value;
        if (Login.validate_email(email)){
            NetworkAdapter.send({action: "request_login", email: email}, (response)=>{
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