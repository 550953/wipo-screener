
   import { Builder, By, Key, until } from 'selenium-webdriver';
   import { Options } from 'selenium-webdriver/chrome.js';

   const screen = {
      width: 1920,
      height: 1080,
    };

    async function parser(req) {
      /**
       *      .addArguments(["--no-sandbox"]).headless()
       *      .addArguments(["--no-sandbox", "--incognito"])
       */

      const driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(new Options().addArguments([
          '--no-sandbox',
          '-–disable-gpu',
        ])
          .headless()
          .windowSize(screen)).build();

      try {

        await driver.navigate().to('https://madrid.wipo.int/feecalcapp/home.xhtml');

        await driver.wait(until.elementLocated(By.id('feeForm:j_idt127:input'), 10000));
        await driver.executeScript(`
            document.getElementById("feeForm:j_idt127:input").value = 'EN';
            PrimeFaces.ab({s:document.getElementById("feeForm:j_idt127:input"),e:"change",p:"feeForm:j_idt127:input",u:"feeForm feeDetailForm"});
        `);

        await driver.wait(until.elementLocated(By.id('feeForm:j_idt203:input'), 10000));
        await driver.executeScript(`
            const el = document.getElementById("feeForm:j_idt203:input");

            el.value = 'RU';
            let changeEvent = new Event('change'); 
	          el.dispatchEvent(changeEvent); 
        `);

        await wait(1000);
        await driver.executeScript(`
            const el = document.getElementById("feeForm:j_idt224:input");

            el.value = '${req.classes}';
            let changeEvent = new Event('change'); // создаем событие
	        el.dispatchEvent(changeEvent); // имитируем клик на кнопку
        `);

        await wait(2000);
        const checkBox = await driver.wait(until.elementLocated(By.id('feeForm:j_idt263:input'), 10000));
        if (req.color) {
          await checkBox.click();
        }

        await wait(3000);

        for (const item of req.contries) {
            await driver.executeScript(`
                const lables = document.querySelectorAll(".designationCell > .cb-cp");
                
                lables.forEach(item => {
                  const input = item.parentNode.querySelector("input");
    
                  input.setAttribute("data-code", item.textContent)
                })
            `);

            const contry = await driver.findElement(By.css('input[data-code="' + item + '"]'));
          
            await contry.click();
            await wait(2000);
        }

        await driver.executeScript(`
            const button = document.getElementById("feeForm:j_idt805");
            let clickEvent = new Event('click'); 

	          button.dispatchEvent(clickEvent); 
        `);

        const data = {};

        await driver.wait(until.elementLocated(By.css('div[id="feeDetailForm:j_idt880"]'), 10000));

        try {
            const fee = await driver.findElement(By.css('div[id="feeDetailForm:j_idt880"]'));

            data.basic = await fee.getText();
        } catch {
            data.basic = 0;
        }

        try {
            const parties = await driver.findElement(By.css('div[id="feeDetailForm:j_idt946"]'));
      
            data.parties = await parties.getText();
        } catch {
            data.parties = 0;
        }

        try {
            const additional = await driver.findElement(By.css('div[id="feeDetailForm:j_idt1012"]'));
            
            data.additional = await additional.getText();
        } catch {
            data.additional = 0;
        }

        try {
            const total = await driver.findElement(By.css('div[id="feeDetailForm:j_idt1144"]'));

            data.total = await total.getText();
        } catch {
            data.total = 0;
        }

        return data;

        async function wait(ms = 10000) {
          try {
            await driver.wait(until.elementLocated(By.css('.promotions_ERROR')), ms);        
        } catch {}
        }


      } catch (e) {
        console.log(e);
        await driver.quit();
      } finally {
        await driver.quit();
      }
    };

    export default parser;