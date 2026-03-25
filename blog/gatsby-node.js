exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions

  const result = await graphql(`
    {
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

  result.data.allContentfulKeyboardKey.edges.forEach(({ node }) => {
    createPage({
      path: `/key/${node.keyId.replace(/#/g, 's')}`,
      component: require.resolve('./src/templates/key-page.js'),
      context: { keyId: node.keyId },
    })
  })
}
