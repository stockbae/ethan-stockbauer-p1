import React from "react"
import { graphql, Link } from "gatsby"
import Layout from "../components/layout"
import Seo from "../components/seo"

function KeyPage({ data }) {
  const key = data.contentfulKeyboardKey

  return (
    <Layout>
      <nav style={{ marginBottom: "1rem" }}>
        <Link to="/">← Back to keyboard</Link>
      </nav>

      <h1>Key: {key.keyId}</h1>

      <section style={{ marginBottom: "2rem" }}>
        <h2>Current configuration</h2>
        <table style={{ borderCollapse: "collapse" }}>
          <tbody>
            <tr>
              <th style={{ textAlign: "left", padding: "4px 16px 4px 0" }}>Key ID</th>
              <td>{key.keyId}</td>
            </tr>
            <tr>
              <th style={{ textAlign: "left", padding: "4px 16px 4px 0" }}>Assigned note</th>
              <td>{key.assignedNote}</td>
            </tr>
            <tr>
              <th style={{ textAlign: "left", padding: "4px 16px 4px 0" }}>Octave</th>
              <td>{key.octave ?? "—"}</td>
            </tr>
          </tbody>
        </table>
      </section>
    </Layout>
  )
}

export const Head = ({ data }) => (
  <Seo title={`Key: ${data.contentfulKeyboardKey.keyId}`} />
)

export const query = graphql`
  query KeyPageQuery($keyId: String!) {
    contentfulKeyboardKey(keyId: { eq: $keyId }) {
      keyId
      assignedNote
      octave
      contentful_id
    }
  }
`

export default KeyPage
