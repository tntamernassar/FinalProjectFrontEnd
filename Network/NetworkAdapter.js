

let RequestIDAllocator = {
    ID: 0,
    allocate: ()=>{
        let id = RequestIDAllocator.ID;
        RequestIDAllocator.ID += 1;
        return id;
    }
}

let NetworkAdapter = {

    requests: {},

    send: (request, response_cb)=>{
        let id;
        if("id" in request){
            id = request["id"];
        }else {
            id = RequestIDAllocator.allocate();
            request["id"] = id;
        }
        NetworkAdapter.requests[id] = response_cb;
        this.websocket.send("TGR " + JSON.stringify(request));
    },


    on_response: (response)=>{
        let jsonResponse = JSON.parse(response.data);
        let id = jsonResponse["id"];
        if (id in NetworkAdapter.requests){
            NetworkAdapter.requests[id](jsonResponse);
        }else{
            console.error("Unregistered response: " + JSON.stringify(response));
        }
    },

    /**
     * Initialize a connection with the server
     *
     * onConnection - continues function that triggers after a connection have been established
     * onError - continues function that triggers if an error occurred while connecting
     * **/
    init: (onConnection, onError)=>{
        try{
            this.websocket = new WebSocket("ws://localhost:8080/");
            // this.websocket = new WebSocket("ws://10.114.136.8:80/");
            this.websocket.onmessage = NetworkAdapter.on_response;
            this.websocket.onerror = onError;
            this.websocket.onopen = onConnection;
        }catch (e) {
            onError(e);
        }
    }

}