---
path: "/posts/gatsby-one-pager"
title: "Gatsby One Pager"
date: "2019-12-07"
author: "Djoe Pramono"
tag: "gatsby, notebook"
---

How to build a Gatsby site? Why the guides online are so fragmented? Isn't there a one pager guide for [Gatsby](https://www.gatsbyjs.org/)? Well you have found it. This guide would help you build a gatsby with:
- [x] Client side search
- [x] Pagination
- [x] Google Analytics
- [x] Code Highlighting
- [x] Responsive design, _well we won't really cover this but you can look at the Github code._

If you'd like to see a working example, you can head off to https://www.codeallnight.com or take a peek at the [git repo](https://github.com/djoepramono/code-all-night) Well in fact, this guide will refer to it quite often.

## Prerequisite

```bash
npm install --save-dev gatsby-cli
```

## 1. Markdown Posts

Markdown files can be made into pages in Gatsby with the help of [gatsby-transformer-remark](https://www.gatsbyjs.org/packages/gatsby-transformer-remark/)

```bash
npm install --save gatsby-transformer-remark \
  gatsby-source-filesystem
```

## 2. Testing Locally

Running the default `gatsby develop` makes the site only avaiable on the host computer via localhost. If you want to make it accessible to your phone which is on the same local network, you need to run the following.

```bash
gatsby develop -H 0.0.0.0
```

## 3. CSS Styling

It's using CSS Modules, personally though I prefer to use CSS-in-JS

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

## 4. Gatsby's GraphQL

For the better or worse, Gatsby is using their own version of GraphQL. That's why on the file where a GraphQL query is executed, usually there's this import

```js
import { graphql } from "gatsby"
```

Gatsby handles GraphQL fragments in slightly different way than standard GraphQL. Normally GraphQL fragments are imported, interpolated at the top of the GraphQL query and then used by spreading it. In Gatsby's GraphQL, the first and second steps are not needed as Gatsby crawls through all of your files and makes all fragments available in the query automagically. See the GraphQL query in `pages\index.js`

```graphql
export const query = graphql`
  query HomePageQuery {
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      ...MarkdownEdgesFragment
    }
  }
`
```

`MarkdownEdgesFragment` are not explicitly imported/interpolated anywhere and yet it can be used in the GraphQL query. It's magic.

However `context` can be injected into Gatsby's GraphQL queries. Have a look at `skip` and `limit` at the pagination query below.

```js
  query blogListQuery($skip: Int!, $limit: Int!) {
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      limit: $limit
      skip: $skip
    ) {
      ...MarkdownEdgesFragment
    }
  }
```

These context can **only** be created via Gatsby `createPage`. It's kind of a bummer, unless I'm reading [this](<(https://www.gatsbyjs.org/docs/page-query/)>) wrong.

```js
Array.from({ length: noOfPages }).forEach((_, i) => {
  createPage({
    path: `/list-${i + 1}`,
    component: path.resolve("./src/templates/list.js"),
    context: {
      limit: postsPerPage,
      skip: i * postsPerPage,
      noOfPages: noOfPages,
      currentPage: i + 1,
    },
  })
})
```

On another twist

https://github.com/gatsbyjs/gatsby/issues/12155

## 5. Pagination

Now that we have taken a peek a how we do pagination above, you can find the rest described well enough at the guide on the [Gatsby](https://www.gatsbyjs.org/docs/adding-pagination/) site. Basically we need to create the pages using GraphQL queries and then query GraphQL again on each page to get the needed data.

## 6. Client Side Search

I use [js-search](https://github.com/bvaughn/js-search) to power the search page. The concept it's quite simple, during the `post` pages creation, also build the context for the search page.

In your `gatsby-node.js`'s `createPages`, put the following code

```js
const transformRemarkEdgeToPost = edge => ({
  path: edge.node.frontmatter.path,
  author: edge.node.frontmatter.author,
  date: edge.node.frontmatter.date,
  title: edge.node.frontmatter.title,
  excerpt: edge.node.excerpt,
  timeToRead: edge.node.timeToRead,
})

const posts = result.data.allMarkdownRemark.edges.map(transformRemarkEdgeToPost)

createPage({
  path: "/posts/",
  component: path.resolve(`./src/templates/clientSearch.js`),
  context: {
    search: {
      posts,
      options: {
        indexStrategy: "Prefix match",
        searchSanitizer: "Lower Case",
        TitleIndex: true,
        AuthorIndex: true,
        SearchByTerm: true,
      },
    },
  },
})
```

As for the react component, you

Combining client side search with server rendered pagination in one page however is not straightforward. Both of them can be made to render two different thing, but at this point i'm not sure.

## 6. Code Highlighting

To highlight code in web pages, I found [PrismJs](https://prismjs.com/) seems to be popular and easy enough to use. Based on this [tutorial](https://dev.to/fidelve/the-definitive-guide-for-using-prismjs-in-gatsby-4708), you can either use [gatsby-remark-prismjs](https://www.gatsbyjs.org/packages/gatsby-remark-prismjs/) or set it up manually like so:

Install the dependencies from the command line

```bash
npm install --save prismjs \
  babel-plugin-prismjs \
```

Set `.babelrc` in the root folder of your project

```js
{
  "presets": ["babel-preset-gatsby"],
  "plugins": [
    ["prismjs", {
      "languages": ["javascript", "css", "markup", "ruby"], // only load the languages that you intend to cover
      "plugins": ["show-language"],
      "theme": "tomorrow", // visit www.prismjs.com to see other theme
      "css": true
    }]
  ]
}
```

Lastly, make sure that you invoke it on your pages/templates. In my case this is `templates/post.js`

```js
useEffect(() => {
  Prism.highlightAll()
})
```

## 7. Google Analytics

A website without any tracking is not complete. Google Analytics is probably one of the easiest tracking tool to use and so far [this guide](https://www.gatsbyjs.org/packages/gatsby-plugin-google-analytics/) is good enough.

Basically install the plugin

```bash
npm install --save gatsby-plugin-google-analytics
```

and add the following to `gatsby-config.js`

```js
module.exports = {
  plugins: [
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: "YOUR_GOOGLE_ANALYTICS_TRACKING_ID",
        // Defines where to place the tracking script - `true` in the head and `false` in the body
        head: false,
        anonymize: true,
        respectDNT: true,
        pageTransitionDelay: 0,
        sampleRate: 5,
        siteSpeedSampleRate: 10,
        cookieDomain: "codeallnight.com",
      },
    },
  ],
}
```

And that's it! You don't need to copy paste the tracking script from Google, the plugin will create the equivalent script for you.

## 8. Trailing slash

Gatsby has a rather weird relationship with trailing slashes and that could hurt your SEO performance.

Any pages created in `pages` folder e.g. `pages/page-2.js` is created as `public/page-2/index.html` which means some HTTP server would serve the page as `http://www.codeallnight.com/page-2/`. Notice the trailing slash! By default you cannot remove this.

How about pages created using `gatsby-node.js`'s `createPages`? It the same. For example the markdown in `posts` folder would be created as `posts/markdown-title/index.html` or `posts/markdown-title/`.

The fun part though, if you try to access the page through the client redirection and not server render, you might notice that the url on your browser doesn't indicate that there's a redirection. For example from `http://www.codeallnight.com/posts/` to `http/www.codeallnight.com/posts/gatsby`, there is no trailing slash in the end of the url. However if you refresh the page, you'll see that the url now has a trailing slash.

Now there's another twist. If you are using `gatsby develop` and try to access `http://www.codeallnight.com/posts/gatsby` or `http://www.codeallnight.com/posts`, you will **always** be redirected to the version with trailing slashes. **However**, if you use `gatsby build` and then `gatsby serve`, after the redirection (_which add the trailing slash_) you will notice that there's **another step** of removing the trailing slashes. Well it's not actually removing the trailing slash, it's modifying the url on the client side to match the `path` supplied to `gatsby-node.js`'s `createPages`. This is the reason why we decide to use `/posts/` (_with trailing slash_) as the `path` in the search page.

All in all though, the 301 redirect is still there regardless how the page is created.
