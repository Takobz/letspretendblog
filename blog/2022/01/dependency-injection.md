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

Most of the time when we write code we need some service to help us and typically we would use the `new` keywoard to create an object to help us use that service. This can be helpful in the short term but it has downsides.

### What Is A Dependency?
A dependency is creation of an object in another class, this is typically made using the `new` keyword. Say I have two classes `HomeScreen` and `PictureService` where we want to use the PictureService in the HomeScreen class. I can create a dependency in the HomeScreen class by doing something like:
```js
var pictureService = new PictureService();
```
We then say HomeScreen has a dependency on PictureService, that is HomePage depends on some service(s) PictureService has for it to fulfill it's purpose. This works but there are problems with this approach.

### Wait, What Is Coupling?
I bet you once heard something like "loose coupling, tight cohension" from someone in the software dev community. Well what exactly does this mean?

Suppose you have two classes `ClassA` and `ClassB` such that ClassB has dependency on ClassA (i.e we have a call like ```var classA = new ClassA()``` in ClassB). Coupling would refer to relationship between ClassA and ClassB. If I can change the implementation of ClassA without really affecting the implementation of ClassB, then we have a `loose coupling` relationship. 

The opposite is true, if making changes to ClassA affects the implementation of ClassB then we have tight coupling. This is where the idea of Inversion Of Control [IoC](https://stackoverflow.com/questions/3058/what-is-inversion-of-control#:~:text=The%20Inversion%2Dof,from%20your%20code.) comes from. This means ClassB doesn't really need to know about the implementation of ClassA all it should be concerned about is what ClassA has to return to it. 

I spoke about cohension, this just means that a class has a clear objective. If I have a class called `Person` and it has the following methods:
- getEmail()
- validateEmail()
- validatePersonPassword()

This would be regarded as loose cohension (The class does way more than it's supposed to), meaning a Person is better with methods and properties that relate to a person object like:
- getName()
- setAge()

:::note
If changing one class affects other class' implementation then `tight coupling`
If a class doesn't have a clear objective or task `loose cohension`. We want: loose coupling and tight cohension.
:::


### Now, Dependency Injection
Okay we have rembled on about some big words like `cohesion` and `coupling` now let's look at DI.

###### What is a dependency injection?
DI is when one object/method supplies a dependency to another class. 
Instead of ClassB creating an object of ClassA by the `new` keyword we call method/object to do this.

###### Why is this benefitial?
As we will see DI makes it easy for us to test other classes without worrying about services crippling our tests.
Most of the time when we run unit tests we want to configure our services to give us certain values and it's hard to do that if we defined our service in different places.

DI enforces `single responsibilty` principle as you will see injecting services makes it easy for your class to do what it must do.
Thus it doesn't have to worry about configuring services.

It can be hard make a service give mock data if you can't mock it (or straight up impossible).
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
private List<Pictures> getHomePagePictures()
{
  IFormatter pngFormatter = PngFormatter("good qaulity");
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

If I want to test the `RenderView()` method in the HomePage class I have no way of configuring my IFormatter implementation and my PictureService so they can give me expected output.
Maybe I can try something like this:
``` js
//HomePage
public HomePage()
{
  //constructor
}

//made services globals
IFormatter pngFormatter = new pngFormatter("good qaulity");
var pictureService = new PictureService(pngFormatter);

//called to render views to the screen
public string RenderView()
{
  var pictures = getHomePagePictures();

  if(pictures.quality == "bad quality") return "bad quality";

  return "good quality";
}

//get pictures and sets the appropriately
private List<Pictures> getHomePagePictures()
{
  return pictureService.getPictures();
}
```
Now I have my services global variables instantiated once.
This again poses the same problem, If I were to test this class I wouldn't be able to configure my services (`IFormatter` and `PictureService`).
This makes unit testing the HomePage method a nightmare.

#### Constructor Dependency Injection

This lead us to `constructor dependency injection` which is injecting the dependency via a constructor:
Consider the following example:
``` js
//HomePage
public HomePage(IFormatter formatter, PictureService pictureService)
{
  _pngFormatter = formatter;
  _pictureService = pictureService;
}

//called to render views to the screen
public void RenderView()
{
  getHomePagePictures();
}

//get pictures and sets the appropriately
private List<Pictures> getHomePagePictures()
{
  return pictureService.getPictures();
}
```

Now the class that will use HomePage object has total control of the "type" of services it passes and HomePage doesn't have to worry about configuring services.
This is a small change but it has taken the responsibilty of configuring services from HomePage and it can focus on its responsibilty.

If we have a test class we can now do something like:
``` js
//Test class
public void makeHomePageReturnBadQualityImages()
{
  IFormatter fakeFormatter = Mock<pngFormatter>().make.it.return("bad quality");
  var pictureService = Mock<PictureService>().with.constructor(fakeFormatter);
  var homePage = new HomePage(fakeFormatter, pictureService);

  //action
  Assert.equal(homePage.RenderView(), "bad quality");
}
```

See the test class has total control of the kind of implementation of the services, ideally we would also pass the PictureService as an interface but that's for another day :).


### Conclusion
DI helps us by enforcing the single responsibilty principle thus IoC.
I hope this helps you see the benefit of DI or at least lets you see what it is all about.

Stay tuned for more. Remember keep pretending until you are not, Bye!