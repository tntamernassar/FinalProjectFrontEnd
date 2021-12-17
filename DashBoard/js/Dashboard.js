
let Dashboard = {

    display_machines: (machines)=>{
        let container = document.getElementById("overview_container");
        let machine_leading = document.getElementById("machine_leading");
        container.removeChild(machine_leading);

        machines.map((machine)=>{
            let name = machine["name"];
            let state = machine["state"];

            let machine_container = document.createElement("div");
            machine_container.innerHTML = name;
            machine_container.className = "report_card machine_container state_"+state;
            container.appendChild(machine_container);
        });
    },

    init: ()=>{
        const onConnection = ()=>{
            console.log("connected");
            NetworkAdapter.send({
                "action": "get_machines",
                "flat": "TGR"
            }, (response)=>{
                Dashboard.display_machines(response["machines"]);
            });
        };

        const onError = (error)=>{
            console.error(error);
        };

        NetworkAdapter.init(onConnection, onError);
    }

}