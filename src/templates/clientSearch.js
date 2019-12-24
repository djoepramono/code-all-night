import React from "react"
import Layout from "../components/layout"
import ClientSearch from "../components/clientSearch/index"

const SearchPage = props => {
  const { pageContext } = props
  const { search } = pageContext
  const { posts, options } = search  
  
  return (
    <Layout>
      <ClientSearch posts={posts} engine={options} />
    </Layout>      
  )
}
export default SearchPage