// ==UserScript==
// @name         去除知乎关键词搜索和高亮功能，以及点开评论后可以点击遮罩层关闭评论
// @namespace    tao'sSecondScript
// @version      2.0
// @description  展开文章的时候，再次点击，去除知乎无用的搜索和高亮功能，太傻逼了，导致我剪切后的文章总有莫名奇妙的图标和超链接
// @author       谷雨
// @match        *://www.zhihu.com/*
// @icon         https://static.zhihu.com/heifetz/favicon.ico
// @grant        none
// @run-at       document-end
// @license MIT
// ==/UserScript==
(function () {
  'use strict';
  // 页面滚动到顶部
  setTimeout(() => {
    window.scrollTo(0, 0)
  }, 1000)
  // 点击遮罩层关闭评论
  document.addEventListener('click', function (e) {
    const ele = e.target
    const style = getComputedStyle(ele)
    if (style.backgroundColor === 'rgba(0, 0, 0, 0.65)') {
      const svg = document.querySelector('.Zi--Close')
      if (svg) {
        e.stopPropagation()
        svg.parentElement.click();
      }
    }
  })

  // 去除搜索和高亮功能
  let move = false
  function removeHighlight(richContent) {
    const collapsedEle = richContent.classList.contains('.is-collapsed')
    if (!collapsedEle) {
      const hightlightOne = richContent.querySelector('.RichContent-EntityWord')
      if (hightlightOne && hightlightOne.style.display !== 'none') {
        const hightlight = richContent.querySelectorAll('.RichContent-EntityWord')
        console.log('clear hightlight')
        hightlight.forEach(item => {
          if (item.style.display !== 'none') {
            const text = item.textContent
            item.insertAdjacentText('afterend', text)
            item.style.display = 'none'
          }
        })
      }
    }
  }

  function throttle(func, delay) {
    let lastCall = 0;
    return function (...args) {
      const now = new Date().getTime();
      if (now - lastCall >= delay) {
        lastCall = now;
        return func.apply(this, args);
      }
    }
  }

  document.addEventListener('mousemove', throttle((e) => {
    move = true
    const ele = e.target
    const parentEle = ele && ele.closest('.RichContent')
    if (parentEle && !parentEle.classList.contains('is-collapsed')) {
      removeHighlight(parentEle)
    }
  }, 1000))

  document.addEventListener('click', e => {
    move = false
    const x = e.clientX
    const y = e.clientY
    setTimeout(() => {
      if (!move) {
        const ele = document.elementFromPoint(x, y)
        const parentEle = ele && (ele.closest('.List-item') || ele.closest('.Card'))
        const richContent = parentEle && parentEle.querySelector('.RichContent')
        if (richContent && !richContent.classList.contains('is-collapsed')) {
          removeHighlight(richContent)
        }
      }
    }, 1000)
  })

})();