const axios = require('axios');

const {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLBoolean,
  GraphQLList,
  GraphQLSchema
} = require('graphql');

const LaunchType = new GraphQLObjectType({
  name: 'Launch',
  fields: () => ({
    flight_number: { type: GraphQLInt },
    mission_name: { type: GraphQLString },
    launch_year: { type: GraphQLString },
    launch_date_local: { type: GraphQLString },
    launch_success: { type: GraphQLBoolean },
    rocket: { type: RocketType },
	details: { type: GraphQLString },
	launch_window: { type: GraphQLInt },
	ships: {
      type: new GraphQLList(GraphQLString),
      resolve(parent, args) {
            return  parent.ships
      }
    },
  })
});

const RocketType = new GraphQLObjectType({
  name: 'Rocket',
  fields: () => ({
    rocket_id: { type: GraphQLString },
    rocket_name: { type: GraphQLString },
    rocket_type: { type: GraphQLString }
  })
});

const MissionType = new GraphQLObjectType({
  name: 'Mission',
  fields: () => ({
    mission_name: { type: GraphQLString },
	mission_id: { type: GraphQLString },
	manufacturers: {
      type: new GraphQLList(GraphQLString),
      resolve(parent, args) {
            return  parent.manufacturers
      }
    },
	payload_ids: {
      type: new GraphQLList(GraphQLString),
      resolve(parent, args) {
            return  parent.payload_ids
      }
    },
	mission_name: { type: GraphQLString },
	website: { type: GraphQLString },
	description: { type: GraphQLString }
  })
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    launches: {
      type: new GraphQLList(LaunchType),
      resolve(parent, args) {
        return axios
          .get('https://api.spacexdata.com/v3/launches')
          .then(res => res.data);
      }
    },
    launch: {
      type: LaunchType,
      args: {
		flight_number: { type: GraphQLInt }
      },
      resolve(parent, args) {
        return axios
          .get(`https://api.spacexdata.com/v3/launches/${args.flight_number}`)
          .then(res => res.data);
      }
    },
    rockets: {
      type: new GraphQLList(RocketType),
      resolve(parent, args) {
        return axios
          .get('https://api.spacexdata.com/v3/rockets')
          .then(res => res.data);
      }
    },
    rocket: {
      type: RocketType,
      args: {
        id: { type: GraphQLInt }
      },
      resolve(parent, args) {
        return axios
          .get(`https://api.spacexdata.com/v3/rockets/${args.id}`)
          .then(res => res.data);
      }
    },
	missions: {
      type: new GraphQLList(MissionType),
      resolve(parent, args) {
        return axios
          .get('https://api.spacexdata.com/v3/missions')
          .then(res => res.data);
      }
    },
    mission: {
      type: MissionType,
      args: {
        id: { type: GraphQLString }
      },
      resolve(parent, args) {
        return axios
          .get(`https://api.spacexdata.com/v3/missions/${args.id}`)
          .then(res => res.data);
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery
});
