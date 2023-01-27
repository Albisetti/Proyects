/* eslint-disable */
/** @type import('tailwindcss').Config */
module.exports = {
	content: ["./src/**/*.{js,jsx,ts,tsx}"],
	theme: {
		colors: {
			paleRed: "#F1D5D5",
			brightRed: "#FF0F00",
			darkRed: "#94160E",
			white: "#FFFFFF",
			black: "#000000",
			grey: "#DDDDDD",
			darkGrey: "#3BA094",
			gray: {
				DEFAULT: "#1E1E1E",
				1: "#DDDDDD",
				2: "#3BA094",
				3: "#F5F5F5",
				4: "#656565",
				5: "#363636",
				6: "#777777",
				7: "#EEEEEE",
				8: "#F2F2F2",
			},
			softGreen: "#B2C290",
		},

		extend: {
			backgroundImage: (theme) => ({
				checkboxBackground: "url('../public/assets/tick.svg')",
			}),
		},
		fontFamily: {
			roboto: ["Roboto", "sans-serif"],
			poppins: ["Poppins", "sans-serif"],
		},
		screens: {
			xs: "0px",
			sm: "640px",
			md: "768px",
			lg: "1024px",
			xl: "1296px",
			xxl: "1535px",
		},
	},
	plugins: [],
};
