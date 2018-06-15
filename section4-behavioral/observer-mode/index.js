/**
 * 观察者对象
 *  - 订阅：
 *    - 注册消息方法，订阅可以理解为注册
 *    - 取消订阅方法(有些场景取消订阅了就不接受广播消息了)
 *  - 发布
 *    - 将订阅时携带进来的方法，执行
 */

// 将观察者放到闭包中，当页面加载就立即执行
var Observer = (function() {
  /**
   * 防止消息队列暴露而被篡改故将消息容器作为静态私有变量存储 这个的目的还没有理解到
   * 此消息队列__message可以起到一个暂存store的作用，将一个类型的动作先收集起来，等到发布的时候，一次性循环
   * 执行所有相同类型的动作，起到消息队列的效果(涉及到多模块注册)
   */
  var __message = {}
  return {
    /**
     * 注册(订阅)消息
     *  将订阅者注册的消息推入到消息队列中
     *  接收两个参数: 消息类型(必须)和相应的处理方法(处理方法是在注册时塞进去的)
     */
    regist(type, fn) {
      // 如果此消息类型不存在，则创建一个该消息类型，并将动作推入空数组队列
      if (typeof __message[type] === 'undefined') {
        // 将动作推入到该消息对应的动作执行队列中，一开始此队列为空
        __message[type] = [fn]
      } else {
        // 此时队列中已经有别的动作了 将新的动作方法推入到该消息类型对应的动作执行队列中
        __message[type].push(fn)
      }
    },
    /**
     * 发布消息
     *  当观察者发布一个消息时，将所有订阅者订阅的消息一次执行
     *  接收两个参数: 消息类型(必须)以及动作执行时需要传递的参数
     */
    fire(type, args = {}) {
      // 如果该消息类型没有被注册，则不处理
      if (!__message[type]) return
      var events = {
        type,
        args
      }
      for(let i = 0; i < __message[type].length; i++) {
        // 依次执行注册的消息对应的动作序列
        __message[type][i].call(this, events)
      }
    },
    /**
     * 注销消息(取消订阅)
     *  将订阅者注销的消息从消息队列中清除
     *  需要两个参数：消息类型以及执行的某一动作
     */
    remove(type, fn) {
      // 如果消息动作队列存在
      if(__message[type] instanceof Array) {
        // 从最后一个消息动作遍历
        for(let i = __message[type].length -1; i >= 0; i--) {
          // 如果存在该动作则在消息动作队列中移除相应动作
          __message[type][i] === fn && __message[type].splice(i, 1)
        }
      }
    },
  }
})();

// =======================  基础测试 =============================================
Observer.regist('test', function(e) {
  // console.log(e.type, e.args.msg)
  console.log(e.type, e)
})

Observer.regist('test', function(e) {
  // console.log(e.type, e.args.msg)
  console.log(123)
})

Observer.fire('test', { msg: '发布的消息' })
// ====================================================================

function $(id) {
  return document.getElementById(id)
}

// A方法 添加一条评论
(function() {
  function addMsgItem(e) {
    var text = e.args.text,
      ul = $('msg'),
      li = document.createElement('li'),
      span = document.createElement('span')

    li.innerHTML = text
    span.innerHTML = 'close X'
    // 关闭按钮
    span.onclick = function() {
      ul.removeChild(li)
      // 发布删除留言消息
      Observer.fire('removeCommentMessage', { num: -1 })
    }
    // 添加删除按钮
    ul.appendChild(li)
    li.appendChild(span)
  }
  // 注册添加评论信息
  Observer.regist('addCommentMessage', addMsgItem)
})();

// B方法 更改用户消息数目
(function() {
  function changeMsgNum(e) {
    // 获取需要增加的用户消息数目
    var num = e.args.num
    $('msg_num').innerHTML = parseInt($('msg_num').innerHTML) + num;
  }
  // 注册添加评论信息
  Observer.regist('addCommentMessage', changeMsgNum)
  Observer.regist('removeCommentMessage', changeMsgNum)

  // 测试一下取消增加消息的订阅
  setTimeout(() => {
    Observer.remove('addCommentMessage', changeMsgNum)
  }, 5000)
})();

// C方法 用户提交，发布一条评论
(function() {
  $('user_submit').onclick = function() {
    // 获取用户输入框中输入的信息
    var text = $('user_input')
    if(text.value === '') return
    // 发布一条评论消息
    Observer.fire('addCommentMessage', {
      text: text.value, // 消息评论内容
      num: 1  // 评论数目
    })
    text.value = '' // 输入框置空
  }
})();