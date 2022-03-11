
let Counters = {

    draw_ceid_counter: (ceid, parent, data)=>{
        let graph_holder = document.createElement("div");
        graph_holder.id = ceid+"_holder";
        parent.appendChild(graph_holder);

        let ceid_data = data.filter((row)=>row["CEID"] === ceid);
        let bar_chart_builder = ChartBuilder.bar_chart_builder();

        let color = (row)=>{
            let diff = Utils.str_date_diff(row["TXN_DATE"], new Date());
            if (diff > 25*24*60){
                return 'red';
            }else if (diff < 25*24*60 && diff > 20*24*60){
                return '#D18C1B';
            }else {
                return '#1BA5D1';
            }
        }

        bar_chart_builder.builder(graph_holder.id,
            ceid,
            "Minutes",
            "UTP Time",
            ceid_data.map((row)=>
                bar_chart_builder.make_bar(row["ENTITY"],
                    Number((Utils.str_date_diff(row["TXN_DATE"], new Date()) / 60).toFixed(2)),
                    color(row))
            )
        );

    },

    draw: (data)=>{
        let container = document.getElementById("container");
        let ceids = Utils.distinct(data.map((row)=>row["CEID"]));
        ceids.forEach((ceid)=>{
            let div = document.createElement("div");
            div.className = "counter_div report_card";
            container.appendChild(div);
            Counters.draw_ceid_counter(ceid, div, data);
        });
    },

    errors: (es)=>{
        es.filter((e)=>e).forEach(console.error);
    },

    request_data: ()=>{
        NetworkAdapter.send({
            "action": "get_report",
            "report": "counters"
        }, (response)=>{
            Counters.draw(response["data"]["Counters"]);
        });
    },

    init: ()=>{
        NetworkAdapter.init(Counters.request_data, (e)=>Counters.errors([e]));
    }

};