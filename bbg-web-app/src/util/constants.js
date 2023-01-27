/* Note that 'ADMIN' is deliberately excluded; this simplifies the "general impersonation" logic. */
export const VALID_USER_TYPES = [
    'BUILDERS',
    'MEMBERS',
    'EXECUTIVE',
    'TERRITORY_MANAGER',
    'MANUFACTURER',
    'SUPPLIER',
    'COSUPPLIER',
    'CONTRACTOR',
    'SUBCONTRACTOR',
    'DISTRIBUTOR'
];

export const UI_USER_TYPE_SORT_PRIORITY = {
    'ADMIN': 1,
    'BUILDERS': 9,
    'MEMBERS': 2,
    'EXECUTIVE': 3,
    'TERRITORY_MANAGER': 10,
    'MANUFACTURER': 4,
    'SUPPLIER': 3,
    'COSUPPLIER': 6,
    'CONTRACTOR': 0,
    'SUBCONTRACTOR': 0,
    'DISTRIBUTOR': 0
};

export const ALLOWED_USER_TYPES = [
    'BUILDERS',
    'TERRITORY_MANAGER',
    'ADMIN'
];

export const HUMANIZED_USER_TYPE_ENUM_VALUES = {
    'BUILDERS': 			'Builders',
    'MEMBERS': 				'Member',
    'EXECUTIVE':			'Executive',
    'TERRITORY_MANAGER':	'Territory Managers',
    'MANUFACTURER':			'Manufacturer',
    'SUPPLIER':				'Supplier',
    'COSUPPLIER':			'Co-suppplier',
    'CONTRACTOR':			'Contractor',
    'SUBCONTRACTOR':		'Subcontractor',
    'DISTRIBUTOR':			'Distributor'
};

export const APP_TITLE = process.env.REACT_APP_TITLE || "APP TITLE";
export const APP_LOGO = process.env.REACT_APP_LOGO_IMG_PATH || "/images/logo.png";