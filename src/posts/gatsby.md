---
path: "/posts/gatsby"
title: "Gatsby Notebook"
date: "2019-12-07"
author: "Djoe Pramono"
tag: "gatsby, notebook"
---

## What's the default styling used by Gatsby?

It's using CSS Modules,  personally though I prefer to use CSS-in-JS

There's a gotcha though. From my experience, the css would work with `gatsby develop`. But in production, sometimes it is not there. This happens most often on the first page load.

The solution

```bash
npm install --save gatsby-plugin-styled-components \
    styled-components \
    babel-plugin-styled-components
```

and make sure `gatsby-config.js` has the following

```js
module.exports = {
  plugins: [
    {
      resolve: `gatsby-plugin-styled-components`,
      options: {
        // Add any options here
      },
    },
  ],
}
```

## How to test locally?

For example via a phone that's in local network. You need to use run 

```shell
gatsby develop -H 0.0.0.0
```

