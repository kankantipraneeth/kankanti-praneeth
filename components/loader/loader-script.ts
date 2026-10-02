export const LOADER_KEY = "pk-loader-seen";

/** Hard ceiling (ms) on how long the loader can cover the page, even if the app's JS never hydrates. */
export const LOADER_FAILSAFE_MS = 2500;

/**
 * Runs in <head> before first paint: shows the loader only on the first visit per session, never under reduced motion.
 * A timer removes it after LOADER_FAILSAFE_MS so a slow, blocked or failed bundle can never trap the page behind it.
 */
export const LOADER_SCRIPT = `(function(){try{if(sessionStorage.getItem("${LOADER_KEY}"))return;if(matchMedia("(prefers-reduced-motion: reduce)").matches)return;var d=document.documentElement;d.setAttribute("data-loader","");setTimeout(function(){d.removeAttribute("data-loader")},${LOADER_FAILSAFE_MS})}catch(e){}})();`;
