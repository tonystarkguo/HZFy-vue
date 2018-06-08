import login from '../components/login.vue'; //登录
import index from '../components/index.vue'; //首页
import dutyLogin from '../components/dutyLogin.vue'; //值班登录
import messageList from '../components/messageList.vue'; //留言列表
import message from '../components/message.vue'; //详情
import myCaseList from '../components/myCaseList.vue'; //我的案件列表
import myCase from '../components/myCase.vue'; //我的案件
import assessList from '../components/assessList.vue'; //质量评估列表
import assess from '../components/assess.vue'; //质量评估
import userInfo from '../components/userInfo.vue'; //个人信息
import not404 from '../components/404.vue'; //404


export default {
    // mode: 'history',
    routes: [{
        path: '/',
        name: 'login',
        component: login
    }, {
        path: '/index',
        name: 'index',
        component: index
    }, {
        path: '/dutyLogin',
        name: 'dutyLogin',
        component: dutyLogin
    }, {
        path: '/messageList',
        name: 'messageList',
        component: messageList
    }, {
        path: '/message/:id',
        name: 'message',
        component: message
    }, {
        path: '/myCaseList',
        name: 'myCaseList',
        component: myCaseList
    }, {
        path: '/myCase/:caseId',
        name: 'myCase',
        component: myCase
    }, {
        path: '/assessList',
        name: 'assessList',
        component: assessList
    }, {
        path: '/assess/:id',
        name: 'assess',
        component: assess
    }, {
        path: '/userInfo',
        name: 'userInfo',
        component: userInfo
    }, {
        path: '/*',
        name: 'not404',
        component: not404
    }]
}