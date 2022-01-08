
const Utils = {

    /**
     * pre conditions:
     * DOM must contain div with id of {@param tab_name}
     * **/
    openTab: (evt, tab_name)=>{
        let i, tab_content, tab_links;
        tab_content = document.getElementsByClassName("tabcontent");
        for (i = 0; i < tab_content.length; i++) {
            tab_content[i].style.display = "none";
        }
        tab_links = document.getElementsByClassName("tablinks");
        for (i = 0; i < tab_links.length; i++) {
            tab_links[i].className = tab_links[i].className.replace(" active", "");
        }
        document.getElementById(tab_name).style.display = "block";
        evt.currentTarget.className += " active";
    },


    /**
     * pre conditions :
     * DOM must contain a modal div of the following format
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
}