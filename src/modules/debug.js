const DEBUG_VERBOSITY = 0

export const debug = (verbosity, message) => {
	if(verbosity <= DEBUG_VERBOSITY) { console.log(message); }
}