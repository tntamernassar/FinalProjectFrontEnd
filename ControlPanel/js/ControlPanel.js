let ControlPanel = {

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
        }, (e)=>{
            console.error(e);
        });
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