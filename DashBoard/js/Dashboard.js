

let Dashboard = {

    display_machines: (machines)=>{
        console.log("machines :" + machines.length);
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