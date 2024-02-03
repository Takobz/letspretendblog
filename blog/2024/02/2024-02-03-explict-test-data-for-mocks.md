---
slug: explict-data-for-mocks
title: Using Explict Data For Mocks.
authors: 
    - name: Khutso Kobela
      title: Novice Programmer
      url: https://github.com/Takobz
      image_url: https://github.com/Takobz.png
tags: [Testing, Moq, Unit Tests, .NET, Xunit]
date: 2024-02-03
---

Hello there! On this blog post we are going to talk the dangers of using meaningless data inputs when setting mocks and the possible danger this might cause, hang tight and enjoy! 

<!--truncate-->

## Topics
- What are Mocks?
- Setting up a mock in your unit test using Moq.
- The Good and the Bad of Moq It.IsAny&lt;T&gt;
- How To Correctly verify inputs on set.
- Conclusion

:::note
Just a quick a note on terminology used, considering that I have worked most with OPP paradigm, most of the terms I will use will be rooted in that background but hopefully this is useful beyond OOP.
:::

### What are Mocks.
A Mock in the context of unit testing is a module that mimics the behavior of another class/component. These mocks are usually used in Unit tests to replace dependencies that a `System Under Test (SUT)` needs to perform a task. Mocks are useful for giving the tests the same behaviour as the actual dependency would've given us but they are light-weight and depend on some kind of inputs and set up to give us the behaviour we need, good news, we set up those inputs.  

To get a good grasp of what mocks are we going to draw a little diagram and later some code to see how Mocks work using [Moq](https://www.nuget.org/packages/Moq) in a C# XUnit Test Project.  

#### A little scenario
Let's say we have a piece of software that adds recipes to a database using a class called `RecipesManager`. For the RecipesManager to add recipes it needs to use `RecipeStoreService` class that is responsible for saving recipes to some database.

In this scenario we can say **RecipesManager has a dependency on RecipeStoreService** that is, the manager needs the store service for it to fullfil it's functional purpose, i.e. to store recipes to some database.  

This diagram shows the dependency:
![dependency-mangaer-service](../../../static/img/blog-images/explict-data-for-mocks/dependency-manager-service.png)

:::note
I know in the diagram above I have used an interface instead of the actual implementation, this is in line with the concept known as `Dependency Inversion` where a class is decoupled from it's dependency's implementation which may change over time and cause issues. We usually just have the interface which will likey remain with the same contract even though the underlying implementation may change. To learn more about Dependency Inversion please see [this](https://en.wikipedia.org/wiki/Dependency_inversion_principle)
:::

The above diagram shows the dependency if the software was normally running but in a unit test we might want to replace `RecipeStoreService` for a number of reasons listed but not limited to them:
- Starting up the original RecipeStoreService can be expensive for unit tests (time/resources).
- Mocking dependencies means we have control of the input thus the behaviours we want from the SUT.
