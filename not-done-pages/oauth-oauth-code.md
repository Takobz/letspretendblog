---
slug: oauth-auth-code-flow
title: OAuth With Authorization Code Flow
authors: 
    - name: Khutso Kobela
      title: Novice Programmer
      url: https://github.com/Takobz
      image_url: https://github.com/Takobz.png
tags: [.NET, OAuth, API, Security]
---

<!--truncate-->

Hello there, I recently started reading about OAuth and trying to understand it as framework idenpendent of a coding framework/SDK/Package and/or 3rd party offerings.  
In this post I will be talking about the OAuth Authorization Code Flow and why I think it is just an amazing framework for delegating user data, sit back and relax as we pretend our way through OAuth.  

### Topics
- What is OAuth?
- Why We Use OAuth and How It Benefits us
- OAuth Flow: Authorization Code Flow
- OAuth Server in .NET

### What is OAuth?
Open Authentication commonly referred to as OAuth is a means of authenticating an application to access a resource owner's data from a different application.
It provides a standardized framework that allows this data sharing to be secure, easily adoptable and easily extensible, while providing flows that make sense for different use cases like mobile, native or web applications to name the least.  

To understand what is OAuth we will need to travel a while back in time and see what kind of problem OAuth was trying to solve in the first place, using a use case where we have two application that need to share data on behalf of a user.

#### Simple Use Case: Writing Messages
Let's pretend we have an application that stores contacts on the cloud, let's call it `ContactSaver` and a user wants to write messages for their contacts whenever it's their birthdays but the service that writes these messages is separate from the contacts application, let's call it `MessageWriter`. Looking at this, we may think "oh I have a cloud service: ContactSaver that my MessageWriter application can use to get contacts then write birthday messages for me 🙂", the catch: How do we let MessageWriter get ahold of the contacts in ContactSaver on behalf of the user so it can write it's messages.  

This simple use case gives rise to the need of data sharing across applications on behalf of the user. Before we delve into the meaty gritty parts of this problem let's get some terminology straight to help us speak the same language.

#### Actors In OAuth
In this small section I will just add terms to some actors that are involved in OAuth:
![oauth-actors](../static/img/blog-images/oauth-auth-code/oauth-actors.png)


- `Resource Owner` - This is what we have been refering to as the user so far, this is the person/entity that owns the data we are interested in.
- `Client` - This is the application that wants to access the resource owner's data, in this example this is the MessageWriter service.
- `Authorization Server` - We haven't spoken about this component but it is important to OAuth, this is the component that is responsible for authenticating the resource owner and issuing out tokens to client application.
- `Protected Resource` - This is where the requested data resides, this will be thought to be an REST API in this blog post.



Will come back to these later and explain their role in OAuth in depth for now let's keep the terms in mind. Now let's look at how our data sharing problem would've been solved back in the day.

#### Let Me Sign-In For You (Replaying Password)
