/* jQuery File Tree. Authors - Cory S.N. LaViska & Dave Rogers. Copyright 2008 A Beautiful Site, LLC. - Adapted by Bergware for use in Unraid */
jQuery && function(e) {
	e.extend(e.fn, {
		fileTree: function(i, t, l) {
				// Initialize pickexclude with an empty string if not provided
				void 0 === i.root && (i.root = "/mnt/"),
				void 0 === i.top && (i.top = "/mnt/"),
				void 0 === i.filter && (i.filter = ""),
				void 0 === i.match && (i.match = ".*"),
				void 0 === i.script && (i.script = "/webGui/include/FileTree.php"),
				void 0 === i.folderEvent && (i.folderEvent = "click"),
				void 0 === i.expandSpeed && (i.expandSpeed = 300),
				void 0 === i.collapseSpeed && (i.collapseSpeed = 300),
				void 0 === i.expandEasing && (i.expandEasing = null),
				void 0 === i.collapseEasing && (i.collapseEasing = null),
				void 0 === i.multiFolder && (i.multiFolder = !1),
				void 0 === i.loadMessage && (i.loadMessage = "Loading..."),
				void 0 === i.multiSelect && (i.multiSelect = !1),
				void 0 === i.allowBrowsing && (i.allowBrowsing = !1),
				void 0 === i.pickexclude && (i.pickexclude = "");
				e(this).each(function() {
					function s(r, n, o) {
						e(r).addClass("wait"),
							e(".jqueryFileTree.start").remove(),
							/* Modify the post data to include pickexclude. */
							e.post(i.script, {
								dir: n,
								root: i.top,
								multiSelect: i.multiSelect,
								filter: i.filter,
								match: i.match,
								show_parent: o,
								/* Add pickexclude parameter. */
								pickexclude: i.pickexclude
							}).done(function(o) {
								var d;
								e(r).find(".start").html(""),
									e(r).removeClass("wait").append(o),
									i.root == n ? e(r).find("UL:hidden").show() : e(r).find("UL:hidden").slideDown({
										duration: i.expandSpeed,
										easing: i.expandEasing
									}),
									e(d = r).find("LI A").on(i.folderEvent, function(r) {
										r.preventDefault();
										var n = {};
										return n.li = e(this).closest("li"),
											n.type = n.li.hasClass("directory") ? "directory" : "file",
											n.value = e(this).text(),
											n.rel = e(this).prop("rel"),
											".." == e(this).text() ? (i.root = n.rel, l && l(e(this).attr("rel")), a(e(this), "filetreefolderclicked", n), root = e(this).closest("ul.jqueryFileTree"), root.html('<ul class="jqueryFileTree start"><li class="wait">' + i.loadMessage + "<li></ul>"), s(e(root), i.root, i.allowBrowsing)) : e(this).parent().hasClass("directory") ? (e(this).parent().hasClass("collapsed") ? (a(e(this), "filetreeexpand", n), i.multiFolder || (e(this).parent().parent().find("UL").slideUp({
												duration: i.collapseSpeed,
												easing: i.collapseEasing
											}), e(this).parent().parent().find("LI.directory").removeClass("expanded").addClass("collapsed")), e(this).parent().removeClass("collapsed").addClass("expanded"), e(this).parent().find("UL").remove(), s(e(this).parent(), e(this).attr("rel").match(/.*\//)[0], !1)) : (a(e(this), "filetreecollapse", n), e(this).parent().find("UL").slideUp({
												duration: i.collapseSpeed,
												easing: i.collapseEasing
											}), e(this).parent().removeClass("expanded").addClass("collapsed"), a(e(this), "filetreecollapsed", n)), l && l(e(this).attr("rel")), a(e(this), "filetreefolderclicked", n)) : (t && t(e(this).attr("rel")), a(e(this), "filetreeclicked", n)), !1
									}),
									"click" != i.folderEvent.toLowerCase && e(d).find("LI A").on("click", function(e) {
										return e.preventDefault(), !1
									}),
									a(e(this), "filetreeexpanded", o)
							}).fail(function() {
								e(r).find(".start").html(""),
									e(r).removeClass("wait").append("<li>Unable to get file tree information</li>")
							})
					}

					function a(e, i, t) {
						t.trigger = i,
							e.trigger(i, t)
					}
					e(this).html('<ul class="jqueryFileTree start"><li class="wait">' + i.loadMessage + "<li></ul>"),
						s(e(this), i.root, i.allowBrowsing),
						e(this).on("change", "input:checkbox", function() {
							var i = {};
							i.li = e(this).closest("li"),
								i.type = i.li.hasClass("directory") ? "directory" : "file",
								i.value = i.li.children("a").text(),
								i.rel = i.li.children("a").prop("rel"),
								i.li.find("input:checkbox").prop("checked", e(this).prop("checked")),
								e(this).prop("checked") ? a(e(this), "filetreechecked", i) : a(e(this), "filetreeunchecked", i)
						})
				})
		},
		fileTreeAttach: function(i, t, l) {
			var s = {};
			e.isFunction(i) ? (e.isFunction(t) && (l = t), t = i) : i && e.extend(s, i),
				e(this).each(function() {
					var i = e(this),
						a = e.extend({}, s, i.data()),
						r = i.next(".fileTree");
					0 === r.length && (e(document).mousedown(function(i) {
							var t = e(".fileTree");
							t.is(i.target) || 0 !== t.has(i.target).length || t.slideUp("fast")
						}),
						r = e("<div>", {
							class: "textarea fileTree"
						}),
						i.after(r)),
						i.click(function() {
							r.is(":visible") ? r.slideUp("fast") : ("" === r.html() && (r.html('<span style="padding-left: 20px"><img src="/webGui/images/spinner.gif"> Loading...</span>'),
									r.fileTree({
										root: a.pickroot,
										top: a.picktop,
										filter: (a.pickfilter || "").split(","),
										match: a.pickmatch || ".*",
										/* Include pickexclude parameter in fileTreeAttach. */
										pickexclude: a.pickexclude
									}, e.isFunction(t) ? t : function(e) {
										i.val(e).change(),
											a.hasOwnProperty("pickcloseonfile") && r.slideUp("fast")
									}, e.isFunction(l) ? l : function(e) {
										a.hasOwnProperty("pickfolders") && i.val(e).change()
									})),
								r.offset({
									left: i.position().left
								}),
								r.slideDown("fast"))
						})
				})
		}
	})
}(jQuery);
