function footer_event() {
    if (Math.max(document.body.scrollHeight, document.body.offsetHeight) > window.innerHeight) {
        document.getElementById("footer").style.position = "relative";
    } else {
        document.getElementById("footer").style.position = "absolute";
    }
}

window.addEventListener("load",footer_event);
window.onresize = footer_event;

function initializeCountdown(endtime) {
    var clock = document.getElementById('time_to_next_meeting');
    var t = Date.parse(endtime + ':00:00 GMT+0100') - Date.parse(new Date().toString());
    var days = Math.floor(t / (1000 * 60 * 60 * 24));
    var hours = Math.floor((t / (1000 * 60 * 60)) % 24);
    var minutes = Math.floor((t / 1000 / 60) % 60);
    var seconds = Math.floor((t / 1000) % 60);
    if (t <= 0) {
        clock.innerHTML = "Mötet har startat!"
    } else {
        clock.innerHTML = 'Näste tilfälle om ' + days + ' dag(ar), ' +
            hours + ' timmar, ' +
            minutes + ' minuter och ' +
            seconds + " sekunder.";
        var timeinterval = setInterval(function () {
            var t = Date.parse(endtime + ':00:00 GMT+0100') - Date.parse(new Date().toString());
            var days = Math.floor(t / (1000 * 60 * 60 * 24));
            var hours = Math.floor((t / (1000 * 60 * 60)) % 24);
            var minutes = Math.floor((t / 1000 / 60) % 60);
            var seconds = Math.floor((t / 1000) % 60);
            if (t <= 0) {
                clearInterval(timeinterval);
                clock.innerHTML = "Mötet har startat!"
            } else {
                clock.innerHTML = 'Näste tilfälle om ' + days + ' dag(ar), ' +
                    hours + ' timmar, ' +
                    minutes + ' minuter och ' +
                    seconds + " sekunder.";
            }
        }, 1000);
    }
}

function newServerAjaxCall(url, data, onSuccess) {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (this.readyState === 4) {
            if (this.status === 200) {
                onSuccess(this.responseText);
            } else {
                console.log("Error appeared for server ajax call: '" + url + "'");
                console.log(this.responseText);
            }
        }
    };
    request.open("POST", url, true);
    if (data === null) {
        request.send();
    } else {
        request.send(data);
    }
}


function open_user_menu() {
    var offsetWidth = document.getElementById("right_nav").offsetWidth;
    var menu = document.getElementById("user_menu");
    var posX = ((offsetWidth / 2) - (menu.offsetWidth / 2));
    if (posX > 0) {
        menu.style.right = posX.toString() + "px";
    } else {
        menu.style.right = "0px";
    }
    menu.style.visibility = "visible";
}

window.addEventListener("resize", function () {
    var menu = document.getElementById("user_menu");
    if(menu.style.visibility === "visible") {
        var posX = ((document.getElementById("right_nav").offsetWidth / 2) - (menu.offsetWidth / 2));
        if (posX > 0) {
            menu.style.right = posX.toString() + "px";
        } else {
            menu.style.right = "0px";
        }
    }
}, true);
window.addEventListener("click", function (e) {
    var menu = document.getElementById("user_menu");
    if(menu.style.visibility === "visible") {
        var x;
        var y;
        if (e.pageX || e.pageY) {
            x = e.pageX;
            y = e.pageY;
        }
        else {
            x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }

        var minx = menu.offsetLeft;
        var maxx = menu.offsetLeft + menu.offsetWidth;
        var miny = menu.offsetTop + 38;
        var maxy = menu.offsetTop + menu.offsetHeight;

        if(!(x >= minx && x <= maxx && y >= miny && y <= maxy)) {
            menu.style.visibility = "hidden";
        }
    }
}, true);

function open_link(link) {
    var l = window.location.href;

    var pos = l.indexOf(link.substring(0, link.indexOf("=")));
    if(pos > 0) {
        var new_link = "";
        if(l.substr(pos).indexOf("&") > 0) {
            new_link = l.substr(0,pos) + l.substr(l.substr(pos).indexOf("&") + l.substring(0,pos).length + 1);
        } else {
            new_link = l.substring(0, pos - 1);
        }

        if(new_link.split("?").length - 1 >= 1) {
            window.open(new_link + "&" + link,"_self");
        } else {
            window.open(new_link + "?" + link,"_self");
        }
    } else {
        if(l.split("?").length - 1 >= 1) {
            window.open(l + "&" + link,"_self");
        } else {
            window.open(l + "?" + link,"_self");
        }
    }
}

function delete_item(loan_id,item_id, id, table_id) {
    var data = new FormData();
    data.append("loan_id", loan_id);
    data.append("item_id", item_id);
    data.append("quantity", 1);
    data.append("origin", 1);
    newServerAjaxCall("/remove-loan-item", data, function (response) {
        var obj = JSON.parse(response);
        if (obj.status === "true") {
            var row = document.getElementById("table_item_quantity_" + id);
            var antal = parseInt(row.innerText);
            if(antal > 1) {
                antal -= 1;
                row.innerHTML = "<p class=\"table_item\">" + antal + "</p>";
            } else {
                document.getElementById("table_row_" + id).parentNode.removeChild(document.getElementById("table_row_" + id));
                if(document.getElementById("table_id_" + table_id).rows.length <= 0) {
                    document.getElementById("table_id_" + table_id).parentNode.removeChild(document.getElementById("table_id_" + table_id));
                    document.getElementById("date_id_" + table_id).parentNode.removeChild(document.getElementById("date_id_" + table_id));
                }
            }
            footer_event();
        } else {
            console.log("Did not work!");
        }
    });
}

function on_register_submit() {
    document.getElementById("register_form").submit();
}

function on_login_submit() {
    var login_info = new FormData();
    login_info.append("user_email", document.getElementById("login_email").value);
    login_info.append("user_password", document.getElementById("login_password").value);
    newServerAjaxCall("/check-user-information", login_info, function (response) {
        if (response === "true") {
            document.getElementById("login_form").submit();
        } else {
            document.getElementById("error_msg").innerHTML = "Fel lösenord eller användarnamn!";
        }
    });
}

function login_form_keypress(event) {
    if (event.keyCode === 13) {
        if(document.getElementById("login_email").value !== "" && document.getElementById("login_password").value !== "") {
            on_login_submit();
        }
    }
}

function on_change_pass_submit(email) {
    var login_info = new FormData();
    login_info.append("user_email", email);
    login_info.append("user_password", document.getElementById("user_password").value);
    if(document.getElementById("user_password").value === "" || document.getElementById("new_password_1").value === "" || document.getElementById("new_password_2").value === "") {
        document.getElementById("error_msg").innerHTML = "Du har inte fyllt i alla fält än!";
        return;
    }

    if(document.getElementById("new_password_1").value !== document.getElementById("new_password_2").value) {
        document.getElementById("error_msg").innerHTML = "De nya lösenorden matchar inte! Försök igen.";
        return;
    }

    newServerAjaxCall("/check-user-information", login_info, function (response) {
        if (response === "true") {
            document.getElementById("chg_pass_form").submit();
        } else {
            document.getElementById("error_msg").innerHTML = "Fel lösenord! Försök igen.";
        }
    });
}