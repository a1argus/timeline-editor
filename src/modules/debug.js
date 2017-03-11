import c from './const'

export const debug = (verbosity, message) => {
	if(verbosity <= c.debugVerbosity) { console.log(message); }
}