<%@ Page Title="" Language="C#" MasterPageFile="~/admin/master/page.Master" AutoEventWireup="true" CodeBehind="frameworkmenu.aspx.cs" Inherits="JM.Report.Web.admin.pages.frameworkmenu" %>
<asp:Content ID="Content1" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
    <style>
 
        #menuContainer
        {
        margin-top: 10px;
        }
  </style>
    <link href="../../static/js/fancytree/skin-win8/ui.fancytree.css" rel="stylesheet" />
    <script src="../../static/js/fancytree/jquery.fancytree.js"></script>
    <script src="../../static/js/fancytree/jquery.fancytree.dnd.js"></script>
    
    <div style="margin: 10px;">
        <div style="margin: 0 10px;width: 240px;float:left;min-height: 400px">            
            <div id="menuContainer"></div>
        </div>
        <div style="display: block; overflow:hidden; border: 1px solid #ddd; min-height: 200px;">
            <div>
                <button id="btnAddChildMenu" disabled="disabled">新增子菜单</button>
                <button id="btnAddBrotherMenu" disabled="disabled">新增同级菜单</button>
                <button id="btnAddChildPage" disabled="disabled">新增子页面</button>
                <button onclick="saveMenu()">保存</button>
            </div>
            <div id="menu-edit-container">
                <label>菜单名称：</label>
                <input id="txtmenu-name" maxlength="16"/>                
            </div>
            <div id="page-edit-container" style="display:none;">
                <iframe id="page-edit-frame" width="100%" height="2000" frameborder="0"></iframe>
            </div>
        </div>
    </div>
    <script>
        var menuServer = '../server/menu.aspx';
        var tree;       

        $(function () {
            
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
            var pars = getUrlParams();
            if (pars['id']) loadFrameworkMenu(pars['id']);

            $('button').button();

            //新增子菜单
            $('#btnAddChildMenu').button().click(function () {
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
                menuSelect({ data: { id: 1, obj: { PageId: 0, ParentId: activeNode.data.id } } });
            });
        });

        var menuCache = {};
        //加载业务菜单
        function loadMenus(id, callback) {
            if (menuCache[id]) callback(menuCache[id]);
            else {
                request(menuServer + '?cmd=getmenu', { id: id, t: 1 }, function (data, ex) {

                    if (data) {
                        if (typeof data == 'string') data = JSON.parse(data);
                        //menuCache[id] = data;
                        callback && callback(data);
                    }
                    else callback && callback(null);
                });
            }
        }

        var currentFrameworkId = 0;
        //选择不同的业务，重新拉取菜单
        function loadFrameworkMenu(id) {
            id = id || currentFrameworkId;
            loadMenus(id, function (menus) {
                if (menus) {
                    currentFrameworkId = id;
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
                            folder: ms[i].PageId ? false : true,
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
                        request(menuServer + '?cmd=save', { id: 0, name: page.DisplayName, pageid: id, parent: pid, Relegation: 1, RelegationId: currentFrameworkId }, 'post', function (data) {
                            if (Number(data) > 0) {
                                message.success('保存成功');
                                loadFrameworkMenu(currentFrameworkId);//刷新菜单
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
                request(menuServer + '?cmd=save', { id: id, name: name, parent: pid, pageid: 0, Relegation: 1, RelegationId: currentFrameworkId }, 'post', function (data) {
                    if (Number(data) > 0) {
                        message.success('保存成功');
                        menuChange();//刷新菜单
                    }
                });
            }
        }
</script>
</asp:Content>
