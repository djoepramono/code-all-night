// Create page for each markdown path
const path = require(`path`)

const transformRemarkEdgeToPost = edge => ({
  author: edge.node.frontmatter.author,
  title: edge.node.frontmatter.title,
  excerpt: edge.node.excerpt,
})

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
              author
              title
              path
            }
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
  );

  createPage({
    path: "/search",
    component: path.resolve(`./src/templates/clientSearchTemplate.js`),
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
}
