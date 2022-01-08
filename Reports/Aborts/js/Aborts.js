
const Aborts = {

    errors: (es)=>{
        es.filter((e)=>e).forEach(console.error);
    },

    onData:(aborts, tracers, alerts)=>{
        console.log(aborts);
        console.log(tracers);
        console.log(alerts);
    },

    request_data: ()=>{
        NetworkAdapter.send({
            "action": "get_report",
            "report": "tracers" //TODO: Replace with "aborts"
        }, (aborts_response)=>{
            let aborts = aborts_response["data"];
            NetworkAdapter.send({
                "action": "get_report",
                "report": "tracers"
            }, (tracers_response)=>{
                let tracers = tracers_response["data"];
                NetworkAdapter.send({
                    "action": "get_report",
                    "report": "tracers" //TODO: Replace with "alerts"
                }, (alerts_response)=>{
                    let alerts = alerts_response["data"];
                    if (aborts_response["success"] && tracers_response["success"] && alerts_response["success"]){
                        Aborts.onData(aborts, tracers, alerts);
                    }else{
                        Aborts.errors([aborts_response["error"], tracers_response["error"], alerts_response["error"]]);
                    }
                });
            });
        });
    },

    init:()=>{
        NetworkAdapter.init(Aborts.request_data, (e)=>Aborts.errors([e]));
    }
};