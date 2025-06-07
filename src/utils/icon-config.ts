/**
 * 阿里图标库配置
 *
 * 这个文件用于配置阿里图标库的链接和常用图标名称
 */

// 图标库链接 (支持HTTP和HTTPS协议)
export const ICON_URL = 'https://at.alicdn.com/t/c/font_4942439_zvzb6m54i8.js'
export const ICON_FONT_URL = '//at.alicdn.com/t/c/font_4942439_zvzb6m54i8.js'

// 图标名称映射
export const ICON_NAMES = {
  // 社交媒体图标
  QQ: 'icon-qq',
  WECHAT: 'icon-weixin',
  WEIBO: 'icon-weibo',
  GITHUB: 'icon-GitHub',
  EMAIL: 'icon-email',

  // 设备图标
  MAC: 'icon-mac',
  MOBILE: 'icon-shouji',
  PC: 'icon-PC',

  // 界面功能图标
  SEARCH: 'icon-search',
  SETTING: 'icon-setting',
  USER: 'icon-user',
  HOME: 'icon-home',
  DOWNLOAD: 'icon-download',
  SHARE: 'icon-share',
  DELETE: 'icon-delete',

  // 其他常用图标
  ARROW_RIGHT: 'icon-arrow-right',
  ARROW_LEFT: 'icon-arrow-left',
  SUCCESS: 'icon-success',
  WARNING: 'icon-warning',
  ERROR: 'icon-error',
}

export default {
  url: ICON_URL,
  names: ICON_NAMES,
}
