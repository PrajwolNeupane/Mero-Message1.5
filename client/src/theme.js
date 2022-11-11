import { createTheme } from "@mui/material";

const font = "'Poppins', sans-serif";
const theme = createTheme({
    palette: {
        primary: {
            main: "#272729",
            light: "#3a3a3d"
        },
        secondary: {
            main: "#f5f0ec",
            light: "#fce46a",
        },
        text: {
            main: "#dbdbdb",
            light: "#f0f0f0"
        },
        otherColor: {
            main: "#6598eb"
        }
    },
    overrides: {
        MuiAppBar: {
            colorPrimary: {
                backgroundColor: "#232f3e",
            },
        },
    },
    typography: {
        fontFamily: font,
        h1: { fontWeight: 700 },
        h2: { fontWeight: 600 },
        h3: { fontWeight: 500 },
        h4: { fontWeight: 400 },
        h5: { fontWeight: 300 },
        h6: { fontWeight: 300 }
    },
    components: {
        MuiSnackbar: {
            variants: [
                {
                    props: { variant: "error" },
                    style: {
                        "& .MuiSnackbarContent-root": {
                            background: "#ed4337"
                        }
                    },
                    
                },
            ]
        }
    }

});
export default theme;