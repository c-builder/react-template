import webConfig from '../config/web.config';

module.exports = {
  ROUTE_HOME: `${webConfig.routePath}/`, //首页
  ROUTE_GROUP_REACT: `${webConfig.routePath}/group/create`,  //团队新建页
  ROUTE_GROUP_REACT: `${webConfig.routePath}/group/reject/:gid`  //驳回页面
};
