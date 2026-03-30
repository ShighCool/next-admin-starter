/**
 * 自动化项目截图脚本
 *
 * 使用方法：
 * 1. 安装依赖: npm install playwright
 * 2. 安装浏览器: npx playwright install chromium
 * 3. 启动项目: npm run dev
 * 4. 运行截图脚本: node scripts/screenshot.js
 */

const { chromium } = require('playwright');

// 截图配置
const CONFIG = {
  viewport: { width: 1920, height: 1080 },
  baseUrl: 'http://localhost:7001',
  outputDir: './screenshots',
  screenshotOptions: {
    fullPage: true,
    animations: 'disabled',
    type: 'png',
  },
};

// 需要截图的页面
const PAGES = [
  {
    name: 'login',
    url: '/login',
    title: '登录页面',
    description: '用户登录界面',
    requireAuth: false,
  },
  {
    name: 'home',
    url: '/',
    title: '主界面',
    description: '展示项目的整体布局',
    requireAuth: true,
  },
  {
    name: 'dashboard',
    url: '/dashboard',
    title: '仪表板',
    description: '数据统计和图表展示',
    requireAuth: true,
  },
  {
    name: 'users',
    url: '/examples/users',
    title: '用户管理',
    description: '用户列表和管理功能',
    requireAuth: true,
  },
  {
    name: 'analytics',
    url: '/analytics',
    title: '数据分析',
    description: '数据分析和报表',
    requireAuth: true,
  },
  {
    name: 'hook-market',
    url: '/hook-market',
    title: 'Hook 市场',
    description: 'Hook 市场功能展示',
    requireAuth: true,
  },
];

// 登录凭据
const LOGIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin123',
};

// 延迟函数
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// 创建截图目录
async function ensureOutputDir() {
  const fs = require('fs');
  const path = require('path');

  const outputDir = path.resolve(CONFIG.outputDir);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
    console.log(`✅ 创建截图目录: ${outputDir}`);
  }
}

// 自动登录
async function login(page) {
  console.log('\n🔐 正在登录...');

  try {
    // 访问登录页面
    await page.goto(`${CONFIG.baseUrl}/login`, {
      waitUntil: 'networkidle',
      timeout: 30000,
    });

    // 等待登录表单加载
    await page.waitForSelector('input[name="username"]', { timeout: 5000 });

    // 填写用户名
    await page.fill('input[name="username"]', LOGIN_CREDENTIALS.username);

    // 填写密码
    await page.fill('input[name="password"]', LOGIN_CREDENTIALS.password);

    // 点击登录按钮
    await page.click('button[type="submit"]');

    // 等待登录完成（跳转到首页或显示成功消息）
    await page.waitForURL('/', { timeout: 10000 });

    console.log('   ✅ 登录成功');
    return true;
  } catch (error) {
    console.error(`   ❌ 登录失败: ${error.message}`);
    return false;
  }
}

// 截取单个页面
async function capturePage(browser, pageInfo, isLoggedIn) {
  const page = await browser.newPage();

  try {
    console.log(`\n📸 正在截图: ${pageInfo.title}`);
    console.log(`   URL: ${pageInfo.url}`);
    console.log(`   需要登录: ${pageInfo.requireAuth ? '是' : '否'}`);

    // 设置视口
    await page.setViewportSize(CONFIG.viewport);

    // 如果需要登录且已登录，复制登录状态
    if (pageInfo.requireAuth && isLoggedIn) {
      await page.context().addCookies([
        {
          name: 'token',
          value: 'mock-token-123456',
          domain: 'localhost',
          path: '/',
        },
      ]);
    }

    // 访问页面
    await page.goto(`${CONFIG.baseUrl}${pageInfo.url}`, {
      waitUntil: 'networkidle',
      timeout: 30000,
    });

    // 等待页面加载完成
    await delay(2000);

    // 等待主要内容加载
    await page.waitForSelector('body', { timeout: 5000 });

    // 截图
    const outputPath = `${CONFIG.outputDir}/${pageInfo.name}.png`;
    await page.screenshot({
      path: outputPath,
      ...CONFIG.screenshotOptions,
    });

    console.log(`   ✅ 截图保存: ${outputPath}`);

    // 生成缩略图
    await page.setViewportSize({ width: 800, height: 450 });
    const thumbPath = `${CONFIG.outputDir}/${pageInfo.name}-thumb.png`;
    await page.screenshot({
      path: thumbPath,
      ...CONFIG.screenshotOptions,
      fullPage: false,
    });
    console.log(`   ✅ 缩略图保存: ${thumbPath}`);

    return { success: true, page: pageInfo };
  } catch (error) {
    console.error(`   ❌ 截图失败: ${error.message}`);
    return { success: false, page: pageInfo, error };
  } finally {
    await page.close();
  }
}

// 主函数
async function main() {
  console.log('🚀 开始自动化截图...\n');
  console.log(`📊 需要截图的页面数: ${PAGES.length}`);
  console.log(`🖼️  分辨率: ${CONFIG.viewport.width}x${CONFIG.viewport.height}`);
  console.log(`🌐 基础URL: ${CONFIG.baseUrl}`);

  // 确保输出目录存在
  await ensureOutputDir();

  // 检查服务器是否运行
  console.log('\n🔍 检查服务器状态...');
  try {
    const testBrowser = await chromium.launch();
    const testPage = await testBrowser.newPage();
    await testPage.goto(CONFIG.baseUrl, { timeout: 5000 });
    await testBrowser.close();
    console.log('✅ 服务器运行正常\n');
  } catch (error) {
    console.error('❌ 服务器未运行或无法访问！');
    console.error('💡 请先运行: npm run dev');
    console.error('💡 然后等待服务器启动完成后再运行此脚本');
    process.exit(1);
  }

  // 启动浏览器
  const browser = await chromium.launch({
    headless: true,
  });

  // 创建一个页面用于登录
  const loginPage = await browser.newPage();

  try {
    // 尝试登录
    const isLoggedIn = await login(loginPage);

    if (!isLoggedIn) {
      console.error('❌ 登录失败，无法截取需要登录的页面');
      console.error('💡 请确保登录凭据正确');
      process.exit(1);
    }

    // 逐个截图
    const results = [];
    for (const pageInfo of PAGES) {
      const result = await capturePage(browser, pageInfo, isLoggedIn);
      results.push(result);

      // 等待一段时间，避免过快请求
      await delay(1000);
    }

    // 输出结果统计
    console.log('\n📊 截图结果统计:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    const successCount = results.filter((r) => r.success).length;
    const failCount = results.filter((r) => !r.success).length;

    console.log(`✅ 成功: ${successCount}/${PAGES.length}`);
    console.log(`❌ 失败: ${failCount}/${PAGES.length}`);

    if (failCount > 0) {
      console.log('\n❌ 失败的页面:');
      results
        .filter((r) => !r.success)
        .forEach((r) => {
          console.log(`   - ${r.page.title} (${r.page.url})`);
          console.log(`     错误: ${r.error.message}`);
        });
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎉 截图完成！');
    console.log(`📁 截图保存在: ${CONFIG.outputDir}`);

    if (failCount === 0) {
      console.log('\n✨ 所有截图都已成功生成！');
      console.log('💡 现在可以将这些截图上传到 GitHub 了');
    } else {
      console.log('\n⚠️  部分截图失败，请检查错误信息');
    }
  } finally {
    await loginPage.close();
    await browser.close();
  }
}

// 运行主函数
main().catch((error) => {
  console.error('❌ 发生错误:', error);
  process.exit(1);
});
