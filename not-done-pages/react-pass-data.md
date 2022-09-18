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
In my quest to start with [ReactJs](https://reactjs.org/) I found something interesting about passing data around from component to component and I want to talk about it because it was justa amazing!  

Without wasting any time let's dive straight into the concepts.

<!--truncate-->

### Topics:
- A Component
- Parent-Child Components
- Ohh wow Props!
- Listeners

### A Component
As you might know ReactJs uses components to build up it's user interface. A component can be anything ranging from a Card, Widget that consists of a text input and a button or simply a div with text.

The idea of these components is to have UI elements that we can re-use and call as you would call a normal html tag like `div` `h1` etc.  This

Below is how a component is created in ReactJs. This component just renders the text **Parent Component** on the screen:

``` js
import React from 'react';

const ParentComponent = () => {
    return(
    <>
    <h1>Parent Component</h1>
    </>)
}

export default ParentComponent;
```

If we reference this component in the App.js like this:
``` js
import './App.css';
import ParentComponent from './Components/ParentComponent';

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
``` js
import React from 'react';

const ChildComponent = () => {
    return(<>
    <h3>Hello I am a child Component Of ParentComponent</h3>
    </>)
}

export default ChildComponent;
```

In the parent component I will do this:  
``` js
import React from 'react';
import ChildComponent from './ChildComponent';

const ParentComponent = () => {
    return(
    <>
    <h1>Parent Component</h1>
    <ChildComponent />
    </>)
}

export default ParentComponent;
```

This will give me the result:  
![child-in-parent](/static/img/blog-images/react-pass-data/child-in-parent.PNG)

::: note
In the ParentComponent I will just reference this file with `import ChildComponent from './ChildComponent';`. These two files ChildComponent and ParentComponent are in the same directory.
:::

#### Some Changes:
To demonstrate the data passing data I will edit my Parent and Child components. Please bare with me 🙂. This how both files will change:

``` js
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

``` js
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
``` js
//define const in ParentComponent function/component
const message = 'I come from parent'

//create custom property called parentMsg
//this custom property can have any name.
<ChildComponent parentMsg={message}>
```

To get this piece of data in the child I will call `props.parentMsg`. Like this:  
``` js
<h5>Message from parent: {props.parentMsg}</h5>
```

This will result into something like:  
[message-from-parent](/static/img/blog-images/react-pass-data/message-from-parent.PNG)