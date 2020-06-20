const puppeteer = require('puppeteer')
const random_useragent = require('random-useragent')
const { url } = require('./config')

;(async () => {
	const browser = await puppeteer.launch({ headless: true })
	const page = await browser.newPage()

	await page.setDefaultTimeout(100000)
	await page.setViewport({ width: 1200, height: 800 })
	await page.goto(url)
	await page.setUserAgent(random_useragent.getRandom())
	await page.waitFor(6000)
	/*	const data = await page.evaluate(() => {
		const articles = document.querySelectorAll('article')
		const urls = Array.from(articles).map((article) => article)
		return urls
	})*/
	const options = await page.$$eval('.cd__headline-text', (options) =>
		options.map((option) => option.textContent)
	)
	console.log(options)
	await browser.close()
})().catch((err) => {
	console.error(err)
	process.exit(1)
})
