window.RufflePlayer = window.RufflePlayer || {};
window.RufflePlayer.config = {
    "public_path": "./ruffle/",
    "polyfills": ((localStorage.getItem("useRuffle")) ? ["static-content", "plugin-detect", "dynamic-content", "frames"] : [])
};