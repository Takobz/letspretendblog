---
slug: real-time-updates-with-dotnet-signalr
title: Real Time Updates With SignalR
authors: 
    - name: Khutso Kobela
      title: Novice Programmer
      url: https://github.com/Takobz
      image_url: https://github.com/Takobz.png
tags: [SignalR, Hubs, RealTime, CSharp, .NET]
---

<!--truncate-->

Hey there it's been a while since I did a blog post. In this post I will be looking into SignalR and it helping us do real time updates!
The code referenced here will be from this [repo](https://github.com/Takobz/signalr-example)

<!--truncate-->

### Topics
- What is SignalR ?
- Why Should I use it ?
- Set up to use SignalR
- Concepts: What are Hubs, Events and Methods in SignalR
- Doing updates from services with IHubContext.
- Conclusion

### What is SignalR ?
Before we even start looking at SignalR I think it would cool to understand what it is and what does it do.  

SignalR is .NET's solution to allow servers to send information to clients as the change happens. Both the client and the server can invoke methods on each other. This allows the server to call the client thus tell the client about the changes it is interested in. A client can subscribe to changes, called events.

A client can also call methods on the server which can indirectly cause an event to fire. This ability to be able to have either parties to call one another is known as a duplex communication. The communication is both ways, unlike the traditional client-server relationship were the client is the only one calling the server.

SignalR uses RPC (Remote Procedure Call) to achieve this duplex communication. You can think of this as a way to call a function on the client from the server and vice-versa. The client would give the server parameters and a function name that the client wishes to call on the server this is done via connection that can be: websockets, long polling or server-client event.  

SignalR will choose what kind of connection it will use. 

### Why Should I use it ?
There are number of reasons to use SignalR but my number one take is live updates. If you have an app that needs to know of changes as soon as they happen (chat notification or live updates like order tracking) then you might need to consider SignalR.  

Why? Well imagine you have an app that needs live data from your database as soon as the state of the database changes. One way to do this is polling, where your app will call the server every, say 60 seconds. This will definitely work until we have a lot requests to the server and potentially causing many request errors and slowing down our server.  

Another big win is that clients can choose what is important to them and listen to those events and then inform other clients of their changes.  


### Set up to use SignalR

### Concepts: What are Hubs, Events and Methods in SignalR
Now, the action! In this section we are going to explore some key conecpts with code snippets! 🐱‍🏍

A Hub is a server concept in SignalR terms. It simply just represents a signalr server. This will be a normal c# class that extends the `Microsoft.AspNetCore.SignalR.Hub<T>` class where T is an interface that describes events. This is the class the clients will communicate with and it can have methods that the clients can call.  

Hub Example:  
```js
using Microsoft.AspNetCore.SignalR;

namespace SignalRExample.Hubs;

public class DatabaseHub : Hub<DatabaseHubMethods>
{
    public async Task DatabaseChange(string clientName)
    {
        await Clients.All.DatabaseChanged(clientName);
    }
}

public interface DatabaseHubMethods
{
    Task DatabaseChanged(string clientName);
}
```

This Hub has a **method** called `DatabaseChange()` which can be called by clients and they can pass a client string. In the method we have an **event** `DatabaseChanged` which takes the `clientName`.

#### DatabaseHub Explained.