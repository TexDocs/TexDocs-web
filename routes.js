const routes = module.exports = require('next-routes')();

routes
    .add('story', '/story/:id')
    .add('project', '/project/id', 'workspace');