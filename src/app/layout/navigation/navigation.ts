export interface NavigationItem {
  id: string;
  title: string;
  type: 'item' | 'collapse' | 'group';
  translate?: string;
  icon?: string;
  hidden?: boolean;
  url?: string;
  classes?: string;
  exactMatch?: boolean;
  external?: boolean;
  target?: boolean;
  breadcrumbs?: boolean;
  permissions?: string;
  children?: NavigationItem[];
}
export const NavigationItems: any[] = [
  {
    id: 'navigation',
    title: 'Master',
    type: 'group',
    icon: 'icon-navigation',
  }
];
export const SidebarLinks: any[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    type: 'item',
    url: '/dashboard',
    icon: 'feather icon-package',
    classes: 'nav-item',
    permissions: ['DASHBOARD-MANAGE']
  },
  {
    id: 'Category',
    title: 'Category',
    type: 'item',
    url: '/category',
    icon: 'feather icon-globe',
    classes: 'nav-item',
    permissions: ['CATEGORY-LIST']
  },
  {
    id: 'Wards',
    title: 'Wards',
    type: 'item',
    url: '/wards',
    icon: 'bi bi-people',
    classes: 'nav-item',
    permissions: ['WARD-LIST']
  },
  {
    id: 'Members',
    title: 'Members',
    type: 'item',
    url: '/members',
    icon: 'feather icon-package',
    classes: 'nav-item',
    permissions: ['MEMBER-LIST']
  },

  {
    id: 'upload-data',
    title: 'Upload Data',
    type: 'item',
    url: '/members/bulk',
    icon: 'bi bi-truck',
    classes: 'nav-item',
    permissions: ['MEMBER-UPLOAD']
  },

  // {
  //   id: 'Wholesalers',
  //   title: 'Wholesalers',
  //   type: 'item',
  //   url: '/wholesalers',
  //   icon: 'bi bi-truck',
  //   classes: 'nav-item',
  //   permissions: ['WHOLESALER-LIST']
  // },
  // {
  //   id: 'Retailers',
  //   title: 'Retailers',
  //   type: 'item',
  //   url: '/retailers',
  //   icon: 'bi bi-bag',
  //   classes: 'nav-item',
  //   permissions: ['RETAILER-LIST']
  // },
  // {
  //   id: 'Customers',
  //   title: 'Customers',
  //   type: 'item',
  //   url: '/customers',
  //   icon: 'bi bi-people',
  //   classes: 'nav-item',
  //   permissions: ['CUSTOMER-LIST'],
  // },


  // {
  //   id: 'reports',
  //   title: 'Reports',
  //   type: 'group',
  //   icon: 'icon-pages',
  //   children: [
  //     {
  //       id: 'Distributor Summary',
  //       title: 'Distributor Summary',
  //       type: 'item',
  //       url: '/distributors/samples/report',
  //       icon: 'bi bi-stack',
  //       classes: 'nav-item',
  //       permissions: ['DISTRIBUTOR-SUMMARY'],
  //     },

  //     {
  //       id: 'Customer Summary',
  //       title: 'Customer Summary',
  //       type: 'item',
  //       url: '/customer/samples/report',
  //       icon: 'bi bi-person-badge',
  //       classes: 'nav-item',
  //       permissions: ['CUSTOMER-SUMMARY'],
  //     },

  //   ]
  // },
  {
    id: 'users',
    title: 'Users & Roles',
    type: 'group',
    icon: 'icon-pages',
    children: [
      {
        id: 'users',
        title: 'Users List',
        type: 'item',
        url: '/users',
        icon: 'feather icon-user',
        classes: 'nav-item',
        permissions: ['USER-MANAGE'],
      },
      {
        id: 'roles-permissions',
        title: 'Roles & Permissions',
        type: 'item',
        url: '/roles',
        icon: 'feather icon-shield',
        classes: 'nav-item',
        permissions: ['ROLES-PERMISSION-MANAGE']
      },
    ]
  }



]



