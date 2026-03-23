import * as React from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import Seo from "../components/seo"
import Keyboard from "../components/Keyboard"

const IndexPage = ({ data }) => {
  const keyboardKeys = data.allContentfulKeyboardKey?.edges.map(e => e.node) ?? []

  return (
    <Layout>
      <section>
        <h2>Interactive Keyboard</h2>
        <p style={{ color: "#666", marginBottom: "1rem" }}>
          Click a key to view and edit its configuration.
        </p>
        <Keyboard keys={keyboardKeys} />
      </section>
    </Layout>
  )
}

/**
 * Head export to define metadata for the page
 *
 * See: https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-head/
 */
export const Head = () => <Seo title="Home" />

export default IndexPage

/**
 * GraphQL page query
 *
 * Fetches both blog posts and keyboard keys from Contentful.
 *
 * NOTE on KeyboardKey:
 *   Before this query works you must create a "KeyboardKey" content type
 *   in Contentful with the following fields:
 *
 *     Field name    | Field ID     | Type
 *     --------------|--------------|-------------
 *     Key ID        | keyId        | Short text
 *     Assigned Note | assignedNote | Short text
 *     Octave        | octave       | Number (Integer, optional)
 *
 *   Then add at least one entry so Gatsby can infer the schema.
 */
export const query = graphql`
  {
    allContentfulKeyboardKey(sort: { keyId: ASC }) {
      edges {
        node {
          keyId
          assignedNote
          octave
        }
      }
    }
  }
`