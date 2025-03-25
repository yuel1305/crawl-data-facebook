const puppeteer = require("puppeteer");
//bán ra
const ExcelJS = require("exceljs");

function getLastCharacter(str) {
  // Kiểm tra nếu chuỗi không rỗng
  if (str.length === 0) {
    return ""; // Nếu chuỗi rỗng, trả về chuỗi rỗng
  }

  return str.charAt(str.length - 1); // Lấy ký tự cuối cùng
}

function removeFirst4Chars(str) {
  // Kiểm tra nếu chuỗi có ít hơn 7 ký tự
  if (str.length <= 4) {
    return ""; // Nếu chuỗi có ít hơn 7 ký tự, trả về chuỗi rỗng
  }

  // Trả về chuỗi bắt đầu từ vị trí thứ 8 (chỉ số 7), bỏ qua 7 ký tự đầu
  return str.slice(4);
}

function removeFirst7Chars(str) {
  // Kiểm tra nếu chuỗi có ít hơn 7 ký tự
  if (str.length <= 7) {
    return ""; // Nếu chuỗi có ít hơn 7 ký tự, trả về chuỗi rỗng
  }

  // Trả về chuỗi bắt đầu từ vị trí thứ 8 (chỉ số 7), bỏ qua 7 ký tự đầu
  return str.slice(7);
}

function removeFirst9Chars(str) {
  // Kiểm tra nếu chuỗi có ít hơn 7 ký tự
  if (str.length <= 9) {
    return ""; // Nếu chuỗi có ít hơn 7 ký tự, trả về chuỗi rỗng
  }

  // Trả về chuỗi bắt đầu từ vị trí thứ 8 (chỉ số 7), bỏ qua 7 ký tự đầu
  return str.slice(9);
}

(async () => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Sheet 1");

  const row1 = [
    "Mẫu số",
    "Ký hiệu",
    "Số",
    "MCCQT",
    "Ngày-Tháng-Năm",
    "Tên người bán",
    "Mã số thuế",
    "Địa chỉ",
    "Điện thoại",
    "STK",
    "Tên người mua",
    "Họ tên người mua",
    "Mã số thuế",
    "Địa chỉ",
    "Số tài khoản",
    "Hình thức thanh toán",
    "Đơn vị tiền tệ",
    "Số bảng kê",
    "Ngày bảng kê",
    "STT",
    "Tính chất",
    "Tên hàng hóa, dịch vụ ",
    "Đơn vị tính",
    "Số lượng",
    "Đơn giá",
    "Chiết khấu",
    "Thuế suất",
    "Thành tiền chưa có thuế GTGT",
  ];
  worksheet.addRow(row1);

  try {
    const browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
    });

    const page = await browser.newPage();

    const screenWidth = 1500;
    const screenHeight = 1080;

    await page.setViewport({
      width: screenWidth,
      height: screenHeight,
    });

    await page.goto("https://hoadondientu.gdt.gov.vn/");

    console.log("Browser window is now maximized to full screen.");

    await page.waitForSelector(".ant-modal-close");

    await page.click(".ant-modal-close");
    console.log("Clicked on the close button.");

    await page.waitForSelector(".ant-col.home-header-menu-item");

    const menuItems = await page.$$(".ant-col.home-header-menu-item");

    if (menuItems.length >= 6) {
      await menuItems[5].click();
      console.log("Clicked on the 6th menu item.");
    } else {
      console.log("There are not enough menu items to click the 6th one.");
    }
    await page.waitForSelector("#username");

    await page.type("#username", "0801420951");

    await page.waitForSelector("#password");

    await page.type("#password", "Alocomhd@123");

    await page.evaluate(
      () => new Promise((resolve) => setTimeout(resolve, 20000))
    );
    console.log("Waited for 20 seconds.");

    await page.click('[type="submit"]');
    // console.log("Clicked the  button.");

    await page.waitForSelector(".styles__PageIndex-sc-eevgvg-3.fWbeIm");
    await page.evaluate(
      () => new Promise((resolve) => setTimeout(resolve, 3000))
    );
    const numPage = await page.$eval(
      ".styles__PageIndex-sc-eevgvg-3.fWbeIm",
      (el) => el.innerText.trim()
    );

    // In ra nội dung đã lấy được
    // console.log("page:", Number(getLastCharacter(numPage)));

    for (let i = 0; i < Number(getLastCharacter(numPage)); i++) {
      await page.evaluate(
        () => new Promise((resolve) => setTimeout(resolve, 3000))
      );

      await page.waitForSelector(".ant-table-row-level-0");

      const rows = await page.$$(".ant-table-row-level-0");
      for (const row of rows) {
        // const rowTest = [];

        await row.click();
        // console.log("Clicked on a row.");

        const buttons = await page.$$(
          "button.ant-btn.ButtonAnt__IconButton-sc-p5q16s-1.fRqwwC.ant-btn-icon-only"
        );

        if (buttons.length > 0) {
          await buttons[0].click();

          await page.waitForSelector(".res-tb");

          const tdTexts = await page.$$eval(".res-tb td", (elements) =>
            elements.map((el) => el.innerText.trim())
          );
          const tdTextsWithoutLast19 = tdTexts.slice(0, tdTexts.length - 19);

          await page.waitForSelector(".code-ms");

          const codeMsTexts = await page.$$eval(".code-ms", (elements) =>
            elements.map((el) => el.innerText.trim())
          );

          await page.waitForSelector(".day .di-value");

          const diValueTexts = await page.$$eval(".day .di-value", (elements) =>
            elements.map((el) => el.innerText.trim())
          );

          await page.waitForSelector(".list-fill-out .di-value");

          const diValueTexts1 = await page.$$eval(
            ".list-fill-out .di-value",
            (elements) => elements.map((el) => el.innerText.trim())
          );

          let currentGroup = [];

          tdTextsWithoutLast19.forEach((text, index) => {
            currentGroup.push(text);

            if (currentGroup.length === 9) {
              let rowTest = [];

              codeMsTexts.forEach((text, index) => {
                if (index % 3 == 0) rowTest.push(removeFirst7Chars(text));
                if (index % 3 == 1) rowTest.push(removeFirst9Chars(text));
                if (index % 3 == 2) rowTest.push(removeFirst4Chars(text));

                // console.log(`Element ${index + 1}: ${text}`);
              });

              let string = "";

              diValueTexts.forEach((text, index) => {
                if (index === 3) {
                  rowTest.push(text);
                } else {
                  string += text;
                  if (index < 2) {
                    string += "-";
                  }
                }
                // console.log(`Element ${index + 1}: ${text}`);
              });

              if (string) {
                rowTest.push(string);
              }

              diValueTexts1.forEach((text, index) => {
                rowTest.push(text);
                // console.log(`Element ${index + 1}: ${text}`);
              });

              currentGroup.forEach((groupText, groupIndex) => {
                rowTest.push(groupText);
                // console.log(`Group Element ${groupIndex + 1}: ${groupText}`);
              });

              worksheet.addRow(rowTest);

              currentGroup = [];
            }
          });

          await page.waitForSelector(".ant-modal-close");

          await page.click(".ant-modal-close");
          console.log("Clicked on the close button.");

          // console.log("Clicked on the first button inside the row.");
        } else {
          console.log("No buttons found inside the row.");
        }
      }
      await page.waitForSelector(
        "button.ant-btn.ButtonAnt__Button-sc-p5q16s-0.kNMAep.ant-btn-primary.ant-btn-icon-only"
      );

      const buttons = await page.$$(
        "button.ant-btn.ButtonAnt__Button-sc-p5q16s-0.kNMAep.ant-btn-primary.ant-btn-icon-only"
      );
      await buttons[1].click();
      await page.evaluate(
        () => new Promise((resolve) => setTimeout(resolve, 3000))
      );
    }

    await workbook.xlsx.writeFile("output2.xlsx");
  } catch (error) {
    console.error(error);
  }
})();
