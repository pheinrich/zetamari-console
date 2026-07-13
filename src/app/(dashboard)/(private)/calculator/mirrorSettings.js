// Default visualization toggles/zoom (front/back, glass, dimension
// callouts, zoom level) for a fresh working panel or a legacy link that
// didn't carry any settings of its own. Shared by MirrorCalculator,
// LightboxThumbnail, and urlCodec so the default never drifts between them.
export const DEFAULT_SETTINGS = {showBack: false, showDims: 0, showGlass: true, zoom: 65}
