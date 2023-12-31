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

Hello again. I recently had a task to unit test a service I wrote. I was using .NET's HttpClient to do calls to an API I was consuming, all was good until I had unit test my work.

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

In The above example we use the `HomeController` class that uses the IDataService to get some data via the GetAllData() method. 

The test case above just wants to check if I put a valid string input I get back data. I don't really want make a real call to the API that is called by GetData.

So What I do is to "mock" the behavior I want, that is mock the service going to query data for my valid string. Suppose in our service we have a check that says: `if input is null or empty throw an exception`.

In the above we wanted to see if we didn't put a null or empty string will we get the expected output without worrying about actually calling the service for real data.


### Why FakeItEasy can't mock HttpClient.
FakeItEasy can only fake anything that can be overridden, extended or implemented. Mostly you will find yourself mock interfaces and bending the behavior of an interface's implementation to suit your test cases.

Check out this [link](https://fakeiteasy.readthedocs.io/en/stable/what-can-be-faked/) for more info.

HttpClient doesn't implement an interface this causes issues when trying to use FakeItEasy. In the next section we will learn a quick overview of the HttpClient class that will enable us to "mock" this object.

### Structure of HttpClient
From the above section we have learned that HttpClient doesn't implement as interface thus FakeItEasy can't mock it. 

But if we look into the `HttpClient.cs` class we will see a constructor like this: `public HttpClient(HttpMessageHandler handler);` and digging deeper you will see that [HttpMessageHandler](https://docs.microsoft.com/en-us/dotnet/api/system.net.http.httpmessagehandler) is an abstract class. 

But what is this handler and what does it do, why is it important to us?

##### A word on HttpMessageHandler
The short explanation would be, the handler receives requests and create http response via as the `HttpMessageResponse` object. It brings back the response via an abstract method called [SendAsync](https://docs.microsoft.com/en-us/dotnet/api/system.net.http.httpmessagehandler.sendasync) that we can override.

This essentially means we can create our own handler that implements HttpMessageHandler thus override `SendAsync` with our implementation and since it is the one doing all the request processing and gives back a response this means we can just configure it to give us a desired result. 🙂

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

    //Assuming Data is a model created in our project.
    public async Data GetDataFromAPI(string query)
    {
        httpClient.BaseAddress = new Uri($"http://random.api.data/");

        var response = await httpClient.GetAsync("data/getAll");
        if(response.IsSuccessStatusCode)
        {
            var contentStream = await response.Content.ReadAsStreamAsync();
            return await JsonSerializer.Deserializer<Data>(contentStream);
        }

        return null;
    }
}
```

**Note:** Methods like `GetAsync` and `PostAsync` use SendAsync underneath. So if we configure SendAsync we can still get desired results.

Let's say we have a unit test for when we get back data . For simplicity's sake we won't do a detailed test, we just want to see how to "mock" HttpClient.

As discussed we will need to mock the HttpMessageHandler. Let's see how.

##### Creating fake HttpMessageHandler.
Remember `HttpMessageHandler` is an abstract class so we can implement our handler and make it behave how we want.

Consider the following class:
```js
public class FakeHttpMessageHandler : HttpMessageHandler 
{
    internal Func<HttpResponseMessage> _sendAsync = null;

    protected override Task<HttpResponseMessage> SendAsync()
    {
        if(_sendAsync == null)
        {
            throw new NotImplementedException("sendAsync not implemented");
        }
        return Task.FromResult(_sendAsync());
    }
}
```

Here we have overridden SendAsync and made our implementation. In this fake handler we have a _sendAsync property which is a delegate function. This just means we can create a method that returns HttpResponseMessage from wherever we are using `HttpResponseMessage` and then assign it to _sendAsync.

This means we can then have any kind of implementation of _sendAsync we want then return it inside of `SendAsync()` (The Handler's method responsible for sending and receiving responses).

The other way would be to create a constructor for the `FakeHttpMessageHandler` class then pass the HttpResponseMessage that you would like `SendAsync()` to return, like this:

```js
public class FakeHttpMessageHandler : HttpMessageHandler 
{
    private HttpResponseMessage _httpResponseMessage;

    public FakeHttpMessageHandler(HttpResponseMessage response)
    {
        _httpResponseMessage = response;
    }

    protected override Task<HttpResponseMessage> SendAsync()
    {
        if(_httpResponseMessage == null)
        {
            throw new ArgumentException("Please provide valid HttpResponseMessage");
        }
        return Task.FromResult(_httpResponseMessage);
    }
}
```

Both approaches achieve the same end goal: fake a handler so that httpClient can use it to mimic an Http request call.


#### Using The FakeHttpMessageHandler.
Let's see how we can use the FakeHttpMessageHandler. First with the Func approach:

```js
[Fact]
public async void Calling_Services_Returns_Data()
{
    Data fakeData = new Data 
    {
        dataValue : "fakeValue",
    };

    var fakeHandler = new FakeHttpMessageHandler
    {
        _sendAsync = () => {
            return new HttpResponseMessage
            {
                //using Newtonsoft.Json to serialize object
                StatusCode = System.Net.Http.StatusCode.OK,
                Content = new StringContent(JsonConvert.SerializeObject(fakeData)),
            }
        }
    };

    //This won't make real calls.
    //The response will always be what we configured above.
    var httpClient = new HttpClient(fakeHandler)
    var service = new DataService(httpClient);

    //This should pass.
    var result = await service.GetDataFromAPI("some-query");
    Assert.Equal("fakeValue", result.dataValue);
}
```

If you chose the second implementation of the fake handler, this is how you would go about faking the call.

```js
[Fact]
public async void Calling_Services_Returns_Data()
{
    Data fakeData = new 
    {
        dataValue : "fakeValue",
    };

    var responseMessage = new HttpResponseMessage
    {
        //using Newtonsoft.Json to serialize object
        StatusCode = System.Net.Http.StatusCode.OK,
        Content = new StringContent(JsonConvert.SerializeObject(fakeData)),
    };

    var fakeHandler = new FakeHttpMessageHandler(responseMessage);

    //This won't make real calls.
    //The response will always be what we configured above.
    var httpClient = new HttpClient(fakeHandler)
    var service = new DataService(httpClient);

    //This should pass.
    var result = await service.GetDataFromAPI("some-query");
    Assert.Equal("fakeValue", result.dataValue);
```

This should be enough to mock an HttpClient request for your unit test.

## Conclusion
- FakeItEasy can't fake HttpClient because it doesn't extend an interface
- HttpClient has a constructor that takes in HttpMessageHandler which is an abstract class.
- The HttpMessageHandler handlers requests and responses done via HttpClient.
- It has an abstract method call SendAsync which returns an http response object, HttpResponseMessage.
- We can implement the handler and make SendAsync return any type of HttpResponseMessage we want.
- This allows us to make fake http requests thus ease unit testing.

This has been one long blog 😁, hopefully it wasn't boring. Thank you for reading and until next time. Bye! and Remember, pretend until you are not.


