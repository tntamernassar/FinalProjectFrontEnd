
let Dashboard = {

    display_machines: (machines)=>{
        machines.map((machine)=>{
            console.log(machine);
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