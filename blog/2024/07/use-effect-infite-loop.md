---
slug: use-effect-infite-loop
title: UseEffect Infite Loop
authors: 
    - name: Khutso Kobela
      title: Novice Programmer
      url: https://github.com/Takobz
      image_url: https://github.com/Takobz.png
tags: [ React, FrontEnd, UI, API ]
date: 2024-07-30
---

Hello there! On this blog post we are going to have a brief talk about React's UseEffect Hook and some silly thing I have done that caused the UseEffect to keep calling my setup even though my dependency didn't change, or at least I thought.

<!--Truncate-->

## Topics
- [Brief explanation of the UseEffect Hook](#brief-explanation-of-the-useeffect-hook)
- [A word on dependencies array](#a-word-on-dependencies-array)
- [My Silly Error](#my-silly-error)

Before we dive into the details I would like to say React has a [good documentation on the UseEffect hook](https://react.dev/reference/react/useEffect), I'd recommend that as a source of learning about the hook, here I will be just focusing on the error I made so then enjoy, you beautiful reader!

## Brief explanation of the UseEffect Hook

The `UseEffect(setup, dependencies)` function is a [React hook](https://react.dev/reference/react/hooks), a hook is a React function that allows you to use React features like state where you want to store the state of a certain variable on every re-render of a component. The UseEffect is used to reach out to external services from our React component. 

A good example would be to get data from a REST API so we can display in our component, other tasks would be to do some operations on a file system which is external to our React app, something like reading a file.  

The React UseEffect hook is called within the body of React component or custom hook we defined, it has two arguments `setup` and `dependencies`. The setup is a function we pass that will be called when our UseEffect is triggered. The dependencies is an array of dependencies, can be ignore, empty or have a known list of dependencies. 

A simple example of the react useEffect in action would look like this:
```js title="simple-react-snippet-using-useEffect"
const myReactComponent = (props) => {
    useEffect(() => {
        //set up method
        //call api, go to file system, reach out to the DOM
    }, []);

    return (<div>Some Content here</div>);
}
```

We can also optionally return a clean up function in our React hooks, a clean up are method that is called after the set up is done doing it's task. Clean up function are used like so:

```js title="simple-react-snippet-using-useEffect-with-cleanup"
const myReactComponent = (props) => {
    useEffect(() => {
        //set up method
        //call api, go to file system, reach out to the DOM

        return () => {
            //body of clean-up
        }
    }, []);

    return (<div>Some Content here</div>);
}
```

For more info about the clean up method please refer to the [React docs](https://react.dev/reference/react), I don't want to dwell on it here, so sorry. Something I want us to dwell in is the `dependencies` array argument that I have purposfully left of the convo.

## A word on dependencies array
The dependencies array is an optional parameter we pass along with the setup function in the `useEffect` function. The array lists the dependencies that will cause the useEffect to be called when they change, there are some cases that cause the useEffect to behave a certain way, the cases are as follows:

### No dependencies specified:

```js title=no-dependencies-specified
const myReactComponent = (props) => {
    useEffect(() => {
        //set up method
        //call api, go to file system, reach out to the DOM

        return () => {
            //body of clean-up
        }
    }); // no dependencies array

    return (<div>Some Content here</div>);
}
```
When no dependencies are specified this tells React to call the useEffect on every re-render that happens in the component, re-renders are consequence of state changes or page reloads, state variables are specified with [useState()](https://react.dev/reference/react/useState) which I won't dwell on here. This is desirable if you want useEffect to be called when any of state varibales changes for whatever reason.


### Empty dependencies array
```js title=empty-dependencies-specified
const myReactComponent = (props) => {
    useEffect(() => {
        //set up method
        //call api, go to file system, reach out to the DOM

        return () => {
            //body of clean-up
        }
    }, []); //empty array

    return (<div>Some Content here</div>);
}
```
When an empty array is passed this tells React to run the useEffect after initial render of the component and never again, this is ideal for situations where we want to do some task on initial load of the component then never again, like fetching a file once when the component comes up on the screen and never wanting to fetch the file ever again until we remove the component from the view.

### Specifying dependencies
```js title=dependencies-specified
const myReactComponent = (props) => {
    const [message, setMessage] = useState('');
    const otherMessage = '';

    useEffect(() => {
        //set up method
        //call api to save message to db

        return () => {
            //body of clean-up
        }
    }, [message, otherMessage]); //dependency


    //some code that potentially changes the message state variable here

    return (<div>Some Content here</div>);
}
```

When a dependency is specified this tells React that when this value changes run the code in the useEffect, the useEffect will run once after initial render and again if the message state variable changes. If you look carefully I have two dependencies, `message` and `otherMessage`, this is to drive an important point, variables that re defined within the component body including props are called reactive variables and are the only objects/variables that can be dependencies to a useEffect, please see [this](https://react.dev/learn/lifecycle-of-reactive-effects#effects-react-to-reactive-values) for more info.

This final case is the reason I did my silly mistake. Let's see how.


## My Silly Error