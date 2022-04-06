const E3 = {

    draw_ceid_summary_div: (ceid, ceid_parent, e3_data, summary_status, days_back)=>{
        let summary_div = document.createElement("div");
        summary_div.className = "report_card e3_summary_div";
        summary_div.id = ceid+"_e3_summary_div_"+days_back+"_days_"+summary_status;
        ceid_parent.appendChild(summary_div);

        let relevant_data = e3_data.filter((row)=>
            row["CEID"] === ceid && row["STATUS"] === summary_status && Utils.str_date_diff(row["RUN_START_TIME"], new Date()) <= days_back * 24 * 60
        );
        if (relevant_data.length == 0){
            return;
        }
        let entities = Utils.distinct(relevant_data.map((row)=>row["SUBENTITY"]));
        let variables = Utils.distinct(relevant_data.map((row)=>row["VARIABLE"]));

        let stacked_bar_chart_builder = ChartBuilder.stacked_bar_chart_builder();
        stacked_bar_chart_builder.builder(summary_div.id,
            ceid + " Summary for the last " + days_back + " days (" + summary_status + ")",
            "Aborts",
            entities,
            variables.map((variable)=>
                stacked_bar_chart_builder.make_bar(variable,
                    entities.map((entity)=>relevant_data.filter((row)=>row["SUBENTITY"] == entity && row["VARIABLE"] == variable).length),
                    "Variable"
                )
            )
        );
    },

    draw: ()=>{
        console.log("Drawing E3");
        let e3_data = Aborts.data.e3["e3"];
        let e3_parent = document.getElementById("E3");
        e3_parent.innerHTML = '';
        let ceid_tabs = document.createElement("div");
        e3_parent.appendChild(ceid_tabs);
        let e3_content = document.createElement("div");
        e3_parent.appendChild(e3_content);

        let ceids = Utils.distinct(e3_data.map((row)=>row["CEID"]));
        Utils.build_tabs(ceid_tabs, ceids.map((ceid)=>{
            return {
                name: ceid,
                content_classname: "e3_tab_content",
                cont: ()=>{
                    let ceid_div = document.getElementById(ceid);
                    ceid_div.innerHTML = '';
                    E3.draw_ceid_summary_div(ceid, ceid_div, e3_data, "WARNING", 1);
                    E3.draw_ceid_summary_div(ceid, ceid_div, e3_data, "WARNING", 7);
                    E3.draw_ceid_summary_div(ceid, ceid_div, e3_data, "WARNING", 30);
                    E3.draw_ceid_summary_div(ceid, ceid_div, e3_data, "CRITICAL", 1);
                    E3.draw_ceid_summary_div(ceid, ceid_div, e3_data, "CRITICAL", 7);
                    E3.draw_ceid_summary_div(ceid, ceid_div, e3_data, "CRITICAL", 30);
                }
            }
        }), e3_content);

    }

};


const Tracers = {

    draw_table: (tracers_parent, tracers_data)=> {

        let table_div = document.createElement("div");
        table_div.innerHTML = "<H1><U>Active Tracers</U></H1>";
        tracers_parent.appendChild(table_div);

        let unclosed_tracers = tracers_data.filter((row) => row["STATUS"] !== 'Closed')
        let tableBuilder = TableBuilder.simple_table_builder();
        tableBuilder(table_div,
            Object.keys(tracers_data[0]),
            Object.keys(tracers_data[0]),
            unclosed_tracers,
            "aborts_table",
            (r) => {
                console.log(r);
            });
    },

    draw_summary_bar_chart: (summary_div, relevant_data, days_back)=>{
        let bar_chart_div = document.createElement("div");
        bar_chart_div.id = "bar_chart_div_"+days_back+"_days";
        bar_chart_div.className = "tracers_bar_chart_div";
        summary_div.appendChild(bar_chart_div);

        let bar_chart = ChartBuilder.bar_chart_builder();
        bar_chart.builder(bar_chart_div.id,
            "Entity VS Tracers #",
            "Tracers #",
            [],
            "Tracers",
            Utils.distinct(relevant_data.map((r)=>r["ENTITY"])).map((e)=>bar_chart.make_bar(
                e,
                relevant_data.filter((row)=>row["ENTITY"] === e).length
            ))
        );
    },

    draw_summary_pie_chart: (summary_div, relevant_data, days_back)=>{
        let pie_chart_div = document.createElement("div");
        pie_chart_div.id = "pie_chart_div_"+days_back+"_days";
        pie_chart_div.className = "tracers_pie_chart_div";
        summary_div.appendChild(pie_chart_div);

        let pie_chart = ChartBuilder.pie_chart_builder();
        pie_chart.builder(pie_chart_div.id,
            "Tracers % per entity",
            Utils.distinct(relevant_data.map((r)=>r["ENTITY"])).map((e)=>pie_chart.make_pie(
                e,
                relevant_data.filter((row)=>row["ENTITY"] === e).length / relevant_data.length
            ))
        );
    },

    draw_tracer_summary_div: (tracers_parent, tracers_data, days_back)=>{
        let summary_div = document.createElement("div");
        summary_div.className = "report_card tracers_summary_div";
        summary_div.innerHTML = "<H1><center>Tracers Summary for the last " + days_back + " days</center></H1>";
        tracers_parent.appendChild(summary_div);

        let relevant_data = tracers_data.filter((row)=>{
            return Utils.str_date_diff(row["CREATED_DATE"], new Date()) <= days_back * 24 * 60
        });

        Tracers.draw_summary_bar_chart(summary_div, relevant_data, days_back);
        Tracers.draw_summary_pie_chart(summary_div, relevant_data, days_back);
    },

    draw: ()=>{
        console.log("Drawing Tracers");
        let tracers_data = Aborts.data.tracers["tracers"];
        let tracers_parent = document.getElementById("Tracers");

        tracers_parent.innerHTML = '';
        // draw tracers table
        Tracers.draw_table(tracers_parent, tracers_data);
        // draw 7 days back summary div
        Tracers.draw_tracer_summary_div(tracers_parent, tracers_data,7);
        Tracers.draw_tracer_summary_div(tracers_parent, tracers_data,30);
    }

};


const Aborts = {

    data: {
        e3: undefined,
        tracers: undefined,
    },

    errors: (es)=>{
        es.filter((e)=>e).forEach(console.error);
    },

    onData:(e3, tracers)=>{
        Aborts.data.e3 = e3;
        Aborts.data.tracers = tracers;
        console.log(Aborts.data);
    },

    build_tabs: ()=>{
        let tabs_content = document.getElementById("tabs_content");
        let tabs = document.getElementById("tabs");

        Utils.build_tabs(tabs, [
            {
                "name": "E3",
                "content_classname": "tabcontent",
                "cont": ()=>{
                    E3.draw();
                }
            },
            {
                "name": "Tracers",
                "content_classname": "tabcontent",
                "cont": ()=>{
                    Tracers.draw();
                }
            }
        ], tabs_content);
    },

    request_data: ()=>{
        NetworkAdapter.send({
            "action": "get_report",
            "report": "e3"
        }, (e3_response)=>{
            let e3 = e3_response["data"];
            NetworkAdapter.send({
                "action": "get_report",
                "report": "tracers"
            }, (tracers_response)=>{
                document.getElementById("loading").style.display = "none";
                Aborts.build_tabs();
                let tracers = tracers_response["data"];
                if (e3_response["success"] && tracers_response["success"]){
                    Aborts.onData(e3, tracers);
                }else{
                    Aborts.errors([e3_response["error"], tracers_response["error"]]);
                }
            });
        });
    },

    init:()=>{
        NetworkAdapter.init(Aborts.request_data, (e)=>Aborts.errors([e]));
    }
};