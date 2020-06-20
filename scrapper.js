const puppeteer = require('puppeteer')
const random_useragent = require('random-useragent')
const { url } = require('./config')
const fs = require('fs')

;(async () => {
	const browser = await puppeteer.launch({ headless: true })
	const page = await browser.newPage()
	let articles = {
		articulos: [],
	}

	await page.setDefaultTimeout(10000)
	await page.setViewport({ width: 1200, height: 1200 })
	await page.goto(url)
	await page.goto(url, { waitUntil: 'networkidle2' })
	await page.setUserAgent(random_useragent.getRandom())
	await page.waitForSelector('.js-load-more')
	await page.click(
		'#wrapper > div.page > div.page-content > div > main > section.collection.collection-article-list.has-load-more > footer > div'
	)
	await page.waitFor(2000)
	await page.click(
		'#wrapper > div.page > div.page-content > div > main > section.collection.collection-article-list.has-load-more > footer > div'
	)
	await page.waitFor(2000)
	await page.click(
		'#wrapper > div.page > div.page-content > div > main > section.collection.collection-article-list.has-load-more > footer > div'
	)
	await page.waitFor(2000)
	/*	const data = await page.evaluate(() => {
		const articles = document.querySelectorAll('article')
		const urls = Array.from(articles).map((article) => article)
		return urls
	})*/
	const links = await page.$$eval('h4 > a', (links) =>
		links.map((link) => link.href)
	)
	const cleanLinks = links.filter((item) => !item.includes('video.foxnews'))

	const info = async (subUrl) => {
		const subBrowser = await puppeteer.launch({ headless: true })
		const articlePage = await subBrowser.newPage()
		await articlePage.goto(subUrl)
		await articlePage.goto(subUrl, { waitUntil: 'networkidle2' })

		try {
			const title = await articlePage.$eval('.headline', (e) => e.textContent)
			const body = await articlePage.$$eval(
				'#wrapper > div.page-content > div.row.full > main > article > div > div > div.article-body > p',
				(parrafos) => parrafos.map((parrafo) => parrafo.textContent)
			)
			await subBrowser.close()

			return { title, body }
		} catch (e) {
			await subBrowser.close()
			console.error(e)
		}
	}
	for (const link of cleanLinks) {
		console.log(link)
		const article = await info(link)
		articles = { ...articles, articulos: articles.articulos.concat(article) }
	}

	fs.writeFile(
		'articles.json',
		JSON.stringify(articles),
		'utf8',
		(err, data) => {
			if (err) {
				console.error(err)
			} else {
				console.log('created!')
			}
		}
	)
	await browser.close()
})().catch((err) => {
	console.error(err)
	process.exit(1)
})
