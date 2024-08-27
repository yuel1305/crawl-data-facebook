const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const axios = require("axios");
const fs = require("fs/promises");

const password = require("./config").password;

const scrapeInfiniteScroll = async (page) => {
  while (true) {
    pre = await page.evaluate("document.body.scrollHeight");
    // console.log("pre", pre);
    await page.evaluate("window.scrollTo(0,document.body.scrollHeight)");
    // await page.waitForFunction(`document.body.scrollHeight > ${pre}`);
    // await new Promise((resolve) => setTimeout(resolve, 1000));
  }
};

(async () => {
  try {
    const browser = await puppeteer.launch({
      headless: false,
    });
    const page = await browser.newPage();
    await page.goto("https://www.facebook.com");
    await page.waitForSelector("#email");
    await page.type("#email", "your-email");
    await page.type("#pass", password);
    await page.click(`[type="submit"]`);
    await page.waitForNavigation();
    await console.log("yay we are in facebook logged in");
    await page.goto("crawl-this-web");
    // const photos = await page.$$eval("img", (imgs) => {
    //   return imgs.map((x) => x.src);
    // });
    // let index = 0;
    // for (const photo of photos) {
    //   const imagePage = await page.goto(photo);

    //   // Tạo tên file bằng cách sử dụng chỉ số index
    //   const filename = `image_${index}.png`;

    //   // Lưu ảnh vào file
    //   await fs.writeFile(filename, await imagePage.buffer());
    //   index++;
    // }

    // let previousHeight;
    // let photos = [];
    // let index = 0;

    // while (true) {
    //   // Cuộn trang xuống cuối
    //   //   previousHeight = await page.evaluate(() => {
    //   //     return document.body.scrollHeight;
    //   //   });
    //   //   console.log("pre", previousHeight);
    //   await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    //   // Lấy dữ liệu mới (ảnh)
    //   const newPhotos = await page.$$eval("img", (imgs) =>
    //     imgs.map((img) => img.src)
    //   );

    //   // Kiểm tra xem có dữ liệu mới không
    //   if (newPhotos.length > photos.length) {
    //     // Thêm dữ liệu mới vào mảng photos
    //     photos = newPhotos;

    //     // Lưu từng ảnh mới
    //     for (; index < photos.length; index++) {
    //       const photo = photos[index];
    //       const imagePage = await page.goto(photo);
    //       const filename = `image_${index}.png`;
    //       await fs.writeFile(filename, await imagePage.buffer());
    //       console.log(`Saved ${filename}`);
    //     }
    //   }
    //   //   const currentHeight = await page.evaluate(() => {
    //   //     return document.body.scrollHeight;
    //   //   });
    //   //   console.log("cur", currentHeight);
    //   //   if (currentHeight === previousHeight) {
    //   //     break;
    //   //   }
    // }

    // await page.screenshot({
    //   path: "test.png",
    // });

    await scrapeInfiniteScroll(page);

    // const names = await page.evaluate(() => {
    //   return Array.from(document.querySelectorAll("[dir='auto']")).map(
    //     (x) => x.textContent
    //   );
    // });
    // console.log("name", names);
    // await fs.writeFile("names.txt", names.join("\r\n"));
  } catch (error) {
    console.error(error);
  }
})();
