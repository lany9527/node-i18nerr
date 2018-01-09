export default function(dataList: any[], tableName) {
  const entity = {};
  dataList.forEach(d => {
    entity[d.key] = {
      en: d.value_en,
      cn: d.value_cn,
      tw: d.value_tw
    };
  });

  const keys = {};

  return `/* generate by i18n error platform, please do not edit it */
interface I18nError$ {
  Code: number;
  Detail: string;
  Prefix: string;
  Vars: any;
  Context: any;
  GetCode(): number;
  GetDetail(): string;
  SetDetail(detail: string): this;
  GetPrefix(): string;
  SetVars(vars: any): this;
  SetContext(context: any): this;
  GetContext(): any;
  Error(): string;
}

export default class I18nError extends Error implements I18nError$ {
  public Vars: any;
  public Context: any;
  constructor(public Code: number, public Detail: string, public Prefix: string) {
    super(Detail);
  }
  GetCode(): number {
    return this.Code;
  }
  GetDetail(): string {
    return this.Detail;
  }
  SetDetail(detail: string): this {
    this.Detail = detail;
    return this;
  }
  GetPrefix(): string {
    return this.Prefix;
  }
  SetVars(vars: any): this {
    this.Vars = vars;
    return this;
  }
  SetContext(context: any): this {
    this.Context = context;
    return this;
  }
  GetContext(): any {
    return this.Context;
  }
  Error(): string {
    return this.toString();
  }
  toString(): string {
    return this.Prefix + this.Code + '|' + this.Detail;
  }
}

${dataList
    .sort(v => -v.key)
    .map(d => {
      if (!keys[d.key]) {
        keys[d.key] = d;
        return `export const ${d.key} = new I18nError(${d.code}, "${d.value_en}", "${d.tableName ||
          tableName}"); // ${d.value_cn}`;
      } else {
        return `// duplicate with the key "${d.key}" in module "${keys[d.key].tableName}"`;
      }
    })
    .join('\n')}
`;
}
