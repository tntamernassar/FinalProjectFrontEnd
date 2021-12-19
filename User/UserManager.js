


let UserManager = {

    logged_in: ()=>{
        return localStorage.getItem("UID") != null;
    },

    login: (user)=>{
        let uid = user["uid"];
        localStorage.setItem("UID", uid);
        localStorage.setItem("user", user);
    },

    logout: ()=>{
        localStorage.removeItem("UID");
        localStorage.removeItem("user");
    }

}