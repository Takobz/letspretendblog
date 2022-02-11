---
slug: HttpClient Message Handler
title: Mocking HttpClient
authors:
    - name: Khutso Kobela
      title: Novice Programmer
      url: https://github.com/Takobz
      image_url: https://github.com/Takobz.png
tags: [HttpClient, .NET, Xunit, FakeItEasy, Mocking]
---

Hello again. I recently had a task to unit test a service I wrote. I was using .NET's HttpClient to do calls to API I was consuming, all was good until I had unit test my work.

<!--truncate-->

In this blog post I am going to explore how to "mock" HttpClient with FakeItEasy. The interesting thing here is that FakeItEasy unit can only mock Interfaced objects but as we know .NET's HttpClient doesn't extend an interface. So how do we start?

<!--truncate-->

## Topics:
- What is Mocking?
- Why FakeItEasy can't mock HttpClient.
- Structure of HttpClient.
- Mocking HttpClient.

### What is Mocking?
The term mock is used in software development to say "I am creating a fake object". This is important when doing tests because this means we can configure our object to act the way we want thus making it possible to make our test cases give expected output. 

Here is an example:
``` js
//Test Case
[Fact]
public void Calling_Service_With_Valid_Input()
{
    //IDataService is an interface that DataService implements. 
    DataService dataService = A.Fake<IDataService>()
    //tells FakeItEasy to return an object specified in Returns() despite any string passed.
    A.CallTo(() => dataService.GetData(A<string>.Ignored)).Returns(new Data { dataValue: "value"});

    //using fake service which won't make a real call
    var homeController = new HomeController(dataService);

    //calling the method we are testing.
    var result = homeController.GetAllData("Test string");

    //expect that the returned data value returns the Data object we created
    Assert.Equals("value", result.dataValue)
}
```

In The above example we the `HomeController` class that uses the IDataService to get some data via the GetAllData() method. 

The test case above just wants to check if I put a valid string input I get back data. I don't really want to do a call to dataService API that is called by GetData.

So What I do is to "mock" the behavior I want, that is mock the service going to query data for my valid string. In our service we have a check that says: `if input is null or empty throw an exception`.

In the above we wanted to see if we didn't a null or empty string will we get the expected output without worrying about actually calling the service with real data.


### Why FakeItEasy can't mock HttpClient.
FakeItEasy can only fake anything that can be overridden, extended or implemented. Mostly you will find yourself mock interfaces and bending the behavior of an interface's implementation to suit your test cases.

Check out this [link](https://fakeiteasy.readthedocs.io/en/stable/what-can-be-faked/) for more info.

HttpClient doesn't implement an interface this causes issues when trying to use FakeItEasy. In the next section we will learn a quick overview of the HttpClient class that will enable us to "mock" this object.

### Structure of HttpClient
From the above section we have learned that HttpClient doesn't implement as interface thus FakeItEasy can't mock it. 

But if we look into the HttpClient.cs class we will see a constructor like this: `public HttpClient(HttpMessageHandler handler);` and digging deeper you will see that [HttpMessageHandler](https://docs.microsoft.com/en-us/dotnet/api/system.net.http.httpmessagehandler) is an abstract class. 

But what is this handler and what does it do, why is it important to us?

##### A word on HttpMessageHandler
The short explanation would be, the handler receives requests and create http response via `HttpMessageResponse`. It brings back the response via the abstract method called [SendAsync](https://docs.microsoft.com/en-us/dotnet/api/system.net.http.httpmessagehandler.sendasync) that we can override.

This essentially means we can create our own handler that implements HttpMessageHandler thus override `SendAsync` with our implementation and since it is the one doing all the request processing and give response then we can just configure it to give us a desired result. 🙂

I have left a lot of detail in this breakdown but this will be enough to help us mock HttpClient.


### Mocking HttpClient.
Suppose we have a classes `DataService` that implements an interface called `IDataService`:

```js
//*******IDataService interface
public interface IDataService
{
    Data GetDataFromAPI(string query);
}

//******DataService class
public class DataService : IDataService 
{
    //injected via DI
    private readonly HttpClient _httpClient;

    public DataService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public Data GetDataFromAPI(string query)
    {
        httpClient.BaseAddress = $"http://random.api.data/"
    }

}
```

