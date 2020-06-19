const puppeteer = require('puppeteer')
const random_useragent = require('random-useragent')
const { url } = require('./config')

;(async () => {
	const browser = await puppeteer.launch({ headless: false })
	const page = await browser.newPage()

	await page.setDefaultTimeout(10000)
	await page.setViewport({ width: 1200, height: 800 })
	await page.setUserAgent(random_useragent.getRandom())
	await browser.close()
})().catch((err) => {
	console.error(err)
	process.exit(1)
})
