
   const {Builder, By, Key, until} = require('selenium-webdriver');
   const { Options } = require('selenium-webdriver/chrome');

   const screen = {
      width: 1920,
      height: 1080,
    };

    (async function parser() {
      /**
       * Параметры отключения интерфейса Chrome:
       *      .addArguments(["--no-sandbox"]).headless()
       * Параметр режима инкогнито:
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

        // demo data
        const req = {
          body: {
            classes: 1,
            color: 1,
            contries: [
              'GE', 'AE', 'JM'
            ]
          }
        };

        await driver.navigate().to('https://madrid.wipo.int/feecalcapp/home.xhtml');

        await driver.executeScript('Array.from(document.styleSheets).forEach(sheet => sheet.disabled = true)');

        await driver.wait(until.elementLocated(By.id('feeForm:j_idt127:input'), 10000));
        await driver.executeScript(`
            document.getElementById("feeForm:j_idt127:input").value = 'EN';
            PrimeFaces.ab({s:document.getElementById("feeForm:j_idt127:input"),e:"change",p:"feeForm:j_idt127:input",u:"feeForm feeDetailForm"});
        `);

        // await wait(2000);
        await driver.wait(until.elementLocated(By.id('feeForm:j_idt203:input'), 10000));
        await driver.executeScript(`
            const el = document.getElementById("feeForm:j_idt203:input");

            el.value = 'RU';
            let changeEvent = new Event('change'); 
	          el.dispatchEvent(changeEvent); 
        `);

        await wait(1000);
        await driver.wait(until.elementLocated(By.id('feeForm:j_idt224:input'), 10000));
        await driver.executeScript(`
            const el = document.getElementById("feeForm:j_idt224:input");

            el.value = '${req.body.classes}';
            let changeEvent = new Event('change'); // создаем событие
	        el.dispatchEvent(changeEvent); // имитируем клик на кнопку
        `);

        await wait(1000);
        const checkBox = await driver.wait(until.elementLocated(By.id('feeForm:j_idt263:input'), 10000));
        if (req.body.color) {
          await checkBox.click();
        }

        await wait(1500);
        await driver.executeScript(`
            const lables = document.querySelectorAll(".designationCell > .cb-cp");
            
            lables.forEach(item => {
              const input = item.parentNode.querySelector("input");

              input.setAttribute("data-code", item.textContent)
            })
        `);

        req.body.contries.forEach(async item => {
          const contry = await driver.findElement(By.css('input[data-code="' + item + '"]'));
          
          await contry.click();
          await wait(2000);
        });

        await wait(3000);
        await driver.executeScript(`
            const button = document.getElementById("feeForm:j_idt805");
            let clickEvent = new Event('click'); 

	          button.dispatchEvent(clickEvent); 
        `);

        await driver.wait(until.elementLocated(By.id('feeDetailForm:j_idt880'), 30000));

        const free = await driver.findElement(By.id('feeDetailForm:j_idt880'));
        
        // if (req.body.contries.length > 1) {
        //     const parties = await driver.findElement(By.id('feeDetailForm:j_idt946'));
        // } else {
        //     const parties = null;
        // }

        // const additional = await driver.findElement(By.id('feeDetailForm:j_idt1012'));
        const total = await driver.findElement(By.id('feeDetailForm:j_idt1144'));

        const data = {
          basic: await free.getText(),
          // parties: parties ? await parties.getText() : null,
          // additional: await additional.getText(),
          total: await total.getText()
        };

        console.log(data);

        async function wait(ms = 10000) {
          try {
            await driver.wait(until.elementLocated(By.css('.promotions_ERROR')), ms);        
        } catch {}
        }


      } catch (e) {

        console.log(e);

        // await driver.quit();

      } finally {

        // await driver.quit();

      }
    })();