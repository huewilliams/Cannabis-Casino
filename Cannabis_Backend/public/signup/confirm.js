function check() {
    let password = document.getElementById('password');
    let confirm = document.getElementById('confirm');
    let error = document.getElementById('passError');
    let name = document.getElementById('realName');
    let email = document.getElementById('email');
    let id = document.getElementById('id');
    let nickname = document.getElementById('nickname');

    function f() {
        id.style.borderColor = "rgba(223, 190, 106, 0.3)";
        password.style.borderColor = "rgba(223, 190, 106, 0.3)";
        confirm.style.borderColor = "rgba(223, 190, 106, 0.3)";
        error.style.borderColor = "rgba(223, 190, 106, 0.3)";
        name.style.borderColor = "rgba(223, 190, 106, 0.3)";
        nickname.style.borderColor = "rgba(223, 190, 106, 0.3)";
        email.style.borderColor = "rgba(223, 190, 106, 0.3)";
        document.getElementById('nameError').innerText = "";
        document.getElementById('idError').innerText = "";
        error.innerText="";
        document.getElementById('mailError').innerText = "";
        document.getElementById('nickError').innerText = "";
    }
    f();

    if(!name.value){
        event.preventDefault();
        document.getElementById('nameError').innerText = "Enter a name";
        name.style.border =  "1px solid red";
        return false;
    }

    if(!id.value){
        event.preventDefault();
        document.getElementById('idError').innerText = "Enter a ID";
        id.style.border =  "1px solid red";
        return false;
    }

    if(!(password.value && confirm.value)){
        event.preventDefault();
        error.innerText = "Enter passwords";
        password.style.border = "1px solid red";
        confirm.style.border = "1px solid red";
        return false;
    }

    if(!(password.value === confirm.value)){
        event.preventDefault();
        error.innerText = "passwords didn't match. Try again";
        password.style.border = "1px solid red";
        confirm.style.border = "1px solid red";
        return false;
    }

    if(!nickname.value){
        event.preventDefault();
        document.getElementById('nickError').innerText = "Enter a Nickname";
        email.style.border =  "1px solid red";
        return false;
    }

    if(!email.value){
        event.preventDefault();
        document.getElementById('mailError').innerText = "Enter a email";
        email.style.border =  "1px solid red";
        return false;
    }
    return true;
}