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
