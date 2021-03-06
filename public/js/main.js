var mobile_menu_open = false;

function on_menu_icon_click() {
    var top_bar = document.getElementById("menu_icon_top_bar");
    var middle_bar = document.getElementById("menu_icon_middle_bar");
    var bottom_bar = document.getElementById("menu_icon_bottom_bar");
    var mobile_menu = document.getElementById("mobile_menu");
    if (mobile_menu_open) {
        top_bar.className = "top_bar_animate_out";
        top_bar.style.transform = "rotate(0deg)";
        middle_bar.className = "middle_bar_animate_out";
        middle_bar.style.opacity = "1";
        bottom_bar.className = "bottom_bar_animate_out";
        bottom_bar.style.transform = "rotate(0deg)";
        mobile_menu.className = "mobile_menu_animate_out";
        mobile_menu.style.right = "-120vw";
        document.body.style.overflow = "scroll";
        mobile_menu_open = false;
    } else {
        top_bar.className = "top_bar_animate_in";
        top_bar.style.transform = "rotate(-45deg)";
        middle_bar.className = "middle_bar_animate_in";
        middle_bar.style.opacity = "0";
        bottom_bar.className = "bottom_bar_animate_in";
        bottom_bar.style.transform = "rotate(45deg)";
        mobile_menu.className = "mobile_menu_animate_in";
        mobile_menu.style.right = "0";
        document.body.style.overflow = "hidden";
        mobile_menu_open = true;
    }
}

function close_mobile_menu() {
    if(mobile_menu_open) {
        var top_bar = document.getElementById("menu_icon_top_bar");
        var middle_bar = document.getElementById("menu_icon_middle_bar");
        var bottom_bar = document.getElementById("menu_icon_bottom_bar");
        var mobile_menu = document.getElementById("mobile_menu");
        top_bar.className = "top_bar_animate_out";
        top_bar.style.transform = "rotate(0deg)";
        middle_bar.className = "middle_bar_animate_out";
        middle_bar.style.opacity = "1";
        bottom_bar.className = "bottom_bar_animate_out";
        bottom_bar.style.transform = "rotate(0deg)";
        mobile_menu.className = "mobile_menu_animate_out";
        mobile_menu.style.right = "-120vw";
        document.body.style.overflow = "scroll";
        mobile_menu_open = false;
    }
}

var modal_action = null;

function perform_action() {
    if (modal_action !== null) {
        modal_action();
    }
}

function close_modal_box() {
    document.getElementById("modal_box_dimmer").style.display = "none";
    document.getElementById("modal_box_info").style.display = "none";
    document.getElementById("modal_box_question").style.display = "none";
    document.getElementById("modal_box_info").className = "modal_box";
    document.getElementById("modal_box_question").className = "modal_box";
}

function info(msg) {
    document.getElementById("modal_box_dimmer").style.display = "flex";
    document.getElementById("modal_box_info").style.display = "flex";
    document.getElementById("modal_box_info_text").innerText = msg.toString();
    document.getElementById("modal_box_info").className += " animate_modal_box";
}

function question(msg, action) {
    document.getElementById("modal_box_dimmer").style.display = "flex";
    document.getElementById("modal_box_question").style.display = "flex";
    document.getElementById("modal_box_question_text").innerText = msg.toString();
    document.getElementById("modal_box_question").className += " animate_modal_box";
    modal_action = action;
}

function footer_event() {
    if (Math.max(document.body.scrollHeight, document.body.offsetHeight) > window.innerHeight) {
        document.getElementById("footer_desktop").style.position = "relative";
        document.getElementById("footer_mobile").style.position = "relative";
    } else {
        document.getElementById("footer_desktop").style.position = "absolute";
        document.getElementById("footer_mobile").style.position = "absolute";
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
    clock.innerHTML = days + ' dag(ar), ' +
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
            clock.innerHTML = days + ' dag(ar), ' +
                hours + ' timmar, ' +
                minutes + ' minuter och ' +
                seconds + " sekunder.";
        }
    }, 1000);
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
    menu.style.height = "180px";
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
    if(menu.style.height === "180px") {
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
        var miny = menu.offsetTop;
        var maxy = menu.offsetTop + menu.offsetHeight;

        if(!(x >= minx && x <= maxx && y >= miny && y <= maxy)) {
            menu.style.height = "0";
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

function delete_item(user_id, loan_id,item_id, id, table_id) {
    var data = new FormData();
    data.append("loan_id", loan_id);
    data.append("item_id", item_id);
    data.append("quantity", 1);
    data.append("origin", 1);
    newServerAjaxCall("/users/" + user_id + "/loans/delete", data, function (response) {
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
    newServerAjaxCall("/api/user-authentication", login_info, function (resp) {
        var response = JSON.parse(resp);
        if (response.status === "true") {
            document.getElementById("login_form").submit();
        } else {
            info(response.status_msg);
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

function on_change_pass_submit() {
    var login_info = new FormData();
    login_info.append("user_password", document.getElementById("user_password").value);
    if(document.getElementById("user_password").value === "" || document.getElementById("new_password_1").value === "" || document.getElementById("new_password_2").value === "") {
        document.getElementById("error_msg").innerHTML = "Du har inte fyllt i alla fält än!";
        return;
    }

    if(document.getElementById("new_password_1").value !== document.getElementById("new_password_2").value) {
        document.getElementById("error_msg").innerHTML = "De nya lösenorden matchar inte! Försök igen.";
        return;
    }

    newServerAjaxCall("/api/user-authentication", login_info, function (resp) {
        var response = JSON.parse(resp);
        if (response.status === "true") {
            document.getElementById("chg_pass_form").submit();
        } else {
            info(response.status_msg);
        }
    });
}

function show_preview_image() {
    var input = document.getElementById("product_image_input");
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            document.getElementById("product_image").src = e.target.result;
            document.getElementById("item_spec_image").src = e.target.result;
        };

        reader.readAsDataURL(input.files[0]);
    }
}

function update_item_page_preview() {
    document.getElementById("item-description-preview").innerHTML = document.getElementById("item-description").value;
    document.getElementById("item_specs").innerHTML = "";
    var json_specs = document.getElementById("item-specs").value;
    if (json_specs !== null && json_specs !== "") {
        var specs = JSON.parse(json_specs);
        for(var obj in specs){
            var table = document.createElement("table");
            if(specs.hasOwnProperty(obj)){
                for(var prop in specs[obj]){
                    if(specs[obj].hasOwnProperty(prop)){
                        var key = document.createElement("td");
                        var value = document.createElement("td");
                        key.id = "spec_title";
                        value.id = "spec_value";
                        key.innerText = prop.toString();
                        value.innerText = specs[obj][prop].toString();
                        var row = document.createElement("tr");
                        row.appendChild(key);
                        row.appendChild(value);
                        table.appendChild(row);
                    }
                }
            }
            var title = document.createElement("h4");
            title.innerText = obj.toString();
            document.getElementById("item_specs").appendChild(title);
            document.getElementById("item_specs").appendChild(table);
        }
    }
}