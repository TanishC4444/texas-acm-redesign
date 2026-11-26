type Tier = 'Platinum' | 'Gold' | 'Silver' | 'Bronze';

interface Partner {
    name: string;
    logo: string;
    tier: Tier;
    url: string;
}

export const currentPartners: Partner[] = [
    {
        name: 'Atlassian',
        logo: '/partners/atlassian.png',
        tier: 'Platinum',
        url: 'https://www.atlassian.com',
    },
    // {
    //     name: 'Dell',
    //     logo: '/partners/dell.png',
    //     tier: 'Silver',
    //     url: 'https://www.dell.com',
    // },
    {
        name: 'Accenture',
        logo: '/partners/accenture.png',
        tier: 'Gold',
        url: 'https://www.accenture.com',
    },
    // {
    //     name: 'FUTO',
    //     logo: '/partners/futo.svg',
    //     tier: 'Gold',
    //     url: 'https://futo.org/',
    // },
    // {
    //     name: 'Paycom',
    //     logo: '/partners/paycom.png',
    //     tier: 'Gold',
    //     url: 'https://www.paycom.com',
    // },
    {
        name: 'PwC',
        logo: '/partners/pwc.png',
        tier: 'Gold',
        url: 'https://www.pwc.com',
    },
    {
        name: 'Fidelity',
        logo: '/partners/fidelity.png',
        tier: 'Silver',
        url: 'https://www.fidelity.com',
    },
    {
        name: 'Sandia National Laboratories',
        logo: '/partners/sandia.png',
        tier: 'Silver',
        url: 'https://www.sandia.gov',
    },
    {
        name: 'Roblox',
        logo: '/partners/roblox.png',
        tier: 'Bronze',
        url: 'https://www.roblox.com',
    },
    {
        name: 'Bumble',
        logo: '/partners/bumble.png',
        tier: 'Bronze',
        url: 'https://bumble.com/en-us',
    },
    {
        name: 'Verkada',
        logo: '/partners/verkada.png',
        tier: 'Bronze',
        url: 'https://www.verkada.com',
    },
    {
        name: 'RTX',
        logo: '/partners/rtx.png',
        tier: 'Bronze',
        url: 'https://www.rtx.com',
    },
];
