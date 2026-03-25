import React, { useState } from "react"
import { graphql, Link } from "gatsby"
import Layout from "../components/layout"
import Seo from "../components/seo"

function KeyPage({ data }) {
  const key = data.contentfulKeyboardKey

  const [assignedNote, setAssignedNote] = useState(key.assignedNote ?? "")
  const [octave, setOctave] = useState(key.octave ?? "")
  const [saved, setSaved] = useState(false)

  function handleSave(e) {
    e.preventDefault()

    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

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
              <Th>Key ID</Th>
              <td style={tdStyle}>{key.keyId}</td>
            </tr>
            <tr>
              <Th>Assigned note</Th>
              <td style={tdStyle}>{key.assignedNote}</td>
            </tr>
            <tr>
              <Th>Octave</Th>
              <td style={tdStyle}>{key.octave ?? "—"}</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>Edit configuration</h2>
        <p style={{ color: "#666", fontSize: "0.9rem" }}>
          Changes are local (React state) until you connect the Contentful
          Management API.
        </p>

        <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: "320px" }}>
          <label style={labelStyle}>
            Assigned note
            <input
              type="text"
              value={assignedNote}
              onChange={e => { setAssignedNote(e.target.value); setSaved(false) }}
              placeholder="e.g. C4, D#3"
              style={inputStyle}
              required
            />
            <small style={{ color: "#888" }}>
              Standard scientific pitch notation: note name + octave number.
            </small>
          </label>

          <label style={labelStyle}>
            Octave (optional)
            <input
              type="number"
              value={octave}
              onChange={e => { setOctave(e.target.value); setSaved(false) }}
              placeholder="e.g. 4"
              min={0}
              max={8}
              style={inputStyle}
            />
          </label>

          <button type="submit" style={buttonStyle}>
            Save changes
          </button>

          {saved && (
            <p style={{ color: "green", margin: 0 }}>
              ✓ Saved locally! (Wire up the Contentful API to persist.)
            </p>
          )}
        </form>
      </section>
    </Layout>
  )
}

const Th = ({ children }) => (
  <th style={{ textAlign: "left", padding: "4px 16px 4px 0", color: "#555", fontWeight: 600 }}>
    {children}
  </th>
)
const tdStyle = { padding: "4px 0" }
const labelStyle = { display: "flex", flexDirection: "column", gap: "4px", fontWeight: 600 }
const inputStyle = {
  padding: "8px 10px",
  border: "1px solid #ccc",
  borderRadius: "4px",
  fontSize: "1rem",
  fontWeight: "normal",
}
const buttonStyle = {
  padding: "10px 20px",
  background: "#7026b9",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  fontSize: "1rem",
  cursor: "pointer",
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
