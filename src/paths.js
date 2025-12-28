export const paths = {
  index: '/',
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    emailSent: '/auth/email-sent',
    verify: '/auth/verify',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
  },
  dashboard: {
    index: '/dashboard',
    account: '/dashboard/account',
    analytics: {
      index: '/dashboard/analytics',
      seace: '/dashboard/analytics/seace',
      mivivienda: '/dashboard/analytics/mivivienda',
    },
    users: '/dashboard/users',
  },
  components: {
    index: '/components',
    dataDisplay: {
      detailLists: '/components/data-display/detail-lists',
      tables: '/components/data-display/tables',
      quickStats: '/components/data-display/quick-stats',
    },
    lists: {
      groupedLists: '/components/lists/grouped-lists',
      gridLists: '/components/lists/grid-lists',
    },
    forms: '/components/forms',
    modals: '/components/modals',
    charts: '/components/charts',
    buttons: '/components/buttons',
    typography: '/components/typography',
    colors: '/components/colors',
    inputs: '/components/inputs',
  },
  docs: 'https://material-kit-pro-react-docs.devias.io',
  notAuthorized: '/401',
  notFound: '/404',
  serverError: '/500',
};
