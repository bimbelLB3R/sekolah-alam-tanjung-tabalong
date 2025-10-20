// untuk dilokal pake pupeter saja
// import puppeteer from "puppeteer";

// export async function POST(req) {
//   const { html, filename } = await req.json();

//   const browser = await puppeteer.launch({
//     headless: "new",
//     args: ["--no-sandbox", "--disable-setuid-sandbox"],
//   });

//   const page = await browser.newPage();
//   await page.setContent(html, { waitUntil: "networkidle0" });

//   const pdf = await page.pdf({
//     format: "A4",
//     printBackground: true,
//   });

//   await browser.close();

//   return new Response(pdf, {
//     status: 200,
//     headers: {
//       "Content-Type": "application/pdf",
//       "Content-Disposition": `attachment; filename="${filename}.pdf"`,
//     },
//   });
// }


// untuk divercel (masih gagal)
// import chromium from "@sparticuz/chromium";
// import puppeteer from "puppeteer-core";

// export const maxDuration = 60;
// export const dynamic = "force-dynamic";

// export async function POST(req) {
//   try {
//     const { html, filename } = await req.json();

//     const executablePath = await chromium.executablePath;

//     const browser = await puppeteer.launch({
//       args: chromium.args,
//       defaultViewport: chromium.defaultViewport,
//       executablePath,
//       headless: chromium.headless,
//     });

//     const page = await browser.newPage();
//     await page.setContent(html, { waitUntil: "networkidle0" });

//     const pdf = await page.pdf({
//       format: "A4",
//       printBackground: true,
//       margin: { top: "20mm", bottom: "20mm", left: "15mm", right: "15mm" },
//     });

//     await browser.close();

//     return new Response(pdf, {
//       headers: {
//         "Content-Type": "application/pdf",
//         "Content-Disposition": `attachment; filename="${filename}.pdf"`,
//       },
//     });
//   } catch (error) {
//     console.error("PDF generation error:", error);
//     return new Response(JSON.stringify({ error: error.message }), {
//       status: 500,
//     });
//   }
// }
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const { html, filename } = await req.json();

    const isLocal = !process.env.VERCEL;
    let browser;

    if (isLocal) {
      const localPuppeteer = await import("puppeteer");
      browser = await localPuppeteer.default.launch({
        headless: "new",
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });
    } else {
      browser = await puppeteer.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath(),
        headless: chromium.headless,
      });
    }

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "20mm", bottom: "20mm", left: "15mm", right: "15mm" },
    });

    await browser.close();

    return new Response(pdf, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}.pdf"`,
      },
    });
  } catch (error) {
    console.error("PDF generation error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}


