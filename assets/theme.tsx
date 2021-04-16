import {createMuiTheme} from '@material-ui/core'
import {F} from './fonts/fonts'


interface PaletteColor {
    light?: string;
    main: string;
    dark?: string;
    contrastText?: string;
}


// FONTS EXPORT
const helveticaRoman = {
    fontFamily: 'Helvetica Neue',
    fontStyle: 'normal',
    fontWeight: 400,
    src: `
        local('Helvetica Neue Roman'),
        local('Helvetica-Neue-Roman'),
        url(${F.romanTtf}) format('truetype'),
        url(${F.romanWoff}) format('woff'),
        url(${F.romanWoff2}) format('woff2')
    `
}
const helveticaMedium = {
    fontFamily: 'Helvetica Neue',
    fontStyle: 'normal',
    fontWeight: 500,
    src: `
        local('Helvetica Neue Medium'),
        local('Helvetica-Neue-Medium'),
        url(${F.mediumTtf}) format('truetype'),
        url(${F.mediumWoff}) format('woff'),
        url(${F.mediumWoff2}) format('woff2')
    `
}

const helveticaBold = {
    fontFamily: 'Helvetica Neue',
    fontStyle: 'normal',
    fontWeight: 700,
    src: `
        local('Helvetica Neue Bold'),
        local('Helvetica-Neue-Bold'),
        url(${F.boldTtf}) format('truetype'),
        url(${F.boldWoff}) format('woff'),
        url(${F.boldWoff2}) format('woff2')
    `
}

const helveticaLight = {
    fontFamily: 'Helvetica Neue',
    fontStyle: 'normal',
    fontWeight: 300,
    src: `
        local('Helvetica Neue Light'),
        local('Helvetica Neue Light'),
        url(${F.lightTtf}) format('truetype'),
        url(${F.lightWoff}) format('woff'),
        url(${F.lightWoff2}) format('woff2')
    `
}

export const mainColor = '#C51D34'
export const secondColor = '#A5A5A5'
export const typographyColor = '#303030'

export const theme = createMuiTheme({
    palette: {
        primary: {
            main: mainColor,
            contrastText: 'white'
        },
        secondary: {
            main: secondColor
        },
        text: {
            primary: typographyColor
        },
        common:{
            black: typographyColor
        }
    },
    typography: {
        fontFamily: [
            'Helvetica Neue',
            'Arial',
            'sans-serif'
        ].join(','),
        fontSize: 16,
        allVariants: {
            color: typographyColor
        },
        body2: {
            fontWeight: 300
        },
        caption: {
            fontWeight: 300
        }
    },
    overrides: {
        MuiCssBaseline: {
            '@global': {
                '@font-face': [helveticaBold, helveticaLight, helveticaMedium, helveticaRoman]
            }
        },
        MuiBottomNavigation: {
            root: {
                backgroundColor: mainColor
            }
        },
        MuiBottomNavigationAction: {
            root: {
                color: 'rgba(255, 255, 255, 0.54)',
                '&$selected': {
                    color: 'white'
                }
            },
            label: {
                color: 'rgba(255, 255, 255, 0.54)',
                '&$selected': {
                    color: 'white'
                }
            },
            wrapper: {}
        },

    }
})