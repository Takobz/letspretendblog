---
slug: dependency-injection
title: Dependency Injection
authors: 
    - name: Khutso Kobela
      title: Novice Programmer
      url: https://github.com/Takobz
      image_url: https://github.com/Takobz.png
tags: [IoC, loose-coupling, DI, OOP]
---

In this blog post we will pretend we know what Dependency Injection is, hang tight but not too tight, remember loose coupling!

<!--truncate-->

Most of the time when we write code we need some service to help us and typical we would use the `new` keywoard to create an object to help us use a service. This can be helpful in the short term but it has downsides

### What Is A Dependency?
A dependency is creation of an object in another class, this is typical made using the `new` keyword. Say I have two classes `HomeScreen` and `PictureService` where we want to use the PictureService in HomeScreen class. I can create a dependency in the HomeScreen class by doing something like:
```js
var pictureService = new PictureService();
```
We then say HomeScreen has a dependency on PictureService, it depends on some service PictureService has to give for it to fulfill it's purpose. This works but there are problems with this approach. Here

### Wait, What Is Coupling?
I bet you once heard something like "loose coupling, tight cohension" from someone in software dev community. Well what exactly does this mean?

Suppose you have two classes `ClassA` and `ClassB` such that ClassB has dependency on ClassA (i.e we have a call like ```var classA = new ClassA()``` in ClassB). Coupling would refer to relationship between ClassA and ClassB. If I can change the implementation of ClassA without really affecting the implementation of ClassB, then we have loose coupling. The opposite is true if making changes to ClassA affects the implementation of ClassA then we have tight coupling. This is where the idea of Inversion Of Control (IoC) comes from. This means ClassB doesn't really need to know about the implementation of ClassA all it should be concerned about is what ClassA has to return to it. 

I spoke about cohension, this just means that a class has a clear objective. If I have a class called Person and it has the following methods:
- getEmail()
- validateEmail()
- validatePersonPassword()

This would be regarded as loose cohension (The class does way more than it's supposed to), meaning a Person is better with methods and properties that relate to a person object like:
- getName()
- setAge()

:::note
If changing one class affects other classes implementation then `tight coupling`
If class doesn't have a clear objective or task `loose cohension`. We want: loose coupling and tight cohension.
:::


### Now, Dependency Injection
Okay we have rembled on about some big words like `cohesion` and `coupling` now let's look at DI.

###### What is a dependency injection?
DI is when one object/method supplies a dependency to another class. As we seen this dependency can then be used as a service.

###### Why is this benefitial?
As we will see DI makes it easy for us to test other classes without worrying about services.
Most of the time when we run unit tests we want to configure our services to give certain values.

It can be hard to make/impossible to make a service give mock data if you can't mock it.
This typically happens when we have our service instantiated in a method we are testing.

DI allows us to configure our service in one place and reuse the same object all over our class.


Suppose we have two classes `HomeScreen` and `PictureService`:
``` js
//HomePage
public HomePage()
{
  //constructor
}

//called to render views to the screen
public void RenderView()
{
  getHomePagePictures();
}

//get pictures and sets the appropriately
private List<Pictures> getHomePageFrom()
{
  var IFormatter pngFormatter = PngFormatter("good qaulity");
  var pictureService = new PictureService(pngFormatter);
  return pictureService.getPictures();
}
```

``` js
//PictureService
public PictureService(IPictureFormmater formatter)
{
  //do some formatting
}

//some code here

//returns pictures from database
public List<Pictures> getPictures()
{
  var database = new DatabaseService("select * from Images");
  return database.ToList();
}
```