---
path: "/posts/gatsby"
title: "My Journey Creating a Gatsby Site with Search and Pagination"
date: "2019-12-07"
author: "Djoe Pramono"
tag: "gatsby, notebook"
---

I have been blogging in [Medium](https://medium.com/@djoepramono) for a while now. It's been great but recently the thought of having my own website came back to my mind. I had a [Jekyll](https://jekyllrb.com/) site before, but I didn't want to go back to that, at the same time I heard a lot of good things about [Gatsby](https://www.gatsbyjs.org/). So I decided to give it a try and built https://www.codeallnight.com. This blog summarises my experience so far and you can also look at the code at my [github](https://github.com/djoepramono/code-all-night)

## 1. Markdown Posts


## 2. Testing Locally

Running the default `gatsby develop` makes the site only avaiable on the host computer via localhost. If you want to make it accessible to your phone which is on the same local network, you need to run the following.

```bash
gatsby develop -H 0.0.0.0
```

## 3. CSS Styling

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

However `context` can be injected into Gatsby's GraphQL queries.  Have a look at `skip` and `limit` at the pagination query below.

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

These context can **only** be created via Gatsby `createPage`. It's kind of a bummer, unless I'm reading [this]((https://www.gatsbyjs.org/docs/page-query/)) wrong.

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

const posts = result.data.allMarkdownRemark.edges.map(
    transformRemarkEdgeToPost
  )

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

## 7. Code Highlighting

For example via a phone that's in local network. You need to use run 

```shell
gatsby develop -H 0.0.0.0
```

## 8. Trailing slash

Gatsby has a rather weird relationship with trailing slashes and that could hurt your SEO performance.

Any pages created in `pages` folder e.g. `pages/page-2.js` is created as `public/page-2/index.html` which means some HTTP server would serve the page as `http://www.codeallnight.com/page-2/`. Notice the trailing slash! By default you cannot remove this.

How about pages created using `gatsby-node.js`'s `createPages`? It the same. For example the markdown in `posts` folder would be created as `posts/markdown-title/index.html` or `posts/markdown-title/`. 

The fun part though, if you try to access the page through the client redirection and not server render, you might notice that the url on your browser doesn't indicate that there's a redirection. For example from `http://www.codeallnight.com/posts/` to `http/www.codeallnight.com/posts/gatsby`, there is no trailing slash in the end of the url. However if you refresh the page, you'll see that the url now has a trailing slash.

Now there's another twist. If you are using `gatsby develop` and try to access `http://www.codeallnight.com/posts/gatsby` or `http://www.codeallnight.com/posts`, you will **always** be redirected to the version with trailing slashes. **However**, if you use `gatsby build` and then `gatsby serve`, after the redirection (_which add the trailing slash_) you will notice that there's **another step** of removing the trailing slashes. Well it's not actually removing the trailing slash, it's modifying the url on the client side to match the `path` supplied to `gatsby-node.js`'s `createPages`. This is the reason why we decide to use `/posts/` (_with trailing slash_) as the `path` in the search page.

All in all though, the 301 redirect is still there regardless how the page is created.
