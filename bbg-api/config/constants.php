<?php

return [
	/* The following key is mislabeled and is used as "FROM" throughout the software */
    'admin_email_recipient' => env('ADMIN_EMAIL_FROM', 'rebates@buildersbuyinggroup.com'),
    'roles' => [
        'admin' => 1,
        'sales' => 2,
        'store_front' => 3
    ],

    'roles_permission_scopes' => [
        'admin' => [
            'admin',
            'users:add',
            'users:update',
            'users:delete',
            'orders:list',
            'order:view',
            'order:update',
            'project:view',
            'projects:list'
        ],
        'sales' => [
            'sales',
            'orders:list',
            'order:view',
            'order:update',
            'project:view',
            'projects:list'
        ],
        'store_front' => [
            'store_front',
            'orders:list',
            'order:view',
            'order:update',
            'order:create',
            'order:update',
            'project:view',
            'projects:list',
            'project:create'
        ]
    ]
];
