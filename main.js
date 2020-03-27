const express = require('express');
const graphqlHTTP = require('express-graphql');
const cors = require('cors');
const schema = require('./schema');
const path = require('path');
const graphqlTag = require('graphql-tag');

const app = express();

// Allow cross-origin
app.use(cors());

const LAUNCHES_TAG = process.env.LAUNCHES_TAG || 'LAUNCHES';
const ROCKETS_MISSIONS_TAG = process.env.LAUNCHES_TAG || 'ROCKETS & MISSIONS';


const taggingMiddleware = (req, res, next) => {  
  const query = graphqlTag`
  ${req.query.query}
`;

const name = query.definitions[0].selectionSet.selections[0].name.value

  // launches, rockets, missions
  console.log('name', name);
  
  if ( name === 'launches') {
	res.set('Edge-Cache-Tag', LAUNCHES_TAG);
  } else {
	res.set('Edge-Cache-Tag', ROCKETS_MISSIONS_TAG);
  }
  next();
}

app.use(taggingMiddleware);

app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: true
  })
);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
