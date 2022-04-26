

let Chemicals = {

    get_group_availability: (group, data)=> data["availability"].filter(row => group["ceid"].indexOf(row["CEID"]) >= 0),
    get_group_current_shift: (group, data)=> data["cs_out"].filter(row => group["ceid"].indexOf(row["CEID"]) >= 0),
    get_group_previous_shift: (group, data)=> data["ps_out"].filter(row => group["ceid"].indexOf(row["CEID"]) >= 0),
    get_group_comments: (group, data)=>{
        let comments = data["comments"];
        console.log(Chemicals.get_group_availability(group, data))
        let machines = Utils.distinct(Chemicals.get_group_availability(group, data).filter(row => row["AVAILABILITY"] == "Down").map(row => row["ENTITY"]));
        comments = comments.filter(comment => machines.indexOf(comment["ENTITY"]) >= 0 );
        return comments.sort((a, b) => a["ENTITY"].localeCompare(b["ENTITY"]));
    },
    get_group_tracers: (group, data)=>{
        let tracers = data["tracers"];
        let machines = Utils.distinct(Chemicals.get_group_availability(group, data).map(row => row["ENTITY"]));
        // get group tracers
        tracers = tracers.filter(tracer => machines.indexOf(tracer["ENTITY"]) >= 0 );
        // get last 7 days tracers
        tracers = tracers.filter(tracers => Utils.str_date_diff(tracers["CREATED_DATE"], new Date()) <= 7 * 24 * 60);
        return tracers;
    },
    get_group_aborts: (group, data)=>{
        let aborts = data["aborts"];
        let machines = Utils.distinct(Chemicals.get_group_availability(group, data).map(row => row["ENTITY"]));
        // get group aborts
        aborts = aborts.filter(abort => machines.indexOf(abort["SUBENTITY"]) >= 0);
        // get critical last 7 days aborts
        aborts = aborts.filter(abort => abort["STATUS"] == "CRITICAL" && Utils.str_date_diff(abort["RUN_START_TIME"], new Date()) <= 7 * 24 * 60);
        return aborts;
    },

    up_cell: ()=>{
        return "<div class='up_cell'>Up</div>";
    },

    down_cell: (reason)=>{
        return "<div class='down_cell'>" + (reason ? reason : "Down") + "</div>";
    },

    draw_group: (group, data)=>{
        let parent = document.getElementById("second_container");
        let tableBuilder = TableBuilder.simple_table_builder();
        let title = group["title"];

        let group_availability = Chemicals.get_group_availability(group, data);
        let group_current_shift = Chemicals.get_group_current_shift(group, data);
        let group_previous_shift = Chemicals.get_group_previous_shift(group, data);
        let group_tracers = Chemicals.get_group_tracers(group, data);
        let group_aborts = Chemicals.get_group_aborts(group, data);
        let group_comments = Chemicals.get_group_comments(group, data);

        parent.innerHTML = '<H1>$title</H1>'.replace("$title", title);
        let tables_container = document.createElement("div");
        tables_container.className = "tables_container";
        parent.appendChild(tables_container);

        let machines = Utils.distinct(group_availability.map(row => row["ENTITY"].substr(0, row["ENTITY"].indexOf("_"))));
        let lps = Utils.distinct(data["availability"].map(row => row["ENTITY"].split("_")[1]).filter(lp => lp.startsWith("LP")));
        let cabs = Utils.distinct(group_availability.map(row => row["ENTITY"].split("_")[1]).filter(cab => cab.startsWith("CAB")));
        let ipas = Utils.distinct(data["availability"].map(row => row["ENTITY"].split("_")[1]).filter(ipa => ipa.startsWith("IPA")));
        let spins = Utils.distinct(group_availability.map(row => row["ENTITY"].split("_")[1]).filter(sp => sp.startsWith("SP")));

        cabs = cabs.sort((a, b) => Number(a.substr(3)) - Number(b.substr(3)) );
        spins = spins.sort((a, b) => Number(a.substr(2)) - Number(b.substr(2)) );

        let machines_rows = machines.map(machine => { return {"machine": machine} });
        let lp_rows = [], cab_rows = [], ipa_rows = [], spins_rows = [], out_rows = [], tracers_rows = [], aborts_rows = [];
        machines.forEach(machine => {
            let lp_row = {}, cab_row = {}, spin_row = {}, ipa_row = {};

            lps.forEach(lp => {
                let lp_name = machine + "_" + lp;
                let lp_availability = data["availability"].filter(row => row["ENTITY"] === lp_name)[0];
                if (lp_availability){
                    lp_row[lp] = lp_availability["AVAILABILITY"] === 'Up' ? Chemicals.up_cell() : Chemicals.down_cell(lp_availability["STATE"]);
                }else{
                    lp_rows[lp] = "-";
                }
            });

            cabs.forEach(cab => {
                let cab_name = machine + "_" + cab;
                let cab_availability = group_availability.filter(row => row["ENTITY"] === cab_name)[0];
                if (cab_availability) {
                    cab_row[cab] = cab_availability["AVAILABILITY"] === 'Up' ? Chemicals.up_cell() : Chemicals.down_cell(cab_availability["STATE"]);
                }else{
                    cab_row[cab] = "-";
                }
            });

            ipas.forEach(ipa => {
                let ipa_name = machine + "_" + ipa;
                let ipa_availability = data["availability"].filter(row => row["ENTITY"] === ipa_name)[0];
                if (ipa_availability) {
                    ipa_row[ipa] = ipa_availability["AVAILABILITY"] === 'Up' ? Chemicals.up_cell() : Chemicals.down_cell(ipa_availability["STATE"]);
                }else{
                    ipa_row[ipa] = "-";
                }
            });

            spins.forEach(spin => {
                let spin_name = machine + "_" + spin;
                let spin_availability = group_availability.filter(row => row["ENTITY"] === spin_name)[0];
                if (spin_availability) {
                    spin_row[spin] = spin_availability["AVAILABILITY"] === 'Up' ? Chemicals.up_cell() : Chemicals.down_cell(spin_availability["STATE"]);
                }else{
                    spin_row[spin] = "-";
                }
            });


            let machine_current_shift_row = group_current_shift.filter(row => row["SUBENTITY"].startsWith(machine));
            let machine_previous_shift_row = group_previous_shift.filter(row => row["SUBENTITY"].startsWith(machine));
            let cs = machine_current_shift_row.reduce((acc, curr)=> acc + curr["WAFER"], 0);
            let ps = machine_previous_shift_row.reduce((acc, curr)=> acc + curr["WAFER"], 0);
            let machine_tracers = group_tracers.filter(row => row["ENTITY"].startsWith(machine)).map(row => row["ENTITY"].substr(7));
            let machine_aborts = group_aborts.filter(row => row["SUBENTITY"].startsWith(machine)).map(row => row["SUBENTITY"].substr(7));

            lp_rows.push(lp_row);
            cab_rows.push(cab_row);
            ipa_rows.push(ipa_row);
            spins_rows.push(spin_row);
            out_rows.push({ "cs": cs, "ps": ps });
            tracers_rows.push({ "tracers": "<b>" +machine_tracers.length + "</b> " + Utils.distinct(machine_tracers).join(",") });
            aborts_rows.push({  "aborts":  "<b>" +machine_aborts.length +  "</b> " + Utils.distinct(machine_aborts).join(",")  });
        });

        let machines_table = document.createElement("div"),
         lp_table = document.createElement("div"),
         cab_table = document.createElement("div"),
         ipa_table = document.createElement("div"),
         spins_table = document.createElement("div"),
         outs_table = document.createElement("div"),
         tracers_table = document.createElement("div"),
         aborts_table = document.createElement("div"),
         comments_table = document.createElement("div");

        tables_container.append(machines_table, lp_table, cab_table, ipa_table, spins_table, outs_table, tracers_table, aborts_table, comments_table);

        tableBuilder(machines_table, ["Entity"], ["machine"], machines_rows, "sub_table", (row)=>{});
        tableBuilder(lp_table, lps, lps, lp_rows, "sub_table", (row)=>{});
        tableBuilder(cab_table, cabs, cabs, cab_rows, "sub_table", (row)=>{});
        tableBuilder(ipa_table, ipas, ipas, ipa_rows, "sub_table", (row)=>{});
        tableBuilder(spins_table, spins, spins, spins_rows, "sub_table", (row)=>{});
        tableBuilder(outs_table, ["cs", "ps"], ["cs", "ps"], out_rows, "sub_table", (row)=>{});
        tableBuilder(tracers_table, ["Tracers"], ["tracers"], tracers_rows, "sub_table", (row)=>{});
        tableBuilder(aborts_table, ["Aborts"], ["aborts"], aborts_rows, "sub_table", (row)=>{});
        tableBuilder(comments_table, ["Entity", "Date", "Comment"], ["ENTITY", "TXN_DATE", "COMMENTS"], group_comments, "sub_table", (row)=>{});

    },

    draw_groups: (groups, data)=>{
        let parent = document.getElementById("container");
        groups.forEach(group => {
            let group_container = document.createElement("div");
            group_container.className = "group_container report_card";

            let group_availability = Chemicals.get_group_availability(group, data);
            let group_current_shift = Chemicals.get_group_current_shift(group, data);
            let group_previous_shift = Chemicals.get_group_previous_shift(group, data);
            let group_tracers = Chemicals.get_group_tracers(group, data);
            let group_aborts = Chemicals.get_group_aborts(group, data);

            let title = group["title"];
            let IReq = group["IReq"];
            let available = group_availability.filter(row => row["AVAILABILITY"] === "Up" && row["ENTITY"].indexOf("SP") >= 0).length;
            let total = group_availability.filter(row =>  row["STATE"] !== "Bagged" && row["ENTITY"].indexOf("SP") >= 0).length;
            let cs_out = group_current_shift.reduce((acc, curr)=> acc + curr["WAFER"], 0);
            let ps_out = group_previous_shift.reduce((acc, curr)=> acc + curr["WAFER"], 0);
            let tracers_num = group_tracers.length;
            let aborts_num = group_aborts.length;

            let valid_ireq = available >= IReq ? "valid_ireq" : "invalid_ireq";

            group_container.innerHTML = `
            <span><b>$title</b></span>
            <div class="group_info">
                <span class="$valid_ireq"><b>$available / $total</b></span><br/>
                <span><b>AReq : $IReq</b></span><br/>
                <span><b>CS Out : $cs_out</b></span><br/>
                <span><b>PS Out : $ps_out</b></span><br />
                <span><b>Tracers <span style="font-size: 15px;">(7 days)</span> : $tracers_num</b></span>
                <span><b>Aborts <span style="font-size: 15px;">(7 days)</span> : $aborts_num</b></span>
            </div>
            `.replace("$title", title)
                .replace("$available", available.toString())
                .replace("$total", total.toString())
                .replace("$IReq", IReq)
                .replace("$cs_out", cs_out.toString())
                .replace("$ps_out", ps_out.toString())
                .replace("$tracers_num", tracers_num.toString())
                .replace("$aborts_num", aborts_num.toString())
                .replace("$valid_ireq", valid_ireq);

            group_container.onclick = ()=>{ Chemicals.draw_group(group, data) };

            parent.appendChild(group_container);
        });
    },

    error: (e)=>{
        console.log(e);
    },

    init: ()=>{
        ConfigManager.read_json("chemicals", (config)=>{
            NetworkAdapter.init(() => {
                NetworkAdapter.send({
                    "action": "get_report",
                    "report": "chemicals"
                }, (chemicals) => {
                    NetworkAdapter.send({
                        "action": "get_report",
                        "report": "tracers"
                    }, (tracers)=>{
                        NetworkAdapter.send({
                            "action": "get_report",
                            "report": "e3"
                        }, (E3)=>{
                            console.log(chemicals);
                            console.log(tracers);
                            console.log(E3);
                            document.getElementById("loading").style.display = "none";
                            chemicals["data"]["tracers"] = tracers["data"]["tracers"];
                            chemicals["data"]["aborts"] = E3["data"]["e3"];
                            Chemicals.draw_groups(config["groups"], chemicals["data"]);
                        });
                    });
                });
            }, Chemicals.error);
        });
    }

};