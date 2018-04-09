
export const versions = [
  {
    name: 'Lolita',
    code: 110,
  },
  {
    name: 'Pecado',
    code: 110,
  },
  {
    name: 'Water',
    code: 110,
  },
  {
    name: 'Policy',
    code: 110,
  },
  {
    name: 'Havana',
    code: 110,
  },
]

export const platforms = [
  {
    name: 'Android',
    code: 0,
  },
  {
    name: 'iOS',
    code: 1,
  },
  {
    name: 'Hybrid-Android',
    code: 2,
  },
  {
    name: 'Hybrid-iOS',
    code: 3,
  },
  {
    name: 'web',
    code: 4,
  },
  {
    name: 'server',
    code: 5,
  },
]

export const types = [
  {
    name: 'Event',
    id: 0 ,
    subTypes: [
      {
        name: 'Search',
        id: 0,
      },
      {
        name: 'Click',
        id: 1,
      },
      {
        name: 'Scroll',
        id: 3,
      },
      {
        name: 'Enter',
        id: 4,
      },
      {
        name: 'Pause',
        id: 5,
      },
      {
        name: 'Leave',
        id: 6,
      },
    ],
  },
  {
    name: 'Span',
    id: 1 ,
    subTypes: [
      {
        name: 'Timeline',
        id: 0,
      },
      {
        name: 'View',
        id: 1,
      },
      {
        name: 'CardShow',
        id: 3,
      },
    ],
  },
  {
    name: 'View',
    id: 2 ,
    subTypes: [
      {
        name: 'Page',
        id: 0,
      },
      {
        name: 'Content',
        id: 1,
      },
      {
        name: 'Widget',
        id: 3,
      },
    ],
  },
  {
    name: 'Error',
    id: 3 ,
    subTypes: [
      {
        name: 'Network',
        id: 0,
      },
      {
        name: 'MemLeak',
        id: 1,
      },
      {
        name: 'Script',
        id: 3,
      },
      {
        name: 'Controller',
        id: 4,
      },
      {
        name: 'Timeout',
        id: 5,
      },
      {
        name: 'Image',
        id: 6,
      },
    ],
  },
  {
    name: 'Ping',
    id: 4 ,
    subTypes: [
      {
        name: 'Check',
        id: 0,
      },
      {
        name: 'Health',
        id: 1,
      },
      {
        name: 'Status',
        id: 3,
      },
    ],
  },
  {
    name: 'CardShow',
    id: 5 ,
    subTypes: [
      {
        name: 'Card',
        id: 0,
      },
      {
        name: 'Ad',
        id: 1,
      },
      {
        name: 'Result',
        id: 3,
      },
      {
        name: 'Notification',
        id: 4,
      },
      {
        name: 'Item',
        id: 5,
      },
    ],
  },
  {
    name: 'Monitor',
    id: 6 ,
    subTypes: [
      {
        name: 'Focus',
        id: 0,
      },
      {
        name: 'Storage',
        id: 1,
      },
      {
        name: 'AppStatus',
        id: 3,
      },
      {
        name: 'Heartbeat',
        id: 4,
      },
    ],
  },
  {
    name: 'GIS',
    id: 7 ,
    subTypes: [
      {
        name: 'Forbidden',
        id: 0,
      },
      {
        name: 'Granted',
        id: 1,
      },
      {
        name: 'AccurateLoc',
        id: 3,
      },
      {
        name: 'IPLoc',
        id: 4,
      },
    ],
  },
  {
    name: 'Call',
    id: 8 ,
    subTypes: [
      {
        name: 'PlatformFunc',
        id: 0,
      },
      {
        name: 'SystemFunc',
        id: 1,
      },
      {
        name: 'Application',
        id: 3,
      },
      {
        name: 'Permission',
        id: 4,
      },
    ],
  },
  {
    name: 'Share',
    id: 9 ,
    subTypes: [],
  },
  {
    name: 'Push',
    id: 10 ,
    subTypes: [],
  },
]
