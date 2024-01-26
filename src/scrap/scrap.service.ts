import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import * as playwright from 'playwright';

const args = [
    "--disable-gpu", // usually not available on containers
    "--disable-dev-shm-usage", // This flag is necessary to avoid running into issues with Docker’s default low shared memory space of 64MB. Chrome will write into /tmp instead
    "--disable-setuid-sandbox",
    "--no-sandbox",
]

const options: any = {
    args: args,
    headless: 'new',
}

@Injectable()
export class ScrapService {
    async scrap() {
        const browser = await puppeteer.launch(options);
        const page = await browser.newPage();

        await page.setDefaultNavigationTimeout(0);

        await page.goto('https://apps.hhs.texas.gov/LTCSearch/namesearch.cfm', {
            waitUntil: 'load',
            timeout: 0
        });

        await page.type('input[name="searchterm"]', 'THE ISLE AT RAIDER RANCH');

        // await page.select('select[name="factype"]', 'ALF,all');

        console.log('Before clicking search button');
        page.click('button[type="submit"]')
        await page.waitForNavigation({ waitUntil: 'domcontentloaded' })
        console.log('After clicking search button');

        try {
            console.log('Before waiting for selector');
            await page.waitForSelector('table.sortabletable tbody tr', { timeout: 60000 }); // 60 seconds timeout
            console.log('After waiting for selector');

            const tableData = await page.$$eval('table.sortabletable tbody tr', rows => {
                const data = [];
                rows.forEach(row => {
                    const provider = row.querySelector('td:nth-child(1)').textContent.trim();
                    const address = row.querySelector('td:nth-child(2)').textContent.trim();
                    const city = row.querySelector('td:nth-child(3)').textContent.trim();
                    const zipCode = row.querySelector('td:nth-child(4)').textContent.trim();
                    const county = row.querySelector('td:nth-child(5)').textContent.trim();
                    const type = row.querySelector('td:nth-child(6)').textContent.trim();
                    const rowData = { provider, address, city, zipCode, county, type };
                    data.push(rowData);
                });
                return data;
            });

            console.log('Table Data:', tableData);
        } catch (error) {
            console.error('Error:', error.message);
        } finally {
            await browser.close();
        }
    }

    async playwrightScrap() {
        const browser = await playwright.chromium.launch();
        const context = await browser.newContext();
        const page = await context.newPage();

        await page.goto('https://apps.hhs.texas.gov/LTCSearch/namesearch.cfm');


        await page.type('input[name="searchterm"]', 'THE ISLE AT RAIDER RANCH');


        console.log('Before clicking search button');
        await Promise.all([            
            page.click('button[type="submit"]'),
            page.waitForNavigation({waitUntil: 'domcontentloaded' }), // Wait for navigation to complete
        ]);
        console.log('After clicking search button');

        console.log('Before waiting for table');
        const tableSelector = 'table.sortabletable tbody tr';
        await page.waitForSelector(tableSelector, { state: 'visible', timeout: 10000 }); // Increase the timeout if needed
        console.log('After waiting for table');

        const tableData = await page.evaluate(() => {
            const rows = document.querySelectorAll('table.sortabletable tbody tr');
            const data = [];
            rows.forEach(row => {
                const provider = row.querySelector('td:nth-child(1)').textContent.trim();
                const address = row.querySelector('td:nth-child(2)').textContent.trim();
                const city = row.querySelector('td:nth-child(3)').textContent.trim();
                const zipCode = row.querySelector('td:nth-child(4)').textContent.trim();
                const county = row.querySelector('td:nth-child(5)').textContent.trim();
                const type = row.querySelector('td:nth-child(6)').textContent.trim();
                const rowData = { provider, address, city, zipCode, county, type };
                data.push(rowData);
            });
            return data;
        });

        console.log('Table Data:', tableData);

        await context.close();
    }

}
