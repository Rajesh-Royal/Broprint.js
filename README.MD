<h1 align="center">Broprint.js</h1>
<p align="center">The world's easiest, smallest and powerful visitor identifier for browsers.</p>

<p align="center">
	<a href="https://github.com/Rajesh-Royal/Broprint.js"><img src="https://img.shields.io/badge/total%20size-2.12%20KB-brightgreen" height="20"/></a>
	<a href="https://www.npmjs.com/package/@rajesh896/broprint.js">
    <img src="https://img.shields.io/npm/v/@rajesh896/broprint.js" alt="Current NPM version">
  </a>
    <a href="https://twitter.com/intent/tweet?text=The world's easiest, smallest and powerful visitor identifier for browsers.&url=https://github.com/Rajesh-Royal/Broprint.js&hashtags=javascript,opensource,js,webdev,developers"><img src="http://randojs.com/images/tweetShield.svg" alt="Tweet" height="20"/></a>
</p><br/><br/>


<p align="center">
This package generates a unique ID/String for different browsers. Like chrome, Firefox or any other browsers which support `canvas` and `audio` fingerprinting. You can easily do the browser fingerprinting with this library. Its small and minimal.</p>

<p align="center"><a href="https://github.com/Rajesh-Royal/Broprint.js"><img src="https://user-images.githubusercontent.com/24524924/163906729-f34e193a-e202-43ae-ba4b-c460da6cc911.gif" width="100%"/></a><a href="#"><img src="http://randojs.com/images/dropShadow.png" width="100%"/></a></p><br/>


<p align="center"><a href="https://codesandbox.io/s/browser-fingerprinting-generate-unique-device-id-or-browser-id-507n2v" target="_blank">CodeSandbox, </a>
<a href="https://broprintjs.netlify.app/" target="_blank" >Live Demo</a> </p>

> ⚠ The code is completely open source and not relating to anyone, created in my spare time. [only for educational purpose]

> The algorithms used to encrypt/decrypt data - `murmurhash3_32_gc`, `cyrb53` and `javaHashCode`. Code is inside `.src/code/EncryptDecrypt.js`.

## :hear_no_evil:  What's all the hullabaloo?  
<a href="https://broprintjs.netlify.app/" target="_blank">Broprint.js</a> helps JavaScript developers code visitors identifier more simply, readably, and securely. Whether you need to find a unique visitor, do analytics, browser fingerprinting, or do anything of the like while even preventing frauds, we've got you covered at a **cryptographically strong** level. The best part? Our library is extremely lightweight and developer friendly- which means it won't take a toll on your project, and it's uber-simple to implement. This library works on the concept of **canvas** fingerprint and **audio** fingerprint, the final result which a user get is the combination of **audio and canvas fingerprint**. We are using **cryptojs** under the hood for encryptions but you can easily tweek the library to remove the dependency.  <br/><br/><br/>
</br>

## :zap:  Fast implementation  
   **Step 1:** Install using npm or yarn:<br/>
  
Using npm:
```JavaScript
//Install:
npm i npm i @rajesh896/broprint.js
```
Using Yarn:
```Javascript
//Install:
yarn add npm i @rajesh896/broprint.js
```
<br/><br/>
## :tada:  Examples  
>### **In Reactjs**
```javascript
import { getCurrentBrowserFingerPrint } from "npm i @rajesh896/broprint.js";

getCurrentBrowserFingerPrint().then((fingerprint) => {
    // fingerprint is your unique browser id.
    // This is well tested

    // the result you receive here is the combination of Canvas fingerprint and audio fingerprint.
})
```
<br/>

>### Using this script in the html files
 1. Execute `npm i npm i @rajesh896/broprint.js`
 2. Then -
```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FingerPrint</title>
</head>

<body>
    <script type="module">
        import("./node_modules/npm i @rajesh896/broprint.js/index.js").then((module) => {
            module.getCurrentBrowserFingerPrint().then((fingerprint) => {
                console.log(fingerprint);
            })
        })
    </script>
</body>

</html>
```

- From version `1.1.0` onwards we have a dependency `crypto-js`. If you do not want to have this dependency then use the earlier versions of this library. 

If you want to use it in simple `.html` file, please read the `index.html` file in the root directory.

This repository is for educational and demonstration purposes only!

## :clap:  Supporters
[![Stargazers repo roster for @Rajesh-Royal/Broprint.js](https://reporoster.com/stars/Rajesh-Royal/Broprint.js)](https://github.com/Rajesh-Royal/Broprint.js/stargazers)
[![Forkers repo roster for @nRajesh-Royal/Broprint.js](https://reporoster.com/forks/Rajesh-Royal/Broprint.js)](https://github.com/Rajesh-Royal/Broprint.js/network/members)
<p align="center"><a href="https://github.com/Rajesh-Royal/Broprint.js"><img src="http://randojs.com/images/barsSmallTransparentBackground.gif" alt="Animated footer bars" width="100%"/></a></p>
<br/>
<p align="center"><a href="Rajesh-Royal/Broprint.js#"><img src="http://randojs.com/images/backToTopButtonTransparentBackground.png" alt="Back to top" height="29"/></a></p>
