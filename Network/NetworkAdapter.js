

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
        this.websocket.send(JSON.stringify(request));
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

    init: (onConnection, onError)=>{
        try{
            this.websocket = new WebSocket("ws://localhost:8080/");
            this.websocket.onmessage = NetworkAdapter.on_response;
            this.websocket.onerror = onError;
            this.websocket.onopen = onConnection;
        }catch (e) {
            onError(e);
        }
    }

}