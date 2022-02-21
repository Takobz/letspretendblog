---
slug: CORS with .NET and React
title: CORS with .NET and React
authors: 
    - name: Khutso Kobela
      title: Novice Programmer
      url: https://github.com/Takobz
      image_url: https://github.com/Takobz.png
tags: [React, FrontEnd, CORS, .NET]
---

<!--truncate-->

Hello, Reader! 🙂, See what I did there? So I was trying to get into React and all that nice component driven front-end. Then I saw something like this:
![cors-image](/static/img/blog-images/cors-with-dotnet-api/cors-example.jpg)

I haven't done a lot of FrontEnd work so this was terrifying but then I decide to visit the knowledge man, Google. I found out a lot about CORS and that inspired this blog post.

<!--truncate-->

### Topic:
- What is CORS?
- CORS Policies
- Understanding Http Request
- How To Configure CORS in .NET Web APIs?

### What is CORS?
CORS stands for Cross-Origin Resource Sharing. This refers to when we have one origin (domain) requesting resources (css files, json file, html pages, data, etc.) from another origin (domain). There are some restriction to how different origins share content and this controlled via Http Headers.

So when I read this kind of explanation of CORs I was confused because I had my React app running on my local machine so is my .NET API, so what's up with that?

Well it turns if we have our React code and .NET API running on the same domain (localhost) but having different port numbers, this is seen as two different origins that, here's a summary of origin equivalence:
- http://domain-a:portNumber1 vs http://domain-a:portNumber2 - different origin (port is not the same number)
- http://domain-a:portNumber1 vs http://domain-b:portNumber1 - different origin (not the same machine/server)
- http://domain-a:portNumber1/path/one vs http://domain-a:portNumber/path/two - same origin.

From above we can see for origin to be equal the port number and domain has to be the same. So this is the reason the browser thought my React was doing a Fetch request from a different origin to my API.

Let's look at the CORS policies a little more. 🙂

### CORS Policies