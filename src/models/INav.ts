export interface INav {
  label: string;
  url: string;
  active: boolean;
  items?: INav[];
}

export const NAV_ITEMS: INav[] = [
  {
    label: 'Overview',
    url: '/overview',
    active: false,
  },
  // Contacts
  {
    // label: 'Contacts',
    label: 'Companies',
    url: '/companies',
    active: false,
    // Walkins, Constructors, Staff
    items: [
      //List
      {
        label: 'All Companies',
        url: '/companies',
        active: false,
      },
      {
        label: 'Company Groups',
        url: '/companies/groups',
        active: false,
      },
      // Add folder
      // {
      //   label: '+ Add Group',
      //   url: 'add/categories',
      //   active: false,
      // },

      //Add contact
    ],
  },

  //bookings
  {
    label: 'Bookings',
    url: '/bookings',
    active: false,
  },

  //rooms
  {
    label: 'Rooms',
    url: '/rooms',
    active: false,
  },
  // Users
  {
    label: 'Users',
    url: '/users',
    active: false,
  },
  //Settings
  {
    label: 'Settings',
    url: '/settings',
    active: false,
  },
];
