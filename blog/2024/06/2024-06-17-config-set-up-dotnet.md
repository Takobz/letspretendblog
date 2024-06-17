---
slug: config-set-up-dotnet
title: Configuration Set Up For A .NET App
authors: 
    - name: Khutso Kobela
      title: Novice Programmer
      url: https://github.com/Takobz
      image_url: https://github.com/Takobz.png
tags: [ .NET, Configuration, Dependency Injection, DI]
date: 2024-06-17
---

Hello there! On this blog post we are going to look at different ways to read the configuration into your application and what each method implies.  
In the blog post will just be using the appsettings.json as our configuration provider.

<!--truncate-->

## Topics
- Reading the Configuration (Bind, Configure and Configuration[string-value])
- How Each Method Handle Changes.
- What to use?
- Conclusion

All code referenced in this blog post can be found [here](https://github.com/Takobz/).
Microsoft has good documentation on this which can be found [here](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/configuration/options/)

### Reading the Configuration (Bind, Configure and Configuration[string-value])
In this section we will look at different ways we can read in the configuration into a .NET Application.
The following code snippets assume we have an appsetting.json file with this `Secrets:SecretA` structure, as seen below:
```json
{
    "Secrets": {
        "SecretA":"someValue"
    },
    "Key":"Value" 
}
```
We also assume we have a C# class with that structure for binding purposes, as seen below:
```js
namespace ConfigTesting.Models 
{
    #pragma warning disable CS8618
    public class SecretsOptions
    {
        public const string Secrets = "Secrets";
        public string SecretA { get; set; }
    }
}
```

#### Bind Method
With the bind method, we get the section we want from the loaded configuration (in our case the appsettings.json) then we bind that section to an instance of a class that we have created ourselves. For the binding to work the corresponding properties in the class need to have public getter and setter as seen above for `SecretsOptions` class.  

This is how we can bind:
```js
//assuming configuration is IConfiguration/IConfigurationManager which we can access via DI or builder.Configuration
//.NET must have loaded the appsettings.json file by default for us.

//we create an instance then bind it to values in the configuration
var secretsOptions = new SecretsOptions();
configuration.GetSection(SecretsOptions.Secrets).Bind(secretsOptions)

//this will give out the current SecretA value, the one we had at the time of binding
secretsOptions.SecretA;
```

Things to note here are:
- This gets the current loaded configuration and binds values to the class
- If the `IConfiguration` updates values the `secretOptions` **WILL NOT** update.
- This method can be used anywhere in the application where we can have access to IConfiguration.

#### Configure&lt;TOption&gt; Method
The `TOption` generic class in this instance is our class that represents the settings i.e. `SecretsOptions` class.  
With this method we still need to get the section from the configuration but we don't need to bind to any instance as we will be accessing our settings via Dependency Injection.

This is how we read in the config:
```js
// This allow us to get the configuration via the IOptions<TOption>, IOptionsMonitor<TOption>, or IOptionsSnapshot<TOption>
// This adds our options to the DI container
configuration.GetSection(SecretsOptions.Secrets).Configure<SecretsOptions>();

//Example of usage in other class
public class SomeClass 
{
    private readonly _secretsOptions;
    public SomeClass(IOptions<SecretsOptions> options)
    {
        _secretsOptions = options.Value ?? throw new ArgumentNullException(nameof(options));
    }

    //usage later in the code
    //This will give us the value of SecretA that was loaded from the configuration when IOptions was constructed.
    //The IOption is constructed into the DI container as a singleton, more on this later.
    _secretsOptions.SecretA;
}
```

Things to note here are:
- This method adds our section to the DI container.
- It allows us to get our section with the class IOptions, IOptionsMonitor, or IOptionsSnapshot

#### Configuration[string-value]
Another note worthy method of reading the configuration is using the configuration itself. This works for the IConfiguration which can be accessed via DI.
.NET Automatically adds the loaded Configuration into the DI container. 
