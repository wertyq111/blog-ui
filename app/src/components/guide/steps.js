const steps = {
  header_right: [
    {
      element: '#full-screen',
      popover: {
        title: '开启全屏',
        description: '将页面全屏展示',
        side: 'bottom'
      }
    },
    {
      element: '#language-select',
      popover: {
        title: '切换语言',
        description: '使用不同地区的语言',
        side: 'bottom'
      }
    },
    {
      element: '#notice-receive',
      popover: {
        title: '消息通知',
        description: '接收收到的消息和审核通知',
        side: 'left'
      }
    },
    {
      element: '#user-info',
      popover: {
        title: '个人信息',
        description: '个人信息管理',
        side: 'left'
      }
    },
  ],
  dashboard_workplace:[
    {
      element: '#greeting',
      popover: {
        title: '账号昵称',
        description: '打招呼',
        side: 'right'
      }
    },
    {
      element: '#login_time',
      popover: {
        title: '登录时间',
        description: '上次登录时间',
        side: 'bottom'
      }
    },
    {
      element: '.workplace-count-group',
      popover: {
        title: '通知提示',
        description: '通知数量提示',
        side: 'left'
      }
    },
    {
      element: '#shortcut',
      popover: {
        title: '快捷方式',
        description: '快速跳转到指定菜单',
        side: 'top'
      }
    },
  ],
}

export default steps
