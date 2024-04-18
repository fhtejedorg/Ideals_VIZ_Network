const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set([".DS_Store","favicon.png","icons/Collective City.png","icons/Equal Opportunities.png","icons/Freedom and Open-minded.png","icons/Good Governance.png","icons/Progress and Creativity.png","icons/Safe and Healthy.png","icons/Within Planetary Boundaries.png","Inventory_Indicators_Dimensions_Ideals.csv","Inventory_Indicators_Dimensions_Ideals_old.csv"]),
	mimeTypes: {".png":"image/png",".csv":"text/csv"},
	_: {
		client: {"start":"_app/immutable/entry/start.abce5176.js","app":"_app/immutable/entry/app.3ba5820e.js","imports":["_app/immutable/entry/start.abce5176.js","_app/immutable/chunks/index.f284bd3d.js","_app/immutable/chunks/singletons.f5ddafee.js","_app/immutable/chunks/index.253c8e76.js","_app/immutable/entry/app.3ba5820e.js","_app/immutable/chunks/index.f284bd3d.js"],"stylesheets":[],"fonts":[]},
		nodes: [
			__memo(() => import('./chunks/0-de151801.js')),
			__memo(() => import('./chunks/1-fc1f635d.js')),
			__memo(() => import('./chunks/2-1da88d3f.js'))
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			}
		],
		matchers: async () => {
			
			return {  };
		}
	}
}
})();

export { manifest };
//# sourceMappingURL=manifest.js.map
