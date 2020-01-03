import React from "react"
import { OutboundLink } from 'gatsby-plugin-gtag'

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
      <OutboundLink href="https://github.com/djoepramono/code-all-night">pull request</OutboundLink>,
      if you want your post to be featured here.
    </p>
    <p>
      Most of the posts here are republished in{" "}
      <OutboundLink href="https://medium.com/@djoepramono">Medium</OutboundLink> or{" "}
      <OutboundLink href="https://dev.to/djoepramono">dev.to</OutboundLink> for more exposure. So if
      you prefer to read from there, feel free to do so. Those two sites also
      allows you to leave a comment. Alternatively you can always reach out on{" "}
      <OutboundLink href="https://twitter.com/djoepramono">Twitter</OutboundLink>.
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
