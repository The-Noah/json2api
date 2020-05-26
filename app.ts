import {Application, Router} from "https://deno.land/x/oak/mod.ts";

const PORT = parseInt(Deno.env.get("PORT") || "") || 3000;

const app = new Application();
const router = new Router();

const getData = async (name: string) => {
  try{
    return JSON.parse(await Deno.readTextFile(`data/${name}.json`));
  }catch(err){
    if(err instanceof Deno.errors.NotFound){
      return {error: `${name} not found`};
    }

    console.error("JSON load error", err);
    return [];
  }
};

router
  .get("/", (ctx) => {
    ctx.response.body = {status: "OK"};
  })
  .get("/:name", async (ctx) => {
    if(!ctx.params || !ctx.params.name){
      ctx.response.body = {error: "missing data"};
      return;
    }

    ctx.response.body = await getData(ctx.params.name);
  })
  .get("/:name/:id", async (ctx) => {
    if(!ctx.params || !ctx.params.name || !ctx.params.id){
      ctx.response.body = {error: "missing data"};
      return;
    }

    const data = await getData(ctx.params.name);
    const error = {error: `could not find ${ctx.params.id} in ${ctx.params.name}`}

    try{
      ctx.response.body = data[ctx.params.id] || data.find((item: any) => item?.id === ctx.params.id) || error;
    }catch(err){
      ctx.response.body = error;
    }
  });

app.use(async (ctx, next) => {
  await next();
  console.log(`${ctx.request.method} ${ctx.request.url}`);
});

app.use(router.routes());
app.use(router.allowedMethods());

app.listen({port: PORT});
console.log(`running at http://localhost:${PORT}`);
