import webConfig from '../config/web.config';

module.exports = {
  ROUTE_HOME: `${webConfig.routePath}/`,
  ROUTE_NEWS_REACT: `${webConfig.routePath}/news`,
  ROUTE_NAME_REACT: `${webConfig.routePath}/name/:gid`
};
