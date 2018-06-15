// 模板基础提示框
var BaseAlert = function(data) {
  if(!data) return
  this.content = data.content // 设置内容
  this.panel = document.createElement('div') // 创建提示框面板
  this.contentNode = document.createElement('p') // 创建提示内容组件
  this.confirmBtn = document.createElement('span') // 确定按钮
  this.closeBtn = document.createElement('span') // 关闭按钮

  this.panel.className = 'alert'
  this.confirmBtn.className = 'a-confirm'
  this.closeBtn.className = 'a-close'

  this.confirmBtn.innerHTML = data.confirm || '确认'
  this.closeBtn.innerHTML = data.close || '关闭'
  this.contentNode.innerHTML = this.content

  this.success = data.success || function() {}
  this.fail = data.fail || function() {}
}

/**
 * 提供一些基本方法
 */
BaseAlert.prototype = {
  init() {
    // 处理DOM
    // 1- 生成提示框
    this.panel.appendChild(this.contentNode)
    this.panel.appendChild(this.confirmBtn)
    this.panel.appendChild(this.closeBtn)

    // 2- 插入
    document.body.appendChild(this.panel)

    // 处理绑定事件
    this.bindEvent()
    this.show() // 显示提示框
  },

  bindEvent() {
    this.confirmBtn.onclick = () => {
      this.success()
      this.hide()
    }
    this.closeBtn.onclick = () => {
      this.success()
      this.hide()
    }
  },

  show() {
    document.querySelector('#mask').style.display = 'block'
    this.panel.style.display = 'block'
  },

  hide() {
    document.querySelector('#mask').style.display = 'none'
    this.panel.style.display = 'none'
  }
}

var baseAlertDemo = new BaseAlert({
  content: "这是基础弹窗内容"
});

// 由于addEventListener会累加绑定的事件，当前业务使用onclick比较合适
document.querySelector('.base-alert').onclick = function() {
  baseAlertDemo.init()
}

/**
 * 根据基础模板创建类
 * 举例：通过弹窗框基类扩展一个提示框标题
 */
var TitleAlert = function(data) {
  BaseAlert.call(this, data)
  this.title = data.title
  this.titleNode = document.createElement('h3')
  this.titleNode.innerHTML = this.title
}

TitleAlert.prototype = new BaseAlert()
TitleAlert.prototype.init = function() {
  this.panel.insertBefore(this.titleNode, this.panel.firstClild)
  BaseAlert.prototype.init.call(this)
}

var titleAlertDemo = new TitleAlert({
  title: 'test title',
  content: 'you can'
})
document.querySelector('.title-alert').onclick = function() {
  titleAlertDemo.init()
}

/**
 * 根据继承类创建模板类(继承过基础弹框类的标题弹框类来创建新的继承类)
 * 需求：在标题提示框中新建取消按钮
 */
var CancelAlert = function(data) {
  TitleAlert.call(this, data)

  this.cancel = data.cancel
  this.cancelBtn = document.createElement('span')
  this.cancelBtn.className = 'a-cancel'
  this.cancelBtn.innerHTML = this.cancel || '取消'
}

CancelAlert.prototype = new BaseAlert() // 这一步有点奇怪
CancelAlert.prototype.init = function() {
  TitleAlert.prototype.init.call(this)
  this.panel.appendChild(this.cancelBtn)
}
CancelAlert.prototype.bindEvent = function() {
  TitleAlert.prototype.bindEvent.call(this)
  this.cancelBtn.onclick = () => {
    this.fail()
    this.hide()
  }
}

var cancelAlertDemo = new CancelAlert({
  title: 'test title',
  content: 'handle cancel',
  success() {
    console.log('success')
  },
  fail() {
    console.log('fail')
  }
})
document.querySelector('.cancel-alert').onclick = function() {
  cancelAlertDemo.init()
}


