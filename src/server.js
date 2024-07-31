const Koa = require("koa");
const path = require("path");
const koaStatic = require("koa-static");
const Router = require("koa-router");
const bodyParser = require("koa-bodyparser");
const { historyApiFallback } = require('koa2-connect-history-api-fallback');
const upload = require("./controller/upload");
const multer = require("@koa/multer");

const app = new Koa();
const router = new Router();

app.use(bodyParser({}));

app.use(async (ctx, next) => {
  try {
    await next();

    if (ctx.status === 404) {
      ctx.throw(404);
    }
  } catch (err) {
    const status = err.status || 500;
    if (status === 404) {
      ctx.body = "404";
    } else {
      ctx.body = "500";
    }
  }
});

// router.get("/", (ctx) => {
//   ctx.body = "简单静态服务器";
// });

router.get("/err", (ctx) => {
  throw new Error();
});

router.post("/upload", multer().single("file"), upload);

app.use(router.routes()).use(router.allowedMethods());

app.use(historyApiFallback());

app.use(
  koaStatic(path.resolve(__dirname, "../static"), {
    setHeaders(res, path, stats) {
      if (path.indexOf("mjs") > -1) {
        res.setHeader("Content-Type", "text/javascript");
      }
    },
  })
);

const port = 7899;

console.log(`listening at port: http://localhost:${port}`);

app.listen(port);
