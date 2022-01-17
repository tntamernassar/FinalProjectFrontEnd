


let UserManager = {

    logged_in: ()=>{
        return localStorage.getItem("UID") != null;
    },

    login: (user)=>{
        let uid = user["uid"];
        localStorage.setItem("UID", uid);
        localStorage.setItem("user", JSON.stringify(user));
    },

    logout: (cont)=>{
        localStorage.removeItem("UID");
        localStorage.removeItem("user");
        cont();
    },
    getuser:()=>{
        return JSON.parse(localStorage.getItem("user"));
    }

}