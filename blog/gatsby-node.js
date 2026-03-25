/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-node/
 */

const path = require('path');

/**
 * @type {import('gatsby').GatsbyNode['createPages']}
 */
exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions

  const result = await graphql(`
    {
      # ── Blog posts ──────────────────────────────────────────
      allContentfulBlogPost {
        edges {
          node {
            slug
          }
        }
      }

      # ── Keyboard keys ───────────────────────────────────────
      # Requires a "KeyboardKey" content type in Contentful with fields:
      #   keyId        (Short text)  e.g. "C", "D#"
      #   assignedNote (Short text)  e.g. "C4", "D#3"
      #   octave       (Number, optional)
      allContentfulKeyboardKey {
        edges {
          node {
            keyId
          }
        }
      }
    }
  `)

  if (result.errors) {
    throw result.errors
  }

  // ── Create blog-post pages ───────────────────────────────────
  result.data.allContentfulBlogPost.edges.forEach(({ node }) => {
    createPage({
      path: node.slug,
      component: require.resolve('./src/templates/blog-post.js'),
      context: { slug: node.slug },
    })
  })

  // ── Create keyboard-key pages ────────────────────────────────
  // Each page is created at /key/<keyId>  (e.g. /key/C, /key/D%23)
  // The keyId is passed as context so the key-page template can
  // query the full entry with  contentfulKeyboardKey(keyId: { eq: $keyId })
  result.data.allContentfulKeyboardKey.edges.forEach(({ node }) => {
    createPage({
      path: `/key/${encodeURIComponent(node.keyId)}`,
      component: require.resolve('./src/templates/key-page.js'),
      context: { keyId: node.keyId },
    })
  })
}
