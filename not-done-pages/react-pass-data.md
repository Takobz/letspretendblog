---
slug: Passing data around in ReactJs
title: Passing data around in ReactJs
authors:
  - name: Khutso Kobela
    title: Novice Programmer
    url: https://github.com/Takobz
    image_url: https://github.com/Takobz.png
tags: [ReactJs, FrontEnd, Javascript]
---

<!--truncate-->

Hello, Reader! 🙂, It's been a while since I posted something.  
In my quest to start with [ReactJs](https://reactjs.org/) I found something interesting about passing data around from component to component and I want to talk about it because it was just amazing!

Without wasting any time let's dive straight into the concepts.

<!--truncate-->

### Topics:

- A Component
- Parent-Child Components
- Ohh wow Props!
- Event Props (looking at input tag)
- Ohh Wait, Our Very Own Event Prop!
- Conclusion 

### A Component

As you might know ReactJs uses components to build up it's user interface. A component can be anything ranging from a Card, Widget that consists of a text input and a button or simply a div with text.

The idea of these components is to have UI elements that we can re-use and call as you would call a normal html tag like `div` `h1` etc.

Below is how a component is created in ReactJs. This component just renders the text **Parent Component** on the screen:

```js
import React from "react";

const ParentComponent = () => {
  return (
    <>
      <h1>Parent Component</h1>
    </>
  );
};

export default ParentComponent;
```

If we reference this component in the App.js would do this:

```js
import "./App.css";
import ParentComponent from "./Components/ParentComponent";

function App() {
  return (
    <div>
      <ParentComponent />
    </div>
  );
}

export default App;
```

We will see this:
![component-example](/static/img/blog-images/react-pass-data/component-example.PNG)

:::note
To learn more about Components visit [React site](https://reactjs.org/docs/components-and-props.html) 🙂
:::

### Parent-Child Components

If you noticed above I called the Parent Component inside the `return()` function of App.js (a component) this means that the Parent component is the child of the App.js component.

To make this a little clear I will create a component called ChildComponent and this will be called inside the Parent component. Here is how the child will look like:

```js
import React from "react";

const ChildComponent = () => {
  return (
    <>
      <h3>Hello I am a child Component Of ParentComponent</h3>
    </>
  );
};

export default ChildComponent;
```

In the parent component I will do this:

```js
import React from "react";
import ChildComponent from "./ChildComponent";

const ParentComponent = () => {
  return (
    <>
      <h1>Parent Component</h1>
      <ChildComponent />
    </>
  );
};

export default ParentComponent;
```

This will give me the result:  
![child-in-parent](/static/img/blog-images/react-pass-data/child-in-parent.PNG)

::: note
In the ParentComponent I will just reference this file with `import ChildComponent from './ChildComponent';`. These two files ChildComponent and ParentComponent are in the same directory.
:::

#### Some Changes:

To demonstrate the data passing data I will edit my Parent and Child components. Please bare with me 🙂. This how both files will change:

```js
//ChildComponent.js
import React, { useState } from "react";

const ChildComponent = (props) => {
  const [value, setValue] = useState("");
  const [displayValue, setDisplayValue] = useState("");

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setDisplayValue(value);
    setValue("");
  };

  return (
    <>
      <h3>The User Inputted: {displayValue}</h3>
      <form onSubmit={handleSubmit}>
        <label>
          Insert Data Here:
          <input type="text" onChange={handleChange} value={value} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    </>
  );
};

export default ChildComponent;
```

```js
//ParentComponent.js
import React from "react";
import ChildComponent from "./ChildComponent";

const ParentComponent = () => {
  return (
    <>
      <h1>Parent Component</h1>
      <ChildComponent />
    </>
  );
};

export default ParentComponent;
```

The Result:  
[child-form](/static/img/blog-images/react-pass-data/child-form.PNG)

The above just displays whatever a users inputs and if you check my child component now has a `props` argument. Why? Well let's talk about props a little.

### Ohh wow Props!

So far I just touched base on some ReactJs functionalities and didn't talk about moving data around. Props will help us move data from parent-to-child and child-to-parent (in a slick way!).

`Props` is short for properties and this argument can get data from Parent and pass down to the child component, let's see how.

If in my ParentComponent file I do something like:

```js
//define const in ParentComponent function/component
const message = 'I come from parent'

//create custom property called parentMsg
//this custom property can have any name.
<ChildComponent parentMsg={message}>
```

To get this piece of data in the child I will call `props.parentMsg`. Like this:

```js
<h5>Message from parent: {props.parentMsg}</h5>
```

This will result into something like:  
[message-from-parent](/static/img/blog-images/react-pass-data/message-from-parent.PNG)

As we can see props allow the parent component to pass `data down to the child` but how does the child give data to the parent component? Well, props and points. Let's look at how that is done.

### Event Props

Event props are used to get data from a child component and then pass to the parent component. You essentially pass a pointer to a function via props to a child component then this get executed in parent with data from child component. Okay! That sounded like something from a movie, let us slow down and look at what I mean by all this. 🙂

One example of this would be the `onChange` event handler. If you look closely at this piece of code:

```js
<input type="text" onChange={handleChange} value={value} />
```

from the ChildComponent.js file we can see that our handleChange method recieves an `event` argument:

```js
const handleChange = (event) => {
  setValue(event.target.value);
};
```
We then use that event object to get the data from the input "component". What we did here was to a function pointer as a prop to the input "component" then whenever a new value is inserted in the input box it called the handleChange function from the parent component i.e) ChildComponent with a value that it created. It pushed up the event object to the component that uses it, in this instance the ChildComponent.js

::: note
A pointer is just a reference to a function. What we actually saying is telling input to call the function we have pointed to and pass some data to it (i.e event object which has some data from the child).
:::

Okay I was just trying to lay the ground here, let's see how we can do this with our custom components.

### Ohh Wait, Our Very Own Event Prop!
