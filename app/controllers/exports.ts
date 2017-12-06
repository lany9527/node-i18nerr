import * as fs from 'fs-extra';
import * as path from 'path';
import { getRowList } from './row';
import { getTable } from './table';

async function getRawFile(tableId: string, ext: string) {
  const result = await getRowList({
    limit: 100,
    keyJson: JSON.stringify({ tid: tableId })
  });

  const table = await getTable(tableId);

  const data = result.data;

  // default transform
  let transformer = function(data: any, tableName: string) {
    return `Can not transform ${ext} file`;
  };

  try {
    transformer = require(`./transformer/${ext}`);
  } catch (err) {
    transformer = require(`./transformer/default`);
  }

  transformer = transformer['default'] ? transformer['default'] : transformer;

  return transformer(data, table.name);
}

export async function rawHandler(req, res) {
  const tid = req.params.tid;
  const ext = req.params.ext;
  try {
    const raw: string = await getRawFile(tid, ext);

    if (!!req.query.format) {
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.render('code', {
        code: raw
      });
    } else {
      res.send(raw);
    }
  } catch (err) {
    res.send(err.message);
  }
}

export async function exportHandler(req, res) {
  const tid = req.params.tid;
  const ext = req.params.ext;
  try {
    res.setHeader('Content-Type', 'application/octet-stream; charset=utf-8');

    const newFile: string = path.join(process.cwd(), '.temp', `${tid}.${ext}`);

    await fs.ensureFile(newFile);

    const raw: string = await getRawFile(tid, ext);

    await fs.writeFile(newFile, raw);

    fs.createReadStream(newFile).pipe(res);
  } catch (err) {
    res.send(err.message);
  }
}
