
let Dashboard = {

    display_attributes:(machine)=>{
        // alert("I am an alert box!");
        // window.open('https://javascript.info');
        let left = (screen.width - 300) / 2;
        let top = (screen.height - 300) / 4;
        let newWin = window.open("about:blank", "hello", "resizable=yes,width=600,height=600,"+"top="+top+",left="+left);
        newWin.document.writeln("<body bgcolor='#335AFF'>");
        newWin.document.write('<span style="font-size:30px">'+"machine name: "+machine["name"]);
        newWin.document.write("<br><br>");
        newWin.document.write("machine state: "+machine["state"]);
        newWin.document.write("<br><br>");
        newWin.document.write("machine attributes:");
        newWin.document.write("<br><br>");
        for (const [key, value] of Object.entries(machine["attributes"])) {
            newWin.document.write(key,":",value);
            newWin.document.write("<br>");
        }
        newWin.document.write("<span>");
        newWin.document.writeln("<\/body>");
        // machine["attributes"].forEach((att)=>{
        //     newWin.document.write(att);
        // })

    },

    display_pop_up:(body)=>{
        let popup_body = document.getElementById("popup_body");
        popup_body.innerHTML = '';
        popup_body.appendChild(body);
        let modal = document.getElementById("myModal");
        modal.style.display = "block";
        let span = document.getElementsByClassName("close")[0];
        span.onclick=()=>{
            modal.style.display = "none";
        };


    },

    display_att:(machine)=>{
        let body = document.createElement("div");
        let div=document.createElement("div");
        div.innerHTML=" <span class='column_name'> machine name:</span> " +
            "<span class='machine_name_value'>" + machine["name"]+"</span>";
        let div_state=document.createElement("div");
        div_state.innerHTML=" <span class='machine_state'> machine state:</span> " +
            "<span class='machine_state_value'>" + machine["state"]+"</span>";

        body.appendChild(div)
        body.appendChild(div_state)

        for (const [key, value] of Object.entries(machine["attributes"])) {
            let div_att=document.createElement("div");
            div_att.innerHTML=" <span class='att_name'>"+key+": </span> " +
                "<span class='att_value'>" + value+"</span>";
            body.appendChild(div_att)
        }

        Dashboard.display_pop_up(body)

    },

    display_machines: (machines)=>{
        let container = document.getElementById("overview_container");
        let machine_leading = document.getElementById("machine_leading");
        container.removeChild(machine_leading);
        machines.forEach((machine)=>{
            let name = machine["name"];
            let state = machine["state"];

            let machine_container = document.createElement("div");
            machine_container.innerHTML = name;

            machine_container.className = "report_card machine_container state_"+state;
            machine_container.onclick=()=>{
                Dashboard.display_att(machine)
            };
            container.appendChild(machine_container);
            modal = document.getElementById("myModal");
            window.onclick = function(event) {
                if (event.target == modal) {
                    modal.style.display = "none";
                }
            }
        });
    },

    init: ()=>{
        const onConnection = ()=>{
            console.log("connected");
            NetworkAdapter.send({
                "action": "get_machines",
                "department": "TGR"
            }, (response)=>{
                console.log(response);
                Dashboard.display_machines(response["machines"]);
            });
        };

        const onError = (error)=>{
            console.error(error);
        };

        NetworkAdapter.init(onConnection, onError);
    }

}