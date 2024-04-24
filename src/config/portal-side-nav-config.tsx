import { ChartLineUp, File, Headset, HouseSimple, PiggyBank, Tray } from "@phosphor-icons/react/dist/ssr";

export const clientSideNavItems = [

    {
        title: 'Client',
        path: '/client',
        icon: <HouseSimple size={20} />

    },
    {
        title: 'Agent',
        path: '/client/agent',
        icon: <Headset size={20} />

    },
    {
        title: 'Portfolio',
        path: '/client/portfolio',
        icon: <ChartLineUp size={20} />
    },
    {
        title: 'Transactions',
        path: '/client/transactions',
        icon: <PiggyBank size={20} />
    }


]


export const adminSideNavItems = [

    {
        title: 'Admin',
        path: '/admin',
        icon: <HouseSimple size={20} />

    },
    {
        title: 'inbox',
        path: '/admin/inbox',
        icon: <Tray size={20} />

    },

    {
        title: 'Knowledge Hub',
        path: '/admin/knowledge',
        icon: <File size={20} />
    }


]

