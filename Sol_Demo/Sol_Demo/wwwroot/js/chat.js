"use strict";

// to Make SignalR connection. Step 1

var connection = new signalR
    .HubConnectionBuilder()
    .withUrl("/chathub")
    .withAutomaticReconnect()
    .build();

// Disable Send Button
$("#btnSendMessage").prop("disabled", true);

// start the SingalR Connection Step 2
connection
    .start()
    .then(function () {
        //console.log("Connection Start");
        $("#btnSendMessage").prop("disabled", false);
    })
    .catch(function (err) {
        console.log(err.toString());
        console.log("Error")
    });

// Invoke User Join Session Step 3
$("#btnJoin").click(function (event) {
    var userName = $("#txtUser").val();

    connection
        .invoke("UserConnectedAsync", userName)
        .catch(function (err) {
            console.log(err.toString());
        });
});

function dropDownListTemplate(userName, connectionId) {
    var template = `<option value="${connectionId}">${userName}</option>`;
    return template;
}

// Received User Session Value Step 4
connection.on("UserConnected", function (userName, connectionId) {
    var templateRender = dropDownListTemplate(userName, connectionId);

    $("#ddlUserList").append(templateRender);
});

// Invoke Message Step 5
$("#btnSendMessage").click(function (event) {
    var senderUserName = $("#txtUser").val();
    var message = $("#txtMessage").val();

    // get Selected User Value where we want to send a message.
    var selectedConnectionId = $("#ddlUserList option:selected").val();

    //console.log("Invoke User :", userName);
    //console.log("Invoke Message :", message);

    connection
        .invoke("SendMessage", selectedConnectionId, senderUserName, message)
        .catch(function (err) {
            console.log(err.toString());
        });

    event.preventDefault();
});

// Template for List
function templateList(senderUserName, message) {
    //console.log("Template :", user);
    //console.log("Template :", message);

    var template = `<li>${senderUserName} send message  : ${message}</li>`;

    return template;
}

// SingnalR On connection, received message from Server. Step 6
connection.on("SendMessageToUserJsMethod", function (senderUserName, message) {
    //console.log("On User :", user);
    //console.log("On Message :", message);

    var templateRender = templateList(senderUserName, message);

    $("#messageList").append(templateRender);
});