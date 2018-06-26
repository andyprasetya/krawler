(window.webpackJsonp=window.webpackJsonp||[]).push([[5],{155:function(t,s,e){"use strict";e.r(s);var a=e(0),n=Object(a.a)({},function(){var t=this,s=t.$createElement,e=t._self._c||s;return e("div",{staticClass:"content"},[t._m(0),e("p",[t._v("In the future we might consider others options to extend krawler like a plugin architecture but for now you can use the following ways to do so.")]),t._m(1),e("p",[t._v("In order to keep krawler generic "),e("a",{attrs:{href:"./SERVICES.MD"}},[t._v("all services")]),t._v(" are not tied to specific implementations. As a consequence, each time a create operation is run on a service it expects as input a "),e("code",[t._v("type")]),t._v(" and "),e("code",[t._v("options")]),t._v(" parameters used to delegate the actual instanciation to a user-registered construction function. The "),e("a",{attrs:{href:"https://github.com/kalisio/krawler/blob/master/src/services/service.js",target:"_blank",rel:"noopener noreferrer"}},[t._v("base service"),e("OutboundLink")],1),t._v(" class is used to implement this behaviour on all our services, to register a new constructor:")]),t._m(2),e("p",[t._v("The type of the created entity depends on the service being extended:")]),e("ul",[e("li",[t._v("a store constructor should return an "),e("a",{attrs:{href:"https://github.com/maxogden/abstract-blob-store",target:"_blank",rel:"noopener noreferrer"}},[t._v("abstract-blob-store"),e("OutboundLink")],1),t._v(" object,")]),e("li",[t._v("a task constructor should return a "),e("a",{attrs:{href:"https://nodejs.org/api/stream.html",target:"_blank",rel:"noopener noreferrer"}},[t._v("stream"),e("OutboundLink")],1),t._v(" to extract data from that is piped to the target store,")]),e("li",[t._v("a job constructor should return a "),e("a",{attrs:{href:"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise",target:"_blank",rel:"noopener noreferrer"}},[t._v("promise"),e("OutboundLink")],1),t._v(" resolved or rejected when the job is finished or has failed.")])]),e("p",[t._v("If you do not use the services in your app but the CLI mode, you should extend the default services used by the CLI like this:")]),t._m(3),t._m(4),e("p",[t._v("It is possible to add user-registered hook constructor functions like this:")]),t._m(5),t._m(6),t._m(7),e("p",[t._v("A complete example of extension is available in the "),e("a",{attrs:{href:"https://github.com/kalisio/krawler/blob/master/examples/extend/index.js",target:"_blank",rel:"noopener noreferrer"}},[t._v("samples"),e("OutboundLink")],1),t._v(".")])])},[function(){var t=this.$createElement,s=this._self._c||t;return s("h1",{attrs:{id:"extending"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#extending","aria-hidden":"true"}},[this._v("#")]),this._v(" Extending")])},function(){var t=this.$createElement,s=this._self._c||t;return s("h2",{attrs:{id:"extend-services"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#extend-services","aria-hidden":"true"}},[this._v("#")]),this._v(" Extend services")])},function(){var t=this,s=t.$createElement,e=t._self._c||s;return e("div",{staticClass:"language-js extra-class"},[e("pre",{pre:!0,attrs:{class:"language-js"}},[e("code",[t._v("app"),e("span",{attrs:{class:"token punctuation"}},[t._v(".")]),e("span",{attrs:{class:"token function"}},[t._v("service")]),e("span",{attrs:{class:"token punctuation"}},[t._v("(")]),t._v("serviceName"),e("span",{attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n"),e("span",{attrs:{class:"token punctuation"}},[t._v(".")]),e("span",{attrs:{class:"token function"}},[t._v("registerGenerator")]),e("span",{attrs:{class:"token punctuation"}},[t._v("(")]),t._v("typeName"),e("span",{attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),e("span",{attrs:{class:"token punctuation"}},[t._v("(")]),t._v("options"),e("span",{attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),e("span",{attrs:{class:"token operator"}},[t._v("=>")]),t._v(" "),e("span",{attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  "),e("span",{attrs:{class:"token operator"}},[t._v("...")]),t._v("\n  "),e("span",{attrs:{class:"token keyword"}},[t._v("return")]),t._v(" a service entity based on provided options\n"),e("span",{attrs:{class:"token punctuation"}},[t._v("}")]),e("span",{attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n")])])])},function(){var t=this,s=t.$createElement,e=t._self._c||s;return e("div",{staticClass:"language-js extra-class"},[e("pre",{pre:!0,attrs:{class:"language-js"}},[e("code",[e("span",{attrs:{class:"token keyword"}},[t._v("import")]),t._v(" "),e("span",{attrs:{class:"token punctuation"}},[t._v("{")]),t._v(" StoresService"),e("span",{attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" TasksService"),e("span",{attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" JobsService "),e("span",{attrs:{class:"token punctuation"}},[t._v("}")]),t._v(" "),e("span",{attrs:{class:"token keyword"}},[t._v("from")]),t._v(" "),e("span",{attrs:{class:"token string"}},[t._v("'krawler'")]),t._v("\n\nStoresService\n"),e("span",{attrs:{class:"token punctuation"}},[t._v(".")]),e("span",{attrs:{class:"token function"}},[t._v("registerGenerator")]),e("span",{attrs:{class:"token punctuation"}},[t._v("(")]),e("span",{attrs:{class:"token string"}},[t._v("'custom-store'")]),e("span",{attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),e("span",{attrs:{class:"token punctuation"}},[t._v("(")]),t._v("options"),e("span",{attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),e("span",{attrs:{class:"token operator"}},[t._v("=>")]),t._v(" "),e("span",{attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  "),e("span",{attrs:{class:"token operator"}},[t._v("...")]),t._v("\n  "),e("span",{attrs:{class:"token keyword"}},[t._v("return")]),t._v(" a store entity based on provided options\n"),e("span",{attrs:{class:"token punctuation"}},[t._v("}")]),e("span",{attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n")])])])},function(){var t=this.$createElement,s=this._self._c||t;return s("h2",{attrs:{id:"extend-hooks"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#extend-hooks","aria-hidden":"true"}},[this._v("#")]),this._v(" Extend hooks")])},function(){var t=this,s=t.$createElement,e=t._self._c||s;return e("div",{staticClass:"language-js extra-class"},[e("pre",{pre:!0,attrs:{class:"language-js"}},[e("code",[e("span",{attrs:{class:"token keyword"}},[t._v("import")]),t._v(" "),e("span",{attrs:{class:"token punctuation"}},[t._v("{")]),t._v(" hooks "),e("span",{attrs:{class:"token punctuation"}},[t._v("}")]),t._v(" "),e("span",{attrs:{class:"token keyword"}},[t._v("from")]),t._v(" "),e("span",{attrs:{class:"token string"}},[t._v("'krawler'")]),t._v("\n"),e("span",{attrs:{class:"token comment"}},[t._v("// A krawler hook constructor function")]),t._v("\n"),e("span",{attrs:{class:"token keyword"}},[t._v("let")]),t._v(" "),e("span",{attrs:{class:"token function-variable function"}},[t._v("hook")]),t._v(" "),e("span",{attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),e("span",{attrs:{class:"token punctuation"}},[t._v("(")]),t._v("options "),e("span",{attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),e("span",{attrs:{class:"token punctuation"}},[t._v("{")]),e("span",{attrs:{class:"token punctuation"}},[t._v("}")]),e("span",{attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),e("span",{attrs:{class:"token operator"}},[t._v("=>")]),t._v(" "),e("span",{attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  "),e("span",{attrs:{class:"token comment"}},[t._v("// Standard FeathersJS hook function")]),t._v("\n  "),e("span",{attrs:{class:"token keyword"}},[t._v("return")]),t._v(" "),e("span",{attrs:{class:"token punctuation"}},[t._v("(")]),t._v("hook"),e("span",{attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),e("span",{attrs:{class:"token operator"}},[t._v("=>")]),t._v(" "),e("span",{attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),e("span",{attrs:{class:"token operator"}},[t._v("...")]),e("span",{attrs:{class:"token keyword"}},[t._v("do")]),t._v(" something that depends on options\n    "),e("span",{attrs:{class:"token keyword"}},[t._v("return")]),t._v(" hook\n  "),e("span",{attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n"),e("span",{attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\nhooks"),e("span",{attrs:{class:"token punctuation"}},[t._v(".")]),e("span",{attrs:{class:"token function"}},[t._v("registerHook")]),e("span",{attrs:{class:"token punctuation"}},[t._v("(")]),e("span",{attrs:{class:"token string"}},[t._v("'custom'")]),e("span",{attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" hook"),e("span",{attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n")])])])},function(){var t=this.$createElement,s=this._self._c||t;return s("p",[this._v("After that you can use your custom hook like the built-in ones with the "),s("a",{attrs:{href:"./API.MD#command-line-interface"}},[this._v("CLI")]),this._v(".")])},function(){var t=this.$createElement,s=this._self._c||t;return s("h2",{attrs:{id:"complete-example"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#complete-example","aria-hidden":"true"}},[this._v("#")]),this._v(" Complete example")])}],!1,null,null,null);s.default=n.exports}}]);