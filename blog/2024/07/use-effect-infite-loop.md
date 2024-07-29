---
slug: use-effect-infite-loop
title: UseEffect Infite Loop
authors: 
    - name: Khutso Kobela
      title: Novice Programmer
      url: https://github.com/Takobz
      image_url: https://github.com/Takobz.png
tags: [ React, FrontEnd, UI, API ]
date: 2024-07-29
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

For more info about the clean up method please refer to the React docs, I don't want to dwell on it here, so sorry. Something I want us to dwell in is the `dependencies` array argument that I have purposfully left of the convo.

## A word on dependencies array

## My Silly Error