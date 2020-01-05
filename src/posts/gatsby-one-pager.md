---
path: "/posts/gatsby-one-pager"
title: "Gatsby One Pager"
date: "2020-01-05"
author: "Djoe Pramono"
tags: ["gatsby", "javascript"]
---

How to build a [Gatsby](https://www.gatsbyjs.org/) site? Why the guides online are so fragmented? Isn't there a one pager guide for Gatsby with a working example? _Well_ you have found it. This one page guide would help you build a static site with:

- [x] Markdown based blog post
- [x] Client side search
- [x] Pagination
- [x] Code Highlighting
- [x] Google Analytics
- [x] Responsive design, _well we won't really cover this but you can have a look at the Github code._

See it in action on https://www.codeallnight.com or take a peek at the [git repo](https://github.com/djoepramono/code-all-night). Feel free to build on top of it. Empty the `src/posts` folder and start write your own.

## 1. Prerequisite

First thing first, install `gatsby-cli` and clone [the repo](<(https://github.com/djoepramono/code-all-night)>). Cloning the repo is optional, but isn't it always nicer to have a code example at your disposal?

```bash
npm install -g gatsby-cli
git clone git@github.com:djoepramono/code-all-night.git
cd code-all-night
npm install
gatsby develop -H 0.0.0.0
```

Running `gatsby develop` only, makes the site only avaiable on the host computer via localhost. But sometimes you want to make it accessible to your local network, so that you can test your site with your mobile phone. For this, you need the `-H 0.0.0.0`.

Each section on this guide might depends on a specific npm package. These packages are already included in the repo `package.json`. If you don't clone the repo and start fresh instead, make sure you install them.

## 2. Markdown Posts

Markdown files can be made into pages in Gatsby with the help of [gatsby-transformer-remark](https://www.gatsbyjs.org/packages/gatsby-transformer-remark/)

Put your markdown files into `src/posts`. _There are some examples there already_. Next up, you need to put the following entry into `gatsby-node.js`

```js
exports.createPages = async ({ actions, graphql, reporter }) => {
  const { createPage } = actions
  const blogPostTemplate = path.resolve(`src/templates/post.js`)
  const result = await graphql(`
    {
      allMarkdownRemark(
        sort: { order: DESC, fields: [frontmatter___date] }
        limit: 1000
      ) {
        edges {
          node {
            frontmatter {
              title
              date(formatString: "DD MMMM YYYY")
              author
              path
            }
            excerpt
            timeToRead
          }
        }
      }
    }
  `)
  // Handle errors
  if (result.errors) {
    reporter.panicOnBuild(`Error while running GraphQL query.`)
    return
  }

  // Create post pages
  result.data.allMarkdownRemark.edges.forEach(({ node }) => {
    createPage({
      path: node.frontmatter.path,
      component: blogPostTemplate,
      context: {},
    })
  })
}
```

The code above is utilising Gatsby's `createPages` API to create a static page for each markdown posts. Each of this markdown files can be enriched with `frontmatter`, a set of key value pair that exists on top of each markdown file.

Under the hood, Gatsby is using GraphQL, which you can read more [here](https://www.gatsbyjs.org/docs/graphql-concepts/) . It also provides you with graphical UI client at http://localhost:8000/__graphql. It's a pretty good tool to explore what queries are available to use.

And if you want to change the template, you can change `src/templates/posts`. It's a React component, so go nuts if you are already familiar with [React](https://reactjs.org/).

All right, by now you should know what `createPages` does.

## 3. Client Side Search

Before we are talking about pagination, let's talk about search first. I am using [js-search](https://github.com/bvaughn/js-search) to power the search page. The concept is quite simple, during the `post` pages creation, we also want build the context for the search page. If you want to learn more, have a look at [here](https://www.gatsbyjs.org/docs/adding-search-with-js-search/).

In your `gatsby-node.js`'s `createPages`, put the following code

```js
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

where `transformRemarkEdgeToPost` is just simple data transformation as follows

```js
const transformRemarkEdgeToPost = edge => ({
  path: edge.node.frontmatter.path,
  author: edge.node.frontmatter.author,
  date: edge.node.frontmatter.date,
  title: edge.node.frontmatter.title,
  excerpt: edge.node.excerpt,
  timeToRead: edge.node.timeToRead,
})
```

The search here is a client side search. Meaning it doesn't talk to the server during the search as the javascript client already know the whole `context`, which is passed into the pages via `createPages`. This makes the search very responsive. Try it out!

Now you hopefully you know the concept of passing data into pages via `context`. As for the templates, it's using a custom [React class component](https://reactjs.org/docs/react-component.html), as it will need to use state. It's available in the repo at `src/components/clientSearch`.

## 4. List Page with Pagination

Next up we are going to create a list page with pagination. The [default Gatsby guide](https://www.gatsbyjs.org/docs/adding-pagination/) is good enough, but I went slightly further.

Put the following into `gatsby-node.js`'s `createPages` function

```js
const postsPerPage = config.noOfPostsPerPage
const noOfPages = Math.ceil(posts.length / postsPerPage)
Array.from({ length: noOfPages }).forEach((_, i) => {
  createPage(
    createListPageParameter(
      `/list-${i + 1}`,
      "./src/templates/list.js",
      posts,
      postsPerPage,
      i
    )
  )
})
```

Basically, it goes through all of your `posts` and create pages that contains a subset of your overall `posts`. Meanwhile `createListPageParameter` is yet another function that transform data

```js
const createListPageParameter = (
  routePath,
  templatePath,
  posts,
  noOfPostsPerPage,
  currentPageIndex
) => ({
  path: routePath,
  component: path.resolve(templatePath),
  context: {
    limit: noOfPostsPerPage,
    skip: currentPageIndex * noOfPostsPerPage,
    noOfPages: Math.ceil(posts.length / noOfPostsPerPage),
    currentPage: currentPageIndex + 1,
  },
})
```

Now since we want to have the index page / landing page to be the same with the list page. We need to create it the same way in `gatsby-node.js`.

```js
createPage(
  createListPageParameter(
    "/",
    "./src/templates/list.js",
    posts,
    postsPerPage,
    0
  )
)
```

So far so good, now as you can see the `context` passed contains things like `limit`, `skip`, `noOfPages`, and `currentPage`. These metadata are then used in the template to invoke yet another GraphQL query as seen in the `src/templates/list.js`

```js
export const listQuery = graphql`
  query listQuery($skip: Int!, $limit: Int!) {
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      limit: $limit
      skip: $skip
    ) {
      ...MarkdownEdgesFragment
    }
  }
`
```

This result of the call is then available in the bespoke React component's `props.data.allMarkdownRemark.edges`

What do learn here? It's possible after you passed some metadata to the page through `context`, e.g. `skip` and `limit` you can use them to make another GraphQL call. This is a powerful concept which allows you to add more data into the page.

But what is `...MarkdownEdgesFragment`? It's GraphQL [fragment](https://www.apollographql.com/docs/react/data/fragments/). But it behaves slightly differently in Gatsby.

## 5. Fragment

For the better or worse, Gatsby is using their own version of GraphQL. That's why on the file where a GraphQL query is executed, usually there's this import

```js
import { graphql } from "gatsby"
```

Gatsby handles GraphQL fragments in slightly different way than standard GraphQL. Normally GraphQL fragments are imported, interpolated at the top of the GraphQL query and then used by spreading it. In Gatsby's GraphQL, the first and second steps are not needed as Gatsby crawls through all of your files and makes all fragments available in the query automagically.

Let's look back at `src/templates/list.js`

```js
export const query = graphql`
  query HomePageQuery {
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      ...MarkdownEdgesFragment
    }
  }
`
```

`MarkdownEdgesFragment` is not explicitly imported/interpolated anywhere and yet it can be used in the GraphQL query. It's magic.

## 6. Styled Components

Gatsby by default uses CSS Modules. However I prefer to use [Styled Components](https://www.styled-components.com/). There's a gotcha though. From my experience, sometimes in production the produced css is just missing even though everything is fine when run via `gatsby develop`. This happens most often on the first page load.

How did I fixed it? Apparently I was missing a module. So make sure that these 3 are installed.

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

## 7. Code Highlighting

To highlight code in the posts, I found [PrismJs](https://prismjs.com/) seems to be popular and easy enough to use. Based on this [tutorial](https://dev.to/fidelve/the-definitive-guide-for-using-prismjs-in-gatsby-4708), you can either use [gatsby-remark-prismjs](https://www.gatsbyjs.org/packages/gatsby-remark-prismjs/) or set it up manually like so:

Install the dependencies from the command line

```bash
npm install --save prismjs \
  babel-plugin-prismjs \
```

Set `.babelrc` in the root folder of your project. Make sure that the languages that you want to highlight are included in the config.

```js
{
  "presets": ["babel-preset-gatsby"],
  "plugins": [
    ["prismjs", {
      "languages": ["javascript", "css", "markup", "ruby"],
      "plugins": ["show-language"],
      "theme": "tomorrow",
      "css": true
    }]
  ]
}
```

Lastly, make sure that you invoke it on your pages/templates, i.e. `src/templates/post.js`

```js
useEffect(() => {
  Prism.highlightAll()
})
```

## 8. Google Analytics

A website without any tracking is not complete and we are implementing Google Analytics via [Gatsby Plugin GTag](https://www.gatsbyjs.org/packages/gatsby-plugin-gtag/).

It's reasonably simple to use. Add the following to `gatsby-config.js`.

```js
module.exports = {
  plugins: [
    {
      resolve: `gatsby-plugin-gtag`,
      options: {
        trackingId: "YOUR_GOOGLE_ANALYTICS_ID",
        head: true,
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

There are several important things here.

- Google Tag Assistant prefer the tracking script to be put in `<head>`, thus `head:true`
- The plugin must be put as **the first plugin** in `plugins` array. I missed this at my first attempt.

Originally I tried to follow [this default guide](https://www.gatsbyjs.org/packages/gatsby-plugin-google-analytics/) but it did not work, as I couldn't see any traffic on [Google Tag Assistant](https://get.google.com/tagassistant/). It simply says `No HTTP response detected`. Once I switch to Gatsby Plugin GTag, I can see the tracking data on Google Analytics **real time**. I am not 100% certain why but it's probably related to [analytics.js being deprecated](https://developers.google.com/analytics/devguides/collection/gtagjs/migration)

## 9. Epilogue

And there you have it, one pager guide for Gatsby. It's quite long, but it reflects my time spent in building my personal website at https://www.codeallnight.com. Maybe it's just that I'm not experienced enough, but there are quite a number of things to implement before I'm finally happy with my site.

If you have any feedback, feel free to hit me up on [Twitter](https://twitter.com/djoepramono) and as always thanks for reading.
