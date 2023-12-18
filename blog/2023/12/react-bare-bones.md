---
slug: react-bare-bones
title: ReactJs Library
authors: 
    - name: Khutso Kobela
      title: Novice Programmer
      url: https://github.com/Takobz
      image_url: https://github.com/Takobz.png
tags: [React, Javascript]
---


# React Bare Bones

Welcome to another blog post on Let's Pretend Blog! In this post, we will look at ReactJs as it is, without the create-react-app template. Just a mini blog to appreciate why ReactJS is purely just an abstraction of the DOM object and see how a simple component can be built.

## Topics
- Introduction
- What is React, from a library view point.
- How to build a simple React Component using purely Javascript.

## Introduction

React is a popular JavaScript library for building user interfaces. It allows developers to create reusable UI components and efficiently update the UI when the underlying data changes.

Let's get started!

## What is React, from a library view point.
I have had problems with understanding why people would refer to React as a library and not a framework and knowing my little lack of knowledge of front end technologies, I'd just not stress myself being such conversations. You'd hear people say "React is not a full framework, I don't like working with it" or "Angular is better it's feature rich, it has routing built into, a clear design in mind (MVC)"  

And I'd be confused until I met this beaut here [React Quickly](https://www.manning.com/books/react-quickly-second-edition). Then I got a clear understanding of what React is.

#### What Problem Is React Solving?
As mentioned in the introduction React focuses on building reusable UI components that change as the state of the data changes, what does this mean? It just means React isn't a framework that is there to help with state management, routing, etc. It is just a means to have resuable and dynamic UI, that's about it.  

Yes react can be extendible with other libraries like `React Router`, `Redux` to name a few. These libraries along with React can form an ecosystem that can mimic and compete fully fleshed UI frameworks like Angular and Vue.Js.

This is one of the reasons the model of React is state-centric, by this I mean the interactivity of UI components built in react is tightly coupled with the state changing, hence [hooks](https://react.dev/reference/react/hooks) like [useEffect](https://react.dev/reference/react/useEffect) have things like dependencies to fire the hook whenever data changes.  

## If Not A Framework then WHAT IS REACT?
To demonstrate fully what is react, we are going to build a mini project that will just show us how can run react with the famous and useful `create-react-app` package which templates our application and helps create a web server for us.

To start please create an empty HTML file in a directory, I named my directory `react-bare-bones` and have an index.html file such that I have the directory path `react-bare-bones/index.html`.

preferbly have `Node.Js` installed (we will need for our web server but any server can be used). This is how my HTML file will look like:
```html
<!DOCTYPE html>
<html>
<head>
    <title>React Bare Bones</title>
</head>
<body>
    <div id="root"></div>
</body>
<script>
    //where my React code will be
</script>
</html>
```

#### ReactDom and React libraries.
For us to have React capabilities in our website we would need to import the following libraries: [ReactDOM](https://unpkg.com/react-dom@18/umd/react-dom.development.js) and [React](https://unpkg.com/react@18/umd/react.development.js). These two classes/libs are important for the following reasons:
- `React` class helps us with the capability to create React elements these elements may be well-known HTML element like `h1`, `p`, `div`, or our own custom components.
- `ReactDOM` class creates an abstraction of the DOM object and helps create the root container of our React application, that is, a container where all our react rendered app will reside. It also has the render method that will render our app.

To add these two classes in our html file, which be use adding React to our website would required us to add this in our header tag:
```html
<head>
    <title>React Bare Bones</title>
    <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
</head>
```

:::note
I know I used the word element to define the HTML tags like h1 and p. In React any small building block that can be reused and created via the React.createElement(...) (which we will see in action) is reffered to an element as it an instance of a React element that can be passed properties to make behave a certain way.  
:::

### Making my React App
In this section we will add some React into our app and can't create a simple Hello, World Website. Assuming you have added the cdn references to the `index.html` file we can proceeed to add our React code in the script.

#### React Element
To create the React element we will add the following line in our script in:

```js
var reacth1Element = React.createElement('h1', null, 'Hello World');
```

Th createElement takes in three arguments:
- `type` this is a string that represents a component that we want to render like `h1`, `div`, `p` or our own custom component.
- `data` this would represent the data we want to pass to the component/element. This is also reffered to as props, short for properties. In this mini example we don't need props hence the null.
- `...children` this is the list children of the component in this case the h1 tage would have the text as the only child.

This would allow us to create a React element but we need a place to render this element.

#### Rendering the React Element.
To render the element we will need a cotainer to place our React application, we will use our `div` with `id="root"` like this:
```js
var divNode = document.getElementById('root');
```
This is just vanilla javascript to get the div's object instance in the DOM.

Will then do then need to set this as the root element in our React virtual DOM using this line:
```js
var reactAppRoot = ReactDOM.createRoot(divNode);
```

This will create our React App Node but if we were to run our web server now, nothing will rendered because we just created the root but didn't render it on the DOM, to do so we will do the following:
```js
reactAppRoot.render(reacth1Element);
```

The render method takes in a react element to be displayed.

The complete filer would look like this:
```js
<!DOCTYPE html>
<html>
<head>
    <title>React Bare Bones</title>
    <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
</head>
<body>
    <div id="root"></div>
</body>
<script>
    var reacth1Element = React.createElement('h1', null, 'Hello World');
    var divNode = document.getElementById('root');
    var reactAppRoot = ReactDOM.createRoot(divNode);
    reactAppRoot.render(reacth1Element);
</script>
</html>

```

The above would be enough to get your react App running, but first we need to create a web server to host our beautiful website.

#### Web Server with Node.Js
I have Node installed in my machine so I will just use that to host my site. Here's how I will do it:
- open the terminal in my working directory, i.e. directory with `index.html`
- run `npx serve` this will serve up the Html in the working directory.
- A Url with a port number will be shown in the terminal that you can follow and see your website.

The Result should be something like this:
![](../../../static/img/blog-images/react-bare-bones/hello-world-react.png)

As you can see the `div` now has the h1 tag and we didn't template this or right it in a markdown format just pure Javascripting!! and no `react-create-app`.

:::note
React uses what we called JSX to actually create react elements in an xml like syntax, this is pure javascript that looks like xml. It is mostly used instead of using React.createElement. I didn't focus on that here because I wanted to show the appreciation of React just being a javascript UI library and nothing more.
:::


## Conclusion.
Just to close this, here's a quick recap of what we covered:
- React is library and not a framework.
- React focuses on building dynamic UI components.
- You just need javascript and the relavant libraries that have ReactDom and React to build your web app.

Until next time! keep pretending until you are not 😁. Bye!!