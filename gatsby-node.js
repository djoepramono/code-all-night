// Create page for each markdown path
const path = require(`path`)
const config = require("./src/libraries/canConfig")

const transformRemarkEdgeToPost = edge => ({
  path: edge.node.frontmatter.path,
  author: edge.node.frontmatter.author,
  date: edge.node.frontmatter.date,
  title: edge.node.frontmatter.title,
  excerpt: edge.node.excerpt,
  timeToRead: edge.node.timeToRead,
})

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

exports.createPages = async ({ actions, graphql, reporter }) => {
  const { createPage } = actions
  const blogPostTemplate = path.resolve(`./src/templates/post.js`)
  const result = await graphql(`
    {
      allMarkdownRemark(
        sort: {frontmatter: {date: DESC}}
        limit: 1000
      ) {
        edges {
          node {
            excerpt(format: MARKDOWN)
            frontmatter {
              title
              date(formatString: "DD MMMM YYYY")
              author
              path
            }
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

  // Create search page
  const posts = result.data.allMarkdownRemark.edges.map(
    transformRemarkEdgeToPost
  )

  createPage({
    path: "/posts/",
    component: path.resolve(`./src/templates/search.js`),
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

  // Create list page
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

  // Create index page
  // Why? Because we want index page to have the same context as list-1
  createPage(
    createListPageParameter(
      "/",
      "./src/templates/list.js",
      posts,
      postsPerPage,
      0
    )
  )
}
