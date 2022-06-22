let Notifications = {


    network_adapter: NetworkAdapter,

    sleep(seconds)
    {
        let e = new Date().getTime() + (seconds * 1000);
        while (new Date().getTime() <= e) {}
    },


    extracted: (user)=> {
        Notifications.network_adapter.send({
            "action": "get_notification",
            "department": "BGU"
        }, (response1) => {
            let notification = response1["notification"];

            notification = notification.filter(x => x["email"] == user["email"]);
            console.log(notification);

                let checkbox1 = document.getElementById('Add User');
                let checkbox2 = document.getElementById('Remove User');
                let checkbox3 = document.getElementById('Add Machines');
                let checkbox4 = document.getElementById('Remove Machines');

                let old_notification = [];

                for (let i = 0; i < notification.length; i++) {
                    old_notification.push(notification[i]["notification_id"]);
                    if (notification[i]["notification_id"] == 'add_user') {
                        checkbox1.checked = true;
                    }
                    if (notification[i]["notification_id"] == 'remove_user') {
                        checkbox2.checked = true;
                    }
                    if (notification[i]["notification_id"] == 'add_machines') {
                        checkbox3.checked = true;
                    }
                    if (notification[i]["notification_id"] == 'remove_machine') {
                        checkbox4.checked = true;
                    }
                }

                let save = document.getElementById("button_save");
                save.onclick = () => {

                    Notifications.network_adapter.send({
                        "action": "remove_notification",
                        "notification": notification
                    }, (response2) => {

                    });

                    Notifications.sleep(1);

                    let new_notification = [];

                    if (checkbox1.checked == true) {
                        new_notification.push("add_user");
                    }
                    if (checkbox2.checked == true) {
                        new_notification.push("remove_user");
                    }
                    if (checkbox3.checked == true) {
                        new_notification.push("add_machines");
                    }
                    if (checkbox4.checked == true) {
                        new_notification.push("remove_machine");
                    }

                    console.log(new_notification);

                    Notifications.network_adapter.send({
                        "action": "add_new_notification",
                        "notification": new_notification,
                        "user": user,
                    }, (response) => {
                        // TODO: Display success/fail message
                        document.location.reload();
/*
                        Notifications.extracted(user);
*/
                    });
                }
        });



    }, init: () => {

        const onConnection = ()=> {
            if (UserManager.logged_in()){

                let username = document.getElementById("username_label");

                let user = UserManager.getuser();
                let name = user["first_name"] + " " + user["last_name"];
                username.innerHTML = name;
                    Notifications.extracted(user);

            } else {
                Utils.redirect("../Login/Login.html")
            }
        }

        NetworkAdapter.init(onConnection, console.error);

    }


}