# json2api

Turns JSON files into a simple API.

```bash
# run downloaded repo
$ deno run --allow-net --allow-read=data --allow-env app.ts

# run without downloading
$ deno run --allow-net --allow-read=data --allow-env https://denopkg.com/The-Noah/json2api/app.ts
```

Serves JSON files in `data` under their filename, and supports getting a specific item by id or array index.

`/cats` will return `data/cats.json`.

`/cats/1/` will return object with `id: 1` in `data/cats.json`.