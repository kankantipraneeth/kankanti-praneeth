export const LOADER_KEY = "pk-loader-seen";

/** Runs in <head> before first paint: shows the loader only on the first visit per session, never under reduced motion. */
export const LOADER_SCRIPT = `(function(){try{if(sessionStorage.getItem("${LOADER_KEY}"))return;if(matchMedia("(prefers-reduced-motion: reduce)").matches)return;document.documentElement.setAttribute("data-loader","")}catch(e){}})();`;
