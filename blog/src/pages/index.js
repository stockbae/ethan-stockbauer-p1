import React from "react"
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

export const Head = () => <Seo title="Home" />

export default IndexPage


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