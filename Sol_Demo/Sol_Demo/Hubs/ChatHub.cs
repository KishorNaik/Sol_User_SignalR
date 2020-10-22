using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Sol_Demo.Hubs
{
    public interface IChatClient
    {
        Task UserConnected(string userName, string connectionId);

        Task SendMessageToUserJsMethod(string senderUserName, string message);
    }

    public class ChatHub : Hub<IChatClient>
    {
        public async Task UserConnectedAsync(string userName)
        {
            await base.Clients.All.UserConnected(userName, Context.ConnectionId);
        }

        public async Task SendMessage(string connectionId, string senderUserName, string message)
        {
            await base.Clients.Client(connectionId).SendMessageToUserJsMethod(senderUserName, message);
        }
    }
}