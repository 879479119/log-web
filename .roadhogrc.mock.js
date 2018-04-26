import mockjs from 'mockjs';
import { getRule, postRule } from './mock/rule';
import { getActivities, getNotice, getFakeList } from './mock/api';
import { getFakeChartData } from './mock/chart';
import { getProfileBasicData } from './mock/profile';
import { getProfileAdvancedData } from './mock/profile';
import { getNotices } from './mock/notices';
import { format, delay } from 'roadhog-api-doc';

// 是否禁用代理
const noProxy = process.env.NO_PROXY === 'true';

// 代码中会兼容本地 service mock 以及部署站点的静态数据
const proxy = {
  // 支持值为 Object 和 Array
  'GET /api/currentUser': {
    $desc: '获取当前用户接口',
    $params: {
      pageSize: {
        desc: '分页',
        exp: 2,
      },
    },
    $body: {
      name: 'wanlei mua',
      avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
      userid: '00000001',
      notifyCount: 12,
    },
  },
  // GET POST 可省略
  'GET /api/users': [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park',
    },
  ],
  'GET /api/project/notice': getNotice,
  'GET /api/activities': getActivities,
  'GET /api/rule': getRule,
  'POST /api/rule': {
    $params: {
      pageSize: {
        desc: '分页',
        exp: 2,
      },
    },
    $body: postRule,
  },
  'POST /api/forms': (req, res) => {
    res.send({ message: 'Ok' });
  },
  'GET /api/tags': mockjs.mock({
    'list|100': [{ name: '@city', 'value|1-100': 150, 'type|0-2': 1 }],
  }),
  'GET /api/fake_list': getFakeList,
  'GET /api/fake_chart_data': getFakeChartData,
  'GET /api/profile/basic': getProfileBasicData,
  'GET /api/profile/advanced': getProfileAdvancedData,
  // 'POST /api/login/account': (req, res) => {
  //   const { password, userName, type } = req.body;
  //   if (password === '888888' && userName === 'admin') {
  //     res.send({
  //       status: 'ok',
  //       type,
  //       currentAuthority: 'admin',
  //     });
  //     return;
  //   }
  //   if (password === '123456' && userName === 'user') {
  //     res.send({
  //       status: 'ok',
  //       type,
  //       currentAuthority: 'user',
  //     });
  //     return;
  //   }
  //   res.send({
  //     status: 'error',
  //     type,
  //     currentAuthority: 'guest',
  //   });
  // },
  'POST /api/register': (req, res) => {
    res.send({ status: 'ok', currentAuthority: 'user' });
  },
  'GET /api/notices': getNotices,
  'GET /api/500': (req, res) => {
    res.status(500).send({
      timestamp: 1513932555104,
      status: 500,
      error: 'error',
      message: 'error',
      path: '/base/category/list',
    });
  },
  'GET /api/404': (req, res) => {
    res.status(404).send({
      timestamp: 1513932643431,
      status: 404,
      error: 'Not Found',
      message: 'No message available',
      path: '/base/category/list/2121212',
    });
  },
  'GET /api/403': (req, res) => {
    res.status(403).send({
      timestamp: 1513932555104,
      status: 403,
      error: 'Unauthorized',
      message: 'Unauthorized',
      path: '/base/category/list',
    });
  },
  'GET /api/401': (req, res) => {
    res.status(401).send({
      timestamp: 1513932555104,
      status: 401,
      error: 'Unauthorized',
      message: 'Unauthorized',
      path: '/base/category/list',
    });
  },

  'GET /api/logList': [
    {
      id: 2,
      name: '第一个埋点',
      description: '这是我人生中第一个埋点，很重要',
      version: 100,
      platform: 1,
      type: 2,
      subType: 1,
      status: 0,
      createAt: '2017-02-12 22:13',
      creator: 'wanlei',
      columns: [
        {
          key: 'detail.view',
          name: '用户访问量',
        },
        {
          key: 'detail.view.url',
          name: '用户访问页面',
        },
      ],
    },
  ],
  'GET /api/log/2': {
    id: 2,
    name: '第一个埋点',
    description: '这是我人生中第一个埋点，很重要',
    version: 100,
    platform: 1,
    type: 2,
    subType: 1,
    status: 0,
    createAt: '2017-02-12 22:13',
    creator: 'wanlei',
    columns: [
      {
        key: 'detail.view',
        name: '用户访问量',
      },
      {
        key: 'detail.view.url',
        name: '用户访问页面',
      },
    ],
  },
  'GET /api/abList': [
    {
      id: 2,
      identifier: 'test-a',
      name: '第一个ab测试',
      description: '这是我人生中第一个测试，很重要',
      version: 100,
      platform: 1,
      status: 0,
      createAt: '2017-02-12 22:13:22',
      startTime: '2017-02-12 22:13:22',
      endTime: '2017-02-12 22:13:59',
      creator: 'wanlei',
      teams: [
        {
          id: 0,
          name: '默认对照组',
          feature: 'default',
          params: '{a: 2}',
        },
        {
          id: 233,
          name: '对照组1',
          feature: 'feature:1',
          params: '{a: 8}',
        },
        {
          id: 3554,
          name: '对照组2',
          feature: 'feature:2',
          params: '{a: 5, b: 2}',
        },
      ]
    },
  ],
};

export default (noProxy ? {} : delay(proxy, 1000));
