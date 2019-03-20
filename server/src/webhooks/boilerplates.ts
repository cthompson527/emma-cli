import * as algolia from 'algoliasearch'
import * as probot from 'probot'

/* Setup */

const client = algolia(process.env.ALGOLIA_APP_ID, process.env.ALGOLIA_API_KEY)
const index = client.initIndex('BOILERPLATES')

/* Emma Boilerplates */
