import React from "react"
import ClientSearch from "../components/clientSearch"

const SearchTemplate = props => {
  const { pageContext } = props
  const { search } = pageContext
  const { posts, options } = search  
  
  return (
    <div>
      <h1 style={{ marginTop: `3em`, textAlign: `center` }}>
        Search data using JS Search using Gatsby Api
      </h1>
      <div>
        <ClientSearch posts={posts} engine={options} />
      </div>
    </div>
  )
}
export default SearchTemplate