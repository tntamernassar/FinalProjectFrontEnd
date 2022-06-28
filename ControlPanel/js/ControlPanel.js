let ControlPanel = {


    PERMISSIONS: [],

    create_checklist: (parent, options, oncheck, onsave)=>{
        options.forEach( (option, index) => {
            let container = Utils.make_check_box_container(option);
            let checkbox = container.getElementsByTagName("input")[0];
            checkbox.onclick = ()=> oncheck(index, checkbox.checked);
            parent.appendChild(container);
        });

        let save = Utils.make_button("Save");
        save.style.float = "right";
        save.onclick = onsave;
        parent.appendChild(save);
    },

    create_checklist2: (parent, options, oncheck, onsave)=>{
        options.forEach( (option, index) => {
            let container = Utils.make_check_box_container(option);
            let checkbox = container.getElementsByTagName("input")[0];
            checkbox.onclick = ()=> oncheck(index, checkbox.checked);
            parent.appendChild(container);
        });

        let save = Utils.make_button("Choose");
        save.style.float = "right";
        save.onclick = onsave;
        parent.appendChild(save);
    },


    resent_inner_container: ()=>{
        let inner_container = document.getElementById("inner_container");
        inner_container.innerHTML = '';
    },



    init: ()=>{
        NetworkAdapter.init(()=>{
            console.log("connected");
            if (UserManager.logged_in()) {
                let username = document.getElementById("username_label");
                NetworkAdapter.send({
                    "action": "get_user_permissions",
                    "department": "BGU"
                }, (response) => {
                    let user = UserManager.getuser();
                    let name = user["first_name"] + " " + user["last_name"];
                    username.innerHTML = name;

                    let user_permissions = response["user_permissions"];
                    user_permissions = user_permissions.filter(u => u["user_name"] === user["username"]).map(x => x["Permissions_id"]);
                    ControlPanel.PERMISSIONS = user_permissions;
                });
            } else {
                Utils.redirect("../Login/Login.html")
            }
        }, (e)=>{
            console.error(e);
        });

    }



}