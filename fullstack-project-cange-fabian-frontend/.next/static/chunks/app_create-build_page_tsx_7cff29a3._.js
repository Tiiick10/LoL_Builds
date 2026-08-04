(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push([typeof document === "object" ? document.currentScript : undefined, {

"[project]/app/create-build/page.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>CreateBuildPage)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$axios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/utils/axios.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
const ROLES = [
    "top",
    "jungle",
    "mid",
    "adc",
    "support"
];
const SHARD_ROW_1 = [
    {
        label: "Adaptive Force",
        value: "StatModsAdaptiveForceIcon"
    },
    {
        label: "Attack Speed",
        value: "StatModsAttackSpeedIcon"
    },
    {
        label: "Ability Haste (CDR)",
        value: "StatModsCDRScalingIcon"
    }
];
const SHARD_ROW_2 = [
    {
        label: "Adaptive Force",
        value: "StatModsAdaptiveForceIcon"
    },
    {
        label: "Movement Speed",
        value: "StatModsMoveSpeedIcon"
    },
    {
        label: "Health",
        value: "StatModsHealthScalingIcon"
    }
];
const SHARD_ROW_3 = [
    {
        label: "Health",
        value: "StatModsHealthScalingIcon"
    },
    {
        label: "Magic Resist",
        value: "StatModsMagicResIcon"
    },
    {
        label: "Armor",
        value: "StatModsArmorIcon"
    }
];
function CreateBuildPage() {
    _s();
    const [form, setForm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        name: "",
        description: "",
        role: "",
        champion_name: "",
        primary_path: "",
        keystone: "",
        primary_slot1: "",
        primary_slot2: "",
        primary_slot3: "",
        secondary_path: "",
        secondary_slot1: "",
        secondary_slot2: "",
        shard_offense: "",
        shard_flex: "",
        shard_defense: ""
    });
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [message, setMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [champions, setChampions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [filteredChampions, setFilteredChampions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [showSuggestions, setShowSuggestions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [runes, setRunes] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const handleSubmit = async (e)=>{
        e.preventDefault();
        setError("");
        // Client-side validation before hitting the API
        if (!form.name.trim()) return setError("Please enter a build name.");
        if (!form.role) return setError("Please select a role.");
        if (!form.champion_name) return setError("Please select a champion.");
        if (!form.primary_path) return setError("Please select a primary path.");
        if (!form.keystone) return setError("Please select a keystone rune.");
        if (!form.secondary_path) return setError("Please select a secondary path.");
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$axios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post("builds/create/", form);
            setMessage("Build created successfully!");
            setTimeout(()=>router.push("/builds"), 1500);
        } catch (err) {
            console.error(err);
            if (err.response?.data) {
                const data = err.response.data;
                // Extract human-readable field errors if the API returns them
                if (typeof data === "string") {
                    setError(data);
                } else if (data.detail) {
                    setError(data.detail);
                } else if (data.error) {
                    setError(data.error);
                } else if (data.champion) {
                    setError(Array.isArray(data.champion) ? data.champion[0] : data.champion);
                } else {
                    setError("Failed to create the build. Please check the form and try again.");
                }
            } else {
                setError("Network error. Please check your connection and try again.");
            }
        }
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CreateBuildPage.useEffect": ()=>{
            const fetchChampions = {
                "CreateBuildPage.useEffect.fetchChampions": async ()=>{
                    const res = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("https://ddragon.leagueoflegends.com/cdn/15.9.1/data/en_US/champion.json");
                    setChampions(Object.values(res.data.data));
                }
            }["CreateBuildPage.useEffect.fetchChampions"];
            const fetchRunes = {
                "CreateBuildPage.useEffect.fetchRunes": async ()=>{
                    const res = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("https://ddragon.leagueoflegends.com/cdn/15.9.1/data/en_US/runesReforged.json");
                    setRunes(res.data);
                }
            }["CreateBuildPage.useEffect.fetchRunes"];
            fetchChampions();
            fetchRunes();
        }
    }["CreateBuildPage.useEffect"], []);
    const primary = runes.find((r)=>r.name === form.primary_path);
    const secondary = runes.find((r)=>r.name === form.secondary_path);
    const secondaryBranches = runes.filter((r)=>r.name !== form.primary_path);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "max-w-3xl mx-auto p-4 text-white",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                className: "text-2xl font-bold mb-4",
                children: "Create a New Build"
            }, void 0, false, {
                fileName: "[project]/app/create-build/page.tsx",
                lineNumber: 118,
                columnNumber: 7
            }, this),
            message && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-green-400 mb-2",
                children: message
            }, void 0, false, {
                fileName: "[project]/app/create-build/page.tsx",
                lineNumber: 119,
                columnNumber: 19
            }, this),
            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-red-400 mb-2",
                children: error
            }, void 0, false, {
                fileName: "[project]/app/create-build/page.tsx",
                lineNumber: 120,
                columnNumber: 17
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                onSubmit: handleSubmit,
                className: "space-y-4 relative",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "text",
                        name: "name",
                        placeholder: "Build name",
                        value: form.name,
                        onChange: (e)=>setForm((prev)=>({
                                    ...prev,
                                    name: e.target.value
                                })),
                        className: "w-full p-2 bg-gray-800 rounded"
                    }, void 0, false, {
                        fileName: "[project]/app/create-build/page.tsx",
                        lineNumber: 123,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                        name: "description",
                        placeholder: "Description (HTML allowed)",
                        value: form.description,
                        onChange: (e)=>setForm((prev)=>({
                                    ...prev,
                                    description: e.target.value
                                })),
                        className: "w-full p-2 bg-gray-800 rounded h-32"
                    }, void 0, false, {
                        fileName: "[project]/app/create-build/page.tsx",
                        lineNumber: 134,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                        name: "role",
                        value: form.role,
                        onChange: (e)=>setForm((prev)=>({
                                    ...prev,
                                    role: e.target.value
                                })),
                        className: "w-full p-2 bg-gray-800 rounded",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: "",
                                children: "Select Role"
                            }, void 0, false, {
                                fileName: "[project]/app/create-build/page.tsx",
                                lineNumber: 152,
                                columnNumber: 11
                            }, this),
                            ROLES.map((role)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                    value: role,
                                    children: role
                                }, role, false, {
                                    fileName: "[project]/app/create-build/page.tsx",
                                    lineNumber: 154,
                                    columnNumber: 13
                                }, this))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/create-build/page.tsx",
                        lineNumber: 144,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "relative",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "text",
                                name: "champion_name",
                                placeholder: "Champion name",
                                value: form.champion_name,
                                onChange: (e)=>{
                                    const value = e.target.value;
                                    setForm((prev)=>({
                                            ...prev,
                                            champion_name: value
                                        }));
                                    setShowSuggestions(true);
                                    setFilteredChampions(champions.filter((c)=>c.name.toLowerCase().includes(value.toLowerCase())));
                                },
                                className: "w-full p-2 bg-gray-800 rounded"
                            }, void 0, false, {
                                fileName: "[project]/app/create-build/page.tsx",
                                lineNumber: 162,
                                columnNumber: 11
                            }, this),
                            showSuggestions && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                className: "absolute bg-gray-900 border border-gray-700 w-full z-10 max-h-48 overflow-y-auto",
                                children: filteredChampions.map((c)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        onClick: ()=>{
                                            setForm((prev)=>({
                                                    ...prev,
                                                    champion_name: c.name
                                                }));
                                            setShowSuggestions(false);
                                        },
                                        className: "flex items-center p-2 hover:bg-gray-700 cursor-pointer",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                src: `https://ddragon.leagueoflegends.com/cdn/15.9.1/img/champion/${c.image.full}`,
                                                alt: c.name,
                                                className: "w-6 h-6 mr-2"
                                            }, void 0, false, {
                                                fileName: "[project]/app/create-build/page.tsx",
                                                lineNumber: 190,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: c.name
                                            }, void 0, false, {
                                                fileName: "[project]/app/create-build/page.tsx",
                                                lineNumber: 195,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, c.id, true, {
                                        fileName: "[project]/app/create-build/page.tsx",
                                        lineNumber: 182,
                                        columnNumber: 17
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/app/create-build/page.tsx",
                                lineNumber: 180,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/create-build/page.tsx",
                        lineNumber: 161,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                        name: "primary_path",
                        value: form.primary_path,
                        onChange: (e)=>setForm((prev)=>({
                                    ...prev,
                                    primary_path: e.target.value,
                                    keystone: "",
                                    primary_slot1: "",
                                    primary_slot2: "",
                                    primary_slot3: ""
                                })),
                        className: "w-full p-2 bg-gray-800 rounded",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: "",
                                children: "Select Primary Path"
                            }, void 0, false, {
                                fileName: "[project]/app/create-build/page.tsx",
                                lineNumber: 218,
                                columnNumber: 11
                            }, this),
                            runes.map((r)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                    value: r.name,
                                    children: r.name
                                }, r.id, false, {
                                    fileName: "[project]/app/create-build/page.tsx",
                                    lineNumber: 220,
                                    columnNumber: 13
                                }, this))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/create-build/page.tsx",
                        lineNumber: 203,
                        columnNumber: 9
                    }, this),
                    primary && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                        name: "keystone",
                        value: form.keystone,
                        onChange: (e)=>setForm((prev)=>({
                                    ...prev,
                                    keystone: e.target.value
                                })),
                        className: "w-full p-2 bg-gray-800 rounded",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: "",
                                children: "Select Keystone"
                            }, void 0, false, {
                                fileName: "[project]/app/create-build/page.tsx",
                                lineNumber: 236,
                                columnNumber: 1
                            }, this),
                            primary.slots[0]?.runes.map((rune)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                    value: rune.name,
                                    children: rune.name
                                }, rune.id, false, {
                                    fileName: "[project]/app/create-build/page.tsx",
                                    lineNumber: 238,
                                    columnNumber: 15
                                }, this))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/create-build/page.tsx",
                        lineNumber: 228,
                        columnNumber: 11
                    }, this),
                    primary && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-1 sm:grid-cols-3 gap-2",
                        children: primary.slots.slice(1).map((slot, idx)=>{
                            const field = `primary_slot${idx + 1}`;
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                value: form[field],
                                onChange: (e)=>setForm((prev)=>({
                                            ...prev,
                                            [field]: e.target.value
                                        })),
                                className: "p-2 bg-gray-800 rounded",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "",
                                        children: `Primary Slot ${idx + 1}`
                                    }, void 0, false, {
                                        fileName: "[project]/app/create-build/page.tsx",
                                        lineNumber: 262,
                                        columnNumber: 19
                                    }, this),
                                    slot.runes.map((rune)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: rune.name,
                                            children: rune.name
                                        }, rune.id, false, {
                                            fileName: "[project]/app/create-build/page.tsx",
                                            lineNumber: 264,
                                            columnNumber: 21
                                        }, this))
                                ]
                            }, idx, true, {
                                fileName: "[project]/app/create-build/page.tsx",
                                lineNumber: 251,
                                columnNumber: 17
                            }, this);
                        })
                    }, void 0, false, {
                        fileName: "[project]/app/create-build/page.tsx",
                        lineNumber: 247,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                        name: "secondary_path",
                        value: form.secondary_path,
                        onChange: (e)=>setForm((prev)=>({
                                    ...prev,
                                    secondary_path: e.target.value,
                                    secondary_slot1: "",
                                    secondary_slot2: ""
                                })),
                        className: "w-full p-2 bg-gray-800 rounded",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: "",
                                children: "Select Secondary Path"
                            }, void 0, false, {
                                fileName: "[project]/app/create-build/page.tsx",
                                lineNumber: 288,
                                columnNumber: 11
                            }, this),
                            secondaryBranches.map((r)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                    value: r.name,
                                    children: r.name
                                }, r.id, false, {
                                    fileName: "[project]/app/create-build/page.tsx",
                                    lineNumber: 290,
                                    columnNumber: 13
                                }, this))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/create-build/page.tsx",
                        lineNumber: 275,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-1 sm:grid-cols-2 gap-2",
                        children: [
                            1,
                            2
                        ].map((idx)=>{
                            const currentKey = `secondary_slot${idx}`;
                            const otherKey = `secondary_slot${idx === 1 ? 2 : 1}`;
                            const selectedOther = form[otherKey];
                            const options = secondary?.slots.slice(1).flatMap((slot)=>slot.runes).filter((rune)=>rune.name !== selectedOther);
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                value: form[currentKey],
                                onChange: (e)=>setForm((prev)=>({
                                            ...prev,
                                            [currentKey]: e.target.value
                                        })),
                                className: "p-2 bg-gray-800 rounded",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "",
                                        children: `Secondary Slot ${idx}`
                                    }, void 0, false, {
                                        fileName: "[project]/app/create-build/page.tsx",
                                        lineNumber: 322,
                                        columnNumber: 17
                                    }, this),
                                    options?.map((rune)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: rune.name,
                                            children: rune.name
                                        }, rune.id, false, {
                                            fileName: "[project]/app/create-build/page.tsx",
                                            lineNumber: 324,
                                            columnNumber: 19
                                        }, this))
                                ]
                            }, idx, true, {
                                fileName: "[project]/app/create-build/page.tsx",
                                lineNumber: 311,
                                columnNumber: 15
                            }, this);
                        })
                    }, void 0, false, {
                        fileName: "[project]/app/create-build/page.tsx",
                        lineNumber: 297,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-lg font-semibold",
                        children: "Select Shards"
                    }, void 0, false, {
                        fileName: "[project]/app/create-build/page.tsx",
                        lineNumber: 334,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-1 sm:grid-cols-3 gap-2",
                        children: [
                            SHARD_ROW_1,
                            SHARD_ROW_2,
                            SHARD_ROW_3
                        ].map((row, i)=>{
                            const name = [
                                "shard_offense",
                                "shard_flex",
                                "shard_defense"
                            ][i];
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                value: form[name],
                                onChange: (e)=>setForm((prev)=>({
                                            ...prev,
                                            [name]: e.target.value
                                        })),
                                className: "p-2 bg-gray-800 rounded",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "",
                                        children: `Shard ${i + 1}`
                                    }, void 0, false, {
                                        fileName: "[project]/app/create-build/page.tsx",
                                        lineNumber: 347,
                                        columnNumber: 17
                                    }, this),
                                    row.map((s)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: s.value,
                                            children: s.label
                                        }, s.value, false, {
                                            fileName: "[project]/app/create-build/page.tsx",
                                            lineNumber: 349,
                                            columnNumber: 19
                                        }, this))
                                ]
                            }, name, true, {
                                fileName: "[project]/app/create-build/page.tsx",
                                lineNumber: 339,
                                columnNumber: 15
                            }, this);
                        })
                    }, void 0, false, {
                        fileName: "[project]/app/create-build/page.tsx",
                        lineNumber: 335,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "submit",
                        className: "bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded text-white",
                        children: "Create Build"
                    }, void 0, false, {
                        fileName: "[project]/app/create-build/page.tsx",
                        lineNumber: 358,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/create-build/page.tsx",
                lineNumber: 122,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/create-build/page.tsx",
        lineNumber: 117,
        columnNumber: 5
    }, this);
}
_s(CreateBuildPage, "47j6QCe2/Sg6hHG/GGetro3DlBk=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = CreateBuildPage;
var _c;
__turbopack_context__.k.register(_c, "CreateBuildPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
}]);

//# sourceMappingURL=app_create-build_page_tsx_7cff29a3._.js.map