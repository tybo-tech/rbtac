export const Constants = {
  LocalUser: 'currentUser',
  Roles: {
    Admin: 'Admin',
    Advisor: 'Advisor',
    Manager: 'Manager',
  },
  // ApiBase: 'https://rbttacesd.co.za/api/api/',
  ApiBase: 'http://localhost:8080/api/',
  // ApiBase: 'https://v2.rbttacesd.co.za/api/api/',
  Facilities: [
    'Hotdesk',
    'Meeting Room',
    'Board Room',
    'Conference Room',
    'Training Room',
  ],
  Tables: {
    Room: 'Room',
    Visitors: 'Visitors',
    Booking: 'Booking',
    Task: 'Task',
    GrantFunding: 'GrantFunding',
    Quotations: 'Quotations',
  },
  Modules: [
    {
      Id: 'admin',
      Name: 'Analytics',
      Icon: '<i class="bi bi-grid"></i>',
      Url: '/admin',
    },
    // {
    //   Id: 'enterprises',
    //   Name: 'Enterprises',
    //   Icon: '<i class="bi bi-briefcase"></i>',
    //   Url: '/admin/wakins',
    // },
    {
      Id: 'walk-ins',
      Name: 'Walk Ins',
      Icon: '<i class="bi bi-briefcase"></i>',
      Url: '/admin/walk-ins-dashboard',
    },
    {
      Id: 'tanants',
      Name: 'Tanants',
      Icon: '<i class="bi bi-building"></i>',
      Url: '/admin/tanants',
    },
    {
      Id: 'service-providers',
      Name: 'Service Providers',
      Icon: '<i class="bi bi-building"></i>',
      Url: '/admin/service-providers',
    },
    {
      Id: 'visitors',
      Name: 'Visitors',
      Icon: '<i class="bi bi-door-open"></i>',
      Url: '/admin/visitors',
    },
    {
      Id: 'bookings',
      Name: 'Bookings',
      Icon: '<i class="bi bi-calendar-check"></i>',
      Url: '/admin/bookings',
    },
    {
      Id: 'rooms',
      Name: 'Rooms',
      Icon: '<i class="bi bi-tv"></i>',
      Url: '/admin/rooms',
    },
    {
      Id: 'rentals',
      Name: 'Rentals',
      Icon: '<i class="bi bi-houses"></i>',
      Url: '/module/rentals',
    },
    {
      Id: 'facility',
      Name: 'Facility management',
      Icon: '<i class="bi bi-building-gear"></i>',
      Url: '/module/facility',
    },
    {
      Id: 'facility-maintenance',
      Name: 'Maintenance checklist',
      Icon: '<i class="bi bi-check-square"></i>',
      Url: '/module/facility-maintenance',
    },
    {
      Id: 'grant-funding',
      Name: 'Grant Funding',
      Icon: '<i class="bi bi-building-gear"></i>',
      Url: '/admin/grant-funding-list',
    },
    {
      Id: 'reports',
      Name: 'Reports',
      Icon: '<i class="bi bi-bar-chart"></i>',
      Url: '/admin/reports',
    },
    {
      Id: 'users',
      Name: 'Users',
      Icon: '<i class="bi bi-people"></i>',
      Url: '/admin/users',
    },
    {
      Id: 'settings',
      Name: 'Settings',
      Icon: '<i class="bi bi-gear"></i>',
      Url: '/admin/settings',
    },
  ],
  Months: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ],
};

export function today() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const day = today.getDate();
  const months: string[] = Constants.Months;
  return `${day} ${months[month - 1]} ${year}`;
}
export function dobYears() {
  const years = [];
  for (let i = 1900; i <= new Date().getFullYear(); i++) {
    years.push(i);
  }
  return years;
}

export const sectors = [
  'Automotive sector',
  'Clothing, Textiles, Leather and Footwear sector',
  'Agro-processing',
  'Chemicals sector',
  'Metals fabrication, capital and rail transport equipment',
  'Steel Industry',
  'Plastics',
  'Mineral Beneficiation',
  'Mining Capital Equipment',
  'Business Process Services (BPS)',
  'Film sector',
  'Green industries',
  'Marine manufacturing and associated services',
  'Aerospace and Defence',
  'Electrotechnical',
  'Advanced Materials',
  'Poultry',
  'Sugar',
  'Edible oils',
  'Grains',
  'Juice concentrates',
  'Dairy products',
  'Pharmaceuticals',
  'Personal protective equipment',
  'Ventilators',
  'Medical equipment',
  'Basic consumer goods',
  'Televisions',
  'Mobile phones',
  'Consumer electronics',
  'Fridges',
  'Stoves',
  'Washing machines',
  'Household hardware products',
  'Packaging material',
  'Furniture',
  'Agriculture equipment',
  'Mining equipment',
  'Green economy inputs and components',
  'Digital infrastructure inputs, components and equipment',
  'Construction-driven value-chains',
  'Cement',
  'Steel products',
  'Plastic piping',
  'Steel piping',
  'Engineered products',
  'Earth-moving equipment',
  'Transport rolling stock',
  'Automobile assembly',
  'Auto components',
  'Rail assembly',
  'Rail components',
  'Other',
];
