import { IFrontmatterData, IGraphqlFrontmatterData } from '../templates/docs';

export interface MenuDataItem extends IFrontmatterData {
  link?: string;
}

export interface IMenuData {
  [key: string]: IMenuData | MenuDataItem[];
}

/**
 * @param {*} path url
 * @param {*} zhCN boolean
 * if(zhCN)
 *  return "avatar-list"
 * else
 *  return "avatar-list-cn"
 */
export function getLocalizedPathname(path: string, enUS: boolean) {
  let pathname = path.startsWith('/') ? path : `/${path}`;
  if (pathname === '/' || pathname === '/index') {
    if (enUS) {
      return '/';
    }
  }
  if (pathname.endsWith('/')) {
    return `${pathname.substring(0, pathname.length - 1)}`;
  }
  return `${pathname}`;
}

export function getMenuItems(
  moduleData: {
    [key: string]: any;
  },
  locale: string
) {
  const menuMeta = moduleData.map((item: { meta: any }) => item.meta);
  const menuItems: {
    [key: string]: any;
  } = { topLevel: {} };
  menuMeta
    .sort((a: { order: number }, b: { order: number }) => (a.order || 0) - (b.order || 0))
    .forEach((meta: { category: { [x: string]: any }; type: string }) => {
      const category = (meta.category && meta.category[locale]) || meta.category || 'topLevel';
      if (!menuItems[category]) {
        menuItems[category] = {};
      }

      const type = meta.type || 'topLevel';
      if (!menuItems[category][type]) {
        menuItems[category][type] = [];
      }

      menuItems[category][type].push(meta);
    });
  return menuItems;
}

export function ping(callback: (arg0: any) => void) {
  // eslint-disable-next-line
  const url =
    'https://private-a' +
    'lipay' +
    'objects.alip' +
    'ay.com/alip' +
    'ay-rmsdeploy-image/rmsportal/RKuAiriJqrUhyqW.png';
  const img = new Image();
  let done: boolean;
  const finish = (status: string) => {
    if (!done) {
      done = true;
      img.src = '';
      callback(status);
    }
  };
  img.onload = () => finish('responded');
  img.onerror = () => finish('error');
  img.src = url;
  return setTimeout(() => finish('timeout'), 1500);
}

export function isLocalStorageNameSupported() {
  const testKey = 'test';
  const storage = window.localStorage;
  try {
    storage.setItem(testKey, '1');
    storage.removeItem(testKey);
    return true;
  } catch (error) {
    return false;
  }
}

export const transformerFrontmatter = (frontmatter: IGraphqlFrontmatterData): IFrontmatterData => {
  const { title } = frontmatter;
  return {
    ...frontmatter,
    title: {
      'en-US': title.en_US,
    },
  };
};
