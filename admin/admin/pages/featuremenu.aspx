<%@ Page Title="" Language="C#" MasterPageFile="~/admin/master/page.Master" AutoEventWireup="true" CodeBehind="featuremenu.aspx.cs" Inherits="JM.Report.Web.admin.pages.featuremenu" %>
<asp:Content ID="Content1" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">

    <link href="../../static/js/fancytree/skin-win8/ui.fancytree.css" rel="stylesheet" />
    <script src="../../static/js/fancytree/jquery.fancytree.js"></script>
    <script src="../../static/js/fancytree/jquery.fancytree.dnd.js"></script>

    <style>
        .custom-combobox { position: relative;display: inline-block;}
        .custom-combobox-toggle {position: absolute;top: 0;bottom: 0;margin-left: -1px;padding: 0;/* support: IE7 */*height: 1.7em;*top: 0.1em;}
        .custom-combobox-input {margin: 0;padding: 0.3em;}

        #menuContainer{margin-top: 10px;}
        .btnbar{margin:7px 6px 6px 6px;}
        .menu-edit-container{margin:6px;}
        ul.fancytree-container{ border:none 0;}
    </style>
    
    <div style="margin: 10px;">
        <div style="margin:10px; width: 240px; float:left; min-height: 400px">
            <ul class="clearfix">
        <li>
            <label for="selproduction" style=" font-weight:bold;">业务:</label>
            <select id="selproduction">
                <%
                    foreach (var p in productions)
                    { 
               %>
                <option value="<%=p.Id %>"><%=p.DisplayName %></option>
                <%
                    }
                %>
             </select>
        </li>
    </ul>
            <div id="menuContainer"></div>
        </div>
        <div style="display: block; overflow:hidden; border-left: 1px dotted #ddd; min-height: 200px;">
            <div class="btnbar">
                <button id="btnAddChildMenu" disabled="disabled">新增子菜单</button>
                <button id="btnAddBrotherMenu" disabled="disabled">新增同级菜单</button>
                <button id="btnAddChildPage" disabled="disabled">新增子页面</button>
                <button onclick="saveMenu()">保存</button>
            </div>

            <%--<div id="menu-edit-container" class="menu-edit-container">
                <label>菜单名称：</label>
                <input id="txtmenu-name" maxlength="16"/>                
            </div>--%>
            <fieldset id="menu-edit-container" class="edit-field">
                <legend>菜单信息</legend>
                <p>
                    <label>菜单名称：</label>
                    <input type="text" id="txtmenu-name" maxlength="16" class="txt xl" />
                </p>
            </fieldset>


            <div id="page-edit-container" style="display:none;">
                <iframe id="page-edit-frame" width="100%" height="1000" style="overflow :hidden" frameborder="0"></iframe>
            </div>
        </div>
    </div>
    <script>
        var menuServer = '../server/menu.aspx';
        var tree;
        (function ($) {
            $.widget("custom.combobox", {
                _create: function () {
                    this.wrapper = $("<span>")
                      .addClass("custom-combobox")
                      .insertAfter(this.element);

                    this.element.hide();
                    this._createAutocomplete();
                    this._createShowAllButton();
                },

                _createAutocomplete: function () {
                    var selected = this.element.children(":selected"),
                      value = selected.val() ? selected.text() : "";

                    this.input = $("<input>")
                      .appendTo(this.wrapper)
                      .val(value)
                      .attr("title", "")
                      .addClass("custom-combobox-input ui-widget ui-widget-content ui-state-default ui-corner-left")
                      .autocomplete({
                          delay: 0,
                          minLength: 0,
                          select: function (event, ui) {                              
                              menuChange(ui.item.option.value);
                          },
                          source: $.proxy(this, "_source")
                      })
                      .tooltip({
                          tooltipClass: "ui-state-highlight"
                      });

                    this._on(this.input, {
                        autocompleteselect: function (event, ui) {
                            ui.item.option.selected = true;
                            this._trigger("select", event, {
                                item: ui.item.option
                            });
                        },

                        autocompletechange: "_removeIfInvalid"
                    });
                },

                _createShowAllButton: function () {
                    var input = this.input,
                      wasOpen = false;

                    $("<a>")
                      .attr("tabIndex", -1)
                      .attr("title", "Show All Items")
                      .tooltip()
                      .appendTo(this.wrapper)
                      .button({
                          icons: {
                              primary: "ui-icon-triangle-1-s"
                          },
                          text: false
                      })
                      .removeClass("ui-corner-all")
                      .addClass("custom-combobox-toggle ui-corner-right")
                      .mousedown(function () {
                          wasOpen = input.autocomplete("widget").is(":visible");
                      })
                      .click(function () {
                          input.focus();

                          // Close if already visible
                          if (wasOpen) {
                              return;
                          }

                          // Pass empty string as value to search for, displaying all results
                          input.autocomplete("search", "");
                      });
                },

                _source: function (request, response) {
                    var matcher = new RegExp($.ui.autocomplete.escapeRegex(request.term), "i");
                    response(this.element.children("option").map(function () {
                        var text = $(this).text();
                        if (this.value && (!request.term || matcher.test(text)))
                            return {
                                label: text,
                                value: text,
                                option: this
                            };
                    }));
                },

                _removeIfInvalid: function (event, ui) {

                    // Selected an item, nothing to do
                    if (ui.item) {
                        return;
                    }

                    // Search for a match (case-insensitive)
                    var value = this.input.val(),
                      valueLowerCase = value.toLowerCase(),
                      valid = false;
                    this.element.children("option").each(function () {
                        if ($(this).text().toLowerCase() === valueLowerCase) {
                            this.selected = valid = true;
                            return false;
                        }
                    });

                    // Found a match, nothing to do
                    if (valid) {
                        return;
                    }

                    // Remove invalid value
                    /*this.input
                      .val("")
                      .attr("title", value + " didn't match any item")
                      .tooltip("open");
                    this.element.val("");
                    this._delay(function () {
                        this.input.tooltip("close").attr("title", "");
                    }, 2500);*/
                    this.input.autocomplete("instance").term = "";
                },

                _destroy: function () {
                    this.wrapper.remove();
                    this.element.show();
                }
            });
        })(jQuery);

        $(function () {
            $("#selproduction").combobox({width: 120});

            tree = $("#menuContainer").fancytree({
                extensions: ["dnd"],
                dnd: {
                    autoExpandMS: 400,
                    focusOnClick: true,
                    preventVoidMoves: true, // Prevent dropping nodes 'before self', etc.
                    preventRecursiveMoves: true, // Prevent dropping nodes on own descendants
                    dragStart: function (node, data) {
                        /** This function MUST be defined to enable dragging for the tree.
                         *  Return false to cancel dragging of node.
                         */
                        if (node.data.id <= 0) return false;
                        return true;
                    },
                    dragEnter: function (node, data) {
                        /** data.otherNode may be null for non-fancytree droppables.
                         *  Return false to disallow dropping on node. In this case
                         *  dragOver and dragLeave are not called.
                         *  Return 'over', 'before, or 'after' to force a hitMode.
                         *  Return ['before', 'after'] to restrict available hitModes.
                         *  Any other return value will calc the hitMode from the cursor position.
                         */
                        // Prevent dropping a parent below another parent (only sort
                        // nodes under the same parent)
                        /*           if(node.parent !== data.otherNode.parent){
                                    return false;
                                  }
                                  // Don't allow dropping *over* a node (would create a child)
                                  return ["before", "after"];
                        */
                        //只有是目录才能放入菜单                        
                        //return (node.folder);
                        //console.error(node);
                        //console.error(data.hitMode)
                        if (node.data.id <= 0) return false;
                        return true;
                    },
                    dragDrop: function (node, data) {
                        /** This function MUST be defined to enable dropping of items on
                         *  the tree.
                         */
                        //如果目标项为目录，则可以移
                        //如果不是目录，则只有在前后可以，当over时不能放置，页面是不能有子菜单的
                        if (!node.folder && data.hitMode == 'over') {
                            return false;
                        }
                        debugger;
                        var ms = [];
                        //表示加到子菜单中，把序号设为第一个
                        if (data.hitMode == 'over') {
                            /*for (var i = 0; i < node.children.length; i++) {
                                var n = node.children[i];
                                var m = {
                                    Id: n.data.id,
                                    ParentId: node.data.id,
                                    Seq: i
                                };
                                ms.push(m);
                            }*/
                            ms.push({
                                Id: data.otherNode.data.id,
                                ParentId: node.data.id,
                                Seq: i
                            });
                        }
                            //同级，则更新同级菜单序号
                        else {
                            var seq = 1;
                            var needseq = 0;//是否需要更新序号，只有在当前后面的菜单需要更新序号
                            for (var i = 0; i < node.parent.children.length; i++) {
                                var n = node.parent.children[i];
                                //如果为当前节点
                                if (n.data.id == n.data.id) {
                                    needseq = 1;
                                    var otherseq = 0;
                                    var srcseq = 0;
                                    //插入当前前面，则先放入移动的菜单
                                    if (data.hitMode == 'before') {
                                        otherseq = seq;
                                        seq++;
                                        srcseq = seq;                                        
                                    }
                                    //插入后面的话先放入目标菜单
                                    else {                                        
                                        srcseq = seq;
                                        seq++;
                                        otherseq = seq;                                        
                                    }
                                    ms.push({
                                        Id: n.data.id,
                                        ParentId: node.parent.data.id,
                                        Seq: srcseq
                                    });
                                    ms.push({
                                        Id: data.otherNode.data.id,
                                        ParentId: node.parent.data.id,
                                        Seq: otherseq
                                    });
                                }
                                else if (needseq) {
                                    var m = {
                                        Id: n.data.id,
                                        ParentId: node.parent.data.id,
                                        Seq: seq
                                    };
                                    ms.push(m);
                                }                                
                                seq++;
                            }
                        }
                        //console.log(data);

                        var par = {
                            menus: JSON.stringify(ms)
                        };
                        debugger;
                        var waiting = message.showWaiting('移动菜单中，请稍候...');
                        //移动菜单项
                        request(menuServer + '?cmd=move', par, function (ret, ex) {
                            waiting.close();
                            if (ret) {
                                data.otherNode.moveTo(node, data.hitMode);
                                message.success('移动菜单成功')
                            }
                            else {
                                console.log('移动菜单失败')
                            }
                        });
                    }
                },
                activate: function (event, data) {
                    menuSelect(data.node);
                },
                selectMode: 1,
                source: []
            }).fancytree("getTree");

            //如果默认有业务。则加载其菜单
            var pid = $("#selproduction").val();
            if (pid) menuChange(pid);

            $('button').button();

            //新增子菜单
            $('#btnAddChildMenu').button().click(function() {
                var activeNode = tree.getActiveNode();
                //新增子菜单
                editMenu(activeNode.data.id);
            }); 
            //新增兄弟菜单
            $('#btnAddBrotherMenu').button().click(function () {
                var activeNode = tree.getActiveNode();
                //新增子菜单
                editMenu(activeNode.parent.data.id);
            });
            //新增子页面
            $('#btnAddChildPage').button().click(function () {
                var activeNode = tree.getActiveNode();
                $('#page-edit-container').attr('data-parent', activeNode.data.id);
                //新增子菜单
                menuSelect({ data: {id:1, obj: { PageId: 0, ParentId: activeNode.data.id } } });
            });
        });

        var menuCache = {};
        //加载业务菜单
        function loadMenus(id,callback) {
            if (menuCache[id]) callback(menuCache[id]);
            else {
                request(menuServer + '?cmd=getmenu', { id: id,t: 0 }, function (data, ex) {

                    if (data) {
                        if (typeof data == 'string') data = JSON.parse(data);
                        //menuCache[id] = data;
                        callback && callback(data);
                    }
                    else callback && callback(null);
                });
            }
        }

        var currentProductionId = 0;
        //选择不同的业务，重新拉取菜单
        function menuChange(id) {
            id = id || currentProductionId;
            loadMenus(id, function (menus) {
                if (menus) {
                    currentProductionId = id;
                    var root = { id: 0, folder: true, title: '根菜单（不可操作）', children: [] };
                    var menu = { id: 0, children: [root] }
                    initMenuData(menus, root);
                    var tree = $("#menuContainer").fancytree('getTree');
                    tree.reload(menu.children);
                    $("#menuContainer").fancytree("getRootNode").visit(function (node) {
                        node.setExpanded(true);
                    });
                }
                else $('#menuContainer').html('暂无菜单');
            });
        }

        //递归生成菜单树
        function initMenuData(ms, parent) {
            if (ms) {
                for (var i = 0; i < ms.length; i++) {
                    if (ms[i].ParentId == parent.id) {
                        var m = {
                            id: ms[i].Id,
                            folder: ms[i].PageId? false: true,
                            title: $.trim(ms[i].DisplayName),
                            obj: ms[i],
                            children: []
                        }                        
                        parent.children.push(m);
                        initMenuData(ms, m);
                    }
                }
            }
        }

    //菜单被选中
        function menuSelect(node) {
            console.log(node);
            if (node.data.id <= 0) {                
                $('#btnAddChildMenu,#btnAddChildPage').button("option", "disabled", false);
                $('#btnAddBrotherPage').button("option", "disabled", true);
                $('#page-edit-container,#menu-edit-container').hide();
                return false;
            }
            if (node.folder) {
                $('#btnAddChildMenu,#btnAddChildPage').button("option", "disabled", false);
                $('#page-edit-container').hide();
                $('#menu-edit-container').show();
                editMenu(node.data.obj);
            }
            else {
                $('#btnAddChildMenu,#btnAddBrotherMenu,#btnAddChildPage').button("option", "disabled", true);
                $('#page-edit-container').show();
                $('#menu-edit-container').hide();
                $('#page-edit-container').attr('data-pageid', node.data.obj.PageId);
                $('#page-edit-container>iframe').attr('src', 'editpage.aspx?id=' + node.data.obj.PageId);
            }
            if (window.top != window && window.top.resetHieght) {
                window.top.resetHieght($(document).height() + 10);
            }
        }

        //编辑菜单
        function editMenu(menu) {
            var parentid = 0;
            if (typeof menu == 'number') {
                parentid = menu;
                menu = null;
            }
            menu = menu || {
                Id: 0,
                ParentId: parentid,
                DisplayName: ''
            };
            $('#menu-edit-container').show(); 
            $('#menu-edit-container').attr('data-id', menu.Id);
            $('#menu-edit-container').attr('data-parent', menu.ParentId);
            $('#txtmenu-name').val(menu.DisplayName);
        }

        //保存菜单
        function saveMenu(callback) {
            //表示编辑页面
            if ($('#page-edit-container').css('display') != 'none') {
                var pageid = $('#page-edit-container').attr('data-pageid');
                $('#page-edit-frame')[0].contentWindow.save(function (id, page) {
                    if (pageid == 0) {
                        var pid = $('#page-edit-container').attr('data-parent');
                        request(menuServer + '?cmd=save', { id: 0, name: page.DisplayName, pageid:id, parent: pid, Relegation: 0, RelegationId: currentProductionId }, 'post', function (data) {
                            if (Number(data) > 0) {
                                message.success('保存成功');
                                menuChange();//刷新菜单
                            }
                        });
                    }
                });
            }
            else {
                var id = $('#menu-edit-container').attr('data-id') || 0
                var pid = $('#menu-edit-container').attr('data-parent') || 0
                var name = $.trim($('#txtmenu-name').val());
                if (!name) {
                    message.warning('菜单名不可为空');
                    $('#txtmenu-name').focus();
                    return false;
                }
                request(menuServer + '?cmd=save', { id: id, name: name, parent: pid, pageid: 0, Relegation: 0, RelegationId: currentProductionId }, 'post', function (data) {
                    if (Number(data) > 0) {
                        message.success('保存成功');
                        menuChange();//刷新菜单
                    }
                });
            }
        }

        //window.setInterval(function () {
        //    var f = document.getElementById('page-edit-frame');
        //    if (f.contentWindow) {
        //        var win = f.contentWindow;
        //        var fHtml = win.document.documentElement;
        //        var fBody = win.document.body;


        //        // 获取高度 
        //        if (fBody && fBody.offsetHeight) {
        //            var height = fBody.offsetHeight;
        //            f.setAttribute('height', height);
        //        }
        //    }

        //}, 500);
</script>
</asp:Content>
