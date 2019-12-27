---
path: "/posts/gatsby"
title: "Gatsby Notebook"
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

## 4. Pagination

The guide on the [Gatsby](https://www.gatsbyjs.org/docs/adding-pagination/) site is good enough. Basically we need to create the pages using GraphQL queries and then query GraphQL again on each page to get the needed data.

## 5. Client Side Search

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

## 5. Trailing slash

Gatsby has a rather weird relationship with trailing slashes and that could hurt your SEO performance.

Any pages created in `pages` folder e.g. `pages/page-2.js` is created as `public/page-2/index.html` which means some HTTP server would serve the page as `http://www.codeallnight.com/page-2/`. Notice the trailing slash! By default you cannot remove this.

How about pages created using `gatsby-node.js`'s `createPages`? It the same. For example the markdown in `posts` folder would be created as `posts/markdown-title/index.html` or `posts/markdown-title/`. 

The fun part though, if you try to access the page through the client redirection and not server render, you might notice that the url on your browser doesn't indicate that there's a redirection. For example from `http://www.codeallnight.com/posts/` to `http/www.codeallnight.com/posts/gatsby`, there is no trailing slash in the end of the url. However if you refresh the page, you'll see that the url now has a trailing slash.

Now there's another twist. If you are using `gatsby develop` and try to access `http://www.codeallnight.com/posts/gatsby` or `http://www.codeallnight.com/posts`, you will **always** be redirected to the version with trailing slashes. **However**, if you use `gatsby build` and then `gatsby serve`, after the redirection (_which add the trailing slash_) you will notice that there's **another step** of removing the trailing slashes. Well it's not actually removing the trailing slash, it's modifying the url on the client side to match the `path` supplied to `gatsby-node.js`'s `createPages`. This is the reason why we decide to use `/posts/` (_with trailing slash_) as the `path` in the search page.

All in all though, the 301 redirect is still there regardless how the page is created.
