
const Utils = {

    /**
     * build tab view from a given list of tabs, each tab is :
     *
     * tab = {
     *     "name" - name of the tab
     *     "cont()" - cont function after clicking the tab
     *     "content_classname" - classname of the content
     * }
     * **/
    build_tabs: (parent, tabs, parent_of_content)=>{
        let div = document.createElement("div");
        div.className = "tab";
        parent.appendChild(div);

        tabs.forEach((tab)=>{
            let name = tab["name"];
            let cont = tab["cont"];
            let content_classname = tab["content_classname"];

            let content_div = document.createElement("div");
            content_div.className = content_classname;
            content_div.id = name;
            parent_of_content.appendChild(content_div);

            let button = document.createElement("button");
            button.innerHTML = name;
            button.className = "tablinks";
            button.onclick = (event)=>{
                Utils.openTab(event, name, content_classname, cont);
            };
            div.appendChild(button);
        });
    },


    /**
     * pre conditions:
     * DOM must contain div with id of {@param tab_name}
     * **/
    openTab: (evt, tab_name, tab_class_name, cont)=>{
        let i, tab_content, tab_links;
        tab_content = document.getElementsByClassName(tab_class_name);
        for (i = 0; i < tab_content.length; i++) {
            tab_content[i].style.display = "none";
        }
        tab_links = document.getElementsByClassName("tablinks");
        for (i = 0; i < tab_links.length; i++) {
            tab_links[i].className = tab_links[i].className.replace(" active", "");
        }
        document.getElementById(tab_name).style.display = "block";
        evt.currentTarget.className += " active";
        if (cont) {
            cont(document.getElementById(tab_name));
        }
    },


    /**
     * Redirect to the given URL
     * **/
    redirect: (url)=>{
        window.open(url);
    },


    /**
     * pre conditions :
     * DOM must contain a modal div of the following format
     *
       <div id="modal" class="modal">

         <!-- Modal content -->

         <div class="modal-content">

            <span class="close">&times;</span>

         <div id="popup_body"></div>

         </div>

        </div>

     * **/
    display_pop_up:(body)=>{
        let popup_body = document.getElementById("popup_body");
        popup_body.innerHTML = '';
        popup_body.appendChild(body);
        let modal = document.getElementById("modal");
        modal.style.display = "block";
        let span = document.getElementsByClassName("close")[0];
        span.onclick=()=>{
            modal.style.display = "none";
        };
        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }
    },


    /**
     * calculate difference in minutes between two string dates
     * **/
    str_date_diff:(old_date, new_date)=>{
        let _new = new Date(new_date);
        let _old = new Date(old_date);
        let diffMs = (_new - _old);
        let diffDays = Math.floor(diffMs / 86400000); // days
        let diffHrs = Math.floor((diffMs % 86400000) / 3600000); // hours
        let diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes

        return diffMins + 60*diffHrs + 24*60*diffDays
    },


    /**
     * return set of an array
     * **/
    distinct: (elements)=>{
        return elements.filter((e, i)=>elements.indexOf(e) == i);
    },


    make_check_box_container: (value)=>{
        let label = document.createElement("label");
        label.className = "checkbox_container";
        label.innerHTML = value + `
            <input type="checkbox"/>
            <span class="checkmark"></span>
        `;
        return label;
    },


    make_button: (value)=>{
        let button = document.createElement("button");
        button.innerHTML = value;
        button.className = "button";

        return button;
    },

    download_data: (data,title)=>{
        function download(content, fileName, contentType) {
            var a = document.createElement("a");
            var file = new Blob([content], {type: contentType});
            a.href = URL.createObjectURL(file);
            a.download = fileName;
            a.click();
        }
        download(JSON.stringify(data),title+".json","text/plain")

    }
}