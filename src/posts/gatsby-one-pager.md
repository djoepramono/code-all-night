---
path: "/posts/gatsby-one-pager"
title: "Gatsby One Pager"
date: "2019-12-07"
author: "Djoe Pramono"
tag: "gatsby, notebook"
---

How to build a Gatsby site? Why the guides online are so fragmented? Isn't there a one pager guide for [Gatsby](https://www.gatsbyjs.org/)? _Well_ you have found it. This one page guide would help you build a static site with:

- [x] Markdown based blog post
- [x] Client side search
- [x] Pagination
- [x] Google Analytics
- [x] Code Highlighting
- [x] Responsive design, _well we won't really cover this but you can have a look at the Github code._

See it in action on https://www.codeallnight.com or take a peek at the [git repo](https://github.com/djoepramono/code-all-night). Feel free to clone and build upon the repo, just don't forget to empty the `src/posts` folder and start write your own.

## 1. Prerequisite

First thing first, make sure you have `gatsby-cli` installed and it's advised that you clone the repo and start the development server.

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

Put your markdown files into `src/posts`. _There are some examples there already_. Next up you need to put the following entry into `gatsby-node.js`

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
      context: {}, // additional data can be passed via context
    })
  })
}
```

The code above is utilising Gatsby's `createPages` API to create a static page for each markdown posts. Frontmatter is the key value pair that exists on top of each markdown file. They are basically meta data for the markdown files.

If you want to play around with the GraphQL queries you can head out to http://localhost:8000/__graphql. Gatsby has a UI GraphQL client that is not bad. If you already know about GraphQL then great, if not you can learn more from [here](https://www.gatsbyjs.org/docs/graphql-concepts/)

And if you want to change the template, you might've guessed by now, you can change `src/templates/posts`. It's a React component, so go nuts if you are already familiar with [React](https://reactjs.org/).

All right, by now you should know what `createPages` does.

## 2. Client Side Search

Before we are talking about pagination, let's talk about search first. Code All Night is using [js-search](https://github.com/bvaughn/js-search) to power the search page. The concept is quite simple, during the `post` pages creation, also build the context for the search page. If you want to learn more [here](https://www.gatsbyjs.org/docs/adding-search-with-js-search/) is the guide that helped me get started.

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

Where `transformRemarkEdgeToPost` is just simple data transformation as follows

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

Now you hopefully you know the concept of passing data into pages via `context`. As for the templates, it's using a [React class component])(https://reactjs.org/docs/react-component.html), as it will need to use state. As for the component itself, in Code All Night, it's available in `components/clientSearch`.

## 3. List Page with Pagination

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

where `createListPageParameter` is yet another function that transform data

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

So far so good, now as you can see the `context` passed contains things like `limit`, `skip`, `noOfPages`, and `currentPage`. This metadata is then used in the template to invoke yet another GraphQL query as seen in the `src/templates/list.js`

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

## 4. Fragment

For the better or worse, Gatsby is using their own version of GraphQL. That's why on the file where a GraphQL query is executed, usually there's this import

```js
import { graphql } from "gatsby"
```

Gatsby handles GraphQL fragments in slightly different way than standard GraphQL. Normally GraphQL fragments are imported, interpolated at the top of the GraphQL query and then used by spreading it. In Gatsby's GraphQL, the first and second steps are not needed as Gatsby crawls through all of your files and makes all fragments available in the query automagically.

Let's look back at `src/templates/list.js`

```graphql
export const query = graphql`
  query HomePageQuery {
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      ...MarkdownEdgesFragment
    }
  }
`
```

`MarkdownEdgesFragment` is not explicitly imported/interpolated anywhere and yet it can be used in the GraphQL query. It's magic.

## 5. CSS Styling

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

## 6. Code Highlighting

To highlight code in the posts, I found [PrismJs](https://prismjs.com/) seems to be popular and easy enough to use. Based on this [tutorial](https://dev.to/fidelve/the-definitive-guide-for-using-prismjs-in-gatsby-4708), you can either use [gatsby-remark-prismjs](https://www.gatsbyjs.org/packages/gatsby-remark-prismjs/) or set it up manually like so:

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

A website without any tracking is not complete. Code All Night is implementing Google Analytics via [Gatsby Plugin GTag](https://www.gatsbyjs.org/packages/gatsby-plugin-gtag/). 

Add the following to `gatsby-config.js`

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

Originally I tried to follow  [this default guide](https://www.gatsbyjs.org/packages/gatsby-plugin-google-analytics/) but it did not work, as I couldn't see any traffic on [Google Tag Assistant](https://get.google.com/tagassistant/). It simply says `No HTTP response detected`. Once I switch to Gatsby Plugin GTag, I can see the tracking data on Google Analytics **real time**. I am not 100% certain why but it's probably related to [analytics.js being deprecated](https://developers.google.com/analytics/devguides/collection/gtagjs/migration)

## 8. Trailing slash

Gatsby has a rather weird relationship with trailing slashes and that could hurt your SEO performance.

Any pages created in `pages` folder e.g. `pages/page-2.js` is created as `public/page-2/index.html` which means some HTTP server would serve the page as `http://www.codeallnight.com/page-2/`. Notice the trailing slash! By default you cannot remove this.

How about pages created using `gatsby-node.js`'s `createPages`? It the same. For example the markdown in `posts` folder would be created as `posts/markdown-title/index.html` or `posts/markdown-title/`.

The fun part though, if you try to access the page through the client redirection and not server render, you might notice that the url on your browser doesn't indicate that there's a redirection. For example from `http://www.codeallnight.com/posts/` to `http/www.codeallnight.com/posts/gatsby`, there is no trailing slash in the end of the url. However if you refresh the page, you'll see that the url now has a trailing slash.

Now there's another twist. If you are using `gatsby develop` and try to access `http://www.codeallnight.com/posts/gatsby` or `http://www.codeallnight.com/posts`, you will **always** be redirected to the version with trailing slashes. **However**, if you use `gatsby build` and then `gatsby serve`, after the redirection (_which add the trailing slash_) you will notice that there's **another step** of removing the trailing slashes. Well it's not actually removing the trailing slash, it's modifying the url on the client side to match the `path` supplied to `gatsby-node.js`'s `createPages`. This is the reason why we decide to use `/posts/` (_with trailing slash_) as the `path` in the search page.

All in all though, the 301 redirect is still there regardless how the page is created.
