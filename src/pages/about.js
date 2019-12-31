import React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"

const AboutPage = () => (
  <Layout>
    <SEO title="About" />
    <h1>About Code All Night</h1>
    <p>
      At the moment this website only contains posts from myself. These posts
      are mostly about technical stuffs that I recently learnt or I'm currently
      interested in. But it can be much more, for example you can raise a{" "}
      <a href="https://github.com/djoepramono/code-all-night">pull request</a>,
      if you want your post to be featured here.
    </p>
    <p>
      Most of the posts here are republished in{" "}
      <a href="https://medium.com/@djoepramono">Medium</a> or{" "}
      <a href="https://dev.to/djoepramono">dev.to</a> for more exposure. So if
      you prefer to read from there, feel free to do so. Those two sites also
      allows you to leave a comment. Alternatively you can always reach out on{" "}
      <a href="https://twitter.com/djoepramono">Twitter</a>.
    </p>
    <p>
      I hope that you enjoy your time here and as always thank you for reading
    </p>
    <p>
      Sincerely,
      <br />
      Djoe Pramono
    </p>
  </Layout>
)

export default AboutPage
